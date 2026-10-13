const Category = require('../models/Category');
const Product = require('../models/Product');
const gridfsService = require('../services/gridfsService');

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
    
    // Dynamically calculate live product counts for each category
    const categoriesWithCount = await Promise.all(
      categories.map(async (cat) => {
        const catObj = cat.toObject();
        const count = await Product.countDocuments({
          $or: [
            { category: cat.name },
            { category: cat.slug },
            { categorySlug: cat.slug },
            { subcategory: cat.slug },
            { subcategory: new RegExp(`^${cat.name}$`, 'i') },
          ],
        });
        catObj.liveCount = count;
        catObj.itemCount = count || catObj.itemCount || 0;
        return catObj;
      })
    );

    res.json({ success: true, count: categoriesWithCount.length, categories: categoriesWithCount });
  } catch (error) {
    next(error);
  }
};

// @desc Sync all dummy products and catalog categories (Admin)
// @route POST /api/categories/sync-dummy
const syncDummyCatalog = async (req, res, next) => {
  try {
    const { importDummyProducts } = require('../services/dummyProductService');
    const result = await importDummyProducts();
    const categories = await Category.find().sort({ sortOrder: 1, name: 1 });
    res.json({
      success: true,
      message: `Successfully synchronized ${result.totalProducts} DummyJSON products across ${categories.length} categories!`,
      result,
      categoriesCount: categories.length,
    });
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
      activewear: 'sports-accessories',
      eyewear: 'sunglasses',
      watch: 'womens-watches',
      watches: 'mens-watches',
      'women-dresses': 'womens-dresses',
      'women-shoes': 'womens-shoes',
      'women-bags': 'womens-bags',
      'women-jewellery': 'womens-jewellery',
      'women-jewelry': 'womens-jewellery',
      'womens-jewelry': 'womens-jewellery',
      'women-watches': 'womens-watches',
      'women-tops': 'tops',
      'men-shirts': 'mens-shirts',
      'men-shoes': 'mens-shoes',
      'men-watches': 'mens-watches',
      skincare: 'skin-care',
      saree: 'sarees',
      sarees: 'sarees',
      'women-sarees': 'sarees',
      'ethnic-wear': 'sarees',
    };

    const slug = slugAliases[rawSlug] || rawSlug;
    let category = await Category.findOne({ slug });

    const categoryTitleMap = {
      'women-wear': "Women's Fashion",
      'sarees': "Sarees & Ethnic Wear",
      'men-wear': "Men's Fashion",
      'kids-wear': "Kids' Wear",
      'womens-dresses': "Women's Dresses",
      'womens-shoes': "Women's Shoes & Heels",
      'womens-bags': "Women's Bags & Luggage",
      'womens-jewellery': "Women's Fine Jewellery",
      'womens-watches': "Women's Luxury Watches",
      tops: "Women's Tops & Shirts",
      'mens-shirts': "Men's Shirts",
      'mens-shoes': "Men's Shoes & Sneakers",
      'mens-watches': "Men's Watches",
      beauty: 'Beauty & Cosmetics',
      fragrances: 'Fragrances & Perfumes',
      'skin-care': 'Skincare & Elixirs',
      sunglasses: 'Sunglasses & Eyewear',
      furniture: 'Furniture & Living',
      'home-decoration': 'Home Decoration',
      'kitchen-accessories': 'Kitchen & Dining',
      groceries: 'Groceries & Gourmet',
      laptops: 'Laptops & Computers',
      smartphones: 'Smartphones',
      tablets: 'Tablets & E-Readers',
      'mobile-accessories': 'Mobile Accessories',
      'sports-accessories': 'Sports & Fitness Accessories',
      motorcycle: 'Motorcycles & Riding Gear',
      vehicle: 'Vehicles & Automotive',
      shoes: 'Shoes & Footwear',
      jewellery: 'Fine Jewellery & Watches',
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
        categoryTitleMap[rawSlug] ||
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
    let baseQuery;

    if (slug === 'women-wear' || rawSlug === 'women' || rawSlug === 'women-wear') {
      baseQuery = {
        gender: 'women',
        status: 'active',
      };
    } else if (slug === 'sarees' || rawSlug === 'saree' || rawSlug === 'sarees' || slug === 'ethnic-wear') {
      baseQuery = {
        $or: [
          { subcategory: new RegExp('^sarees?$', 'i') },
          { tags: { $in: ['saree', 'sarees'] } },
          { categorySlug: 'sarees' },
          { collectionSlug: 'ethnic-wear' },
        ],
        status: 'active',
      };
    } else if (slug === 'men-wear' || rawSlug === 'men' || rawSlug === 'men-wear') {
      baseQuery = {
        gender: 'men',
        status: 'active',
      };
    } else if (slug === 'womens-dresses' || rawSlug === 'women-dresses' || rawSlug === 'womens-dresses') {
      baseQuery = {
        $or: [
          { category: 'womens-dresses' },
          { categorySlug: 'womens-dresses' },
          { collectionSlug: 'women-dresses' },
          { category: 'tops' },
        ],
        status: 'active',
      };
    } else if (slug === 'womens-shoes' || rawSlug === 'women-shoes' || rawSlug === 'womens-shoes') {
      baseQuery = {
        $or: [
          { category: 'womens-shoes' },
          { categorySlug: 'womens-shoes' },
          { collectionSlug: 'women-shoes' },
        ],
        status: 'active',
      };
    } else if (slug === 'womens-bags' || rawSlug === 'women-bags' || rawSlug === 'womens-bags') {
      baseQuery = {
        $or: [
          { category: 'womens-bags' },
          { categorySlug: 'womens-bags' },
          { collectionSlug: 'women-bags' },
        ],
        status: 'active',
      };
    } else if (
      slug === 'womens-jewellery' ||
      rawSlug === 'women-jewellery' ||
      rawSlug === 'womens-jewellery' ||
      slug === 'womens-jewelry' ||
      rawSlug === 'women-jewelry'
    ) {
      baseQuery = {
        $or: [
          { category: 'womens-jewellery' },
          { categorySlug: 'womens-jewellery' },
          { collectionSlug: 'women-jewellery' },
        ],
        status: 'active',
      };
    } else if (slug === 'womens-watches' || rawSlug === 'women-watches' || rawSlug === 'womens-watches') {
      baseQuery = {
        $or: [
          { category: 'womens-watches' },
          { categorySlug: 'womens-watches' },
          { collectionSlug: 'women-watches' },
        ],
        status: 'active',
      };
    } else if (slug === 'tops' || rawSlug === 'women-tops') {
      baseQuery = {
        $or: [
          { category: 'tops' },
          { categorySlug: 'tops' },
          { collectionSlug: 'women-tops' },
        ],
        status: 'active',
      };
    } else if (slug === 'mens-shirts' || rawSlug === 'men-shirts' || rawSlug === 'mens-shirts') {
      baseQuery = {
        $or: [
          { category: 'mens-shirts' },
          { categorySlug: 'mens-shirts' },
          { collectionSlug: 'men-shirts' },
        ],
        status: 'active',
      };
    } else if (slug === 'mens-shoes' || rawSlug === 'men-shoes' || rawSlug === 'mens-shoes') {
      baseQuery = {
        $or: [
          { category: 'mens-shoes' },
          { categorySlug: 'mens-shoes' },
          { collectionSlug: 'men-shoes' },
        ],
        status: 'active',
      };
    } else if (slug === 'mens-watches' || rawSlug === 'men-watches' || rawSlug === 'mens-watches') {
      baseQuery = {
        $or: [
          { category: 'mens-watches' },
          { categorySlug: 'mens-watches' },
          { collectionSlug: 'men-watches' },
        ],
        status: 'active',
      };
    } else {
      baseQuery = {
        $or: [
          { categorySlug: slug },
          { categorySlug: rawSlug },
          { category: slug },
          { category: rawSlug },
          { category: new RegExp(`^${category.name}$`, 'i') },
          { category: new RegExp(`^${slug}$`, 'i') },
          { collectionSlug: slug },
          { subcategory: slug },
          { subcategory: new RegExp(`^${slug.replace(/-/g, ' ')}$`, 'i') },
        ],
        status: 'active',
      };
    }

    // Extract all unique brands and subcategories in this category for filters
    const allCategoryProducts = await Product.find(baseQuery).select('brand subcategory price');
    const availableBrands = [...new Set(allCategoryProducts.map((p) => p.brand).filter(Boolean))];
    const availableSubcategories = [...new Set(allCategoryProducts.map((p) => p.subcategory).filter(Boolean))];

    // Build dynamic filtered query
    const andList = [];
    if (baseQuery.$and) {
      andList.push(...baseQuery.$and);
    } else {
      andList.push(baseQuery);
    }

    // Brand filter (supports single or multiple comma-separated brands)
    if (req.query.brand && req.query.brand !== 'all') {
      const brandList = req.query.brand.split(',').map((b) => b.trim()).filter(Boolean);
      if (brandList.length === 1) {
        andList.push({ brand: new RegExp(`^${brandList[0]}$`, 'i') });
      } else if (brandList.length > 1) {
        andList.push({ brand: { $in: brandList.map((b) => new RegExp(`^${b}$`, 'i')) } });
      }
    }

    // Subcategory filter
    if (req.query.subcategory && req.query.subcategory !== 'all') {
      andList.push({ subcategory: new RegExp(`^${req.query.subcategory}$`, 'i') });
    }

    // Price range filter
    if (req.query.minPrice || req.query.maxPrice) {
      const pQ = {};
      if (req.query.minPrice) pQ.$gte = Number(req.query.minPrice);
      if (req.query.maxPrice) pQ.$lte = Number(req.query.maxPrice);
      andList.push({ price: pQ });
    }

    // Customer Rating filter (e.g. 4+ stars)
    if (req.query.rating) {
      andList.push({ rating: { $gte: Number(req.query.rating) } });
    }

    // Discount filter (e.g. 20% or more, 50% or more)
    if (req.query.minDiscount) {
      andList.push({ discount: { $gte: Number(req.query.minDiscount) } });
    }

    // In Stock filter
    if (req.query.inStock === 'true') {
      andList.push({ stock: { $gt: 0 } });
    }

    // Gender filter
    if (req.query.gender && req.query.gender !== 'all') {
      andList.push({ gender: req.query.gender.toLowerCase() });
    }

    // On Sale / Discount filter
    if (req.query.onSale === 'true') {
      andList.push({ discount: { $gt: 0 } });
    }

    const filterQuery = andList.length > 1 ? { $and: andList } : andList[0];

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (req.query.sort === 'price-asc') sortOptions = { price: 1 };
    else if (req.query.sort === 'price-desc') sortOptions = { price: -1 };
    else if (req.query.sort === 'rating') sortOptions = { rating: -1, numReviews: -1 };
    else if (req.query.sort === 'popular') sortOptions = { bestseller: -1, rating: -1 };
    else if (req.query.sort === 'newest') sortOptions = { createdAt: -1, newArrival: -1 };

    // Pagination & Product Limits (e.g. limit: 12, 24, 36, 48)
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(1000, parseInt(req.query.limit, 10) || 12));
    const skip = Math.max(0, (page - 1) * limit);

    const total = await Product.countDocuments(filterQuery);
    const products = await Product.find(filterQuery)
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      category,
      total,
      productCount: products.length,
      currentPage: page,
      limit,
      totalPages: Math.ceil(total / (limit || 12)) || 1,
      hasMore: total > skip + products.length,
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

    if (image !== undefined && category.image && category.image !== image) {
      await gridfsService.deleteFromGridFS(category.image).catch(() => {});
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

    if (category.image) {
      await gridfsService.deleteFromGridFS(category.image).catch(() => {});
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
  syncDummyCatalog,
};
