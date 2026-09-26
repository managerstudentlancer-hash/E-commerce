const SiteSettings = require('../models/SiteSettings');

// @desc Get site settings
// @route GET /api/site-settings
const getSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = await SiteSettings.create({
        siteName: 'VEXIVO',
        announcementText: '✨ FREE UK NEXT-DAY DELIVERY OVER £50 | USE CODE VEX10 FOR 10% OFF',
        announcements: [
          '✨ FREE UK NEXT-DAY DELIVERY OVER £50',
          '🔥 SPRING COLLECTION LIVE | USE CODE VEX10 FOR 10% OFF',
          '⭐ OVER 15,000+ VERIFIED 5-STAR REVIEWS',
        ],
      });
    }
    res.json({ success: true, settings });
  } catch (error) {
    next(error);
  }
};

// @desc Update site settings (Admin)
// @route PUT /api/site-settings
const updateSettings = async (req, res, next) => {
  try {
    let settings = await SiteSettings.findOne();
    if (!settings) {
      settings = new SiteSettings(req.body);
    } else {
      Object.assign(settings, req.body);
    }
    const updated = await settings.save();
    res.json({ success: true, settings: updated });
  } catch (error) {
    next(error);
  }
};

module.exports = { getSettings, updateSettings };
