const mongoose = require('mongoose');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Coupon = require('../models/Coupon');
const Offer = require('../models/Offer');
const Wishlist = require('../models/Wishlist');
const Cart = require('../models/Cart');
const SupportTicket = require('../models/SupportTicket');
const User = require('../models/User');
const Notification = require('../models/Notification');

/**
 * Clean & format a product item for chat presentation
 */
const formatProduct = (p) => {
  if (!p) return null;
  const image =
    p.thumbnail ||
    (Array.isArray(p.images) && p.images.length > 0 ? p.images[0] : '') ||
    '';
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
    category: p.category || '',
    categorySlug: p.categorySlug || '',
    subcategory: p.subcategory || '',
    stock: Number(p.stock ?? 10),
    brand: p.brand || 'VEXIVO',
    featured: Boolean(p.featured),
    bestseller: Boolean(p.bestseller),
    tags: Array.isArray(p.tags) ? p.tags : [],
  };
};

/**
 * 1. searchProducts(query, filters)
 * Real database query across Product collection with intelligent price, category, tag, and keyword matching.
 */
const searchProducts = async ({
  query = '',
  maxPrice,
  minPrice,
  category,
  categorySlug,
  gender,
  tags,
  limit = 6,
  sort = '-rating',
} = {}) => {
  try {
    const filter = { status: { $ne: 'archived' } };

    // Price filtering
    if (maxPrice !== undefined && maxPrice !== null && !isNaN(Number(maxPrice))) {
      filter.price = { ...(filter.price || {}), $lte: Number(maxPrice) };
    }
    if (minPrice !== undefined && minPrice !== null && !isNaN(Number(minPrice))) {
      filter.price = { ...(filter.price || {}), $gte: Number(minPrice) };
    }

    // Gender filtering
    if (gender && ['women', 'men', 'unisex'].includes(gender.toLowerCase())) {
      filter.gender = { $in: [gender.toLowerCase(), 'unisex'] };
    }

    // Category filtering
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
        { collectionSlug: catRegex },
        { tags: catRegex },
      ];
    }

    // Text / keyword matching
    if (query && query.trim()) {
      const q = query.trim();
      const words = q.split(/\s+/).filter(Boolean);
      const regexList = words.map((w) => new RegExp(w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));

      const searchConditions = [
        { name: { $in: regexList } },
        { tags: { $in: regexList } },
        { description: { $in: regexList } },
        { subcategory: { $in: regexList } },
        { category: { $in: regexList } },
        { brand: { $in: regexList } },
      ];

      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchConditions }];
        delete filter.$or;
      } else {
        filter.$or = searchConditions;
      }
    }

    // Tags filter
    if (tags && Array.isArray(tags) && tags.length > 0) {
      filter.tags = { $in: tags.map((t) => new RegExp(t, 'i')) };
    }

    let products = await Product.find(filter)
      .sort(
        sort === 'price_asc'
          ? { price: 1 }
          : sort === 'price_desc'
          ? { price: -1 }
          : { rating: -1, bestseller: -1, _id: -1 }
      )
      .limit(limit)
      .lean();

    // If no products found via strict search, try relaxed fallback
    if ((!products || products.length === 0) && query) {
      const firstWord = query.trim().split(/\s+/)[0];
      if (firstWord && firstWord.length > 2) {
        const relaxedFilter = {
          status: { $ne: 'archived' },
          $or: [
            { name: new RegExp(firstWord, 'i') },
            { tags: new RegExp(firstWord, 'i') },
            { category: new RegExp(firstWord, 'i') },
          ],
        };
        if (maxPrice) relaxedFilter.price = { $lte: Number(maxPrice) };
        products = await Product.find(relaxedFilter).limit(limit).lean();
      }
    }

    return (products || []).map(formatProduct);
  } catch (err) {
    console.warn('[AI Tools] searchProducts error notice:', err.message);
    return [];
  }
};

/**
 * 2. getProduct(productIdOrSlug)
 */
