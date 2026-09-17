const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  createReview,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

router.route('/')
  .get(getProductReviews)
  .post(optionalAuth, createReview);

router.get('/all', protect, adminOnly, getAllReviews);
router.put('/:id/status', protect, adminOnly, updateReviewStatus);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
