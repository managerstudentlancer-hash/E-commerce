const Category = require('../models/Category');
const Product = require('../models/Product');

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc Get all active categories (Public)
// @route GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

// @desc Get all categories including inactive (Admin)
// @route GET /api/categories/all
const getAllCategoriesAdmin = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

// @desc Get category by slug with products
// @route GET /api/categories/:slug
const getCategoryBySlug = async (req, res, next) => {
  try {
    const slug = (req.params.slug || '').toLowerCase().trim();
    let category = await Category.findOne({ slug });

    const categoryTitleMap = {
      women: "Women's Fashion",
      men: "Men's Tailoring",
      kids: "Kids' Wear",
      shoes: 'Footwear & Shoes',
      beauty: 'Beauty & Skincare',
      jewellery: 'Fine Jewellery',
      bags: 'Bags & Leather Goods',
      hats: 'Hats & Headwear',
      watches: 'Watches & Horology',
      electronics: 'Audio & Acoustics',
      'home-living': 'Home & Living',
      activewear: 'Activewear & Studio',
    };

    if (!category) {
      const friendlyName =
        categoryTitleMap[slug] ||
        slug
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');
      category = {
        name: friendlyName,
        slug: slug,
        description: `Curated luxury ${friendlyName} collection engineered with uncompromising material quality and British craftsmanship.`,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        itemCount: 12,
      };
    }

    let products = await Product.find({
      $or: [
        { categorySlug: slug },
        { category: new RegExp(`^${category.name}$`, 'i') },
        { category: new RegExp(`^${slug}$`, 'i') },
        { category: new RegExp(slug, 'i') },
      ],
      status: 'active',
    });

    if (products.length === 0) {
      products = await Product.find({ status: 'active' }).limit(8);
    }

    res.json({
      success: true,
      category,
      productCount: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create category (Admin)
// @route POST /api/categories
const createCategory = async (req, res, next) => {
  try {
    const { name, description, image, icon, sortOrder, status, parentCategory } = req.body;
    const slug = slugify(name);

    const exists = await Category.findOne({ slug });
    if (exists) {
      return res.status(400).json({ success: false, message: 'Category already exists' });
    }

    const category = await Category.create({
      name,
      slug,
      description,
      image,
      icon,
      parentCategory: parentCategory || '',
      status: status || 'active',
      sortOrder: sortOrder || 0,
    });

    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

// @desc Update category (Admin)
// @route PUT /api/categories/:id
const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    if (req.body.name) {
      req.body.slug = slugify(req.body.name);
    }

    Object.assign(category, req.body);
    const updated = await category.save();

    res.json({ success: true, category: updated });
  } catch (error) {
    next(error);
  }
};

// @desc Delete category (Admin)
// @route DELETE /api/categories/:id
const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, message: 'Category not found' });
    }

    await Category.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Category deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getCategories,
  getAllCategoriesAdmin,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
