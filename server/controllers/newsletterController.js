const NewsletterSubscriber = require('../models/NewsletterSubscriber');

// @desc Subscribe email to newsletter
// @route POST /api/newsletter/subscribe
const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const existing = await NewsletterSubscriber.findOne({ email: email.toLowerCase() });
    if (existing) {
      if (existing.status === 'unsubscribed') {
        existing.status = 'active';
        await existing.save();
        return res.json({ success: true, message: 'Welcome back! Your subscription is active again.' });
      }
      return res.json({ success: true, message: 'You are already subscribed to the VEXIVO newsletter!' });
    }

    await NewsletterSubscriber.create({ email: email.toLowerCase() });
    res.status(201).json({
      success: true,
      message: 'Thank you for subscribing! Your 10% welcome coupon is VEX10.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all newsletter subscribers (Admin)
// @route GET /api/newsletter/subscribers
const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ subscribedAt: -1 });
    res.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe, getSubscribers };
