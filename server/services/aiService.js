const tools = require('./aiTools');

/**
 * Language Detector: identifies if user prompt is 'hindi' (Devanagari), 'hinglish', or 'english'
 */
const detectLanguage = (text) => {
  if (!text) return 'english';
  // Check for Devanagari script characters (e.g., "नमस्ते", "मेरा ऑर्डर")
  if (/[\u0900-\u097F]/.test(text)) {
    return 'hindi';
  }

  // Check for common Hinglish words
  const hinglishWords = new Set([
    'mera', 'meri', 'mere', 'kaha', 'kahan', 'kab', 'kaise', 'kaisa', 'kaisi',
    'hai', 'hain', 'ho', 'hoga', 'hogi', 'honge', 'aayega', 'aayegi', 'ayega',
    'karna', 'karni', 'karein', 'karo', 'chahiye', 'dikhao', 'batao', 'milega',
    'milegi', 'kat', 'gaya', 'gayi', 'paise', 'wapas', 'nahi', 'nahin', 'pe',
    'par', 'ke', 'ki', 'ka', 'ko', 'se', 'me', 'mein', 'kuch', 'acha', 'acche',
    'acchi', 'shukriya', 'dhanyawad', 'namaste', 'pranam', 'wala', 'wali',
    'wale', 'pehle', 'dusra', 'doosra', 'teesra', 'lekin', 'kyu', 'kyun', 'aur',
    'dono', 'saath', 'ab', 'abhi', 'kya', 'bhi', 'bohot', 'bahut', 'sasta', 'saste',
    'mehenga', 'khareedna', 'lena', 'daalo', 'daal', 'bhejo', 'puchna', 'bataiye',
    'baat', 'thi', 'tha', 'raha', 'rahi', 'samajh', 'tum', 'sakti', 'sakta', 'aap',
    'mujhe', 'pehnu', 'shaadi', 'batao', 'batayein', 'bataiye', 'kaunsa', 'kaunsi',
    'ye', 'yeh', 'wo', 'woh', 'iska', 'iski', 'iske', 'unka', 'unki', 'unke'
  ]);

  const words = text.toLowerCase().split(/[^a-zA-Z0-9]+/).filter(Boolean);
  const matchCount = words.filter((w) => hinglishWords.has(w)).length;

  if (matchCount >= 1 || (words.length > 0 && matchCount / words.length >= 0.12)) {
    return 'hinglish';
  }

  return 'english';
};

/**
 * Enhanced price extraction helper supporting English, Hindi, and Hinglish
 */
const extractPriceFilter = (text) => {
  const t = text.toLowerCase();

  // e.g. "2000 ke under", "under 2000", "2000 ke andar", "2000 tak", "within 1500", "max 2000", "budget 1500", "budget 3000 hai", "less than 2000", "2000 se kam"
  const underMatch =
    t.match(
      /(?:under|below|less than|within|max|budget of|budget|upto|up to|maximum|se kam)\s*(?:is|hai|=|:)?\s*(?:₹|rs\.?|inr)?\s*(\d+)/i
    ) || t.match(/(\d+)\s*(?:ke under|ke andar|tak|se kam|ke niche|k andar|k under)/i);

  if (underMatch) {
    return { maxPrice: parseInt(underMatch[1], 10) };
  }

  // e.g. "above 1000", "over 1500", "more than 2000", "min 1000", "1000 se upar", "1000 se zyada"
  const aboveMatch =
    t.match(
      /(?:above|over|more than|min|minimum|greater than|se zyada|se upar)\s*(?:₹|rs\.?|inr)?\s*(\d+)/i
    ) || t.match(/(\d+)\s*(?:se zyada|se upar|ke upar)/i);

  if (aboveMatch) {
    return { minPrice: parseInt(aboveMatch[1], 10) };
  }

  // e.g. "between 1000 and 2000", "1000 to 2000", "1000 se 2000 tak"
  const betweenMatch = t.match(
    /(?:between|from|range of)?\s*(?:₹|rs\.?|inr)?\s*(\d+)\s*(?:and|to|-|se)\s*(?:₹|rs\.?|inr)?\s*(\d+)(?:\s*tak)?/i
  );
  if (betweenMatch && betweenMatch[1] && betweenMatch[2]) {
    const p1 = parseInt(betweenMatch[1], 10);
    const p2 = parseInt(betweenMatch[2], 10);
    if (!isNaN(p1) && !isNaN(p2) && p2 > p1) {
      return { minPrice: p1, maxPrice: p2 };
    }
  }

  return {};
};

/**
 * Extract size from query (e.g. "size M", "M size", "XL", "size 38", "M size mein")
 */
const extractSize = (text) => {
  const match = text.match(/\b(?:size\s+([xs|s|m|l|xl|xxl|xxxl|\d+]+)|([xs|s|m|l|xl|xxl|xxxl]+)\s+size)\b/i);
  if (match) {
    return (match[1] || match[2]).toUpperCase();
  }
  return null;
};

/**
 * Extract color from query (English & Hindi)
 */
const extractColor = (text) => {
  const commonColors = [
    'black', 'red', 'blue', 'green', 'pink', 'white', 'yellow', 'purple',
    'gold', 'golden', 'silver', 'maroon', 'orange', 'navy', 'grey', 'gray',
    'beige', 'brown', 'teal', 'kala', 'kali', 'kale', 'lal', 'laal', 'neela',
    'neeli', 'hara', 'hari', 'gulabi', 'safed', 'peela', 'peeli'
  ];
  const t = text.toLowerCase();
  for (const c of commonColors) {
    const regex = new RegExp(`\\b${c}\\b`, 'i');
    if (regex.test(t)) {
      const hindiMap = {
        kala: 'black', kali: 'black', kale: 'black',
        lal: 'red', laal: 'red',
        neela: 'blue', neeli: 'blue',
        hara: 'green', hari: 'green',
        gulabi: 'pink',
        safed: 'white',
        peela: 'yellow', peeli: 'yellow',
      };
      return hindiMap[c] || c;
    }
  }
  return null;
};

/**
 * Extract ordinal index from text (e.g. "first", "second", "2nd", "pehla", "doosra", "teesra")
 */
const extractOrdinalIndex = (text) => {
  const t = text.toLowerCase();
  if (t.includes('first') || t.includes('1st') || t.includes('pehla') || t.includes('1st wala') || t.includes('pehli')) return 0;
  if (t.includes('second') || t.includes('2nd') || t.includes('doosra') || t.includes('dusra') || t.includes('doosri')) return 1;
  if (t.includes('third') || t.includes('3rd') || t.includes('teesra') || t.includes('tisra') || t.includes('teesri')) return 2;
  if (t.includes('fourth') || t.includes('4th') || t.includes('chautha')) return 3;
  if (t.includes('fifth') || t.includes('5th') || t.includes('panchwa')) return 4;
  return null;
};

/**
 * Extract multi-turn context from conversation history
 */
const extractConversationContext = (history) => {
  let lastShownProducts = [];
  let previousCategory = null;
  let previousOccasion = null;
  let previousPriceFilter = {};

  if (Array.isArray(history) && history.length > 0) {
    for (let i = history.length - 1; i >= 0; i--) {
      const h = history[i];
      if (h.data?.products && Array.isArray(h.data.products) && h.data.products.length > 0) {
        if (lastShownProducts.length === 0) {
          lastShownProducts = h.data.products;
          if (h.data.products[0]?.categorySlug || h.data.products[0]?.category) {
            previousCategory = h.data.products[0].categorySlug || h.data.products[0].category;
          }
        }
      }

      // Check user past queries for category/occasion
      if (h.role === 'user' && typeof h.content === 'string') {
        const pastLower = h.content.toLowerCase();
        if (!previousCategory) {
          if (pastLower.includes('saree') || pastLower.includes('sari')) previousCategory = 'saree';
          else if (pastLower.includes('dress') || pastLower.includes('gown')) previousCategory = 'dress';
          else if (pastLower.includes('jewel')) previousCategory = 'jewellery';
          else if (pastLower.includes('shoe') || pastLower.includes('footwear')) previousCategory = 'shoes';
        }
        if (!previousOccasion) {
          if (pastLower.includes('wedding') || pastLower.includes('shaadi') || pastLower.includes('bridal')) previousOccasion = 'wedding';
          else if (pastLower.includes('party') || pastLower.includes('cocktail')) previousOccasion = 'party';
          else if (pastLower.includes('festive') || pastLower.includes('diwali')) previousOccasion = 'festive';
        }
        const pf = extractPriceFilter(pastLower);
        if (pf.maxPrice && !previousPriceFilter.maxPrice) {
          previousPriceFilter = pf;
        }
      }
    }
  }

  return { lastShownProducts, previousCategory, previousOccasion, previousPriceFilter };
};

/**
 * Optional Gemini LLM for Open-Domain Conversational Polishing
 */
const tryGeminiLLM = async ({ message, history = [], user = null, contextData = {}, lang = 'english' }) => {
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || typeof fetch === 'undefined') return null;

  try {
    const systemPrompt = `You are VEXIVO AI Customer Care, the official 24x7 unified Customer Care and Shopping AI of VEXIVO India.
Your goal is to understand ANY question and provide helpful, accurate, natural answers.

LANGUAGE ADAPTATION RULE:
- If user writes in English, reply in natural, friendly English.
- If user writes in Hindi (Devanagari), reply in polite, fluent Hindi.
- If user writes in Hinglish (Roman Hindi/English mix), reply in natural, fluent Hinglish.
- Match the user's tone and style seamlessly.

GROUND TRUTH RULES:
- NEVER invent fake products, prices, tracking numbers, or fake return policies.
- If specific order/product details are given in context, use them accurately.
- For fashion/styling advice, give elegant, expert answers.`;

    const contents = [];
    if (Array.isArray(history) && history.length > 0) {
      for (const h of history.slice(-6)) {
        contents.push({
          role: h.role === 'user' ? 'user' : 'model',
          parts: [{ text: h.content || h.text || '' }],
        });
      }
    }
    contents.push({
      role: 'user',
      parts: [{ text: message }],
    });

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 800,
          },
        }),
      }
    );

    if (response.ok) {
      const data = await response.json();
      const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (candidate && candidate.trim()) {
        return candidate.trim();
      }
    }
  } catch (err) {
    console.warn('[Gemini LLM Notice]:', err.message);
  }
  return null;
};

