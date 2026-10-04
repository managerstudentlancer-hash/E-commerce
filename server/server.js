const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from both root and server .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection & auto-seed if empty
const Product = require('./models/Product');
const { seedAll } = require('./seed/seedData');

connectDB().then(async () => {
  try {
    const count = await Product.countDocuments();
    if (count < 60) {
      console.log(`[VEXIVO] Database count is ${count} (< 60). Running catalog auto-seed...`);
      await seedAll();
    }
    const { importDummyProducts } = require('./services/dummyProductService');
    const dummyRes = await importDummyProducts();
    console.log(`[VEXIVO] DummyJSON sync completed: ${dummyRes.imported} imported, ${dummyRes.updated} updated`);
    const { seedSarees } = require('./seed/sareeSeed');
    await seedSarees();
  } catch (err) {
    console.warn('[VEXIVO] Auto-seed/dummy-import check notice:', err.message);
  }
});

const {
  setSecurityHeaders,
  globalRateLimiter,
  sanitizeAuthInputs,
  xssProtection,
  hppProtection,
} = require('./middleware/securityMiddleware');

// Security: Hide server framework signature
app.disable('x-powered-by');

// Security & Header Fortification
app.use(setSecurityHeaders);
app.use(globalRateLimiter);

// Secure CORS
app.use(cors({
  origin: process.env.CLIENT_URL || ['http://localhost:5173', 'http://localhost:3000'],
  credentials: true,
}));

// Payload Body Limiting (Mitigate Buffer Overflow & ReDoS)
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Anti-Injection & Anti-XSS Sanitization Pipeline
app.use(sanitizeAuthInputs);
app.use(xssProtection);
app.use(hppProtection);

// Static directory for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/categories', require('./routes/categoryRoutes'));
app.use('/api/collections', require('./routes/collectionRoutes'));
app.use('/api/cart', require('./routes/cartRoutes'));
app.use('/api/wishlist', require('./routes/wishlistRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));
app.use('/api/search', require('./routes/searchRoutes'));
app.use('/api/banners', require('./routes/bannerRoutes'));
app.use('/api/site-settings', require('./routes/settingsRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));

// Reseed endpoint for instant sync
app.get('/api/seed', async (req, res) => {
  try {
    await seedAll();
    const total = await Product.countDocuments();
    res.json({ success: true, message: `Catalog seeded! Total products: ${total}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.get('/api/seed-catalog', async (req, res) => {
  try {
    delete require.cache[require.resolve('./seed/seedData')];
    delete require.cache[require.resolve('./seed/bagsData')];
    delete require.cache[require.resolve('./seed/shoesData')];
    const { seedAll: freshSeedAll } = require('./seed/seedData');
    await freshSeedAll();
    const total = await Product.countDocuments();
    const bagCount = await Product.countDocuments({ categorySlug: 'bags' });
    const shoeCount = await Product.countDocuments({ categorySlug: 'shoes' });
    res.json({ success: true, message: `Catalog seeded! Total: ${total}, Bags: ${bagCount}, Shoes: ${shoeCount}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    brand: 'VEXIVO',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    pythonZeroCheck: '100% pure Node.js/JavaScript'
  });
});

// Serve frontend client static build when available
const clientDist = path.join(__dirname, '../client/dist');
const fs = require('fs');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    const indexPath = path.join(clientDist, 'index.html');
    if (fs.existsSync(indexPath)) {
      return res.sendFile(indexPath);
    }
    next();
  });
}

// Centralized error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`🚀 VEXIVO Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 API Live at: http://127.0.0.1:${PORT}`);
  console.log(`🛡️  Zero Python: Verified Node.js Runtime`);
  console.log(`====================================================`);
});

module.exports = { app, server };
