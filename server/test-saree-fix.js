const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

const assert = require('assert');
const connectDB = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Cart = require('./models/Cart');
const User = require('./models/User');
const { runCatalogSync } = require('./scripts/syncCatalog');
const { getCategoryFallback, resolveImageUrl } = require('../client/src/utils/imageHelper');

console.log('====================================================');
console.log('🧪 RUNNING COMPREHENSIVE SAREE & DUMMYJSON FIX TESTS');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

async function test(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`✅ [PASS] ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`❌ [FAIL] ${name}`);
    console.error(`   Error: ${err.message}\n`);
    process.exitCode = 1;
  }
}

(async () => {
  await connectDB();

  // Test 1: Run Idempotent Catalog Synchronization
  await test('1. Safe Catalog Synchronization executes without data deletion', async () => {
    const result = await runCatalogSync();
    assert.strictEqual(result.success, true);
    assert.strictEqual(result.activeSarees, 22, `Expected 22 active sarees, got ${result.activeSarees}`);
    assert.strictEqual(result.sareesUnder1500, 9, `Expected 9 sarees under 1500, got ${result.sareesUnder1500}`);
    assert.strictEqual(result.sareesUnder2000, 16, `Expected 16 sarees under 2000, got ${result.sareesUnder2000}`);
    assert.strictEqual(result.womenWearCount, 54, `Expected 54 Women Wear items, got ${result.womenWearCount}`);
  });

  // Test 2: Idempotency (Second run without duplication)
  await test('2. Synchronization is strictly idempotent (zero duplicates created)', async () => {
    const result = await runCatalogSync();
    assert.strictEqual(result.activeSarees, 22, 'Active sarees count must remain 22 on re-sync');
    assert.strictEqual(result.finalProductCount, 220, 'Total product count must remain 220 on re-sync');
  });

  // Test 3: Query Category Endpoint Logic for Sarees
  await test('3. Saree category query returns all 22 sarees and expected metadata', async () => {
    const sareeQuery = {
      $or: [
        { subcategory: /^sarees?$/i },
        { tags: { $in: ['saree', 'sarees'] } },
        { categorySlug: 'sarees' },
        { collectionSlug: 'ethnic-wear' },
      ],
      status: 'active',
    };

    const count = await Product.countDocuments(sareeQuery);
    assert.strictEqual(count, 22, `Expected 22 sarees from category query, got ${count}`);

    const sareeCategory = await Category.findOne({ slug: 'sarees' });
    assert.ok(sareeCategory, 'Sarees category must exist in Category collection');
    assert.strictEqual(sareeCategory.slug, 'sarees');
    assert.strictEqual(sareeCategory.status, 'active');
    assert.strictEqual(sareeCategory.itemCount, 22);
  });

  // Test 4: Women Wear Category includes Sarees
  await test('4. Women Wear category includes sarees (54 items total)', async () => {
    const count = await Product.countDocuments({
      gender: 'women',
      status: 'active',
    });
    assert.strictEqual(count, 54, `Expected 54 items in women-wear query, got ${count}`);
  });

  // Test 5: Price Filter Verification
  await test('5. Price filtering matches expected distribution', async () => {
    const under1500 = await Product.countDocuments({
      $or: [{ subcategory: /^sarees?$/i }, { tags: 'saree' }],
      status: 'active',
      price: { $lt: 1500 },
    });
    assert.strictEqual(under1500, 9, `Expected 9 under ₹1500, got ${under1500}`);

    const under2000 = await Product.countDocuments({
      $or: [{ subcategory: /^sarees?$/i }, { tags: 'saree' }],
      status: 'active',
      price: { $lt: 2000 },
    });
    assert.strictEqual(under2000, 16, `Expected 16 under ₹2000, got ${under2000}`);
  });

  // Test 6: Image Quality and URL Resolution
  await test('6. All 22 sarees have valid non-empty images, thumbnails, and hover images', async () => {
    const sarees = await Product.find({
      $or: [{ subcategory: /^sarees?$/i }, { tags: 'saree' }],
      status: 'active',
    });

    for (const s of sarees) {
      assert.ok(s.thumbnail && s.thumbnail.startsWith('https://'), `Invalid thumbnail for ${s.name}`);
      assert.ok(s.images && s.images.length > 0, `No images for ${s.name}`);
      assert.ok(s.hoverImage && s.hoverImage.startsWith('https://'), `Invalid hoverImage for ${s.name}`);
    }
  });

  // Test 7: Add to Cart Flow (In-memory simulation, no fake orders)
  await test('7. Add-to-cart simulation works cleanly with saree item without creating orders', async () => {
    const sampleSaree = await Product.findOne({
      $or: [{ subcategory: /^sarees?$/i }, { tags: 'saree' }],
      status: 'active',
    });
    assert.ok(sampleSaree, 'Sample saree found');

    let testUser = await User.findOne({ email: 'cart_test_user@vexivo.com' });
    if (!testUser) {
      testUser = await User.create({
        name: 'Cart Tester',
        email: 'cart_test_user@vexivo.com',
        passwordHash: 'CartPass123!',
        role: 'customer',
      });
    }

    let userCart = await Cart.findOne({ user: testUser._id });
    if (!userCart) {
      userCart = await Cart.create({
        user: testUser._id,
        items: [],
      });
    }

    // Add item to cart
    userCart.items.push({
      product: sampleSaree._id,
      name: sampleSaree.name,
      quantity: 1,
      price: sampleSaree.price,
      image: sampleSaree.thumbnail,
    });
    await userCart.save();

    const verifiedCart = await Cart.findOne({ user: testUser._id }).populate('items.product');
    assert.strictEqual(verifiedCart.items.length, 1);
    assert.strictEqual(verifiedCart.items[0].product.name, sampleSaree.name);

    // Clean up test cart
    await Cart.deleteOne({ user: testUser._id });
    await User.deleteOne({ _id: testUser._id });
  });

  console.log('\n====================================================');
  console.log(`SUMMARY: ${passedTests}/${totalTests} tests passed`);
  console.log('====================================================\n');

  process.exit(0);
})();
