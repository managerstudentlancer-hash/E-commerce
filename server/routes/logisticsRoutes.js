const express = require('express');
const router = express.Router();
const {
  getWarehouses,
  createWarehouse,
  getHubs,
  createHub,
  getShipments,
  getShipmentById,
  trackShipment,
  markSellerReady,
  confirmPickup,
  warehouseReceive,
  scanShipment,
  sortShipment,
  dispatchFromWarehouse,
  hubReceive,
  markReadyForDelivery,
  assignDeliveryPartner,
  markOutForDelivery,
  recordDeliveryAttempt,
  rescheduleDelivery,
  deliverShipment,
  initiateReturn,
  updateReturnProgress,
  adminOverride,
} = require('../controllers/logisticsController');
const { protect, adminOnly } = require('../middleware/auth');

// Public tracking and location lookup
router.get('/track/:identifier', trackShipment);
router.get('/warehouses', getWarehouses);
router.get('/hubs', getHubs);

// Protected routes (Authentication required)
router.use(protect);

// Shipments listing and details
router.get('/shipments', getShipments);
router.get('/shipments/:id', getShipmentById);

// Seller & Courier pickup stages
router.put('/shipments/:id/seller-ready', markSellerReady);
router.put('/shipments/:id/pickup-confirm', confirmPickup);

// Warehouse operations & Parcel scanning
router.put('/shipments/:id/warehouse-receive', warehouseReceive);
router.post('/shipments/scan', scanShipment);
router.put('/shipments/:id/sort', sortShipment);
router.put('/shipments/:id/dispatch-warehouse', dispatchFromWarehouse);

// Hub facilities & staging
router.put('/shipments/:id/hub-receive', hubReceive);
router.put('/shipments/:id/ready-for-delivery', markReadyForDelivery);

// Delivery Partner final mile operations
router.put('/shipments/:id/assign-delivery-partner', assignDeliveryPartner);
router.put('/shipments/:id/out-for-delivery', markOutForDelivery);
router.put('/shipments/:id/delivery-attempt', recordDeliveryAttempt);
router.put('/shipments/:id/reschedule', rescheduleDelivery);
router.put('/shipments/:id/deliver', deliverShipment);

// Reverse logistics & returns
router.put('/shipments/:id/return-initiate', initiateReturn);
router.put('/shipments/:id/return-update', updateReturnProgress);

// Admin-only management controls
router.post('/warehouses', adminOnly, createWarehouse);
router.post('/hubs', adminOnly, createHub);
router.put('/shipments/:id/admin-override', adminOnly, adminOverride);

module.exports = router;
