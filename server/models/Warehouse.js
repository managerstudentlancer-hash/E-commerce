const mongoose = require('mongoose');

const warehouseSchema = new mongoose.Schema(
  {
    warehouseId: {
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
    country: {
      type: String,
      default: 'India',
    },
    pincodes: [{ type: String, trim: true }],
    serviceCities: [{ type: String, trim: true, lowercase: true }],
    capacity: {
      type: Number,
      default: 50000,
    },
    currentParcels: {
      type: Number,
      default: 0,
    },
    managerName: {
      type: String,
      default: 'Logistics Supervisor',
    },
    contactPhone: {
      type: String,
      default: '+91 1800 200 8899',
    },
    email: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'inactive', 'maintenance'],
      default: 'active',
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.Warehouse || mongoose.model('Warehouse', warehouseSchema);
