const mongoose = require('mongoose');
const crypto = require('crypto');
const User = require('../models/User');
const Order = require('../models/Order');
const DeliveryEarningLedger = require('../models/DeliveryEarningLedger');
const DeliveryPayout = require('../models/DeliveryPayout');
const DeliveryPayoutConfig = require('../models/DeliveryPayoutConfig');
const razorpayxService = require('../services/razorpayxService');

/**
 * Record earnings safely into immutable ledger upon delivery completion
 * Guaranteed duplicate-prevention via compound uniqueness
 */
const recordDeliveryEarnings = async (order, deliveryPartnerId) => {
  if (!order || !deliveryPartnerId) return null;

  const partner = await User.findById(deliveryPartnerId);
  if (!partner) return null;

  const config = await DeliveryPayoutConfig.getEffectiveConfig();

  const isReturn =
    order.returnDetails?.status === 'picked_up' ||
    order.orderStatus === 'returned' ||
    order.orderStatus === 'return_in_transit';

  const baseRate = isReturn ? config.returnPickupFee : config.baseDeliveryFee;
  const ledgerEntries = [];

  // 1. Base Delivery / Return Pickup Fee
  try {
    const baseEntry = await DeliveryEarningLedger.create({
      deliveryPartner: partner._id,
      order: order._id,
      orderNumber: order.orderNumber,
      type: isReturn ? 'return_pickup' : 'delivery_base',
      amount: baseRate,
      description: isReturn
        ? `Customer Return Doorstep Pickup: #${order.orderNumber}`
        : `Order Delivery Payout: #${order.orderNumber}`,
      metadata: {
        isCod: Boolean(order.paymentMethod && order.paymentMethod.toLowerCase().includes('cod')),
        codAmount: order.total || 0,
        baseRate,
      },
      status: 'eligible',
    });
    ledgerEntries.push(baseEntry);
  } catch (dupErr) {
    // Duplicate detected by unique index — ignore to prevent double credits
    if (dupErr.code !== 11000) {
      console.error('[Delivery Ledger] Base entry error:', dupErr);
    }
  }

  // 2. Weather Rain Surge (if enabled/applicable)
  if (config.rainSurgeFee > 0 && order.deliveryDetails?.weatherSurgeApplied) {
    try {
      const surgeEntry = await DeliveryEarningLedger.create({
        deliveryPartner: partner._id,
        order: order._id,
        orderNumber: order.orderNumber,
        type: 'rain_surge',
        amount: config.rainSurgeFee,
        description: `Adverse Weather / Rain Delivery Surge: #${order.orderNumber}`,
        metadata: { surgeRate: config.rainSurgeFee },
        status: 'eligible',
      });
      ledgerEntries.push(surgeEntry);
    } catch (dupErr) {
      if (dupErr.code !== 11000) console.error('[Delivery Ledger] Surge error:', dupErr);
    }
  }

  // 3. Distance Incentive (for deliveries beyond distance threshold)
  const distanceKm = Number(order.deliveryDetails?.estimatedDistanceKm || 0);
  if (distanceKm > config.distanceThresholdKm && config.distanceRatePerKm > 0) {
    const excessKm = distanceKm - config.distanceThresholdKm;
    const distanceBonus = Math.round(excessKm * config.distanceRatePerKm * 100) / 100;
    if (distanceBonus > 0) {
      try {
        const distEntry = await DeliveryEarningLedger.create({
          deliveryPartner: partner._id,
          order: order._id,
          orderNumber: order.orderNumber,
          type: 'distance_incentive',
          amount: distanceBonus,
          description: `Long Distance Transit Incentive (${distanceKm.toFixed(1)} km): #${order.orderNumber}`,
          metadata: { distanceKm, incentiveRate: config.distanceRatePerKm },
          status: 'eligible',
        });
        ledgerEntries.push(distEntry);
      } catch (dupErr) {
        if (dupErr.code !== 11000) console.error('[Delivery Ledger] Distance incentive error:', dupErr);
      }
    }
  }

  // Sum newly credited earnings and sync partner cached balances atomically
  const totalCredited = ledgerEntries.reduce((sum, item) => sum + item.amount, 0);
  if (totalCredited > 0) {
    await User.findByIdAndUpdate(partner._id, {
      $inc: {
        'deliveryProfile.availablePayoutBalance': totalCredited,
        'deliveryProfile.earnings': totalCredited,
      },
    });
  }

  return ledgerEntries;
};

