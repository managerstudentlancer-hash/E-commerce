const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Offer = require('../models/Offer');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const Category = require('../models/Category');
const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const Notification = require('../models/Notification');
const SiteSettings = require('../models/SiteSettings');
const AISettings = require('../models/AISettings');
const AIKnowledge = require('../models/AIKnowledge');
const AIFAQ = require('../models/AIFAQ');
const AIConversation = require('../models/AIConversation');
const AIMessage = require('../models/AIMessage');
const AIUnansweredQuestion = require('../models/AIUnansweredQuestion');

const isDbConnected = () => Boolean(mongoose.connection && mongoose.connection.readyState === 1);

/**
 * Clean & format a product item for AI responses and frontend product cards
 */
const formatProduct = (p) => {
  if (!p) return null;
  const image =
    p.thumbnail ||
    (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '') ||
    '';

  // Extract available colors and sizes from variants / options
  const colors = new Set();
  const sizes = new Set();

  if (Array.isArray(p.variants)) {
    p.variants.forEach((v) => {
      if (v.name?.toLowerCase().includes('color') && Array.isArray(v.options)) {
        v.options.forEach((opt) => colors.add(opt));
      }
      if (v.name?.toLowerCase().includes('size') && Array.isArray(v.options)) {
        v.options.forEach((opt) => sizes.add(opt));
      }
    });
  }

  if (Array.isArray(p.options)) {
    p.options.forEach((opt) => {
      if (opt.color) colors.add(opt.color);
      if (opt.size) sizes.add(opt.size);
    });
  }

  return {
    _id: p._id?.toString(),
    id: p._id?.toString(),
    name: p.name,
    slug: p.slug,
    price: Number(p.price || 0),
    compareAtPrice: Number(p.compareAtPrice || 0),
    discount: Number(p.discount || 0),
    rating: Number(p.rating || 4.8),
    numReviews: Number(p.numReviews || 0),
    image: image,
    images: Array.isArray(p.images) && p.images.length > 0 ? p.images : [image],
    colors: Array.from(colors),
    sizes: Array.from(sizes),
    category: p.category || '',
    categorySlug: p.categorySlug || '',
    subcategory: p.subcategory || '',
    stock: Number(p.stock ?? 10),
    brand: p.brand || 'VEXIVO',
    featured: Boolean(p.featured),
    bestseller: Boolean(p.bestseller),
    description: p.shortDescription || p.description || '',
    tags: Array.isArray(p.tags) ? p.tags : [],
    variants: p.variants || [],
    options: p.options || [],
  };
};

/**
 * 1. searchProducts(filters)
 * Real database query across Product collection with intelligent price, category, tag, gender, color, size, and keyword matching.
 */
