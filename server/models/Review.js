const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    userName: { type: String, required: true },
    userEmail: { type: String, default: '' },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, trim: true },
    comment: { type: String, required: true },
    verifiedPurchase: { type: Boolean, default: true },
    status: { type: String, enum: ['approved', 'pending', 'rejected'], default: 'approved' },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Review || mongoose.model('Review', reviewSchema);
