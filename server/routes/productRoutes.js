const express = require('express');

const router = express.Router();

const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getMySellerProducts,
  uploadProductMedia,
  uploadProductImage,
  deleteProductMedia,
  deleteProductImage,
} = require('../controllers/productController');

const { protect } = require('../middleware/auth');

const upload = require('../middleware/upload');

const reviewRouter = require('./reviewRoutes');

// DummyJSON import service
const {
  importDummyProducts,
} = require('../services/dummyProductService');

// ==========================================
// RE-ROUTE INTO REVIEW ROUTER
// ==========================================

router.use('/:productId/reviews', reviewRouter);

// ==========================================
// DUMMYJSON PRODUCT IMPORT
// ==========================================
// Reads:
// server/data/dummy-products.json
//
// Then:
// DummyJSON → Women/Men mapping → MongoDB
//
// Run:
// POST /api/products/import-dummy
// ==========================================

router.post('/import-dummy', protect, async (req, res) => {
  try {
    const fetchLive = req.query.live === 'true' || req.body?.live === true;
    const result = await importDummyProducts({ fetchLive });

    return res.status(200).json({
      success: true,
      message: 'DummyJSON products imported successfully',
      result,
    });
  } catch (error) {
    console.error('DummyJSON import error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to import DummyJSON products',
      error: error.message,
    });
  }
});

router.post('/seed-sarees', protect, async (req, res) => {
  try {
    const { seedSarees } = require('../seed/sareeSeed');
    const result = await seedSarees();

    return res.status(200).json({
      success: true,
      message: 'Saree catalog synchronized successfully',
      result,
    });
  } catch (error) {
    console.error('Saree seed error:', error);

    return res.status(500).json({
      success: false,
      message: 'Failed to seed saree catalog',
      error: error.message,
    });
  }
});

// ==========================================
// PUBLIC PRODUCT LISTING
// AUTHENTICATED PRODUCT CREATION
// ==========================================

router
  .route('/')
  .get(getProducts)
  .post(protect, createProduct);

// ==========================================
// AUTHENTICATED IMAGE & MEDIA UPLOADS
// ==========================================
router.post('/upload-image', protect, upload.single('image'), uploadProductMedia || uploadProductImage);
router.post('/upload-images', protect, upload.array('images', 10), uploadProductMedia);
router.post('/upload-video', protect, upload.single('video'), uploadProductMedia);
router.post('/upload-media', protect, upload.single('media'), uploadProductMedia);
router.delete('/delete-image', protect, deleteProductImage);
router.delete('/delete-media', protect, deleteProductMedia);

// ==========================================
// SELLER'S OWN PRODUCTS
// ==========================================
// Must be before /:slug

router.get(
  '/seller/my',
  protect,
  getMySellerProducts
);

// ==========================================
// SINGLE PRODUCT
// ==========================================

router
  .route('/:slug')
  .get(getProductBySlug);

// ==========================================
// UPDATE / DELETE PRODUCT
// ==========================================

router
  .route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;