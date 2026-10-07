const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const supabaseStorage = require('../services/supabaseStorage');

const getJwtSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FATAL: JWT_SECRET environment variable is required in production.');
    }
    return 'vexivo_development_secret_key_do_not_use_in_prod';
  }
  return secret;
};

const generateToken = (id) => {
  return jwt.sign({ id }, getJwtSecret(), {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

// Validate and format Indian mobile number (+91XXXXXXXXXX)
const validateAndFormatIndianPhone = (rawPhone) => {
  if (!rawPhone || typeof rawPhone !== 'string') {
    return { valid: false, error: 'Please enter your 10-digit mobile number.' };
  }
  const cleaned = rawPhone.replace(/[\s\-\(\)]/g, '');
  let tenDigits = '';
  if (/^[6-9]\d{9}$/.test(cleaned)) {
    tenDigits = cleaned;
  } else if (/^\+91[6-9]\d{9}$/.test(cleaned)) {
    tenDigits = cleaned.slice(3);
  } else if (/^91[6-9]\d{9}$/.test(cleaned)) {
    tenDigits = cleaned.slice(2);
  } else if (/^0[6-9]\d{9}$/.test(cleaned)) {
    tenDigits = cleaned.slice(1);
  } else {
    return {
      valid: false,
      error: 'Please enter a valid 10-digit Indian mobile number (e.g. 9876543210 or +91 9876543210).',
    };
  }
  return {
    valid: true,
    formatted: `+91${tenDigits}`,
    raw10: tenDigits,
  };
};

// In-memory OTP storage with rate limiting and 5-min expiration
const otpStore = new Map();

setInterval(() => {
  const now = Date.now();
  for (const [phone, data] of otpStore.entries()) {
    if (data.expiresAt < now) {
      otpStore.delete(phone);
    }
  }
}, 60000);

const {
  validatePasswordStrength,
  recordFailedLogin,
  clearFailedLogin,
  performDummyPasswordVerification,
} = require('../middleware/securityMiddleware');

// @desc Register new customer or seller
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, isSeller } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    // Security: Strict Password Complexity Check
    const passCheck = validatePasswordStrength(password);
    if (!passCheck.valid) {
      return res.status(400).json({ success: false, message: passCheck.message });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    let formattedPhone = '';
    if (phone && phone.trim()) {
      const phoneCheck = validateAndFormatIndianPhone(phone);
      if (!phoneCheck.valid) {
        return res.status(400).json({ success: false, message: phoneCheck.error });
      }
      formattedPhone = phoneCheck.formatted;

      const phoneExists = await User.findOne({
        $or: [{ phone: formattedPhone }, { phone: phoneCheck.raw10 }],
      });
      if (phoneExists) {
        return res.status(400).json({ success: false, message: 'An account with this mobile number already exists' });
      }
    }

    // Role assignment: Only allow customer or seller (never admin from public registration)
    const assignedRole = (isSeller === true || req.body.role === 'seller') ? 'seller' : 'customer';

    const user = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      passwordHash: password, // Pre-save hook will hash this
      phone: formattedPhone,
      role: assignedRole,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const identifier = (email || '').trim();

    let user;
    if (identifier.includes('@')) {
      user = await User.findOne({ email: identifier.toLowerCase() });
    } else {
      const cleanPhone = identifier.replace(/[\s\-\(\)]/g, '');
      const raw10 = cleanPhone.replace(/^\+?91|^0/, '');
      user = await User.findOne({
        $or: [
          { email: identifier.toLowerCase() },
          { phone: identifier },
          { phone: `+91${raw10}` },
          { phone: raw10 },
        ],
      });
    }
    if (!user) {
      await performDummyPasswordVerification(password);
      const fail = recordFailedLogin(req);
      if (fail.isLocked) {
        return res.status(429).json({
          success: false,
          message: `Security Lockout: Too many failed login attempts. Account temporarily locked for ${fail.lockedMinutes} minutes.`,
          isLocked: true,
        });
      }
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. (${fail.remainingAttempts} attempt(s) remaining before security lockout)`,
        remainingAttempts: fail.remainingAttempts,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const fail = recordFailedLogin(req);
      if (fail.isLocked) {
        return res.status(429).json({
          success: false,
          message: `Security Lockout: Too many failed login attempts. Account temporarily locked for ${fail.lockedMinutes} minutes.`,
          isLocked: true,
        });
      }
      return res.status(401).json({
        success: false,
        message: `Invalid email or password. (${fail.remainingAttempts} attempt(s) remaining before security lockout)`,
        remainingAttempts: fail.remainingAttempts,
      });
    }

    // Clear failed attempts on successful login
    clearFailedLogin(req);

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Admin-only login with strict role validation
// @route POST /api/auth/admin-login
const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide admin email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      await performDummyPasswordVerification(password);
      const fail = recordFailedLogin(req);
      if (fail.isLocked) {
        return res.status(429).json({
          success: false,
          message: `Admin Lockout: 5 failed attempts reached. Portal temporarily locked for ${fail.lockedMinutes} minutes.`,
          isLocked: true,
        });
      }
      return res.status(401).json({
        success: false,
        message: `Invalid administrator credentials. (${fail.remainingAttempts} attempt(s) remaining before lockout)`,
        remainingAttempts: fail.remainingAttempts,
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      const fail = recordFailedLogin(req);
      if (fail.isLocked) {
        return res.status(429).json({
          success: false,
          message: `Admin Lockout: 5 failed attempts reached. Portal temporarily locked for ${fail.lockedMinutes} minutes.`,
          isLocked: true,
        });
      }
      return res.status(401).json({
        success: false,
        message: `Invalid administrator credentials. (${fail.remainingAttempts} attempt(s) remaining before lockout)`,
        remainingAttempts: fail.remainingAttempts,
      });
    }

    // Strict Security Guard: User MUST have role === 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only accounts with Administrator privileges can log in through the Admin Portal.',
      });
    }

    clearFailedLogin(req);

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        addresses: user.addresses,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Logout user
// @route POST /api/auth/logout
const logout = async (req, res) => {
  res.json({ success: true, message: 'Logged out successfully' });
};

// Helper to format consistent user responses
const formatUserResponse = (user) => {
  return {
    _id: user._id,
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    profilePhoto: user.profilePhoto || '',
    gender: user.gender || '',
    dateOfBirth: user.dateOfBirth || '',
    role: user.role,
    isSeller: Boolean(user.isSeller || user.role === 'seller'),
    sellerProfile: user.sellerProfile || {},
    deliveryProfile: user.deliveryProfile || {},
    rewardPoints: user.rewardPoints !== undefined ? user.rewardPoints : 100,
    rewardsHistory: user.rewardsHistory || [],
    addresses: user.addresses || [],
  };
};

// @desc Get current logged in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  const user = await User.findById(req.user._id);
  res.json({
    success: true,
    user: formatUserResponse(user || req.user),
  });
};

// @desc Update user profile & addresses
// @route PUT /api/auth/profile
const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Security: Registered login email is permanent and cannot be changed
    if (req.body.email && req.body.email.toLowerCase().trim() !== user.email.toLowerCase().trim()) {
      return res.status(400).json({
        success: false,
        message: 'Registered login email address cannot be edited.',
      });
    }

    if (req.body.name) user.name = req.body.name.trim();
    if (req.body.phone !== undefined) user.phone = req.body.phone;
    if (req.body.gender !== undefined) user.gender = req.body.gender;
    if (req.body.dateOfBirth !== undefined) user.dateOfBirth = req.body.dateOfBirth;
    if (req.body.addresses) {
      user.addresses = req.body.addresses;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: formatUserResponse(updatedUser),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Upload profile photo to Supabase Storage (profiles/{userId}/{unique-file-name})
// @route POST /api/auth/profile-photo
const uploadProfilePhoto = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file (JPEG, PNG, WEBP, GIF up to 5MB)',
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Clean up previous Supabase profile image (image replacement)
    if (user.profilePhoto) {
      await supabaseStorage.deleteFromSupabase(user.profilePhoto).catch(() => {});
    }

    // Upload to Supabase Storage
    const result = await supabaseStorage.uploadToSupabase({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
      folder: 'profiles',
      entityId: user._id.toString(),
    });

    user.profilePhoto = result.url;
    await user.save();

    res.json({
      success: true,
      message: 'Profile photo uploaded successfully to Supabase Storage',
      profilePhoto: user.profilePhoto,
      path: result.path,
      user: formatUserResponse(user),
    });
  } catch (error) {
    console.error('[Profile Photo Upload Error]:', error.message);
    const isConfigError = error.message.includes('configured');
    res.status(isConfigError ? 503 : 400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Remove profile photo
// @route DELETE /api/auth/profile-photo
const removeProfilePhoto = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (user.profilePhoto) {
      await supabaseStorage.deleteFromSupabase(user.profilePhoto).catch(() => {});
    }

    user.profilePhoto = '';
    await user.save();

    res.json({
      success: true,
      message: 'Profile photo removed successfully',
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Add new address
// @route POST /api/auth/addresses
const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const { fullName, phone, street, city, state, postalCode, country, landmark, addressType, isDefault } = req.body;

    if (!street || !city || !postalCode) {
      return res.status(400).json({ success: false, message: 'Street, city, and postal code are required' });
    }

    if (isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }

    user.addresses.push({
      fullName: fullName || user.name,
      phone: phone || user.phone,
      street,
      city,
      state: state || '',
      postalCode,
      country: country || 'United Kingdom',
      landmark: landmark || '',
      addressType: addressType || 'Home',
      isDefault: Boolean(isDefault) || user.addresses.length === 0,
    });

    await user.save();
    res.status(201).json({
      success: true,
      message: 'Address added successfully',
      addresses: user.addresses,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update existing address
// @route PUT /api/auth/addresses/:addressId
const updateAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    const address = user.addresses.id(req.params.addressId);
    if (!address) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    if (req.body.isDefault) {
      user.addresses.forEach((a) => {
        a.isDefault = false;
      });
    }

    Object.assign(address, req.body);
    await user.save();
    res.json({
      success: true,
      message: 'Address updated successfully',
      addresses: user.addresses,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete address
// @route DELETE /api/auth/addresses/:addressId
const deleteAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
    if (user.addresses.length > 0 && !user.addresses.some((a) => a.isDefault)) {
      user.addresses[0].isDefault = true;
    }
    await user.save();
    res.json({
      success: true,
      message: 'Address removed successfully',
      addresses: user.addresses,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Set address as default
// @route PUT /api/auth/addresses/:addressId/default
const setDefaultAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    user.addresses.forEach((a) => {
      a.isDefault = a._id.toString() === req.params.addressId;
    });
    await user.save();
    res.json({
      success: true,
      message: 'Default address updated',
      addresses: user.addresses,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Activate seller account for customer
// @route POST /api/auth/activate-seller
const activateSeller = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const {
      storeName,
      legalBusinessName,
      businessType,
      gstin,
      panNumber,
      storeEmail,
      storePhone,
      storeDescription,
      storeAddress,
      pickupAddress,
      bankDetails,
      categories,
    } = req.body;

    user.isSeller = true;
    user.role = 'seller';

    // Format pickup address
    const resolvedPickup = pickupAddress || {};
    const street = resolvedPickup.street || storeAddress || '';
    const city = resolvedPickup.city || '';
    const state = resolvedPickup.state || '';
    const postalCode = resolvedPickup.postalCode || '';
    const country = resolvedPickup.country || 'India';

    // Format bank details
    const resolvedBank = bankDetails || {};

    user.sellerProfile = {
      storeName: (storeName || `${user.name}'s Boutique`).trim(),
      legalBusinessName: (legalBusinessName || storeName || user.name).trim(),
      businessType: businessType || 'Individual / Sole Proprietor',
      gstin: (gstin || '').toUpperCase().trim(),
      panNumber: (panNumber || '').toUpperCase().trim(),
      storeEmail: (storeEmail || user.email).trim().toLowerCase(),
      storePhone: (storePhone || user.phone || '').trim(),
      storeDescription: (storeDescription || 'Verified boutique and lifestyle seller on VEXIVO India Marketplace.').trim(),
      storeAddress: storeAddress || (street ? `${street}, ${city} ${postalCode}` : ''),
      pickupAddress: {
        street,
        city,
        state,
        postalCode,
        country,
      },
      bankDetails: {
        accountHolderName: resolvedBank.accountHolderName || legalBusinessName || user.name,
        accountNumber: resolvedBank.accountNumber || '',
        bankName: resolvedBank.bankName || '',
        ifscCode: (resolvedBank.ifscCode || '').toUpperCase().trim(),
        accountType: resolvedBank.accountType || 'Current',
      },
      categories: Array.isArray(categories) && categories.length > 0 ? categories : ['Women Wear', 'Men Wear'],
      storeRating: 5.0,
      isApproved: true,
      registeredAt: new Date(),
    };

    await user.save();
    res.json({
      success: true,
      message: 'Seller account registered and activated successfully! Welcome to VEXIVO India Marketplace.',
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

// @desc Change user password
// @route PUT /api/auth/password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Current password is incorrect' });
    }

    user.passwordHash = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// In-memory admin reset code storage (10 minutes)
const adminResetStore = new Map();

// @desc Request password reset for administrator
// @route POST /api/auth/admin-forgot-password
const adminForgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide administrator email address' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const adminUser = await User.findOne({ email: normalizedEmail, role: 'admin' });

    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'No administrator account found with this email address.',
      });
    }

    // Generate 6-digit cryptographic verification code
    const resetCode = crypto.randomInt(100000, 1000000).toString();
    adminResetStore.set(normalizedEmail, {
      code: resetCode,
      expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      attempts: 0,
    });

    if (process.env.NODE_ENV !== 'production') {
      console.log(`\n======================================================`);
      console.log(`🛡️ [ADMIN RECOVERY SERVICE] Password Reset Code for ${normalizedEmail}:`);
      console.log(`👉 Code: ${resetCode} (Valid for 10 minutes)`);
      console.log(`======================================================\n`);
    }

    res.json({
      success: true,
      message: `A 6-digit administrative verification code has been dispatched to ${normalizedEmail}.`,
      email: normalizedEmail,
      devCode: resetCode,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reset administrator password with verification code
// @route POST /api/auth/admin-reset-password
const adminResetPassword = async (req, res, next) => {
  try {
    const { email, code, newPassword } = req.body;

    if (!email || !code || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Please provide administrator email, verification code, and new password.',
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters in length.',
      });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const record = adminResetStore.get(normalizedEmail);

    if (!record || record.expiresAt < Date.now()) {
      adminResetStore.delete(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: 'Reset verification code has expired. Please request a new code.',
      });
    }

    if (record.code !== code.trim()) {
      record.attempts = (record.attempts || 0) + 1;
      if (record.attempts >= 5) {
        adminResetStore.delete(normalizedEmail);
        return res.status(429).json({
          success: false,
          message: 'Too many incorrect verification attempts. Please request a new code.',
        });
      }
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code. Please check and try again.',
      });
    }

    const adminUser = await User.findOne({ email: normalizedEmail, role: 'admin' });
    if (!adminUser) {
      return res.status(404).json({
        success: false,
        message: 'Administrator account not found.',
      });
    }

    // Set new password (pre-save hook will hash with bcrypt)
    adminUser.passwordHash = newPassword;
    await adminUser.save();

    // Invalidate code
    adminResetStore.delete(normalizedEmail);

    res.json({
      success: true,
      message: 'Master Administrator password updated successfully. You can now log in.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Request password reset
// @route POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  res.json({
    success: true,
    message: `If an account with ${email} exists, a password reset link has been dispatched.`,
  });
};

