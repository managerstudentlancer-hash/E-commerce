/**
 * VEXIVO Production-Safe Catalog Synchronization Script
 * 
 * Safely and idempotently synchronizes:
 * 1. Saree & Ethnic Wear catalog (22 sarees, 4 jewellery pairing accessories)
 * 2. DummyJSON product catalog across 24 standard categories
 * 3. Dynamic category collections and live item counts
 * 
 * SAFETY GUARANTEES:
 * - NEVER deletes all products (zero deleteMany calls).
 * - NEVER alters users, orders, coupons, or existing reviews.
 * - Fully idempotent: matches on stable slug / sourceProductId and updates without duplication.
 * - Works safely in both development and production environments.
 * - Masks credentials to prevent any leak of Atlas connection strings.
 */

const path = require('path');
const dotenv = require('dotenv');

// Load environment variables safely
dotenv.config({ path: path.join(__dirname, '../../.env') });
dotenv.config({ path: path.join(__dirname, '../.env') });

const connectDB = require('../config/db');
const Product = require('../models/Product');
const Category = require('../models/Category');
const { seedSarees } = require('../seed/sareeSeed');
const { importDummyProducts } = require('../services/dummyProductService');

const maskMongoUri = (uri) => {
  if (!uri) return 'in-memory / default';
  try {
    return uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@');
  } catch {
    return '***';
  }
};

const runCatalogSync = async () => {
  console.log('======================================================');
  console.log('🌿 VEXIVO SAFE CATALOG SYNCHRONIZATION');
  console.log('======================================================');

  const rawUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vexivo';
  console.log(`[Sync] Target Database: ${maskMongoUri(rawUri)}`);
  console.log(`[Sync] Mode: ${process.env.NODE_ENV || 'development'}`);

  try {
    await connectDB();

    const initialProductCount = await Product.countDocuments();
    const initialCategoryCount = await Category.countDocuments();
    console.log(`[Sync] Pre-sync catalog state: ${initialProductCount} products, ${initialCategoryCount} categories.`);

    // 1. Synchronize Handcrafted Sarees & Ethnic Catalog (Idempotent upsert)
    console.log('\n--- 1. Synchronizing Saree & Ethnic Catalog ---');
    const sareeResult = await seedSarees();
    console.log(`[Sync] Sarees Sync Result: ${sareeResult.seeded || 0} seeded, ${sareeResult.updated || 0} updated, ${sareeResult.sareeCount || 0} active.`);

    // 2. Synchronize DummyJSON Catalog (Idempotent upsert)
    console.log('\n--- 2. Synchronizing DummyJSON Products ---');
    const dummyResult = await importDummyProducts({ fetchLive: false });
    console.log(`[Sync] DummyJSON Result: ${dummyResult.imported || 0} imported, ${dummyResult.updated || 0} updated, ${dummyResult.totalProducts || 0} processed.`);

    // 3. Verify Live Catalog Metrics
    console.log('\n--- 3. Verifying Live Catalog Metrics ---');
    const activeSarees = await Product.countDocuments({
      $or: [
        { subcategory: /^sarees?$/i },
        { tags: 'saree' },
      ],
      status: 'active',
    });

    const activeCategories = await Category.countDocuments({ status: 'active' });

    const womenWearCount = await Product.countDocuments({
      gender: 'women',
      status: 'active',
    });

    const sareesUnder1500 = await Product.countDocuments({
      $or: [
        { subcategory: /^sarees?$/i },
        { tags: 'saree' },
      ],
      status: 'active',
      price: { $lt: 1500 },
    });

    const sareesUnder2000 = await Product.countDocuments({
      $or: [
        { subcategory: /^sarees?$/i },
        { tags: 'saree' },
      ],
      status: 'active',
      price: { $lt: 2000 },
    });

    const finalProductCount = await Product.countDocuments({ status: 'active' });

    console.log('======================================================');
    console.log('✅ CATALOG SYNCHRONIZATION COMPLETE');
    console.log('======================================================');
    console.log(`📦 Active Catalog Products: ${finalProductCount}`);
    console.log(`🥻 Active Saree Products:   ${activeSarees}`);
    console.log(`🏷️ Active Categories:       ${activeCategories}`);
    console.log(`👗 Women's Wear Count:      ${womenWearCount}`);
    console.log(`💰 Sarees under ₹1,500:     ${sareesUnder1500}`);
    console.log(`💰 Sarees under ₹2,000:     ${sareesUnder2000}`);
    console.log('======================================================\n');

    return {
      success: true,
      activeSarees,
      activeCategories,
      womenWearCount,
      sareesUnder1500,
      sareesUnder2000,
      finalProductCount,
    };
  } catch (error) {
    console.error('❌ [Sync Error] Catalog synchronization failed:', error.message);
    throw error;
  }
};

if (require.main === module) {
  runCatalogSync()
    .then(() => process.exit(0))
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = { runCatalogSync };
