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

    // Enrich items and enforce Server-Side Price Integrity (Anti-Tampering)
    let computedSubtotal = 0;
    const enrichedItems = await Promise.all(
      items.map(async (item) => {
        let seller = null;
        let sellerName = 'VEXIVO Official';
        let verifiedPrice = Number(item.price) || 0;
        let verifiedName = item.name;
        let verifiedImage = item.image || '';

        if (item.product) {
          const prod = await Product.findById(item.product).select('price salePrice name images sellerId sellerName stock').lean();
          if (prod) {
            // Security: Use authenticated database price (never trust client payload)
            verifiedPrice = prod.salePrice && prod.salePrice < prod.price ? prod.salePrice : prod.price;
            verifiedName = prod.name;
            if (prod.images && prod.images.length > 0) {
              verifiedImage = prod.images[0].url || verifiedImage;
            }
            if (prod.sellerId) {
              seller = prod.sellerId;
              sellerName = prod.sellerName || 'Independent Seller';
            }
          }
        }

        const validQty = Math.max(1, Math.min(99, parseInt(item.quantity, 10) || 1));
        computedSubtotal += verifiedPrice * validQty;

        return {
          product: item.product,
          name: verifiedName,
          price: verifiedPrice,
          quantity: validQty,
          image: verifiedImage,
          variant: item.variant || '',
          seller,
          sellerName,
        };
      })
    );

    // Validate coupon against database if provided
    let verifiedDiscount = 0;
    if (coupon) {
      try {
        const Coupon = require('../models/Coupon');
        const foundCoupon = await Coupon.findOne({
          code: coupon.toString().toUpperCase().trim(),
          active: true,
        });
        if (foundCoupon) {
          const notExpired = !foundCoupon.expiryDate || new Date(foundCoupon.expiryDate) > new Date();
          const minMet = !foundCoupon.minimumOrder || computedSubtotal >= foundCoupon.minimumOrder;
          if (notExpired && minMet) {
            if (foundCoupon.type === 'percentage') {
              verifiedDiscount = Math.round((computedSubtotal * foundCoupon.value) / 100);
              if (foundCoupon.maximumDiscount && foundCoupon.maximumDiscount > 0) {
                verifiedDiscount = Math.min(verifiedDiscount, foundCoupon.maximumDiscount);
              }
            } else {
              verifiedDiscount = Math.min(computedSubtotal, foundCoupon.value);
            }
          }
        }
      } catch {
        // Fallback safely if coupon lookup fails
      }
    }

    const verifiedShipping = computedSubtotal > 1999 ? 0 : Math.max(0, Number(shipping) || 0);
    const verifiedTax = 0;
    const verifiedTotal = Math.max(0, computedSubtotal - verifiedDiscount + verifiedShipping + verifiedTax);

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
      subtotal: computedSubtotal,
      discount: verifiedDiscount,
      shipping: verifiedShipping,
      tax: verifiedTax,
      total: verifiedTotal,
      coupon,
      shippingAddress,
      billingAddress: billingAddress || shippingAddress,
      paymentMethod,
      paymentStatus: 'paid', // Mark as paid for standard checkout flow
      orderStatus: req.body.orderStatus || 'processing',
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

    // Credit reward points to customer (1 point per ₹100 spent) & create notification
    if (req.user) {
      const earnedPoints = Math.max(10, Math.floor(verifiedTotal / 100));
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
        message: `Your order ${orderNumber} for ₹${verifiedTotal.toLocaleString('en-IN')} has been placed and is being prepared for dispatch.`,
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
    const orders = await Order.find({ user: req.user._id })
      .populate('items.product')
      .sort({ createdAt: -1 });
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
      order = await Order.findById(req.params.id)
        .populate('user', 'name email phone')
        .populate('items.product');
    }
    if (!order) {
      order = await Order.findOne({ orderNumber: req.params.id })
        .populate('user', 'name email phone')
        .populate('items.product');
    }

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Security: Strict IDOR Protection
    if (order.user) {
      if (!req.user) {
        return res.status(401).json({ success: false, message: 'Authentication required to view order details.' });
      }
      if (req.user.role !== 'admin' && order.user._id.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Access denied: You are not authorized to view this order.' });
      }
    } else if (order.guestEmail) {
      if (req.user && req.user.role !== 'admin' && req.user.email !== order.guestEmail) {
        return res.status(403).json({ success: false, message: 'Access denied: Order does not match your credentials.' });
      }
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
      if (normalizedStatus === 'delivered') {
        order.deliveredAt = new Date();
      }

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
    const requestType = req.body.requestType || 'return'; // 'return' or 'exchange'
    const exchangeNote = req.body.exchangeNote || '';

    const isExchange = requestType === 'exchange';
    order.orderStatus = isExchange ? 'exchange_requested' : 'returned';
    order.returnReason = exchangeNote
      ? `${reason} [Exchange Details: ${exchangeNote}]`
      : reason;
    order.returnedAt = new Date();
    order.trackingHistory.push({
      status: isExchange ? 'Exchange Initiated' : 'Return Initiated',
      message: `${isExchange ? 'Exchange' : 'Return'} request submitted: ${reason}`,
      timestamp: new Date(),
    });

    await order.save();

    // Create Notification
    if (order.user) {
      await Notification.create({
        user: order.user,
        title: isExchange ? 'Exchange Request Received' : 'Return Request Received',
        message: `Your ${isExchange ? 'exchange' : 'return'} request for order ${order.orderNumber} has been received. Pickup will be coordinated soon.`,
        type: 'order',
        link: `/account?tab=orders`,
      }).catch(() => {});
    }

    res.json({
      success: true,
      message: isExchange
        ? 'Exchange request submitted successfully'
        : 'Return request submitted successfully',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Simulate / mark order as delivered (Testing & Fast-Track)
// @route PUT /api/orders/:id/deliver
const simulateDelivery = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Must be owner or admin
    if (req.user.role !== 'admin' && (!order.user || order.user.toString() !== req.user._id.toString())) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
    }

    order.orderStatus = 'delivered';
    order.deliveredAt = new Date();
    order.trackingHistory.push({
      status: 'Delivered',
      message: 'Package delivered to recipient via Ekart Express India.',
      timestamp: new Date(),
    });

    await order.save();
    res.json({ success: true, message: 'Order marked as Delivered successfully', order });
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
  simulateDelivery,
  getMySellerOrders,
};
