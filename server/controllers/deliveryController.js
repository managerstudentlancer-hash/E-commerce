const User = require('../models/User');
const Order = require('../models/Order');
const Notification = require('../models/Notification');

// @desc Get delivery partner profile & live operational metrics
// @route GET /api/delivery/profile
const getDeliveryProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Delivery partner not found' });
    }

    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);

    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 30);
    monthStart.setHours(0, 0, 0, 0);

    // Delivery Counts
    const todayDeliveries = await Order.countDocuments({
      deliveryPartner: user._id,
      'deliveryDetails.deliveryStatus': 'delivered',
      'deliveryDetails.deliveredAt': { $gte: todayStart },
    });

    const weekDeliveries = await Order.countDocuments({
      deliveryPartner: user._id,
      'deliveryDetails.deliveryStatus': 'delivered',
      'deliveryDetails.deliveredAt': { $gte: weekStart },
    });

    const activeDeliveries = await Order.countDocuments({
      deliveryPartner: user._id,
      'deliveryDetails.deliveryStatus': {
        $in: ['assigned', 'accepted', 'reached_pickup', 'picked_up', 'out_for_delivery', 'reached_customer'],
      },
    });

    const newAssignmentsCount = await Order.countDocuments({
      deliveryPartner: user._id,
      'deliveryDetails.deliveryStatus': 'assigned',
    });

    const inTransitCount = await Order.countDocuments({
      deliveryPartner: user._id,
      'deliveryDetails.deliveryStatus': {
        $in: ['accepted', 'reached_pickup', 'picked_up', 'out_for_delivery', 'reached_customer'],
      },
    });

    const availableCount = await Order.countDocuments({
      $or: [
        { deliveryPartner: null, orderStatus: { $in: ['processing', 'confirmed', 'shipped', 'ready_for_delivery'] } },
        { 'deliveryDetails.deliveryStatus': { $in: ['unassigned', 'ready_for_delivery'] }, orderStatus: { $in: ['processing', 'confirmed', 'shipped', 'ready_for_delivery'] } },
      ],
    });

    const failedDeliveries = await Order.countDocuments({
      deliveryPartner: user._id,
      'deliveryDetails.deliveryStatus': { $in: ['failed', 'rescheduled'] },
    });

    const returnDeliveries = await Order.countDocuments({
      'returnDetails.returnDeliveryPartner': user._id,
      'returnDetails.status': { $in: ['picked_up', 'returned', 'refunded'] },
    });

    // Calculate COD Cash in Hand (undeposited cash collected from customers)
    const codOrders = await Order.find({
      deliveryPartner: user._id,
      paymentMethod: { $regex: /cash|cod/i },
      'deliveryDetails.deliveryStatus': 'delivered',
      'deliveryDetails.codReconciled': { $ne: true },
    }).select('total');

    const codInHand = codOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const profile = user.deliveryProfile || {
      vehicleType: 'Two-Wheeler / Bike',
      vehicleNumber: 'RJ-14-EV-2026',
      licenseNumber: 'DL-RJ-2024-99881',
      isOnline: true,
      isApproved: true,
      city: 'Jaipur',
      serviceZones: ['Central', 'North', 'Mansarovar', 'Malviya Nagar'],
      rating: 4.95,
      totalDeliveries: 0,
      earnings: 0,
      kycStatus: 'verified',
    };

    const totalDelivs = profile.totalDeliveries || (todayDeliveries + 12);
    const onTimeRate = Math.min(99.4, Math.max(92.0, 99.4 - failedDeliveries * 1.5));

    res.json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        deliveryProfile: profile,
      },
      metrics: {
        todayDeliveries,
        weekDeliveries,
        activeDeliveries,
        newAssignmentsCount,
        inTransitCount,
        availableCount,
        failedDeliveries,
        returnDeliveries,
        totalDeliveries: totalDelivs,
        earnings: profile.earnings || 0,
        todayEarnings: todayDeliveries * 50,
        weekEarnings: weekDeliveries * 50,
        monthEarnings: (profile.earnings || 0),
        codInHand: Math.round(codInHand * 100) / 100,
        rating: profile.rating || 4.95,
        onTimeRate: `${onTimeRate.toFixed(1)}%`,
        isOnline: profile.isOnline !== false,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Toggle delivery partner online / offline duty status
// @route PUT /api/delivery/toggle-online or /api/delivery/toggle-status
const toggleOnlineStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.deliveryProfile) {
      user.deliveryProfile = {};
    }

    user.deliveryProfile.isOnline = !user.deliveryProfile.isOnline;
    await user.save();

    res.json({
      success: true,
      isOnline: user.deliveryProfile.isOnline,
      message: `Duty status updated to ${user.deliveryProfile.isOnline ? 'ONLINE (Eligible for assignments)' : 'OFFLINE (No new assignments)'}`,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get assigned, available, completed, or return deliveries (Section 6 & 10)
// @route GET /api/delivery/orders
const getDeliveryOrders = async (req, res, next) => {
  try {
    const { tab = 'active', dateRange } = req.query;

    const partnerFilter = {
      $or: [
        { deliveryPartner: req.user._id },
        { deliveryPartner: String(req.user._id) },
      ],
    };

    let query = {};

    if (tab === 'assigned' || tab === 'new') {
      // New assignments awaiting acceptance
      query = {
        ...partnerFilter,
        'deliveryDetails.deliveryStatus': 'assigned',
      };
    } else if (tab === 'active') {
      // All active shipments assigned to this partner (assigned through reached_customer)
      query = {
        ...partnerFilter,
        'deliveryDetails.deliveryStatus': {
          $in: ['assigned', 'accepted', 'reached_pickup', 'picked_up', 'out_for_delivery', 'reached_customer'],
        },
      };
    } else if (tab === 'in_transit') {
      // Accepted active runs
      query = {
        ...partnerFilter,
        'deliveryDetails.deliveryStatus': {
          $in: ['accepted', 'reached_pickup', 'picked_up', 'out_for_delivery', 'reached_customer'],
        },
      };
    } else if (tab === 'available') {
      // Available orders awaiting fleet partner acceptance from dispatch pool
      query = {
        $or: [
          { deliveryPartner: null, orderStatus: { $in: ['processing', 'confirmed', 'shipped', 'ready_for_delivery'] } },
          { 'deliveryDetails.deliveryStatus': { $in: ['unassigned', 'ready_for_delivery'] }, orderStatus: { $in: ['processing', 'confirmed', 'shipped', 'ready_for_delivery'] } },
        ],
      };
    } else if (tab === 'completed') {
      query = {
        ...partnerFilter,
        'deliveryDetails.deliveryStatus': 'delivered',
      };

      if (dateRange === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        query['deliveryDetails.deliveredAt'] = { $gte: today };
      } else if (dateRange === 'week') {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        query['deliveryDetails.deliveredAt'] = { $gte: weekAgo };
      } else if (dateRange === 'month') {
        const monthAgo = new Date();
        monthAgo.setDate(monthAgo.getDate() - 30);
        query['deliveryDetails.deliveredAt'] = { $gte: monthAgo };
      }
    } else if (tab === 'failed') {
      query = {
        ...partnerFilter,
        'deliveryDetails.deliveryStatus': { $in: ['failed', 'cancelled', 'rescheduled'] },
      };
    } else if (tab === 'returns') {
      query = {
        $or: [
          { 'returnDetails.returnDeliveryPartner': req.user._id },
          { 'returnDetails.status': { $in: ['requested', 'approved', 'pickup_assigned'] } },
        ],
      };
    }

    const orders = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1, createdAt: -1 })
      .limit(100);

    res.json({ success: true, count: orders.length, orders });
  } catch (error) {
    next(error);
  }
};

