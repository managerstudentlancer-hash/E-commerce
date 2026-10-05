const SupportTicket = require('../models/SupportTicket');

// Helper: Seed default sample support inquiries if database is clean
const seedSampleTicketsIfEmpty = async () => {
  const count = await SupportTicket.countDocuments();
  if (count === 0) {
    await SupportTicket.insertMany([
      {
        ticketNumber: 'TIC-849201-342',
        userName: 'Priya Sharma',
        userEmail: 'priya.sharma@example.com',
        phone: '+91 98765 12345',
        role: 'customer',
        category: 'Order Issue',
        subject: 'Inquiry regarding Banarasi Saree Delivery Timeline',
        message: 'Namaste, I ordered a Banarasi Silk saree yesterday for my wedding on Friday. Could you please confirm if express dispatch is available?',
        orderNumber: 'ORD-78901',
        status: 'OPEN',
        priority: 'high',
        channel: '24/7 Web Concierge',
        replies: [
          {
            senderName: 'Priya Sharma',
            senderRole: 'customer',
            message: 'Namaste, I ordered a Banarasi Silk saree yesterday for my wedding on Friday. Could you please confirm if express dispatch is available?',
            createdAt: new Date(Date.now() - 3600000 * 2),
          },
        ],
      },
      {
        ticketNumber: 'TIC-621908-119',
        userName: 'Aarav Patel',
        userEmail: 'aarav.patel@example.com',
        phone: '+91 98234 56789',
        role: 'customer',
        category: 'Payment Issue',
        subject: 'Coupon code AUTUMN30 application on cart',
        message: 'Hello, I was trying to apply the festival coupon AUTUMN30 on my designer lehenga cart. Wanted to check the minimum order value.',
        orderNumber: '',
        status: 'IN_PROGRESS',
        priority: 'medium',
        channel: 'Contact Form',
        replies: [
          {
            senderName: 'Aarav Patel',
            senderRole: 'customer',
            message: 'Hello, I was trying to apply the festival coupon AUTUMN30 on my designer lehenga cart. Wanted to check the minimum order value.',
            createdAt: new Date(Date.now() - 3600000 * 5),
          },
          {
            senderName: 'VEXIVO Concierge Lead',
            senderRole: 'admin',
            message: 'Hello Aarav, AUTUMN30 applies flat 30% discount on all orders over ₹999. We have verified your cart and you can proceed now!',
            createdAt: new Date(Date.now() - 3600000 * 3),
          },
        ],
      },
      {
        ticketNumber: 'TIC-310492-887',
        userName: 'Meera Deshmukh',
        userEmail: 'meera.d@example.com',
        phone: '+91 99887 76655',
        role: 'customer',
        category: 'Return/Refund',
        subject: 'Size exchange for embroidered festive anarkali',
        message: 'Hi team, I would like to request a size M exchange for the anarkali delivered today. The fitting was slightly snug at the bust.',
        orderNumber: 'ORD-54321',
        status: 'RESOLVED',
        priority: 'low',
        channel: '24/7 Customer Care',
        replies: [
          {
            senderName: 'Meera Deshmukh',
            senderRole: 'customer',
            message: 'Hi team, I would like to request a size M exchange for the anarkali delivered today.',
            createdAt: new Date(Date.now() - 3600000 * 24),
          },
          {
            senderName: 'Customer Support Lead',
            senderRole: 'admin',
            message: 'Hello Meera, doorstep reverse pickup is scheduled for tomorrow 11 AM. Your replacement Size M has been dispatched with priority tracking.',
            createdAt: new Date(Date.now() - 3600000 * 20),
          },
        ],
      },
    ]);
  }
};

