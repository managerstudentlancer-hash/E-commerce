const mongoose = require('mongoose');

const deliveryEarningLedgerSchema = new mongoose.Schema(
  {
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      index: true,
      default: null,
    },
    orderNumber: {
      type: String,
      default: '',
    },
    type: {
      type: String,
      enum: [
        'delivery_base',
        'return_pickup',
        'rain_surge',
        'festival_surge',
        'distance_incentive',
        'sla_on_time_bonus',
        'adjustment_credit',
        'deduction',
      ],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    description: {
      type: String,
      default: '',
    },
    metadata: {
      distanceKm: { type: Number, default: 0 },
      isCod: { type: Boolean, default: false },
      codAmount: { type: Number, default: 0 },
      rating: { type: Number, default: 5 },
      baseRate: { type: Number, default: 0 },
      surgeRate: { type: Number, default: 0 },
      incentiveRate: { type: Number, default: 0 },
      adminNote: { type: String, default: '' },
      adjustedBy: { type: String, default: '' },
    },
    status: {
      type: String,
      enum: ['eligible', 'locked_for_payout', 'paid', 'reversed', 'cancelled'],
      default: 'eligible',
      index: true,
    },
    payout: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DeliveryPayout',
      default: null,
      index: true,
    },
  },
  { timestamps: true }
);

// Compound Unique Index: Prevent duplicate earnings for the exact same order, rider and earning type
// Only enforce uniqueness when order is non-null
deliveryEarningLedgerSchema.index(
  { deliveryPartner: 1, order: 1, type: 1 },
  {
    unique: true,
    partialFilterExpression: { order: { $type: 'objectId' } },
  }
);

module.exports =
  mongoose.models.DeliveryEarningLedger ||
  mongoose.model('DeliveryEarningLedger', deliveryEarningLedgerSchema);
