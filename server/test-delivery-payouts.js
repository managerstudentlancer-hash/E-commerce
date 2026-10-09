/**
 * test-delivery-payouts.js
 * End-to-end verification script for Flipkart-Style Delivery Partner Earnings & Payout System
 */

const mongoose = require('mongoose');
const crypto = require('crypto');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Order = require('./models/Order');
const DeliveryEarningLedger = require('./models/DeliveryEarningLedger');
const DeliveryPayout = require('./models/DeliveryPayout');
const DeliveryPayoutConfig = require('./models/DeliveryPayoutConfig');

const {
  recordDeliveryEarnings,
  requestWithdrawal,
  handleRazorpayXWebhook,
  adjustRiderEarning,
} = require('./controllers/deliveryPayoutController');

async function runTests() {
  console.log('--- STARTING DELIVERY PARTNER EARNINGS & PAYOUT SYSTEM VERIFICATION ---');

  const connectDB = require('./config/db');
  await connectDB();

  let rider, admin, testOrder, testOrder2;

  try {
    // 1. Setup Test Delivery Partner and Admin
    console.log('\n[1] Setting up Test Delivery Partner and Admin...');
    const testEmail = `rider_${Date.now()}@vexivo.test`;
    rider = await User.create({
      name: 'Ramesh Express',
      email: testEmail,
      passwordHash: 'testhash123456789',
      role: 'delivery_partner',
      deliveryProfile: {
        isAvailable: true,
        vehicleType: 'bike',
        rating: 4.8,
        totalDeliveries: 10,
        availablePayoutBalance: 0,
        pendingPayoutAmount: 0,
        totalPaidOut: 0,
        bankDetails: {
          accountHolderName: 'Ramesh Express',
          accountNumber: '123456789012',
          ifscCode: 'HDFC0001234',
          bankName: 'HDFC Bank',
          upiId: 'ramesh@upi',
          isVerified: true,
        },
      },
    });

    const adminEmail = `admin_${Date.now()}@vexivo.test`;
    admin = await User.create({
      name: 'Vexivo Admin',
      email: adminEmail,
      passwordHash: 'testhash123456789',
      role: 'admin',
    });

    console.log(` Created test rider: ${rider.name} (ID: ${rider._id})`);
    console.log(` Created test admin: ${admin.name} (ID: ${admin._id})`);

    // Ensure Default Config starts at ₹500
    let config = await DeliveryPayoutConfig.getEffectiveConfig();
    config.minimumPayoutThreshold = 500;
    await config.save();
    console.log(` Active Config: Base Fee = ₹${config.baseDeliveryFee}, Min Threshold = ₹${config.minimumPayoutThreshold}`);

    // 2. Test Order & Delivery Earnings Recording
    console.log('\n[2] Testing Delivery Earnings Calculation & Ledger Creation...');
    const dummyProdId = new mongoose.Types.ObjectId();
    testOrder = await Order.create({
      orderNumber: `ORD-${Date.now()}-1`,
      user: admin._id,
      items: [{ product: dummyProdId, name: 'Wireless Headphones', price: 1499, quantity: 1, slug: 'wireless-headphones' }],
      subtotal: 1499,
      total: 1499,
      shippingAddress: { firstName: 'Customer', lastName: 'A', address: 'MG Road', city: 'Bengaluru', postalCode: '560001', country: 'India' },
      status: 'delivered',
      deliveryPartner: rider._id,
      deliveryDetails: {
        estimatedDistanceKm: 5.5,
        weatherSurgeApplied: true,
      },
    });

    // Credit earnings for testOrder: base + distance + surge
    const createdEntries = await recordDeliveryEarnings(testOrder, rider._id);
    rider = await User.findById(rider._id);

    console.log(` Delivery Earnings Recorded: ${createdEntries.length} entries created.`);
    createdEntries.forEach((e) => console.log(`   - ${e.type}: ₹${e.amount} (${e.description})`));
    console.log(`   Rider Updated Balance: ₹${rider.deliveryProfile.availablePayoutBalance}`);

    if (!createdEntries || createdEntries.length === 0 || rider.deliveryProfile.availablePayoutBalance <= 0) {
      throw new Error('Earning calculation failed: amounts must be positive');
    }

    // 3. Test Duplicate Credit Prevention
    console.log('\n[3] Testing Duplicate Credit Prevention...');
    const preDupBalance = rider.deliveryProfile.availablePayoutBalance;
    const dupEntries = await recordDeliveryEarnings(testOrder, rider._id);
    rider = await User.findById(rider._id);

    if (dupEntries.length !== 0 || rider.deliveryProfile.availablePayoutBalance !== preDupBalance) {
      throw new Error(`FAILED: Duplicate delivery earning was permitted! (${dupEntries.length} duplicate entries created)`);
    }
    console.log(` Duplicate delivery credit successfully blocked: 0 new entries, balance unchanged at ₹${rider.deliveryProfile.availablePayoutBalance}`);

    // 4. Test Return Pickup Earning
    console.log('\n[4] Testing Return Pickup Earning...');
    testOrder2 = await Order.create({
      orderNumber: `ORD-${Date.now()}-2`,
      user: admin._id,
      items: [{ product: dummyProdId, name: 'Silk Scarf', price: 999, quantity: 1, slug: 'silk-scarf' }],
      subtotal: 999,
      total: 999,
      shippingAddress: { firstName: 'Customer', lastName: 'B', address: 'Indiranagar', city: 'Bengaluru', postalCode: '560038', country: 'India' },
      status: 'return_picked_up',
      returnDetails: { status: 'picked_up' },
      deliveryPartner: rider._id,
    });

    const returnEntries = await recordDeliveryEarnings(testOrder2, rider._id);
    rider = await User.findById(rider._id);
    console.log(` Return Pickup Earning Recorded: ${returnEntries.length} entries, New Total Balance: ₹${rider.deliveryProfile.availablePayoutBalance}`);

    // 5. Test Minimum Payout Threshold Enforcement
    console.log(`\n[5] Testing Minimum Threshold Enforcement (Rider Balance: ₹${rider.deliveryProfile.availablePayoutBalance}, Min Threshold: ₹${config.minimumPayoutThreshold})...`);
    let minThresholdBlocked = false;
    const mockReqUnder = {
      user: { _id: rider._id },
      body: { amount: rider.deliveryProfile.availablePayoutBalance, paymentMode: 'bank_transfer' },
    };
    const mockResUnder = {
      status: (code) => ({
        json: (data) => {
          if (code === 400 && data.message && data.message.toLowerCase().includes('threshold')) {
            minThresholdBlocked = true;
            console.log(` Withdrawal below threshold correctly blocked: "${data.message}"`);
          }
        },
      }),
    };
    await requestWithdrawal(mockReqUnder, mockResUnder, () => {});
    if (!minThresholdBlocked) {
      throw new Error('FAILED: Withdrawal below threshold was not blocked!');
    }

    // 6. Test Withdrawal When Eligible
    console.log('\n[6] Testing Eligible Withdrawal Request & Atomic Balance Reservation...');
    // Lower threshold to ₹100 so current balance (₹117.50) is eligible
    config.minimumPayoutThreshold = 100;
    await config.save();
    console.log(' Payout threshold lowered to ₹100 for withdrawal test.');

    let payoutCreated = null;
    const mockReqEligible = {
      user: { _id: rider._id },
      body: { paymentMode: 'upi' },
    };
    const mockResEligible = {
      status: (code) => ({
        json: (data) => {
          if (code === 201 && data.success) {
            payoutCreated = data.payout;
            console.log(` Withdrawal successful! Payout ID: ${data.payout._id}, Reference: ${data.payout.payoutNumber}`);
          } else {
            console.error('Withdrawal error response:', code, data);
          }
        },
      }),
    };
    await requestWithdrawal(mockReqEligible, mockResEligible, (err) => { if (err) console.error('Next error:', err); });

    if (!payoutCreated) {
      throw new Error('FAILED: Eligible withdrawal request did not succeed!');
    }

    // Check balance reservation
    rider = await User.findById(rider._id);
    console.log(` Rider State after withdrawal: Available = ₹${rider.deliveryProfile.availablePayoutBalance}, Pending = ₹${rider.deliveryProfile.pendingPayoutAmount}`);
    if (rider.deliveryProfile.availablePayoutBalance !== 0 || rider.deliveryProfile.pendingPayoutAmount <= 0) {
      throw new Error(`FAILED: Balance reservation failed! Available: ₹${rider.deliveryProfile.availablePayoutBalance}, Pending: ₹${rider.deliveryProfile.pendingPayoutAmount}`);
    }

    // 7. Test Webhook Processing: payout.processed
    console.log('\n[7] Testing Webhook: payout.processed (Transfer Completed)...');
    const secret = process.env.RAZORPAYX_WEBHOOK_SECRET || 'test_secret_for_suite';
    process.env.RAZORPAYX_WEBHOOK_SECRET = secret;

    const webhookBody = {
      event: 'payout.processed',
      payload: {
        payout: {
          entity: {
            id: payoutCreated.providerReferenceId || 'pout_sim_12345',
            reference_id: payoutCreated.payoutNumber,
            status: 'processed',
            utr: 'UTR987654321',
            mode: 'UPI',
          },
        },
      },
    };
    const rawBodyStr = JSON.stringify(webhookBody);
    const signature = crypto.createHmac('sha256', secret).update(rawBodyStr).digest('hex');

    const mockWebhookProcessed = {
      body: webhookBody,
      rawBody: rawBodyStr,
      headers: {
        'x-razorpay-signature': signature,
      },
    };

    let webhookSuccess = false;
    const mockResWebhook = {
      status: (code) => ({
        json: (data) => {
          if (code === 200 && data.success) {
            webhookSuccess = true;
            console.log(` Webhook processed successfully: "${data.message}"`);
          } else {
            console.error('Webhook error:', code, data);
          }
        },
      }),
    };
    await handleRazorpayXWebhook(mockWebhookProcessed, mockResWebhook);

    if (!webhookSuccess) {
      throw new Error('FAILED: Webhook payout.processed handling failed!');
    }

    // Check payout and rider state after processed
    const updatedPayout = await DeliveryPayout.findById(payoutCreated._id);
    rider = await User.findById(rider._id);
    console.log(` Payout Status: ${updatedPayout.status}, Mode: ${updatedPayout.mode}`);
    console.log(` Rider State: Available = ₹${rider.deliveryProfile.availablePayoutBalance}, Pending = ₹${rider.deliveryProfile.pendingPayoutAmount}, Total Paid Out = ₹${rider.deliveryProfile.totalPaidOut}`);

    if (updatedPayout.status !== 'paid' || rider.deliveryProfile.totalPaidOut <= 0 || rider.deliveryProfile.pendingPayoutAmount !== 0) {
      throw new Error('FAILED: Payout status or rider paid out balance incorrect after webhook!');
    }

    // 8. Test Rollback on payout.failed
    console.log('\n[8] Testing Webhook: payout.failed Rollback & Safe Fund Restoration...');
    const failLedger = await DeliveryEarningLedger.create({
      deliveryPartner: rider._id,
      orderNumber: 'ORD-FAIL-TEST',
      type: 'delivery_base',
      amount: 50,
      description: 'Test earning for rollback',
      status: 'locked_for_payout',
    });

    const failPayout = await DeliveryPayout.create({
      payoutNumber: `VEX-PO-FAIL-${Date.now()}`,
      deliveryPartner: rider._id,
      amount: 49.50,
      grossEarnings: 50,
      deductions: 0,
      tdsAmount: 0.50,
      paymentMode: 'bank_transfer',
      status: 'processing',
      idempotencyKey: `idemp_fail_test_${Date.now()}`,
      providerReferenceId: 'pout_fail_test_999',
      earningsLedgerIds: [failLedger._id],
    });

    failLedger.payout = failPayout._id;
    await failLedger.save();

    // Rider in-flight state
    await User.findByIdAndUpdate(rider._id, {
      $inc: { 'deliveryProfile.pendingPayoutAmount': 49.50 },
    });

    const failWebhookBody = {
      event: 'payout.failed',
      payload: {
        payout: {
          entity: {
            id: 'pout_fail_test_999',
            reference_id: failPayout.payoutNumber,
            status: 'failed',
            failure_reason: 'Account closed by beneficiary bank',
          },
        },
      },
    };
    const failRawBody = JSON.stringify(failWebhookBody);
    const failSig = crypto.createHmac('sha256', secret).update(failRawBody).digest('hex');

    const mockWebhookFailed = {
      body: failWebhookBody,
      rawBody: failRawBody,
      headers: {
        'x-razorpay-signature': failSig,
      },
    };

    let failWebhookSuccess = false;
    const mockResFail = {
      status: (code) => ({
        json: (data) => {
          if (code === 200 && data.success) {
            failWebhookSuccess = true;
            console.log(` Failed payout webhook handled: "${data.message}"`);
          }
        },
      }),
    };
    await handleRazorpayXWebhook(mockWebhookFailed, mockResFail);

    if (!failWebhookSuccess) {
      throw new Error('FAILED: Webhook payout.failed handling failed!');
    }

    const rolledBackPayout = await DeliveryPayout.findById(failPayout._id);
    const restoredLedger = await DeliveryEarningLedger.findById(failLedger._id);
    rider = await User.findById(rider._id);

    console.log(` Rolled Back Payout Status: ${rolledBackPayout.status}, Reason: ${rolledBackPayout.failureReason}`);
    console.log(` Restored Ledger Status: ${restoredLedger.status}`);
    console.log(` Rider State after rollback: Available = ₹${rider.deliveryProfile.availablePayoutBalance}, Pending = ₹${rider.deliveryProfile.pendingPayoutAmount}`);

    if (rolledBackPayout.status !== 'failed' || restoredLedger.status !== 'eligible' || rider.deliveryProfile.availablePayoutBalance !== 50) {
      throw new Error('FAILED: Safe rollback of failed payout did not restore funds or ledger properly!');
    }

    // 9. Test Manual Audit Adjustment (Admin)
    console.log('\n[9] Testing Admin Audit Earning Adjustment...');
    const adjustReq = {
      user: { _id: admin._id },
      body: {
        partnerId: rider._id.toString(),
        amount: 25,
        type: 'bonus',
        description: 'Festival peak delivery incentive',
      },
    };
    let adjustSuccess = false;
    const adjustRes = {
      status: (code) => ({
        json: (data) => {
          if (code === 201 && data.success) {
            adjustSuccess = true;
            console.log(` Adjustment recorded: ₹${data.entry.amount} (${data.entry.description}), New Rider Balance: ₹${data.newBalance}`);
          } else {
            console.error('Adjust response error:', code, data);
          }
        },
      }),
    };
    await adjustRiderEarning(adjustReq, adjustRes, (err) => { if (err) console.error(err); });
    if (!adjustSuccess) {
      throw new Error('FAILED: Admin adjustment failed!');
    }

    // Reset config threshold to default
    config.minimumPayoutThreshold = 500;
    await config.save();

    console.log('\n============================================================');
    console.log(' ALL 9 DELIVERY PARTNER EARNINGS & PAYOUT TESTS PASSED 100%!');
    console.log('============================================================\n');

  } catch (err) {
    console.error('\n❌ TEST ERROR:', err);
    process.exitCode = 1;
  } finally {
    // Clean up test documents
    if (rider) {
      await DeliveryEarningLedger.deleteMany({ deliveryPartner: rider._id });
      await DeliveryPayout.deleteMany({ deliveryPartner: rider._id });
      await User.findByIdAndDelete(rider._id);
    }
    if (admin) await User.findByIdAndDelete(admin._id);
    if (testOrder) await Order.findByIdAndDelete(testOrder._id);
    if (testOrder2) await Order.findByIdAndDelete(testOrder2._id);
    console.log('[CLEANUP] Test documents safely removed.');
  }
}

runTests().then(() => {
  process.exit(process.exitCode || 0);
});
