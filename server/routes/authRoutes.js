const express = require('express');
const router = express.Router();
const {
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
  sendOtp,
  verifyOtp,
} = require('../controllers/authController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.post('/register', register);
router.post('/login', login);
router.post('/admin-login', adminLogin);
router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
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
