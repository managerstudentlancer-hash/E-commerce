import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Link, useLocation } from 'react-router-dom';
import {
  X,
  ChevronRight,
  User,
  Heart,
  ShoppingBag,
  ShieldCheck,
  Package,
  Phone,
  Store,
  Home,
  Sparkles,
  Flame,
  HelpCircle,
  LogOut,
  LogIn,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';

// All store categories with direct links
const storeCategories = [
  { name: 'Sarees & Ethnic Wear', slug: 'sarees', badge: 'Trending', isHot: true },
  { name: 'Women Wear', slug: 'women-wear' },
  { name: 'Men Wear', slug: 'men-wear' },
  { name: 'Beauty & Skincare', slug: 'beauty' },
  { name: 'Fragrances & Perfumes', slug: 'fragrances' },
  { name: 'Fine Jewellery', slug: 'womens-jewellery' },
  { name: 'Watches & Sunglasses', slug: 'sunglasses' },
  { name: 'Bags & Handbags', slug: 'womens-bags' },
  { name: 'Shoes & Footwear', slug: 'womens-shoes' },
  { name: 'Electronics & Mobiles', slug: 'smartphones' },
  { name: 'Home & Living', slug: 'furniture' },
];

const MobileNav = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();
  const { settings } = useSettings();
  const location = useLocation();

  // Prevent background scrolling while mobile drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[9999] lg:hidden animate-fade-in font-sans">
      {/* 1. Backdrop Overlay */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-neutral-950/70 backdrop-blur-xs transition-opacity duration-300"
        aria-hidden="true"
      />

      {/* 2. Slide-out Navigation Drawer */}
      <div className="fixed inset-y-0 left-0 w-[84vw] max-w-[330px] bg-white h-full shadow-2xl flex flex-col z-[10000] overflow-hidden">
        
        {/* Top Header: Brand Logo & Close Button */}
        <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/90 flex-shrink-0">
          <Link to="/" onClick={onClose} className="flex items-center space-x-2">
            {settings?.logo ? (
              <img
                src={settings.logo}
                alt={settings?.siteName || 'VEXIVO'}
                className="h-7 w-auto max-w-[130px] object-contain"
              />
            ) : (
              <div className="flex items-center">
                <span className="text-xl font-black tracking-tight text-neutral-950">
                  {settings?.siteName || 'Shopio'}
                </span>
                <span className="w-2 h-2 rounded-full bg-amber-400 ml-0.5 inline-block" />
              </div>
            )}
          </Link>

          <button
            onClick={onClose}
            aria-label="Close menu"
            className="w-8 h-8 rounded-full bg-white border border-neutral-200 text-neutral-600 hover:text-black flex items-center justify-center transition-all shadow-xs active:scale-90"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Profile / Login Welcome Banner */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-neutral-950 to-neutral-800 text-white flex-shrink-0 shadow-xs">
          {isAuthenticated ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0">
                <div className="w-9 h-9 rounded-full bg-amber-400 text-neutral-950 font-black text-sm flex items-center justify-center flex-shrink-0 shadow-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate max-w-[150px]">
                    Hi, {user?.name || 'Customer'}
                  </p>
                  <p className="text-[10px] text-neutral-300 truncate max-w-[150px]">
                    {user?.email}
                  </p>
                </div>
              </div>

              <Link
                to="/account"
                onClick={onClose}
                className="text-[11px] font-bold text-amber-300 hover:text-white px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex-shrink-0"
              >
                Profile →
              </Link>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-bold text-white">Welcome Shopper</p>
                <p className="text-[10px] text-neutral-300">Sign in to track orders &amp; offers</p>
              </div>
              <Link
                to="/login"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-white text-neutral-950 text-xs font-bold hover:bg-neutral-100 transition-colors flex items-center space-x-1 shadow-xs active:scale-95 flex-shrink-0"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>Login</span>
              </Link>
            </div>
          )}
        </div>

        {/* Scrollable Navigation Body */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
          
          {/* Section 1: Store Main Links */}
          <div className="space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 pb-0.5">
              Explore Store
            </p>

            <Link
              to="/"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                location.pathname === '/'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <Home className="w-4 h-4" />
                <span>Home</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              to="/shop"
              onClick={onClose}
              className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold transition-colors ${
                location.pathname === '/shop'
                  ? 'bg-neutral-950 text-white shadow-xs'
                  : 'text-neutral-800 hover:bg-neutral-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <ShoppingBag className="w-4 h-4" />
                <span>All Products / Shop Catalog</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 opacity-60" />
            </Link>

            <Link
              to="/collection/special-offers"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-neutral-800 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Flame className="w-4 h-4 text-red-500" />
                <span>Deals &amp; Special Offers</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-red-100 text-red-600">
                40% OFF
              </span>
            </Link>

            <Link
              to="/collection/new-arrivals"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-bold text-neutral-800 hover:bg-emerald-50 hover:text-emerald-700 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>New Arrivals</span>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700">
                NEW
              </span>
            </Link>
          </div>

          {/* Section 2: Shop by Department */}
          <div className="pt-2 border-t border-neutral-100 space-y-1">
            <div className="flex items-center justify-between px-2 pb-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                Shop By Department
              </span>
              <Layers className="w-3 h-3 text-neutral-400" />
            </div>

            <div className="space-y-0.5">
              {storeCategories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-300" />
                    <span className={cat.isHot ? 'font-bold text-neutral-950' : ''}>
                      {cat.name}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    {cat.badge && (
                      <span className="text-[9px] font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 uppercase">
                        {cat.badge}
                      </span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Section 3: Orders, Wishlist & Services */}
          <div className="pt-2 border-t border-neutral-100 space-y-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-2 pb-0.5">
              Orders &amp; Account
            </p>

            <Link
              to="/account/orders"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Package className="w-4 h-4 text-neutral-500" />
                <span>Track My Orders</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
            </Link>

            <Link
              to="/account/wishlist"
              onClick={onClose}
              className="flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold text-neutral-800 hover:bg-neutral-50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Heart className="w-4 h-4 text-neutral-500" />
                <span>My Wishlist</span>
              </div>
              {wishlistCount > 0 ? (
                <span className="w-5 h-5 rounded-full bg-neutral-950 text-white text-[10px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              ) : (
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              )}
            </Link>

            {/* Sell on Marketplace Card */}
            <div className="pt-2">
              <Link
                to="/become-a-seller"
                onClick={onClose}
                className="block p-3 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200/80 hover:border-amber-300 transition-all shadow-2xs group"
              >
                <div className="flex items-center space-x-2.5 mb-1.5">
                  <div className="w-7 h-7 rounded-xl bg-amber-500 text-neutral-950 flex items-center justify-center shadow-xs">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-xs font-black text-neutral-950 block leading-tight">
                      Sell on VEXIVO
                    </span>
                    <span className="text-[10px] text-amber-900 font-medium">
                      Become a marketplace partner
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1.5 border-t border-amber-200/60 text-[10px] font-bold text-amber-950">
                  <span>Open Seller Portal</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </Link>
            </div>

            {/* Admin / Seller Dashboards */}
            {isAuthenticated && (
              <div className="pt-2 space-y-1">
                {user?.role === 'admin' && (
                  <Link
                    to="/admin"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Dashboard</span>
                  </Link>
                )}

                {user?.isSeller && (
                  <Link
                    to="/account/seller"
                    onClick={onClose}
                    className="flex items-center space-x-3 px-3 py-2 rounded-xl text-xs font-bold text-purple-700 bg-purple-50 hover:bg-purple-100 transition-colors"
                  >
                    <Package className="w-4 h-4" />
                    <span>Seller Dashboard</span>
                  </Link>
                )}

                <button
                  onClick={() => {
                    logout();
                    onClose();
                  }}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 text-xs font-bold text-neutral-500 hover:text-red-600 hover:bg-neutral-50 rounded-xl transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            )}
          </div>

        </div>

        {/* Footer: Help & Support info */}
        <div className="p-3.5 bg-neutral-50 border-t border-neutral-100 text-[11px] text-neutral-500 flex-shrink-0">
          <div className="flex items-center justify-between text-neutral-700 font-medium">
            <a href="tel:+918000012345" className="flex items-center space-x-1.5 hover:text-black">
              <Phone className="w-3.5 h-3.5 text-neutral-400" />
              <span>+91 80000 12345</span>
            </a>
            <Link to="/faq" onClick={onClose} className="hover:text-black flex items-center space-x-1">
              <HelpCircle className="w-3.5 h-3.5 text-neutral-400" />
              <span>Help Center</span>
            </Link>
          </div>
        </div>

      </div>
    </div>,
    document.body
  );
};

export default MobileNav;
