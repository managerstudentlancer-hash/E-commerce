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
    const { productId, quantity = 1, variant = '' } = req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId && item.variant === variant
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity: Number(quantity),
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
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ success: false, message: 'Cart not found' });
    }

    const item = cart.items.id(req.params.itemId);
    if (!item) {
      return res.status(404).json({ success: false, message: 'Item not found in cart' });
    }

    if (Number(quantity) <= 0) {
      cart.items.pull(req.params.itemId);
    } else {
      item.quantity = Number(quantity);
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
