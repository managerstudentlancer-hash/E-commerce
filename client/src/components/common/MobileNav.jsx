import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { X, ChevronRight, User, Heart, ShoppingBag, ShieldCheck, Mail, Phone } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';

const navigationLinks = [
  { name: 'New In (Spring/Summer 26)', href: '/collection/new-arrivals', badge: 'LIVE', isHighlight: true },
  { name: 'Women’s Luxury', href: '/category/women' },
  { name: 'Men’s Essentials', href: '/category/men' },
  { name: 'Bags & Luggage', href: '/category/bags' },
  { name: 'Audio & Tech Pro', href: '/category/electronics', badge: 'PRO' },
  { name: 'Footwear & Loafers', href: '/category/shoes' },
  { name: 'Fine Jewellery & 18K', href: '/category/jewellery' },
  { name: 'Timepieces & Horology', href: '/category/watches' },
  { name: 'Outerwear & Coats', href: '/category/outerwear' },
  { name: 'Cashmere & Knitwear', href: '/category/knitwear' },
  { name: 'Beauty & Parfum', href: '/category/beauty' },
  { name: 'Eyewear & Optical', href: '/category/eyewear' },
  { name: 'Bestsellers Archive', href: '/collection/bestsellers' },
  { name: 'Summer Archive Sale', href: '/collection/special-offers', badge: 'UP TO 40%', isSale: true },
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
                  <Link
                    to="/account"
                    onClick={onClose}
                    className="flex items-center space-x-3 py-2.5 text-sm font-medium text-neutral-700 hover:text-black"
                  >
                    <User className="w-4 h-4 text-neutral-500" />
                    <span>My Account ({user?.name?.split(' ')[0]})</span>
                  </Link>
                  {user?.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={onClose}
                      className="flex items-center space-x-3 py-2.5 text-sm font-semibold text-[#C4301C]"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Admin Control Center</span>
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      logout();
                      onClose();
                    }}
                    className="w-full text-left py-2.5 text-xs text-neutral-500 hover:text-red-600 font-medium"
                  >
                    Sign Out
                  </button>
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
              <span>+44 20 7946 0991</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-3.5 h-3.5" />
              <span>arpit123@gmail.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNav;
