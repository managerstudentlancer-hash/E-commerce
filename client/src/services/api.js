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
    register: (userData) => request('/auth/register', { method: 'POST', body: JSON.stringify(userData) }),
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    logout: () => request('/auth/logout', { method: 'POST' }),
    getMe: () => request('/auth/me'),
    updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
    changePassword: (passwords) => request('/auth/password', { method: 'PUT', body: JSON.stringify(passwords) }),
  },

  // Products
  products: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/products${query ? `?${query}` : ''}`);
    },
    getBySlug: (slug) => request(`/products/${slug}`),
    create: (product) => request('/products', { method: 'POST', body: JSON.stringify(product) }),
    update: (id, product) => request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
    delete: (id) => request(`/products/${id}`, { method: 'DELETE' }),
    uploadImage: (formData) => request('/products/upload-image', { method: 'POST', body: formData }),
  },

  // Categories
  categories: {
    getAll: () => request('/categories'),
    getBySlug: (slug) => request(`/categories/${slug}`),
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
    getById: (id) => request(`/orders/${id}`),
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/orders${query ? `?${query}` : ''}`);
    },
    updateStatus: (id, statusData) =>
      request(`/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(statusData) }),
  },

  // Coupons
  coupons: {
    validate: (code, subtotal) =>
      request('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),
    getAll: () => request('/coupons'),
    create: (coupon) => request('/coupons', { method: 'POST', body: JSON.stringify(coupon) }),
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

  // Admin Dashboard
  admin: {
    getStats: () => request('/admin/dashboard'),
  },
};

export default api;