const getProduct = async (identifier) => {
  try {
    if (!identifier) return null;
    let product = null;
    if (mongoose.Types.ObjectId.isValid(identifier)) {
      product = await Product.findById(identifier).lean();
    }
    if (!product) {
      product = await Product.findOne({ slug: identifier }).lean();
    }
    return formatProduct(product);
  } catch (err) {
    console.warn('[AI Tools] getProduct error notice:', err.message);
    return null;
  }
};

/**
 * 3. getProductsByCategory(category, limit)
 */
const getProductsByCategory = async (category, limit = 6) => {
  return searchProducts({ category, limit });
};

/**
 * 4. getActiveOffers(section, category)
 */
const getActiveOffers = async (section, category) => {
  try {
    const filter = { active: true };
    if (section && section !== 'all') {
      filter.section = section;
    }
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
      fabric: o.fabric || '',
      tags: o.tags || [],
    }));
  } catch (err) {
    console.warn('[AI Tools] getActiveOffers error notice:', err.message);
    return [];
  }
};

/**
 * 5. getCoupons()
 */
const getCoupons = async () => {
  try {
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
    console.warn('[AI Tools] getCoupons error notice:', err.message);
    return [];
  }
};

/**
 * 6. getUserOrders(userId)
 */
const getUserOrders = async (userId) => {
  try {
    if (!userId) return [];
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
      cancellationReason: o.cancellationReason,
      returnReason: o.returnReason,
    }));
  } catch (err) {
    console.warn('[AI Tools] getUserOrders error notice:', err.message);
    return [];
  }
};

/**
 * 7. getOrder(orderIdOrNumber, userId)
 */
const getOrder = async (orderIdOrNumber, userId) => {
  try {
    if (!orderIdOrNumber) return null;
    const filter = {};
    if (mongoose.Types.ObjectId.isValid(orderIdOrNumber)) {
      filter._id = orderIdOrNumber;
    } else {
      filter.orderNumber = orderIdOrNumber.trim();
    }
    if (userId) {
      filter.user = userId;
    }
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
    console.warn('[AI Tools] getOrder error notice:', err.message);
    return null;
  }
};

/**
 * 8. getOrderStatus(orderIdOrNumber, userId)
 */
const getOrderStatus = async (orderIdOrNumber, userId) => {
  const order = await getOrder(orderIdOrNumber, userId);
  if (!order) return null;

  let estimatedDelivery = 'Within 2-3 business days via Express Courier';
  if (order.orderStatus === 'delivered') {
    estimatedDelivery = 'Delivered successfully';
  } else if (order.orderStatus === 'out_for_delivery') {
    estimatedDelivery = 'Today by 8:00 PM';
  } else if (order.orderStatus === 'shipped') {
    estimatedDelivery = 'Tomorrow by 5:00 PM';
  }

  return {
    orderNumber: order.orderNumber,
    orderStatus: order.orderStatus,
    paymentStatus: order.paymentStatus,
    total: order.total,
    itemsCount: order.items?.length || 0,
    firstItemName: order.items?.[0]?.name || 'Item',
    estimatedDelivery,
    trackingHistory: order.trackingHistory,
  };
};

/**
 * 9. getReturnPolicy()
 */
const getReturnPolicy = () => {
  return {
    summary:
      'VEXIVO offers an effortless 30-Day Hassle-Free Doorstep Return & Exchange Policy on all eligible items.',
    rules: [
      'Returns accepted within 30 days of confirmed delivery.',
      'Items must be unworn, unwashed with original tags and packaging intact.',
      'Doorstep pickup is arranged within 24-48 business hours.',
      'Refunds are credited to the original payment method (or UPI/Bank) within 48 hours of quality inspection.',
      'Exchanges for different sizes or colors are completely free with zero additional shipping fee.',
    ],
    supportPhone: '+91 (800) 456-7890',
    supportEmail: 'care@vexivo.com',
  };
};

/**
 * 10. getWishlist(userId)
 */
const getWishlist = async (userId) => {
  try {
    if (!userId) return [];
    const wish = await Wishlist.findOne({ user: userId }).populate('products').lean();
    if (!wish || !wish.products) return [];
    return wish.products.map(formatProduct);
  } catch (err) {
    return [];
  }
};

/**
 * 11. addToWishlist(userId, productId)
 */
