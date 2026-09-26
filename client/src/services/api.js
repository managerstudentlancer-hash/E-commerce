const API_URL = '/api';

const request = async (endpoint, options = {}) => {
  const token = localStorage.getItem('vexivo_token');
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  // If uploading FormData, delete Content-Type to let browser set boundary
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
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
    return: (id, reason) => request(`/orders/${id}/return`, { method: 'PUT', body: JSON.stringify({ reason }) }),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ''}`);
    },
    updateStatus: (id, statusData) =>
      request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
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
  search: (q) => request(`/search?q=${encodeURIComponent(q || '')}`),

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
};

export default api;
