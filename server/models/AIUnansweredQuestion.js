const mongoose = require('mongoose');

const aiUnansweredQuestionSchema = new mongoose.Schema(
  {
    question: { type: String, required: true, trim: true },
    normalizedQuery: { type: String, required: true, index: true },
    frequency: { type: Number, default: 1 },
    category: { type: String, default: 'General', trim: true },
    status: {
      type: String,
      enum: ['pending', 'resolved', 'ignored'],
      default: 'pending',
      index: true,
    },
    adminAnswer: { type: String, default: '' },
    lastAskedAt: { type: Date, default: Date.now },
    firstAskedAt: { type: Date, default: Date.now },
    resolvedKnowledgeId: { type: mongoose.Schema.Types.ObjectId, ref: 'AIKnowledge', default: null },
  },
  { timestamps: true }
);

aiUnansweredQuestionSchema.index({ status: 1, frequency: -1, lastAskedAt: -1 });

module.exports =
  mongoose.models.AIUnansweredQuestion ||
  mongoose.model('AIUnansweredQuestion', aiUnansweredQuestionSchema);
