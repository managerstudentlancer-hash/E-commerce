const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['customer', 'seller', 'admin', 'guest'], default: 'customer' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    userName: { type: String, required: true, trim: true },
    userEmail: { type: String, required: true, trim: true },
    phone: { type: String, default: '', trim: true },
    role: { type: String, enum: ['customer', 'seller', 'guest'], default: 'customer' },
    category: {
      type: String,
      default: 'General Inquiry',
      trim: true,
    },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    orderNumber: { type: String, default: '', trim: true },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
    priority: { type: String, enum: ['low', 'medium', 'high', 'urgent'], default: 'medium' },
    channel: { type: String, default: 'Web Concierge' },
    replies: [replySchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema);
