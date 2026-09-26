const fs = require('fs');
const path = require('path');
const { catalog, buildProducts } = require('./buildCatalog');

const products = buildProducts();

// 14 Categories matching catalog
const categoriesData = catalog.map((cat, idx) => ({
  name: cat.category,
  slug: cat.categorySlug,
  description: cat.description,
  image: cat.image,
  icon: cat.icon,
  sortOrder: idx + 1,
  featured: idx < 6,
  itemCount: 22,
}));

// Collections
const collectionsData = [
  {
    name: 'Bestsellers',
    slug: 'bestsellers',
    description: 'Our most sought-after signature pieces, celebrated for craft and durability.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 1,
  },
  {
    name: 'New Arrivals',
    slug: 'new-arrivals',
    description: 'Latest contemporary releases and fresh seasonal arrivals.',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 2,
  },
  {
    name: 'Special Offers',
    slug: 'special-offers',
    description: 'Limited seasonal promotions and exceptional reductions.',
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
    featured: true,
    sortOrder: 3,
  },
  {
    name: 'Minimalist Luxury',
    slug: 'minimalist-luxury',
    description: 'Refined essentials crafted from uncompromised raw fibres.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    featured: false,
    sortOrder: 4,
  },
];

// Banners
const bannersData = [
  {
    title: 'Autumn Winter 2026 Collection',
    subtitle: 'MODERN MINIMALIST LUXURY',
    description: 'Explore the definitive new-season edit featuring Savile Row tailoring and architectural silhouettes.',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    link: '/collection/new-arrivals',
    buttonText: 'Discover Collection',
    type: 'hero',
    active: true,
    order: 1,
  },
  {
    title: 'Italian Nappa Footwear Capsule',
    subtitle: 'HANDCRAFTED IN TUSCANY',
    description: 'Minimalist low-top trainers and Chelsea boots constructed with Goodyear-welted precision.',
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1600&q=85',
    link: '/category/shoes',
    buttonText: 'Shop Footwear',
    type: 'hero',
    active: true,
    order: 2,
  },
  {
    title: 'Curated Architectural Living',
    subtitle: 'SCULPTURAL HOME OBJECTS',
    description: 'Elevate your private sanctuary with travertine stone lighting, hand-knotted wool rugs, and minimalist furniture.',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1600&q=85',
    link: '/category/home-living',
    buttonText: 'Explore Living',
    type: 'hero',
    active: true,
    order: 3,
  },
];

// Coupons
const couponsData = [
  {
    code: 'VEX10',
    type: 'percentage',
    value: 10,
    minimumOrder: 30,
    maximumDiscount: 50,
    usageLimit: 1000,
    active: true,
  },
  {
    code: 'WELCOME20',
    type: 'percentage',
    value: 20,
    minimumOrder: 80,
    maximumDiscount: 100,
    usageLimit: 500,
    active: true,
  },
  {
    code: 'FREESHIP',
    type: 'fixed',
    value: 5,
    minimumOrder: 40,
    maximumDiscount: 5,
    usageLimit: 2000,
    active: true,
  },
  {
    code: 'AUTUMN30',
    type: 'percentage',
    value: 30,
    minimumOrder: 30,
    maximumDiscount: 500,
    usageLimit: 2000,
    active: true,
  },
];

