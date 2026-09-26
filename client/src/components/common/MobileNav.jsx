import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, User, Heart, ShoppingBag, ShieldCheck, Package, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const navigationLinks = [
  { name: 'New In (Spring/Summer 26)', href: '/collection/new-arrivals', badge: 'LIVE', isHighlight: true },
  { name: 'Women Wear', href: '/category/women-wear' },
  { name: 'Men Wear', href: '/category/men-wear' },
  { name: 'Kids Wear', href: '/category/kids-wear' },
  { name: 'Shoes & Footwear', href: '/category/shoes' },
  { name: 'Beauty & Parfum', href: '/category/beauty' },
  { name: 'Fine Jewellery', href: '/category/jewellery' },
  { name: 'Bags & Luggage', href: '/category/bags' },
  { name: 'Hats & Headwear', href: '/category/hats' },
  { name: 'Vision Care', href: '/category/vision-care' },
  { name: 'Pets Care', href: '/category/pets-care' },
  { name: 'Toys & Games', href: '/category/toys' },
  { name: 'Health & Fitness', href: '/category/health-fitness' },
  { name: 'Electronics & Audio', href: '/category/electronics' },
  { name: 'Home & Living', href: '/category/home-living' },
  { name: 'Bestsellers Archive', href: '/collection/bestsellers' },
  { name: 'Seasonal Sale', href: '/collection/special-offers', badge: 'UP TO 40%', isSale: true },
];

const MobileNav = ({ isOpen, onClose }) => {
  const { user, isAuthenticated, logout } = useAuth();
  const { wishlistCount } = useWishlist();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in lg:hidden">
      {/* Backdrop */}
      <div onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Drawer */}
      <div className="absolute inset-y-0 left-0 max-w-full flex pr-10">
        <div className="w-screen max-w-sm bg-white shadow-2xl flex flex-col justify-between">
          {/* Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <Link to="/" onClick={onClose} className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tighter text-neutral-900">
                VEXIVO
              </span>
            </Link>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-5 py-4 divide-y divide-neutral-100">
            <div className="space-y-1 pb-4">
              {navigationLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={onClose}
                  className="flex items-center justify-between py-3 text-sm font-semibold text-neutral-800 hover:text-black transition-colors"
                >
                  <span className={link.isSale ? 'text-[#C4301C] font-bold' : ''}>
                    {link.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    {link.badge && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          link.isSale ? 'bg-[#C4301C] text-white' : 'bg-[#0D8756] text-white'
                        }`}
                      >
                        {link.badge}
                      </span>
                    )}
                    <ChevronRight className="w-4 h-4 text-neutral-400" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Quick Actions (Wishlist & Account) */}
            <div className="pt-4 space-y-2">
              <Link
                to="/account/wishlist"
                onClick={onClose}
                className="flex items-center justify-between py-2.5 text-sm font-medium text-neutral-700 hover:text-black"
              >
                <div className="flex items-center space-x-3">
                  <Heart className="w-4 h-4 text-neutral-500" />
                  <span>Wishlist</span>
                </div>
                {wishlistCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-neutral-900 text-white text-[10px] font-bold flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {isAuthenticated ? (
                <>
                  <div className="p-3 bg-neutral-50 rounded-2xl mb-1">
                    <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                    <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                    <span className={`inline-block mt-1.5 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                      user?.role === 'admin'
                        ? 'bg-purple-100 text-purple-700'
                        : user?.isSeller
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {user?.role === 'admin' ? 'Admin' : user?.isSeller ? 'Verified Seller' : 'Verified Shopper'}
                    </span>
                  </div>

                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center space-x-3 py-2 text-sm font-medium text-neutral-700 hover:text-black"
                  >
                    <User className="w-4 h-4 text-neutral-500" />
                    <span>My Account</span>
                  </Link>

                  {user?.role === 'admin' ? (
                    <>
                      <Link
                        to="/admin"
                        onClick={onClose}
                        className="flex items-center space-x-3 py-2 text-sm font-bold text-[#C4301C] hover:bg-red-50 rounded-xl px-2 -mx-2"
                      >
                        <ShieldCheck className="w-4 h-4 text-[#C4301C]" />
                        <span>Admin Dashboard</span>
                      </Link>
                      <Link
                        to="/admin/products"
                        onClick={onClose}
                        className="flex items-center space-x-3 py-2 text-sm font-medium text-neutral-700 hover:text-black px-2 -mx-2"
                      >
                        <Package className="w-4 h-4 text-neutral-500" />
                        <span>Manage Products</span>
                      </Link>
                      <Link
                        to="/admin/users"
                        onClick={onClose}
                        className="flex items-center space-x-3 py-2 text-sm font-medium text-neutral-700 hover:text-black px-2 -mx-2"
                      >
                        <User className="w-4 h-4 text-neutral-500" />
                        <span>Manage Users</span>
                      </Link>
                    </>
                  ) : user?.isSeller ? (
                    <>
                      <Link
                        to="/account/seller"
                        onClick={onClose}
                        className="flex items-center space-x-3 py-2 text-sm font-bold text-purple-700 hover:bg-purple-50 rounded-xl px-2 -mx-2"
                      >
                        <Package className="w-4 h-4 text-purple-600" />
                        <span>Seller Dashboard</span>
                      </Link>
                      <Link
                        to="/account?tab=orders"
                        onClick={onClose}
                        className="flex items-center space-x-3 py-2 text-sm font-medium text-neutral-700 hover:text-black"
                      >
                        <ShoppingBag className="w-4 h-4 text-neutral-500" />
                        <span>My Purchases</span>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/account?tab=orders"
                        onClick={onClose}
                        className="flex items-center space-x-3 py-2 text-sm font-medium text-neutral-700 hover:text-black"
                      >
                        <ShoppingBag className="w-4 h-4 text-neutral-500" />
                        <span>My Orders</span>
                      </Link>
                      <Link
                        to="/account?tab=coupons"
                        onClick={onClose}
                        className="flex items-center space-x-3 py-2 text-sm font-medium text-neutral-700 hover:text-black"
                      >
                        <Package className="w-4 h-4 text-neutral-500" />
                        <span>Available Coupons</span>
                      </Link>
                      <Link
                        to="/become-a-seller"
                        onClick={onClose}
                        className="flex items-center space-x-3 py-2 text-sm font-bold text-amber-700 hover:bg-amber-50 rounded-xl px-2 -mx-2"
                      >
                        <Store className="w-4 h-4 text-amber-600" />
                        <span>Become a Seller</span>
                      </Link>
                    </>
                  )}

                  <div className="pt-2 border-t border-neutral-100">
                    <button
                      onClick={() => {
                        logout();
                        onClose();
                      }}
                      className="w-full text-left py-2 text-xs text-red-600 hover:text-red-700 font-bold"
                    >
                      Sign Out
                    </button>
                  </div>
                </>
              ) : (
                <div className="pt-2 flex flex-col gap-2">
                  <Link
                    to="/login"
                    onClick={onClose}
                    className="btn-pill-dark w-full py-2.5 text-xs text-center"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={onClose}
                    className="btn-pill-light w-full py-2.5 text-xs text-center"
                  >
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* Footer Assistance */}
          <div className="p-5 bg-neutral-50 border-t border-neutral-100 text-xs text-neutral-500 space-y-2">
            <div className="flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5" />
              <span>+91 80000 12345</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5" />
              <span>support@vexivo.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
