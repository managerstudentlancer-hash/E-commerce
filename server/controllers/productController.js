const Product = require('../models/Product');

// Helper to slugify string
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

// @desc Get all products with filters & pagination
// @route GET /api/products
const getProducts = async (req, res, next) => {
  try {
    const {
      category,
      collection,
      minPrice,
      maxPrice,
      search,
      featured,
      bestseller,
      newArrival,
      specialOffer,
      sort,
      page = 1,
      limit = 12,
      status = 'active',
      stockStatus,
    } = req.query;

    const andConditions = [];

    if (status && status !== 'all') {
      andConditions.push({ status });
    }

    if (stockStatus === 'out') {
      andConditions.push({ stock: { $lte: 0 } });
    } else if (stockStatus === 'low') {
      andConditions.push({ stock: { $gt: 0, $lte: 10 } });
    } else if (stockStatus === 'in') {
      andConditions.push({ stock: { $gt: 10 } });
    }

    if (category) {
      andConditions.push({
        $or: [
          { categorySlug: category.toLowerCase() },
          { category: new RegExp(category, 'i') },
        ],
      });
    }

    if (collection) {
      andConditions.push({ collectionSlug: collection.toLowerCase() });
    }

    if (featured === 'true') andConditions.push({ featured: true });
    if (bestseller === 'true') andConditions.push({ bestseller: true });
    if (newArrival === 'true') andConditions.push({ newArrival: true });
    if (specialOffer === 'true') andConditions.push({ specialOffer: true });

    if (minPrice || maxPrice) {
      const priceQuery = {};
      if (minPrice) priceQuery.$gte = Number(minPrice);
      if (maxPrice) priceQuery.$lte = Number(maxPrice);
      andConditions.push({ price: priceQuery });
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      andConditions.push({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { brand: searchRegex },
        ],
      });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc') sortOptions = { price: 1 };
    else if (sort === 'price-desc') sortOptions = { price: -1 };
    else if (sort === 'rating') sortOptions = { rating: -1 };
    else if (sort === 'bestseller') sortOptions = { bestseller: -1, rating: -1 };
    else if (sort === 'name-asc') sortOptions = { name: 1 };

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const skip = (pageNum - 1) * limitNum;

    const total = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum);

    res.json({
      success: true,
      count: products.length,
      total,
      totalPages: Math.ceil(total / limitNum),
      currentPage: pageNum,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get single product by slug or id
// @route GET /api/products/:slug
const getProductBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    let product;

    // Check if slug is MongoDB ObjectId
    if (slug.match(/^[0-9a-fA-F]{24}$/)) {
      product = await Product.findById(slug);
    }
    if (!product) {
      product = await Product.findOne({ slug: slug.toLowerCase() });
    }

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Fetch similar / related products strictly prioritizing same subcategory and category first
    let relatedProducts = [];

    // Step 1: Same category (with same subcategory prioritized if available)
    if (product.category || product.categorySlug) {
      const categoryQuery = {
        $or: [
          ...(product.category ? [{ category: product.category }] : []),
          ...(product.categorySlug ? [{ categorySlug: product.categorySlug }] : []),
        ],
        _id: { $ne: product._id },
        status: 'active',
      };

      if (product.subcategory) {
        // Find same subcategory first
        const subcatProds = await Product.find({
          ...categoryQuery,
          subcategory: product.subcategory,
        })
          .limit(8)
          .select('name slug price compareAtPrice discount images thumbnail hoverImage rating numReviews brand category categorySlug subcategory tags');
        relatedProducts.push(...subcatProds);
      }

      // If we need more from the same category
      if (relatedProducts.length < 8) {
        const remainingCategoryProds = await Product.find({
          ...categoryQuery,
          _id: { $nin: [product._id, ...relatedProducts.map((p) => p._id)] },
        })
          .limit(8 - relatedProducts.length)
          .select('name slug price compareAtPrice discount images thumbnail hoverImage rating numReviews brand category categorySlug subcategory tags');
        relatedProducts.push(...remainingCategoryProds);
      }
    }

    // Step 2: Fallback to same brand or tags if fewer than 4 found
    if (relatedProducts.length < 4) {
      const specificTags = (product.tags || []).filter(
        (t) => !['luxury', 'vexivo', 'trending', 'popular'].includes(t.toLowerCase())
      );
      const fallbackQuery = {
        $or: [
          ...(product.brand ? [{ brand: product.brand }] : []),
          ...(specificTags.length > 0 ? [{ tags: { $in: specificTags } }] : []),
        ],
        _id: { $nin: [product._id, ...relatedProducts.map((p) => p._id)] },
        status: 'active',
      };
      const extraProducts = await Product.find(fallbackQuery)
        .limit(8 - relatedProducts.length)
        .select('name slug price compareAtPrice discount images thumbnail hoverImage rating numReviews brand category categorySlug subcategory tags');
      relatedProducts.push(...extraProducts);
    }

    // Step 3: Global fallback if catalog is small
    if (relatedProducts.length < 4) {
      const globalFallbacks = await Product.find({
        _id: { $nin: [product._id, ...relatedProducts.map((p) => p._id)] },
        status: 'active',
      })
        .limit(8 - relatedProducts.length)
        .select('name slug price compareAtPrice discount images thumbnail hoverImage rating numReviews brand category categorySlug subcategory tags');
      relatedProducts.push(...globalFallbacks);
    }

    res.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create new product (Admin or Seller)
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    // Security: Only verified Sellers or Admins can list products
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'seller')) {
      return res.status(403).json({
        success: false,
        message: 'Access Denied: Only approved sellers or administrators are authorized to publish products.',
      });
    }

    const productData = { ...req.body };

    // Attach seller information if user is authenticated
    productData.sellerId = req.user._id;
    productData.sellerName = req.body.sellerName || req.user.name || 'Independent Seller';

    if (!productData.slug && productData.name) {
      const baseSlug = slugify(productData.name);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug: uniqueSlug })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }
      productData.slug = uniqueSlug;
    }
    if (!productData.categorySlug && productData.category) {
      productData.categorySlug = slugify(productData.category);
    }

    const product = await Product.create(productData);
    res.status(201).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

// @desc Update product (Admin can update all; Seller can update only own)
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Role-based authorization: Admin can update any product, seller can only update own
    if (req.user.role !== 'admin') {
      if (!product.sellerId || product.sellerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only edit your own products.',
        });
      }
    }

    if (req.body.name && req.body.name !== product.name && !req.body.slug) {
      const baseSlug = slugify(req.body.name);
      let uniqueSlug = baseSlug;
      let counter = 1;
      while (await Product.findOne({ slug: uniqueSlug, _id: { $ne: product._id } })) {
        uniqueSlug = `${baseSlug}-${counter++}`;
      }
      req.body.slug = uniqueSlug;
    }

    if (req.body.category && !req.body.categorySlug) {
      req.body.categorySlug = slugify(req.body.category);
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc Delete product (Admin can delete all; Seller can delete only own)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Role-based authorization: Admin can delete any product, seller can only delete own
    if (req.user.role !== 'admin') {
      if (!product.sellerId || product.sellerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Access denied: You can only delete your own products.',
        });
      }
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc Get products listed by the currently authenticated seller
// @route GET /api/products/seller/my
const getMySellerProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ sellerId: req.user._id }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Upload product image
// @route POST /api/products/upload-image
const uploadProductImage = (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({ success: true, url: fileUrl });
};

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getMySellerProducts,
  uploadProductImage,
};
