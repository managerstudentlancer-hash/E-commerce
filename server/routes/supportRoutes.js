const express = require('express');
const router = express.Router();
const {
  createTicket,
  getMyTickets,
  getTicketById,
  addReply,
  closeTicket,
} = require('../controllers/supportController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/tickets')
  .post(createTicket)
  .get(getMyTickets);

router.route('/tickets/:id')
  .get(getTicketById);

router.post('/tickets/:id/reply', addReply);
router.put('/tickets/:id/close', closeTicket);

module.exports = router;
