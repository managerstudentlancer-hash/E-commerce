const mongoose = require('mongoose');

const reviewLikeSchema = new mongoose.Schema(
  {
    review: { type: mongoose.Schema.Types.ObjectId, ref: 'Review', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

// Compound unique index ensuring 1 like per user per review
reviewLikeSchema.index({ review: 1, user: 1 }, { unique: true });

module.exports = mongoose.models.ReviewLike || mongoose.model('ReviewLike', reviewLikeSchema);