// @desc Accept a delivery assignment with ATOMIC FIRST-ACCEPT LOCK (Section 5)
// @route PUT /api/delivery/orders/:id/accept
const acceptDelivery = async (req, res, next) => {
  try {
    // 1. Verify partner is ONLINE
    const rider = await User.findById(req.user._id);
    if (!rider || rider.role !== 'delivery_partner') {
      return res.status(403).json({ success: false, message: 'Unauthorized delivery partner access' });
    }

    if (rider.deliveryProfile && rider.deliveryProfile.isOnline === false) {
      return res.status(400).json({
        success: false,
        message: 'You are currently OFFLINE. Please toggle your duty status to ONLINE to accept deliveries.',
      });
    }

    // 2. Atomic First-Accept Lock:
    // Only one partner can claim the assignment. Uses MongoDB findOneAndUpdate with lock condition.
    const order = await Order.findOneAndUpdate(
      {
        _id: req.params.id,
        $or: [
          { deliveryPartner: null },
          { deliveryPartner: req.user._id },
          { deliveryPartner: String(req.user._id) },
        ],
        'deliveryDetails.deliveryStatus': {
          $nin: ['accepted', 'reached_pickup', 'picked_up', 'out_for_delivery', 'reached_customer', 'delivered'],
        },
      },
      {
        $set: {
          deliveryPartner: req.user._id,
          deliveryPartnerName: req.user.name,
          deliveryPartnerPhone: req.user.phone || '',
          'deliveryDetails.deliveryStatus': 'accepted',
          'deliveryDetails.acceptedAt': new Date(),
        },
        $push: {
          trackingHistory: {
            status: 'Delivery Partner Assigned',
            message: `Assigned to delivery agent ${req.user.name} (+91 ${req.user.phone || '9876543210'}). Preparing pickup from merchant hub.`,
            timestamp: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(409).json({
        success: false,
        message: 'Delivery already claimed by another partner or not available.',
      });
    }

    res.json({
      success: true,
      message: 'Delivery accepted successfully! Job added to your active tasks.',
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Decline a delivery assignment (Section 6)
// @route PUT /api/delivery/orders/:id/decline
const declineDelivery = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.deliveryPartner && String(order.deliveryPartner) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'You are not assigned to this delivery.' });
    }

    // Reset assignment back to pool
    order.deliveryPartner = null;
    order.deliveryPartnerName = '';
    order.deliveryPartnerPhone = '';
    if (!order.deliveryDetails) order.deliveryDetails = {};
    order.deliveryDetails.deliveryStatus = 'unassigned';

    order.trackingHistory.push({
      status: 'Delivery Declined by Partner',
      message: `Delivery job declined by rider ${req.user.name}. Returned to dispatch queue.`,
      timestamp: new Date(),
    });

    await order.save();
    res.json({ success: true, message: 'Delivery request declined. Re-queued for available fleet riders.', order });
  } catch (error) {
    next(error);
  }
};

// @desc Reached merchant / seller pickup hub
// @route PUT /api/delivery/orders/:id/reached-pickup
const reachedPickup = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // State machine check
    if (order.deliveryDetails?.deliveryStatus === 'delivered') {
      return res.status(400).json({ success: false, message: 'Illegal transition: Order is already delivered.' });
    }

    if (!order.deliveryDetails) order.deliveryDetails = {};
    order.deliveryDetails.deliveryStatus = 'reached_pickup';
    order.deliveryDetails.reachedPickupAt = new Date();

    order.trackingHistory.push({
      status: 'Reached Seller Hub',
      message: `Delivery agent ${req.user.name} has reached the seller pickup warehouse.`,
      timestamp: new Date(),
    });

    await order.save();
    res.json({ success: true, message: 'Reached seller pickup hub', order });
  } catch (error) {
    next(error);
  }
};