const addToWishlist = async (userId, productId) => {
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
 * 12. removeFromWishlist(userId, productId)
 */
const removeFromWishlist = async (userId, productId) => {
  if (!userId || !productId) throw new Error('User and product required');
  let wish = await Wishlist.findOne({ user: userId });
  if (wish) {
    wish.products = wish.products.filter((p) => p.toString() !== productId.toString());
    await wish.save();
  }
  return { success: true, message: 'Removed from wishlist' };
};

/**
 * 13. getCart(userId)
 */
const getCart = async (userId) => {
  try {
    if (!userId) return { items: [], total: 0 };
    const cart = await Cart.findOne({ user: userId }).populate('items.product').lean();
    if (!cart) return { items: [], total: 0 };
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
    return { items: [], total: 0 };
  }
};

/**
 * 14. addToCart(userId, productId, variant, quantity)
 */
const addToCart = async (userId, productId, variant = '', quantity = 1) => {
  if (!userId || !productId) throw new Error('User and product required');
  const prod = await Product.findById(productId);
  if (!prod) throw new Error('Product not found in database');

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
  return { success: true, message: `Added ${prod.name} to cart` };
};

/**
 * 15. cancelOrder(userId, orderIdOrNumber, reason)
 * Validates cancellation rules and performs cancellation with inventory restocking.
 */
const cancelOrder = async (userId, orderIdOrNumber, reason = 'Cancelled via AI Assistant') => {
  if (!userId || !orderIdOrNumber) {
    throw new Error('User ID and Order identifier required');
  }

  const filter = { user: userId };
  if (mongoose.Types.ObjectId.isValid(orderIdOrNumber)) {
    filter._id = orderIdOrNumber;
  } else {
    filter.orderNumber = orderIdOrNumber.trim();
  }

  const order = await Order.findOne(filter);
  if (!order) {
    throw new Error('Order not found or unauthorized');
  }

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

  // Notification
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
 * 16. returnOrder(userId, orderIdOrNumber, reason, requestType)
 */
const returnOrder = async (
  userId,
  orderIdOrNumber,
  reason = 'Return requested',
  requestType = 'return',
  exchangeNote = ''
) => {
  if (!userId || !orderIdOrNumber) {
    throw new Error('User ID and Order identifier required');
  }

  const filter = { user: userId };
  if (mongoose.Types.ObjectId.isValid(orderIdOrNumber)) {
    filter._id = orderIdOrNumber;
  } else {
    filter.orderNumber = orderIdOrNumber.trim();
  }

  const order = await Order.findOne(filter);
  if (!order) {
    throw new Error('Order not found or unauthorized');
  }

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
 * 17. createSupportTicket(userId, userDetails, ticketData)
 */
const createSupportTicket = async (
  userId,
  userDetails,
  { category = 'Order Issue', subject, message, orderNumber = '' }
) => {
  if (!category || !subject || !message) {
    throw new Error('Category, subject, and message are required');
  }

  const user = userId ? await User.findById(userId) : null;
  const userName = user?.name || userDetails?.name || 'Customer';
  const userEmail = user?.email || userDetails?.email || 'guest@vexivo.com';

  const ticketNumber = `TIC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

  const ticket = await SupportTicket.create({
    ticketNumber,
    user: userId || new mongoose.Types.ObjectId(),
    userName,
    userEmail,
    role: user?.isSeller ? 'seller' : 'customer',
    category,
    subject,
    message,
    orderNumber: orderNumber || '',
    priority: 'medium',
    status: 'OPEN',
    replies: [
      {
        sender: userId || new mongoose.Types.ObjectId(),
        senderName: userName,
        senderRole: 'customer',
        message,
        createdAt: new Date(),
      },
    ],
  });

  return {
    success: true,
    ticketNumber: ticket.ticketNumber,
    ticketId: ticket._id?.toString(),
    subject: ticket.subject,
    status: ticket.status,
  };
};

module.exports = {
  searchProducts,
  getProduct,
  getProductsByCategory,
  getActiveOffers,
  getCoupons,
  getUserOrders,
  getOrder,
  getOrderStatus,
  getReturnPolicy,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  addToCart,
  cancelOrder,
  returnOrder,
  createSupportTicket,
};
