const Banner = require('../models/Banner');
const gridfsService = require('../services/gridfsService');

const defaultDualBanners = [
  // Left Dual Banners
  {
    title: 'Bespoke Italian Outerwear',
    subtitle: 'Pure cashmere coats and masterfully tailored silhouettes.',
    tag: 'AUTUMN ATELIER',
    productBadge: 'Pure Cashmere Blend',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85',
    buttonText: 'Explore Suiting',
    buttonLink: '/category/men-wear',
    position: 'dual-left',
    active: true,
    sortOrder: 1,
  },
  {
    title: 'Up to 50% Off Selected',
    subtitle: 'Curated luxury styles at exceptional prices.',
    tag: 'SUMMER SALE',
    productBadge: 'Handcrafted Leather',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=85',
    buttonText: 'Shop Now',
    buttonLink: '/collection/special-offers',
    position: 'dual-left',
    active: true,
    sortOrder: 2,
  },
  {
    title: 'Timeless Prestige Chronographs',
    subtitle: 'Masterpiece automatic movements engineered for elegance.',
    tag: 'LIMITED EDITION',
    productBadge: 'Swiss Automatic 50M',
    image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=800&q=85',
    buttonText: 'Discover Watches',
    buttonLink: '/category/jewellery',
    position: 'dual-left',
    active: true,
    sortOrder: 3,
  },

  // Right Dual Banners
  {
    title: 'Effortless Silk Eveningwear',
    subtitle: 'Lightweight mulberry silks designed for sunset soirees.',
    tag: 'RESORT COLLECTION',
    productBadge: '100% Mulberry Silk',
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=800&q=85',
    buttonText: 'View Lookbook',
    buttonLink: '/category/women-wear',
    position: 'dual-right',
    active: true,
    sortOrder: 1,
  },
  {
    title: 'Discover The Latest Trends',
    subtitle: 'Fresh seasonal drops from top European designers.',
    tag: 'NEW ARRIVALS 2026',
    productBadge: 'Polarized UV400',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=800&q=85',
    buttonText: 'Explore Now',
    buttonLink: '/collection/new-arrivals',
    position: 'dual-right',
    active: true,
    sortOrder: 2,
  },
  {
    title: 'Enchanting Elixirs & Fragrance',
    subtitle: 'Rare botanical notes bottled by master French perfumers.',
    tag: 'CLEAN BEAUTY',
    productBadge: 'French Botanical Distillate',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=85',
    buttonText: 'Shop Fragrance',
    buttonLink: '/category/beauty',
    position: 'dual-right',
    active: true,
    sortOrder: 3,
  },
];

const defaultHeroBanners = [
  {
    title: 'Elevate Your Everyday Style',
    subtitle: 'Discover premium quality products crafted for effortless comfort, modern silhouettes and timeless elegance.',
    tag: 'NEW COLLECTION 2026',
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    secondaryText: 'View Collection',
    secondaryLink: '/collection/new-arrivals',
    position: 'hero',
    active: true,
    sortOrder: 1,
  },
  {
    title: 'Autumn Winter 2026 Collection',
    subtitle: 'MODERN MINIMALIST LUXURY',
    tag: 'AUTUMN ATELIER',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    buttonText: 'Discover Collection',
    buttonLink: '/collection/new-arrivals',
    secondaryText: 'Shop Now',
    secondaryLink: '/shop',
    position: 'hero',
    active: true,
    sortOrder: 2,
  },
];

const autoSeedDefaultBanners = async () => {
  const dualCount = await Banner.countDocuments({ position: { $in: ['dual-left', 'dual-right'] } });
  if (dualCount === 0) {
    await Banner.insertMany(defaultDualBanners);
  }
  const heroCount = await Banner.countDocuments({ position: 'hero' });
  if (heroCount === 0) {
    await Banner.insertMany(defaultHeroBanners);
  }
};

// @desc Get active banners
// @route GET /api/banners
const getBanners = async (req, res, next) => {
  try {
    await autoSeedDefaultBanners();

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
    await autoSeedDefaultBanners();

    const banners = await Banner.find().sort({ position: 1, sortOrder: 1, createdAt: -1 });
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

    // Clean up replaced images from MongoDB GridFS
    if (req.body.image && existing.image && existing.image !== req.body.image) {
      await gridfsService.deleteFromGridFS(existing.image).catch(() => {});
    }
    if (req.body.mobileImage && existing.mobileImage && existing.mobileImage !== req.body.mobileImage) {
      await gridfsService.deleteFromGridFS(existing.mobileImage).catch(() => {});
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
      await gridfsService.deleteFromGridFS(banner.image).catch(() => {});
    }
    if (banner.mobileImage) {
      await gridfsService.deleteFromGridFS(banner.mobileImage).catch(() => {});
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
