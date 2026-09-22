import React from 'react';
import { Routes, Route, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';

// Common Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import { ProtectedRoute, AdminRoute } from './components/common/ProtectedRoute';

// Store Pages
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import CollectionPage from './pages/CollectionPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SearchResults from './pages/SearchResults';
import Login from './pages/Login';
import Register from './pages/Register';

// Account Pages
import AccountDashboard from './pages/account/AccountDashboard';
import OrderHistory from './pages/account/OrderHistory';
import WishlistPage from './pages/account/WishlistPage';
import AddressBook from './pages/account/AddressBook';

// Static & Policy Pages
import About from './pages/static/About';
import Contact from './pages/static/Contact';
import FAQ from './pages/static/FAQ';
import ShippingPolicy from './pages/static/ShippingPolicy';
import ReturnPolicy from './pages/static/ReturnPolicy';
import PrivacyPolicy from './pages/static/PrivacyPolicy';
import Terms from './pages/static/Terms';
import NotFound from './pages/static/NotFound';

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminLogin from './pages/admin/AdminLogin';
import AdminProducts from './pages/admin/AdminProducts';
import AdminOrders from './pages/admin/AdminOrders';
import AdminCategories from './pages/admin/AdminCategories';
import AdminCollections from './pages/admin/AdminCollections';
import AdminCustomers from './pages/admin/AdminCustomers';
import AdminInventory from './pages/admin/AdminInventory';
import AdminCoupons from './pages/admin/AdminCoupons';
import AdminReviews from './pages/admin/AdminReviews';
import AdminBanners from './pages/admin/AdminBanners';
import AdminSettings from './pages/admin/AdminSettings';

import MobileStickyBar from './components/common/MobileStickyBar';

// Public Layout Wrapper
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen pb-14 lg:pb-0">
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <MobileStickyBar />
    </div>
  );
};

const App = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Routes>
            {/* Public Storefront Routes */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/category/:slug" element={<CategoryPage />} />
              <Route path="/collection/:slug" element={<CollectionPage />} />
              <Route path="/product/:slug" element={<ProductDetail />} />
              <Route path="/search" element={<SearchResults />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<Login />} />

              {/* Customer Account Routes (Protected) */}
              <Route element={<ProtectedRoute />}>
                <Route path="/account" element={<AccountDashboard />} />
                <Route path="/account/orders" element={<OrderHistory />} />
                <Route path="/account/wishlist" element={<WishlistPage />} />
                <Route path="/account/addresses" element={<AddressBook />} />
              </Route>

              {/* Informational & Policy Pages */}
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="/return-policy" element={<ReturnPolicy />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Dedicated Admin Portal Login (Public/Guest) */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Admin Control Center Routes (Protected) */}
            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminLayout />
                </AdminRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="customers" element={<AdminCustomers />} />
              <Route path="inventory" element={<AdminInventory />} />
              <Route path="collections" element={<AdminCollections />} />
              <Route path="coupons" element={<AdminCoupons />} />
              <Route path="reviews" element={<AdminReviews />} />
              <Route path="banners" element={<AdminBanners />} />
              <Route path="settings" element={<AdminSettings />} />
            </Route>
          </Routes>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
