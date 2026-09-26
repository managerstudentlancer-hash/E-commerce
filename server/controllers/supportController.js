const SupportTicket = require('../models/SupportTicket');

// @desc Create new support ticket (Customer or Seller)
// @route POST /api/support/tickets
const createTicket = async (req, res, next) => {
  try {
    const { category, subject, message, orderNumber, priority = 'medium' } = req.body;

    if (!category || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Category, subject, and message are required' });
    }

    const ticketNumber = `TIC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const ticket = await SupportTicket.create({
      ticketNumber,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      role: req.user.isSeller ? 'seller' : 'customer',
      category,
      subject,
      message,
      orderNumber: orderNumber || '',
      priority,
      status: 'OPEN',
      replies: [
        {
          sender: req.user._id,
          senderName: req.user.name,
          senderRole: req.user.role,
          message,
          createdAt: new Date(),
        },
      ],
    });

    res.status(201).json({ success: true, message: 'Support ticket created successfully', ticket });
  } catch (error) {
    next(error);
  }
};

// @desc Get logged-in user's support tickets
// @route GET /api/support/tickets
const getMyTickets = async (req, res, next) => {
  try {
    const tickets = await SupportTicket.find({ user: req.user._id }).sort({ updatedAt: -1 });
    res.json({ success: true, count: tickets.length, tickets });
  } catch (error) {
    next(error);
  }
};

// @desc Get single ticket by ID
// @route GET /api/support/tickets/:id
const getTicketById = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Must be ticket owner or admin
    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

// @desc Add reply to support ticket
// @route POST /api/support/tickets/:id/reply
const addReply = async (req, res, next) => {
  try {
    const { message } = req.body;
    if (!message || !message.trim()) {
      return res.status(400).json({ success: false, message: 'Message is required' });
    }

    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Must be owner or admin
    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reply to this ticket' });
    }

    ticket.replies.push({
      sender: req.user._id,
      senderName: req.user.name,
      senderRole: req.user.role,
      message: message.trim(),
      createdAt: new Date(),
    });

    // Update status based on who replied
    if (req.user.role === 'admin') {
      ticket.status = 'WAITING_FOR_USER';
    } else {
      if (ticket.status === 'WAITING_FOR_USER' || ticket.status === 'RESOLVED') {
        ticket.status = 'IN_PROGRESS';
      }
    }

    await ticket.save();
    res.json({ success: true, message: 'Reply added successfully', ticket });
  } catch (error) {
    next(error);
  }
};

// @desc Close support ticket
// @route PUT /api/support/tickets/:id/close
const closeTicket = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (req.user.role !== 'admin' && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to close this ticket' });
    }

    ticket.status = 'CLOSED';
    await ticket.save();
    res.json({ success: true, message: 'Ticket marked as closed', ticket });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,
  getMyTickets,
  getTicketById,
  addReply,
  closeTicket,
};
