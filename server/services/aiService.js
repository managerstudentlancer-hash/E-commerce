const tools = require('./aiTools');

/**
 * Enhanced price extraction helper
 */
const extractPriceFilter = (text) => {
  const underMatch = text.match(/(?:under|below|less than|within|max|budget of)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (underMatch) {
    return { maxPrice: parseInt(underMatch[1], 10) };
  }
  const aboveMatch = text.match(/(?:above|over|more than|min)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (aboveMatch) {
    return { minPrice: parseInt(aboveMatch[1], 10) };
  }
  const betweenMatch = text.match(/(?:between|from)\s*(?:₹|rs\.?|inr)?\s*(\d+)\s*(?:and|to|-)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i);
  if (betweenMatch) {
    return { minPrice: parseInt(betweenMatch[1], 10), maxPrice: parseInt(betweenMatch[2], 10) };
  }
  return {};
};

/**
 * Core AI Reasoning & Semantic Intent Execution Engine
 */
const processUserMessage = async ({ message, history = [], user = null }) => {
  const msg = (message || '').trim();
  const lower = msg.toLowerCase();

  // Price extractor
  const priceFilter = extractPriceFilter(lower);

  // 1. GREETINGS & INTRODUCTIONS ("Hi", "Hello", "Hey", "Help", "Namaste")
  const isGreeting =
    /^(hi|hello|hey|heya|hola|namaste|good\s*(morning|afternoon|evening)|help|start|who\s*are\s*you|what\s*can\s*you\s*do)[!?,.]*$/i.test(
      lower
    ) ||
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower === 'help';

  if (isGreeting) {
    let greetingReply = `Hi there! 👋 I’m your **VEXIVO AI Assistant**.

I can automatically help you with:
• 🛍️ **Finding & Recommending Products** (e.g. *"Show sarees under ₹1500"* or *"Jewellery for wedding"*)
• 📦 **Real-Time Order Tracking** (live delivery progress & carrier updates)
• ↩️ **1-Click Returns & Free Size/Color Exchanges**
• ❌ **Instant Order Cancellations**
• 🎁 **Active Discount Coupons & Festive Deals**
• 🛒 **Direct Add to Bag**

Everything is handled automatically right here in the chat without needing to create a ticket! How can I assist you today?`;

    // If user is logged in, check if they have active orders or deals to show immediately
    let recentOrders = [];
    if (user) {
      recentOrders = await tools.getUserOrders(user._id);
    }

    if (recentOrders.length > 0) {
      const latest = recentOrders[0];
      return {
        reply: `Hi ${user?.name ? user.name.split(' ')[0] : 'there'}! 👋 Welcome back to VEXIVO.

I'm ready to help you automatically. Here is your most recent order **#${latest.orderNumber}** (${latest.orderStatus.toUpperCase()}):`,
        data: {
          actionType: 'ORDERS',
          orders: [latest],
        },
        suggestedActions: [
          '📦 Track Live Status',
          'Show sarees under ₹1500',
          '🎁 Best Offers & Coupons',
          '↩️ Return / Refund Help',
        ],
      };
    }

    // If no recent orders, fetch top deals
    const offers = await tools.getActiveOffers('saree-deals');
    const coupons = await tools.getCoupons();

    return {
      reply: greetingReply,
      data: {
        actionType: 'OFFERS_AND_COUPONS',
        offers: offers.slice(0, 2),
        coupons: coupons.slice(0, 2),
      },
      suggestedActions: [
        'Show sarees under ₹1500',
        "Show women's jewellery",
        '📦 Track my order',
        '🎁 View Today Deals',
      ],
    };
  }

  // 2. SPECIFIC ORDER NUMBER MENTIONED (e.g. "VEX-1024", "order #1024")
  const orderNumberMatch = msg.match(/VEX-[A-Z0-9-]+/i);
  if (orderNumberMatch) {
    const matchedNumber = orderNumberMatch[0].toUpperCase();
    const orderDetails = await tools.getOrder(matchedNumber, user?._id);

    if (orderDetails) {
      return {
        reply: `Here are the live automated details for Order **#${orderDetails.orderNumber}**:

• **Current Status**: **${orderDetails.orderStatus.toUpperCase()}**
• **Items (${orderDetails.items.length})**: ${orderDetails.items.map((i) => i.name).join(', ')}
• **Total Amount**: ₹${orderDetails.total.toLocaleString('en-IN')} (${orderDetails.paymentStatus.toUpperCase()})
• **Delivery Destination**: ${orderDetails.shippingAddress?.city || 'India'}, ${orderDetails.shippingAddress?.postalCode || ''}`,
        data: {
          actionType: 'ORDER_STATUS',
          orders: [orderDetails],
        },
        suggestedActions: [
          '📦 Track Live Shipment',
          '↩️ Return / Exchange',
          'Cancel This Order',
          '🛍️ Continue Shopping',
        ],
      };
    }
  }

  // 3. ORDER TRACKING & STATUS
  if (
    lower.includes('where is my order') ||
    lower.includes('track my order') ||
    lower.includes('track order') ||
    lower.includes('when will my order arrive') ||
    lower.includes('order status') ||
    lower.includes('previous orders') ||
    lower.includes('my orders') ||
    lower.includes('show my orders') ||
    lower.includes('order arrive') ||
    lower.includes('delivery status') ||
    lower.includes('tracking')
  ) {
    if (!user) {
      return {
        reply: `To track your order automatically, please **sign in to your VEXIVO account** or provide your Order ID (e.g. \`VEX-1024\`).`,
        data: { actionType: 'AUTH_REQUIRED' },
        suggestedActions: ['Login to Account', '🛍️ Browse Products', '🎁 View Offers'],
      };
    }

    const orders = await tools.getUserOrders(user._id);
    if (orders.length === 0) {
      return {
        reply: `You don't have any placed orders in your account right now. You can discover our trending collections below:`,
        data: { actionType: 'INFO' },
        suggestedActions: ['Show sarees under ₹1500', '👗 Women Dresses', '🎁 View Offers'],
      };
    }

    const latestOrder = orders[0];
    const statusText =
      latestOrder.orderStatus === 'out_for_delivery'
        ? '🚚 Out for Delivery — Arriving today!'
        : latestOrder.orderStatus === 'shipped'
        ? '📦 In Transit with Express Courier'
        : latestOrder.orderStatus === 'delivered'
        ? '✅ Delivered Successfully'
        : latestOrder.orderStatus === 'cancelled'
        ? '❌ Cancelled'
        : '⏳ Processing & Quality Inspection';

    return {
      reply: `Here is your live tracking update for Order **#${latestOrder.orderNumber}**:

• **Live Status**: ${statusText}
• **Order Total**: ₹${latestOrder.total.toLocaleString('en-IN')} (${latestOrder.paymentStatus.toUpperCase()})
• **Items**: ${latestOrder.items.map((it) => it.name).join(', ')}
• **Address**: ${latestOrder.shippingAddress?.address || ''}, ${latestOrder.shippingAddress?.city || 'India'}`,
      data: {
        actionType: 'ORDER_STATUS',
        orders: orders.slice(0, 3),
      },
      suggestedActions: [
        '📦 Track Live Shipment',
        '↩️ Return / Refund',
        'Cancel Order',
        '🛍️ Shop More',
      ],
    };
  }

  // 4. ORDER CANCELLATION (1-Click Automated In-Chat)
  if (
    lower.includes('cancel my order') ||
    lower.includes('cancel order') ||
    lower.includes('cancellation') ||
    lower.includes('how to cancel')
  ) {
    if (!user) {
      return {
        reply: `To cancel an order automatically, please **sign in to your VEXIVO account** so I can securely retrieve your active orders.`,
        data: { actionType: 'AUTH_REQUIRED' },
        suggestedActions: ['Login to Account', '🛍️ Browse Products', '↩️ Return Policy'],
      };
    }

    const orders = await tools.getUserOrders(user._id);
    const cancellableOrders = orders.filter((o) =>
      ['pending', 'confirmed', 'processing'].includes(o.orderStatus)
    );

    if (cancellableOrders.length === 0) {
      if (orders.length === 0) {
        return {
          reply: `You don't have any active orders right now.`,
          data: { actionType: 'INFO' },
          suggestedActions: ['🛍️ Start Shopping', '🎁 View Offers'],
        };
      } else {
        const recent = orders[0];
        return {
          reply: `Your recent order **#${recent.orderNumber}** is already marked as **${recent.orderStatus.toUpperCase()}**.

Orders that are shipped or delivered cannot be cancelled, but you can initiate an **Instant Return / Refund** once delivered!`,
          data: { actionType: 'ORDERS', orders: [recent] },
          suggestedActions: ['↩️ Start Return / Exchange', '📦 Track Order', '🛍️ Browse Products'],
        };
      }
    }

    const orderToCancel = cancellableOrders[0];
    return {
      reply: `I found active Order **#${orderToCancel.orderNumber}** totaling **₹${orderToCancel.total.toLocaleString('en-IN')}**.

Would you like me to cancel this order automatically and process an instant refund? Please confirm below:`,
      data: {
        actionType: 'CANCEL_CONFIRM',
        cancelOrder: orderToCancel,
        orders: [orderToCancel],
      },
      suggestedActions: [
        `Confirm Cancel #${orderToCancel.orderNumber}`,
        'Keep My Order',
        '📦 Track Order',
      ],
    };
  }

  // 5. RETURN & REFUND INTENT (1-Click Automated In-Chat)
  if (
    lower.includes('return') ||
    lower.includes('refund') ||
    lower.includes('exchange') ||
    lower.includes('damaged') ||
    lower.includes('wrong product') ||
    lower.includes("hasn't arrived") ||
    lower.includes('not arrived') ||
    lower.includes('replace')
  ) {
    const policy = tools.getReturnPolicy();

    if (user) {
      const orders = await tools.getUserOrders(user._id);
      const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered');

      if (deliveredOrders.length > 0) {
        const order = deliveredOrders[0];
        return {
          reply: `**VEXIVO 30-Day Hassle-Free Returns & Free Exchanges**

I found your delivered order **#${order.orderNumber}** (${order.items.map((i) => i.name).join(', ')}). 

You can initiate a return for a **100% refund** or a **free size/color exchange** with one tap below. Doorstep courier pickup will be scheduled automatically!`,
          data: {
            actionType: 'RETURN_FLOW',
            returnOrder: order,
            orders: [order],
            policy,
          },
          suggestedActions: [
            `Return Order #${order.orderNumber}`,
            `Exchange Order #${order.orderNumber}`,
            '📦 View All Orders',
            '🎁 View Today Deals',
          ],
        };
      }
    }

    return {
      reply: `**VEXIVO 30-Day Hassle-Free Return & Refund Policy**

${policy.rules.map((r) => `• ${r}`).join('\n')}

• **Damaged or Incorrect Item?** We arrange an immediate free doorstep pickup and full refund/replacement.`,
      data: { actionType: 'RETURN_POLICY', policy },
      suggestedActions: [
        '📦 Track My Order',
        '🎁 View Today Deals',
        '🛍️ Browse Catalog',
      ],
    };
  }

  // 6. PAYMENT ISSUES & AUTO-HELP
  if (
    lower.includes('payment failed') ||
    lower.includes('payment issue') ||
    lower.includes('money deducted') ||
    lower.includes('card declined') ||
    lower.includes('upi failed') ||
    lower.includes('payment pending')
  ) {
    return {
      reply: `I understand payment issues can be frustrating! Here is how our automated payment system works:

• **Money Deducted?**: If an amount was debited for a failed order, bank reconciliation automatically refunds the full amount back to your source account / UPI within **24–48 hours**.
• **Pending Orders**: If your checkout was interrupted, check your banking app to approve pending UPI mandates.
• **Instant Retry**: You can safely place a new order using UPI, Credit/Debit Card, Netbanking, or Cash on Delivery.`,
      data: {
        actionType: 'PAYMENT_INFO',
      },
      suggestedActions: [
        '📦 Check Order Status',
        '🎁 View Active Coupons',
        '🛍️ Back to Shop',
      ],
    };
  }

  // 7. OFFERS & COUPONS INTENT
  if (
    lower.includes('offer') ||
    lower.includes('deal') ||
    lower.includes('coupon') ||
    lower.includes('discount') ||
    lower.includes('promo') ||
    lower.includes('sale')
  ) {
    const isSareeSpecific = lower.includes('saree') || lower.includes('ethnic');
    const offers = await tools.getActiveOffers(
      isSareeSpecific ? 'saree-deals' : 'all',
      isSareeSpecific ? 'saree' : undefined
    );
    const coupons = await tools.getCoupons();

    let replyText = `Here are our **exclusive active offers & discount coupons** available today:`;
    if (isSareeSpecific) {
      replyText = `🔥 **Special Saree Deals & Festive Offers**: Save up to **40% OFF** on handcrafted Banarasi, Kanjivaram, and designer sarees.`;
    }

    return {
      reply: replyText,
      data: {
        actionType: 'OFFERS_AND_COUPONS',
        offers: offers.slice(0, 4),
        coupons: coupons.slice(0, 3),
      },
      suggestedActions: [
        'Show sarees under ₹1500',
        '👗 Browse Dresses',
        '💎 View Jewellery',
        '🛍️ Today Flash Deals',
      ],
    };
  }

  // 8. CART ACTIONS ("Add this saree to cart", "Add to cart")
  if (lower.includes('add to cart') || lower.includes('add this')) {
    let products = [];
    if (lower.includes('saree')) {
      products = await tools.searchProducts({ query: 'saree', limit: 1 });
    } else {
      products = await tools.searchProducts({ query: msg.replace(/add to cart|add this/gi, '').trim(), limit: 1 });
    }

    if (products.length > 0) {
      const prod = products[0];
      return {
        reply: `I found **${prod.name}** (₹${prod.price.toLocaleString('en-IN')}). You can add it directly to your shopping bag with one tap below:`,
        data: {
          actionType: 'CART_PROMPT',
          products: [prod],
        },
        suggestedActions: [
          `Add ${prod.name.slice(0, 20)} to Cart`,
          'View Product Details',
          '🎁 View Coupons',
        ],
      };
    }
  }

  // 9. HUMAN SUPPORT ESCALATION (Optional Last Resort)
  if (
    lower.includes('talk to support') ||
    lower.includes('customer support') ||
    lower.includes('human agent') ||
    lower.includes('contact support') ||
    lower.includes('create ticket') ||
    lower.includes('complaint')
  ) {
    const orders = user ? await tools.getUserOrders(user._id) : [];
    const latestOrder = orders.length > 0 ? orders[0] : null;

    return {
      reply: `I’m always here to help you automatically! If you prefer to reach our dedicated specialist support desk, you can open an official support ticket below:`,
      data: {
        actionType: 'TICKET_ESCALATE',
        ticketPrefill: {
          category: lower.includes('payment')
            ? 'Payment Issue'
            : lower.includes('return') || lower.includes('refund')
            ? 'Return/Refund'
            : lower.includes('order') || lower.includes('delivery')
            ? 'Order Issue'
            : 'Other',
          subject: msg.length > 60 ? `${msg.slice(0, 57)}...` : msg,
          message: `Customer Inquiry: "${msg}"`,
          orderNumber: latestOrder?.orderNumber || '',
        },
      },
      suggestedActions: [
        'Create Support Ticket',
        '📦 Check My Orders',
        '💳 Payment Help',
        '↩️ Return Policy',
      ],
    };
  }

  // 10. PRODUCT SEARCH & RECOMMENDATIONS (Dynamic, Catalog-Backed)
  let searchQuery = '';
  let categoryFilter = undefined;
  let categorySlug = undefined;
  let genderFilter = undefined;
  let responsePrefix = '';

  // Sarees & Ethnic Wear
  if (lower.includes('saree') || lower.includes('sari') || lower.includes('banarasi') || lower.includes('kanjivaram') || lower.includes('chanderi')) {
    searchQuery = 'saree';
    categorySlug = 'women-wear';
    genderFilter = 'women';
    if (lower.includes('red')) searchQuery = 'red saree';
    if (lower.includes('wedding') || lower.includes('bridal')) searchQuery = 'wedding saree';
    if (lower.includes('banarasi')) searchQuery = 'banarasi';
    if (lower.includes('cotton')) searchQuery = 'cotton saree';
    if (lower.includes('georgette')) searchQuery = 'georgette';

    responsePrefix = priceFilter.maxPrice
      ? `Sure! Here are our top-rated handcrafted sarees under ₹${priceFilter.maxPrice.toLocaleString('en-IN')}:`
      : lower.includes('wedding')
      ? `Sure! Here are some magnificent wedding and bridal sarees from our curated heritage collection:`
      : `Here are the authentic sarees available in our collection:`;
  }
  // Jewellery paired with saree or standalone
  else if (lower.includes('jewellery') || lower.includes('jewelry') || lower.includes('necklace') || lower.includes('earring') || lower.includes('choker') || lower.includes('jhumka')) {
    categorySlug = 'jewellery';
    searchQuery = 'jewellery';
    if (lower.includes('saree') || lower.includes('wedding') || lower.includes('match') || lower.includes('goes with')) {
      searchQuery = 'temple kundan choker jhumka';
      responsePrefix = `For pairing with a saree or wedding attire, traditional Kundan choker sets and temple gold-dipped jhumkas complement the rich drape beautifully:`;
    } else {
      responsePrefix = `Here are our finest handcrafted jewellery pieces:`;
    }
  }
  // Women's Dresses & Western Wear
  else if (lower.includes('dress') || lower.includes('gown') || lower.includes('frock') || lower.includes('skirt') || lower.includes('tops')) {
    categorySlug = 'womens-dresses';
    genderFilter = 'women';
    searchQuery = 'dress';
    responsePrefix = priceFilter.maxPrice
      ? `Here are stunning dresses curated within your budget of ₹${priceFilter.maxPrice.toLocaleString('en-IN')}:`
      : `Explore our trending luxury dresses and evening wear:`;
  }
  // Women's Shoes & Heels
  else if (lower.includes('shoe') || lower.includes('heel') || lower.includes('sandals') || lower.includes('footwear')) {
    if (lower.includes('women') || lower.includes('dress') || lower.includes('heels')) {
      categorySlug = 'womens-shoes';
      genderFilter = 'women';
      searchQuery = 'shoes';
      responsePrefix = lower.includes('match')
        ? `To complement your dress, elegant ankle-strap stiletto heels and classic pumps are ideal choices:`
        : `Here are our premium women's shoes and heels:`;
    } else if (lower.includes('men')) {
      categorySlug = 'mens-shoes';
      genderFilter = 'men';
      searchQuery = 'shoes';
      responsePrefix = `Here are our artisan-crafted men's shoes and leather loafers:`;
    } else {
      categorySlug = 'shoes';
      searchQuery = 'shoes';
      responsePrefix = `Here are footwear options from our curated collection:`;
    }
  }
  // Men's Shirts & Wear
  else if (lower.includes('shirt') || lower.includes('t-shirt') || lower.includes('men wear') || lower.includes('mens shirt') || lower.includes("men's")) {
    categorySlug = 'mens-shirts';
    genderFilter = 'men';
    searchQuery = 'shirt';
    responsePrefix = `Here are our tailored organic cotton and bespoke shirts for men:`;
  }
  // Watches
  else if (lower.includes('watch') || lower.includes('watches')) {
    if (lower.includes('men')) {
      categorySlug = 'mens-watches';
      genderFilter = 'men';
    } else {
      categorySlug = 'womens-watches';
    }
    searchQuery = 'watch';
    responsePrefix = `Here are precision luxury timepieces available in our catalog:`;
  }
  // Bags & Luggage
  else if (lower.includes('bag') || lower.includes('tote') || lower.includes('handbag') || lower.includes('luggage')) {
    categorySlug = 'womens-bags';
    searchQuery = 'bag';
    responsePrefix = `Here are our full-grain Tuscan leather totes and handbags:`;
  }
  // Beauty & Fragrances
  else if (lower.includes('beauty') || lower.includes('perfume') || lower.includes('fragrance') || lower.includes('makeup') || lower.includes('skincare')) {
    categorySlug = 'beauty';
    searchQuery = 'beauty';
    responsePrefix = `Here are our botanical beauty and clinical skincare elixirs:`;
  }
  // General Wedding Intent
  else if (lower.includes('wedding') || lower.includes('marriage') || lower.includes('party')) {
    searchQuery = 'wedding';
    responsePrefix = `Here are luxury attire and accessory selections curated for wedding celebrations:`;
  }
  // General Product Query
  else {
    searchQuery = msg.replace(/[?.,!]/g, '').trim();
    responsePrefix = `Here are the matching products from our real-time catalog:`;
  }

  // Execute database search
  const products = await tools.searchProducts({
    query: searchQuery,
    categorySlug,
    category: categoryFilter,
    gender: genderFilter,
    maxPrice: priceFilter.maxPrice,
    minPrice: priceFilter.minPrice,
    limit: 6,
  });

  if (products && products.length > 0) {
    return {
      reply: `${responsePrefix}\n\nAll items are in stock with genuine VEXIVO quality assurance and 30-day doorstep returns.`,
      data: {
        actionType: 'PRODUCT_GRID',
        products,
      },
      suggestedActions: [
        '🎁 Any Offers Available?',
        '💎 Matching Jewellery',
        '📦 Track My Order',
        '🛍️ View Today Deals',
      ],
    };
  }

  // If no exact match, fallback gracefully with popular sarees & bestsellers without hallucinating
  const popularSarees = await tools.searchProducts({ query: 'saree', limit: 4 });
  return {
    reply: `I couldn't find exact products matching "${msg}"${
      priceFilter.maxPrice ? ` under ₹${priceFilter.maxPrice}` : ''
    }. 

Here are some of our most popular bestsellers from the VEXIVO collection:`,
    data: {
      actionType: 'PRODUCT_GRID',
      products: popularSarees,
    },
    suggestedActions: [
      'Show sarees under ₹1500',
      '🎁 Today Offers',
      '📦 Track Order',
    ],
  };
};

module.exports = {
  processUserMessage,
};
