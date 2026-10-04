const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth, protect } = require('../middleware/auth');

// Public / optionally authenticated AI conversation endpoint
router.post('/chat', optionalAuth, aiController.chat);

// Initial assistant state & quick prompts
router.get('/welcome', optionalAuth, aiController.getWelcome);

// Order actions triggered with user confirmation
router.post('/cancel-order', protect, aiController.cancelOrderAction);
router.post('/return-order', protect, aiController.returnOrderAction);

module.exports = router;