/**
 * Core AI Reasoning & Semantic Intent Execution Engine
 * Unified Single VEXIVO AI: Customer Care + Shopping + Fashion Advice + Casual Questions
 */
const processUserMessage = async ({
  message,
  history = [],
  user = null,
  sessionId = 'guest_session',
}) => {
  const msg = (message || '').trim();
  const lower = msg.toLowerCase();
  const lang = detectLanguage(msg);

  // 0. Check AI Settings (Admin control)
  const aiSettings = await tools.getAISettings();
  if (aiSettings.enabled === false) {
    return {
      reply:
        lang === 'hindi'
          ? 'हमारी VEXIVO AI Customer Care सेवा वर्तमान में रखरखाव में है। कृपया care@vexivo.com पर संपर्क करें।'
          : lang === 'hinglish'
          ? 'Hamari VEXIVO AI Customer Care abhi maintenance mein hai. Aap humein care@vexivo.com par contact kar sakte hain.'
          : 'Our VEXIVO AI Customer Care is currently undergoing scheduled maintenance. Please reach our desk at care@vexivo.com.',
      data: { actionType: 'MAINTENANCE' },
      suggestedActions: ['🛍️ Browse Catalog', '🎁 View Offers'],
    };
  }

  const priceFilter = extractPriceFilter(lower);
  const detectedColor = extractColor(lower);
  const detectedSize = extractSize(lower);
  const { lastShownProducts, previousCategory, previousOccasion, previousPriceFilter } =
    extractConversationContext(history);

  let result = null;

  // =========================================================================
  // 1. GREETINGS (Hi, Hello, Hey, Namaste, Good morning)
  // =========================================================================
  const isGreeting =
    /^(hi|hello|hey|heya|hola|namaste|pranam|namaskar|good\s*(morning|afternoon|evening|day)|greetings)[!?,.\s]*$/i.test(
      lower
    ) ||
    lower === 'hi' ||
    lower === 'hello' ||
    lower === 'hey' ||
    lower === 'namaste' ||
    lower === 'namaskar';

  if (isGreeting) {
    const greetingReply =
      lang === 'hindi'
        ? `नमस्ते! 👋 मैं **VEXIVO AI Customer Care** हूँ। आज मैं आपकी किस चीज़ में मदद कर सकती हूँ?`
        : lang === 'hinglish'
        ? `Hi! 👋 Main **VEXIVO AI Customer Care** hoon. Aaj main aapki kis cheez mein help kar sakti hoon?`
        : `Hi! 👋 I’m **VEXIVO AI Customer Care**. How can I help you today?`;

    result = {
      reply: greetingReply,
      data: { actionType: 'GREETING' },
      suggestedActions: [
        '📦 Track My Order',
        '↩️ Return My Order',
        '💳 Payment Help',
        '🛍️ Find Products',
        '🎁 Offers & Coupons',
        '✨ What is Trending?',
      ],
    };
  }

  // =========================================================================
  // 2. HELP REQUEST / CAPABILITY INQUIRY ("kya tum meri help kar sakti ho?", "can you help me?")
  // =========================================================================
  else if (
    /^(kya\s+tum\s+(meri\s+)?help\s+kar\s+sakti\s+ho|kya\s+aap\s+(meri\s+)?help\s+kar\s+sakte\s+ho|kya\s+tum\s+meri\s+madad\s+kar\s+sakti\s+ho|can\s+you\s+help\s+me|help\s+me|can\s+you\s+help|mujhe\s+help\s+chahiye|i\s+need\s+help|help)[!?,.\s]*$/i.test(
      lower
    ) ||
    lower === 'can you help me' ||
    lower === 'kya tum meri help kar sakti ho' ||
    lower === 'can you help' ||
    lower === 'help me' ||
    lower === 'mujhe help chahiye' ||
    lower === 'kya aap meri sahayata kar sakte hain'
  ) {
    const helpReply =
      lang === 'hindi'
        ? `हाँ बिल्कुल! 😊 मैं आपकी सहायता के लिए तैयार हूँ। आप शॉपिंग, प्रोडक्ट्स, ऑर्डर्स, रिटर्न, पेमेंट्स या VEXIVO से संबंधित किसी भी सवाल के बारे में मुझसे पूछ सकती हैं।`
        : lang === 'hinglish'
        ? `Haan bilkul! 😊 Main aapki help ke liye ready hoon. Aap shopping, products, orders, returns, payments ya VEXIVO se related kisi bhi question ke baare mein mujhse pooch sakti hain.`
        : `Yes, absolutely! 😊 I'm ready to help you. You can ask me about shopping, products, orders, returns, refunds, payments, or anything related to VEXIVO.`;

    result = {
      reply: helpReply,
      data: { actionType: 'HELP_REQUEST' },
      suggestedActions: [
        '📦 Track My Order',
        '↩️ Return / Exchange',
        '💳 Payment Help',
        '🛍️ Find Products',
        '🎁 Offers & Coupons',
      ],
    };
  }

  // =========================================================================
  // 3. PRODUCT DISCUSSION / CONFUSION (User mentions talking about product without explicit search request)
  // E.g. "Mujhe meri product ke related baat karni thi", "Mujhe ek product ke baare mein baat karni hai", "Mujhe product samajh nahi aa raha"
  // =========================================================================
  else if (
    lower.includes('product ke related baat karni thi') ||
    lower.includes('product ke baare mein baat karni hai') ||
    lower.includes('product ke bare me baat karni hai') ||
    lower.includes('product ke related baat') ||
    lower.includes('product ke baare mein baat') ||
    lower.includes('product ke bare mein baat') ||
    lower.includes('product ke bare me baat') ||
    lower.includes('product ke baare me baat') ||
    lower.includes('ek product ke baare mein') ||
    lower.includes('ek product ke bare me') ||
    lower.includes('product ke baare mein poochna') ||
    lower.includes('talk about my product') ||
    lower.includes('discuss a product') ||
    lower.includes('question about product') ||
    lower.includes('product samajh nahi aa raha') ||
    lower.includes('product samajh nahi aa rahi') ||
    lower.includes('mujhe confuse ho raha hai') ||
    lower.includes('confused hoon') ||
    lower.includes('confuse ho raha hai') ||
    lower.includes('i am confused')
  ) {
    if (lower.includes('samajh nahi') || lower.includes('confuse') || lower.includes('confusion')) {
      const confusionReply =
        lang === 'hindi'
          ? `कोई बात नहीं 😊 आप मुझे बताइए किस प्रोडक्ट को लेकर उलझन है। मैं कीमत, साइज़, रंग, फैब्रिक क्वालिटी, उपलब्धता या अन्य डिटेल्स समझाने में पूरी मदद करूँगी।`
          : lang === 'hinglish'
          ? `Koi baat nahi 😊 Aap mujhe bataiye kis product ko lekar confusion hai. Main price, size, colour, material, availability ya doosri details samjhane mein help karungi.`
          : `No worries at all! 😊 Tell me which product you have questions or confusion about. I'd be happy to explain pricing, sizing, colors, fabric quality, availability, or any other details.`;

      result = {
        reply: confusionReply,
        data: { actionType: 'PRODUCT_DISCUSSION' },
        suggestedActions: [
          '📏 Sizing Guide',
          '🧵 Fabric Details',
          '📦 Delivery Timelines',
          '↩️ Return Policy',
        ],
      };
    } else {
      const discussionReply =
        lang === 'hindi'
          ? `बिल्कुल 😊 बताइए, आप अपनी प्रोडक्ट के बारे में क्या जानना चाहती हैं? आप कीमत, साइज़, रंग, उपलब्धता, क्वालिटी, डिलीवरी या किसी भी अन्य डिटेल के बारे में पूछ सकती हैं।`
          : lang === 'hinglish'
          ? `Bilkul 😊 Bataiye, aap apni product ke baare mein kya jaanna chahti hain? Aap price, size, colour, availability, quality, delivery ya kisi bhi aur detail ke baare mein pooch sakti hain.`
          : `Of course! 😊 Tell me, what would you like to know about your product? You can ask about price, sizing, colour, availability, quality, delivery, or any other detail.`;

      result = {
        reply: discussionReply,
        data: { actionType: 'PRODUCT_DISCUSSION' },
        suggestedActions: [
          '💰 Check Price',
          '📏 Check Size & Fit',
          '📦 Check Delivery Time',
          '↩️ Return & Refund Help',
        ],
      };
    }
  }

  // =========================================================================
  // 4. CASUAL PLEASANTRIES ("How are you?", "Thank you", "Good night", "Bye")
  // =========================================================================
  else if (
    lower.includes('how are you') ||
    lower.includes('kaise ho') ||
    lower.includes('kaisa hai') ||
    lower.includes('kaisi ho') ||
    lower.includes('kya haal') ||
    lower.includes('thank you') ||
    lower.includes('thanks') ||
    lower.includes('dhanyawad') ||
    lower.includes('shukriya') ||
    lower.includes('good night') ||
    lower.includes('shubh ratri') ||
    lower.includes('bye') ||
    lower.includes('alvida')
  ) {
    if (lower.includes('how are you') || lower.includes('kaise ho') || lower.includes('kaisa hai') || lower.includes('kaisi ho') || lower.includes('kya haal')) {
      result = {
        reply:
          lang === 'hindi'
            ? `मैं बिल्कुल ठीक और ऊर्जावान हूँ! 😊 VEXIVO पर आपकी सहायता करने के लिए 24×7 तैयार हूँ। आप आज क्या जानना चाहते हैं?`
            : lang === 'hinglish'
            ? `Main bilkul badhiya hoon! 😊 VEXIVO par aapki shopping, orders ya kisi bhi query mein help karne ke liye 24×7 ready hoon. Bataiye kya help karoon?`
            : `I'm doing wonderful, thank you for asking! 😊 I'm always on standby 24×7 to help you with anything on VEXIVO. How can I assist you today?`,
        data: { actionType: 'CASUAL' },
        suggestedActions: ['📦 Track My Order', '🛍️ Find Products', '🎁 Today Deals'],
      };
    } else if (lower.includes('thank') || lower.includes('dhanyawad') || lower.includes('shukriya')) {
      result = {
        reply:
          lang === 'hindi'
            ? `आपका बहुत-बहुत स्वागत है! 😊 यदि आपको और किसी चीज़ में सहायता चाहिए हो, तो बस बताइए।`
            : lang === 'hinglish'
            ? `You're most welcome! 😊 Agar aapko aur kisi cheez mein help chahiye ho, bas bataiye.`
            : `You're most welcome! 😊 If you need help with anything else, feel free to ask anytime.`,
        data: { actionType: 'CASUAL' },
        suggestedActions: ['🛍️ Browse Catalog', '🎁 View Coupons', '✨ What is Trending?'],
      };
    } else if (lower.includes('good night') || lower.includes('shubh ratri')) {
      result = {
        reply:
          lang === 'hindi'
            ? `शुभ रात्रि! 🌙 आपका समय शुभ हो। VEXIVO AI Customer Care आपके लिए हमेशा यहाँ तैयार है।`
            : lang === 'hinglish'
            ? `Good night & sweet dreams! 🌙 VEXIVO AI 24×7 aapke liye hamesha yahan ready hai.`
            : `Good night! 🌙 Wishing you a wonderful rest. Remember, VEXIVO AI Customer Care is here 24×7 whenever you need assistance!`,
        data: { actionType: 'CASUAL' },
        suggestedActions: ['🛍️ Continue Shopping', '📦 Check Orders'],
      };
    } else {
      result = {
        reply:
          lang === 'hindi'
            ? `अलविदा! आपका दिन शुभ हो। जब भी जरूरत हो, VEXIVO Customer Care हमेशा आपकी सेवा में उपस्थित है। 👋`
            : lang === 'hinglish'
            ? `Take care! Have a great day ahead. Jab bhi zarurat ho, main 24×7 yahin hoon! 👋`
            : `Goodbye! Have a fantastic day ahead. Feel free to reach out anytime — VEXIVO Customer Care is available 24×7! 👋`,
        data: { actionType: 'CASUAL' },
        suggestedActions: ['🛍️ Continue Shopping', '🎁 View Offers'],
      };
    }
  }

  // =========================================================================
  // 5. BRAND / PLATFORM INFORMATION ("What is VEXIVO?", "Who are you?", "About VEXIVO")
  // =========================================================================
  else if (
    lower.includes('what is vexivo') ||
    lower.includes('vexivo kya hai') ||
    lower.includes('about vexivo') ||
    lower.includes('tell me about vexivo') ||
    lower.includes('who are you') ||
    lower.includes('kaun ho') ||
    lower.includes('who made you') ||
    lower.includes('kisine banaya')
  ) {
    if (lower.includes('who are you') || lower.includes('kaun ho') || lower.includes('who made you') || lower.includes('kisine banaya')) {
      result = {
        reply:
          lang === 'hindi'
            ? `मैं **VEXIVO AI Customer Care** हूँ, जिसे VEXIVO इंजीनियरिंग टीम द्वारा आपकी 24×7 ग्राहक सहायता, ऑर्डर ट्रैकिंग और खरीदारी मार्गदर्शन के लिए बनाया गया है।`
            : lang === 'hinglish'
            ? `Main **VEXIVO AI Customer Care** hoon, jo aapki 24×7 customer care, orders, payments, returns aur luxury shopping help ke liye banaya gaya hai.`
            : `I am **VEXIVO AI Customer Care**, designed by the VEXIVO team to provide instant 24×7 customer support, order assistance, and luxury shopping guidance!`,
        data: { actionType: 'INFO' },
        suggestedActions: ['📦 Track My Order', '🛍️ Find Products', '🎁 Offers & Coupons'],
      };
    } else {
      result = {
        reply:
          lang === 'hindi'
            ? `**VEXIVO** एक प्रमुख भारतीय फैशन और लाइफस्टाइल ब्रांड है जो प्रामाणिक पारंपरिक साड़ियाँ (जैसे बनारसी, कांजीवरम, सिल्क), डिज़ाइनर वेस्टर्न ड्रेसेस, हैंडक्राफ्टेड आभूषण और फुटवियर प्रदान करता है।\n\nहमारे सभी उत्पाद 100% सत्यापित क्वालिटी, एक्सप्रेस पैन-इंडिया डिलीवरी और **30-दिन की डोरस्टेप रिटर्न गारंटी** के साथ आते हैं।`
            : lang === 'hinglish'
            ? `**VEXIVO** ek premium fashion aur lifestyle brand hai jo authentic ethnic sarees (Banarasi, Kanjivaram, Silk), designer western dresses, handcrafted jewellery aur footwear provide karta hai.\n\nSabhi products verified quality, express pan-India delivery aur **30-Day Doorstep Returns** ke saath aate hain.`
            : `**VEXIVO** is a luxury omnichannel fashion & lifestyle brand featuring handcrafted heritage sarees (Banarasi, Kanjivaram, Chanderi & Silk), designer western wear, artisan jewellery, and footwear.\n\nAll items come with verified quality assurance, express pan-India dispatch, and a **30-Day Free Doorstep Return & Exchange Guarantee**.`,
        data: { actionType: 'INFO' },
        suggestedActions: ['🛍️ Explore Sarees', '👗 Explore Dresses', '🎁 Today Offers', '📦 Track My Order'],
      };
    }
  }

  // =========================================================================
  // 6. FASHION & OCCASION STYLING ADVICE ("Shaadi mein kya pehnu?", "What to wear to a wedding?", "Fabric care")
  // (Notice: If user just asks styling advice, provide expert guidance first WITHOUT spamming product cards unless they say "dikhao"/"show")
  // =========================================================================
  else if (
    (lower.includes('shaadi mein kya pehnu') ||
      lower.includes('shaadi me kya pehnu') ||
      lower.includes('wedding mein kya pehnu') ||
      lower.includes('what should i wear to a wedding') ||
      lower.includes('what to wear to a wedding') ||
      lower.includes('what to wear') ||
      lower.includes('kya pehnu') ||
      lower.includes('styling advice') ||
      lower.includes('fabric care') ||
      lower.includes('kaise dhoye') ||
      lower.includes('how to wash') ||
      lower.includes('jewellery matches a black saree') ||
      (lower.includes('match') && lower.includes('jewel'))) &&
    !lower.includes('dikhao') &&
    !lower.includes('dikhayein') &&
    !lower.includes('show me') &&
    !lower.includes('find me') &&
    !lower.includes('search')
  ) {
    if (lower.includes('fabric') || lower.includes('care') || lower.includes('dhoye') || lower.includes('wash')) {
      const careText =
        lang === 'hindi'
          ? `🧵 **फैब्रिक केयर व रखरखाव गाइड**:

1. **प्योर सिल्क व बनारसी ज़री**: हमेशा केवल 'ड्राई क्लीन' (Dry Clean) करवाएं। ज़री पर सीधे इस्त्री न करें।
2. **जॉर्जेट व शिफॉन**: हल्के ठंडे पानी में हाथ से धोएं और सीधी धूप से बचाकर सुखाएं।
3. **कॉटन व चंदेरी**: माइल्ड डिटर्जेंट से धोएं और हल्की भाप (Steam Iron) से प्रेस करें।
4. **स्टोरेज**: साड़ियों को हवादार कॉटन मलमल बैग में रखें ताकि फैब्रिक सालों-साल नया रहे।`
          : lang === 'hinglish'
          ? `🧵 **Fabric Care & Washing Guide**:

1. **Pure Silk & Banarasi Zari**: Hamesha **Dry Clean** hi karwayen. Zari work par direct high iron na lagayein.
2. **Georgette & Chiffon**: Gentle hand-wash cold water mein karein, direct harsh dhoop mein na sukhayein.
3. **Cotton & Handloom**: Mild liquid detergent use karein aur medium heat steam iron karein.
4. **Storage Tip**: Silk sarees ko soft cotton/muslin bags mein wrap karke rakhein.`
          : `🧵 **Luxury Fabric Care & Preservation Guide**:

1. **Pure Silk, Banarasi & Zari**: Professional **Dry Clean Only**. Never iron directly over intricate zari work.
2. **Georgette & Chiffon**: Gentle hand-wash in cold water with mild silk detergent. Line-dry in shade.
3. **Handloom & Chanderi**: Steam iron on medium setting for crisp drapes.
4. **Storage Tip**: Wrap your luxury garments in breathable cotton muslin bags to prevent oxidation.`;

      result = {
        reply: careText,
        data: { actionType: 'FASHION_ADVICE' },
        suggestedActions: ['🛍️ View Sarees', '👗 View Dresses', '🎁 Today Offers'],
      };
    } else if (lower.includes('jewel') || lower.includes('match')) {
      const jewelAdvice =
        lang === 'hindi'
          ? `✨ **मैचिंग आभूषण सुझाव**:

• **सिल्क / बनारसी साड़ी के साथ**: पारंपरिक कुंदन चोकर, मंदिर के झुमके या मीनाकारी सेट बहुत रॉयल लगते हैं।
• **ब्लैक / डार्क ड्रेसेस के साथ**: डायमंड-कट क्रिस्टल नेकलेस या एमराल्ड चोकर एक शानदार कंट्रास्ट देते हैं।
• **पेस्टल या फ्लोरल साड़ियों के साथ**: क्लासिक पर्ल (मोती) लेयर्ड नेकलेस सबसे सुंदर लगता है।`
          : lang === 'hinglish'
          ? `✨ **Fashion & Jewellery Matching Guide**:

• **Banarasi / Silk Saree ke saath**: Kundan chokers, temple jewellery, ya gold-plated jhumkas royal look dete hain.
• **Black / Dark Gowns ke saath**: Emerald stone jewellery, diamond-cut crystals ya Rose Gold drops standout karte hain.
• **Pastel & Georgette Sarees ke saath**: Pearl layered necklaces aur delicate studs sabse elegant lagte hain.`
          : `✨ **Expert Fashion & Jewellery Styling Guide**:

• **With Heritage Silk & Banarasi Sarees**: Pair with handcrafted Kundan chokers, temple gold jhumkas, or antique polki sets.
• **With Black & Western Evening Gowns**: Emerald accent chokers or diamond-cut drops provide a striking modern contrast.
• **With Pastel & Organza Sarees**: Layered pearl necklaces and floral drop earrings offer understated elegance.`;

      result = {
        reply: jewelAdvice,
        data: { actionType: 'FASHION_ADVICE' },
        suggestedActions: ['💎 Show Matching Jewellery', '🛍️ Show Sarees', '🎁 View Offers'],
      };
    } else {
      const weddingAdvice =
        lang === 'hindi'
          ? `✨ **शादी के विभिन्न अवसरों के लिए स्टाइलिंग सुझाव**:

• **हल्दी सेरेमनी**: ब्राइट येलो या मस्टर्ड जॉर्जेट साड़ी / फ्लोरल अनारकली।
• **मेहंदी फंक्शन**: एमराल्ड ग्रीन या मिंट एम्ब्रॉयडरी साड़ी / शरारा सूट।
• **मुख्य शादी**: रॉयल रेड / मैरून बनारसी सिल्क, कांजीवरम ज़री साड़ी या हैवी एम्ब्रॉयडर्ड लहंगा।
• **रिसेप्शन**: वाइन या नेवी ब्लू डिज़ाइनर इवनिंग गाउन / मॉडर्न सिल्क साड़ी।

यदि आप इनमें से किसी भी अवसर के लिए ऑप्शंस देखना चाहती हैं, तो मुझे बताइए (जैसे: *"शादी के लिए 3000 के अंदर साड़ी दिखाओ"*).`
          : lang === 'hinglish'
          ? `✨ **Shaadi ke functions ke liye Outfit & Styling Guide**:

• **Haldi Function**: Bright Yellow ya Mustard Georgette Saree / Anarkali suit light jewellery ke saath.
• **Mehendi**: Fresh Mint ya Bottle Green embroidered Saree / Kurta set.
• **Wedding Ceremony**: Royal Red ya Maroon Banarasi Silk Saree traditional gold/kundan jewellery ke saath.
• **Reception**: Elegant Wine / Navy designer Gown ya modern Pastel Saree statement choker ke saath.

Agar aap inme se kisi occasion ke liye specific designs dekhna chahti hain, toh batayein (jaise: *"Shaadi ke liye 3000 ke under saree dikhao"*).`
          : `✨ **Wedding Outfit & Styling Guide**:

• **Haldi**: Vibrant Yellow or Mustard georgette drapes or floral anarkalis.
• **Mehendi**: Fresh Mint or Emerald green embroidered sarees or lehengas.
• **Main Wedding**: Regal Banarasi Silk, Kanjivaram zari sarees, or bridal lehengas in Crimson/Maroon.
• **Reception**: Contemporary evening gowns or elegant pastel organza sarees paired with statement chokers.

If you would like to explore matching outfits within a budget, just let me know (e.g. *"Show wedding sarees under 3000"*).`;

      result = {
        reply: weddingAdvice,
        data: { actionType: 'FASHION_ADVICE' },
        suggestedActions: [
          '🛍️ Shaadi ke liye saree dikhao',
          '👗 Party Dresses dikhao',
          '💎 Matching Jewellery',
        ],
      };
    }
  }

  // =========================================================================
  // 7. SPECIFIC PRODUCT PRICE / SIZE / STOCK CHECK
  // E.g. "Is dress ka price kya hai?", "Ye dress kitne ki hai?", "ye M size mein available hai?"
  // =========================================================================
  else if (
    (lower.includes('price kya hai') ||
      lower.includes('kitne ki hai') ||
      lower.includes('kitne ka hai') ||
      lower.includes('what is the price') ||
      lower.includes('how much is') ||
      lower.includes('price of this') ||
      lower.includes('available hai') ||
      lower.includes('in stock') ||
      lower.includes('size mein available') ||
      lower.includes('size available')) &&
    !lower.includes('under') &&
    !lower.includes('below') &&
    !lower.includes('dikhao')
  ) {
    const ordinal = extractOrdinalIndex(lower);
    let targetProduct = null;

    if (ordinal !== null && lastShownProducts[ordinal]) {
      targetProduct = lastShownProducts[ordinal];
    } else if (lastShownProducts.length > 0) {
      targetProduct = lastShownProducts[0];
    }

    if (targetProduct) {
      if (detectedSize || lower.includes('size')) {
        const sizeToCheck = detectedSize || 'M';
        const hasSize =
          Array.isArray(targetProduct.sizes) &&
          targetProduct.sizes.some((s) => s.toUpperCase() === sizeToCheck.toUpperCase());

        const sizeReply = hasSize
          ? lang === 'hindi'
            ? `हाँ! **${targetProduct.name}** साइज़ **${sizeToCheck}** में उपलब्ध है (कीमत: ₹${targetProduct.price.toLocaleString('en-IN')})। स्टॉक में उपलब्ध है।`
            : lang === 'hinglish'
            ? `Haan! **${targetProduct.name}** size **${sizeToCheck}** mein available hai (Price: ₹${targetProduct.price.toLocaleString('en-IN')}). Ready for dispatch!`
            : `Yes! **${targetProduct.name}** is available in size **${sizeToCheck}** for ₹${targetProduct.price.toLocaleString('en-IN')}. In stock for fast delivery.`
          : lang === 'hindi'
          ? `**${targetProduct.name}** में साइज़ **${sizeToCheck}** के स्थान पर वर्तमान में उपलब्ध साइज़: ${targetProduct.sizes?.join(', ') || 'Free Size'} (स्टॉक में उपलब्ध) हैं (कीमत: ₹${targetProduct.price.toLocaleString('en-IN')})।`
          : lang === 'hinglish'
          ? `**${targetProduct.name}** mein size **${sizeToCheck}** ke bajaye currently available sizes: ${targetProduct.sizes?.join(', ') || 'Free Size'} (in-stock) hain (Price: ₹${targetProduct.price.toLocaleString('en-IN')}).`
          : `**${targetProduct.name}** is available in sizes: ${targetProduct.sizes?.join(', ') || 'Free Size'} in stock (Price: ₹${targetProduct.price.toLocaleString('en-IN')}).`;

        result = {
          reply: sizeReply,
          data: { actionType: 'PRODUCT_DETAILS', products: [targetProduct] },
          suggestedActions: [`Add to Cart`, '🎁 Check Offers', '📦 Delivery Details'],
        };
      } else {
        const priceReply =
          lang === 'hindi'
            ? `**${targetProduct.name}** की वर्तमान कीमत **₹${targetProduct.price.toLocaleString('en-IN')}** है${
                targetProduct.compareAtPrice > targetProduct.price
                  ? ` (मूल कीमत ₹${targetProduct.compareAtPrice.toLocaleString('en-IN')}, ${targetProduct.discount}% छूट)`
                  : ''
              }।`
            : lang === 'hinglish'
            ? `**${targetProduct.name}** ka current verified price **₹${targetProduct.price.toLocaleString('en-IN')}** hai${
                targetProduct.compareAtPrice > targetProduct.price
                  ? ` (MRP ₹${targetProduct.compareAtPrice.toLocaleString('en-IN')}, ${targetProduct.discount}% OFF)`
                  : ''
              }.`
            : `**${targetProduct.name}** is priced at **₹${targetProduct.price.toLocaleString('en-IN')}**${
                targetProduct.compareAtPrice > targetProduct.price
                  ? ` (Original MRP ₹${targetProduct.compareAtPrice.toLocaleString('en-IN')}, ${targetProduct.discount}% OFF)`
                  : ''
              }.`;

        result = {
          reply: priceReply,
          data: { actionType: 'PRODUCT_DETAILS', products: [targetProduct] },
          suggestedActions: [`Add to Cart`, '🎁 Check Offers', '📦 Check Delivery'],
        };
      }
    } else {
      // No product in immediate context, search by any product name words in query
      const cleanName = msg
        .replace(/is|ye|yeh|dress|saree|ka|ki|ke|price|kya|hai|kitne|kitna|what|the|of|how|much/gi, '')
        .trim();

      if (cleanName.length > 2) {
        const found = await tools.searchProducts({ query: cleanName, limit: 1 });
        if (found.length > 0) {
          const p = found[0];
          result = {
            reply:
              lang === 'hinglish'
                ? `**${p.name}** ka verified price **₹${p.price.toLocaleString('en-IN')}** hai.`
                : `**${p.name}** is available for **₹${p.price.toLocaleString('en-IN')}**.`,
            data: { actionType: 'PRODUCT_DETAILS', products: [p] },
            suggestedActions: [`Add to Cart`, '🎁 Check Offers'],
          };
        }
      }

      if (!result) {
        result = {
          reply:
            lang === 'hindi'
              ? `आप किस प्रोडक्ट की कीमत या साइज़ जानना चाहते हैं? कृपया प्रोडक्ट का नाम बताएं या कैटलॉग ब्राउज़ करें।`
              : lang === 'hinglish'
              ? `Aap kis product ka price ya detail jaanna chahte hain? Please uska naam batayein.`
              : `Which product would you like to check the price or details for? Please mention the product name.`,
          data: { actionType: 'INFO' },
          suggestedActions: ['🛍️ Browse Catalog', '🎁 View Offers'],
        };
      }
    }
  }

  // =========================================================================
  // 8. TRENDING & BESTSELLERS (Explicit intent only)
  // E.g. "What's trending?", "Abhi kya trend mein hai?", "Trending dresses dikhao", "Which sarees are popular right now?"
  // =========================================================================
  else if (
    lower.includes("what's trending") ||
    lower.includes('what is trending') ||
    lower.includes('abhi kya trend mein hai') ||
    lower.includes('kya trending hai') ||
    lower.includes('trending dresses') ||
    lower.includes('trending sarees') ||
    lower.includes('popular sarees') ||
    lower.includes('popular saree') ||
    lower.includes('popular dresses') ||
    lower.includes('which sarees are popular') ||
    lower.includes('bestseller') ||
    lower.includes('bestsellers') ||
    lower.includes('top selling') ||
    lower === 'trending'
  ) {
    let trendingCategory = undefined;
    let trendingCategorySlug = undefined;

    if (lower.includes('saree') || lower.includes('sari')) {
      trendingCategorySlug = 'women-wear';
      trendingCategory = 'saree';
    } else if (lower.includes('dress') || lower.includes('western')) {
      trendingCategorySlug = 'women-wear';
      trendingCategory = 'dress';
    } else if (lower.includes('jewel')) {
      trendingCategorySlug = 'jewellery';
    } else if (lower.includes('shoe') || lower.includes('footwear')) {
      trendingCategorySlug = 'shoes';
    }

    const trendingProducts = await tools.getTrendingProducts({
      category: trendingCategory,
      categorySlug: trendingCategorySlug,
      limit: 6,
    });

    result = {
      reply:
        lang === 'hindi'
          ? `✨ **VEXIVO पर अभी ट्रेंडिंग और लोकप्रिय कलेक्शंस**:

यहाँ हमारे रियल कैटलॉग से ग्राहकों द्वारा सबसे अधिक पसंद किए गए टॉप-रेटेड प्रोडक्ट्स हैं:`
          : lang === 'hinglish'
          ? `✨ **Trending & Bestsellers at VEXIVO**:

Ye rahe hamare verified catalog se currently sabse popular aur top-rated pieces with ready dispatch:`
          : `✨ **Trending & Bestselling at VEXIVO**:

Here are the most popular, top-rated pieces from our verified catalog right now:`,
      data: { actionType: 'PRODUCT_GRID', products: trendingProducts },
      suggestedActions: [
        '🛍️ Sarees under ₹2000',
        '👗 Party Dresses',
        '🎁 View Offers & Coupons',
        '📦 Track My Order',
      ],
    };
  }

  // =========================================================================
  // 9. CART & WISHLIST ACTIONS VIA NATURAL LANGUAGE
  // =========================================================================
  else if (
    lower.includes('cart mein add') ||
    lower.includes('cart me add') ||
    lower.includes('cart me daal') ||
    lower.includes('cart mein daal') ||
    lower.includes('add to cart') ||
    lower.includes('add this to cart') ||
    lower.includes('isko cart mein add') ||
    lower.includes('bag me add') ||
    lower.includes('bag mein add')
  ) {
    const ordinal = extractOrdinalIndex(lower);
    let targetProduct = null;

    if (ordinal !== null && lastShownProducts[ordinal]) {
      targetProduct = lastShownProducts[ordinal];
    } else if (lastShownProducts.length === 1) {
      targetProduct = lastShownProducts[0];
    } else {
      const cleanQ = msg
        .replace(/add to cart|cart mein add karo|cart me add karo|add this|cart me daal do|bag mein daalo|isko cart mein add kar do/gi, '')
        .trim();
      if (cleanQ) {
        const searchResults = await tools.searchProducts({ query: cleanQ, limit: 1 });
        if (searchResults.length > 0) targetProduct = searchResults[0];
      }
    }

    if (targetProduct) {
      if (user) {
        try {
          await tools.addProductToCart(user._id, targetProduct._id || targetProduct.id);
          result = {
            reply:
              lang === 'hindi'
                ? `हो गया! ❤️ **${targetProduct.name}** आपके शॉपिंग बैग में जोड़ दिया गया है।`
                : lang === 'hinglish'
                ? `Done! ❤️ **${targetProduct.name}** aapke cart mein add ho gaya hai.`
                : `Done! ❤️ **${targetProduct.name}** has been added to your shopping bag.`,
            data: { actionType: 'CART_ACTION', action: 'added', products: [targetProduct] },
            suggestedActions: ['🛍️ View My Cart', '🎁 View Coupons', '📦 Track My Order'],
          };
        } catch (err) {
          result = {
            reply: `I found **${targetProduct.name}** (₹${targetProduct.price.toLocaleString('en-IN')}). You can add it directly below:`,
            data: { actionType: 'CART_PROMPT', products: [targetProduct] },
            suggestedActions: [`Add to Cart`, 'View Details'],
          };
        }
      } else {
        result = {
          reply: `I found **${targetProduct.name}** (₹${targetProduct.price.toLocaleString('en-IN')}). Tap below to add to bag:`,
          data: { actionType: 'CART_PROMPT', products: [targetProduct] },
          suggestedActions: [`Add to Cart`, 'View Details'],
        };
      }
    }
  }

  // =========================================================================
  // 10. PRODUCT COMPARISON
  // =========================================================================
  else if (
    lower.includes('compare') ||
    lower.includes('dono mein') ||
    lower.includes('which one is better') ||
    lower.includes('which one is cheaper') ||
    lower.includes('kaunsa acha hai') ||
    lower.includes('kaunsa best hai')
  ) {
    if (lastShownProducts.length >= 2) {
      const p1 = lastShownProducts[0];
      const p2 = lastShownProducts[1];
      const cheaper = p1.price <= p2.price ? p1 : p2;
      const higherRated = (p1.rating || 0) >= (p2.rating || 0) ? p1 : p2;

      result = {
        reply: `📊 **Product Comparison**:

1. **${p1.name}**: ₹${p1.price.toLocaleString('en-IN')} (⭐ ${p1.rating || 4.8}/5, ${p1.discount}% OFF)
2. **${p2.name}**: ₹${p2.price.toLocaleString('en-IN')} (⭐ ${p2.rating || 4.8}/5, ${p2.discount}% OFF)

💡 **Verdict**:
• **Best Budget Value**: **${cheaper.name}** (₹${cheaper.price.toLocaleString('en-IN')})
• **Customer Rating Winner**: **${higherRated.name}** (⭐ ${higherRated.rating}/5)`,
        data: { actionType: 'PRODUCT_COMPARISON', products: [p1, p2] },
        suggestedActions: [`Add ${p1.name.slice(0, 15)} to Cart`, `Add ${p2.name.slice(0, 15)} to Cart`, '🎁 View Coupons'],
      };
    }
  }

  // =========================================================================
  // 11. ORDER TRACKING & LIVE STATUS ("Mera order kaha hai?", "Where is my order?")
  // =========================================================================
  else if (
    lower.includes('where is my order') ||
    lower.includes('track my order') ||
    lower.includes('track order') ||
    lower.includes('order status') ||
    lower.includes('mera order') ||
    lower.includes('order kaha hai') ||
    lower.includes('order kab ayega') ||
    lower.includes('order kab aayega') ||
    lower.includes('meri saree kab aayegi') ||
    lower.includes('meri saree kab ayegi') ||
    lower.includes('show my orders') ||
    lower.includes('delivery status') ||
    msg.match(/VEX-[A-Z0-9-]+/i)
  ) {
    const orderNumberMatch = msg.match(/VEX-[A-Z0-9-]+/i);

    if (orderNumberMatch) {
      const matchedNumber = orderNumberMatch[0].toUpperCase();
      const orderDetails = await tools.getOrder(matchedNumber, user?._id);

      if (orderDetails) {
        result = {
          reply:
            lang === 'hindi'
              ? `ऑर्डर **#${orderDetails.orderNumber}** का लाइव स्टेटस:

• **स्थिति**: **${orderDetails.orderStatus.toUpperCase()}**
• **आइटम्स**: ${orderDetails.items.map((i) => i.name).join(', ')}
• **कुल राशि**: ₹${orderDetails.total.toLocaleString('en-IN')} (${orderDetails.paymentStatus.toUpperCase()})
• **गंतव्य**: ${orderDetails.shippingAddress?.city || 'India'}`
              : lang === 'hinglish'
              ? `Order **#${orderDetails.orderNumber}** ki live tracking details:

• **Live Status**: **${orderDetails.orderStatus.toUpperCase()}**
• **Items**: ${orderDetails.items.map((i) => i.name).join(', ')}
• **Total Amount**: ₹${orderDetails.total.toLocaleString('en-IN')} (${orderDetails.paymentStatus.toUpperCase()})
• **Destination**: ${orderDetails.shippingAddress?.city || 'India'}`
              : `Here are the live tracking details for Order **#${orderDetails.orderNumber}**:

• **Current Status**: **${orderDetails.orderStatus.toUpperCase()}**
• **Items (${orderDetails.items.length})**: ${orderDetails.items.map((i) => i.name).join(', ')}
• **Total Amount**: ₹${orderDetails.total.toLocaleString('en-IN')} (${orderDetails.paymentStatus.toUpperCase()})
• **Delivery Destination**: ${orderDetails.shippingAddress?.city || 'India'}, ${orderDetails.shippingAddress?.postalCode || ''}`,
          data: { actionType: 'ORDER_STATUS', orders: [orderDetails] },
          suggestedActions: ['📦 Track Live Shipment', '↩️ Return / Exchange', '🛍️ Continue Shopping'],
        };
      } else {
        result = {
          reply:
            lang === 'hindi'
              ? `मुझे आपके खाते में ऑर्डर **#${matchedNumber}** नहीं मिला। कृपया नंबर जांचें।`
              : `I couldn't locate Order **#${matchedNumber}** in your account. Please verify the order number.`,
          data: { actionType: 'INFO' },
          suggestedActions: ['📦 Show My Orders', '🛍️ Browse Catalog'],
        };
      }
    } else if (!user) {
      result = {
        reply:
          lang === 'hindi'
            ? `अपने ऑर्डर ट्रैक करने के लिए, कृपया **साइन इन करें** या अपना ऑर्डर नंबर (जैसे \`VEX-1024\`) दर्ज करें।`
            : lang === 'hinglish'
            ? `Order track karne ke liye please **VEXIVO account mein login karein** ya apna Order ID provide karein.`
            : `To track your orders, please **sign in to your VEXIVO account** or type your Order ID (e.g. \`VEX-1024\`).`,
        data: { actionType: 'AUTH_REQUIRED' },
        suggestedActions: ['Login to Account', '🛍️ Browse Products', '🎁 View Offers'],
      };
    } else {
      const orders = await tools.getUserOrders(user._id);
      if (orders.length === 0) {
        result = {
          reply:
            lang === 'hindi'
              ? `आपके खाते में अभी कोई ऑर्डर मौजूद नहीं है।`
              : lang === 'hinglish'
              ? `Aapke account mein abhi koi placed order nahi mila.`
              : `You don't have any placed orders in your account right now.`,
          data: { actionType: 'INFO' },
          suggestedActions: ['🛍️ Browse Sarees', '👗 Find a dress', '🎁 View Offers'],
        };
      } else {
        const latestOrder = orders[0];
        result = {
          reply:
            lang === 'hindi'
              ? `आपके हालिया ऑर्डर **#${latestOrder.orderNumber}** का लाइव स्टेटस:

• **स्थिति**: **${latestOrder.orderStatus.toUpperCase()}**
• **कुल राशि**: ₹${latestOrder.total.toLocaleString('en-IN')}
• **आइटम**: ${latestOrder.items.map((it) => it.name).join(', ')}
• **डिलीवरी पता**: ${latestOrder.shippingAddress?.city || 'India'}`
              : lang === 'hinglish'
              ? `Aapke latest Order **#${latestOrder.orderNumber}** ka live update:

• **Status**: **${latestOrder.orderStatus.toUpperCase()}**
• **Total**: ₹${latestOrder.total.toLocaleString('en-IN')} (${latestOrder.paymentStatus.toUpperCase()})
• **Items**: ${latestOrder.items.map((it) => it.name).join(', ')}
• **City**: ${latestOrder.shippingAddress?.city || 'India'}`
              : `Here is the live update for your latest Order **#${latestOrder.orderNumber}**:

• **Live Status**: **${latestOrder.orderStatus.toUpperCase()}**
• **Order Total**: ₹${latestOrder.total.toLocaleString('en-IN')} (${latestOrder.paymentStatus.toUpperCase()})
• **Items**: ${latestOrder.items.map((it) => it.name).join(', ')}
• **Destination**: ${latestOrder.shippingAddress?.city || 'India'}`,
          data: { actionType: 'ORDER_STATUS', orders: orders.slice(0, 3) },
          suggestedActions: ['📦 View All Orders', '↩️ Return / Refund Help', '🛍️ Continue Shopping'],
        };
      }
    }
  }

  // =========================================================================
  // 12. RETURN, EXCHANGE & REFUND INTENT ("Return kaise karu?", "Refund kab milega?")
  // =========================================================================
  else if (
    lower.includes('return kaise karu') ||
    lower.includes('return kaise kare') ||
    lower.includes('return karna hai') ||
    lower.includes('wapas kaise karu') ||
    lower.includes('return') ||
    lower.includes('refund') ||
    lower.includes('exchange') ||
    lower.includes('damaged') ||
    lower.includes('wrong product') ||
    lower.includes('wapas')
  ) {
    const returnPolicy = await tools.getReturnPolicy();
    const refundPolicy = await tools.getRefundPolicy();

    const isRefundQuery =
      lower.includes('refund status') ||
      lower.includes('refund kab') ||
      lower.includes('when will i get refund') ||
      lower.includes('refund timeline') ||
      lower.includes('paise kab milenge');

    if (isRefundQuery) {
      result = {
        reply:
          lang === 'hindi'
            ? `💳 **VEXIVO रिफंड समयसीमा और गारंटी**:

• **UPI भुगतान (GPay, PhonePe)**: पिकअप सत्यापन के **24 घंटे** के भीतर रिफंड।
• **डेबिट / क्रेडिट कार्ड और नेट बैंकिंग**: आपके मूल बैंक खाते में **3 से 5 कार्य दिवसों** में।
• **कैश ऑन डिलीवरी (COD)**: पिकअप के **24 घंटे** के भीतर आपके बैंक खाते या UPI में सीधे ट्रांसफर।`
            : lang === 'hinglish'
            ? `💳 **VEXIVO Refund Timelines & Guarantee**:

• **UPI Orders (GPay, PhonePe, Paytm)**: Pickup verification ke **24 hours** ke andar instant transfer.
• **Debit / Credit Cards & Net Banking**: **3 se 5 business days** mein source bank account mein.
• **Cash on Delivery (COD) Orders**: Pickup verification ke **24 hours** ke andar aapke UPI ya Bank account mein direct credit.`
            : `💳 **VEXIVO Refund Timelines & Status Guarantee**:

• **UPI Payments (GPay, PhonePe, Paytm)**: Refund credited within **24 hours** after pickup verification.
• **Credit / Debit Cards & Net Banking**: Credited to your original account in **3 to 5 business days**.
• **Cash on Delivery (COD) Orders**: Transferred directly to your verified UPI ID or Bank Account via NEFT within **24 hours** of reverse pickup.`,
        data: { actionType: 'REFUND_POLICY', policy: refundPolicy },
        suggestedActions: ['📦 Track My Order', '↩️ Return My Order', '🛍️ Browse Products'],
      };
    } else if (
      user &&
      (lower.includes('mera') ||
        lower.includes('my order') ||
        lower.includes('i want to return') ||
        lower.includes('return this') ||
        lower.includes('exchange this'))
    ) {
      const orders = await tools.getUserOrders(user._id);
      const deliveredOrders = orders.filter((o) => o.orderStatus === 'delivered');

      if (deliveredOrders.length > 0) {
        const order = deliveredOrders[0];
        result = {
          reply:
            lang === 'hindi'
              ? `**VEXIVO 30-दिवसीय निःशुल्क रिटर्न व एक्सचेंज**:

मुझे आपका डिलीवर हुआ ऑर्डर **#${order.orderNumber}** मिला। आप नीचे 1-क्लिक में **100% पूरा रिफंड** या **मुफ्त साइज/कलर एक्सचेंज** का अनुरोध कर सकते हैं। बिना किसी अतिरिक्त शुल्क के डोरस्टेप पिकअप होगा!`
              : lang === 'hinglish'
              ? `**VEXIVO 30-Day Hassle-Free Returns & Free Exchanges**:

Aapka delivered order **#${order.orderNumber}** mil gaya hai. Aap 1-tap mein **100% Full Refund** ya **Free Size / Color Exchange** schedule kar sakte hain. Doorstep pickup automatic hoga!`
              : `**VEXIVO 30-Day Hassle-Free Returns & Free Exchanges**:

I found your delivered order **#${order.orderNumber}** (${order.items.map((i) => i.name).join(', ')}). You can initiate a return for a **100% full refund** or a **free size/color exchange** directly below with zero doorstep pickup fees!`,
          data: {
            actionType: 'RETURN_FLOW',
            returnOrder: order,
            orders: [order],
            policy: returnPolicy,
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

    if (!result) {
      result = {
        reply:
          lang === 'hindi'
            ? `**${returnPolicy.title}**:

• **30-दिन की आसान वापसी**: मूल टैग सहित बिना पहने उत्पाद।
• **मुफ्त डोरस्टेप पिकअप**: 24-48 घंटों के भीतर 28,000+ पिन कोड्स पर।
• **100% पूर्ण रिफंड**: सीधे आपके मूल खाते या UPI पर।
• **मुफ्त साइज/कलर एक्सचेंज**: बिना किसी अतिरिक्त शिपिंग चार्ज के।`
            : lang === 'hinglish'
            ? `**${returnPolicy.title}**:

• **30-Day Easy Returns**: Unworn items with original tags intact.
• **Free Doorstep Pickup**: 24–48 hours ke andar pan-India.
• **100% Full Refund**: Direct UPI / Bank account mein instant credit.
• **Free Exchanges**: Size ya color change ke liye zero delivery fee.`
            : `**${returnPolicy.title}**:

${returnPolicy.content}

• **30-Day Window**: Unworn items with original tags intact.
• **Free Doorstep Pickup**: Scheduled in 24–48 hours across 28,000+ PIN codes.
• **100% Full Refund**: Credited directly to your original source / UPI.
• **Free Exchanges**: Zero shipping charges for size or color replacements.`,
        data: { actionType: 'RETURN_POLICY', policy: returnPolicy },
        suggestedActions: ['📦 Track My Order', '💳 Payment Help', '🛍️ Browse Products'],
      };
    }
  }

  // =========================================================================
  // 13. ORDER CANCELLATION INTENT
  // =========================================================================
  else if (
    lower.includes('cancel my order') ||
    lower.includes('cancel order') ||
    lower.includes('order cancel') ||
    lower.includes('cancellation') ||
    lower.includes('order cancel karna hai') ||
    lower.includes('cancel karna hai') ||
    lower.includes('cancel this order')
  ) {
    if (!user) {
      result = {
        reply:
          lang === 'hindi'
            ? `ऑर्डर सुरक्षित रूप से रद्द करने के लिए, कृपया **अपने VEXIVO खाते में साइन इन करें** ताकि मैं आपके ऑर्डर देख सकूँ।`
            : lang === 'hinglish'
            ? `Order cancel karne ke liye, please **VEXIVO account mein login karein** taaki main aapke active orders fetch kar sakoon.`
            : `To cancel an order securely, please **sign in to your VEXIVO account** so I can retrieve your active orders.`,
        data: { actionType: 'AUTH_REQUIRED' },
        suggestedActions: ['Login to Account', '🛍️ Browse Products', '↩️ Return Policy'],
      };
    } else {
      const orders = await tools.getUserOrders(user._id);
      const cancellable = orders.filter((o) =>
        ['pending', 'confirmed', 'processing'].includes(o.orderStatus)
      );

      if (cancellable.length === 0) {
        if (orders.length === 0) {
          result = {
            reply:
              lang === 'hindi'
                ? `आपके खाते में अभी कोई ऑर्डर मौजूद नहीं है।`
                : lang === 'hinglish'
                ? `Aapke account mein abhi koi placed order nahi hai.`
                : `You don't have any placed orders in your account right now.`,
            data: { actionType: 'INFO' },
            suggestedActions: ['🛍️ Start Shopping', '🎁 View Offers'],
          };
        } else {
          const recent = orders[0];
          result = {
            reply:
              lang === 'hindi'
                ? `आपका ऑर्डर **#${recent.orderNumber}** वर्तमान में **${recent.orderStatus.toUpperCase()}** स्थिति में है। ट्रांज़िट/डिलीवर हो चुके ऑर्डर रास्ते में रद्द नहीं किए जा सकते, परंतु डिलीवरी पर आप **30-दिन का मुफ्त रिटर्न / एक्सचेंज** ले सकते हैं!`
                : lang === 'hinglish'
                ? `Aapka order **#${recent.orderNumber}** abhi **${recent.orderStatus.toUpperCase()}** status par hai. Shipped orders raste mein cancel nahi ho sakte, lekin delivery ke baad aap **30-Day Free Doorstep Return / Exchange** kar sakte hain!`
                : `Your recent order **#${recent.orderNumber}** is currently marked as **${recent.orderStatus.toUpperCase()}**. Orders that are already shipped cannot be cancelled mid-transit, but you can initiate a **Free 30-Day Doorstep Return / Exchange** once received!`,
            data: { actionType: 'ORDERS', orders: [recent] },
            suggestedActions: ['↩️ Return / Exchange', '📦 Track Order', '🛍️ Browse Products'],
          };
        }
      } else {
        const orderToCancel = cancellable[0];
        result = {
          reply:
            lang === 'hindi'
              ? `मुझे सक्रिय ऑर्डर **#${orderToCancel.orderNumber}** मिला (कुल राशि: ₹${orderToCancel.total.toLocaleString('en-IN')})।\n\nक्या आप इसे रद्द करके पूरा रिफंड चाहते हैं? कृपया नीचे पुष्टि करें:`
              : lang === 'hinglish'
              ? `Mujhe active Order **#${orderToCancel.orderNumber}** mila (Total: ₹${orderToCancel.total.toLocaleString('en-IN')}).\n\nKya aap ise cancel karke full refund initiate karna chahte hain? Confirm karein:`
              : `I found active Order **#${orderToCancel.orderNumber}** totaling **₹${orderToCancel.total.toLocaleString('en-IN')}**.\n\nWould you like to cancel this order and process a full refund? Please confirm below:`,
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
    }
  }

  // =========================================================================
  // 14. PAYMENT ISSUES & FAILED TRANSACTIONS
  // =========================================================================
  else if (
    lower.includes('payment fail') ||
    lower.includes('payment failed') ||
    lower.includes('payment issue') ||
    lower.includes('payment problem') ||
    lower.includes('mera payment fail') ||
    lower.includes('paise kat gaye') ||
    lower.includes('money deducted') ||
    lower.includes('transaction fail') ||
    lower.includes('amount deducted') ||
    lower.includes('payment nahi ho raha')
  ) {
    const paymentPolicy = await tools.getPaymentPolicy();
    result = {
      reply:
        lang === 'hindi'
          ? `💳 **VEXIVO पेमेंट सपोर्ट और असफल ट्रांजेक्शन समाधान**:

यदि चेकआउट के दौरान आपके खाते/UPI से पैसे कट गए हैं परंतु ऑर्डर कन्फर्मेशन नहीं मिला, तो चिंता न करें:

1. **ऑटो-रिवर्सल गारंटी**: बैंकिंग गेटवे द्वारा कटी हुई राशि **24 से 48 घंटे** के भीतर स्वतः आपके बैंक/UPI खाते में वापस ट्रांसफर कर दी जाती है।
2. **ऑर्डर पुनः प्रयास**: आप सुरक्षित रूप से UPI (GPay/PhonePe), कार्ड या **Cash on Delivery (COD)** चुनकर दोबारा ऑर्डर कर सकते हैं।
3. **ग्राहक सहायता**: यदि 48 घंटों में रिफंड न मिले, तो अपने बैंक UTR / Reference नंबर के साथ हमें care@vexivo.com पर संपर्क करें।`
          : lang === 'hinglish'
          ? `💳 **VEXIVO Payment Care & Failed Transaction Support**:

Agar checkout ke time aapke bank ya UPI se paise kat gaye hain lekin order confirm nahi hua, toh bilkul tension na lein:

1. **Auto-Reversal Guarantee**: Banking systems deducted amount ko **24 se 48 hours** ke andar aapke original source account / UPI ID mein automatically wapas refund kar dete hain.
2. **Retry Options**: Aap bina kisi issue ke dubara **UPI**, **Cards** ya **Cash on Delivery (COD)** select karke order place kar sakte hain.
3. **Assistance**: Bank reference / UTR number ke saath aap humein care@vexivo.com par share kar sakte hain for instant resolution.`
          : `💳 **VEXIVO Payment Care & Failed Transaction Support**:

If money was deducted from your account during checkout but you didn't receive an order confirmation:

1. **Automated Reversal Guarantee**: The banking gateway automatically reverses the debited amount back to your source account / UPI within **24 to 48 hours**.
2. **Retry Options**: You can safely place your order again using UPI, Cards, Net Banking, or choose **Cash on Delivery (COD)**.
3. **Direct Escalation**: If the amount is not reversed within 48 hours, share your Bank UTR / Reference Number with care@vexivo.com for immediate tracking.`,
      data: { actionType: 'PAYMENT_SUPPORT', policy: paymentPolicy },
      suggestedActions: [
        '📦 Check My Orders',
        '🛍️ Retry Shopping / Checkout',
        '🎁 View Offers & Coupons',
        '↩️ Return & Refund Policy',
      ],
    };
  }

  // =========================================================================
  // 15. SHIPPING, DELIVERY TIMELINES & CASH ON DELIVERY (COD)
  // =========================================================================
  else if (
    lower.includes('shipping') ||
    lower.includes('delivery time') ||
    lower.includes('kitne din') ||
    lower.includes('delivery kab') ||
    lower.includes('cod') ||
    lower.includes('cash on delivery')
  ) {
    if (lower.includes('cod') || lower.includes('cash on delivery')) {
      result = {
        reply:
          lang === 'hindi'
            ? `💵 **कैश ऑन डिलीवरी (COD) सुविधा**:

हाँ! VEXIVO पूरे भारत में 19,000+ पिन कोड्स पर ₹10,000 तक के ऑर्डर्स के लिए COD सुविधा प्रदान करता है, वह भी बिना किसी अतिरिक्त शुल्क के।`
            : lang === 'hinglish'
            ? `💵 **Cash on Delivery (COD) Policy**:

Haan! VEXIVO par 19,000+ pin codes par ₹10,000 tak ke orders ke liye COD available hai with zero extra hidden charges.`
            : `💵 **Cash on Delivery (COD) Policy**:\n\nYes! Cash on Delivery (COD) is available across 19,000+ PIN codes in India for orders up to ₹10,000 with zero additional convenience charges.`,
        data: { actionType: 'INFO' },
        suggestedActions: ['🎁 View Coupons', '🛍️ Browse Catalog', '📦 Track My Order'],
      };
    } else {
      const shipPolicy = await tools.getShippingPolicy();
      result = {
        reply:
          lang === 'hindi'
            ? `📦 **डिलीवरी व शिपिंग जानकारी**:

• **मुफ्त शिपिंग**: ₹999 से अधिक के सभी ऑर्डर्स पर।
• **डिलीवरी समय**: मुख्य शहरों में 2-4 दिन और पूरे भारत में 3-6 दिन।
• **लाइव ट्रैकिंग**: सभी ऑर्डर्स के साथ एक्सप्रेस कूरियर SMS व WhatsApp लाइव ट्रैकिंग लिंक दी जाती है।`
            : lang === 'hinglish'
            ? `📦 **Shipping & Delivery Timelines**:

• **Free Delivery**: ₹999 se upar ke sabhi orders par completely FREE.
• **Delivery Time**: Metros mein 2–4 business days aur baki pan-India mein 3–6 business days.
• **Live Tracking**: BlueDart/Delhivery real-time SMS tracking ke saath express dispatch.`
            : `**${shipPolicy.title}**\n\n${shipPolicy.content}`,
        data: { actionType: 'INFO' },
        suggestedActions: ['📦 Track My Order', '🛍️ Browse Sarees', '👗 Browse Dresses'],
      };
    }
  }

  // =========================================================================
  // 16. OFFERS & COUPONS
  // =========================================================================
  else if (
    lower.includes('offer') ||
    lower.includes('deal') ||
    lower.includes('coupon') ||
    lower.includes('discount') ||
    lower.includes('promo') ||
    lower.includes('sale')
  ) {
    const isSareeSpecific = lower.includes('saree') || lower.includes('ethnic');
    const offers = await tools.getOffers(isSareeSpecific ? 'saree-deals' : 'all');
    const coupons = await tools.getCoupons();

    result = {
      reply:
        lang === 'hindi'
          ? `🎁 **सक्रिय डिस्काउंट कूपन और विशेष ऑफर्स**:

नीचे दिए गए कूपन कोड कॉपी करें और चेकआउट पर तुरंत छूट पाएं:`
          : lang === 'hinglish'
          ? `🎁 **Active Discount Coupons & Offers**:

Checkout par instant bachat ke liye ye verified promo codes use karein:`
          : `🎁 **Verified Active Offers & Discount Coupons**:

Apply these promo codes during checkout for instant savings:`,
      data: {
        actionType: 'OFFERS_AND_COUPONS',
        offers: offers.slice(0, 4),
        coupons: coupons.slice(0, 3),
      },
      suggestedActions: [
        '🛍️ Sarees under ₹2000',
        '👗 Browse Dresses',
        '💎 View Jewellery',
        '📦 Track My Order',
      ],
    };
  }

  // =========================================================================
  // 17. PRODUCT SEARCH & CATALOG QUERY (ONLY WHEN USER ACTUALLY REQUESTS PRODUCTS)
  // E.g. "Show me black dresses", "2000 ke under saree dikhao", "Shaadi ke liye 3000 ke under saree chahiye", "Red saree dikhao"
  // =========================================================================
  if (!result) {
    const hasSearchIntent =
      lower.includes('show') ||
      lower.includes('dikhao') ||
      lower.includes('dikhayein') ||
      lower.includes('chahiye') ||
      lower.includes('find') ||
      lower.includes('search') ||
      lower.includes('looking for') ||
      lower.includes('suggest') ||
      lower.includes('recommend') ||
      priceFilter.maxPrice ||
      priceFilter.minPrice ||
      detectedColor ||
      detectedSize ||
      lower.includes('saree') ||
      lower.includes('dress') ||
      lower.includes('jewellery') ||
      lower.includes('shoes') ||
      lower.includes('footwear') ||
      lower.includes('shirt') ||
      lower.includes('banarasi') ||
      lower.includes('gown');

    // Also check if user is refining past multi-turn context (e.g. past was "saree" and user says "3000 budget hai" or "red wala")
    const isContextRefinement =
      (priceFilter.maxPrice || detectedColor || detectedSize || lower.includes('shaadi') || lower.includes('wedding')) &&
      previousCategory;

    if (hasSearchIntent || isContextRefinement) {
      let searchQuery = '';
      let categoryFilter = undefined;
      let categorySlug = previousCategory || undefined;
      let genderFilter = undefined;
      let occasionFilter = previousOccasion || undefined;
      const effectiveMaxPrice = priceFilter.maxPrice || previousPriceFilter?.maxPrice;
      const effectiveMinPrice = priceFilter.minPrice || previousPriceFilter?.minPrice;

      // Detect occasion
      if (lower.includes('wedding') || lower.includes('shaadi') || lower.includes('bridal') || lower.includes('dulhan')) {
        occasionFilter = 'wedding';
      } else if (lower.includes('party') || lower.includes('cocktail') || lower.includes('evening')) {
        occasionFilter = 'party';
      } else if (lower.includes('festive') || lower.includes('diwali') || lower.includes('puja') || lower.includes('eid')) {
        occasionFilter = 'festive';
      } else if (lower.includes('casual') || lower.includes('daily wear') || lower.includes('office') || lower.includes('formal')) {
        occasionFilter = 'casual';
      }

      // Detect category
      if (
        lower.includes('saree') ||
        lower.includes('sari') ||
        lower.includes('banarasi') ||
        lower.includes('kanjivaram') ||
        lower.includes('chanderi') ||
        lower.includes('silk')
      ) {
        searchQuery = 'saree';
        categorySlug = 'women-wear';
        genderFilter = 'women';
        if (detectedColor) searchQuery = `${detectedColor} saree`;
        if (lower.includes('banarasi')) searchQuery = 'banarasi';
        if (lower.includes('cotton')) searchQuery = 'cotton saree';
        if (lower.includes('georgette')) searchQuery = 'georgette';
      } else if (
        lower.includes('dress') ||
        lower.includes('gown') ||
        lower.includes('frock') ||
        lower.includes('skirt') ||
        lower.includes('tops') ||
        lower.includes('western')
      ) {
        categorySlug = 'women-wear';
        genderFilter = 'women';
        searchQuery = 'dress';
        if (detectedColor) searchQuery = `${detectedColor} dress`;
      } else if (
        lower.includes('jewellery') ||
        lower.includes('jewelry') ||
        lower.includes('necklace') ||
        lower.includes('earring') ||
        lower.includes('choker') ||
        lower.includes('jhumka')
      ) {
        categorySlug = 'jewellery';
        searchQuery = 'jewellery';
      } else if (
        lower.includes('shoe') ||
        lower.includes('heel') ||
        lower.includes('sandals') ||
        lower.includes('footwear') ||
        lower.includes('sneaker')
      ) {
        categorySlug = 'shoes';
        genderFilter = lower.includes('men') ? 'men' : 'women';
        searchQuery = 'shoes';
      } else if (
        lower.includes('shirt') ||
        lower.includes('t-shirt') ||
        lower.includes('men wear') ||
        lower.includes('mens shirt') ||
        lower.includes("men's")
      ) {
        categorySlug = 'men-wear';
        genderFilter = 'men';
        searchQuery = 'shirt';
      } else if (detectedColor) {
        searchQuery = detectedColor;
      } else {
        searchQuery = msg
          .replace(/[?.,!]/g, '')
          .replace(/dikhao|chahiye|hai|batao|kuch|acha|best|show|me|find|looking for|under|₹|\d+|budget/gi, '')
          .trim();
      }

      const products = await tools.searchProducts({
        query: searchQuery,
        categorySlug,
        category: categoryFilter,
        gender: genderFilter,
        color: detectedColor,
        size: detectedSize,
        maxPrice: effectiveMaxPrice,
        minPrice: effectiveMinPrice,
        occasion: occasionFilter,
        limit: aiSettings.productResultLimit || 6,
      });

      if (products && products.length > 0) {
        let conversationalIntro = '';
        if (lang === 'hindi') {
          conversationalIntro = effectiveMaxPrice
            ? `बिल्कुल 😊 ₹${effectiveMaxPrice.toLocaleString('en-IN')} के बजट में आपके लिए चुनिंदा विकल्प उपलब्ध हैं:`
            : `यहाँ आपके लिए हमारे रियल कैटलॉग से चुनिंदा प्रोडक्ट्स हैं (${products.length}):`;
        } else if (lang === 'hinglish') {
          conversationalIntro = effectiveMaxPrice
            ? `Bilkul 😊 ₹${effectiveMaxPrice.toLocaleString('en-IN')} ke under matching options check karti hoon. Ye rahe aapke liye best pieces:`
            : `Bilkul 😊 Ye rahe hamare live catalog se matching verified options:`;
        } else {
          conversationalIntro = effectiveMaxPrice
            ? `Here are top-rated verified products curated within your budget of ₹${effectiveMaxPrice.toLocaleString('en-IN')}:`
            : `Here are curated matching products from our live collection:`;
        }

        result = {
          reply: conversationalIntro,
          data: { actionType: 'PRODUCT_GRID', products },
          suggestedActions: [
            '🎁 Any Offers Available?',
            '💎 Matching Jewellery',
            '📦 Track My Order',
            '🛍️ View Today Deals',
          ],
        };
      } else {
        // Record unanswered query for learning
        await tools.recordUnansweredQuestion(msg, categorySlug || 'General');

        const noMatchReply =
          lang === 'hindi'
            ? `मुझे "${msg}" के लिए हमारे लाइव कैटलॉग में कोई सटीक मैच नहीं मिला। क्या आप किसी अन्य कैटेगरी या बजट के बारे में जानना चाहते हैं?`
            : lang === 'hinglish'
            ? `Mujhe "${msg}" ke liye hamare verified catalog mein exact match nahi mila. Aap kisi doosri category ya budget ke baare mein pooch sakte hain.`
            : `I couldn't find an exact match for "${msg}" in our live catalog right now. Would you like to explore other categories or budget options?`;

        result = {
          reply: noMatchReply,
          data: { actionType: 'UNANSWERED' },
          suggestedActions: ['👗 Party Dresses', '🛍️ Sarees under ₹2000', '🎁 Today Offers', '📦 Track Order'],
        };
      }
    }
  }

  // =========================================================================
  // 18. GENERAL FALLBACK (NATURAL CONVERSATION, NO RANDOM PRODUCTS)
  // =========================================================================
  if (!result) {
    // Try Gemini LLM if configured
    const llmAnswer = await tryGeminiLLM({
      message: msg,
      history,
      user,
      contextData: { catalogSummary: 'Ethnic Sarees, Western Dresses, Footwear, Handcrafted Jewellery' },
      lang,
    });

    if (llmAnswer) {
      result = {
        reply: llmAnswer,
        data: { actionType: 'CONVERSATIONAL' },
        suggestedActions: ['🛍️ Browse Catalog', '📦 Track My Order', '🎁 View Offers'],
      };
    } else {
      const fallbackReply =
        lang === 'hindi'
          ? `बिल्कुल 😊 मैं आपकी सहायता के लिए यहाँ हूँ। आप शॉपिंग, प्रोडक्ट्स, ऑर्डर्स, रिटर्न या VEXIVO से जुड़े किसी भी सवाल के बारे में मुझसे पूछ सकते हैं।`
          : lang === 'hinglish'
          ? `Bilkul 😊 Main aapki help ke liye yahin hoon. Aap shopping, products, orders, returns, payments ya VEXIVO se related kisi bhi question ke baare mein pooch sakte hain.`
          : `I'm here to help! 😊 You can ask me about shopping, products, order status, returns, payments, or anything related to VEXIVO.`;

      result = {
        reply: fallbackReply,
        data: { actionType: 'CONVERSATIONAL' },
        suggestedActions: ['📦 Track My Order', '🛍️ Find Products', '🎁 View Offers & Coupons'],
      };
    }
  }

  // Log conversation message into DB
  try {
    await tools.logConversationMessage({
      sessionId,
      user,
      role: 'user',
      content: msg,
      intent: result?.data?.actionType || '',
    });

    await tools.logConversationMessage({
      sessionId,
      user,
      role: 'assistant',
      content: result.reply,
      intent: result?.data?.actionType || '',
      productsShown: result?.data?.products || [],
      actionType: result?.data?.actionType || '',
      actionData: result?.data || null,
      isUnanswered: result?.data?.actionType === 'UNANSWERED',
    });
  } catch (logErr) {
    console.warn('[AI Service] Log notice:', logErr.message);
  }

  return result;
};

module.exports = {
  detectLanguage,
  extractPriceFilter,
  extractSize,
  extractColor,
  extractOrdinalIndex,
  processUserMessage,
};
