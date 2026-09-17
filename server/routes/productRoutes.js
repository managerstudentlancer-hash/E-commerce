const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImage,
} = require('../controllers/productController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/')
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.post('/upload-image', protect, adminOnly, upload.single('image'), uploadProductImage);

router.route('/:slug')
  .get(getProductBySlug);

router.route('/:id')
  .put(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

module.exports = router;
