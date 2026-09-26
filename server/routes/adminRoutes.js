const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  deleteUser,
  getCustomers,
  getCustomerById,
  updateCustomerStatus,
  getInventoryList,
  updateProductStock,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

// All routes here strictly require authentication + admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/dashboard', getDashboardStats);

// Users Management
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

// Customers
router.get('/customers', getCustomers);
router.get('/customers/:id', getCustomerById);
router.patch('/customers/:id/status', updateCustomerStatus);

// Inventory
router.get('/inventory', getInventoryList);
router.patch('/inventory/:id/stock', updateProductStock);

module.exports = router;