const searchProducts = async ({
  query = '',
  search = '',
  maxPrice,
  minPrice,
  category,
  categorySlug,
  subcategory,
  gender,
  color,
  size,
  brand,
  rating,
  discount,
  availability,
  occasion,
  tags,
  limit = 6,
  sort = '-rating',
} = {}) => {
  try {
    if (!isDbConnected()) return [];
    const filter = { status: { $ne: 'archived' } };

    // Availability
    if (availability === 'in_stock') {
      filter.stock = { $gt: 0 };
    }

    // Price filtering
    if (maxPrice !== undefined && maxPrice !== null && !isNaN(Number(maxPrice))) {
      filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    }
    if (minPrice !== undefined && minPrice !== null && !isNaN(Number(minPrice))) {
      filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    }

    // Discount filter
    if (discount !== undefined && discount !== null && !isNaN(Number(discount))) {
      filter.discount = { $gte: Number(discount) };
    }

    // Rating filter
    if (rating !== undefined && rating !== null && !isNaN(Number(rating))) {
      filter.rating = { $gte: Number(rating) };
    }

    // Gender filtering
    if (gender && ['women', 'men', 'unisex'].includes(gender.toLowerCase())) {
      filter.gender = { $in: [gender.toLowerCase(), 'unisex'] };
    }

    const andConditions = [];

    // Subcategory filtering
    if (subcategory) {
      filter.subcategory = new RegExp(subcategory.trim(), 'i');
    }

    // Category filtering
    if (categorySlug) {
      andConditions.push({
        $or: [
          { categorySlug: new RegExp(categorySlug, 'i') },
          { category: new RegExp(categorySlug, 'i') },
          { subcategory: new RegExp(categorySlug, 'i') },
        ],
      });
    } else if (category) {
      const catRegex = new RegExp(category.trim(), 'i');
      andConditions.push({
        $or: [
          { category: catRegex },
          { categorySlug: catRegex },
          { subcategory: catRegex },
          { collectionSlug: catRegex },
          { tags: catRegex },
        ],
      });
    }

    // Color filtering
    if (color) {
      const colorRegex = new RegExp(color.trim(), 'i');
      andConditions.push({
        $or: [
          { tags: colorRegex },
          { name: colorRegex },
          { description: colorRegex },
          { 'variants.options': colorRegex },
          { 'options.color': colorRegex },
        ],
      });
    }

    // Size filtering
    if (size) {
      const sizeRegex = new RegExp(`^${size.trim()}$`, 'i');
      andConditions.push({
        $or: [
          { 'variants.options': sizeRegex },
          { 'options.size': sizeRegex },
          { tags: sizeRegex },
        ],
      });
    }

    // Brand filtering
    if (brand) {
      filter.brand = new RegExp(brand.trim(), 'i');
    }

    // Occasion filtering
    if (occasion) {
      const occRegex = new RegExp(occasion.trim(), 'i');
      andConditions.push({
        $or: [{ tags: occRegex }, { description: occRegex }, { name: occRegex }],
      });
    }

    // Text / keyword matching with stop-word filtering
    const q = (query || search || '').trim();
    if (q) {
      const stopWords = new Set([
        'aisa', 'aise', 'aisi', 'product', 'products', 'dikhao', 'dikha', 'dikhayein', 'chahiye',
        'jo', 'vexivo', 'par', 'pe', 'hai', 'hain', 'hi', 'nahi', 'nahin', 'kuch', 'acha', 'acche',
        'best', 'show', 'me', 'find', 'looking', 'for', 'please', 'the', 'a', 'an', 'in',
        'at', 'to', 'of', 'and', 'or', 'is', 'are', 'with', 'ke', 'ki', 'ka', 'se', 'ko', 'k',
        'under', 'below', 'above', 'wala', 'wali', 'wale', 'mein', 'me', 'tak', 'budget',
        'mujhe', 'mera', 'meri', 'mere', 'apna', 'apni', 'apne', 'aap', 'tum', 'humein',
        'item', 'items', 'option', 'options', 'collection', 'collections', 'kripya'
      ]);

      const words = q.split(/\s+/).filter(Boolean);
      const meaningfulWords = words.filter((w) => !stopWords.has(w.toLowerCase()) && w.length > 1);

      if (meaningfulWords.length > 0) {
        const regexList = meaningfulWords.map(
          (w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i')
        );

        andConditions.push({
          $or: [
            { name: { $in: regexList } },
            { tags: { $in: regexList } },
            { description: { $in: regexList } },
            { subcategory: { $in: regexList } },
            { category: { $in: regexList } },
          ],
        });
      } else {
        // Only stop words were supplied without category/price constraints
        if (!category && !categorySlug && !subcategory && !gender && !maxPrice && !minPrice && !color && !size && !occasion) {
          return [];
        }
      }
    }

    if (andConditions.length > 0) {
      filter.$and = andConditions;
    }

    // Tags filter
    if (tags && Array.isArray(tags) && tags.length > 0) {
      filter.tags = { $in: tags.map((t) => new RegExp(t, 'i')) };
    }

    let sortObj = { rating: -1, bestseller: -1, _id: -1 };
    if (sort === 'price_asc' || sort === 'price-low-to-high') sortObj = { price: 1 };
    else if (sort === 'price_desc' || sort === 'price-high-to-low') sortObj = { price: -1 };
    else if (sort === 'newest') sortObj = { createdAt: -1 };
    else if (sort === 'discount') sortObj = { discount: -1 };

    const parsedLimit = Math.min(Math.max(Number(limit) || 6, 1), 20);

    let products = await Product.find(filter).sort(sortObj).limit(parsedLimit).lean();

    return (products || []).map(formatProduct);
  } catch (err) {
    console.warn('[AI Tools] searchProducts error:', err.message);
    return [];
  }
};

/**
 * 2. getProductDetails(productIdOrSlug)
 */
const getProductDetails = async (identifier) => {
  try {
    if (!isDbConnected() || !identifier) return null;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug: identifier }).lean();
    }
    return formatProduct(product);
  } catch (err) {
    console.warn('[AI Tools] getProductDetails error:', err.message);
    return null;
  }
};

