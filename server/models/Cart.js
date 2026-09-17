const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
  image: { type: String, default: '' },
  variant: { type: String, default: '' },
});

const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    items: [cartItemSchema],
    subtotal: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Auto-calculate subtotal
cartSchema.pre('save', function (next) {
  this.subtotal = this.items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  next();
});

module.exports = mongoose.models.Cart || mongoose.model('Cart', cartSchema);