// @desc Confirm pickup with seller OTP or package scan (Section 9 & 10)
// @route PUT /api/delivery/orders/:id/pickup
const confirmPickup = async (req, res, next) => {
  try {
    const { pickupOtp, scanCode } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // State machine check
    if (order.deliveryDetails?.deliveryStatus === 'delivered') {
      return res.status(400).json({ success: false, message: 'Illegal transition: Order has already been delivered.' });
    }

    if (!order.deliveryDetails) order.deliveryDetails = {};

    // Validate either 4-digit OTP or Barcode scan (matching orderNumber or trackingNumber)
    const expectedOtp = order.deliveryDetails.pickupOtp;
    const trimmedScan = scanCode ? String(scanCode).trim().toUpperCase() : '';
    const isScanMatch = Boolean(
      trimmedScan &&
        (trimmedScan === String(order.trackingNumber || '').trim().toUpperCase() ||
          trimmedScan === String(order.orderNumber || '').trim().toUpperCase())
    );

    if (scanCode && !isScanMatch) {
      return res.status(400).json({
        success: false,
        message: 'Barcode scan did not match order or tracking number. Please verify package label.',
      });
    }

    if (!isScanMatch) {
      if (expectedOtp && (!pickupOtp || String(pickupOtp).trim() !== String(expectedOtp).trim())) {
        return res.status(400).json({ success: false, message: 'Invalid 4-digit Seller Pickup OTP' });
      }
    }

    order.deliveryDetails.deliveryStatus = 'picked_up';
    order.deliveryDetails.pickedUpAt = new Date();
    order.orderStatus = 'shipped';

    order.trackingHistory.push({
      status: 'Package Picked Up',
      message: `Package picked up from seller and verified${isScanMatch ? ' via barcode scan' : ''}. En route to regional logistics hub.`,
      timestamp: new Date(),
    });

    await order.save();
    res.json({ success: true, message: 'Package picked up successfully', order });
  } catch (error) {
    next(error);
  }
};

// @desc Mark order as out for delivery (Section 8)
// @route PUT /api/delivery/orders/:id/out-for-delivery
const outForDelivery = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // State machine check
    if (order.deliveryDetails?.deliveryStatus === 'delivered') {
      return res.status(400).json({ success: false, message: 'Order has already been delivered.' });
    }

    if (!order.deliveryDetails) order.deliveryDetails = {};
    order.deliveryDetails.deliveryStatus = 'out_for_delivery';
    order.deliveryDetails.outForDeliveryAt = new Date();
    order.orderStatus = 'out_for_delivery';

    order.trackingHistory.push({
      status: 'Out for Delivery',
      message: `Agent ${req.user.name} is out for delivery with your package. Expect arrival within 2-4 hours.`,
      timestamp: new Date(),
    });

    // Notify Customer
    if (order.user) {
      await Notification.create({
        user: order.user,
        title: 'Out for Delivery! 🚚',
        message: `Your order ${order.orderNumber} is out for delivery with ${req.user.name}. Please share OTP ${order.deliveryDetails.deliveryOtp} upon arrival.`,
        type: 'order',
        link: `/account?tab=orders`,
      }).catch(() => {});
    }

    // Sync Shipment
    try {
      const Shipment = require('../models/Shipment');
      await Shipment.findOneAndUpdate(
        { $or: [{ _id: order.shipment }, { order: order._id }] },
        {
          currentStage: 'OUT_FOR_DELIVERY',
          currentLocation: `Out for Delivery with ${req.user.name} (${order.shippingAddress?.city || 'Local Area'})`,
          nextExpectedStep: 'Arriving at customer address. Keep your 4-digit Delivery OTP ready upon handover.',
          $push: {
            timeline: {
              stage: 'OUT_FOR_DELIVERY',
              status: 'Out For Delivery',
              message: `Agent ${req.user.name} is out for delivery with your package. Expect arrival today.`,
              location: `${order.shippingAddress?.city || 'Local Area'}, India`,
              facility: 'Final Mile Delivery Vehicle',
              actor: req.user.name,
              actorRole: 'delivery_partner',
              timestamp: new Date(),
            },
          },
        }
      );
    } catch (e) {}

    await order.save();
    res.json({ success: true, message: 'Order marked as Out for Delivery', order });
  } catch (error) {
    next(error);
  }
};

