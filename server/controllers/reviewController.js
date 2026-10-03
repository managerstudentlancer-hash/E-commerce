const mongoose = require('mongoose');
const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');
const ReviewLike = require('../models/ReviewLike');

// Helper to reliably find a product by ObjectId or slug
const findProductByIdOrSlug = async (identifier) => {
  if (!identifier) return null;
  if (mongoose.Types.ObjectId.isValid(identifier)) {
    const byId = await Product.findById(identifier);
    if (byId) return byId;
  }
  return await Product.findOne({ slug: identifier });
};

// @desc Get reviews for a product (all live non-rejected reviews)
// @route GET /api/products/:productId/reviews
const getProductReviews = async (req, res, next) => {
  try {
    const product = await findProductByIdOrSlug(req.params.productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const reviews = await Review.find({
      product: product._id,
      status: { $ne: 'rejected' },
    }).sort({ createdAt: -1 });

    res.json({ success: true, count: reviews.length, reviews });
  } catch (error) {
    next(error);
  }
};

// @desc Add a review for a product (Strict Verified Purchase Required — Delivered Orders Only)
// @route POST /api/products/:productId/reviews
const createReview = async (req, res, next) => {
  try {
    const { rating, title, comment, userName, userEmail } = req.body;
    const product = await findProductByIdOrSlug(req.params.productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // 1. Authentication check
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required. Please sign in to submit a review.',
      });
    }

    // 2. Strict Delivery-Verified Purchase Check
    const deliveredOrder = await Order.findOne({
      user: req.user._id,
      orderStatus: 'delivered',
      'items.product': product._id,
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        success: false,
        message: 'Unverified review (no delivered order) rejected with 403 Forbidden. Only customers who received this product can review.',
      });
    }

    // 3. Duplicate Review Prevention
    const existingReview = await Review.findOne({
      product: product._id,
      user: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'Duplicate review on same product rejected with 400 Bad Request. You have already reviewed this product.',
      });
    }

    const reviewerName = (req.user?.name || userName || 'Verified Customer').trim();
    const reviewerEmail = (req.user?.email || userEmail || '').trim();

    // 4. Create review - auto-approved for genuine verified buyers
    const review = await Review.create({
      product: product._id,
      user: req.user._id,
      userName: reviewerName,
      userEmail: reviewerEmail,
      rating: Number(rating) || 5,
      title: title || 'Customer Review',
      comment: comment || '',
      verifiedPurchase: true,
      status: 'approved',
      likes: 0,
      likedBy: [],
    });

    // Instantly update product rating and reviews count in database
    const allReviews = await Review.find({ product: product._id, status: { $ne: 'rejected' } });
    const avgRating =
      allReviews.reduce((acc, r) => acc + r.rating, 0) / (allReviews.length || 1);

    product.rating = Math.round(avgRating * 10) / 10;
    product.numReviews = allReviews.length;
    await product.save();

    res.status(201).json({
      success: true,
      review,
      product: { rating: product.rating, numReviews: product.numReviews },
      message: 'Your review has been published automatically.',
    });
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

    const existingLike = await ReviewLike.findOne({ review: reviewId, user: req.user._id });

    if (existingLike) {
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

    // Recalculate product rating
    if (review.product) {
      const allReviews = await Review.find({ product: review.product, status: { $ne: 'rejected' } });
      const avgRating = allReviews.length > 0
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
        : 5;
      await Product.findByIdAndUpdate(review.product, {
        rating: Math.round(avgRating * 10) / 10,
        numReviews: allReviews.length,
      });
    }

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

    const productId = review.product;
    await Review.findByIdAndDelete(req.params.id);

    // Recalculate product rating & review count
    if (productId) {
      const allReviews = await Review.find({ product: productId, status: { $ne: 'rejected' } });
      const avgRating = allReviews.length > 0
        ? allReviews.reduce((acc, r) => acc + r.rating, 0) / allReviews.length
        : 5;
      await Product.findByIdAndUpdate(productId, {
        rating: Math.round(avgRating * 10) / 10,
        numReviews: allReviews.length,
      });
    }

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
