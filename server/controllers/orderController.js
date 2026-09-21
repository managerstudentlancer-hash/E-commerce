const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc Create new order (supports guest and authenticated)
// @route POST /api/orders
const createOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod = 'Credit Card',
      subtotal,
      discount = 0,
      shipping = 0,
      tax = 0,
      total,
      coupon = '',
      guestEmail = '',
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Order must contain at least one item' });
    }

    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.address || !shippingAddress.city) {
      return res.status(400).json({ success: false, message: 'Complete shipping address is required' });
    }

    // Generate unique human-readable order number
    const orderNumber = `VEX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : undefined,
      guestEmail: req.user ? req.user.email : guestEmail,
      items,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      coupon,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentStatus: 'paid', // Mark as paid for standard checkout flow
      orderStatus: 'confirmed',
    });

    const createdOrder = await order.save();

    // Deduct stock asynchronously
    for (const item of items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: -Number(item.quantity || 1) },
        }).catch(() => {});
      }
    }

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged in user's orders
// @route GET /api/orders/my
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc Get single order by id or orderNumber
// @route GET /api/orders/:id
const getOrderById = async (req, res, next) => {
  try {
    let order;
    if (req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      order = await Order.findById(req.params.id).populate('user', 'name email phone');
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: req.params.id }).populate('user', 'name email phone');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization if non-admin user
    if (req.user && req.user.role !== 'admin' && order.user && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc Get all orders with search & status filters (Admin)
// @route GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.orderStatus = status.toLowerCase();
    }

    if (search) {
      const sRegex = new RegExp(search, 'i');
      query.$or = [
        { orderNumber: sRegex },
        { guestEmail: sRegex },
        { 'shippingAddress.firstName': sRegex },
        { 'shippingAddress.lastName': sRegex },
        { 'shippingAddress.phone': sRegex },
        { trackingNumber: sRegex },
      ];
    }

    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    // Summary counts for quick status tabs
    const statusCounts = {
      all: await Order.countDocuments(),
      pending: await Order.countDocuments({ orderStatus: 'pending' }),
      confirmed: await Order.countDocuments({ orderStatus: 'confirmed' }),
      processing: await Order.countDocuments({ orderStatus: 'processing' }),
      shipped: await Order.countDocuments({ orderStatus: 'shipped' }),
      out_for_delivery: await Order.countDocuments({ orderStatus: 'out_for_delivery' }),
      delivered: await Order.countDocuments({ orderStatus: 'delivered' }),
      cancelled: await Order.countDocuments({ orderStatus: 'cancelled' }),
      returned: await Order.countDocuments({ orderStatus: 'returned' }),
    };

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      statusCounts,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update order status, tracking, and handle stock replenishment (Admin)
// @route PUT /api/orders/:id/status
const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    const previousStatus = order.orderStatus;

    if (orderStatus) {
      const normalizedStatus = orderStatus.toLowerCase();
      order.orderStatus = normalizedStatus;

      // Automatically replenish inventory stock when order is cancelled or returned
      if (
        (normalizedStatus === 'cancelled' || normalizedStatus === 'returned') &&
        previousStatus !== 'cancelled' &&
        previousStatus !== 'returned'
      ) {
        if (order.items && Array.isArray(order.items)) {
          for (const item of order.items) {
            if (item.product) {
              await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: Number(item.quantity || 1) },
              }).catch(() => {});
            }
          }
        }
      }
    }

    if (paymentStatus) order.paymentStatus = paymentStatus.toLowerCase();
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
};