// @desc Get delivery partner earnings summary and eligibility status
// @route GET /api/delivery/earnings/summary
const getEarningsSummary = async (req, res, next) => {
  try {
    const partnerId = req.user._id;
    const partner = await User.findById(partnerId).select('deliveryProfile');
    const config = await DeliveryPayoutConfig.getEffectiveConfig();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const weekStart = new Date(now);
    weekStart.setDate(weekStart.getDate() - 7);
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // Sum today's earnings
    const todayAgg = await DeliveryEarningLedger.aggregate([
      {
        $match: {
          deliveryPartner: partnerId,
          createdAt: { $gte: todayStart },
          status: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const todayEarnings = todayAgg[0]?.total || 0;

    // Sum this week's earnings
    const weekAgg = await DeliveryEarningLedger.aggregate([
      {
        $match: {
          deliveryPartner: partnerId,
          createdAt: { $gte: weekStart },
          status: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const weekEarnings = weekAgg[0]?.total || 0;

    // Sum this month's earnings
    const monthAgg = await DeliveryEarningLedger.aggregate([
      {
        $match: {
          deliveryPartner: partnerId,
          createdAt: { $gte: monthStart },
          status: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const monthEarnings = monthAgg[0]?.total || 0;

    // Sum lifetime gross earnings
    const lifetimeAgg = await DeliveryEarningLedger.aggregate([
      {
        $match: {
          deliveryPartner: partnerId,
          status: { $ne: 'cancelled' },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const lifetimeEarnings = lifetimeAgg[0]?.total || 0;

    // Sum available eligible balance
    const availableAgg = await DeliveryEarningLedger.aggregate([
      {
        $match: {
          deliveryPartner: partnerId,
          status: 'eligible',
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const availablePayoutBalance = availableAgg[0]?.total || 0;

    // Sum pending/in-flight payouts
    const inFlightAgg = await DeliveryPayout.aggregate([
      {
        $match: {
          deliveryPartner: partnerId,
          status: { $in: ['pending', 'processing'] },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const processingPayouts = inFlightAgg[0]?.total || 0;

    // Sum total paid out
    const paidAgg = await DeliveryPayout.aggregate([
      {
        $match: {
          deliveryPartner: partnerId,
          status: 'paid',
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalPaid = paidAgg[0]?.total || 0;

    // Count failed payouts
    const failedPayoutsCount = await DeliveryPayout.countDocuments({
      deliveryPartner: partnerId,
      status: 'failed',
    });

    // Completed deliveries count
    const completedDeliveries = await Order.countDocuments({
      deliveryPartner: partnerId,
      'deliveryDetails.deliveryStatus': 'delivered',
    });

    const bankDetails = partner.deliveryProfile?.bankDetails || {};
    const hasBeneficiary = Boolean(
      (bankDetails.accountNumber && bankDetails.ifscCode) || bankDetails.upiId
    );

    // Evaluate Payout Eligibility Rules
    const isPaused = Boolean(config.isPayoutsPaused);
    const meetsThreshold = availablePayoutBalance >= config.minimumPayoutThreshold;
    const isEligible = !isPaused && meetsThreshold && hasBeneficiary;

    const ineligibilityReasons = [];
    if (isPaused) {
      ineligibilityReasons.push('Automated payouts are temporarily paused for maintenance.');
    }
    if (!meetsThreshold) {
      const remaining = config.minimumPayoutThreshold - availablePayoutBalance;
      ineligibilityReasons.push(
        `Minimum payout threshold is ₹${config.minimumPayoutThreshold}. Earn ₹${Math.max(0, remaining).toFixed(2)} more to become eligible.`
      );
    }
    if (!hasBeneficiary) {
      ineligibilityReasons.push('Please configure your verified Bank Account or UPI ID to receive payouts.');
    }

    res.json({
      success: true,
      summary: {
        todayEarnings,
        weekEarnings,
        monthEarnings,
        lifetimeEarnings,
        availablePayoutBalance,
        processingPayouts,
        totalPaid,
        failedPayoutsCount,
        completedDeliveries,
      },
      eligibility: {
        isEligible,
        meetsThreshold,
        hasBeneficiary,
        isPaused,
        minimumPayoutThreshold: config.minimumPayoutThreshold,
        payoutSchedule: config.payoutSchedule,
        allowManualWithdrawal: config.allowManualWithdrawal,
        reasons: ineligibilityReasons,
      },
      config: {
        baseDeliveryFee: config.baseDeliveryFee,
        returnPickupFee: config.returnPickupFee,
        rainSurgeFee: config.rainSurgeFee,
        festivalSurgeFee: config.festivalSurgeFee,
        distanceRatePerKm: config.distanceRatePerKm,
        onTimeSlaBonus: config.onTimeSlaBonus,
        minimumPayoutThreshold: config.minimumPayoutThreshold,
        payoutSchedule: config.payoutSchedule,
        tdsPercentage: config.tdsPercentage,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get paginated immutable earnings ledger for delivery partner
// @route GET /api/delivery/earnings/ledger
const getEarningsLedger = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = { deliveryPartner: req.user._id };
    if (req.query.status) {
      query.status = req.query.status;
    }
    if (req.query.type) {
      query.type = req.query.type;
    }

    const total = await DeliveryEarningLedger.countDocuments(query);
    const ledger = await DeliveryEarningLedger.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      ledger,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get payout transaction history for delivery partner
// @route GET /api/delivery/payouts
const getPayoutsHistory = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = { deliveryPartner: req.user._id };
    if (req.query.status) {
      query.status = req.query.status;
    }

    const total = await DeliveryPayout.countDocuments(query);
    const payouts = await DeliveryPayout.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      payouts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Request manual payout withdrawal
// @route POST /api/delivery/payouts/withdraw
const requestWithdrawal = async (req, res, next) => {
  try {
    const partnerId = req.user._id;
    const partner = await User.findById(partnerId);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Delivery partner not found.' });
    }

    const config = await DeliveryPayoutConfig.getEffectiveConfig();

    if (process.env.NODE_ENV === 'production' && !razorpayxService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Payout gateway is currently unconfigured in production mode. Payout requests are suspended.',
      });
    }

    if (config.isPayoutsPaused) {
      return res.status(403).json({
        success: false,
        message: 'Payouts are currently paused by administrator. Please try again later.',
      });
    }

    if (!config.allowManualWithdrawal) {
      return res.status(403).json({
        success: false,
        message: 'Manual withdrawal requests are not enabled. Payouts settle automatically per schedule.',
      });
    }

    const bank = partner.deliveryProfile?.bankDetails || {};
    const hasBank = Boolean((bank.accountNumber && bank.ifscCode) || bank.upiId);
    if (!hasBank) {
      return res.status(400).json({
        success: false,
        message: 'Please add and verify your Bank Account or UPI ID before requesting a payout.',
      });
    }

    // Atomic Fund Reservation: Find all currently eligible ledger items
    const eligibleEntries = await DeliveryEarningLedger.find({
      deliveryPartner: partnerId,
      status: 'eligible',
    });

    const grossEligible = eligibleEntries.reduce((sum, item) => sum + item.amount, 0);

    if (grossEligible < config.minimumPayoutThreshold) {
      return res.status(400).json({
        success: false,
        message: `Minimum withdrawal threshold is ₹${config.minimumPayoutThreshold}. Your current eligible balance is ₹${grossEligible.toFixed(2)}.`,
      });
    }

    // Calculate TDS & Net Payable Amount
    const tdsPercentage = config.tdsPercentage || 0;
    const tdsAmount = Math.round(((grossEligible * tdsPercentage) / 100) * 100) / 100;
    const netPayable = Math.max(1, Math.round((grossEligible - tdsAmount) * 100) / 100);

    const payoutNumber = `VEX-PO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    const idempotencyKey = `idemp_${partnerId}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

    // Mask bank account number for security (last 4 digits only)
    const maskedAccount = bank.accountNumber
      ? `••••••••${bank.accountNumber.slice(-4)}`
      : '';

    // Step 1: Create Payout record in 'pending' status
    const payout = await DeliveryPayout.create({
      payoutNumber,
      deliveryPartner: partnerId,
      amount: netPayable,
      grossEarnings: grossEligible,
      deductions: 0,
      tdsAmount,
      status: 'pending',
      mode: bank.upiId ? 'UPI' : 'IMPS',
      payoutType: 'manual_request',
      beneficiary: {
        accountHolderName: bank.accountHolderName || partner.name,
        accountNumberMasked: maskedAccount,
        ifscCode: bank.ifscCode || '',
        bankName: bank.bankName || '',
        upiId: bank.upiId || '',
        fundAccountId: bank.razorpayxFundAccountId || '',
        contactId: bank.razorpayxContactId || '',
      },
      provider: config.provider || 'razorpayx',
      idempotencyKey,
      earningsLedgerIds: eligibleEntries.map((e) => e._id),
      initiatedAt: new Date(),
    });

    // Step 2: Lock ledger items to prevent double-payouts
    await DeliveryEarningLedger.updateMany(
      { _id: { $in: eligibleEntries.map((e) => e._id) } },
      { status: 'locked_for_payout', payout: payout._id }
    );

    // Step 3: Update partner cached balances
    await User.findByIdAndUpdate(partnerId, {
      $inc: {
        'deliveryProfile.availablePayoutBalance': -grossEligible,
        'deliveryProfile.pendingPayoutAmount': netPayable,
      },
    });

    // Step 4: Dispatch Payout through RazorpayX
    try {
      payout.status = 'processing';
      await payout.save();

      // Ensure fund account exists if not saved yet
      let fundAccountId = bank.razorpayxFundAccountId;
      if (!fundAccountId) {
        const contact = await razorpayxService.createContact({
          name: bank.accountHolderName || partner.name,
          email: partner.email,
          phone: partner.phone,
          referenceId: String(partnerId),
        });

        const fundAccount = await razorpayxService.createFundAccount({
          contactId: contact.id,
          accountType: bank.upiId ? 'vpa' : 'bank_account',
          bankAccount: {
            name: bank.accountHolderName || partner.name,
            ifsc: bank.ifscCode,
            accountNumber: bank.accountNumber,
          },
          vpa: { address: bank.upiId },
        });

        fundAccountId = fundAccount.id;
        // Save for future payouts
        await User.findByIdAndUpdate(partnerId, {
          'deliveryProfile.bankDetails.razorpayxContactId': contact.id,
          'deliveryProfile.bankDetails.razorpayxFundAccountId': fundAccount.id,
        });
      }

      const providerPayout = await razorpayxService.createPayout({
        fundAccountId,
        amountRupees: netPayable,
        mode: bank.upiId ? 'UPI' : 'IMPS',
        referenceId: payoutNumber,
        narration: `VEXIVO PAYOUT ${payoutNumber.slice(-8)}`,
        idempotencyKey,
      });

      payout.providerReferenceId = providerPayout.id;
      payout.providerStatus = providerPayout.status || 'processing';

      // If RazorpayX confirmed immediate success
      if (providerPayout.status === 'processed') {
        payout.status = 'paid';
        payout.processedAt = new Date();
        await payout.save();

        await DeliveryEarningLedger.updateMany(
          { _id: { $in: eligibleEntries.map((e) => e._id) } },
          { status: 'paid' }
        );

        await User.findByIdAndUpdate(partnerId, {
          $inc: {
            'deliveryProfile.pendingPayoutAmount': -netPayable,
            'deliveryProfile.totalPaidOut': netPayable,
          },
        });
      } else {
        await payout.save();
      }

      res.status(201).json({
        success: true,
        message: 'Payout request initiated successfully. Funds are being transferred via bank gateway.',
        payout,
      });
    } catch (providerErr) {
      console.error('[Payout Provider Error]:', providerErr.message);

      // Financial Safety: On immediate provider rejection, safely unlock ledger and release funds
      payout.status = 'failed';
      payout.failureReason = providerErr.message || 'Payment gateway rejected payout request';
      await payout.save();

      await DeliveryEarningLedger.updateMany(
        { _id: { $in: eligibleEntries.map((e) => e._id) } },
        { status: 'eligible', payout: null }
      );

      await User.findByIdAndUpdate(partnerId, {
        $inc: {
          'deliveryProfile.availablePayoutBalance': grossEligible,
          'deliveryProfile.pendingPayoutAmount': -netPayable,
        },
      });

      return res.status(502).json({
        success: false,
        message: `Payout gateway error: ${providerErr.message}. Your earnings have been safely returned to your available balance.`,
        payoutId: payout._id,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Get delivery partner bank account / UPI destination details
// @route GET /api/delivery/bank-details
const getBankDetails = async (req, res, next) => {
  try {
    const partner = await User.findById(req.user._id).select('deliveryProfile.bankDetails');
    const details = partner?.deliveryProfile?.bankDetails || {};

    const maskedNumber = details.accountNumber
      ? `••••••••${details.accountNumber.slice(-4)}`
      : '';

    res.json({
      success: true,
      bankDetails: {
        accountHolderName: details.accountHolderName || '',
        accountNumberMasked: maskedNumber,
        hasAccountNumber: Boolean(details.accountNumber),
        ifscCode: details.ifscCode || '',
        bankName: details.bankName || '',
        upiId: details.upiId || '',
        isVerified: details.isVerified || false,
        verifiedAt: details.verifiedAt || null,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update delivery partner bank account / UPI destination details
// @route PUT /api/delivery/bank-details
const updateBankDetails = async (req, res, next) => {
  try {
    const { accountHolderName, accountNumber, ifscCode, bankName, upiId } = req.body;

    if (!accountHolderName || !accountHolderName.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Account holder legal name is required as per bank records.',
      });
    }

    if (!upiId && (!accountNumber || !ifscCode)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide either Bank Account Number + IFSC Code, or a valid UPI ID.',
      });
    }

    // Validate IFSC format if provided: 4 letters, 0, 6 alphanumeric (e.g. HDFC0001234, SBIN0000456)
    if (ifscCode) {
      const ifscRegex = /^[A-Z]{4}0[A-Z0-9]{6}$/i;
      if (!ifscRegex.test(ifscCode.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid IFSC code format. IFSC must be 11 characters (e.g., HDFC0001234, SBIN0000456).',
        });
      }
    }

    // Validate UPI ID if provided
    if (upiId) {
      const upiRegex = /^[a-zA-Z0-9.\-_]{2,256}@[a-zA-Z]{2,64}$/;
      if (!upiRegex.test(upiId.trim())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid UPI ID format. UPI ID must be in format name@bank (e.g. rider@okhdfcbank, 9876543210@paytm).',
        });
      }
    }

    const partner = await User.findById(req.user._id);
    if (!partner) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!partner.deliveryProfile) partner.deliveryProfile = {};
    if (!partner.deliveryProfile.bankDetails) partner.deliveryProfile.bankDetails = {};

    const b = partner.deliveryProfile.bankDetails;
    b.accountHolderName = accountHolderName.trim();
    if (accountNumber) b.accountNumber = accountNumber.trim();
    if (ifscCode) b.ifscCode = ifscCode.toUpperCase().trim();
    if (bankName) b.bankName = bankName.trim();
    if (upiId) b.upiId = upiId.toLowerCase().trim();
    b.isVerified = true;
    b.verifiedAt = new Date();

    // Reset RazorpayX fund account when bank credentials change
    b.razorpayxFundAccountId = '';

    await partner.save();

    res.json({
      success: true,
      message: 'Payout destination details updated and verified successfully.',
      bankDetails: {
        accountHolderName: b.accountHolderName,
        accountNumberMasked: b.accountNumber ? `••••••••${b.accountNumber.slice(-4)}` : '',
        ifscCode: b.ifscCode,
        bankName: b.bankName,
        upiId: b.upiId,
        isVerified: b.isVerified,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// ADMIN DASHBOARD CONTROLLERS
// ==========================================

// @desc Get overview metrics for logistics admin
// @route GET /api/admin/delivery-payouts/overview
const getAdminPayoutsOverview = async (req, res, next) => {
  try {
    const config = await DeliveryPayoutConfig.getEffectiveConfig();

    const totalDisbursedAgg = await DeliveryPayout.aggregate([
      { $match: { status: 'paid' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalDisbursed = totalDisbursedAgg[0]?.total || 0;

    const pendingVolumeAgg = await DeliveryPayout.aggregate([
      { $match: { status: { $in: ['pending', 'processing'] } } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const pendingVolume = pendingVolumeAgg[0]?.total || 0;

    const pendingCount = await DeliveryPayout.countDocuments({
      status: { $in: ['pending', 'processing'] },
    });

    const failedCount = await DeliveryPayout.countDocuments({ status: 'failed' });
    const paidCount = await DeliveryPayout.countDocuments({ status: 'paid' });

    const activeRidersCount = await User.countDocuments({
      role: 'delivery_partner',
      'deliveryProfile.status': { $in: ['ACTIVE', 'APPROVED'] },
    });

    res.json({
      success: true,
      metrics: {
        totalDisbursed,
        pendingVolume,
        pendingCount,
        failedCount,
        paidCount,
        activeRidersCount,
        isPaused: config.isPayoutsPaused,
        config,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get list of all payouts with filters for admin
// @route GET /api/admin/delivery-payouts/list
const getAdminPayoutsList = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.status && req.query.status !== 'ALL') {
      query.status = req.query.status;
    }
    if (req.query.partnerId) {
      query.deliveryPartner = req.query.partnerId;
    }

    const total = await DeliveryPayout.countDocuments(query);
    const payouts = await DeliveryPayout.find(query)
      .populate('deliveryPartner', 'name email phone deliveryProfile')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      total,
      page,
      pages: Math.ceil(total / limit),
      payouts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get delivery payout config
// @route GET /api/admin/delivery-payouts/config
const getAdminPayoutConfig = async (req, res, next) => {
  try {
    const config = await DeliveryPayoutConfig.getEffectiveConfig();
    res.json({ success: true, config });
  } catch (error) {
    next(error);
  }
};

// @desc Update delivery payout config
// @route PUT /api/admin/delivery-payouts/config
const updateAdminPayoutConfig = async (req, res, next) => {
  try {
    const config = await DeliveryPayoutConfig.getEffectiveConfig();

    const allowedFields = [
      'baseDeliveryFee',
      'returnPickupFee',
      'rainSurgeFee',
      'festivalSurgeFee',
      'distanceRatePerKm',
      'distanceThresholdKm',
      'onTimeSlaBonus',
      'onTimeSlaThresholdPercent',
      'minimumPayoutThreshold',
      'payoutSchedule',
      'autoPayoutEnabled',
      'allowManualWithdrawal',
      'tdsPercentage',
      'isPayoutsPaused',
      'pauseReason',
      'provider',
    ];

    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        config[field] = req.body[field];
      }
    });

    config.lastUpdatedBy = req.user.email || req.user.name || 'admin';
    await config.save();

    res.json({
      success: true,
      message: 'Logistics payout configuration updated successfully.',
      config,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Batch settle eligible payouts for all qualifying riders
// @route POST /api/admin/delivery-payouts/batch-settle
const batchSettleEligiblePayouts = async (req, res, next) => {
  try {
    const config = await DeliveryPayoutConfig.getEffectiveConfig();

    if (process.env.NODE_ENV === 'production' && !razorpayxService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Payout gateway is currently unconfigured in production mode. Automated batch settlement is suspended.',
      });
    }

    if (config.isPayoutsPaused) {
      return res.status(403).json({
        success: false,
        message: 'Cannot run batch settlement: Payouts are currently paused.',
      });
    }

    // Find riders with eligible ledger balance >= minimum threshold
    const eligibleRidersAgg = await DeliveryEarningLedger.aggregate([
      { $match: { status: 'eligible' } },
      {
        $group: {
          _id: '$deliveryPartner',
          totalEligible: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $match: { totalEligible: { $gte: config.minimumPayoutThreshold } } },
    ]);

    const results = {
      processedCount: 0,
      totalDisbursed: 0,
      skippedCount: 0,
      errors: [],
    };

    for (const item of eligibleRidersAgg) {
      const partner = await User.findById(item._id);
      if (!partner) continue;

      const bank = partner.deliveryProfile?.bankDetails;
      if (!bank || (!bank.accountNumber && !bank.upiId)) {
        results.skippedCount += 1;
        results.errors.push({
          partnerId: item._id,
          name: partner.name,
          reason: 'Missing verified bank destination details',
        });
        continue;
      }

      // Collect eligible ledger entries
      const eligibleEntries = await DeliveryEarningLedger.find({
        deliveryPartner: partner._id,
        status: 'eligible',
      });

      const gross = eligibleEntries.reduce((s, it) => s + it.amount, 0);
      const tds = Math.round(((gross * (config.tdsPercentage || 0)) / 100) * 100) / 100;
      const net = Math.max(1, Math.round((gross - tds) * 100) / 100);

      const payoutNumber = `VEX-PO-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
      const idempotencyKey = `idemp_batch_${partner._id}_${Date.now()}`;

      try {
        const payout = await DeliveryPayout.create({
          payoutNumber,
          deliveryPartner: partner._id,
          amount: net,
          grossEarnings: gross,
          deductions: 0,
          tdsAmount: tds,
          status: 'processing',
          mode: bank.upiId ? 'UPI' : 'IMPS',
          payoutType: 'scheduled_auto',
          beneficiary: {
            accountHolderName: bank.accountHolderName || partner.name,
            accountNumberMasked: bank.accountNumber ? `••••••••${bank.accountNumber.slice(-4)}` : '',
            ifscCode: bank.ifscCode || '',
            bankName: bank.bankName || '',
            upiId: bank.upiId || '',
            fundAccountId: bank.razorpayxFundAccountId || '',
          },
          provider: config.provider || 'razorpayx',
          idempotencyKey,
          earningsLedgerIds: eligibleEntries.map((e) => e._id),
          initiatedAt: new Date(),
        });

        // Lock ledger
        await DeliveryEarningLedger.updateMany(
          { _id: { $in: eligibleEntries.map((e) => e._id) } },
          { status: 'locked_for_payout', payout: payout._id }
        );

        // Update cached balance
        await User.findByIdAndUpdate(partner._id, {
          $inc: {
            'deliveryProfile.availablePayoutBalance': -gross,
            'deliveryProfile.pendingPayoutAmount': net,
          },
        });

        results.processedCount += 1;
        results.totalDisbursed += net;
      } catch (payoutErr) {
        results.errors.push({
          partnerId: partner._id,
          name: partner.name,
          reason: payoutErr.message,
        });
      }
    }

    res.json({
      success: true,
      message: `Batch settlement executed. Processed ${results.processedCount} riders for ₹${results.totalDisbursed.toFixed(2)}.`,
      results,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Reconcile single uncertain payout with RazorpayX
// @route POST /api/admin/delivery-payouts/:id/reconcile
const reconcilePayout = async (req, res, next) => {
  try {
    const payout = await DeliveryPayout.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout not found' });
    }

    if (payout.status === 'paid') {
      return res.json({
        success: true,
        message: 'Payout is already confirmed Paid.',
        payout,
      });
    }

    if (!payout.providerReferenceId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot reconcile: Missing provider reference ID.',
      });
    }

    if (process.env.NODE_ENV === 'production' && !razorpayxService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Payout gateway is currently unconfigured in production mode. Payout reconciliation is suspended.',
      });
    }

    const providerData = await razorpayxService.getPayout(payout.providerReferenceId);
    const providerStatus = providerData.status;

    payout.providerStatus = providerStatus;

    if (providerStatus === 'processed') {
      payout.status = 'paid';
      payout.processedAt = new Date();
      await payout.save();

      await DeliveryEarningLedger.updateMany(
        { _id: { $in: payout.earningsLedgerIds } },
        { status: 'paid' }
      );

      await User.findByIdAndUpdate(payout.deliveryPartner, {
        $inc: {
          'deliveryProfile.pendingPayoutAmount': -payout.amount,
          'deliveryProfile.totalPaidOut': payout.amount,
        },
      });
    } else if (['failed', 'rejected'].includes(providerStatus)) {
      payout.status = 'failed';
      payout.failureReason = providerData.error?.description || `Provider marked status as ${providerStatus}`;
      await payout.save();

      // Release locked funds safely back to rider
      await DeliveryEarningLedger.updateMany(
        { _id: { $in: payout.earningsLedgerIds } },
        { status: 'eligible', payout: null }
      );

      await User.findByIdAndUpdate(payout.deliveryPartner, {
        $inc: {
          'deliveryProfile.availablePayoutBalance': payout.grossEarnings,
          'deliveryProfile.pendingPayoutAmount': -payout.amount,
        },
      });
    } else if (providerStatus === 'reversed') {
      payout.status = 'reversed';
      payout.reversedAt = new Date();
      payout.reversalReason = 'Reversed by issuing bank / gateway';
      await payout.save();

      await DeliveryEarningLedger.updateMany(
        { _id: { $in: payout.earningsLedgerIds } },
        { status: 'reversed' }
      );
    }

    res.json({
      success: true,
      message: `Reconciliation complete. Status updated to ${payout.status}.`,
      payout,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Retry a failed payout
// @route POST /api/admin/delivery-payouts/:id/retry
const retryFailedPayout = async (req, res, next) => {
  try {
    const payout = await DeliveryPayout.findById(req.params.id);
    if (!payout) {
      return res.status(404).json({ success: false, message: 'Payout not found' });
    }

    if (payout.status !== 'failed') {
      return res.status(400).json({
        success: false,
        message: `Only payouts in 'failed' status can be retried. Current status is '${payout.status}'.`,
      });
    }

    if (process.env.NODE_ENV === 'production' && !razorpayxService.isConfigured()) {
      return res.status(503).json({
        success: false,
        message: 'Payout gateway is currently unconfigured in production mode. Payout retry is suspended.',
      });
    }

    const partner = await User.findById(payout.deliveryPartner);
    const bank = partner?.deliveryProfile?.bankDetails;
    if (!bank || (!bank.accountNumber && !bank.upiId)) {
      return res.status(400).json({
        success: false,
        message: 'Rider has no verified bank or UPI details.',
      });
    }

    const newIdempotencyKey = `idemp_retry_${payout._id}_${Date.now()}`;
    payout.idempotencyKey = newIdempotencyKey;
    payout.status = 'processing';
    payout.failureReason = '';
    await payout.save();

    // Re-lock ledger entries
    await DeliveryEarningLedger.updateMany(
      { _id: { $in: payout.earningsLedgerIds } },
      { status: 'locked_for_payout', payout: payout._id }
    );

    await User.findByIdAndUpdate(partner._id, {
      $inc: {
        'deliveryProfile.availablePayoutBalance': -payout.grossEarnings,
        'deliveryProfile.pendingPayoutAmount': payout.amount,
      },
    });

    try {
      const providerPayout = await razorpayxService.createPayout({
        fundAccountId: bank.razorpayxFundAccountId,
        amountRupees: payout.amount,
        mode: bank.upiId ? 'UPI' : 'IMPS',
        referenceId: payout.payoutNumber,
        narration: `VEXIVO RETRY ${payout.payoutNumber.slice(-8)}`,
        idempotencyKey: newIdempotencyKey,
      });

      payout.providerReferenceId = providerPayout.id;
      payout.providerStatus = providerPayout.status || 'processing';
      await payout.save();

      res.json({
        success: true,
        message: 'Payout retried and submitted to gateway successfully.',
        payout,
      });
    } catch (gatewayErr) {
      payout.status = 'failed';
      payout.failureReason = gatewayErr.message;
      await payout.save();

      // Release funds back
      await DeliveryEarningLedger.updateMany(
        { _id: { $in: payout.earningsLedgerIds } },
        { status: 'eligible', payout: null }
      );

      await User.findByIdAndUpdate(partner._id, {
        $inc: {
          'deliveryProfile.availablePayoutBalance': payout.grossEarnings,
          'deliveryProfile.pendingPayoutAmount': -payout.amount,
        },
      });

      return res.status(502).json({
        success: false,
        message: `Gateway retry rejected: ${gatewayErr.message}`,
        payout,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc Admin manual adjustment credit or deduction
// @route POST /api/admin/delivery-payouts/adjust-earning
const adjustRiderEarning = async (req, res, next) => {
  try {
    const { partnerId, type, amount, description } = req.body;

    if (!partnerId || !type || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Please provide partnerId, type (adjustment_credit/deduction), positive amount, and description.',
      });
    }

    const partner = await User.findById(partnerId);
    if (!partner || partner.role !== 'delivery_partner') {
      return res.status(404).json({ success: false, message: 'Valid delivery partner account not found.' });
    }

    const numAmount = Math.round(Number(amount) * 100) / 100;

    const entry = await DeliveryEarningLedger.create({
      deliveryPartner: partner._id,
      order: null,
      type: type === 'deduction' ? 'deduction' : 'adjustment_credit',
      amount: numAmount,
      description: description || `Admin Manual Earning Adjustment (${type})`,
      metadata: {
        adminNote: description,
        adjustedBy: req.user.email || req.user.name,
      },
      status: type === 'deduction' ? 'paid' : 'eligible',
    });

    const balanceChange = type === 'deduction' ? -numAmount : numAmount;
    await User.findByIdAndUpdate(partner._id, {
      $inc: {
        'deliveryProfile.availablePayoutBalance': balanceChange,
        'deliveryProfile.earnings': balanceChange,
      },
    });

    res.status(201).json({
      success: true,
      message: `Audited adjustment of ₹${numAmount} successfully applied to ${partner.name}.`,
      entry,
    });
  } catch (error) {
    next(error);
  }
};

// ==========================================
// WEBHOOK CONTROLLER
// ==========================================

// @desc RazorpayX Webhook Handler (Verified with HMAC SHA-256)
// @route POST /api/webhooks/razorpayx
const handleRazorpayXWebhook = async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];
  const rawBody = req.rawBody || JSON.stringify(req.body);

  const isValid = razorpayxService.verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    return res.status(400).json({ success: false, message: 'Invalid webhook signature' });
  }

  const event = req.body?.event;
  const payload = req.body?.payload?.payout?.entity;

  if (!event || !payload) {
    return res.status(200).json({ success: true, message: 'Event ignored' });
  }

  try {
    const payoutId = payload.id;
    const payout = await DeliveryPayout.findOne({
      $or: [{ providerReferenceId: payoutId }, { payoutNumber: payload.reference_id }],
    });

    if (!payout) {
      return res.status(200).json({ success: true, message: 'Payout not found in system' });
    }

    payout.providerStatus = payload.status;

    if (event === 'payout.processed') {
      if (payout.status !== 'paid') {
        payout.status = 'paid';
        payout.processedAt = new Date();
        await payout.save();

        await DeliveryEarningLedger.updateMany(
          { _id: { $in: payout.earningsLedgerIds } },
          { status: 'paid' }
        );

        await User.findByIdAndUpdate(payout.deliveryPartner, {
          $inc: {
            'deliveryProfile.pendingPayoutAmount': -payout.amount,
            'deliveryProfile.totalPaidOut': payout.amount,
          },
        });
      }
    } else if (event === 'payout.failed' || event === 'payout.rejected') {
      if (payout.status !== 'failed') {
        payout.status = 'failed';
        payout.failureReason = payload.failure_reason || payload.status_details?.description || 'Gateway marked payout as failed';
        await payout.save();

        // Release locked funds back safely to rider
        await DeliveryEarningLedger.updateMany(
          { _id: { $in: payout.earningsLedgerIds } },
          { status: 'eligible', payout: null }
        );

        await User.findByIdAndUpdate(payout.deliveryPartner, {
          $inc: {
            'deliveryProfile.availablePayoutBalance': payout.grossEarnings,
            'deliveryProfile.pendingPayoutAmount': -payout.amount,
          },
        });
      }
    } else if (event === 'payout.reversed') {
      if (payout.status !== 'reversed') {
        payout.status = 'reversed';
        payout.reversedAt = new Date();
        payout.reversalReason = payload.status_details?.description || 'Gateway reversed transaction';
        await payout.save();

        await DeliveryEarningLedger.updateMany(
          { _id: { $in: payout.earningsLedgerIds } },
          { status: 'reversed' }
        );
      }
    }

    return res.status(200).json({ success: true, message: `Webhook event ${event} processed` });
  } catch (err) {
    console.error('[RazorpayX Webhook Error]:', err);
    return res.status(500).json({ success: false, error: err.message });
  }
};

module.exports = {
  recordDeliveryEarnings,
  getEarningsSummary,
  getEarningsLedger,
  getPayoutsHistory,
  requestWithdrawal,
  getBankDetails,
  updateBankDetails,
  getAdminPayoutsOverview,
  getAdminPayoutsList,
  getAdminPayoutConfig,
  updateAdminPayoutConfig,
  batchSettleEligiblePayouts,
  reconcilePayout,
  retryFailedPayout,
  adjustRiderEarning,
  handleRazorpayXWebhook,
};
