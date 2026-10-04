const aiService = require('../services/aiService');
const tools = require('../services/aiTools');

/**
 * @desc Process AI Chat Message
 * @route POST /api/ai/chat
 * @access Public (Optional Auth for personalized order & account context)
 */
const chat = async (req, res, next) => {
  try {
    const { message, history = [] } = req.body;

    if (!message || typeof message !== 'string' || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message is required and must be non-empty.',
      });
    }

    const response = await aiService.processUserMessage({
      message: message.trim(),
      history,
      user: req.user || null,
    });

    res.json({
      success: true,
      reply: response.reply,
      data: response.data || {},
      suggestedActions: response.suggestedActions || [],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('[AI Chat Error]:', error);
    res.status(500).json({
      success: false,
      reply: `I’m having trouble connecting to our systems right now. You can create a support ticket and our team will help you immediately.`,
      data: {
        actionType: 'TICKET_ESCALATE',
        ticketPrefill: {
          category: 'Other',
          subject: 'Assistance needed (AI Connection Issue)',
          message: `User query failed to process: "${req.body?.message || ''}"`,
        },
      },
      suggestedActions: ['Create Support Ticket', '📦 Track My Order', '🎁 View Offers'],
    });
  }
};

/**
 * @desc Confirm Order Cancellation from Chat
 * @route POST /api/ai/cancel-order
 * @access Private
 */
const cancelOrderAction = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please log in to cancel this order.' });
    }

    const { orderId, reason = 'Cancelled via AI Assistant' } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID or Order Number is required.' });
    }

    const result = await tools.cancelOrder(req.user._id, orderId, reason);
    res.json({
      success: true,
      message: result.message,
      orderNumber: result.orderNumber,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Request Return/Exchange from Chat
 * @route POST /api/ai/return-order
 * @access Private
 */
const returnOrderAction = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Please log in to initiate a return.' });
    }

    const { orderId, reason = 'Return requested via AI Assistant', requestType = 'return', exchangeNote = '' } = req.body;
    if (!orderId) {
      return res.status(400).json({ success: false, message: 'Order ID or Order Number is required.' });
    }

    const result = await tools.returnOrder(req.user._id, orderId, reason, requestType, exchangeNote);
    res.json({
      success: true,
      message: result.message,
      orderNumber: result.orderNumber,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get Initial Assistant Configuration & Suggestions
 * @route GET /api/ai/welcome
 * @access Public
 */
const getWelcome = async (req, res, next) => {
  try {
    const coupons = await tools.getCoupons();
    const offers = await tools.getActiveOffers('saree-deals');

    res.json({
      success: true,
      welcomeMessage: `Hi! 👋 I’m your **VEXIVO AI Assistant**.
How can I help you with your shopping or order today?`,
      suggestedActions: [
        '🛍️ Find a product',
        '📦 Track my order',
        '↩️ Return / Refund',
        '🎁 Offers & Coupons',
        '💳 Payment Help',
        '👩‍💻 Talk to Support',
      ],
      quickFilters: [
        'Show sarees under ₹1500',
        "Show women's jewellery",
        'Any saree offers?',
        'Show dresses under ₹2000',
        'Where is my order?',
      ],
      activeOffersCount: offers.length,
      activeCouponsCount: coupons.length,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  chat,
  cancelOrderAction,
  returnOrderAction,
  getWelcome,
};
