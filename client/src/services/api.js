const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Robust token retriever:
 * 1. Checks localStorage('vexivo_token')
 * 2. Checks sessionStorage('vexivo_token')
 * 3. Checks localStorage('token') & sessionStorage('token')
 * 4. Filters out falsy values, 'null', 'undefined', or whitespace
 */
export const getAuthToken = () => {
  try {
    const candidate =
      localStorage.getItem('vexivo_token') ||
      sessionStorage.getItem('vexivo_token') ||
      localStorage.getItem('token') ||
      sessionStorage.getItem('token') ||
      '';
    const trimmed = String(candidate).trim();
    if (!trimmed || trimmed === 'null' || trimmed === 'undefined') {
      return '';
    }
    return trimmed;
  } catch {
    return '';
  }
};

/**
 * Universal store token helper (keeps both localStorage and sessionStorage in sync)
 */
export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('vexivo_token', token);
      sessionStorage.setItem('vexivo_token', token);
    } else {
      localStorage.removeItem('vexivo_token');
      sessionStorage.removeItem('vexivo_token');
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
    }
  } catch {}
};

const request = async (endpoint, options = {}) => {
  const token = options.token || getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}`, 'x-auth-token': token } : {}),
    ...options.headers,
  };

  // If uploading FormData, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  // If options explicitly provided an Authorization header, respect it
  if (options.headers?.Authorization) {
    headers.Authorization = options.headers.Authorization;
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const error = new Error(data.message || 'Something went wrong. Please try again.');
    error.status = response.status;
    error.data = data;
    error.endpoint = endpoint;

    // Trigger auth unauthorized event if 401 occurs on protected endpoint
    if (response.status === 401 && typeof window !== 'undefined') {
      window.dispatchEvent(
        new CustomEvent('vexivo_auth_unauthorized', {
          detail: { endpoint, message: data.message },
        })
      );
    }

    throw error;
  }

  return data;
};

export const api = {
  // Auth
  auth: {
    sendOtp: (phoneData) =>
      request('/auth/send-otp', {
        method: 'POST',
        body: JSON.stringify(typeof phoneData === 'string' ? { phone: phoneData } : phoneData),
      }),
    verifyOtp: (otpData) =>
      request('/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify(otpData),
      }),
    adminLogin: (credentials) =>
      request('/auth/admin-login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      }),
    adminForgotPassword: (email) =>
      request('/auth/admin-forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),
    adminResetPassword: (data) =>
      request('/auth/admin-reset-password', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me'),
    updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
    uploadProfilePhoto: (formData) => request('/auth/profile-photo', { method: 'POST', body: formData }),
    removeProfilePhoto: () => request('/auth/profile-photo', { method: 'DELETE' }),
    addAddress: (addressData) => request('/auth/addresses', { method: 'POST', body: JSON.stringify(addressData) }),
    updateAddress: (id, addressData) => request(`/auth/addresses/${id}`, { method: 'PUT', body: JSON.stringify(addressData) }),
    deleteAddress: (id) => request(`/auth/addresses/${id}`, { method: 'DELETE' }),
    setDefaultAddress: (id) => request(`/auth/addresses/${id}/default`, { method: 'PUT' }),
    activateSeller: (sellerData) => request('/auth/activate-seller', { method: 'POST', body: JSON.stringify(sellerData) }),
    changePassword: (passwords) => request('/auth/password', { method: 'PUT', body: JSON.stringify(passwords) }),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ''}`);
    },
    getBySlug: (slug) => request(`/products/${slug}`),
    getMySellerProducts: () => request('/products/seller/my'),
    create: (product) => request('/products', { method: 'POST', body: JSON.stringify(product) }),
    update: (id, product) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
    uploadImage: (formData) => request('/products/upload-image', { method: 'POST', body: formData }),
    uploadVideo: (formData) => request('/products/upload-video', { method: 'POST', body: formData }),
    uploadMedia: (formData) => request('/products/upload-media', { method: 'POST', body: formData }),
    deleteMedia: (url, productId) => request('/products/delete-media', { method: 'DELETE', body: JSON.stringify({ url, productId }) }),
    deleteImage: (url, productId) => request('/products/delete-image', { method: 'DELETE', body: JSON.stringify({ url, productId }) }),
  },

  // Categories
  categories: {
    getAll: () => request('/categories'),
    getAllAdmin: () => request('/categories/all'),
    getBySlug: (slug, params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/categories/${slug}${query ? `?${query}` : ''}`);
    },
    create: (cat) => request('/categories', { method: 'POST', body: JSON.stringify(cat) }),
    update: (id, cat) => request(`/categories/${id}`, { method: 'PUT', body: JSON.stringify(cat) }),
    delete: (id) => request(`/categories/${id}`, { method: 'DELETE' }),
  },

  // Collections
  collections: {
    getAll: () => request('/collections'),
    getBySlug: (slug) => request(`/collections/${slug}`),
    create: (col) => request('/collections', { method: 'POST', body: JSON.stringify(col) }),
    update: (id, col) => request(`/collections/${id}`, { method: 'PUT', body: JSON.stringify(col) }),
    delete: (id) => request(`/collections/${id}`, { method: 'DELETE' }),
  },

  // Cart
  cart: {
    get: () => request('/cart'),
    add: (productId, quantity, variant) =>
      request('/cart', { method: 'POST', body: JSON.stringify({ productId, quantity, variant }) }),
    updateItem: (itemId, quantity) =>
      request(`/cart/${itemId}`, { method: 'PUT', body: JSON.stringify({ quantity }) }),
    removeItem: (itemId) => request(`/cart/${itemId}`, { method: 'DELETE' }),
    clear: () => request('/cart', { method: 'DELETE' }),
  },

  // Wishlist
  wishlist: {
    get: () => request('/wishlist'),
    toggle: (productId) => request('/wishlist', { method: 'POST', body: JSON.stringify({ productId }) }),
    remove: (productId) => request(`/wishlist/${productId}`, { method: 'DELETE' }),
  },

  // Orders
  orders: {
    create: (orderData) => request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
    getMy: () => request('/orders/my'),
    getSellerOrders: () => request('/orders/seller/my'),
    getById: (id) => request(`/orders/${id}`),
    cancel: (id, reason) => request(`/orders/${id}/cancel`, { method: 'PUT', body: JSON.stringify({ reason }) }),
    return: (id, payload) =>
      request(`/orders/${id}/return`, {
        method: 'PUT',
        body: JSON.stringify(typeof payload === 'string' ? { reason: payload } : payload),
      }),
    deliver: (id) => request(`/orders/${id}/deliver`, { method: 'PUT' }),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ''}`);
    },
    updateStatus: (id, statusData) =>
      request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
    verifyPayment: (id) => request(`/orders/${id}/verify-payment`, { method: 'PUT' }),
  },

  // Customers (Admin)
  customers: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/customers${query ? `?${query}` : ''}`);
    },
    getById: (id) => request(`/admin/customers/${id}`),
    updateStatus: (id, isActive) =>
      request(`/admin/customers/${id}/status`, { method: 'PATCH', body: JSON.stringify({ isActive }) }),
  },

  // Inventory (Admin)
  inventory: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/inventory${query ? `?${query}` : ''}`);
    },
    updateStock: (id, stock) =>
      request(`/admin/inventory/${id}/stock`, { method: 'PATCH', body: JSON.stringify({ stock }) }),
  },

  // Coupons
  coupons: {
    validate: (code, subtotal) =>
      request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
    getAvailable: () => request('/coupons/available'),
    getAll: () => request('/coupons'),
    create: (coupon) => request('/coupons', { method: 'POST', body: JSON.stringify(coupon) }),
    update: (id, coupon) => request(`/coupons/${id}`, { method: 'PUT', body: JSON.stringify(coupon) }),
    toggle: (id) => request(`/coupons/${id}/toggle`, { method: 'PATCH' }),
    delete: (id) => request(`/coupons/${id}`, { method: 'DELETE' }),
  },

  // Reviews
  reviews: {
    getForProduct: (productId) => request(`/products/${productId}/reviews`),
    create: (productId, reviewData) =>
      request(`/products/${productId}/reviews`, { method: 'POST', body: JSON.stringify(reviewData) }),
    getAll: () => request('/reviews/all'),
    updateStatus: (id, status) =>
      request(`/reviews/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) }),
    delete: (id) => request(`/reviews/${id}`, { method: 'DELETE' }),
  },

  // Search
  search: (q, category) => {
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category && category !== 'All Categories') params.set('category', category);
    const qs = params.toString();
    return request(`/search${qs ? `?${qs}` : ''}`);
  },

  // Banners
  banners: {
    getActive: (position) => request(`/banners${position ? `?position=${position}` : ''}`),
    getAll: () => request('/banners/all'),
    create: (banner) => request('/banners', { method: 'POST', body: JSON.stringify(banner) }),
    update: (id, banner) => request(`/banners/${id}`, { method: 'PUT', body: JSON.stringify(banner) }),
    delete: (id) => request(`/banners/${id}`, { method: 'DELETE' }),
  },

  // Settings
  settings: {
    get: () => request('/site-settings'),
    update: (settings) => request('/site-settings', { method: 'PUT', body: JSON.stringify(settings) }),
  },

  // Newsletter
  newsletter: {
    subscribe: (email) => request('/newsletter/subscribe', { method: 'POST', body: JSON.stringify({ email }) }),
    getSubscribers: () => request('/newsletter/subscribers'),
  },

  // Admin Dashboard & User Management
  admin: {
    getStats: () => request('/admin/dashboard'),
    getUsers: () => request('/admin/users'),
    updateUserRole: (id, role) => request(`/admin/users/${id}/role`, { method: 'PUT', body: JSON.stringify({ role }) }),
    deleteUser: (id) => request(`/admin/users/${id}`, { method: 'DELETE' }),
    uploadImage: (formData) => request('/admin/upload', { method: 'POST', body: formData }),
    uploadVideo: (formData) => request('/admin/upload', { method: 'POST', body: formData }),
    uploadMedia: (formData) => request('/admin/upload', { method: 'POST', body: formData }),
    deleteMedia: (url) => request('/admin/delete-image', { method: 'DELETE', body: JSON.stringify({ url }) }),
  },

  // Delivery Partner System
  // Delivery Fleet Partner Operations
  delivery: {
    register: (partnerData) => request('/delivery/register', { method: 'POST', body: JSON.stringify(partnerData) }),
    getProfile: () => request('/delivery/profile'),
    me: () => request('/delivery/me'),
    getAssignments: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/delivery/assignments${q ? `?${q}` : ''}`);
    },
    updateProfile: (profileData) => request('/delivery/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
    toggleOnline: () => request('/delivery/toggle-online', { method: 'PUT' }),
    getOrders: (tab = 'active') => request(`/delivery/orders?tab=${tab}`),
    accept: (id) => request(`/delivery/orders/${id}/accept`, { method: 'PUT' }),
    decline: (id, reason) => request(`/delivery/orders/${id}/decline`, { method: 'PUT', body: JSON.stringify({ reason }) }),
    reachedPickup: (id) => request(`/delivery/orders/${id}/reached-pickup`, { method: 'PUT' }),
    confirmPickup: (id, pickupOtp) => request(`/delivery/orders/${id}/pickup`, { method: 'PUT', body: JSON.stringify({ pickupOtp }) }),
    outForDelivery: (id) => request(`/delivery/orders/${id}/out-for-delivery`, { method: 'PUT' }),
    reachedCustomer: (id) => request(`/delivery/orders/${id}/reached-customer`, { method: 'PUT' }),
    completeDelivery: (id, deliveryOtp) => request(`/delivery/orders/${id}/complete`, { method: 'PUT', body: JSON.stringify({ deliveryOtp }) }),
    failDelivery: (id, reason) => request(`/delivery/orders/${id}/fail`, { method: 'PUT', body: JSON.stringify({ reason }) }),
    reschedule: (id, rescheduledDate, reason) => request(`/delivery/orders/${id}/reschedule`, { method: 'PUT', body: JSON.stringify({ rescheduledDate, reason }) }),
    returnToSeller: (id, reason) => request(`/delivery/orders/${id}/return-to-seller`, { method: 'PUT', body: JSON.stringify({ reason }) }),
    pickupReturn: (id, returnPickupOtp) => request(`/delivery/returns/${id}/pickup`, { method: 'PUT', body: JSON.stringify({ returnPickupOtp }) }),
    submitSupport: (supportData) => request('/delivery/support', { method: 'POST', body: JSON.stringify(supportData) }),
  },

  // Admin Logistics & Returns
  adminLogistics: {
    getDeliveryPartners: () => request('/admin/delivery-partners'),
    getApplications: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/admin/delivery/applications${query ? `?${query}` : ''}`);
    },
    updateApplicationStatus: (id, data) =>
      request(`/admin/delivery/applications/${id}/status`, { method: 'PUT', body: JSON.stringify(data) }),
    assignDeliveryPartner: (orderId, partnerId) => request(`/admin/orders/${orderId}/assign-delivery`, { method: 'PUT', body: JSON.stringify({ partnerId }) }),
    autoAssign: (orderId) => request(`/admin/orders/${orderId}/auto-assign`, { method: 'POST' }),
    getCodReconciliation: () => request('/admin/delivery/cod-reconciliation'),
    settleCod: (partnerId) => request('/admin/delivery/cod-settle', { method: 'POST', body: JSON.stringify({ partnerId }) }),
    getReturns: () => request('/admin/returns'),
    processReturnRefund: (orderId) => request(`/admin/returns/${orderId}/refund`, { method: 'PUT' }),
  },

  // Support / Customer Care
  support: {
    createTicket: (data) => request('/support/tickets', { method: 'POST', body: JSON.stringify(data) }),
    getMyTickets: () => request('/support/tickets'),
    getById: (id) => request(`/support/tickets/${id}`),
    reply: (id, message) => request(`/support/tickets/${id}/reply`, { method: 'POST', body: JSON.stringify({ message }) }),
    close: (id) => request(`/support/tickets/${id}/close`, { method: 'PUT' }),
  },

  // Notifications
  notifications: {
    getAll: () => request('/notifications'),
    markRead: (id) => request(`/notifications/${id}/read`, { method: 'PUT' }),
    markAllRead: () => request('/notifications/read-all', { method: 'PUT' }),
  },

  // Multi-Stage Logistics & Fulfillment Workflow
  logistics: {
    getWarehouses: () => request('/logistics/warehouses'),
    createWarehouse: (data) => request('/logistics/warehouses', { method: 'POST', body: JSON.stringify(data) }),
    getHubs: (warehouseId) => request(`/logistics/hubs${warehouseId ? `?warehouseId=${warehouseId}` : ''}`),
    createHub: (data) => request('/logistics/hubs', { method: 'POST', body: JSON.stringify(data) }),
    getShipments: (params = {}) => {
      const q = new URLSearchParams(params).toString();
      return request(`/logistics/shipments${q ? `?${q}` : ''}`);
    },
    getShipmentById: (id) => request(`/logistics/shipments/${id}`),
    track: (identifier) => request(`/logistics/track/${encodeURIComponent(identifier)}`),
    sellerReady: (id, data = {}) => request(`/logistics/shipments/${id}/seller-ready`, { method: 'PUT', body: JSON.stringify(data) }),
    confirmPickup: (id, data = {}) => request(`/logistics/shipments/${id}/pickup-confirm`, { method: 'PUT', body: JSON.stringify(data) }),
    warehouseReceive: (id, data = {}) => request(`/logistics/shipments/${id}/warehouse-receive`, { method: 'PUT', body: JSON.stringify(data) }),
    scan: (data) => request('/logistics/shipments/scan', { method: 'POST', body: JSON.stringify(data) }),
    sort: (id, data = {}) => request(`/logistics/shipments/${id}/sort`, { method: 'PUT', body: JSON.stringify(data) }),
    dispatchWarehouse: (id, data = {}) => request(`/logistics/shipments/${id}/dispatch-warehouse`, { method: 'PUT', body: JSON.stringify(data) }),
    hubReceive: (id, data = {}) => request(`/logistics/shipments/${id}/hub-receive`, { method: 'PUT', body: JSON.stringify(data) }),
    readyForDelivery: (id) => request(`/logistics/shipments/${id}/ready-for-delivery`, { method: 'PUT' }),
    assignPartner: (id, partnerId) => request(`/logistics/shipments/${id}/assign-delivery-partner`, { method: 'PUT', body: JSON.stringify({ partnerId }) }),
    outForDelivery: (id) => request(`/logistics/shipments/${id}/out-for-delivery`, { method: 'PUT' }),
    deliveryAttempt: (id, data) => request(`/logistics/shipments/${id}/delivery-attempt`, { method: 'PUT', body: JSON.stringify(data) }),
    reschedule: (id, data) => request(`/logistics/shipments/${id}/reschedule`, { method: 'PUT', body: JSON.stringify(data) }),
    deliver: (id, data) => request(`/logistics/shipments/${id}/deliver`, { method: 'PUT', body: JSON.stringify(data) }),
    initiateReturn: (id, data) => request(`/logistics/shipments/${id}/return-initiate`, { method: 'PUT', body: JSON.stringify(data) }),
    updateReturn: (id, data) => request(`/logistics/shipments/${id}/return-update`, { method: 'PUT', body: JSON.stringify(data) }),
    adminOverride: (id, data) => request(`/logistics/shipments/${id}/admin-override`, { method: 'PUT', body: JSON.stringify(data) }),
  },
};

export default api;
