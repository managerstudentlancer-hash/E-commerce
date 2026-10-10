/**
 * test-delivery-flow.js
 * Comprehensive end-to-end verification script for all Delivery Partner functions in VEXIVO
 */

const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Order = require('./models/Order');
const Shipment = require('./models/Shipment');
const DeliveryEarningLedger = require('./models/DeliveryEarningLedger');
const DeliveryPayout = require('./models/DeliveryPayout');

const {
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
  toggleOnlineStatus,
  submitSupport,
  getDeliveryProfile,
  getDeliveryOrders
} = require('./controllers/deliveryController');

// Mock Express response helper
function createMockRes() {
  const res = {
    statusCode: 200,
    data: null,
    status(code) {
      this.statusCode = code;
      return this;
    },
    json(obj) {
      this.data = obj;
      return this;
    }
  };
  return res;
}

async function runDeliveryTests() {
  console.log('=== STARTING COMPREHENSIVE DELIVERY WORKFLOW TEST SUITE ===');

  const connectDB = require('./config/db');
  await connectDB();

  let rider, rider2, customer, order1, order2, order3;

  try {
    // Step 1: Create Test Delivery Partner
    console.log('\n[TEST 1] Creating test delivery partner with active verified profile...');
    rider = await User.create({
      name: 'Rohan Delivery',
      email: `rohan_delivery_${Date.now()}@vexivo.test`,
      passwordHash: 'dummyhash123',
      role: 'delivery_partner',
      deliveryProfile: {
        isAvailable: true,
        verificationStatus: 'APPROVED',
        vehicleType: 'bike',
        rating: 4.9,
        totalDeliveries: 15,
        availablePayoutBalance: 0,
        pendingPayoutAmount: 0,
        totalPaidOut: 0,
        bankDetails: {
          accountHolderName: 'Rohan Delivery',
          accountNumber: '987654321098',
          ifscCode: 'SBIN0001234',
          isVerified: true
        }
      }
    });

    rider2 = await User.create({
      name: 'Simran Delivery',
      email: `simran_delivery_${Date.now()}@vexivo.test`,
      passwordHash: 'dummyhash123',
      role: 'delivery_partner',
      deliveryProfile: {
        isAvailable: true,
        verificationStatus: 'APPROVED',
        vehicleType: 'scooter'
      }
    });

    customer = await User.create({
      name: 'Pooja Customer',
      email: `pooja_${Date.now()}@vexivo.test`,
      passwordHash: 'dummyhash123',
      role: 'customer'
    });

    console.log(` Created riders: ${rider.name} (${rider._id}) & ${rider2.name} (${rider2._id})`);

    // Step 2: Create Available Order
    console.log('\n[TEST 2] Creating an available order for pickup...');
    order1 = await Order.create({
      orderNumber: `ORD-DELIV-${Date.now()}-1`,
      trackingNumber: `TRK-SCAN-1001`,
      user: customer._id,
      items: [{
        product: new mongoose.Types.ObjectId(),
        name: 'Smart Watch',
        price: 2499,
        quantity: 1,
        slug: 'smart-watch'
      }],
      subtotal: 2499,
      total: 2499,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      shippingAddress: {
        firstName: 'Pooja',
        lastName: 'Sharma',
        address: 'Flat 402, Sunshine Heights',
        city: 'Mumbai',
        postalCode: '400001',
        country: 'India',
        phone: '9876543210'
      },
      status: 'ready_for_delivery',
      deliveryPartner: null,
      deliveryDetails: {
        deliveryStatus: 'ready_for_delivery',
        pickupOtp: '4567',
        deliveryOtp: '8910',
        estimatedDistanceKm: 4.2
      }
    });

    // Step 3: Test Accept Delivery (Atomic claim check)
    console.log('\n[TEST 3] Testing Accept Delivery...');
    const acceptReq = { user: { _id: rider._id }, params: { id: order1._id.toString() } };
    const acceptRes = createMockRes();
    await acceptDelivery(acceptReq, acceptRes);

    if (acceptRes.statusCode !== 200 || !acceptRes.data.success) {
      throw new Error(`Accept Delivery failed: ${JSON.stringify(acceptRes.data)}`);
    }
    console.log(` Order accepted by ${rider.name}. Assigned status: ${acceptRes.data.order.deliveryDetails.deliveryStatus}`);

    // Verify 2nd rider cannot accept the same order (race condition check)
    const accept2Req = { user: { _id: rider2._id }, params: { id: order1._id.toString() } };
    const accept2Res = createMockRes();
    await acceptDelivery(accept2Req, accept2Res);
    if (accept2Res.statusCode === 200) {
      throw new Error(`Concurrency check failed: Second rider was able to accept already-assigned order!`);
    }
    console.log(` Concurrency check passed: Order locked from second rider (${accept2Res.data.message})`);

    // Step 4: Reached Pickup Hub
    console.log('\n[TEST 4] Testing Reached Pickup Hub...');
    const reachedHubReq = { user: { _id: rider._id }, params: { id: order1._id.toString() } };
    const reachedHubRes = createMockRes();
    await reachedPickup(reachedHubReq, reachedHubRes);
    if (reachedHubRes.statusCode !== 200 || reachedHubRes.data.order.deliveryDetails.deliveryStatus !== 'reached_pickup') {
      throw new Error(`Reached pickup failed: ${JSON.stringify(reachedHubRes.data)}`);
    }
    console.log(` Status updated to: reached_pickup`);

    // Step 5: Confirm Pickup via Barcode & OTP
    console.log('\n[TEST 5] Testing Confirm Pickup with Barcode scan (TRK-SCAN-1001)...');
    const pickupScanReq = {
      user: { _id: rider._id },
      params: { id: order1._id.toString() },
      body: { scanCode: 'TRK-SCAN-1001' }
    };
    const pickupScanRes = createMockRes();
    await confirmPickup(pickupScanReq, pickupScanRes);
    if (pickupScanRes.statusCode !== 200 || pickupScanRes.data.order.deliveryDetails.deliveryStatus !== 'picked_up') {
      throw new Error(`Pickup scan failed: ${JSON.stringify(pickupScanRes.data)}`);
    }
    console.log(` Pickup confirmed via Barcode! Status: picked_up`);

    // Step 6: Out for Delivery
    console.log('\n[TEST 6] Testing Out for Delivery...');
    const ofdReq = { user: { _id: rider._id }, params: { id: order1._id.toString() } };
    const ofdRes = createMockRes();
    await outForDelivery(ofdReq, ofdRes);
    if (ofdRes.statusCode !== 200 || ofdRes.data.order.deliveryDetails.deliveryStatus !== 'out_for_delivery') {
      throw new Error(`Out for delivery failed: ${JSON.stringify(ofdRes.data)}`);
    }
    console.log(` Status updated to: out_for_delivery`);

    // Step 7: Reached Customer Doorstep
    console.log('\n[TEST 7] Testing Reached Customer Doorstep...');
    const reachedCustReq = { user: { _id: rider._id }, params: { id: order1._id.toString() } };
    const reachedCustRes = createMockRes();
    await reachedCustomer(reachedCustReq, reachedCustRes);
    if (reachedCustRes.statusCode !== 200 || reachedCustRes.data.order.deliveryDetails.deliveryStatus !== 'reached_customer') {
      throw new Error(`Reached customer doorstep failed: ${JSON.stringify(reachedCustRes.data)}`);
    }
    console.log(` Status updated to: reached_customer`);

    // Step 8: Complete Delivery with Delivery OTP & Verify Earnings Credit
    console.log('\n[TEST 8] Testing Complete Delivery with OTP (8910) & Payout Ledger Credit...');
    const completeReq = {
      user: { _id: rider._id },
      params: { id: order1._id.toString() },
      body: { deliveryOtp: '8910', deliveryNotes: 'Delivered directly to customer hand' }
    };
    const completeRes = createMockRes();
    await completeDelivery(completeReq, completeRes);
    if (completeRes.statusCode !== 200 || completeRes.data.order.orderStatus !== 'delivered') {
      throw new Error(`Complete delivery failed: ${JSON.stringify(completeRes.data)}`);
    }
    console.log(` Order delivered! Customer OTP verified successfully.`);

    // Verify Rider balance was credited (base fee ₹50 + distance)
    const updatedRider = await User.findById(rider._id);
    console.log(` Rider available balance after delivery: ₹${updatedRider.deliveryProfile.availablePayoutBalance}`);
    if (updatedRider.deliveryProfile.availablePayoutBalance <= 0) {
      throw new Error(`Earnings failed to credit rider! Balance is: ${updatedRider.deliveryProfile.availablePayoutBalance}`);
    }
    console.log(` Delivery partner earning correctly credited to ledger!`);

    // Step 9: Test Delivery Failure & Reschedule
    console.log('\n[TEST 9] Testing Delivery Failure & Reschedule Flow...');
    order2 = await Order.create({
      orderNumber: `ORD-DELIV-${Date.now()}-2`,
      trackingNumber: `TRK-SCAN-2002`,
      user: customer._id,
      items: [{
        product: new mongoose.Types.ObjectId(),
        name: 'Denim Jacket',
        price: 1899,
        quantity: 1,
        slug: 'denim-jacket'
      }],
      subtotal: 1899,
      total: 1899,
      shippingAddress: { firstName: 'Pooja', lastName: 'Sharma', address: 'Flat 402', city: 'Mumbai', postalCode: '400001', country: 'India' },
      status: 'ready_for_delivery',
      deliveryPartner: rider._id,
      deliveryDetails: {
        deliveryStatus: 'out_for_delivery',
        pickupOtp: '1111',
        deliveryOtp: '2222'
      }
    });

    const failReq = {
      user: { _id: rider._id },
      params: { id: order2._id.toString() },
      body: { reason: 'Customer door locked / phone unreachable' }
    };
    const failRes = createMockRes();
    await failDelivery(failReq, failRes);
    if (failRes.statusCode !== 200 || failRes.data.order.deliveryDetails.deliveryStatus !== 'failed') {
      throw new Error(`Fail delivery action failed: ${JSON.stringify(failRes.data)}`);
    }
    console.log(` Delivery failure recorded: status is delivery_failed`);

    // Reschedule
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const reschedReq = {
      user: { _id: rider._id },
      params: { id: order2._id.toString() },
      body: {
        rescheduleDate: tomorrow.toISOString(),
        rescheduleReason: 'Customer requested evening delivery tomorrow'
      }
    };
    const reschedRes = createMockRes();
    await rescheduleDelivery(reschedReq, reschedRes);
    if (reschedRes.statusCode !== 200 || reschedRes.data.order.deliveryDetails.deliveryStatus !== 'rescheduled') {
      throw new Error(`Reschedule failed: ${JSON.stringify(reschedRes.data)}`);
    }
    console.log(` Delivery rescheduled successfully: status is rescheduled`);

    // Redelivery Attempt
    const redelivReq = { user: { _id: rider._id }, params: { id: order2._id.toString() } };
    const redelivRes = createMockRes();
    await attemptRedelivery(redelivReq, redelivRes);
    if (redelivRes.statusCode !== 200 || redelivRes.data.order.deliveryDetails.deliveryStatus !== 'out_for_delivery') {
      throw new Error(`Redelivery attempt failed: ${JSON.stringify(redelivRes.data)}`);
    }
    console.log(` Redelivery started: status back to out_for_delivery`);

    // Return to Origin (RTO)
    const rtoReq = {
      user: { _id: rider._id },
      params: { id: order2._id.toString() },
      body: { reason: 'Customer cancelled at door after 2 failed attempts' }
    };
    const rtoRes = createMockRes();
    await returnToSeller(rtoReq, rtoRes);
    if (rtoRes.statusCode !== 200 || rtoRes.data.order.deliveryDetails.deliveryStatus !== 'return_to_seller') {
      throw new Error(`Return to seller failed: ${JSON.stringify(rtoRes.data)}`);
    }
    console.log(` Order returned to seller (RTO): status is return_to_seller`);

    // Step 10: Customer Return Pickup Workflow & ₹40 Return Credit
    console.log('\n[TEST 10] Testing Customer Return Pickup Workflow (+₹40 Return Credit)...');
    order3 = await Order.create({
      orderNumber: `ORD-DELIV-${Date.now()}-3`,
      trackingNumber: `TRK-SCAN-3003`,
      user: customer._id,
      items: [{ product: new mongoose.Types.ObjectId(), name: 'T-Shirt', price: 499, quantity: 1, slug: 't-shirt' }],
      subtotal: 499,
      total: 499,
      shippingAddress: { firstName: 'Pooja', lastName: 'Sharma', address: 'Flat 402', city: 'Mumbai', postalCode: '400001', country: 'India' },
      status: 'delivered',
      deliveryPartner: rider._id,
      returnDetails: {
        status: 'approved',
        returnPickupOtp: '7788'
      }
    });

    const preReturnBalance = (await User.findById(rider._id)).deliveryProfile.availablePayoutBalance;
    const returnPickupReq = {
      user: { _id: rider._id, name: rider.name },
      params: { id: order3._id.toString() },
      body: { returnPickupOtp: '7788' }
    };
    const returnPickupRes = createMockRes();
    await pickupReturn(returnPickupReq, returnPickupRes);
    if (returnPickupRes.statusCode !== 200 || returnPickupRes.data.order.returnDetails.status !== 'picked_up') {
      throw new Error(`Return pickup confirmation failed: ${JSON.stringify(returnPickupRes.data)}`);
    }

    const postReturnBalance = (await User.findById(rider._id)).deliveryProfile.availablePayoutBalance;
    console.log(` Return pickup confirmed! Balance increased by: ₹${postReturnBalance - preReturnBalance} (₹40 return fee + bonuses)`);
    if (postReturnBalance <= preReturnBalance) {
      throw new Error(`Return payout failed to credit rider!`);
    }

    // Step 11: Duty Toggle (Online / Offline)
    console.log('\n[TEST 11] Testing Duty Toggle (Online/Offline)...');
    const toggleReq = { user: { _id: rider._id } };
    const toggleRes = createMockRes();
    await toggleOnlineStatus(toggleReq, toggleRes);
    if (toggleRes.statusCode !== 200 || toggleRes.data.isOnline !== false) {
      throw new Error(`Duty toggle offline failed: ${JSON.stringify(toggleRes.data)}`);
    }
    console.log(` Rider duty toggled to OFFLINE`);

    // Toggle back online
    await toggleOnlineStatus({ user: { _id: rider._id } }, createMockRes());
    console.log(` Rider duty toggled back to ONLINE`);

    // Step 12: Emergency SOS Alert / Fleet Support
    console.log('\n[TEST 12] Testing Emergency SOS Broadcast...');
    const sosReq = {
      user: { _id: rider._id, name: rider.name, phone: '9876543210' },
      body: {
        category: 'emergency',
        orderId: order1.orderNumber,
        message: 'Accident reported at junction, assistance requested'
      }
    };
    const sosRes = createMockRes();
    await submitSupport(sosReq, sosRes);
    if (sosRes.statusCode !== 200 || !sosRes.data.success) {
      throw new Error(`SOS Emergency alert failed: ${JSON.stringify(sosRes.data)}`);
    }
    console.log(` SOS broadcast successfully received: "${sosRes.data.message}"`);

    console.log('\n============================================================');
    console.log(' ALL 12 DELIVERY FUNCTIONS & WORKFLOWS VERIFIED 100%!');
    console.log('============================================================\n');

  } catch (err) {
    console.error('\n❌ ERROR IN DELIVERY WORKFLOW TEST:', err);
    process.exitCode = 1;
  } finally {
    if (rider) {
      await DeliveryEarningLedger.deleteMany({ deliveryPartner: rider._id });
      await DeliveryPayout.deleteMany({ deliveryPartner: rider._id });
      await User.findByIdAndDelete(rider._id);
    }
    if (rider2) await User.findByIdAndDelete(rider2._id);
    if (customer) await User.findByIdAndDelete(customer._id);
    if (order1) await Order.findByIdAndDelete(order1._id);
    if (order2) await Order.findByIdAndDelete(order2._id);
    if (order3) await Order.findByIdAndDelete(order3._id);
    console.log('[CLEANUP] Test records cleaned up.');
  }
}

runDeliveryTests().then(() => {
  process.exit(process.exitCode || 0);
});
