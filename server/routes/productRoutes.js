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

// Public product listing and authenticated product creation
router.route('/')
  .get(getProducts)
  .post(protect, createProduct);

// Authenticated image upload for products
router.post('/upload-image', protect, upload.single('image'), uploadProductImage);

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