const seedFileContent = `const mongoose = require('mongoose');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const Banner = require('../models/Banner');
const Coupon = require('../models/Coupon');
const Review = require('../models/Review');

const categoriesData = ${JSON.stringify(categoriesData, null, 2)};
const rawProducts = ${JSON.stringify(products, null, 2)};
const collectionsData = ${JSON.stringify(collectionsData, null, 2)};
const bannersData = ${JSON.stringify(bannersData, null, 2)};
const couponsData = ${JSON.stringify(couponsData, null, 2)};

const seedAll = async () => {
  try {
    console.log('[VEXIVO Seed] Purging existing database collections...');
    await Promise.all([
      User.deleteMany(),
      Category.deleteMany(),
      Product.deleteMany(),
      Collection.deleteMany(),
      Banner.deleteMany(),
      Coupon.deleteMany(),
      Review.deleteMany(),
    ]);

    console.log('[VEXIVO Seed] Collections cleared. Seeding fresh VEXIVO catalog with 308 products...');

    // 1. Seed Users
    const adminUser = await User.create({
      name: 'VEXIVO Administrator',
      email: 'admin@vexivo.com',
      passwordHash: 'AdminPass123!',
      role: 'admin',
      phone: '+919999999999',
    });

    const customerUser = await User.create({
      name: 'Arpit Customer',
      email: 'arpit123@gmail.com',
      passwordHash: 'Arpit123!',
      role: 'customer',
      phone: '+919876543210',
      addresses: [
        {
          street: '42 Regent Street',
          city: 'London',
          postalCode: 'W1B 5RL',
          country: 'United Kingdom',
          isDefault: true,
        },
      ],
    });
    console.log('[VEXIVO Seed] Seeded Admin & Customer accounts.');

    // 2. Seed Categories
    const categories = await Category.insertMany(categoriesData);
    console.log(\`[VEXIVO Seed] Seeded \${categories.length} categories.\`);

    // 3. Seed Products with seller reference
    const productsToInsert = rawProducts.map((p, idx) => ({
      ...p,
      seller: idx % 4 === 0 ? adminUser._id : customerUser._id,
    }));

    const products = await Product.insertMany(productsToInsert);
    console.log(\`[VEXIVO Seed] Seeded \${products.length} distinct multi-seller products.\`);

    // 4. Seed Collections
    await Collection.insertMany(collectionsData);
    console.log('[VEXIVO Seed] Seeded 4 collections.');

    // 5. Seed Banners
    await Banner.insertMany(bannersData);
    console.log('[VEXIVO Seed] Seeded Hero & Promotional Banners.');

    // 6. Seed Coupons
    await Coupon.insertMany(couponsData);
    console.log('[VEXIVO Seed] Seeded discount coupons (AUTUMN30, VEX10, WELCOME20, FREESHIP).');

    // 7. Seed Sample Reviews
    const sampleReviews = [
      {
        product: products[0]._id,
        user: customerUser._id,
        userName: 'Julie Mathers',
        userEmail: 'julie.m@example.com',
        rating: 5,
        title: 'Exquisite silk drape and flawless finish',
        comment: 'The French silk bias cut falls like water. Worth every penny. Exceptional craftsmanship and timeless silhouette.',
        verifiedPurchase: true,
        status: 'approved',
      },
      {
        product: products[22]._id,
        user: customerUser._id,
        userName: 'Jenny Wilson',
        userEmail: 'jenny.w@example.com',
        rating: 5,
        title: 'Authentic Savile Row tailoring standards',
        comment: 'Incredible texture, double-pleat precision, and luxurious weight. Fits impeccably.',
        verifiedPurchase: true,
        status: 'approved',
      },
      {
        product: products[44]._id,
        user: customerUser._id,
        userName: 'Julian Vance',
        userEmail: 'julian.v@live.com',
        rating: 5,
        title: 'Italian Nappa calfskin of the highest order',
        comment: 'Buttery soft straight out of the box with zero break-in period. Margom sole gives incredible grip and posture.',
        verifiedPurchase: true,
        status: 'approved',
      },
    ];

    await Review.insertMany(sampleReviews);
    console.log('[VEXIVO Seed] Seeded verified customer reviews.');

    console.log('======================================================');
    console.log('🎉 VEXIVO DATABASE SEEDING COMPLETE!');
    console.log(\`📦 Total Products Seeded: \${products.length}\`);
    console.log(\`🏷️  Categories Seeded: \${categories.length}\`);
    console.log('👤 Admin: admin@vexivo.com | AdminPass123!');
    console.log('👤 Customer: arpit123@gmail.com | Arpit123!');
    console.log('======================================================');

    if (require.main === module) {
      process.exit(0);
    }
    return true;
  } catch (error) {
    console.error('[VEXIVO Seed Error]:', error);
    if (require.main === module) {
      process.exit(1);
    }
    throw error;
  }
};

if (require.main === module) {
  // Connect to DB and run seed
  const dotenv = require('dotenv');
  dotenv.config({ path: path.join(__dirname, '../.env') });
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vexivo';
  mongoose.connect(uri)
    .then(() => seedAll())
    .catch((err) => {
      console.error('Failed to connect to database:', err);
      process.exit(1);
    });
}

module.exports = { seedAll };
`;

fs.writeFileSync(path.join(__dirname, 'seedData.js'), seedFileContent);
console.log(`[Success] Generated seedData.js with ${products.length} distinct products.`);
