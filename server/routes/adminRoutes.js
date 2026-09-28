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
const upload = require('../middleware/upload');

// All routes here strictly require authentication + admin role
router.use(protect, adminOnly);

// Universal Admin Upload (images for banners, logo, etc.)
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Please upload an image file' });
  }
  const fileUrl = `/uploads/${req.file.filename}`;
  res.json({
    success: true,
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
  });
});

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