/**
 * 3. checkProductStock(identifier, size, color)
 */
const checkProductStock = async (identifier, size = '', color = '') => {
  try {
    if (!isDbConnected()) return { found: false, message: 'Catalog is currently loading.' };
    const product = await getProductDetails(identifier);
    if (!product) return { found: false, message: 'Product not found in catalog.' };

    if (product.stock <= 0) {
      return {
        found: true,
        productName: product.name,
        inStock: false,
        stockCount: 0,
        message: `Currently out of stock.`,
      };
    }

    // Check specific variant if requested
    if (size || color) {
      const matchingOpt = (product.options || []).find(
        (opt) =>
          (!size || opt.size?.toLowerCase() === size.toLowerCase()) &&
          (!color || opt.color?.toLowerCase() === color.toLowerCase())
      );
      if (matchingOpt) {
        return {
          found: true,
          productName: product.name,
          variant: `${size ? `Size: ${size}` : ''} ${color ? `Color: ${color}` : ''}`.trim(),
          inStock: matchingOpt.stock > 0,
          stockCount: matchingOpt.stock,
          price: matchingOpt.price || product.price,
          message:
            matchingOpt.stock > 0
              ? `Yes, ${matchingOpt.stock} units are in stock ready to ship!`
              : `This specific variant is currently out of stock.`,
        };
      }
    }

    return {
      found: true,
      productName: product.name,
      inStock: product.stock > 0,
      stockCount: product.stock,
      price: product.price,
      sizes: product.sizes,
      colors: product.colors,
      message: `In stock (${product.stock} units available) at ₹${product.price.toLocaleString('en-IN')}.`,
    };
  } catch (err) {
    return { found: false, message: err.message };
  }
};

/**
 * 4. checkProductVariants(identifier)
 */
const checkProductVariants = async (identifier) => {
  try {
    if (!isDbConnected()) return null;
    const product = await getProductDetails(identifier);
    if (!product) return null;
    return {
      productName: product.name,
      price: product.price,
      colors: product.colors,
      sizes: product.sizes,
      variants: product.variants,
      options: product.options,
      totalStock: product.stock,
    };
  } catch (err) {
    return null;
  }
};

/**
 * 5. getCategories()
 */
const getCategories = async () => {
  try {
    if (!isDbConnected()) return [];
    const categories = await Category.find({ active: { $ne: false } })
      .sort({ displayOrder: 1, name: 1 })
      .lean();
    return (categories || []).map((c) => ({
      _id: c._id?.toString(),
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      image: c.image || '',
      itemCount: c.itemCount || 0,
      subcategories: c.subcategories || [],
    }));
  } catch (err) {
    return [];
  }
};

/**
 * 6. getOffers(section, category)
 */
const getOffers = async (section, category) => {
  try {
    if (!isDbConnected()) return [];
    const filter = { active: true };
    if (section && section !== 'all') filter.section = section;
    if (category) {
      filter.$or = [
        { category: new RegExp(category, 'i') },
        { tags: new RegExp(category, 'i') },
        { title: new RegExp(category, 'i') },
      ];
    }
    const offers = await Offer.find(filter).sort({ sortOrder: 1, createdAt: -1 }).limit(10).lean();
    return (offers || []).map((o) => ({
      _id: o._id?.toString(),
      title: o.title,
      subtitle: o.subtitle,
      section: o.section,
      discountText: o.discountText || (o.discountPercent ? `${o.discountPercent}% OFF` : ''),
      discountPercent: o.discountPercent,
      originalPrice: o.originalPrice,
      discountedPrice: o.discountedPrice,
      code: o.code || '',
      badge: o.badge || '',
      validity: o.validity || '',
      image: o.image || '',
      link: o.link || '/shop',
    }));
  } catch (err) {
    return [];
  }
};

/**
 * 7. getCoupons()
 */
