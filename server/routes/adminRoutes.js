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
const supabaseStorage = require('../services/supabaseStorage');

// All routes here strictly require authentication + admin role
router.use(protect, adminOnly);

// Universal Admin Upload to Supabase Storage (banners, categories, logo, etc.)
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload an image file (JPEG, PNG, WEBP, GIF up to 5MB)',
      });
    }

    let folder = req.body.folder || 'banners';
    const type = (req.body.type || '').toLowerCase();
    if (type.includes('category') || type.includes('categories')) folder = 'categories';
    else if (type.includes('banner') || type.includes('banners')) folder = 'banners';
    else if (type.includes('product') || type.includes('products')) folder = 'products';
    else if (type.includes('profile') || type.includes('profiles')) folder = 'profiles';
    else if (type.includes('seller') || type.includes('sellers')) folder = 'sellers';

    const entityId =
      req.body.entityId ||
      req.body.bannerId ||
      req.body.categoryId ||
      req.body.productId ||
      req.body.userId ||
      'admin';

    const result = await supabaseStorage.uploadToSupabase({
      buffer: req.file.buffer,
      mimetype: req.file.mimetype,
      originalname: req.file.originalname,
      folder,
      entityId,
    });

    res.json({
      success: true,
      message: 'File uploaded successfully to Supabase Storage',
      url: result.url,
      path: result.path,
      filename: result.filename,
      bucket: result.bucket,
    });
  } catch (error) {
    console.error('[Admin Upload Error]:', error.message);
    const isConfigError = error.message.includes('configured');
    res.status(isConfigError ? 503 : 400).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin Delete Image from Supabase Storage
router.delete('/delete-image', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Image URL or path is required' });
    }
    const removed = await supabaseStorage.deleteFromSupabase(url);
    res.json({
      success: true,
      message: removed ? 'Image deleted successfully from Supabase Storage' : 'File already removed or not found',
    });
  } catch (error) {
    next(error);
  }
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
