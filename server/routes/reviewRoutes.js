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
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getProductReviews)
  .post(protect, createReview);

router.post('/:id/like', protect, toggleReviewLike);
router.get('/all', protect, adminOnly, getAllReviews);
router.put('/:id/status', protect, adminOnly, updateReviewStatus);
router.delete('/:id', protect, adminOnly, deleteReview);

module.exports = router;
