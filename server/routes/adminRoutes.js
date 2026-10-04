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
  getDeliveryPartners,
  assignDeliveryPartner,
  autoAssignDeliveryPartner,
  getCodReconciliation,
  settleCod,
  getReturns,
  processReturnRefund,
  getDeliveryApplications,
  updateDeliveryApplicationStatus,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');
const upload = require('../middleware/upload');
const supabaseStorage = require('../services/supabaseStorage');

// All routes here strictly require authentication + admin role
router.use(protect, adminOnly);

// Universal Admin Upload to Supabase Storage (products, banners, categories, videos, logo, etc.)
router.post('/upload', upload.single('image'), async (req, res, next) => {
  try {
    const file = req.file || req.files?.[0];
    if (!file) {
      return res.status(400).json({
        success: false,
        message: 'Please select an image (JPEG, PNG, WEBP up to 15MB) or video (MP4, WEBM, MOV up to 60MB)',
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
      req.body.productId ||
      req.body.bannerId ||
      req.body.categoryId ||
      req.body.userId ||
      'admin';

    const result = await supabaseStorage.uploadToSupabase({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      folder,
      entityId,
      mediaType: 'auto',
    });

    res.json({
      success: true,
      message: 'File uploaded successfully to Supabase Storage',
      url: result.url,
      path: result.path,
      filename: result.filename,
      bucket: result.bucket,
      mediaType: result.mediaType,
      mimeType: result.mimeType,
      size: result.size,
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

// Logistics & Delivery Partner Operations
router.get('/delivery-partners', getDeliveryPartners);
router.get('/delivery/applications', getDeliveryApplications);
router.put('/delivery/applications/:id/status', updateDeliveryApplicationStatus);
router.put('/orders/:id/assign-delivery', assignDeliveryPartner);
router.post('/orders/:id/auto-assign', autoAssignDeliveryPartner);
router.get('/delivery/cod-reconciliation', getCodReconciliation);
router.post('/delivery/cod-settle', settleCod);

// Returns & Dispute Management
router.get('/returns', getReturns);
router.put('/returns/:id/refund', processReturnRefund);

module.exports = router;
