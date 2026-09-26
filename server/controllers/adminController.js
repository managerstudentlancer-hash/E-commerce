const Order = require('../models/Order');
const Product = require('../models/Product');
const User = require('../models/User');

// @desc Get comprehensive admin dashboard analytics
// @route GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();
    const totalCustomers = await User.countDocuments({ role: 'customer' });
    const totalSellers = await User.countDocuments({ role: 'seller' });
    const totalUsers = await User.countDocuments();

    // Aggregate revenue
    const orders = await Order.find({ paymentStatus: 'paid' });
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);

    // Low stock products
    const lowStockProducts = await Product.find({
      stock: { $lte: 10 },
      status: 'active',
    })
      .select('name slug price stock lowStockThreshold thumbnail')
      .limit(10);

    const lowStockCount = await Product.countDocuments({
      stock: { $lte: 10 },
      status: 'active',
    });

    // Recent orders
    const recentOrders = await Order.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 })
      .limit(6);

    // Recent customers
    const recentCustomers = await User.find({ role: { $in: ['customer', 'seller'] } })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email role createdAt');

    // Sales by status
    const statusCounts = {
      pending: await Order.countDocuments({ orderStatus: 'pending' }),
      processing: await Order.countDocuments({ orderStatus: 'processing' }),
      shipped: await Order.countDocuments({ orderStatus: 'shipped' }),
      delivered: await Order.countDocuments({ orderStatus: 'delivered' }),
    };

    res.json({
      success: true,
      stats: {
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        totalOrders,
        totalUsers,
        totalCustomers,
        totalSellers,
        totalProducts,
        lowStockCount,
        statusCounts,
      },
      lowStockProducts,
      recentOrders,
      recentCustomers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Get all registered users (Admin only)
// @route GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-passwordHash').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update user role (Admin only)
// @route PUT /api/admin/users/:id/role
const updateUserRole = async (req, res, next) => {
  try {
    const { role } = req.body;
    if (!['customer', 'seller', 'admin'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    user.role = role;
    await user.save();

    res.json({
      success: true,
      message: `User role updated to ${role}`,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc Delete user (Admin only)
// @route DELETE /api/admin/users/:id
const deleteUser = async (req, res, next) => {
  try {
    if (req.params.id === req.user._id.toString()) {
      return res.status(400).json({ success: false, message: 'Cannot delete your own administrator account' });
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User account removed successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
};
