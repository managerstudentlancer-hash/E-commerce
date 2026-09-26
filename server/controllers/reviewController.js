const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ReviewLike = require('../models/ReviewLike');

// @desc Get reviews for a product
// @route GET /api/products/:productId/reviews
const getProductReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      status: 'approved',
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc Add a review for a product (STRICT: Delivered purchasers only, 1 per user)
// @route POST /api/products/:productId/reviews
const createReview = async (req, res, next) => {
  try {
    const { rating, title, comment } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to submit a review.',
      });
    }

    // One-review-per-user-per-product enforcement
    const existingReview = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted a review for this product.',
      });
    }

    // HARD RULE: Only users who purchased the product AND have a DELIVERED order can review
    const orders = await Order.find({
      user: req.user._id,
      'items.product': product._id,
    });

    if (!orders || orders.length === 0) {
      return res.status(403).json({
        success: false,
        message: 'Review rejected: You can only review products you have purchased.',
      });
    }

    const deliveredOrder = orders.find((o) => o.orderStatus === 'delivered');
    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message: 'Review rejected: Your order is still processing/shipping and has not been delivered yet.',
      });
    }

    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      rating: Number(rating) || 5,
      title: title || 'Verified Purchase Review',
      comment: comment || '',
      verifiedPurchase: true,
      status: 'approved',
      likes: 0,
      likedBy: [],
    });

    // Update product rating and reviews count
    const allReviews = await Review.find({ product: product._id, status: 'approved' });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / (allReviews.length || 1);

    product.rating = Math.round(avgRating * 10) / 10;
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc Like or Unlike a review (with duplicate prevention)
// @route POST /api/reviews/:id/like
const toggleReviewLike = async (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required to like reviews' });
    }

    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    // Check if like record exists
    const existingLike = await ReviewLike.findOne({ review: reviewId, user: req.user._id });

    if (existingLike) {
      // Unlike
      await ReviewLike.findByIdAndDelete(existingLike._id);
      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        {
          $inc: { likes: -1 },
          $pull: { likedBy: req.user._id },
        },
        { new: true }
      );
      return res.json({
        success: true,
        liked: false,
        likes: Math.max(0, updatedReview?.likes || 0),
        message: 'Review unliked',
      });
    } else {
      // Like (enforcing compound unique index)
      try {
        await ReviewLike.create({ review: reviewId, user: req.user._id });
      } catch (err) {
        if (err.code === 11000) {
          return res.status(400).json({ success: false, message: 'Duplicate review like prevented' });
        }
        throw err;
      }

      const updatedReview = await Review.findByIdAndUpdate(
        reviewId,
        {
          $inc: { likes: 1 },
          $addToSet: { likedBy: req.user._id },
        },
        { new: true }
      );
      return res.json({
        success: true,
        liked: true,
        likes: updatedReview?.likes || 1,
        message: 'Review liked',
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get all reviews (Admin)
// @route GET /api/reviews
const getAllReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name slug thumbnail')
      .sort({ createdAt: -1 });
    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc Update review status (Admin)
// @route PUT /api/reviews/:id/status
const updateReviewStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    review.status = status;
    await review.save();

    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

// @desc Delete review (Admin)
// @route DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    await Review.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Review deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProductReviews,
  createReview,
  toggleReviewLike,
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
