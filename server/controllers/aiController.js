const aiService = require('../services/aiService');
const tools = require('../services/aiTools');
const AISettings = require('../models/AISettings');
const AIKnowledge = require('../models/AIKnowledge');
const AIFAQ = require('../models/AIFAQ');

/**
 * @desc Process AI Chat Message
 * @route POST /api/ai/chat
 * @access Public (Optional Auth)
 */
const chat = async (req, res, next) => {
  try {
    const { message, history = [], sessionId = 'guest_session' } = req.body;

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
      sessionId: sessionId || req.headers['x-session-id'] || 'guest_session',
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
      reply: `Sorry, I'm having trouble right now. Please try again or reach our support team at care@vexivo.com.`,
      data: { actionType: 'ERROR' },
      suggestedActions: ['📦 Track My Order', '🛍️ Browse Products', '🎁 View Offers'],
    });
  }
};

/**
 * @desc Get Initial Assistant State & Configuration
 * @route GET /api/ai/welcome
 * @access Public
 */
const getWelcome = async (req, res, next) => {
  try {
    const settings = await tools.getAISettings();
    const coupons = await tools.getCoupons();
    const offers = await tools.getOffers('all');

    res.json({
      success: true,
      enabled: settings.enabled !== false,
      assistantName: settings.assistantName || 'VEXIVO AI',
      avatarUrl: settings.avatarUrl || '',
      welcomeMessage: settings.welcomeMessage,
      fallbackMessage: settings.fallbackMessage,
      suggestedQuestions: settings.suggestedQuestions || [
        '👗 Find a dress',
        '🛍️ Best offers',
        '💰 Under ₹2000',
        '❤️ Trending products',
        '🎁 Gift ideas',
        '📦 Track my order',
      ],
      productResultLimit: settings.productResultLimit || 6,
      activeOffersCount: offers.length,
      activeCouponsCount: coupons.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Product Search Endpoint for AI
 * @route GET /api/ai/products/search
 * @access Public
 */
const searchProducts = async (req, res, next) => {
  try {
    const products = await tools.searchProducts({
      query: req.query.q || req.query.query || req.query.search || '',
      category: req.query.category,
      categorySlug: req.query.categorySlug,
      subcategory: req.query.subcategory,
      gender: req.query.gender,
      color: req.query.color,
      size: req.query.size,
      brand: req.query.brand,
      minPrice: req.query.minPrice,
      maxPrice: req.query.maxPrice,
      discount: req.query.discount,
      rating: req.query.rating,
      availability: req.query.availability,
      occasion: req.query.occasion,
      sort: req.query.sort,
      limit: req.query.limit,
    });

    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Product Details
 * @route GET /api/ai/products/:id
 * @access Public
 */
const getProductDetails = async (req, res, next) => {
  try {
    const product = await tools.getProductDetails(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Categories Tree
 * @route GET /api/ai/categories
 * @access Public
 */
const getCategories = async (req, res, next) => {
  try {
    const categories = await tools.getCategories();
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Active Offers & Coupons
 * @route GET /api/ai/offers
 * @access Public
 */
const getOffers = async (req, res, next) => {
  try {
    const offers = await tools.getOffers(req.query.section, req.query.category);
    const coupons = await tools.getCoupons();
    res.json({ success: true, offers, coupons });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Get Verified Knowledge & Policies
 * @route GET /api/ai/knowledge
 * @access Public
 */
const getKnowledge = async (req, res, next) => {
  try {
    const data = await tools.getWebsiteInfo(req.query.topic || req.query.category);
    const faqs = await tools.getFAQ(req.query.q);
    res.json({ success: true, ...data, faqs });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc Add Product to Cart from AI
 * @route POST /api/ai/cart/add
 * @access Private
 */
const addToCart = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const { productId, variant = '', quantity = 1 } = req.body;
    const result = await tools.addProductToCart(req.user._id, productId, variant, quantity);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Add Product to Wishlist from AI
 * @route POST /api/ai/wishlist/add
 * @access Private
 */
const addToWishlist = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const { productId } = req.body;
    const result = await tools.addToWishlist(req.user._id, productId);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

/**
 * @desc Get Authenticated User Orders for AI
 * @route GET /api/ai/orders
 * @access Private
 */
const getUserOrders = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }
    const orders = await tools.getUserOrders(req.user._id);
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
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

    const {
      orderId,
      reason = 'Return requested via AI Assistant',
      requestType = 'return',
      exchangeNote = '',
    } = req.body;

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

module.exports = {
  chat,
  getWelcome,
  searchProducts,
  getProductDetails,
  getCategories,
  getOffers,
  getKnowledge,
  addToCart,
  addToWishlist,
  getUserOrders,
  cancelOrderAction,
  returnOrderAction,
};
