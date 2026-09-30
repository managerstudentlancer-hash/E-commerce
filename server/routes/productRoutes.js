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

// Re-route into review router
router.use('/:productId/reviews', reviewRouter);

// Public product listing and authenticated product creation
router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

// Authenticated image & video uploads for products (single & multiple)
router.post('/upload-image', protect, upload.single('image'), uploadProductMedia);
router.post('/upload-images', protect, upload.array('images', 10), uploadProductMedia);
router.post('/upload-video', protect, upload.single('video'), uploadProductMedia);
router.post('/upload-media', protect, upload.single('media'), uploadProductMedia);
router.delete('/delete-image', protect, deleteProductImage);
router.delete('/delete-media', protect, deleteProductMedia);

// Seller's own products list (must be before /:slug)
router.get('/seller/my', protect, getMySellerProducts);

// Single product by slug or id
router.route('/:slug')
  .get(getProductBySlug);

// Product update and deletion (controller verifies ownership / admin role)
router.route('/:id')
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