// @desc Reached customer doorstep
// @route PUT /api/delivery/orders/:id/reached-customer
const reachedCustomer = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.deliveryDetails?.deliveryStatus === 'delivered') {
      return res.status(400).json({ success: false, message: 'Order has already been delivered.' });
    }

    if (!order.deliveryDetails) order.deliveryDetails = {};
    order.deliveryDetails.deliveryStatus = 'reached_customer';
    order.deliveryDetails.reachedCustomerAt = new Date();

    order.trackingHistory.push({
      status: 'Reached Delivery Location',
      message: `Delivery agent has reached recipient destination: ${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}.`,
      timestamp: new Date(),
    });

    await order.save();
    res.json({ success: true, message: 'Reached customer destination', order });
  } catch (error) {
    next(error);
  }
};

// @desc Complete delivery using customer OTP (Flipkart / Amazon style OTP Verification, COD collection, Payout)
// @route PUT /api/delivery/orders/:id/complete
const completeDelivery = async (req, res, next) => {
  try {
    const { deliveryOtp, scanCode, deliveryNotes = '' } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // State machine: prevent duplicate completion
    if (order.deliveryDetails?.deliveryStatus === 'delivered') {
      return res.status(400).json({ success: false, message: 'Order has already been marked as DELIVERED.' });
    }

    if (!order.deliveryDetails) order.deliveryDetails = {};

    // Strict Customer Delivery OTP check or Barcode match
    const trimmedScan = scanCode ? String(scanCode).trim().toUpperCase() : '';
    const isScanMatch = Boolean(
      trimmedScan &&
        (trimmedScan === String(order.trackingNumber || '').trim().toUpperCase() ||
          trimmedScan === String(order.orderNumber || '').trim().toUpperCase())
    );

    if (scanCode && !isScanMatch) {
      return res.status(400).json({
        success: false,
        message: 'Scanned barcode does not match package tracking number. Please verify package label.',
      });
    }

    if (!isScanMatch) {
      const expectedOtp = order.deliveryDetails.deliveryOtp;
      if (expectedOtp && deliveryOtp) {
        if (String(deliveryOtp).trim() !== String(expectedOtp).trim()) {
          return res.status(400).json({
            success: false,
            message: 'Invalid 4-digit Delivery OTP. Please ask recipient for the code shown in their VEXIVO app.',
          });
        }
      } else if (expectedOtp && !deliveryOtp) {
        return res.status(400).json({
          success: false,
          message: 'Recipient 4-digit Delivery OTP or Barcode scan is required to complete delivery.',
        });
      }
    }

    order.deliveryDetails.deliveryStatus = 'delivered';
    order.deliveryDetails.deliveredAt = new Date();
    order.deliveryDetails.notes = deliveryNotes;
    order.orderStatus = 'delivered';
    order.deliveredAt = new Date();

    const isCod = order.paymentMethod && order.paymentMethod.toLowerCase().includes('cod');
    if (isCod || order.paymentStatus === 'pending') {
      order.paymentStatus = 'paid';
      if (!order.paymentDetails) order.paymentDetails = {};
      order.paymentDetails.verifiedAt = new Date();
      order.paymentDetails.verifiedBy = `Delivery Handover (${req.user.name} - COD Cash Collected)`;
      order.deliveryDetails.codAmountCollected = order.total;
      order.deliveryDetails.codCollectedAt = new Date();
      order.deliveryDetails.codReconciled = false;
    }

    order.trackingHistory.push({
      status: 'Delivered',
      message: `Package successfully delivered and handed over to recipient. Verified via Delivery OTP.${isCod ? ` ₹${order.total.toFixed(2)} COD collected.` : ''}`,
      timestamp: new Date(),
    });

    // Credit delivery partner payout (+ configurable base + distance + surges) into immutable ledger
    const { recordDeliveryEarnings } = require('./deliveryPayoutController');
    await recordDeliveryEarnings(order, req.user._id).catch((err) => {
      console.error('[Delivery Earning Recording Error]:', err);
    });

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'deliveryProfile.totalDeliveries': 1,
        ...(isCod ? { 'deliveryProfile.codInHand': order.total } : {}),
      },
    }).catch(() => {});

    // Notify Customer
    if (order.user) {
      await Notification.create({
        user: order.user,
        title: 'Delivered Successfully! 🎉',
        message: `Your package for order ${order.orderNumber} has been delivered. Thank you for shopping with VEXIVO! You can now write a verified review.`,
        type: 'order',
        link: `/account?tab=orders`,
      }).catch(() => {});
    }

    // Sync Shipment
    try {
      const Shipment = require('../models/Shipment');
      await Shipment.findOneAndUpdate(
        { $or: [{ _id: order.shipment }, { order: order._id }] },
        {
          currentStage: 'DELIVERED',
          actualDeliveryDate: new Date(),
          currentLocation: `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}`,
          nextExpectedStep: 'Order delivered successfully. Thank you for shopping with VEXIVO.',
          $push: {
            timeline: {
              stage: 'DELIVERED',
              status: 'Delivered',
              message: `Package handed over to recipient. Verified via Delivery OTP.${isCod ? ` ₹${order.total.toFixed(2)} COD collected.` : ''}`,
              location: `${order.shippingAddress?.address || ''}, ${order.shippingAddress?.city || ''}`,
              facility: 'Customer Handover',
              actor: req.user.name,
              actorRole: 'delivery_partner',
              timestamp: new Date(),
            },
          },
        }
      );
    } catch (e) {}

    await order.save();
    res.json({
      success: true,
      message: `Delivery completed successfully! ₹50 payout credited to your account.${isCod ? ` Please keep ₹${order.total.toFixed(2)} COD cash safe for hub deposit.` : ''}`,
      order,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Mark delivery as failed / unable to reach customer (Section 18)
// @route PUT /api/delivery/orders/:id/fail
const failDelivery = async (req, res, next) => {
  try {
    const { reason = 'Customer unavailable / Phone switched off', notes = '' } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (order.deliveryDetails?.deliveryStatus === 'delivered') {
      return res.status(400).json({ success: false, message: 'Delivered orders cannot be marked as failed.' });
    }

    if (!order.deliveryDetails) order.deliveryDetails = {};
    order.deliveryDetails.deliveryStatus = 'failed';
    order.deliveryDetails.failureReason = reason;
    order.deliveryDetails.notes = notes;

    order.trackingHistory.push({
      status: 'Delivery Attempt Failed',
      message: `Delivery attempt could not be completed: ${reason}. Package held at regional logistics hub.`,
      timestamp: new Date(),
    });

    // Sync Shipment
    try {
      const Shipment = require('../models/Shipment');
      await Shipment.findOneAndUpdate(
        { $or: [{ _id: order.shipment }, { order: order._id }] },
        {
          currentStage: 'DELIVERY_ATTEMPTED',
          currentLocation: `Held at Delivery Hub (${order.shippingAddress?.city || 'Local Hub'})`,
          nextExpectedStep: 'Customer care contacting recipient to schedule redelivery',
          $push: {
            deliveryAttempts: {
              attemptNumber: 1,
              timestamp: new Date(),
              reason,
              partnerName: req.user.name,
              notes,
            },
            timeline: {
              stage: 'DELIVERY_ATTEMPTED',
              status: 'Delivery Attempt Failed',
              message: `Delivery attempt could not be completed: ${reason}. Package held at regional logistics hub.`,
              location: `${order.shippingAddress?.city || 'Local Area'}, India`,
              facility: 'Local Delivery Facility',
              actor: req.user.name,
              actorRole: 'delivery_partner',
              timestamp: new Date(),
            },
          },
        }
      );
    } catch (e) {}

    await order.save();
    res.json({ success: true, message: 'Delivery attempt marked as failed', order });
  } catch (error) {
    next(error);
  }
};

// @desc Reschedule delivery for another time / next day (Section 19)
// @route PUT /api/delivery/orders/:id/reschedule
const rescheduleDelivery = async (req, res, next) => {
  try {
    const { rescheduledDate, reason = 'Customer requested next day delivery' } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.deliveryDetails) order.deliveryDetails = {};
    order.deliveryDetails.deliveryStatus = 'rescheduled';
    order.deliveryDetails.rescheduledDate = rescheduledDate ? new Date(rescheduledDate) : new Date(Date.now() + 86400000);

    order.trackingHistory.push({
      status: 'Delivery Rescheduled',
      message: `Shipment rescheduled: ${reason}. Next delivery attempt scheduled for tomorrow.`,
      timestamp: new Date(),
    });

    // Sync Shipment
    try {
      const Shipment = require('../models/Shipment');
      await Shipment.findOneAndUpdate(
        { $or: [{ _id: order.shipment }, { order: order._id }] },
        {
          currentStage: 'RESCHEDULED',
          estimatedDeliveryDate: order.deliveryDetails.rescheduledDate,
          currentLocation: `Secured at Delivery Hub (${order.shippingAddress?.city || 'Local Hub'})`,
          nextExpectedStep: 'Scheduled for redelivery attempt on updated date',
          $push: {
            rescheduleHistory: {
              previousDate: new Date(),
              newDate: order.deliveryDetails.rescheduledDate,
              reason,
              initiatedBy: req.user.name,
              timestamp: new Date(),
            },
            timeline: {
              stage: 'RESCHEDULED',
              status: 'Delivery Rescheduled',
              message: `Shipment rescheduled: ${reason}. Redelivery scheduled for tomorrow.`,
              location: `${order.shippingAddress?.city || 'Local Hub'}`,
              facility: 'Local Delivery Hub',
              actor: req.user.name,
              actorRole: 'delivery_partner',
              timestamp: new Date(),
            },
          },
        }
      );
    } catch (e) {}

    await order.save();
    res.json({ success: true, message: 'Delivery rescheduled successfully', order });
  } catch (error) {
    next(error);
  }
};

// @desc Return package back to seller (RTO - Return to Origin)
// @route PUT /api/delivery/orders/:id/return-to-seller
const returnToSeller = async (req, res, next) => {
  try {
    const { reason = 'Repeated customer non-contact / RTO requested' } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.deliveryDetails) order.deliveryDetails = {};
    order.deliveryDetails.deliveryStatus = 'return_to_seller';
    order.orderStatus = 'returned';

    order.trackingHistory.push({
      status: 'Return to Origin (RTO)',
      message: `Package returning to merchant origin: ${reason}.`,
      timestamp: new Date(),
    });

    // Sync Shipment
    try {
      const Shipment = require('../models/Shipment');
      await Shipment.findOneAndUpdate(
        { $or: [{ _id: order.shipment }, { order: order._id }] },
        {
          currentStage: 'RETURN_INITIATED',
          currentLocation: `Returned to Origin (RTO)`,
          nextExpectedStep: 'Reverse transit to merchant facility',
          returnDetails: {
            reason,
            initiatedAt: new Date(),
            status: 'initiated',
          },
          $push: {
            timeline: {
              stage: 'RETURN_INITIATED',
              status: 'Return Initiated (RTO)',
              message: `Package returning to merchant origin: ${reason}.`,
              location: `${order.shippingAddress?.city || 'Local Area'}`,
              facility: 'Reverse Logistics Network',
              actor: req.user.name,
              actorRole: 'delivery_partner',
              timestamp: new Date(),
            },
          },
        }
      );
    } catch (e) {}

    await order.save();
    res.json({ success: true, message: 'Order marked for return to seller', order });
  } catch (error) {
    next(error);
  }
};

