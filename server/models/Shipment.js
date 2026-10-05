const mongoose = require('mongoose');

const scanEventSchema = new mongoose.Schema({
  scanType: {
    type: String,
    enum: [
      'PICKUP_SCAN',
      'WAREHOUSE_RECEIVE_SCAN',
      'SORTING_SCAN',
      'DISPATCH_SCAN',
      'HUB_RECEIVE_SCAN',
      'OUT_FOR_DELIVERY_SCAN',
      'DELIVERY_CONFIRM_SCAN',
      'RETURN_SCAN',
      'AUDIT_SCAN',
    ],
    required: true,
  },
  facility: { type: String, default: '' },
  scannedBy: { type: String, default: 'Logistics Scanner' },
  scannedByRole: { type: String, default: 'staff' },
  timestamp: { type: Date, default: Date.now },
  status: { type: String, default: 'SUCCESS' },
  notes: { type: String, default: '' },
});

const deliveryAttemptSchema = new mongoose.Schema({
  attemptNumber: { type: Number, required: true },
  timestamp: { type: Date, default: Date.now },
  reason: {
    type: String,
    enum: [
      'Customer unavailable / unreachable',
      'Customer requested reschedule',
      'Address incomplete or incorrect',
      'Customer refused delivery',
      'Delivery partner unable to reach premises / gate locked',
      'Cash on Delivery amount not ready',
      'Adverse weather / route block',
      'Other operational issue',
    ],
    required: true,
  },
  partnerName: { type: String, default: '' },
  partnerPhone: { type: String, default: '' },
  notes: { type: String, default: '' },
});

const rescheduleRecordSchema = new mongoose.Schema({
  previousDate: { type: Date, default: null },
  newDate: { type: Date, required: true },
  reason: { type: String, required: true },
  initiatedBy: { type: String, default: 'Customer' },
  timestamp: { type: Date, default: Date.now },
});

const trackingTimelineEventSchema = new mongoose.Schema({
  stage: { type: String, required: true },
  status: { type: String, required: true },
  message: { type: String, required: true },
  location: { type: String, default: '' },
  facility: { type: String, default: '' },
  actor: { type: String, default: 'System' },
  actorRole: { type: String, default: 'system' },
  timestamp: { type: Date, default: Date.now },
  metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
});

const shipmentSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    orderNumber: {
      type: String,
      required: true,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    sellerName: {
      type: String,
      default: 'VEXIVO Official Fulfillment',
    },
    pickupAddress: {
      street: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      phone: { type: String, default: '' },
      contactPerson: { type: String, default: '' },
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    customerName: {
      type: String,
      required: true,
    },
    customerPhone: {
      type: String,
      default: '',
    },
    shippingAddress: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'India' },
    },
    parcelDetails: {
      weight: { type: String, default: '1.2 kg' },
      dimensions: { type: String, default: '28 x 20 x 12 cm' },
      boxType: { type: String, default: 'Reinforced Corrugated Box' },
      itemCount: { type: Number, default: 1 },
      items: [
        {
          name: String,
          quantity: Number,
          price: Number,
          variant: String,
          image: String,
        },
      ],
      declaredValue: { type: Number, default: 0 },
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      default: null,
    },
    warehouseName: {
      type: String,
      default: '',
    },
    deliveryHub: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryHub',
      default: null,
    },
    hubName: {
      type: String,
      default: '',
    },
    pickupPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    pickupPartnerName: {
      type: String,
      default: '',
    },
    pickupDate: {
      type: Date,
      default: null,
    },
    pickupOtp: {
      type: String,
      default: '',
    },
    deliveryOtp: {
      type: String,
      default: '',
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    deliveryPartnerName: {
      type: String,
      default: '',
    },
    deliveryPartnerPhone: {
      type: String,
      default: '',
    },
    assignedAt: {
      type: Date,
      default: null,
    },
    currentStage: {
      type: String,
      enum: [
        'ORDER_PLACED',
        'ORDER_CONFIRMED',
        'SELLER_PROCESSING',
        'READY_FOR_PICKUP',
        'PICKED_UP',
        'WAREHOUSE_RECEIVED',
        'SCANNED',
        'SORTED',
        'DISPATCHED_FROM_WAREHOUSE',
        'HUB_RECEIVED',
        'READY_FOR_DELIVERY',
        'DELIVERY_PARTNER_ASSIGNED',
        'OUT_FOR_DELIVERY',
        'DELIVERY_ATTEMPTED',
        'RESCHEDULED',
        'DELIVERED',
        'RETURN_INITIATED',
        'RETURN_IN_TRANSIT',
        'RETURN_WAREHOUSE_RECEIVED',
        'RETURN_TO_SELLER',
        'SELLER_RECEIVED',
        'CANCELLED',
      ],
      default: 'ORDER_CONFIRMED',
    },
    currentLocation: {
      type: String,
      default: 'Merchant Fulfillment Center',
    },
    nextExpectedStep: {
      type: String,
      default: 'Seller packaging and preparing parcel for pickup',
    },
    estimatedDeliveryDate: {
      type: Date,
      default: null,
    },
    actualDeliveryDate: {
      type: Date,
      default: null,
    },
    scans: [scanEventSchema],
    deliveryAttempts: [deliveryAttemptSchema],
    rescheduleHistory: [rescheduleRecordSchema],
    returnDetails: {
      reason: { type: String, default: '' },
      initiatedAt: { type: Date, default: null },
      receivedAtWarehouseAt: { type: Date, default: null },
      returnedToSellerAt: { type: Date, default: null },
      status: {
        type: String,
        enum: ['none', 'initiated', 'in_transit', 'warehouse_received', 'returned_to_seller', 'seller_received'],
        default: 'none',
      },
    },
    timeline: [trackingTimelineEventSchema],
  },
  { timestamps: true }
);

// Index for fast search by tracking / barcode ID or order number
shipmentSchema.index({ orderNumber: 1 });
shipmentSchema.index({ order: 1 });
shipmentSchema.index({ currentStage: 1 });
shipmentSchema.index({ deliveryPartner: 1 });

module.exports =
  mongoose.models.Shipment || mongoose.model('Shipment', shipmentSchema);
