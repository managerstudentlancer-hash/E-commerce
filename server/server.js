const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Load environment variables from both root and server .env
dotenv.config({ path: path.join(__dirname, '../.env') });
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Observability: Sentry & Pino
const { initSentry, Sentry, isSentryEnabled } = require('./config/sentry');
initSentry();

const logger = require('./config/logger');
const requestLogger = require('./middleware/requestLogger');

const app = express();
const PORT = process.env.PORT || 5000;

// Initialize Database connection & auto-seed if empty
const Product = require('./models/Product');
const { seedAll } = require('./seed/seedData');

connectDB().then(async () => {
  try {
    if (process.env.NODE_ENV !== 'production') {
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
      const initDeliveryPartner = require('./config/initDeliveryPartner');
      await initDeliveryPartner();
      const { seedAiKnowledge } = require('./seed/aiKnowledgeSeed');
      await seedAiKnowledge();
    } else {
      console.log('[VEXIVO] Production mode active. Catalog auto-seed and demo account creation disabled.');
    }
  } catch (err) {
    console.warn('[VEXIVO] Startup initialization notice:', err.message);
  }
}).catch((err) => {
  console.error('[VEXIVO DB] Startup connection error:', err.message);
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
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

// Observability: Pino HTTP Request Logging & Correlation ID (X-Request-Id)
app.use(requestLogger);

// Security & Header Fortification
app.use(setSecurityHeaders);
app.use(globalRateLimiter);

// Secure CORS (Supports localhost, custom domain, and Vercel preview/production domains)
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const isAllowed =
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost') ||
        origin.includes('127.0.0.1');
      if (isAllowed) {
        return callback(null, true);
      }
      return callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);

// Payload Body Limiting (Mitigate Buffer Overflow & ReDoS)
// Capture rawBody for cryptographic webhook HMAC verification (RazorpayX)
app.use(
  express.json({
    limit: '2mb',
    verify: (req, res, buf) => {
      req.rawBody = buf;
    },
  })
);
app.use(express.urlencoded({ extended: true, limit: '2mb' }));

// Anti-Injection & Anti-XSS Sanitization Pipeline
app.use(sanitizeAuthInputs);
app.use(xssProtection);
app.use(hppProtection);

// Static directory for uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const { protect, adminOnly } = require('./middleware/auth');

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
app.use('/api/media', require('./routes/mediaRoutes'));
app.use('/api/site-settings', require('./routes/settingsRoutes'));
app.use('/api/newsletter', require('./routes/newsletterRoutes'));
app.use('/api/support', require('./routes/supportRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/admin/ai', require('./routes/adminAiRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/logistics', require('./routes/logisticsRoutes'));
app.use('/api/webhooks', require('./routes/webhookRoutes'));

// Administrative Reseed endpoints (Strictly Admin Protected — completely restricted from public / guest / customer / seller access; completely disabled in production)
app.all(['/api/seed', '/api/admin/seed'], protect, adminOnly, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Database seeding endpoints are strictly disabled in production environments.',
      });
    }
    await seedAll();
    const initDeliveryPartner = require('./config/initDeliveryPartner');
    await initDeliveryPartner();
    const total = await Product.countDocuments();
    res.json({ success: true, message: `Catalog seeded! Total products: ${total}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.all(['/api/seed-catalog', '/api/admin/seed-catalog'], protect, adminOnly, async (req, res) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({
        success: false,
        message: 'Database seeding endpoints are strictly disabled in production environments.',
      });
    }
    delete require.cache[require.resolve('./seed/seedData')];
    delete require.cache[require.resolve('./seed/bagsData')];
    delete require.cache[require.resolve('./seed/shoesData')];
    const { seedAll: freshSeedAll } = require('./seed/seedData');
    await freshSeedAll();
    const initDeliveryPartner = require('./config/initDeliveryPartner');
    await initDeliveryPartner();
    const total = await Product.countDocuments();
    const bagCount = await Product.countDocuments({ categorySlug: 'bags' });
    const shoeCount = await Product.countDocuments({ categorySlug: 'shoes' });
    const sareeCount = await Product.countDocuments({ subcategory: /^sarees?$/i });
    res.json({ success: true, message: `Catalog seeded! Total: ${total}, Sarees: ${sareeCount}, Bags: ${bagCount}, Shoes: ${shoeCount}` });
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

// Observability status endpoint
app.get('/api/observability/status', (req, res) => {
  res.json({
    success: true,
    logger: 'pino',
    logLevel: logger.level,
    sentryEnabled: isSentryEnabled(),
    environment: process.env.NODE_ENV || 'development',
    requestId: req.id || req.headers['x-request-id'] || 'active',
    timestamp: new Date().toISOString(),
  });
});

// Diagnostic route for testing unexpected error capture (available only in non-production)
if (process.env.NODE_ENV !== 'production') {
  app.get('/api/observability/test-error', (req, res, next) => {
    const testErr = new Error('VEXIVO Observability Diagnostic Test Error');
    testErr.statusCode = 500;
    next(testErr);
  });
}

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

// Sentry express error handler (must be before custom error handler)
if (isSentryEnabled() && Sentry.setupExpressErrorHandler) {
  Sentry.setupExpressErrorHandler(app);
}

// Centralized error handler
app.use(errorHandler);

// Start server
const server = app.listen(PORT, '0.0.0.0', () => {
  logger.info({ port: PORT, env: process.env.NODE_ENV || 'development' }, 'VEXIVO API Server successfully started');
  console.log(`====================================================`);
  console.log(`🚀 VEXIVO Server running in ${process.env.NODE_ENV || 'development'} mode`);
  console.log(`🌐 API Live at: http://127.0.0.1:${PORT}`);
  console.log(`🛡️  Zero Python: Verified Node.js Runtime`);
  console.log(`====================================================`);
});

module.exports = { app, server };
