const mongoose = require('mongoose');

const aiConversationSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null, index: true },
    userEmail: { type: String, default: '' },
    userName: { type: String, default: '' },
    channel: { type: String, default: 'web_drawer' },
    messagesCount: { type: Number, default: 0 },
    productsSearchedCount: { type: Number, default: 0 },
    cartAdditionsCount: { type: Number, default: 0 },
    wishlistAdditionsCount: { type: Number, default: 0 },
    orderQueriesCount: { type: Number, default: 0 },
    lastMessage: { type: String, default: '' },
    startedAt: { type: Date, default: Date.now },
    lastMessageAt: { type: Date, default: Date.now, index: true },
  },
  { timestamps: true }
);

aiConversationSchema.index({ lastMessageAt: -1 });

module.exports =
  mongoose.models.AIConversation || mongoose.model('AIConversation', aiConversationSchema);