const getCoupons = async () => {
  try {
    if (!isDbConnected()) return [];
    const coupons = await Coupon.find({ active: true }).sort({ value: -1 }).limit(10).lean();
    return (coupons || []).map((c) => ({
      code: c.code,
      type: c.type,
      value: c.value,
      minimumOrder: c.minimumOrder || 0,
      maximumDiscount: c.maximumDiscount || 0,
      discountDisplay: c.type === 'percentage' ? `${c.value}% OFF` : `₹${c.value} OFF`,
      description: `Save ${c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`} on orders above ₹${c.minimumOrder || 0}`,
      expiryDate: c.expiryDate,
    }));
  } catch (err) {
    return [];
  }
};

/**
 * 8. getWebsiteInfo(topicOrQuery)
 */
const getWebsiteInfo = async (topicOrQuery = '') => {
  try {
    if (!isDbConnected()) {
      return {
        knowledge: [],
        siteInfo: {
          siteName: 'VEXIVO',
          contactEmail: 'concierge@vexivo.com',
          contactPhone: '1800-456-7890',
          contactAddress: 'BKC, Mumbai, Maharashtra 400051',
          freeShippingThreshold: 999,
        },
      };
    }
    const filter = { status: 'active' };
    if (topicOrQuery) {
      const regex = new RegExp(topicOrQuery.trim(), 'i');
      filter.$or = [{ title: regex }, { category: regex }, { tags: regex }, { content: regex }];
    }
    const entries = await AIKnowledge.find(filter).sort({ priority: -1, createdAt: -1 }).limit(5).lean();
    const site = await SiteSettings.findOne().lean();

    return {
      knowledge: entries.map((k) => ({
        title: k.title,
        category: k.category,
        content: k.content,
      })),
      siteInfo: {
        siteName: site?.siteName || 'VEXIVO',
        contactEmail: site?.contactInfo?.email || 'concierge@vexivo.com',
        contactPhone: site?.contactInfo?.phone || '1800-456-7890',
        contactAddress: site?.contactInfo?.address || 'BKC, Mumbai, Maharashtra 400051',
        freeShippingThreshold: site?.freeShippingThreshold || 999,
      },
    };
  } catch (err) {
    return { knowledge: [], siteInfo: {} };
  }
};

/**
 * 9. getShippingPolicy()
 */
const getShippingPolicy = async () => {
  try {
    if (isDbConnected()) {
      const article = await AIKnowledge.findOne({
        category: 'Shipping',
        status: 'active',
      }).lean();
      if (article) return { title: article.title, content: article.content };
    }
  } catch {}
  return {
    title: 'Shipping Policy',
    content:
      'Free shipping on all orders above ₹999. Standard delivery takes 2-4 business days to metros and 3-6 days across India with live express tracking.',
  };
};

/**
 * 10. getReturnPolicy()
 */
const getReturnPolicy = async () => {
  try {
    if (isDbConnected()) {
      const article = await AIKnowledge.findOne({
        category: 'Returns',
        status: 'active',
      }).lean();
      if (article) return { title: article.title, content: article.content };
    }
  } catch {}
  return {
    title: 'Return Policy',
    content:
      'VEXIVO provides 30-day doorstep returns and 100% free size/color exchanges. Reverse courier pickup is scheduled automatically within 24-48 hours.',
  };
};

/**
 * 11. getRefundPolicy()
 */
const getRefundPolicy = async () => {
  try {
    if (isDbConnected()) {
      const article = await AIKnowledge.findOne({
        category: 'Refunds',
        status: 'active',
      }).lean();
      if (article) return { title: article.title, content: article.content };
    }
  } catch {}
  return {
    title: 'Refund Policy',
    content:
      'UPI payments are refunded within 24 hours. Credit/Debit card refunds process in 3-5 banking days. COD orders are refunded instantly to your bank account or UPI ID.',
  };
};

const getPaymentPolicy = async () => {
  try {
    if (isDbConnected()) {
      const article = await AIKnowledge.findOne({
        category: 'Payments',
        status: 'active',
      }).lean();
      if (article) return { title: article.title, content: article.content };
    }
  } catch {}
  return {
    title: 'Payment & Failed Transaction Support',
    content:
      'VEXIVO supports UPI (GPay, PhonePe, Paytm), Credit/Debit Cards, Net Banking, and Cash on Delivery (COD). For failed transactions where money is debited, banks automatically reverse funds within 24–48 hours.',
  };
};

/**
 * 12. getTrendingProducts({ category, categorySlug, limit })
 * Real database query across Product collection for bestseller, featured, and top-rated items.
 */
const getTrendingProducts = async ({ category, categorySlug, limit = 6 } = {}) => {
  try {
    if (!isDbConnected()) return [];
    const filter = { status: { $ne: 'archived' }, stock: { $gt: 0 } };

    if (categorySlug) {
      filter.$or = [
        { categorySlug: new RegExp(categorySlug, 'i') },
        { category: new RegExp(categorySlug, 'i') },
        { subcategory: new RegExp(categorySlug, 'i') },
      ];
    } else if (category) {
      const catRegex = new RegExp(category.trim(), 'i');
      filter.$or = [
        { category: catRegex },
        { categorySlug: catRegex },
        { subcategory: catRegex },
        { tags: catRegex },
      ];
    }

    let products = await Product.find({
      ...filter,
      $or: [{ bestseller: true }, { featured: true }, { rating: { $gte: 4.5 } }],
    })
      .sort({ rating: -1, numReviews: -1, bestseller: -1, _id: -1 })
      .limit(Number(limit) || 6)
      .lean();

    if (!products || products.length === 0) {
      products = await Product.find(filter)
        .sort({ rating: -1, numReviews: -1, _id: -1 })
        .limit(Number(limit) || 6)
        .lean();
    }

    return (products || []).map(formatProduct);
  } catch (err) {
    console.warn('[AI Tools] getTrendingProducts error:', err.message);
    return [];
  }
};

/**
 * 13. getFAQ(query)
 */
const getFAQ = async (query = '') => {
  try {
    if (!isDbConnected()) return [];
    const filter = { status: 'active' };
    if (query) {
      const q = query.trim();
      const regex = new RegExp(q, 'i');
      filter.$or = [{ question: regex }, { answer: regex }, { tags: regex }, { category: regex }];
    }
    const faqs = await AIFAQ.find(filter).sort({ displayOrder: 1, createdAt: -1 }).limit(6).lean();
    return (faqs || []).map((f) => ({
      question: f.question,
      answer: f.answer,
      category: f.category,
    }));
  } catch (err) {
    return [];
  }
};

/**
 * 14. getUserOrders(userId)
 */
const getUserOrders = async (userId) => {
  try {
    if (!isDbConnected() || !userId) return [];
    const orders = await Order.find({ user: userId })
      .populate('items.product')
      .sort({ createdAt: -1 })
      .limit(10)
      .lean();

    return (orders || []).map((o) => ({
      _id: o._id?.toString(),
      orderNumber: o.orderNumber,
      createdAt: o.createdAt,
      orderStatus: o.orderStatus,
      paymentStatus: o.paymentStatus,
      paymentMethod: o.paymentMethod,
      total: o.total,
      subtotal: o.subtotal,
      discount: o.discount,
      shipping: o.shipping,
      itemCount: o.items?.length || 0,
      items: (o.items || []).map((it) => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image || it.product?.thumbnail || (it.product?.images && it.product.images[0]) || '',
        variant: it.variant || '',
        slug: it.product?.slug || '',
      })),
      shippingAddress: o.shippingAddress,
      trackingNumber: o.trackingNumber,
      trackingHistory: o.trackingHistory || [],
    }));
  } catch (err) {
    return [];
  }
};

/**
 * 15. getOrder(orderIdOrNumber, userId)
 */
const getOrder = async (orderIdOrNumber, userId) => {
  try {
    if (!isDbConnected() || !orderIdOrNumber) return null;
    const filter = {};
    if (mongoose.Types.ObjectId.isValid(orderIdOrNumber)) {
      filter._id = orderIdOrNumber;
    } else {
      filter.orderNumber = orderIdOrNumber.trim();
    }
    if (userId) filter.user = userId;

    const order = await Order.findOne(filter).populate('items.product').lean();
    if (!order) return null;

    return {
      _id: order._id?.toString(),
      orderNumber: order.orderNumber,
      createdAt: order.createdAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      paymentMethod: order.paymentMethod,
      total: order.total,
      subtotal: order.subtotal,
      discount: order.discount,
      shipping: order.shipping,
      items: (order.items || []).map((it) => ({
        name: it.name,
        price: it.price,
        quantity: it.quantity,
        image: it.image || it.product?.thumbnail || (it.product?.images && it.product.images[0]) || '',
        variant: it.variant || '',
        slug: it.product?.slug || '',
      })),
      shippingAddress: order.shippingAddress,
      trackingNumber: order.trackingNumber,
      trackingHistory: order.trackingHistory || [],
    };
  } catch (err) {
    return null;
  }
};

/**
 * 16. getOrderStatus(orderIdOrNumber, userId)
 */
const getOrderStatus = async (orderIdOrNumber, userId) => {
  const order = await getOrder(orderIdOrNumber, userId);
  if (!order) return null;

  let estimatedDelivery = 'Within 2-3 business days via Express Courier';
  if (order.orderStatus === 'delivered') estimatedDelivery = 'Delivered successfully';
  else if (order.orderStatus === 'out_for_delivery') estimatedDelivery = 'Today by 8:00 PM';
  else if (order.orderStatus === 'shipped') estimatedDelivery = 'Tomorrow by 5:00 PM';

  return {
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    total: order.total,
    itemsCount: order.items?.length || 0,
    items: order.items,
    estimatedDelivery,
    trackingHistory: order.trackingHistory,
  };
};

/**
 * 17. addProductToCart(userId, productId, variant, quantity)
 */
const addProductToCart = async (userId, productId, variant = '', quantity = 1) => {
  if (!isDbConnected()) throw new Error('Database is currently reconnecting. Please try in a moment.');
  if (!userId || !productId) throw new Error('User and product required');
  const prod = await Product.findById(productId);
  if (!prod) throw new Error('Product not found in catalog');

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingIndex = cart.items.findIndex(
    (item) => item.product.toString() === productId.toString() && item.variant === variant
  );

  if (existingIndex > -1) {
    cart.items[existingIndex].quantity += Number(quantity);
  } else {
    cart.items.push({
      product: productId,
      quantity: Number(quantity),
      variant: variant || '',
    });
  }

  await cart.save();
  return { success: true, message: `Added ${prod.name} to cart`, product: formatProduct(prod) };
};

/**
 * 18. removeFromCart(userId, productId, variant)
 */
const removeFromCart = async (userId, productId, variant = '') => {
  if (!isDbConnected()) throw new Error('Database is currently reconnecting. Please try in a moment.');
  if (!userId || !productId) throw new Error('User and product required');
  const cart = await Cart.findOne({ user: userId });
  if (cart) {
    cart.items = cart.items.filter(
      (it) => !(it.product.toString() === productId.toString() && (!variant || it.variant === variant))
    );
    await cart.save();
  }
  return { success: true, message: 'Item removed from cart' };
};

/**
 * 19. getCart(userId)
 */
const getCart = async (userId) => {
  try {
    if (!isDbConnected() || !userId) return { items: [], total: 0, subtotal: 0 };
    const cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
    if (!cart) return { items: [], total: 0, subtotal: 0 };
    let subtotal = 0;
    const items = (cart.items || []).map((it) => {
      const price = it.product?.price || 0;
      subtotal += price * (it.quantity || 1);
      return {
        _id: it._id?.toString(),
        product: formatProduct(it.product),
        quantity: it.quantity,
        variant: it.variant,
      };
    });
    return { items, subtotal, total: subtotal };
  } catch (err) {
    return { items: [], total: 0, subtotal: 0 };
  }
};

/**
 * 20. addToWishlist(userId, productId)
 */
const addToWishlist = async (userId, productId) => {
  if (!isDbConnected()) throw new Error('Database is currently reconnecting. Please try in a moment.');
  if (!userId || !productId) throw new Error('User and product required');
  let wish = await Wishlist.findOne({ user: userId });
  if (!wish) {
    wish = new Wishlist({ user: userId, products: [productId] });
  } else {
    if (!wish.products.includes(productId)) {
      wish.products.push(productId);
    }
  }
  await wish.save();
  return { success: true, message: 'Added to wishlist' };
};

/**
 * 21. removeFromWishlist(userId, productId)
 */
const removeFromWishlist = async (userId, productId) => {
  if (!isDbConnected()) throw new Error('Database is currently reconnecting. Please try in a moment.');
  if (!userId || !productId) throw new Error('User and product required');
  let wish = await Wishlist.findOne({ user: userId });
  if (wish) {
    wish.products = wish.products.filter((p) => p.toString() !== productId.toString());
    await wish.save();
  }
  return { success: true, message: 'Removed from wishlist' };
};

/**
 * 22. cancelOrder(userId, orderIdOrNumber, reason)
 */
const cancelOrder = async (userId, orderIdOrNumber, reason = 'Cancelled via AI Assistant') => {
  if (!userId || !orderIdOrNumber) throw new Error('User ID and Order identifier required');
  const filter = { user: userId };
  if (mongoose.Types.ObjectId.isValid(orderIdOrNumber)) filter._id = orderIdOrNumber;
  else filter.orderNumber = orderIdOrNumber.trim();

  const order = await Order.findOne(filter);
  if (!order) throw new Error('Order not found or unauthorized');

  if (['shipped', 'out_for_delivery', 'delivered', 'cancelled', 'returned'].includes(order.orderStatus)) {
    throw new Error(
      `Order #${order.orderNumber} cannot be cancelled because its current status is '${order.orderStatus}'.`
    );
  }

  order.orderStatus = 'cancelled';
  order.cancellationReason = reason;
  order.cancelledAt = new Date();
  order.trackingHistory.push({
    status: 'Cancelled',
    message: `Order cancelled by customer: ${reason}`,
    timestamp: new Date(),
  });

  await order.save();

  // Restock inventory
  for (const item of order.items) {
    if (item.product) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: Number(item.quantity || 1) },
      }).catch(() => {});
    }
  }

  await Notification.create({
    user: userId,
    title: 'Order Cancelled',
    message: `Your order ${order.orderNumber} for ₹${order.total.toLocaleString('en-IN')} has been cancelled.`,
    type: 'order',
    link: '/account?tab=orders',
  }).catch(() => {});

  return {
    success: true,
    message: `Order #${order.orderNumber} cancelled successfully.`,
    orderNumber: order.orderNumber,
  };
};

