const express = require('express');
const router = express.Router();
const { handleRazorpayXWebhook } = require('../controllers/deliveryPayoutController');

// RazorpayX Payouts Webhook (HMAC SHA-256 signature verified)
router.post('/razorpayx', handleRazorpayXWebhook);

module.exports = router;
