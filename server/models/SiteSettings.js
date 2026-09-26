const mongoose = require('mongoose');

const siteSettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: 'VEXIVO' },
    logo: { type: String, default: '' },
    favicon: { type: String, default: '' },
    announcementText: {
      type: String,
      default: '✨ FREE UK NEXT-DAY DELIVERY OVER £50 | USE CODE VEX10 FOR 10% OFF',
    },
    announcements: [
      {
        type: String,
      },
    ],
    socialLinks: {
      instagram: { type: String, default: 'https://instagram.com/vexivo' },
      facebook: { type: String, default: 'https://facebook.com/vexivo' },
      twitter: { type: String, default: 'https://twitter.com/vexivo' },
      tiktok: { type: String, default: 'https://tiktok.com/@vexivo' },
      pinterest: { type: String, default: 'https://pinterest.com/vexivo' },
      youtube: { type: String, default: 'https://youtube.com/vexivo' },
    },
    contactInfo: {
      email: { type: String, default: 'concierge@vexivo.com' },
      phone: { type: String, default: '+44 20 7946 0991' },
      address: { type: String, default: '71-75 Shelton Street, Covent Garden, London, WC2H 9JQ' },
      hours: { type: String, default: 'Monday - Saturday: 9:00 AM - 6:00 PM GMT' },
    },
    footerContent: {
      aboutText: {
        type: String,
        default:
          'VEXIVO is the premier destination for modern lifestyle essentials, curated trending collections, luxury apparel, and state-of-the-art gadgets engineered for everyday elegance.',
      },
      copyrightText: {
        type: String,
        default: '© 2026 VEXIVO Ltd. All rights reserved. Registered in England & Wales.',
      },
    },
    freeShippingThreshold: { type: Number, default: 50 },
  },
  { timestamps: true }
);

module.exports = mongoose.models.SiteSettings || mongoose.model('SiteSettings', siteSettingsSchema);