/**
 * 23. returnOrder(userId, orderIdOrNumber, reason, requestType, exchangeNote)
 */
const returnOrder = async (
  userId,
  orderIdOrNumber,
  reason = 'Return requested',
  requestType = 'return',
  exchangeNote = ''
) => {
  if (!userId || !orderIdOrNumber) throw new Error('User ID and Order identifier required');
  const filter = { user: userId };
  if (mongoose.Types.ObjectId.isValid(orderIdOrNumber)) filter._id = orderIdOrNumber;
  else filter.orderNumber = orderIdOrNumber.trim();

  const order = await Order.findOne(filter);
  if (!order) throw new Error('Order not found or unauthorized');
  if (order.orderStatus !== 'delivered') {
    throw new Error('Only delivered orders are eligible for return/refund.');
  }

  const isExchange = requestType === 'exchange';
  order.orderStatus = isExchange ? 'exchange_requested' : 'returned';
  order.returnReason = exchangeNote ? `${reason} [Exchange Note: ${exchangeNote}]` : reason;
  order.returnedAt = new Date();
  order.trackingHistory.push({
    status: isExchange ? 'Exchange Initiated' : 'Return Initiated',
    message: `${isExchange ? 'Exchange' : 'Return'} request submitted: ${reason}`,
    timestamp: new Date(),
  });

  await order.save();

  await Notification.create({
    user: userId,
    title: isExchange ? 'Exchange Request Received' : 'Return Request Received',
    message: `Your request for order ${order.orderNumber} has been logged. Pickup will be coordinated soon.`,
    type: 'order',
    link: '/account?tab=orders',
  }).catch(() => {});

  return {
    success: true,
    message: isExchange
      ? `Exchange request for Order #${order.orderNumber} has been submitted.`
      : `Return request for Order #${order.orderNumber} has been initiated.`,
    orderNumber: order.orderNumber,
  };
};

