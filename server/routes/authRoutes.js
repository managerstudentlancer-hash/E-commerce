const express = require('express');
const router = express.Router();
const {
  register,
  login,
  googleLogin,
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
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');
const { checkBruteForce, sanitizeAuthInputs } = require('../middleware/securityMiddleware');

router.post('/register', sanitizeAuthInputs, register);
router.post('/login', sanitizeAuthInputs, checkBruteForce, login);
router.post('/google-login', sanitizeAuthInputs, googleLogin);
router.post('/admin-login', sanitizeAuthInputs, checkBruteForce, adminLogin);
router.post('/admin-forgot-password', sanitizeAuthInputs, adminForgotPassword);
router.post('/admin-reset-password', sanitizeAuthInputs, adminResetPassword);
router.post('/send-otp', sanitizeAuthInputs, sendOtp);
router.post('/verify-otp', sanitizeAuthInputs, verifyOtp);
router.post('/logout', logout);
router.get('/me', protect, getMe);

router.put('/profile', protect, updateProfile);
router.post('/profile-photo', protect, upload.single('photo'), uploadProfilePhoto);
router.delete('/profile-photo', protect, removeProfilePhoto);

// Saved Addresses
router.post('/addresses', protect, addAddress);
router.put('/addresses/:addressId', protect, updateAddress);
router.delete('/addresses/:addressId', protect, deleteAddress);
router.put('/addresses/:addressId/default', protect, setDefaultAddress);

// Sell on VEXIVO / Seller Activation
router.post('/activate-seller', protect, activateSeller);

router.put('/password', protect, changePassword);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
