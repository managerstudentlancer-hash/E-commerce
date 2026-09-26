const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');
const Notification = require('../models/Notification');

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

    // Enrich items with seller information
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        let seller = null;
        let sellerName = 'VEXIVO Official';
        if (item.product) {
          const prod = await Product.findById(item.product).select('sellerId sellerName').lean();
          if (prod && prod.sellerId) {
            seller = prod.sellerId;
            sellerName = prod.sellerName || 'Independent Seller';
          }
        }
        return {
          product: item.product,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image || '',
          variant: item.variant || '',
          seller,
          sellerName,
        };
      })
    );

    // Generate unique human-readable order number
    const orderNumber = `VEX-${Date.now().toString().slice(-6)}-${Math.floor(1000 + Math.random() * 9000)}`;

    const initialTracking = [
      { status: 'Ordered', message: 'Order placed successfully', timestamp: new Date() },
      { status: 'Confirmed', message: 'Order verified and confirmed by VEXIVO', timestamp: new Date() },
    ];

    const order = new Order({
      orderNumber,
      user: req.user ? req.user._id : undefined,
      guestEmail: req.user ? req.user.email : guestEmail,
      items: enrichedItems,
      subtotal,
      discount,
      shipping,
      tax,
      total,
      coupon,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentStatus: 'paid', // Mark as paid for demo checkout
      orderStatus: 'processing',
      trackingHistory: initialTracking,
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

    // Credit reward points to customer (1 point per £1 spent) & create notification
    if (req.user) {
      const earnedPoints = Math.max(10, Math.floor(total));
      await User.findByIdAndUpdate(req.user._id, {
        $inc: { rewardPoints: earnedPoints },
        $push: {
          rewardsHistory: {
            points: earnedPoints,
            type: 'earned',
            description: `Earned on order ${orderNumber}`,
            date: new Date(),
          },
        },
      }).catch(() => {});

      await Notification.create({
        user: req.user._id,
        title: 'Order Confirmed! 🎉',
        message: `Your order ${orderNumber} for £${total.toFixed(2)} has been placed and is being prepared for dispatch.`,
        type: 'order',
        link: `/account?tab=orders`,
      }).catch(() => {});
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
      order = await Order.findById(req.params.id);
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: req.params.id });
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Check authorization if user order
    if (req.user && req.user.role !== 'admin' && order.user && order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

// @desc Get all orders (Admin)
// @route GET /api/orders
const getAllOrders = async (req, res, next) => {
  try {
    const { status, limit = 50, page = 1 } = req.query;
    const query = {};
    if (status) query.orderStatus = status;

    const limitNum = parseInt(limit, 10);
    const pageNum = parseInt(page, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Order.countDocuments(query);
    const orders = await Order.find(query)
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: orders.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      orders,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update order status & tracking (Admin & Authorized status transitions)
// @route PUT /api/orders/:id/status
const VALID_TRANSITIONS = {
  pending: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: [],
};

const updateOrderStatus = async (req, res, next) => {
  try {
    const { orderStatus, paymentStatus, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (orderStatus && orderStatus !== order.orderStatus) {
      const allowed = VALID_TRANSITIONS[order.orderStatus] || [];
      if (!allowed.includes(orderStatus)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status transition: Order cannot move from '${order.orderStatus}' to '${orderStatus}'. Allowed: ${allowed.join(', ') || 'none (terminal state)'}`,
        });
      }
      order.orderStatus = orderStatus;
    }

    if (paymentStatus) order.paymentStatus = paymentStatus;
    if (trackingNumber !== undefined) order.trackingNumber = trackingNumber;

    const updatedOrder = await order.save();
    res.json({ success: true, order: updatedOrder });
  } catch (error) {
    next(error);
  }
};

// @desc Cancel order by customer (Flipkart style)
// @route PUT /api/orders/:id/cancel
const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Must be the owner or admin
    if (req.user.role !== 'admin' && (!order.user || order.user.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to cancel this order' });
    }

    if (['shipped', 'delivered', 'cancelled', 'returned'].includes(order.orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Order cannot be cancelled because it is already marked as ${order.orderStatus}.`,
      });
    }

    const reason = req.body.reason || 'Cancelled by customer';
    order.orderStatus = 'cancelled';
    order.cancellationReason = reason;
    order.cancelledAt = new Date();
    order.trackingHistory.push({
      status: 'Cancelled',
      message: `Order cancelled: ${reason}`,
      timestamp: new Date(),
    });

    await order.save();

    // Restock items
    for (const item of order.items) {
      if (item.product) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: { stock: Number(item.quantity || 1) },
        }).catch(() => {});
      }
    }

    // Create Notification
    if (order.user) {
      await Notification.create({
        user: order.user,
        title: 'Order Cancelled',
        message: `Your order ${order.orderNumber} has been successfully cancelled.`,
        type: 'order',
        link: `/account?tab=orders`,
      }).catch(() => {});
    }

    res.json({ success: true, message: 'Order cancelled successfully', order });
  } catch (error) {
    next(error);
  }
};

// @desc Request return / refund by customer (Flipkart style)
// @route PUT /api/orders/:id/return
const returnOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Must be owner or admin
    if (req.user.role !== 'admin' && (!order.user || order.user.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to request return for this order' });
    }

    if (order.orderStatus !== 'delivered') {
      return res.status(400).json({
        success: false,
        message: 'Only delivered orders are eligible for return / refund.',
      });
    }

    const reason = req.body.reason || 'Return requested by customer';
    order.orderStatus = 'returned';
    order.returnReason = reason;
    order.returnedAt = new Date();
    order.trackingHistory.push({
      status: 'Return Initiated',
      message: `Return request submitted: ${reason}`,
      timestamp: new Date(),
    });

    await order.save();

    // Create Notification
    if (order.user) {
      await Notification.create({
        user: order.user,
        title: 'Return Request Received',
        message: `Your return request for order ${order.orderNumber} has been received. Pickup will be coordinated soon.`,
        type: 'order',
        link: `/account?tab=orders`,
      }).catch(() => {});
    }

    res.json({ success: true, message: 'Return request submitted successfully', order });
  } catch (error) {
    next(error);
  }
};

// @desc Get orders containing items belonging to this seller
// @route GET /api/orders/seller/my
const getMySellerOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ 'items.seller': req.user._id })
      .populate('user', 'name email phone')
      .sort({ createdAt: -1 })
      .lean();

    // Filter items to only show seller's own products (Data Isolation Guarantee)
    const sanitizedOrders = orders.map((order) => {
      const sellerItems = order.items.filter(
        (item) => item.seller && item.seller.toString() === req.user._id.toString()
      );
      const sellerSubtotal = sellerItems.reduce((acc, it) => acc + it.price * it.quantity, 0);

      return {
        ...order,
        items: sellerItems,
        sellerSubtotal,
      };
    });

    res.json({ success: true, count: sanitizedOrders.length, orders: sanitizedOrders });
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
  cancelOrder,
  returnOrder,
  getMySellerOrders,
};
