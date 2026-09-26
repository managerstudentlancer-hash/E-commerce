const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, default: '' },
  variant: { type: String, default: '' },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  sellerName: { type: String, default: 'VEXIVO Official' },
});

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    guestEmail: { type: String, default: '' },
    items: [orderItemSchema],
    subtotal: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    shipping: { type: Number, default: 0 },
    tax: { type: Number, default: 0 },
    total: { type: Number, required: true },
    coupon: { type: String, default: '' },
    shippingAddress: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: '' },
      postalCode: { type: String, required: true },
      country: { type: String, default: 'United Kingdom' },
      phone: { type: String, default: '' },
    },
    billingAddress: {
      firstName: { type: String, default: '' },
      lastName: { type: String, default: '' },
      address: { type: String, default: '' },
      city: { type: String, default: '' },
      state: { type: String, default: '' },
      postalCode: { type: String, default: '' },
      country: { type: String, default: 'United Kingdom' },
    },
    paymentMethod: { type: String, default: 'Credit Card' },
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed', 'refunded'],
      default: 'pending',
    },
    orderStatus: {
      type: String,
      enum: ['pending', 'confirmed', 'processing', 'shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'],
      default: 'confirmed',
    },
    cancellationReason: { type: String, default: '' },
    cancelledAt: { type: Date, default: null },
    returnReason: { type: String, default: '' },
    returnedAt: { type: Date, default: null },
    trackingNumber: { type: String, default: '' },
    trackingHistory: [
      {
        status: { type: String, required: true },
        message: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model('Order', orderSchema);