/**
 * 24. recordUnansweredQuestion(question, category)
 */
const recordUnansweredQuestion = async (question, category = 'General') => {
  try {
    if (!isDbConnected() || !question || !question.trim()) return null;
    const normalized = question.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    if (!normalized || normalized.length < 3) return null;

    let existing = await AIUnansweredQuestion.findOne({ normalizedQuery: normalized });
    if (existing) {
      existing.frequency += 1;
      existing.lastAskedAt = new Date();
      if (category && category !== 'General') existing.category = category;
      await existing.save();
      return existing;
    }

    const created = await AIUnansweredQuestion.create({
      question: question.trim(),
      normalizedQuery: normalized,
      frequency: 1,
      category: category || 'General',
      status: 'pending',
    });
    return created;
  } catch (err) {
    console.warn('[AI Tools] recordUnansweredQuestion error:', err.message);
    return null;
  }
};

/**
 * 25. logConversationMessage(...)
 */
const logConversationMessage = async ({
  sessionId,
  user = null,
  role,
  content,
  intent = '',
  productsShown = [],
  actionType = '',
  actionData = null,
  isUnanswered = false,
}) => {
  try {
    if (!isDbConnected() || !sessionId || !content) return null;

    let conversation = await AIConversation.findOne({ sessionId });
    if (!conversation) {
      conversation = await AIConversation.create({
        sessionId,
        user: user?._id || null,
        userEmail: user?.email || '',
        userName: user?.name || '',
        channel: 'web_drawer',
        messagesCount: 1,
        lastMessage: content.slice(0, 150),
        startedAt: new Date(),
        lastMessageAt: new Date(),
      });
    } else {
      conversation.messagesCount += 1;
      conversation.lastMessage = content.slice(0, 150);
      conversation.lastMessageAt = new Date();
      if (user && !conversation.user) {
        conversation.user = user._id;
        conversation.userEmail = user.email || '';
        conversation.userName = user.name || '';
      }
      if (productsShown && productsShown.length > 0) {
        conversation.productsSearchedCount += productsShown.length;
      }
      if (actionType === 'CART_ADD' || actionType === 'CART_ACTION') {
        conversation.cartAdditionsCount += 1;
      }
      if (actionType === 'WISHLIST_ADD') {
        conversation.wishlistAdditionsCount += 1;
      }
      if (actionType === 'ORDER_STATUS' || actionType === 'ORDERS') {
        conversation.orderQueriesCount += 1;
      }
      await conversation.save();
    }

    const msg = await AIMessage.create({
      conversationId: conversation._id,
      sessionId,
      role,
      content,
      intent,
      productsShown: (productsShown || []).map((p) => (p._id || p.id || p)).filter((id) => mongoose.Types.ObjectId.isValid(id)),
      actionType,
      actionData,
      isUnanswered,
    });

    return { conversation, message: msg };
  } catch (err) {
    console.warn('[AI Tools] logConversationMessage error:', err.message);
    return null;
  }
};

