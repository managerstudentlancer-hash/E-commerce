const express = require('express');
const router = express.Router();
const { subscribe, getSubscribers } = require('../controllers/newsletterController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/subscribe', subscribe);
router.get('/subscribers', protect, adminOnly, getSubscribers);

module.exports = router;
