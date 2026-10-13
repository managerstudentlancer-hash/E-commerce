const express = require('express');
const router = express.Router();
const {
  getDeliveryProfile,
  toggleOnlineStatus,
  getDeliveryOrders,
  acceptDelivery,
  declineDelivery,
  reachedPickup,
  confirmPickup,
  outForDelivery,
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
} = require('../controllers/deliveryController');

const {
  getEarningsSummary,
  getEarningsLedger,
  getPayoutsHistory,
  requestWithdrawal,
  getBankDetails,
  updateBankDetails,
} = require('../controllers/deliveryPayoutController');

const { protect, deliveryOnly, activeDeliveryOnly } = require('../middleware/auth');

// Public: Delivery Partner Registration / Application Flow
router.post('/register', registerDeliveryPartner);

// Partner Profile, Bank Details & Support (accessible by all delivery partners, including pending)
router.get('/profile', protect, deliveryOnly, getDeliveryProfile);
router.get('/me', protect, deliveryOnly, getDeliveryMe);
router.put('/profile', protect, deliveryOnly, updateDeliveryProfile);
router.post('/support', protect, deliveryOnly, submitSupport);
router.get('/bank-details', protect, deliveryOnly, getBankDetails);
router.put('/bank-details', protect, deliveryOnly, updateBankDetails);

// Operational routes: Strictly restricted to ACTIVE / APPROVED partners
router.use(protect, deliveryOnly, activeDeliveryOnly);

// Earnings & Payout Routes
router.get('/earnings/summary', getEarningsSummary);
router.get('/earnings/ledger', getEarningsLedger);
router.get('/payouts', getPayoutsHistory);
router.post('/payouts/withdraw', requestWithdrawal);

router.put('/toggle-online', toggleOnlineStatus);
router.put('/toggle-status', toggleOnlineStatus);
router.get('/orders', getDeliveryOrders);
router.get('/assignments', getDeliveryAssignments);

// Shipment Actions
router.put('/orders/:id/accept', acceptDelivery);
router.put('/orders/:id/decline', declineDelivery);
router.put('/orders/:id/reached-pickup', reachedPickup);
router.put('/orders/:id/pickup', confirmPickup);
router.put('/orders/:id/out-for-delivery', outForDelivery);
router.put('/orders/:id/attempt-redelivery', outForDelivery);
router.put('/orders/:id/reached-customer', reachedCustomer);
router.put('/orders/:id/complete', completeDelivery);
router.put('/orders/:id/fail', failDelivery);
router.put('/orders/:id/reschedule', rescheduleDelivery);
router.put('/orders/:id/return-to-seller', returnToSeller);
router.put('/returns/:id/pickup', pickupReturn);

module.exports = router;
