const mongoose = require('mongoose');

const aiMessageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'AIConversation',
      required: true,
      index: true,
    },
    sessionId: { type: String, required: true, index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, required: true },
    intent: { type: String, default: '' },
    productsShown: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    actionType: { type: String, default: '' },
    actionData: { type: mongoose.Schema.Types.Mixed, default: null },
    isUnanswered: { type: Boolean, default: false },
  },
  { timestamps: true }
);

aiMessageSchema.index({ conversationId: 1, createdAt: 1 });

module.exports = mongoose.models.AIMessage || mongoose.model('AIMessage', aiMessageSchema);
