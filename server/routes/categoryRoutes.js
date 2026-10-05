const express = require('express');
const router = express.Router();
const {
  getCategories,
  getAllCategoriesAdmin,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory,
  syncDummyCatalog,
} = require('../controllers/categoryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getCategories);
router.get('/all', protect, adminOnly, getAllCategoriesAdmin);
router.post('/sync-dummy', protect, adminOnly, syncDummyCatalog);
router.get('/:slug', getCategoryBySlug);
router.post('/', protect, adminOnly, createCategory);
router.put('/:id', protect, adminOnly, updateCategory);
router.delete('/:id', protect, adminOnly, deleteCategory);

module.exports = router;
