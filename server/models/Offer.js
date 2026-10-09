const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema(
  {
    section: {
      type: String,
      required: true,
      enum: [
        'saree-deals',
        'exclusive-offers',
        'coupons',
        'gift-cards',
        'festival-offers',
        'flash-deals',
      ],
      index: true,
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    code: { type: String, uppercase: true, trim: true }, // For coupons
    discountPercent: { type: Number, default: 0 },
    discountText: { type: String, default: '' }, // e.g. "40% OFF", "₹100 OFF"
    originalPrice: { type: Number, default: 0 },
    discountedPrice: { type: Number, default: 0 },
    minimumOrder: { type: Number, default: 0 },
    fabric: { type: String, default: '' },
    category: { type: String, default: 'Women Wear' },
    image: { type: String, default: '' },
    badge: { type: String, default: '' },
    validity: { type: String, default: 'Limited Period' },
    link: { type: String, default: '/shop' },
    inStock: { type: Number, default: 10 },
    unitsSold: { type: Number, default: 0 },
    unitsTotal: { type: Number, default: 20 },
    endsInMinutes: { type: Number, default: 60 },
    tags: [{ type: String }],
    terms: [{ type: String }],
    themeClass: { type: String, default: '' },
    season: { type: String, default: '' },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Offer || mongoose.model('Offer', offerSchema);