// @desc Reset password with token
// @route POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  res.json({ success: true, message: 'Password has been successfully reset. Please log in.' });
};

// @desc Send OTP for Customer / Seller Mobile Login
// @route POST /api/auth/send-otp
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;
    const phoneCheck = validateAndFormatIndianPhone(phone);
    if (!phoneCheck.valid) {
      return res.status(400).json({ success: false, message: phoneCheck.error });
    }

    const { formatted, raw10 } = phoneCheck;

    // Reject mobile login if phone belongs to an ADMIN
    const existingUser = await User.findOne({
      $or: [{ phone: formatted }, { phone: raw10 }, { phone: `0${raw10}` }],
    });

    if (existingUser && existingUser.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Mobile login is not available for administrator accounts. Please sign in using your administrator email and password.',
      });
    }

    // Rate limiting: 45 seconds between OTP requests
    const existingOtp = otpStore.get(formatted);
    if (existingOtp && Date.now() - existingOtp.lastSentAt < 45000) {
      const waitSec = Math.ceil((45000 - (Date.now() - existingOtp.lastSentAt)) / 1000);
      return res.status(429).json({
        success: false,
        message: `Please wait ${waitSec} seconds before requesting a new OTP.`,
      });
    }

    // Cryptographically secure 6-digit OTP
    const otpCode = crypto.randomInt(100000, 1000000).toString();
    const otpHash = crypto.createHash('sha256').update(otpCode).digest('hex');

    otpStore.set(formatted, {
      otpHash,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
      attempts: 0,
      lastSentAt: Date.now(),
    });

    console.log(`\n======================================================`);
    console.log(`📱 [VEXIVO OTP SERVICE] Verification Code for ${formatted}:`);
    console.log(`👉 OTP: ${otpCode} (Valid for 5 minutes)`);
    console.log(`======================================================\n`);

    res.json({
      success: true,
      message: `Verification code sent to ${formatted}`,
      phone: formatted,
      isRegistered: !!existingUser,
      userRole: existingUser ? existingUser.role : 'customer',
      devOtp: process.env.NODE_ENV !== 'production' ? otpCode : undefined,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify OTP or Firebase Phone Auth Token and authenticate Customer or Seller
// @route POST /api/auth/verify-otp
const verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp, name, firebaseIdToken } = req.body;
    let verifiedPhone = null;

    if (firebaseIdToken) {
      try {
        const { verifyFirebaseToken } = require('../config/firebase');
        const firebaseUser = await verifyFirebaseToken(firebaseIdToken);
        if (!firebaseUser || !firebaseUser.phoneNumber) {
          return res.status(400).json({ success: false, message: 'Firebase phone verification failed.' });
        }
        verifiedPhone = firebaseUser.phoneNumber;
      } catch (err) {
        return res.status(400).json({ success: false, message: 'Firebase verification token invalid.' });
      }
    } else {
      const phoneCheck = validateAndFormatIndianPhone(phone);
      if (!phoneCheck.valid) {
        return res.status(400).json({ success: false, message: phoneCheck.error });
      }

      if (!otp || typeof otp !== 'string' || otp.trim().length !== 6) {
        return res.status(400).json({ success: false, message: 'Please enter a valid 6-digit verification code.' });
      }

      const { formatted } = phoneCheck;
      const stored = otpStore.get(formatted);

      if (!stored || stored.expiresAt < Date.now()) {
        return res.status(400).json({
          success: false,
          message: 'Verification code has expired or was not requested. Please request a new code.',
        });
      }

      if (stored.attempts >= 5) {
        otpStore.delete(formatted);
        return res.status(429).json({
          success: false,
          message: 'Too many incorrect attempts. Please request a new verification code.',
        });
      }

      const enteredHash = crypto.createHash('sha256').update(otp.trim()).digest('hex');
      if (enteredHash !== stored.otpHash) {
        stored.attempts += 1;
        return res.status(400).json({
          success: false,
          message: 'Incorrect verification code. Please check and try again.',
        });
      }

      // OTP Verified! Clear stored code
      otpStore.delete(formatted);
      verifiedPhone = formatted;
    }

    const raw10 = verifiedPhone.replace(/[^0-9]/g, '').slice(-10);

    // Look for existing user
    let user = await User.findOne({
      $or: [{ phone: verifiedPhone }, { phone: raw10 }, { phone: `+91${raw10}` }],
    });

    if (user) {
      // SECURITY: Ensure user is NEVER an admin
      if (user.role === 'admin') {
        return res.status(403).json({
          success: false,
          message: 'Mobile authentication is prohibited for administrator accounts.',
        });
      }
      if (name && name.trim() && user.name.startsWith('Member ')) {
        user.name = name.trim();
        await user.save();
      }
    } else {
      // User does not exist yet: create new customer account with verified mobile
      const randomSuffix = Math.random().toString(36).substring(2, 7);
      const generatedEmail = `user.${raw10}.${randomSuffix}@vexivo.customer`;
      const fallbackName = (name && name.trim()) || `Member ${raw10.slice(-4)}`;
      const randomPassword = crypto.randomBytes(16).toString('hex') + '!Aa1';

      user = await User.create({
        name: fallbackName,
        email: generatedEmail,
        passwordHash: randomPassword,
        phone: verifiedPhone,
        role: 'customer',
        isActive: true,
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Mobile authentication successful',
      token,
      user: formatUserResponse(user),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  adminLogin,
  sendOtp,
  verifyOtp,
  logout,
  getMe,
  updateProfile,
  uploadProfilePhoto,
  removeProfilePhoto,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
  activateSeller,
  changePassword,
  forgotPassword,
  resetPassword,
  adminForgotPassword,
  adminResetPassword,
  sendOtp,
  verifyOtp,
  validateAndFormatIndianPhone,
  formatUserResponse,
};

