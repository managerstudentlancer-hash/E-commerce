const mongoose = require('mongoose');

const deliveryPayoutSchema = new mongoose.Schema(
  {
    payoutNumber: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    deliveryPartner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 1,
    },
    grossEarnings: {
      type: Number,
      required: true,
      min: 0,
    },
    deductions: {
      type: Number,
      default: 0,
    },
    tdsAmount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ['eligible', 'pending', 'processing', 'paid', 'failed', 'reversed'],
      default: 'pending',
      index: true,
    },
    mode: {
      type: String,
      enum: ['IMPS', 'NEFT', 'RTGS', 'UPI'],
      default: 'IMPS',
    },
    payoutType: {
      type: String,
      enum: ['scheduled_auto', 'manual_request', 'admin_override'],
      default: 'manual_request',
    },
    beneficiary: {
      accountHolderName: { type: String, default: '' },
      accountNumberMasked: { type: String, default: '' },
      ifscCode: { type: String, default: '' },
      bankName: { type: String, default: '' },
      upiId: { type: String, default: '' },
      fundAccountId: { type: String, default: '' },
      contactId: { type: String, default: '' },
    },
    provider: {
      type: String,
      enum: ['razorpayx', 'manual_bank'],
      default: 'razorpayx',
    },
    providerReferenceId: {
      type: String,
      default: '',
      index: true,
    },
    providerStatus: {
      type: String,
      default: 'created',
    },
    idempotencyKey: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    failureReason: {
      type: String,
      default: '',
    },
    reversedAt: {
      type: Date,
      default: null,
    },
    reversalReason: {
      type: String,
      default: '',
    },
    earningsLedgerIds: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeliveryEarningLedger',
      },
    ],
    initiatedAt: {
      type: Date,
      default: Date.now,
    },
    processedAt: {
      type: Date,
      default: null,
    },
    adminNotes: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.DeliveryPayout ||
  mongoose.model('DeliveryPayout', deliveryPayoutSchema);
