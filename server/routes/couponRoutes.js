const express = require('express');
const router = express.Router();
const {
  validateCoupon,
  getAvailableCoupons,
  getCoupons,
  createCoupon,
  updateCoupon,
  toggleCoupon,
  deleteCoupon,
} = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/auth');

router.post('/validate', validateCoupon);
router.get('/available', getAvailableCoupons);
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.put('/:id', protect, adminOnly, updateCoupon);
router.patch('/:id/toggle', protect, adminOnly, toggleCoupon);
router.delete('/:id', protect, adminOnly, deleteCoupon);

module.exports = router;
