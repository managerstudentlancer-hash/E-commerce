const Banner = require('../models/Banner');

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
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
    res.json({ success: true, banner });
  } catch (error) {
    next(error);
  }
};

// @desc Delete banner (Admin)
// @route DELETE /api/banners/:id
const deleteBanner = async (req, res, next) => {
  try {
    const banner = await Banner.findByIdAndDelete(req.params.id);
    if (!banner) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }
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
