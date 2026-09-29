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

// Authenticated image uploads for products (single & multiple)
router.post('/upload-image', protect, upload.single('image'), uploadProductImage);
router.post('/upload-images', protect, upload.array('images', 10), uploadProductImage);
router.delete('/delete-image', protect, deleteProductImage);

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