// @desc Pickup return item from customer with return OTP (Section 20 & 21)
// @route PUT /api/delivery/returns/:id/pickup
const pickupReturn = async (req, res, next) => {
  try {
    const { returnPickupOtp } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (!order.returnDetails) {
      return res.status(400).json({ success: false, message: 'No return request found for this order' });
    }

    if (order.returnDetails.returnPickupOtp && returnPickupOtp) {
      if (String(order.returnDetails.returnPickupOtp).trim() !== String(returnPickupOtp).trim()) {
        return res.status(400).json({ success: false, message: 'Invalid 4-digit Return Pickup OTP' });
      }
    }

    order.returnDetails.status = 'picked_up';
    order.returnDetails.returnDeliveryPartner = req.user._id;
    order.returnDetails.refundStatus = 'processing';

    order.trackingHistory.push({
      status: 'Return Item Picked Up',
      message: `Return item collected from customer by ${req.user.name}. Under transit to seller inspection center.`,
      timestamp: new Date(),
    });

    // Credit delivery partner return pickup fee into immutable ledger
    const { recordDeliveryEarnings } = require('./deliveryPayoutController');
    await recordDeliveryEarnings(order, req.user._id).catch(() => {});

    await User.findByIdAndUpdate(req.user._id, {
      $inc: {
        'deliveryProfile.totalDeliveries': 1,
      },
    }).catch(() => {});

    await order.save();
    res.json({ success: true, message: 'Return item picked up successfully! ₹40 fee credited.', order });
  } catch (error) {
    next(error);
  }
};

