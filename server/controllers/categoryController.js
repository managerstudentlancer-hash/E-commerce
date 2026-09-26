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

// @desc Get all active categories
// @route GET /api/categories
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({ status: 'active' }).sort({ sortOrder: 1, name: 1 });
    res.json({ success: true, count: categories.length, categories });
  } catch (error) {
    next(error);
  }
};

// @desc Get category by slug with products
// @route GET /api/categories/:slug
const getCategoryBySlug = async (req, res, next) => {
  try {
    const rawSlug = (req.params.slug || '').toLowerCase().trim();

    // Map common slug aliases so legacy or short URLs match catalog categories seamlessly
    const slugAliases = {
      women: 'women-wear',
      'womens-fashion': 'women-wear',
      men: 'men-wear',
      'mens-fashion': 'men-wear',
      kids: 'kids-wear',
      home: 'home-living',
      audio: 'electronics',
      tech: 'electronics',
      activewear: 'health-fitness',
      eyewear: 'vision-care',
    };

    const slug = slugAliases[rawSlug] || rawSlug;
    let category = await Category.findOne({ slug });

    // Category title map for friendly display
    const categoryTitleMap = {
      'women-wear': "Women's Fashion",
      'men-wear': "Men's Fashion",
      'kids-wear': "Kids' Wear",
      shoes: 'Shoes & Footwear',
      beauty: 'Beauty & Skincare',
      jewellery: 'Fine Jewellery',
      bags: 'Bags & Luggage',
      hats: 'Hats & Headwear',
      'vision-care': 'Vision Care & Eyewear',
      'pets-care': 'Pets Care & Wellness',
      toys: 'Toys & Board Games',
      'health-fitness': 'Health & Fitness',
      electronics: 'Electronics & Audio',
      'home-living': 'Home & Living',
    };

    if (!category) {
      const friendlyName = categoryTitleMap[slug] || slug.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' ');
      category = {
        name: friendlyName,
        slug: slug,
        description: `Premium ${friendlyName} collection with uncompromising quality and British craftsmanship.`,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
        itemCount: 0,
      };
    }

    // Support pagination if query params are provided
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 0;
    const skip = (page - 1) * limit;

    const query = {
      categorySlug: slug,
      status: 'active',
    };

    const total = await Product.countDocuments(query);
    let productQuery = Product.find(query).sort({ createdAt: -1 });

    if (limit > 0) {
      productQuery = productQuery.skip(skip).limit(limit);
    }

    const products = await productQuery;

    res.json({
      success: true,
      category,
      total,
      productCount: products.length,
      hasMore: limit > 0 ? total > skip + products.length : false,
      currentPage: page,
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
    const { name, description, image, icon, sortOrder } = req.body;
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
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
};
