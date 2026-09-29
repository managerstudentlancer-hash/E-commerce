const Banner = require('../models/Banner');
const supabaseStorage = require('../services/supabaseStorage');

// @desc Get active banners
// @route GET /api/banners
const getBanners = async (req, res, next) => {
  try {
    const { position } = req.query;
    const query = { active: true };
    if (position) query.position = position;

    const banners = await Banner.find(query).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, count: banners.length, banners });
  } catch (error) {
    next(error);
  }
};

// @desc Get all banners (Admin)
// @route GET /api/banners/all
const getAllBanners = async (req, res, next) => {
  try {
    const banners = await Banner.find().sort({ position: 1, sortOrder: 1 });
    res.json({ success: true, count: banners.length, banners });
  } catch (error) {
    next(error);
  }
};

// @desc Create banner (Admin)
// @route POST /api/banners
const createBanner = async (req, res, next) => {
  try {
    const banner = await Banner.create(req.body);
    res.status(201).json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// @desc Update banner (Admin)
// @route PUT /api/banners/:id
const updateBanner = async (req, res, next) => {
  try {
    const existing = await Banner.findById(req.params.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    // Clean up replaced images from Supabase Storage
    if (req.body.image && existing.image && existing.image !== req.body.image) {
      await supabaseStorage.deleteFromSupabase(existing.image).catch(() => {});
    }
    if (req.body.mobileImage && existing.mobileImage && existing.mobileImage !== req.body.mobileImage) {
      await supabaseStorage.deleteFromSupabase(existing.mobileImage).catch(() => {});
    }

    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// @desc Delete banner (Admin)
// @route DELETE /api/banners/:id
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    if (banner.image) {
      await supabaseStorage.deleteFromSupabase(banner.image).catch(() => {});
    }
    if (banner.mobileImage) {
      await supabaseStorage.deleteFromSupabase(banner.mobileImage).catch(() => {});
    }

    await Banner.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Banner deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getBanners,
  getAllBanners,
  createBanner,
  updateBanner,
  deleteBanner,
};
