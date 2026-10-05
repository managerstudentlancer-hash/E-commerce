const mongoose = require('mongoose');

const deliveryHubSchema = new mongoose.Schema(
  {
    hubId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    code: {
      type: String,
      trim: true,
      uppercase: true,
    },
    warehouse: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Warehouse',
      required: true,
    },
    warehouseName: {
      type: String,
      default: '',
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    postalCode: {
      type: String,
      trim: true,
    },
    serviceZones: [{ type: String, trim: true }],
    pincodes: [{ type: String, trim: true }],
    managerName: {
      type: String,
      default: 'Hub Dispatcher',
    },
    contactPhone: {
      type: String,
      default: '+91 1800 200 8899',
    },
    status: {
      type: String,
      enum: ['active', 'inactive'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.DeliveryHub || mongoose.model('DeliveryHub', deliveryHubSchema);
