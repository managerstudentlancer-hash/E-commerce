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
    const recentCustomers = await User.find({ role: 'customer' })
      .sort({ createdAt: -1 })
      .limit(5)
      .select('name email createdAt');

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
        totalCustomers,
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

module.exports = { getDashboardStats };
