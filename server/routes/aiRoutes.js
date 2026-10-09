const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');
const { optionalAuth, protect } = require('../middleware/auth');

// Public / optionally authenticated AI conversation endpoint
router.post('/chat', optionalAuth, aiController.chat);

// Initial assistant state & quick prompts
router.get('/welcome', optionalAuth, aiController.getWelcome);

// AI Product Search & Catalog APIs
router.get('/products/search', aiController.searchProducts);
router.get('/products/:id', aiController.getProductDetails);
router.get('/categories', aiController.getCategories);
router.get('/offers', aiController.getOffers);
router.get('/knowledge', aiController.getKnowledge);

// Shopping actions via AI
router.post('/cart/add', protect, aiController.addToCart);
router.post('/wishlist/add', protect, aiController.addToWishlist);
router.get('/orders', protect, aiController.getUserOrders);

// Order actions triggered with user confirmation
router.post('/cancel-order', protect, aiController.cancelOrderAction);
router.post('/return-order', protect, aiController.returnOrderAction);

module.exports = router;
