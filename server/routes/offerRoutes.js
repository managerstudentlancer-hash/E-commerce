const express = require('express');
const router = express.Router();
const {
  getOffers,
  getAllOffersAdmin,
  createOffer,
  updateOffer,
  toggleOfferStatus,
  deleteOffer,
  resetToDefaultOffers,
} = require('../controllers/offerController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route to view active offers
router.get('/', getOffers);

// Admin-protected routes
router.get('/admin/all', protect, adminOnly, getAllOffersAdmin);
router.post('/', protect, adminOnly, createOffer);
router.put('/:id', protect, adminOnly, updateOffer);
router.patch('/:id/toggle', protect, adminOnly, toggleOfferStatus);
router.delete('/:id', protect, adminOnly, deleteOffer);
router.post('/reset-default', protect, adminOnly, resetToDefaultOffers);

module.exports = router;
