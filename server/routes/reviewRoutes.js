const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getProductReviews,
  createReview,
  toggleReviewLike,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
} = require('../controllers/reviewController');
const { protect, adminOnly, optionalAuth } = require('../middleware/auth');

// Allow both logged-in users and guest reviews (auto-published instantly, no approval needed)
router.route('/')
  .get(getProductReviews)
  .post(optionalAuth, createReview);

router.post('/:id/like', protect, toggleReviewLike);
router.get('/all', protect, adminOnly, getAllReviews);
router.put('/:id/status', protect, adminOnly, updateReviewStatus);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
