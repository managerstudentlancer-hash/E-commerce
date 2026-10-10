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
const gridfsService = require('../services/gridfsService');

// All routes here strictly require authentication + admin role
router.use(protect, adminOnly);

// Universal Admin Upload to MongoDB GridFS (products, banners, categories, videos, logo, etc.)
router.post('/upload', (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) return next(err);
    if (req.files && req.files.length > 0) {
      req.file = req.files[0];
    }
    next();
  });
}, async (req, res, next) => {
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

    const result = await gridfsService.uploadToGridFS({
      buffer: file.buffer,
      mimetype: file.mimetype,
      originalname: file.originalname,
      folder,
      entityId,
    });

    res.json({
      success: true,
      message: 'File uploaded successfully to MongoDB GridFS',
      url: result.url,
      path: result.storagePath,
      filename: result.filename,
      fileId: result.fileId,
      mediaType: file.mimetype.startsWith('video/') ? 'video' : 'image',
      mimeType: result.mimetype,
      size: result.size,
    });
  } catch (error) {
    console.error('[Admin Upload Error]:', error.message);
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
});

// Admin Delete Image from MongoDB GridFS
router.delete('/delete-image', async (req, res, next) => {
  try {
    const { url } = req.body;
    if (!url) {
      return res.status(400).json({ success: false, message: 'Image URL or path is required' });
    }
    const removed = await gridfsService.deleteFromGridFS(url);
    res.json({
      success: true,
      message: removed ? 'Image deleted successfully from MongoDB GridFS' : 'File already removed or not found',
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

// Flipkart-Style Delivery Partner Earnings & Payouts Administration
const {
  getAdminPayoutsOverview,
  getAdminPayoutsList,
  getAdminPayoutConfig,
  updateAdminPayoutConfig,
  batchSettleEligiblePayouts,
  reconcilePayout,
  retryFailedPayout,
  adjustRiderEarning,
} = require('../controllers/deliveryPayoutController');

router.get('/delivery-payouts/overview', getAdminPayoutsOverview);
router.get('/delivery-payouts/list', getAdminPayoutsList);
router.get('/delivery-payouts/config', getAdminPayoutConfig);
router.put('/delivery-payouts/config', updateAdminPayoutConfig);
router.post('/delivery-payouts/batch-settle', batchSettleEligiblePayouts);
router.post('/delivery-payouts/:id/reconcile', reconcilePayout);
router.post('/delivery-payouts/:id/retry', retryFailedPayout);
router.post('/delivery-payouts/adjust-earning', adjustRiderEarning);

module.exports = router;
