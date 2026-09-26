const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  returnOrder,
  getMySellerOrders,
} = require('../controllers/orderController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

router.route('/')
  .post(optionalAuth, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get('/my', protect, getMyOrders);
router.get('/seller/my', protect, getMySellerOrders);

router.put('/:id/cancel', protect, cancelOrder);
router.put('/:id/return', protect, returnOrder);

router.route('/:id')
  .get(optionalAuth, getOrderById);

router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
