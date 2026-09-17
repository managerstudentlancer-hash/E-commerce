const Review = require('../models/Review');
const Product = require('../models/Product');

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

// @desc Add a review for a product
// @route POST /api/products/:productId/reviews
const createReview = async (req, res, next) => {
  try {
    const { rating, title, comment, userName, userEmail } = req.body;
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const review = await Review.create({
      product: product._id,
      user: req.user ? req.user._id : undefined,
      userName: req.user ? req.user.name : (userName || 'Verified Buyer'),
      userEmail: req.user ? req.user.email : (userEmail || ''),
      rating: Number(rating),
      title,
      comment,
      verifiedPurchase: true,
      status: 'approved',
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
  getAllReviews,
  updateReviewStatus,
  deleteReview,
};
