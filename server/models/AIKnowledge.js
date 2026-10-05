const mongoose = require('mongoose');

const aiKnowledgeSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    category: {
      type: String,
      enum: [
        'General',
        'About',
        'Shipping',
        'Returns',
        'Refunds',
        'Cancellation',
        'Payments',
        'Exchange',
        'Orders',
        'Products',
        'Offers',
        'Contact',
        'Store',
        'Other',
      ],
      default: 'General',
    },
    content: { type: String, required: true },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    priority: { type: Number, default: 0 },
    tags: [{ type: String, trim: true }],
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

aiKnowledgeSchema.index({ category: 1, status: 1, priority: -1 });
aiKnowledgeSchema.index({ title: 'text', content: 'text', tags: 'text' });

module.exports = mongoose.models.AIKnowledge || mongoose.model('AIKnowledge', aiKnowledgeSchema);
