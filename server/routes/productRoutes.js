const express = require('express');

const router = express.Router();

const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  getMySellerProducts,
  uploadProductImage,
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
    const result = await importDummyProducts();

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

// ==========================================
// PUBLIC PRODUCT LISTING
// AUTHENTICATED PRODUCT CREATION
// ==========================================

router
  .route('/')
  .get(getProducts)
  .post(protect, createProduct);

// ==========================================
// AUTHENTICATED IMAGE UPLOAD
// ==========================================

router.post(
  '/upload-image',
  protect,
  upload.single('image'),
  uploadProductImage
);

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