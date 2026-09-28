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

// @desc Get category by slug with full filtering, top brands, and product limits
// @route GET /api/categories/:slug
const getCategoryBySlug = async (req, res, next) => {
  try {
    const rawSlug = (req.params.slug || '').toLowerCase().trim();

    // Map common slug aliases so legacy or short URLs match catalog categories seamlessly
    const slugAliases = {
      women: 'women-wear',
      'womens-fashion': 'women-wear',
      'women-fashion': 'women-wear',
      men: 'men-wear',
      'mens-fashion': 'men-wear',
      'men-fashion': 'men-wear',
      kids: 'kids-wear',
      home: 'home-living',
      audio: 'electronics',
      tech: 'electronics',
      activewear: 'health-fitness',
      eyewear: 'vision-care',
      watch: 'jewellery',
      watches: 'jewellery',
    };

    const slug = slugAliases[rawSlug] || rawSlug;
    let category = await Category.findOne({ slug });

    const categoryTitleMap = {
      'women-wear': "Women's Fashion",
      'men-wear': "Men's Fashion",
      'kids-wear': "Kids' Wear",
      shoes: 'Shoes & Footwear',
      beauty: 'Beauty & Skincare',
      jewellery: 'Watches & Fine Jewellery',
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
      const friendlyName =
        categoryTitleMap[slug] ||
        slug
          .split('-')
          .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
          .join(' ');
      category = {
        name: friendlyName,
        slug: slug,
        description: `Explore our premium ${friendlyName} collection curated for modern style, exceptional durability, and everyday luxury.`,
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80',
        itemCount: 0,
      };
    }

    // Base category matching query
    const baseQuery = {
      $or: [
        { categorySlug: slug },
        { categorySlug: rawSlug },
        { category: new RegExp(`^${category.name}$`, 'i') },
        { category: new RegExp(`^${slug}$`, 'i') },
        { category: new RegExp(slug.replace(/-/g, ' '), 'i') },
        { subcategory: new RegExp(slug.replace(/-/g, ' '), 'i') },
        { tags: new RegExp(slug.replace(/-/g, ' '), 'i') },
      ],
      status: 'active',
    };

    // Extract all unique brands and subcategories in this category for filters
    const allCategoryProducts = await Product.find(baseQuery).select('brand subcategory price');
    const availableBrands = [...new Set(allCategoryProducts.map((p) => p.brand).filter(Boolean))];
    const availableSubcategories = [...new Set(allCategoryProducts.map((p) => p.subcategory).filter(Boolean))];

    // Build dynamic filtered query
    const filterQuery = { ...baseQuery };

    // Brand filter (supports single or multiple comma-separated brands)
    if (req.query.brand && req.query.brand !== 'all') {
      const brandList = req.query.brand.split(',').map((b) => b.trim()).filter(Boolean);
      if (brandList.length === 1) {
        filterQuery.brand = new RegExp(`^${brandList[0]}$`, 'i');
      } else if (brandList.length > 1) {
        filterQuery.brand = { $in: brandList.map((b) => new RegExp(`^${b}$`, 'i')) };
      }
    }

    // Subcategory filter
    if (req.query.subcategory && req.query.subcategory !== 'all') {
      filterQuery.subcategory = new RegExp(`^${req.query.subcategory}$`, 'i');
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      filterQuery.price = {};
      if (req.query.minPrice) filterQuery.price.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) filterQuery.price.$lte = Number(req.query.maxPrice);
    }

    // Customer Rating filter (e.g. 4+ stars)
    if (req.query.rating) {
      filterQuery.rating = { $gte: Number(req.query.rating) };
    }

    // Discount filter (e.g. 20% or more, 50% or more)
    if (req.query.minDiscount) {
      filterQuery.discount = { $gte: Number(req.query.minDiscount) };
    }

    // In Stock filter
    if (req.query.inStock === 'true') {
      filterQuery.stock = { $gt: 0 };
    }

    // On Sale / Discount filter
    if (req.query.onSale === 'true') {
      filterQuery.discount = { $gt: 0 };
    }

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sortOptions = { price: 1 };
    else if (req.query.sort === 'price-desc') sortOptions = { price: -1 };
    else if (req.query.sort === 'rating') sortOptions = { rating: -1, numReviews: -1 };
    else if (req.query.sort === 'popular') sortOptions = { bestseller: -1, rating: -1 };
    else if (req.query.sort === 'newest') sortOptions = { createdAt: -1, newArrival: -1 };

    // Pagination & Product Limits (e.g. limit: 12, 24, 36, 48)
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 12;
    const skip = (page - 1) * limit;

    const total = await Product.countDocuments(filterQuery);
    let products = await Product.find(filterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    // If completely empty due to no matching products in raw query, provide fallback items
    if (products.length === 0 && total === 0 && !req.query.brand && !req.query.subcategory) {
      products = await Product.find({ status: 'active' }).limit(limit);
    }

    res.json({
      success: true,
      category,
      total: total || products.length,
      productCount: products.length,
      currentPage: page,
      limit,
      totalPages: Math.ceil((total || products.length) / (limit || 12)),
      hasMore: (total || products.length) > skip + products.length,
      availableBrands,
      availableSubcategories,
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
      icon: icon || 'Tag',
      sortOrder: sortOrder || 0,
      status: status || 'active',
      parentCategory: parentCategory || null,
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

    const { name, description, image, icon, sortOrder, status, parentCategory } = req.body;
    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }
    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (icon !== undefined) category.icon = icon;
    if (sortOrder !== undefined) category.sortOrder = sortOrder;
    if (status !== undefined) category.status = status;
    if (parentCategory !== undefined) category.parentCategory = parentCategory;

    await category.save();
    res.json({ success: true, category });
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
