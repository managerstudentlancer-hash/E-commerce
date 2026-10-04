const express = require('express');
const router = express.Router();
const {
  submitPublicInquiry,
  createTicket,
  getMyTickets,
  getAllTicketsAdmin,
  getTicketById,
  addReply,
  updateTicketAdmin,
  deleteTicketAdmin,
  closeTicket,
} = require('../controllers/supportController');
const { protect, adminOnly } = require('../middleware/auth');

// Public route: Submit 24/7 customer service inquiry / contact message
router.post('/inquiry', submitPublicInquiry);

// User protected routes
router.post('/tickets', protect, createTicket);
router.get('/tickets', protect, getMyTickets);
router.get('/tickets/:id', protect, getTicketById);
router.post('/tickets/:id/reply', protect, addReply);
router.put('/tickets/:id/close', protect, closeTicket);

// Admin-only 24/7 Support Desk Management
router.get('/admin/tickets', protect, adminOnly, getAllTicketsAdmin);
router.put('/admin/tickets/:id', protect, adminOnly, updateTicketAdmin);
router.delete('/admin/tickets/:id', protect, adminOnly, deleteTicketAdmin);
router.post('/admin/tickets/:id/reply', protect, adminOnly, addReply);

module.exports = router;
