const mongoose = require('mongoose');

const aiFaqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General', trim: true },
    status: {
      type: String,
      enum: ['active', 'draft'],
      default: 'active',
    },
    tags: [{ type: String, trim: true }],
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

aiFaqSchema.index({ status: 1, displayOrder: 1 });
aiFaqSchema.index({ question: 'text', answer: 'text', tags: 'text' });

module.exports = mongoose.models.AIFAQ || mongoose.model('AIFAQ', aiFaqSchema);
