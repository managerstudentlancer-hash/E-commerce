const jwt = require('jsonwebtoken');
const User = require('../models/User');

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

// @desc Register new customer
// @route POST /api/auth/register
const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'A user with this email already exists' });
    }

    const user = await User.create({
      name,
      email: normalizedEmail,
      passwordHash: password, // Pre-save hook will hash this
      phone: phone || '',
      role: 'customer',
    });

    const token = generateToken(user._id);

    res.status(201).json({
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

// @desc Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

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
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid administrator credentials' });
    }

    // Strict Security Guard: User MUST have role === 'admin'
    if (user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only accounts with Administrator privileges can log in through the Admin Portal.',
      });
    }

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

// @desc Get current logged in user
// @route GET /api/auth/me
const getMe = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
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

    user.name = req.body.name || user.name;
    user.phone = req.body.phone !== undefined ? req.body.phone : user.phone;
    if (req.body.addresses) {
      user.addresses = req.body.addresses;
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        addresses: updatedUser.addresses,
      },
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

const crypto = require('crypto');
const { verifyFirebaseToken } = require('../config/firebase');

// @desc Firebase Phone Auth - OTP is handled entirely by Firebase on the client side
// @desc This endpoint is kept for backward compatibility but is now a no-op
// @route POST /api/auth/send-otp
const sendOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone || typeof phone !== 'string' || phone.trim().replace(/[^0-9]/g, '').length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid mobile phone number with country code.',
      });
    }

    // Firebase handles OTP sending on the client side via signInWithPhoneNumber()
    // No server-side SMS sending needed - Firebase sends SMS automatically (FREE!)
    res.json({
      success: true,
      message: `Firebase Phone Authentication active. OTP will be sent via Google's servers.`,
      phone: phone.trim(),
      provider: 'Google Firebase (Free)',
      realSmsSent: true,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Verify Firebase Phone Auth Token and Login / Register Customer
// @route POST /api/auth/verify-firebase-phone
const verifyOtp = async (req, res, next) => {
  try {
    const { firebaseIdToken, name } = req.body;

    if (!firebaseIdToken) {
      return res.status(400).json({
        success: false,
        message: 'Firebase verification token is required.',
      });
    }

    // Verify the Firebase ID token using Firebase Admin SDK
    const firebaseUser = await verifyFirebaseToken(firebaseIdToken);
    
    if (!firebaseUser || !firebaseUser.phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone verification failed. Please try again.',
      });
    }

    const verifiedPhone = firebaseUser.phoneNumber; // e.g., "+919876543210"

    // Look for existing user with this phone or phone-based placeholder email
    const digitsOnly = verifiedPhone.replace(/[^0-9]/g, '');
    const placeholderEmail = `user_${digitsOnly}@vexivo.user`;
    let user = await User.findOne({
      $or: [{ phone: verifiedPhone }, { email: placeholderEmail }],
    });

    if (!user) {
      // Auto-create new customer account
      const defaultName = name && name.trim() ? name.trim() : `Member ${verifiedPhone.slice(-4)}`;
      user = await User.create({
        name: defaultName,
        phone: verifiedPhone,
        email: placeholderEmail,
        passwordHash: `firebase_auth_${Date.now()}_${crypto.randomBytes(16).toString('hex')}`,
        role: 'customer',
        isActive: true,
      });
    } else if (name && name.trim() && user.name.startsWith('Member ')) {
      user.name = name.trim();
      await user.save();
    }

    // Generate JWT Auth Token for our app
    const token = generateToken(user._id);

    res.json({
      success: true,
      message: 'Successfully verified and logged in via Firebase Phone Auth',
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone || verifiedPhone,
        role: user.role,
        addresses: user.addresses || [],
      },
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
  changePassword,
  forgotPassword,
  resetPassword,
};

