const mongoose = require('mongoose');

const deliveryPayoutConfigSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      default: 'default',
      unique: true,
    },
    // Rates & Incentives
    baseDeliveryFee: {
      type: Number,
      default: 50.0,
      min: 0,
    },
    returnPickupFee: {
      type: Number,
      default: 40.0,
      min: 0,
    },
    rainSurgeFee: {
      type: Number,
      default: 15.0,
      min: 0,
    },
    festivalSurgeFee: {
      type: Number,
      default: 20.0,
      min: 0,
    },
    distanceRatePerKm: {
      type: Number,
      default: 5.0,
      min: 0,
    },
    distanceThresholdKm: {
      type: Number,
      default: 3.0,
      min: 0,
    },
    onTimeSlaBonus: {
      type: Number,
      default: 500.0,
      min: 0,
    },
    onTimeSlaThresholdPercent: {
      type: Number,
      default: 95.0,
      min: 50,
      max: 100,
    },

    // Payout Policies
    minimumPayoutThreshold: {
      type: Number,
      default: 500.0,
      min: 100,
    },
    payoutSchedule: {
      type: String,
      enum: ['daily', 'weekly_monday', 'biweekly', 'monthly', 'manual_only'],
      default: 'weekly_monday',
    },
    autoPayoutEnabled: {
      type: Boolean,
      default: true,
    },
    allowManualWithdrawal: {
      type: Boolean,
      default: true,
    },
    tdsPercentage: {
      type: Number,
      default: 1.0, // 1% Section 194C contractor TDS in India
      min: 0,
      max: 30,
    },
    processingFee: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPayoutsPaused: {
      type: Boolean,
      default: false, // Circuit breaker
    },
    pauseReason: {
      type: String,
      default: '',
    },
    provider: {
      type: String,
      enum: ['razorpayx', 'manual_bank'],
      default: 'razorpayx',
    },
    lastUpdatedBy: {
      type: String,
      default: 'system',
    },
  },
  { timestamps: true }
);

// Helper to get or initialize default singleton configuration
deliveryPayoutConfigSchema.statics.getEffectiveConfig = async function () {
  let config = await this.findOne({ key: 'default' });
  if (!config) {
    config = await this.create({ key: 'default' });
  }
  return config;
};

module.exports =
  mongoose.models.DeliveryPayoutConfig ||
  mongoose.model('DeliveryPayoutConfig', deliveryPayoutConfigSchema);
