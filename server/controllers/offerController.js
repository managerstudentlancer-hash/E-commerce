const Offer = require('../models/Offer');

const defaultSeedOffers = [
  // 1. Saree Deals
  {
    section: 'saree-deals',
    title: 'Pure Banarasi Silk Saree',
    subtitle: 'Woven with gold zari floral motifs & rich pallu',
    fabric: 'Katan Silk',
    category: 'Banarasi',
    originalPrice: 4999,
    discountedPrice: 2999,
    discountPercent: 40,
    validity: 'Valid till 11:59 PM today',
    badge: 'Trending Deal',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    inStock: 8,
    tags: ['Zari Work', 'Wedding Edition', 'Pure Silk'],
    active: true,
    sortOrder: 1,
  },
  {
    section: 'saree-deals',
    title: 'Heritage Kanjivaram Bridal Saree',
    subtitle: 'Handwoven temple borders in Crimson & Gold',
    fabric: 'Mulberry Silk',
    category: 'Kanjivaram',
    originalPrice: 7499,
    discountedPrice: 4499,
    discountPercent: 40,
    validity: 'Limited festive stock',
    badge: 'Bestseller',
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    inStock: 5,
    tags: ['Temple Border', 'Bridal Special', 'Heavy Zari'],
    active: true,
    sortOrder: 2,
  },
  {
    section: 'saree-deals',
    title: 'Chanderi Handloom Floral Saree',
    subtitle: 'Lightweight gossamer weave with pastel zari accents',
    fabric: 'Chanderi Silk Cotton',
    category: 'Chanderi',
    originalPrice: 3299,
    discountedPrice: 1999,
    discountPercent: 39,
    validity: 'Valid for next 2 days',
    badge: 'Staff Pick',
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    inStock: 12,
    tags: ['Handloom', 'Pastel Hues', 'Summer Weave'],
    active: true,
    sortOrder: 3,
  },
  {
    section: 'saree-deals',
    title: 'Blush Pink Embroidered Organza Saree',
    subtitle: 'Scalloped cutwork border with delicate pearl sequins',
    fabric: 'Pure Organza',
    category: 'Organza',
    originalPrice: 3999,
    discountedPrice: 2399,
    discountPercent: 40,
    validity: 'Offer ends in 18 hrs',
    badge: 'Hot Favorite',
    image: 'https://images.unsplash.com/photo-1610030469668-9655ec843f55?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    inStock: 6,
    tags: ['Cutwork', 'Party Wear', 'Organza Glam'],
    active: true,
    sortOrder: 4,
  },
  {
    section: 'saree-deals',
    title: 'Royal Tussar Silk Handpainted Kalamkari',
    subtitle: 'Traditional mythological motifs with antique gold finish',
    fabric: 'Tussar Silk',
    category: 'Tussar Kalamkari',
    originalPrice: 5999,
    discountedPrice: 3599,
    discountPercent: 40,
    validity: 'Valid till midnight',
    badge: 'Artisanal',
    image: 'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    inStock: 4,
    tags: ['Handpainted', 'Kalamkari', 'Heritage'],
    active: true,
    sortOrder: 5,
  },
  {
    section: 'saree-deals',
    title: 'Embellished Midnight Georgette Saree',
    subtitle: 'Featherlight drape with intricate thread & sequin border',
    fabric: 'Pure Georgette',
    category: 'Designer Georgette',
    originalPrice: 2899,
    discountedPrice: 1749,
    discountPercent: 40,
    validity: 'Only 3 units left',
    badge: 'Fast Selling',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80',
    link: '/category/women-wear',
    inStock: 3,
    tags: ['Ready to Wear', 'Cocktail Edit', 'Light Drape'],
    active: true,
    sortOrder: 6,
  },

  // 2. Coupons
  {
    section: 'coupons',
    code: 'SAVE100',
    title: '₹100 Instant Discount',
    subtitle: 'Flat ₹100 OFF on your cart when shopping fashion favorites',
    minimumOrder: 999,
    discountText: '₹100 OFF',
    validity: 'Valid till 31 Oct 2026',
    category: 'All Categories',
    badge: 'Popular',
    terms: [
      'Applicable on orders of ₹999 and above.',
      'Cannot be combined with select clearance items.',
      'One-time use per customer account.',
    ],
    active: true,
    sortOrder: 1,
  },
  {
    section: 'coupons',
    code: 'SAREE20',
    title: '20% Extra OFF on Sarees',
    subtitle: 'Save 20% on all handcrafted Banarasi, Silk & Handloom sarees',
    minimumOrder: 1999,
    discountText: '20% OFF',
    discountPercent: 20,
    validity: 'Valid till 28 Oct 2026',
    category: 'Sarees & Ethnic Wear',
    badge: 'Saree Special',
    terms: [
      'Valid on entire Saree and Ethnic Wear category.',
      'Maximum discount up to ₹1,500.',
      'Valid on both prepaid and cash on delivery.',
    ],
    active: true,
    sortOrder: 2,
  },
  {
    section: 'coupons',
    code: 'FESTIVE500',
    title: '₹500 Festive Grand Savings',
    subtitle: 'Flat ₹500 OFF on premium festive collections and lehengas',
    minimumOrder: 2499,
    discountText: '₹500 OFF',
    validity: 'Festive Season Special',
    category: 'Ethnic & Festive',
    badge: 'Festive Mega',
    terms: [
      'Minimum cart value of ₹2,499 required.',
      'Applicable on Ethnic Wear, Lehengas & Gowns.',
      'Enjoy free standard express shipping with this code.',
    ],
    active: true,
    sortOrder: 3,
  },
  {
    section: 'coupons',
    code: 'GLAM15',
    title: '15% OFF Beauty & Makeup',
    subtitle: 'Glow up with luxury skincare, lipsticks and bridal beauty palettes',
    minimumOrder: 799,
    discountText: '15% OFF',
    discountPercent: 15,
    validity: 'Valid till 15 Nov 2026',
    category: 'Beauty & Makeup',
    badge: 'Beauty Edit',
    terms: [
      'Applicable on all Makeup, Skincare and Parfum collections.',
      'Maximum discount ₹400.',
      'Authentic certified products guaranteed.',
    ],
    active: true,
    sortOrder: 4,
  },
  {
    section: 'coupons',
    code: 'LUXE10',
    title: '10% OFF Fine Jewellery & Shoes',
    subtitle: 'Elevate your ensemble with designer heels and Kundan jewellery',
    minimumOrder: 1499,
    discountText: '10% OFF',
    discountPercent: 10,
    validity: 'Valid all month',
    category: 'Jewellery & Shoes',
    badge: 'Accessories',
    terms: [
      'Valid on Handcrafted Footwear and Fine Jewellery.',
      'Maximum discount ₹800.',
      'Complimentary gift box packaging included.',
    ],
    active: true,
    sortOrder: 5,
  },
  {
    section: 'coupons',
    code: 'FIRSTBUY',
    title: 'Welcome 10% OFF First Order',
    subtitle: 'Special welcome treat for new members joining our fashion circle',
    minimumOrder: 499,
    discountText: '10% OFF',
    discountPercent: 10,
    validity: 'New Users Only',
    category: 'Storewide',
    badge: 'Welcome Gift',
    terms: [
      'Valid on your first ever order upon login.',
      'No cap on maximum savings.',
      'Instant activation upon checkout.',
    ],
    active: true,
    sortOrder: 6,
  },

  // 3. Exclusive Offers
  {
    section: 'exclusive-offers',
    category: 'Ethnic Wear',
    title: 'Designer Anarkalis & Lehengas',
    subtitle: 'Hand-embroidered silks with mirror-work accents for wedding soirees',
    discountText: 'Up to 45% OFF + Extra 10% on Bundles',
    image: 'https://images.unsplash.com/photo-1583391733975-00c733355208?auto=format&fit=crop&w=900&q=80',
    badge: 'Wedding Suite',
    link: '/category/women-wear',
    active: true,
    sortOrder: 1,
  },
  {
    section: 'exclusive-offers',
    category: 'Western Wear',
    title: 'Effortless Evening Gowns & Co-ords',
    subtitle: 'Sleek silhouettes, satin slips, and tailored modern luxury',
    discountText: 'Flat 35% OFF on Curated Runway Fits',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
    badge: 'Runway Edit',
    link: '/category/women-wear',
    active: true,
    sortOrder: 2,
  },
  {
    section: 'exclusive-offers',
    category: 'Luxury Makeup',
    title: 'Bridal Glow & Royal Parfum',
    subtitle: 'Long-stay pigments, hydrating velvet lip hues and French fragrances',
    discountText: 'Buy 2 Get 1 FREE on All Luxury Beauty',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=900&q=80',
    badge: 'Exclusive Glam',
    link: '/category/beauty',
    active: true,
    sortOrder: 3,
  },
  {
    section: 'exclusive-offers',
    category: 'Footwear & Jewels',
    title: 'Embroidered Juttis & Temple Jewels',
    subtitle: 'Cushioned artisan footwear and 22K gold-plated Kundan statements',
    discountText: 'Starting at ₹799 + Extra 15% OFF',
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=900&q=80',
    badge: 'Artisan Crafted',
    link: '/category/jewellery',
    active: true,
    sortOrder: 4,
  },

  // 4. Festival Offers
  {
    section: 'festival-offers',
    season: 'Festive & Wedding Gala 2026',
    title: 'The Royal Wedding Wardrobe',
    subtitle: 'Celebrate the grand Indian wedding season with opulent Kanjivarams and lehengas.',
    discountText: 'UP TO 50% OFF',
    validity: 'Limited Festive Period',
    image: 'https://images.unsplash.com/photo-1583391733975-00c733355208?auto=format&fit=crop&w=1200&q=85',
    link: '/category/women-wear',
    badge: 'Diwali & Wedding Edit',
    active: true,
    sortOrder: 1,
  },
  {
    section: 'festival-offers',
    season: 'Bridal Splendor',
    title: 'Banarasi Handloom Heritage Fest',
    subtitle: 'Direct from master weavers of Varanasi with Silk Mark certification.',
    discountText: 'FLAT ₹1,000 CASHBACK',
    validity: 'Offer ends Sunday',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=85',
    link: '/category/women-wear',
    badge: 'Silk Mark Certified',
    active: true,
    sortOrder: 2,
  },

  // 5. Limited-Time Flash Deals
  {
    section: 'flash-deals',
    title: 'Royal Magenta Silk Saree with Antique Zari',
    category: 'Sarees',
    originalPrice: 4299,
    discountedPrice: 2199,
    discountPercent: 49,
    discountText: '49% OFF',
    unitsTotal: 25,
    unitsSold: 21,
    endsInMinutes: 42,
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    badge: 'FLASH DEAL',
    active: true,
    sortOrder: 1,
  },
  {
    section: 'flash-deals',
    title: 'Handcrafted Kundan Choker & Earrings Set',
    category: 'Jewellery',
    originalPrice: 2499,
    discountedPrice: 1199,
    discountPercent: 52,
    discountText: '52% OFF',
    unitsTotal: 30,
    unitsSold: 26,
    endsInMinutes: 75,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=600&q=80',
    badge: 'LIGHTNING DEAL',
    active: true,
    sortOrder: 2,
  },
  {
    section: 'flash-deals',
    title: 'Blush Satin Drape Evening Dress',
    category: 'Western Wear',
    originalPrice: 3499,
    discountedPrice: 1899,
    discountPercent: 45,
    discountText: '45% OFF',
    unitsTotal: 20,
    unitsSold: 17,
    endsInMinutes: 110,
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80',
    badge: 'HOT RUSH',
    active: true,
    sortOrder: 3,
  },
  {
    section: 'flash-deals',
    title: 'Velvet Matte Long-Wear Lip Kit & Cheek Tint',
    category: 'Makeup',
    originalPrice: 1899,
    discountedPrice: 899,
    discountPercent: 53,
    discountText: '53% OFF',
    unitsTotal: 40,
    unitsSold: 35,
    endsInMinutes: 95,
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80',
    badge: 'DEAL OF DAY',
    active: true,
    sortOrder: 4,
  },
];

