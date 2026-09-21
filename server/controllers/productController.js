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

    // Fetch related products from same category
    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
      status: 'active',
    })
      .limit(4)
      .select('name slug price compareAtPrice discount images thumbnail rating numReviews');

    res.json({
      success: true,
      product,
      relatedProducts,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create new product (Admin)
// @route POST /api/products
const createProduct = async (req, res, next) => {
  try {
    const productData = { ...req.body };
    if (!productData.slug && productData.name) {
      productData.slug = slugify(productData.name);
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

// @desc Update product (Admin)
// @route PUT /api/products/:id
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    if (req.body.name && !req.body.slug) {
      req.body.slug = slugify(req.body.name);
    }

    Object.assign(product, req.body);
    const updatedProduct = await product.save();

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    next(error);
  }
};

// @desc Delete product (Admin)
// @route DELETE /api/products/:id
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'Product deleted successfully' });
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
  uploadProductImage,
};
