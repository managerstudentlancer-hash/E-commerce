const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    highlight: { type: String, default: '' },
    image: { type: String, required: true },
    mobileImage: { type: String, default: '' },
    buttonText: { type: String, default: 'Shop Now' },
    buttonLink: { type: String, default: '/shop' },
    position: {
      type: String,
      enum: ['hero', 'promotional', 'split', 'footer-banner'],
      default: 'hero',
    },
    active: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Banner || mongoose.model('Banner', bannerSchema);