// Helper: Ensure default offers exist in DB
const autoSeedOffersIfEmpty = async () => {
  const count = await Offer.countDocuments();
  if (count === 0) {
    console.log('[Offers] Auto-seeding default offers into database...');
    await Offer.insertMany(defaultSeedOffers);
  }
};

// Public: Get all active offers (optionally filter by section)
exports.getOffers = async (req, res) => {
  try {
    await autoSeedOffersIfEmpty();

    const { section } = req.query;
    const filter = { active: true };
    if (section && section !== 'all') {
      filter.section = section;
    }

    const offers = await Offer.find(filter).sort({ sortOrder: 1, createdAt: -1 });
    res.json({ success: true, count: offers.length, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Get all offers including inactive
exports.getAllOffersAdmin = async (req, res) => {
  try {
    await autoSeedOffersIfEmpty();

    const { section } = req.query;
    const filter = {};
    if (section && section !== 'all') {
      filter.section = section;
    }

    const offers = await Offer.find(filter).sort({ section: 1, sortOrder: 1, createdAt: -1 });
    res.json({ success: true, count: offers.length, offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Create new offer
exports.createOffer = async (req, res) => {
  try {
    const offer = new Offer(req.body);
    await offer.save();
    res.status(201).json({ success: true, message: 'Offer created successfully', offer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Update existing offer
exports.updateOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.json({ success: true, message: 'Offer updated successfully', offer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Toggle active status
exports.toggleOfferStatus = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    offer.active = !offer.active;
    await offer.save();
    res.json({ success: true, message: `Offer ${offer.active ? 'activated' : 'deactivated'}`, offer });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Delete offer
exports.deleteOffer = async (req, res) => {
  try {
    const offer = await Offer.findByIdAndDelete(req.params.id);
    if (!offer) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }
    res.json({ success: true, message: 'Offer deleted successfully' });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Reset to default offers
exports.resetToDefaultOffers = async (req, res) => {
  try {
    await Offer.deleteMany({});
    await Offer.insertMany(defaultSeedOffers);
    const offers = await Offer.find().sort({ section: 1, sortOrder: 1 });
    res.json({ success: true, message: 'Offers reset to defaults successfully', offers });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.defaultSeedOffers = defaultSeedOffers;