// @desc Submit Public Contact / 24*7 Customer Service Inquiry
// @route POST /api/support/inquiry
const submitPublicInquiry = async (req, res, next) => {
  try {
    const { name, email, phone = '', subject, message, category = 'General Inquiry', orderNumber = '' } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ success: false, message: 'Name, email, and message are required' });
    }

    const ticketNumber = `TIC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const ticket = await SupportTicket.create({
      ticketNumber,
      user: req.user?._id || null,
      userName: name.trim(),
      userEmail: email.trim().toLowerCase(),
      phone: phone.trim(),
      role: req.user ? (req.user.isSeller ? 'seller' : 'customer') : 'guest',
      category: category || 'General Inquiry',
      subject: subject ? subject.trim() : `Customer Inquiry from ${name.trim()}`,
      message: message.trim(),
      orderNumber: orderNumber.trim(),
      priority: 'medium',
      status: 'OPEN',
      channel: '24/7 Web Concierge',
      replies: [
        {
          sender: req.user?._id || null,
          senderName: name.trim(),
          senderRole: req.user ? req.user.role : 'guest',
          message: message.trim(),
          createdAt: new Date(),
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: 'Your inquiry has been dispatched to our 24/7 customer service desk. Ticket #' + ticketNumber,
      ticket,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Create new support ticket (Authenticated Customer or Seller)
// @route POST /api/support/tickets
const createTicket = async (req, res, next) => {
  try {
    const { category, subject, message, orderNumber, priority = 'medium', phone = '' } = req.body;

    if (!category || !subject || !message) {
      return res.status(400).json({ success: false, message: 'Category, subject, and message are required' });
    }

    const ticketNumber = `TIC-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;

    const ticket = await SupportTicket.create({
      ticketNumber,
      user: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      phone: phone || req.user.phone || '',
      role: req.user.isSeller ? 'seller' : 'customer',
      category,
      subject,
      message,
      orderNumber: orderNumber || '',
      priority,
      status: 'OPEN',
      channel: '24/7 User Dashboard',
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

// @desc Admin: Get all support tickets / customer inquiries
// @route GET /api/support/admin/tickets
const getAllTicketsAdmin = async (req, res, next) => {
  try {
    await seedSampleTicketsIfEmpty();

    const { status, category, priority, search } = req.query;
    const filter = {};

    if (status && status !== 'ALL') {
      filter.status = status;
    }
    if (category && category !== 'ALL') {
      filter.category = category;
    }
    if (priority && priority !== 'ALL') {
      filter.priority = priority;
    }
    if (search && search.trim()) {
      const q = search.trim();
      filter.$or = [
        { ticketNumber: { $regex: q, $options: 'i' } },
        { userName: { $regex: q, $options: 'i' } },
        { userEmail: { $regex: q, $options: 'i' } },
        { subject: { $regex: q, $options: 'i' } },
        { orderNumber: { $regex: q, $options: 'i' } },
      ];
    }

    const tickets = await SupportTicket.find(filter).sort({ updatedAt: -1, createdAt: -1 });
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

    if (req.user.role !== 'admin' && ticket.user && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this ticket' });
    }

    res.json({ success: true, ticket });
  } catch (error) {
    next(error);
  }
};

// @desc Add reply to support ticket (User or Admin)
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

    if (req.user.role !== 'admin' && ticket.user && ticket.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to reply to this ticket' });
    }

    ticket.replies.push({
      sender: req.user._id,
      senderName: req.user.name || (req.user.role === 'admin' ? '24/7 Concierge Support' : 'Customer'),
      senderRole: req.user.role,
      message: message.trim(),
      createdAt: new Date(),
    });

    if (req.user.role === 'admin') {
      ticket.status = 'WAITING_FOR_USER';
    } else {
      if (ticket.status === 'WAITING_FOR_USER' || ticket.status === 'RESOLVED') {
        ticket.status = 'IN_PROGRESS';
      }
    }

    await ticket.save();
    res.json({ success: true, message: 'Reply dispatched successfully', ticket });
  } catch (error) {
    next(error);
  }
};

// @desc Admin: Update ticket status or priority
// @route PUT /api/support/admin/tickets/:id
const updateTicketAdmin = async (req, res, next) => {
  try {
    const { status, priority, category } = req.body;
    const ticket = await SupportTicket.findById(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    if (status) ticket.status = status;
    if (priority) ticket.priority = priority;
    if (category) ticket.category = category;

    await ticket.save();
    res.json({ success: true, message: 'Ticket updated successfully', ticket });
  } catch (error) {
    next(error);
  }
};

// @desc Admin: Delete support ticket
// @route DELETE /api/support/admin/tickets/:id
const deleteTicketAdmin = async (req, res, next) => {
  try {
    const ticket = await SupportTicket.findByIdAndDelete(req.params.id);
    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, message: 'Support ticket deleted successfully' });
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

    if (req.user.role !== 'admin' && ticket.user && ticket.user.toString() !== req.user._id.toString()) {
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
  submitPublicInquiry,
  createTicket,
  getMyTickets,
  getAllTicketsAdmin,
  getTicketById,
  addReply,
  updateTicketAdmin,
  deleteTicketAdmin,
  closeTicket,
};
