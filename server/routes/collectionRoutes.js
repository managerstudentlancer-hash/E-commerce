const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollectionBySlug,
  createCollection,
  updateCollection,
  deleteCollection,
} = require('../controllers/collectionController');
const { protect, adminOnly } = require('../middleware/auth');

router.route('/')
  .get(getCollections)
  .post(protect, adminOnly, createCollection);

router.route('/:slug')
  .get(getCollectionBySlug);

router.route('/:id')
  .put(protect, adminOnly, updateCollection)
  .delete(protect, adminOnly, deleteCollection);

module.exports = router;
