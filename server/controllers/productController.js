const Product = require('../models/Product');
const supabaseStorage = require('../services/supabaseStorage');

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
      categorySlug,
      collection,
      collectionSlug,
      gender,
      subcategory,
      minPrice,
      maxPrice,
      search,
      featured,
      bestseller,
      newArrival,
      specialOffer,
      brand,
      subcategory,
      rating,
      minRating,
      inStock,
      minDiscount,
      onSale,
      size,
      color,
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
    } else if (stockStatus === 'in' || inStock === 'true') {
      andConditions.push({ stock: { $gt: 0 } });
    }

    const fashionCategoryAliases = {
      'women-dresses': ['womens-dresses', 'tops', 'women-dresses'],
      'womens-dresses': ['womens-dresses', 'tops', 'women-dresses'],
      'women-shoes': ['womens-shoes', 'women-shoes'],
      'womens-shoes': ['womens-shoes', 'women-shoes'],
      'women-bags': ['womens-bags', 'women-bags'],
      'womens-bags': ['womens-bags', 'women-bags'],
      'women-jewellery': ['womens-jewellery', 'women-jewellery', 'womens-jewelry', 'women-jewelry'],
      'womens-jewellery': ['womens-jewellery', 'women-jewellery', 'womens-jewelry', 'women-jewelry'],
      'women-watches': ['womens-watches', 'women-watches'],
      'womens-watches': ['womens-watches', 'women-watches'],
      'women-tops': ['tops', 'women-tops'],
      'tops': ['tops', 'women-tops'],
      'men-shirts': ['mens-shirts', 'men-shirts'],
      'mens-shirts': ['mens-shirts', 'men-shirts'],
      'men-shoes': ['mens-shoes', 'men-shoes'],
      'mens-shoes': ['mens-shoes', 'men-shoes'],
      'men-watches': ['mens-watches', 'men-watches'],
      'mens-watches': ['mens-watches', 'men-watches'],
    };

    const targetCategory = category || categorySlug;
    if (targetCategory) {
      const catLower = targetCategory.toLowerCase().trim();
      if (catLower === 'women-wear' || catLower === 'women' || catLower === "women's wear") {
        andConditions.push({ gender: 'women' });
      } else if (catLower === 'men-wear' || catLower === 'men' || catLower === "men's wear") {
        andConditions.push({ gender: 'men' });
      } else if (fashionCategoryAliases[catLower]) {
        const aliasList = fashionCategoryAliases[catLower];
        andConditions.push({
          $or: [
            { category: { $in: aliasList } },
            { categorySlug: { $in: aliasList } },
            { collectionSlug: { $in: aliasList } },
            { subcategory: { $in: aliasList } },
          ],
        });
      } else {
        andConditions.push({
          $or: [
            { categorySlug: catLower },
            { category: new RegExp(`^${targetCategory}$`, 'i') },
            { collectionSlug: catLower },
            { subcategory: new RegExp(`^${targetCategory}$`, 'i') },
          ],
        });


    if (subcategory && subcategory !== 'all') {
      const subSafe = subcategory.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      andConditions.push({ subcategory: new RegExp(`^${subSafe}$`, 'i') });
    }

    if (brand && brand !== 'all') {
      const brandList = brand.split(',').map((b) => b.trim()).filter(Boolean);
      if (brandList.length === 1) {
        const bSafe = brandList[0].replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        andConditions.push({ brand: new RegExp(`^${bSafe}$`, 'i') });
      } else if (brandList.length > 1) {
        andConditions.push({
          brand: { $in: brandList.map((b) => new RegExp(`^${b.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i')) },
        });
      }
    }

    const effectiveRating = rating || minRating;
    if (effectiveRating) {
      andConditions.push({ rating: { $gte: Number(effectiveRating) } });
    }

    if (minDiscount) {
      andConditions.push({ discount: { $gte: Number(minDiscount) } });
    }

    if (onSale === 'true') {
      andConditions.push({ discount: { $gt: 0 } });
    }

    if (size) {
      const sSafe = size.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      andConditions.push({
        $or: [
          { 'variants.options': new RegExp(`^${sSafe}$`, 'i') },
          { 'options.size': new RegExp(`^${sSafe}$`, 'i') },
        ],
      });
    }

    if (color) {
      const cSafe = color.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      andConditions.push({
        $or: [
          { 'variants.options': new RegExp(`^${cSafe}$`, 'i') },
          { 'options.color': new RegExp(`^${cSafe}$`, 'i') },
        ],
      });
>>>>>>> main
    }

    const targetCol = collection || collectionSlug;
    if (targetCol) {
      const colLower = targetCol.toLowerCase().trim();
      if (fashionCategoryAliases[colLower]) {
        const aliasList = fashionCategoryAliases[colLower];
        andConditions.push({
          $or: [
            { collectionSlug: { $in: aliasList } },
            { category: { $in: aliasList } },
            { categorySlug: { $in: aliasList } },
          ],
        });
      } else {
        andConditions.push({
          $or: [
            { collectionSlug: colLower },
            { categorySlug: colLower },
            { category: new RegExp(`^${targetCol}$`, 'i') },
          ],
        });
      }
    }

    if (gender && gender !== 'all') {
      andConditions.push({ gender: gender.toLowerCase() });
    }

    if (subcategory && subcategory !== 'all') {
      andConditions.push({ subcategory: new RegExp(`^${subcategory}$`, 'i') });
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
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const searchRegex = new RegExp(safeSearch, 'i');
      andConditions.push({
        $or: [
          { name: searchRegex },
          { description: searchRegex },
          { tags: searchRegex },
          { brand: searchRegex },
          { sku: searchRegex },
        ],
      });
    }

    const query = andConditions.length > 0 ? { $and: andConditions } : {};

    // Sorting
    let sortOptions = { createdAt: -1 }; // default newest
    if (sort === 'price-asc' || sort === 'price_asc' || sort === 'price-low-to-high') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-desc' || sort === 'price_desc' || sort === 'price-high-to-low') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating' || sort === 'rating-desc') {
      sortOptions = { rating: -1, numReviews: -1 };
    } else if (sort === 'bestseller' || sort === 'popular') {
      sortOptions = { bestseller: -1, rating: -1, numReviews: -1 };
    } else if (sort === 'name-asc') {
      sortOptions = { name: 1 };
    } else if (sort === 'name-desc') {
      sortOptions = { name: -1 };
    }

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

    // Clean up Supabase images associated with this product
    const allImages = [
      product.thumbnail,
      product.hoverImage,
      ...(product.images || []),
      ...(product.options || []).map((o) => o.image),
    ].filter(Boolean);

    for (const imgUrl of allImages) {
      await supabaseStorage.deleteFromSupabase(imgUrl).catch(() => {});
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

// @desc Upload product photo or video to Supabase Storage (products/{productId}/images/ or products/{productId}/videos/)
// @route POST /api/products/upload-image OR POST /api/products/upload-video OR POST /api/products/upload-media
const uploadProductMedia = async (req, res, next) => {
  try {
    const hasSingle = Boolean(req.file);
    const hasMultiple = Boolean(req.files && Array.isArray(req.files) && req.files.length > 0);

    if (!hasSingle && !hasMultiple) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image (JPEG, PNG, WEBP, GIF up to 15MB) or video (MP4, WEBM, MOV up to 60MB)',
      });
    }

    const productId = req.body.productId || req.params.id || (req.user ? req.user._id : 'general');
    const folder = req.body.folder === 'sellers' ? 'sellers' : 'products';

    if (hasMultiple) {
      const uploadPromises = req.files.map((file) =>
        supabaseStorage.uploadToSupabase({
          buffer: file.buffer,
          mimetype: file.mimetype,
          originalname: file.originalname,
          folder,
          entityId: productId,
          mediaType: 'auto',
        })
      );
      const results = await Promise.all(uploadPromises);

      // If existing productId provided and valid ObjectId, update product document
      if (productId && String(productId).match(/^[0-9a-fA-F]{24}$/)) {
        const mediaItems = results.map((r, idx) => ({
          type: r.mediaType === 'video' ? 'video' : 'image',
          url: r.url,
          storagePath: r.path,
          filename: r.filename,
          mimeType: r.mimeType,
          size: r.size,
          displayOrder: idx,
        }));

        const newImages = results.filter((r) => r.mediaType !== 'video').map((r) => r.url);
        const newVideos = results.filter((r) => r.mediaType === 'video').map((r) => r.url);

        await Product.findByIdAndUpdate(productId, {
          $push: {
            media: { $each: mediaItems },
            ...(newImages.length > 0 ? { images: { $each: newImages } } : {}),
            ...(newVideos.length > 0 ? { videos: { $each: newVideos } } : {}),
          },
        });
      }

      return res.json({
        success: true,
        urls: results.map((r) => r.url),
        media: results,
        images: results.filter((r) => r.mediaType !== 'video'),
        videos: results.filter((r) => r.mediaType === 'video'),
      });
    }

    const result = await supabaseStorage.uploadToSupabase({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
      folder,
      entityId: productId,
      mediaType: 'auto',
    });

    // If existing productId provided, update product
    if (productId && String(productId).match(/^[0-9a-fA-F]{24}$/)) {
      const mediaItem = {
        type: result.mediaType === 'video' ? 'video' : 'image',
        url: result.url,
        storagePath: result.path,
        filename: result.filename,
        mimeType: result.mimeType,
        size: result.size,
        displayOrder: 0,
      };

      const updateOp = {
        $push: {
          media: mediaItem,
          ...(result.mediaType === 'video' ? { videos: result.url } : { images: result.url }),
        },
      };

      await Product.findByIdAndUpdate(productId, updateOp);
    }

    res.json({
      success: true,
      url: result.url,
      path: result.path,
      filename: result.filename,
      bucket: result.bucket,
      mediaType: result.mediaType,
      mimeType: result.mimeType,
      size: result.size,
    });
  } catch (error) {
    console.error('[Product Media Upload Error]:', error.message);
    const isConfigError = error.message.includes('configured');
    res.status(isConfigError ? 503 : 400).json({
      success: false,
      message: error.message,
    });
  }
};

// @desc Delete an image or video from product & Supabase Storage
// @route DELETE /api/products/delete-image OR DELETE /api/products/delete-media
const deleteProductMedia = async (req, res, next) => {
  try {
    const { url, productId } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Media URL is required' });
    }

    await supabaseStorage.deleteFromSupabase(url);

    if (productId && String(productId).match(/^[0-9a-fA-F]{24}$/)) {
      await Product.findByIdAndUpdate(productId, {
        $pull: {
          images: url,
          videos: url,
          media: { url: url },
        },
      });
    }

    res.json({ success: true, message: 'Media deleted successfully from Supabase Storage' });
  } catch (error) {
    next(error);
  }
};

// Aliases for backward compatibility
const uploadProductImage = uploadProductMedia;
const deleteProductImage = deleteProductMedia;

module.exports = {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getMySellerProducts,
  uploadProductMedia,
  uploadProductImage,
  deleteProductMedia,
  deleteProductImage,
};
