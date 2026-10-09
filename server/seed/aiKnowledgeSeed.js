const AISettings = require('../models/AISettings');
const AIKnowledge = require('../models/AIKnowledge');
const AIFAQ = require('../models/AIFAQ');

const seedAiKnowledge = async () => {
  try {
    // 1. Initialize AISettings
    const settingsCount = await AISettings.countDocuments();
    if (settingsCount === 0) {
      await AISettings.create({
        enabled: true,
        assistantName: 'VEXIVO AI Customer Care',
        avatarUrl: '',
        welcomeMessage: `Hi Member! 👋 I’m your **VEXIVO AI Customer Care Assistant**.

I’m available 24×7 to help with orders, returns, refunds, payments, delivery, products, offers and shopping.

How can I help you today?`,
        fallbackMessage: `I couldn't find an exact match for that in our catalog, but I'm here 24×7 to assist you with orders, returns, payments, or product recommendations!`,
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
        systemPrompt: `You are VEXIVO AI Customer Care, the official 24x7 unified Customer Care and Shopping AI of VEXIVO. You handle complete customer support (order tracking, cancellations, returns, refunds, payments, delivery, account, and policies) as well as shopping assistance (product discovery, budget search, sizes, colors, variants, stock, and offers). You must use VEXIVO's connected backend database as the single source of truth. Never invent products, prices, discounts, stock, sizes, colors, orders, or policies. Understand English, Hindi and Hinglish.`,
        enableOrderActions: true,
        enableCartActions: true,
        enableWishlistActions: true,
      });
      console.log('[VEXIVO AI] ✅ Initialized default AISettings for VEXIVO AI Customer Care');
    }

    // 2. Initialize AIKnowledge base
    const knowledgeCount = await AIKnowledge.countDocuments();
    if (knowledgeCount === 0) {
      const defaultKnowledge = [
        {
          title: 'About VEXIVO Brand',
          category: 'About',
          priority: 10,
          tags: ['about', 'company', 'brand', 'who is vexivo', 'story', 'history'],
          content: `VEXIVO is India's premier destination for luxury lifestyle apparel, handcrafted ethnic sarees, contemporary western dresses, artisan jewellery, and premium fashion accessories. Every VEXIVO piece is curated with obsessive attention to craftsmanship, fabric purity, and timeless elegance.`,
        },
        {
          title: 'Shipping & Delivery Policy',
          category: 'Shipping',
          priority: 9,
          tags: ['shipping', 'delivery', 'delivery time', 'charges', 'courier', 'free shipping', 'express delivery', 'speed'],
          content: `• **Free Shipping**: Available on all prepaid and COD orders above ₹999 across India.
• **Standard Delivery Time**: 2 to 4 business days to major metros (Delhi, Mumbai, Bangalore, Hyderabad, Kolkata, Chennai) and 3 to 6 business days for tier-2 & tier-3 cities.
• **Express Shipping**: Next-day delivery available in select metro pin codes.
• **Courier Partners**: All parcels are dispatched with insured premium express carriers (BlueDart, Delhivery, Xpressbees) with real-time SMS & WhatsApp live tracking.`,
        },
        {
          title: '30-Day Doorstep Returns Policy',
          category: 'Returns',
          priority: 9,
          tags: ['return', 'returns', 'return policy', 'how to return', 'pickup', 'doorstep pickup', '30 days'],
          content: `• **30-Day Hassle-Free Window**: Return any eligible unworn item with original tags intact within 30 days of delivery.
• **Free Doorstep Pickup**: Our courier executive picks up the package from your doorstep within 24–48 hours of your return request.
• **1-Click Return via AI Assistant**: You can initiate returns instantly right inside this chat!
• **Non-Returnable Items**: Custom-stitched garments, innerwear, and beauty elixirs once unsealed.`,
        },
        {
          title: 'Instant Refund Policy & Timelines',
          category: 'Refunds',
          priority: 9,
          tags: ['refund', 'refunds', 'refund policy', 'money back', 'bank refund', 'upi refund', 'when will i get refund'],
          content: `• **Prepaid Orders (Cards/NetBanking)**: Refund credited to the original source within 3–5 business days after quality verification.
• **UPI Orders (GPay, PhonePe, Paytm)**: Instant refund directly to your UPI ID within 24 hours.
• **COD Orders**: Transferred instantly to your verified Bank Account or UPI ID upon pickup inspection.
• **Failed Checkout / Deducted Money**: Automatically refunded by the banking gateway within 24–48 hours.`,
        },
        {
          title: 'Free Size & Color Exchanges',
          category: 'Exchange',
          priority: 8,
          tags: ['exchange', 'size exchange', 'color exchange', 'replace', 'wrong size', 'fit issue'],
          content: `• **100% Free Exchanges**: If a dress, saree, or footwear doesn't fit perfectly, exchange it for any available size or color with zero extra delivery fees.
• **Instant Replacement Dispatch**: We dispatch your replacement item as soon as the reverse pickup is scanned.`,
        },
        {
          title: 'Order Cancellation Policy',
          category: 'Cancellation',
          priority: 8,
          tags: ['cancel', 'cancellation', 'cancel order', 'how to cancel'],
          content: `• **Instant Self-Service Cancellation**: Orders can be cancelled instantly via this AI Assistant or from your Account Dashboard anytime before dispatch.
• **Post-Dispatch**: Once shipped, orders cannot be cancelled mid-transit, but you can simply reject delivery at your doorstep or initiate a 30-day return.`,
        },
        {
          title: 'Payment Methods & Security',
          category: 'Payments',
          priority: 8,
          tags: ['payment', 'payment methods', 'cod', 'cash on delivery', 'upi', 'credit card', 'debit card', 'emi', 'secure'],
          content: `• **Supported Modes**: Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Visa, MasterCard, RuPay, Net Banking (all major Indian banks), and Wallets.
• **100% 256-bit Bank-Grade SSL Encryption**: We never store sensitive CVV or card PINs.
• **COD Limit**: Cash on Delivery available up to ₹10,000 per order.`,
        },
        {
          title: 'Store Location & Customer Concierge Contact',
          category: 'Contact',
          priority: 7,
          tags: ['contact', 'phone', 'email', 'address', 'store', 'customer care', 'support number', 'help desk'],
          content: `• **Customer Concierge Email**: concierge@vexivo.com / care@vexivo.com
• **Toll-Free Helpline**: 1800-456-7890 (Mon–Sat: 9:00 AM – 8:00 PM IST)
• **Headquarters & Flagship Experience Center**: VEXIVO Tower, Level 4, Bandra Kurla Complex (BKC), Mumbai, Maharashtra 400051.`,
        },
        {
          title: 'Festive Offers & Coupon Codes',
          category: 'Offers',
          priority: 7,
          tags: ['offers', 'coupons', 'discount', 'promocode', 'deal', 'promo', 'sale'],
          content: `• **WELCOME10**: Flat 10% OFF on your first purchase (min order ₹999).
• **FESTIVE20**: Flat 20% OFF on Banarasi & Kanjivaram Sarees (min order ₹2499).
• **VEXVIP**: Extra 15% OFF for VEXIVO VIP members on premium western wear.`,
        },
      ];

      await AIKnowledge.insertMany(defaultKnowledge);
      console.log(`[VEXIVO AI] ✅ Seeded ${defaultKnowledge.length} knowledge base articles`);
    }

    // 3. Initialize AI FAQs
    const faqCount = await AIFAQ.countDocuments();
    if (faqCount === 0) {
      const defaultFaqs = [
        {
          question: 'Do you offer Cash on Delivery (COD)?',
          answer: 'Yes! VEXIVO offers Cash on Delivery (COD) across 19,000+ pin codes in India for orders up to ₹10,000. You can also pay the delivery agent via UPI QR upon parcel arrival.',
          category: 'Payments',
          displayOrder: 1,
        },
        {
          question: 'How do I track my order?',
          answer: 'You can ask this AI assistant "Where is my order?" or visit Account > Order History to see live courier tracking with milestone checkpoints.',
          category: 'Orders',
          displayOrder: 2,
        },
        {
          question: 'Are your Banarasi and silk sarees 100% authentic?',
          answer: 'Yes, all VEXIVO ethnic collections and sarees are certified for handloom authenticity, weaving purity, and premium zari finishes.',
          category: 'Products',
          displayOrder: 3,
        },
        {
          question: 'How long does refund take for cancelled orders?',
          answer: 'Prepaid cancellations are refunded back to your bank/card in 3-5 business days. UPI payments are refunded within 24 hours.',
          category: 'Refunds',
          displayOrder: 4,
        },
        {
          question: 'Can I exchange for a different size if it does not fit?',
          answer: 'Absolutely! We provide completely free size & color exchanges within 30 days of delivery with doorstep reverse pickup.',
          category: 'Exchange',
          displayOrder: 5,
        },
      ];

      await AIFAQ.insertMany(defaultFaqs);
      console.log(`[VEXIVO AI] ✅ Seeded ${defaultFaqs.length} FAQs`);
    }
  } catch (err) {
    console.warn('[VEXIVO AI] Seed notice:', err.message);
  }
};

module.exports = { seedAiKnowledge };
