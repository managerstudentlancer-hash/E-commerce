const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  senderName: { type: String, required: true },
  senderRole: { type: String, enum: ['customer', 'seller', 'admin'], default: 'customer' },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const supportTicketSchema = new mongoose.Schema(
  {
    ticketNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userName: { type: String, required: true },
    userEmail: { type: String, required: true },
    role: { type: String, enum: ['customer', 'seller'], default: 'customer' },
    category: {
      type: String,
      enum: [
        'Order Issue',
        'Payment Issue',
        'Delivery Issue',
        'Return/Refund',
        'Product Issue',
        'Account Issue',
        'Seller Issue',
        'Other',
      ],
      required: true,
    },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    orderNumber: { type: String, default: '' },
    status: {
      type: String,
      enum: ['OPEN', 'IN_PROGRESS', 'WAITING_FOR_USER', 'RESOLVED', 'CLOSED'],
      default: 'OPEN',
    },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    replies: [replySchema],
  },
  { timestamps: true }
);

module.exports =
  mongoose.models.SupportTicket || mongoose.model('SupportTicket', supportTicketSchema);