/**
 * 26. getAISettings()
 */
const getAISettings = async () => {
  try {
    if (isDbConnected()) {
      let settings = await AISettings.findOne().lean();
      if (settings) return settings;
    }
    return {
      enabled: true,
      assistantName: 'VEXIVO AI Customer Care',
      welcomeMessage:
        "Hi Member! 👋 I’m your **VEXIVO AI Customer Care Assistant**.\n\nI’m available 24×7 to help with orders, returns, refunds, payments, delivery, products, offers and shopping.\n\nHow can I help you today?",
      fallbackMessage:
        "I couldn't find an exact match for that, but I'm here 24×7 to assist you with orders, returns, payments, or product recommendations!",
      suggestedQuestions: [
        '📦 Track My Order',
        '↩️ Return My Order',
        '💳 Payment Help',
        '🛍️ Find Products',
        '🎁 Offers & Coupons',
        '✨ Talk About Shopping',
      ],
      productResultLimit: 6,
      languagePreference: 'multi',
      temperature: 0.3,
    };
  } catch (err) {
    return {
      enabled: true,
      assistantName: 'VEXIVO AI Customer Care',
      welcomeMessage:
        "Hi Member! 👋 I’m your VEXIVO AI Customer Care Assistant. How can I help you today?",
      fallbackMessage: "I couldn't find an exact match. How can I assist you further?",
      suggestedQuestions: [
        '📦 Track My Order',
        '↩️ Return My Order',
        '💳 Payment Help',
        '🛍️ Find Products',
        '🎁 Offers & Coupons',
        '✨ Talk About Shopping',
      ],
      productResultLimit: 6,
    };
  }
};

module.exports = {
  formatProduct,
  searchProducts,
  getProductDetails,
  checkProductStock,
  checkProductVariants,
  getCategories,
  getOffers,
  getCoupons,
  getWebsiteInfo,
  getShippingPolicy,
  getReturnPolicy,
  getRefundPolicy,
  getPaymentPolicy,
  getTrendingProducts,
  getFAQ,
  getUserOrders,
  getOrder,
  getOrderStatus,
  addProductToCart,
  removeFromCart,
  getCart,
  addToWishlist,
  removeFromWishlist,
  cancelOrder,
  returnOrder,
  recordUnansweredQuestion,
  logConversationMessage,
  getAISettings,
};
