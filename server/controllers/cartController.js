const mongoose = require('mongoose');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc Get user cart
// @route GET /api/cart
const getCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc Add item to cart
// @route POST /api/cart
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, variant = '', slug = '', name = '' } = req.body;
    const reqQty = Math.max(1, parseInt(quantity, 10) || 1);

    let product = null;
    if (productId && mongoose.Types.ObjectId.isValid(String(productId))) {
      product = await Product.findById(productId);
    }
    if (!product && (slug || req.body.slug)) {
      product = await Product.findOne({ slug: String(slug || req.body.slug).toLowerCase().trim() });
    }
    if (!product && (name || req.body.name)) {
      product = await Product.findOne({ name: String(name || req.body.name).trim() });
    }

    if (!product || product.status !== 'active') {
      return res.status(404).json({ success: false, message: 'Product not found or unavailable' });
    }

    // Determine variant-specific stock & price if configured
    let availableStock = product.stock !== undefined ? product.stock : 50;
    let effectivePrice = product.price;

    if (variant && Array.isArray(product.options) && product.options.length > 0) {
      const matchedOpt = product.options.find(
        (opt) =>
          opt.size?.toLowerCase() === variant.toLowerCase() ||
          opt.color?.toLowerCase() === variant.toLowerCase() ||
          `${opt.size} / ${opt.color}`.toLowerCase() === variant.toLowerCase()
      );
      if (matchedOpt) {
        if (matchedOpt.stock !== undefined) availableStock = matchedOpt.stock;
        if (matchedOpt.price && matchedOpt.price > 0) effectivePrice = matchedOpt.price;
      }
    }

    if (availableStock <= 0) {
      return res.status(400).json({
        success: false,
        message: `Sorry, "${product.name}" is currently out of stock.`,
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.variant === variant
    );

    const currentCartQty = itemIndex > -1 ? cart.items[itemIndex].quantity : 0;
    const totalRequestedQty = currentCartQty + reqQty;

    if (totalRequestedQty > availableStock) {
      return res.status(400).json({
        success: false,
        message: `Cannot add ${reqQty} more unit(s). Only ${availableStock} unit(s) available in stock (you already have ${currentCartQty} in cart).`,
      });
    }

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = totalRequestedQty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: effectivePrice,
        quantity: reqQty,
        image: product.thumbnail || (product.images && product.images[0]) || '',
        variant,
      });
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc Update cart item quantity
// @route PUT /api/cart/:itemId
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const reqQty = parseInt(quantity, 10);
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (reqQty <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      // Validate against product stock
      const product = await Product.findById(item.product).select('stock name options');
      if (product) {
        let availableStock = product.stock !== undefined ? product.stock : 50;
        if (item.variant && Array.isArray(product.options) && product.options.length > 0) {
          const matchedOpt = product.options.find(
            (opt) =>
              opt.size?.toLowerCase() === item.variant.toLowerCase() ||
              opt.color?.toLowerCase() === item.variant.toLowerCase() ||
              `${opt.size} / ${opt.color}`.toLowerCase() === item.variant.toLowerCase()
          );
          if (matchedOpt && matchedOpt.stock !== undefined) {
            availableStock = matchedOpt.stock;
          }
        }
        if (reqQty > availableStock) {
          return res.status(400).json({
            success: false,
            message: `Only ${availableStock} unit(s) available in stock for "${product.name}".`,
          });
        }
      }
      item.quantity = reqQty;
    }

    await cart.save();
    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc Remove item from cart
// @route DELETE /api/cart/:itemId
const removeCartItem = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    cart.items.pull(req.params.itemId);
    await cart.save();

    res.json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

// @desc Clear whole cart
// @route DELETE /api/cart
const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id });
    if (cart) {
      cart.items = [];
      await cart.save();
    }
    res.json({ success: true, message: 'Cart cleared', cart: { items: [], subtotal: 0 } });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
};
