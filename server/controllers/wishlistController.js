const Wishlist = require('../models/Wishlist');
const Product = require('../models/Product');

// @desc Get user wishlist
// @route GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    let wishlist = await Wishlist.findOne({ user: req.user._id }).populate('products');
    if (!wishlist) {
      wishlist = await Wishlist.create({ user: req.user._id, products: [] });
    }
    res.json({ success: true, count: wishlist.products.length, products: wishlist.products });
  } catch (error) {
    next(error);
  }
};

// @desc Add or toggle product in wishlist
// @route POST /api/wishlist
const toggleWishlist = async (req, res, next) => {
  try {
    const { productId } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let wishlist = await Wishlist.findOne({ user: req.user._id });
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user._id, products: [] });
    }

    const index = wishlist.products.findIndex((p) => p.toString() === productId);
    let added = false;
    if (index > -1) {
      wishlist.products.splice(index, 1);
      added = false;
    } else {
      wishlist.products.push(productId);
      added = true;
    }

    await wishlist.save();
    const populated = await Wishlist.findById(wishlist._id).populate('products');

    res.json({
      success: true,
      added,
      message: added ? 'Added to wishlist' : 'Removed from wishlist',
      products: populated.products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Remove specific product from wishlist
// @route DELETE /api/wishlist/:productId
const removeFromWishlist = async (req, res, next) => {
  try {
    const wishlist = await Wishlist.findOne({ user: req.user._id });
    if (wishlist) {
      wishlist.products = wishlist.products.filter(
        (p) => p.toString() !== req.params.productId
      );
      await wishlist.save();
    }
    res.json({ success: true, message: 'Item removed from wishlist' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getWishlist,
  toggleWishlist,
  removeFromWishlist,
};
