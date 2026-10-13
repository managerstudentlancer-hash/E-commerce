const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, default: '', trim: true },
    highlight: { type: String, default: '', trim: true },
    tag: { type: String, default: '', trim: true },
    productBadge: { type: String, default: '', trim: true },
    image: { type: String, required: true, trim: true },
    mobileImage: { type: String, default: '', trim: true },
    buttonText: { type: String, default: 'Shop Now', trim: true },
    buttonLink: { type: String, default: '/shop', trim: true },
    secondaryText: { type: String, default: '', trim: true },
    secondaryLink: { type: String, default: '', trim: true },
    description: { type: String, default: '', trim: true },
    position: {
      type: String,
      enum: ['hero', 'promotional', 'split', 'dual-left', 'dual-right', 'footer-banner'],
      default: 'hero',
      index: true,
    },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
