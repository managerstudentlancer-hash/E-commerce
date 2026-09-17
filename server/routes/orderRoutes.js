const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

router.route('/')
  .post(optionalAuth, createOrder)
  .get(protect, adminOnly, getAllOrders);

router.get('/my', protect, getMyOrders);

router.route('/:id')
  .get(optionalAuth, getOrderById);

router.put('/:id/status', protect, adminOnly, updateOrderStatus);

module.exports = router;