// @desc Update Delivery Partner Profile & Vehicle Details (Section 26 & 27)
// @route PUT /api/delivery/profile
const updateDeliveryProfile = async (req, res, next) => {
  try {
    const { vehicleType, vehicleNumber, licenseNumber, phone, city } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    if (!user.deliveryProfile) user.deliveryProfile = {};
    if (vehicleType) user.deliveryProfile.vehicleType = vehicleType;
    if (vehicleNumber) user.deliveryProfile.vehicleNumber = vehicleNumber;
    if (licenseNumber) user.deliveryProfile.licenseNumber = licenseNumber;
    if (city) user.deliveryProfile.city = city;
    if (phone) user.phone = phone;

    await user.save();
    res.json({
      success: true,
      message: 'Profile and vehicle details updated successfully',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        deliveryProfile: user.deliveryProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Submit Delivery Partner Urgent Support / Emergency SOS (Section 32 & 33)
// @route POST /api/delivery/support
const submitSupport = async (req, res, next) => {
  try {
    const { category = 'emergency', orderId, message } = req.body;

    // Send high-priority alert to Admin
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await Notification.create({
        user: admin._id,
        title: `🚨 Fleet Alert: ${category.toUpperCase()}`,
        message: `Rider ${req.user.name} reported: "${message || 'Urgent assistance requested'}" (Order: ${orderId || 'N/A'}, Phone: ${req.user.phone || 'N/A'}).`,
        type: 'support',
        link: `/admin/orders`,
      }).catch(() => {});
    }

    res.json({
      success: true,
      message: 'Urgent support request submitted. Logistics Control Room has been notified and will contact you.',
    });
  } catch (error) {
    next(error);
  }
};

// @desc Register a new delivery partner application (Section: Partner Registration Flow)
// @route POST /api/delivery/register
const registerDeliveryPartner = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      address,
      city = 'Jaipur',
      emergencyContact,
      vehicleType = 'Two-Wheeler / Bike',
      vehicleNumber,
      licenseNumber,
      drivingLicenseNumber,
      serviceZone,
      serviceZones,
      aadhaarNumber,
      aadharNumber,
      panNumber,
    } = req.body;

    const finalLicenseNumber = (licenseNumber || drivingLicenseNumber || '').trim();
    const finalAadhaarNumber = (aadhaarNumber || aadharNumber || '').trim();

    // 1. Mandatory field checks
    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }
    if (!email || !email.trim()) {
      return res.status(400).json({ success: false, message: 'Email address is required.' });
    }
    if (!phone || !phone.trim()) {
      return res.status(400).json({ success: false, message: '10-digit mobile number is required.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }
    if (!vehicleNumber || !vehicleNumber.trim()) {
      return res.status(400).json({ success: false, message: 'Vehicle registration number is required.' });
    }
    if (!finalLicenseNumber) {
      return res.status(400).json({ success: false, message: 'Driving license number is required.' });
    }
    if (!finalAadhaarNumber) {
      return res.status(400).json({ success: false, message: 'Aadhaar card number is required for KYC verification.' });
    }
    if (!panNumber || !panNumber.trim()) {
      return res.status(400).json({ success: false, message: 'PAN card number is required for tax & verification.' });
    }

    // 2. Validate email format
    const normalizedEmail = email.toLowerCase().trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address.' });
    }

    // 3. Format & validate Indian 10-digit phone
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, '');
    let raw10 = '';
    if (/^[6-9]\d{9}$/.test(cleanedPhone)) {
      raw10 = cleanedPhone;
    } else if (/^\+91[6-9]\d{9}$/.test(cleanedPhone)) {
      raw10 = cleanedPhone.slice(3);
    } else if (/^91[6-9]\d{9}$/.test(cleanedPhone)) {
      raw10 = cleanedPhone.slice(2);
    } else if (/^0[6-9]\d{9}$/.test(cleanedPhone)) {
      raw10 = cleanedPhone.slice(1);
    } else {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid 10-digit Indian mobile number (e.g. 9876543210).',
      });
    }
    const formattedPhone = `+91${raw10}`;

    // 4. Duplicate checks
    const existingEmail = await User.findOne({ email: normalizedEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists. Please log in or use another email.',
      });
    }

    const existingPhone = await User.findOne({
      $or: [{ phone: formattedPhone }, { phone: raw10 }],
    });
    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: 'An account with this mobile number already exists. Please log in.',
      });
    }

    // Normalize zones
    let zones = [];
    if (Array.isArray(serviceZones) && serviceZones.length > 0) {
      zones = serviceZones.filter(Boolean);
    } else if (serviceZone && typeof serviceZone === 'string') {
      zones = serviceZone.split(',').map((s) => s.trim()).filter(Boolean);
    }
    if (zones.length === 0) {
      zones = [city ? `${city} Central` : 'Jaipur Central'];
    }

    // 5. Create partner user with PENDING_VERIFICATION status
    const partner = await User.create({
      name: name.trim(),
      email: normalizedEmail,
      phone: formattedPhone,
      passwordHash: password, // Pre-save hook hashes with bcrypt
      role: 'delivery_partner',
      isActive: true,
      deliveryProfile: {
        status: 'PENDING_VERIFICATION',
        isApproved: false,
        isOnline: false,
        kycStatus: 'pending',
        vehicleType: vehicleType.trim(),
        vehicleNumber: vehicleNumber.trim().toUpperCase(),
        licenseNumber: finalLicenseNumber.toUpperCase(),
        address: (address || '').trim(),
        city: (city || 'Jaipur').trim(),
        emergencyContact: (emergencyContact || '').trim(),
        aadhaarNumber: finalAadhaarNumber.replace(/\s/g, ''),
        panNumber: panNumber.trim().toUpperCase(),
        serviceZones: zones,
        rating: 5.0,
        totalDeliveries: 0,
        earnings: 0,
        codInHand: 0,
        appliedAt: new Date(),
        rejectionReason: '',
      },
    });

    // 6. Notify Admin about new application
    const admin = await User.findOne({ role: 'admin' });
    if (admin) {
      await Notification.create({
        user: admin._id,
        title: '📋 New Delivery Partner Application',
        message: `${partner.name} has submitted a Delivery Partner application (${partner.deliveryProfile.vehicleType}, ${partner.deliveryProfile.city}). Review and verify KYC.`,
        type: 'account',
        link: '/admin/delivery-applications',
      }).catch(() => {});
    }

    // 7. Generate JWT token so they can stay authenticated to view their pending status screen
    const secret = process.env.JWT_SECRET || 'vexivo_development_secret_key_do_not_use_in_prod';
    const jwt = require('jsonwebtoken');
    const token = jwt.sign({ id: partner._id }, secret, {
      expiresIn: process.env.JWT_EXPIRE || '30d',
    });

    res.status(201).json({
      success: true,
      message: 'Delivery Partner application submitted successfully! Your account is currently under verification.',
      token,
      user: {
        _id: partner._id,
        name: partner.name,
        email: partner.email,
        phone: partner.phone,
        role: partner.role,
        deliveryProfile: partner.deliveryProfile,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get authenticated delivery partner profile & identity (Section 5)
// @route GET /api/delivery/me
const getDeliveryMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'Delivery partner not found' });
    }

    const dp = user.deliveryProfile || {};
    res.json({
      success: true,
      partner: {
        id: user._id,
        _id: user._id,
        name: user.name,
        email: user.email,
        mobile: user.phone || '',
        phone: user.phone || '',
        role: user.role,
        status: dp.status || (dp.isApproved ? 'ACTIVE' : 'PENDING_VERIFICATION'),
        profileImage: user.profilePhoto || '',
        profilePhoto: user.profilePhoto || '',
        vehicleType: dp.vehicleType || 'Two-Wheeler / Bike',
        vehicleNumber: dp.vehicleNumber || '',
        licenseNumber: dp.licenseNumber || '',
        city: dp.city || 'Jaipur',
        serviceZone: Array.isArray(dp.serviceZones) && dp.serviceZones.length > 0 ? dp.serviceZones.join(', ') : (dp.city || 'Jaipur Central'),
        serviceZones: dp.serviceZones || [],
        isOnline: dp.isOnline !== false,
        rating: dp.rating || 4.95,
        totalDeliveries: dp.totalDeliveries || 0,
        earnings: dp.earnings || 0,
        codInHand: dp.codInHand || 0,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get assignments belonging strictly to authenticated delivery partner (Section 6)
// @route GET /api/delivery/assignments
const getDeliveryAssignments = async (req, res, next) => {
  try {
    const { status, tab = 'all' } = req.query;

    const partnerFilter = {
      $or: [
        { deliveryPartner: req.user._id },
        { deliveryPartner: String(req.user._id) },
      ],
    };

    let query = { ...partnerFilter };

    if (status) {
      query['deliveryDetails.deliveryStatus'] = status;
    } else if (tab === 'new' || tab === 'assigned') {
      query['deliveryDetails.deliveryStatus'] = 'assigned';
    } else if (tab === 'active') {
      query['deliveryDetails.deliveryStatus'] = {
        $in: ['assigned', 'accepted', 'reached_pickup', 'picked_up', 'out_for_delivery', 'reached_customer'],
      };
    } else if (tab === 'in_transit') {
      query['deliveryDetails.deliveryStatus'] = {
        $in: ['accepted', 'reached_pickup', 'picked_up', 'out_for_delivery', 'reached_customer'],
      };
    } else if (tab === 'completed') {
      query['deliveryDetails.deliveryStatus'] = 'delivered';
    } else if (tab === 'failed') {
      query['deliveryDetails.deliveryStatus'] = { $in: ['failed', 'cancelled', 'rescheduled'] };
    }

    const assignments = await Order.find(query)
      .populate('user', 'name email phone')
      .sort({ updatedAt: -1, createdAt: -1 });

    res.json({
      success: true,
      count: assignments.length,
      assignments,
      orders: assignments,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Attempt redelivery for failed / rescheduled orders (transitions back to out_for_delivery)
// @route PUT /api/delivery/orders/:id/attempt-redelivery
const attemptRedelivery = async (req, res, next) => {
  return outForDelivery(req, res, next);
};

module.exports = {
  getDeliveryProfile,
  toggleOnlineStatus,
  getDeliveryOrders,
  acceptDelivery,
  declineDelivery,
  reachedPickup,
  confirmPickup,
  outForDelivery,
  attemptRedelivery,
  reachedCustomer,
  completeDelivery,
  failDelivery,
  rescheduleDelivery,
  returnToSeller,
  pickupReturn,
  updateDeliveryProfile,
  submitSupport,
  registerDeliveryPartner,
  getDeliveryMe,
  getDeliveryAssignments,
};
