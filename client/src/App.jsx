import React, { Suspense, lazy } from 'react';
import { Routes, Route, Outlet, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import { SettingsProvider } from './context/SettingsContext';
import { CategoryProvider } from './context/CategoryContext';

// Common Components (Eagerly Loaded)
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import CartDrawer from './components/common/CartDrawer';
import { ProtectedRoute, AdminRoute, DeliveryRoute } from './components/common/ProtectedRoute';
import MobileStickyBar from './components/common/MobileStickyBar';
import ErrorBoundary from './components/common/ErrorBoundary';
import VexivoAiAssistant from './components/ai/VexivoAiAssistant';

// Primary Storefront Pages (Eagerly Loaded for Immediate First Paint)
import Home from './pages/Home';
import Shop from './pages/Shop';
import CategoryPage from './pages/CategoryPage';
import CollectionPage from './pages/CollectionPage';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import SearchResults from './pages/SearchResults';
import OffersPage from './pages/OffersPage';
import Login from './pages/Login';
import Register from './pages/Register';

// Secondary Account Pages (Lazy Loaded)
const AccountDashboard = lazy(() => import('./pages/account/AccountDashboard'));
const BecomeSeller = lazy(() => import('./pages/account/BecomeSeller'));
const SellerDashboard = lazy(() => import('./pages/account/SellerDashboard'));
const OrderHistory = lazy(() => import('./pages/account/OrderHistory'));
const WishlistPage = lazy(() => import('./pages/account/WishlistPage'));
const AddressBook = lazy(() => import('./pages/account/AddressBook'));

// Static & Policy Pages (Lazy Loaded)
const About = lazy(() => import('./pages/static/About'));
const Contact = lazy(() => import('./pages/static/Contact'));
const FAQ = lazy(() => import('./pages/static/FAQ'));
const ShippingPolicy = lazy(() => import('./pages/static/ShippingPolicy'));
const ReturnPolicy = lazy(() => import('./pages/static/ReturnPolicy'));
const PrivacyPolicy = lazy(() => import('./pages/static/PrivacyPolicy'));
const Terms = lazy(() => import('./pages/static/Terms'));
const NotFound = lazy(() => import('./pages/static/NotFound'));

// Delivery Fleet Pages (Lazy Loaded)
const DeliveryLogin = lazy(() => import('./pages/delivery/DeliveryLogin'));
const DeliveryDashboard = lazy(() => import('./pages/delivery/DeliveryDashboard'));

// Admin Management Suite (Lazy Loaded to Keep Main Storefront Extremely Lean)
const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminLayout = lazy(() => import('./pages/admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'));
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminCategories = lazy(() => import('./pages/admin/AdminCategories'));
const AdminCollections = lazy(() => import('./pages/admin/AdminCollections'));
const AdminCustomers = lazy(() => import('./pages/admin/AdminCustomers'));
const AdminInventory = lazy(() => import('./pages/admin/AdminInventory'));
const AdminCoupons = lazy(() => import('./pages/admin/AdminCoupons'));
const AdminOffers = lazy(() => import('./pages/admin/AdminOffers'));
const AdminReviews = lazy(() => import('./pages/admin/AdminReviews'));
const AdminBanners = lazy(() => import('./pages/admin/AdminBanners'));
const AdminLogo = lazy(() => import('./pages/admin/AdminLogo'));
const AdminSettings = lazy(() => import('./pages/admin/AdminSettings'));
const AdminSupport = lazy(() => import('./pages/admin/AdminSupport'));
const AdminDeliveryApplications = lazy(() => import('./pages/admin/AdminDeliveryApplications'));
const AdminLogistics = lazy(() => import('./pages/admin/AdminLogistics'));
const AdminAiAssistant = lazy(() => import('./pages/admin/AdminAiAssistant'));

// Smooth, Minimal Route Loading Spinner
const RouteLoadingFallback = () => (
  <div className="min-h-[50vh] flex items-center justify-center py-16">
    <div className="w-8 h-8 border-2 border-neutral-900 border-t-transparent rounded-full animate-spin" />
  </div>
);

// Public Layout Wrapper
const PublicLayout = () => {
  return (
    <div className="flex flex-col min-h-screen pb-14 lg:pb-0">
      <Header />
      <main className="flex-1">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
      </main>
      <Footer />
      <CartDrawer />
      <MobileStickyBar />
      <VexivoAiAssistant />
    </div>
  );
};

const App = () => {
  return (
    <SettingsProvider>
      <CategoryProvider>
        <AuthProvider>
          <CartProvider>
            <WishlistProvider>
              <Suspense fallback={<RouteLoadingFallback />}>
                <Routes>
                {/* Public Storefront Routes */}
                <Route element={<PublicLayout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/category/:slug" element={<CategoryPage />} />
                  <Route path="/collection/:slug" element={<CollectionPage />} />
                  <Route path="/product/:slug" element={<ProductDetail />} />
                  <Route path="/search" element={<SearchResults />} />
                  <Route path="/offers" element={<OffersPage />} />
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
                    <Route path="/become-a-seller" element={<BecomeSeller />} />
                    <Route path="/seller/register" element={<BecomeSeller />} />
                    <Route path="/account/seller" element={<SellerDashboard />} />
                  </Route>

                  {/* Informational & Policy Pages */}
                  <Route path="/about" element={<About />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/faq" element={<FAQ />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  <Route path="/return-policy" element={<ReturnPolicy />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms" element={<Terms />} />
                </Route>

                {/* Delivery Fleet Routes */}
                <Route path="/delivery/login" element={<DeliveryLogin />} />
                <Route path="/delivery-login" element={<Navigate to="/delivery/login" replace />} />
                <Route
                  path="/delivery"
                  element={
                    <DeliveryRoute>
                      <DeliveryDashboard />
                    </DeliveryRoute>
                  }
                />

                {/* Dedicated Admin Portal Login (Public/Guest) and URL aliases */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin login" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin%20login" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin-login" element={<Navigate to="/admin/login" replace />} />
                <Route path="/adminlogin" element={<Navigate to="/admin/login" replace />} />
                <Route path="/admin_login" element={<Navigate to="/admin/login" replace />} />

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
                  <Route path="logistics" element={<AdminLogistics />} />
                  <Route path="delivery-applications" element={<AdminDeliveryApplications />} />
                  <Route path="customers" element={<AdminCustomers />} />
                  <Route path="inventory" element={<AdminInventory />} />
                  <Route path="collections" element={<AdminCollections />} />
                  <Route path="users" element={<AdminUsers />} />
                  <Route path="support" element={<AdminSupport />} />
                  <Route path="coupons" element={<AdminCoupons />} />
                  <Route path="offers" element={<AdminOffers />} />
                  <Route path="reviews" element={<AdminReviews />} />
                  <Route path="banners" element={<AdminBanners />} />
                  <Route path="logo" element={<AdminLogo />} />
                  <Route path="ai" element={<AdminAiAssistant />} />
                  <Route path="ai-assistant" element={<AdminAiAssistant />} />
                  <Route path="settings" element={<AdminSettings />} />
                </Route>

                {/* Global Fallback 404 Not Found */}
                <Route element={<PublicLayout />}>
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
              </Suspense>
            </WishlistProvider>
          </CartProvider>
        </AuthProvider>
      </CategoryProvider>
    </SettingsProvider>
  );
};

export default App;
