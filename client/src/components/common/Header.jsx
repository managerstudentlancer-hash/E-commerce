import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  Sparkles,
  Facebook,
  Instagram,
  Youtube,
  ShieldCheck,
  Package,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useSettings } from '../../context/SettingsContext';
import { useCategories } from '../../context/CategoryContext';
import MobileNav from './MobileNav';

const Header = () => {
  const { settings } = useSettings();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const { user, isAuthenticated, isAdmin } = useAuth();
  const { itemCount, openCart } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const searchCategoryNames = ['All Categories', ...categories.map((c) => c.name)];
  const announcementsList = settings.announcements && settings.announcements.length > 0 
    ? settings.announcements 
    : [settings.announcementText || '✨ FREE UK NEXT-DAY DELIVERY OVER £50'];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsCatDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close all menus on route change
  useEffect(() => {
    setIsCatDropdownOpen(false);
    setActiveDropdown(null);
    setIsMobileNavOpen(false);
  }, [location]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchQuery.trim() && selectedCategory === 'All Categories') return;
    const catParam = selectedCategory !== 'All Categories' ? `&category=${encodeURIComponent(selectedCategory)}` : '';
    navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}${catParam}`);
  };

  return (
    <header className="w-full bg-white border-b border-neutral-100 sticky top-0 z-40">
      {/* 0. Infinite Marquee Announcement Ticker (Dynamic from Settings) */}
      <div className="w-full bg-black text-white text-[11px] font-semibold tracking-wider uppercase py-1.5 overflow-hidden border-b border-neutral-800 select-none">
        <div className="animate-marquee space-x-10 whitespace-nowrap">
          {announcementsList.map((ann, idx) => (
            <span key={idx}>{ann}</span>
          ))}
          {/* Duplicate loop for continuous scrolling */}
          {announcementsList.map((ann, idx) => (
            <span key={`dup-${idx}`}>{ann}</span>
          ))}
        </div>
      </div>

      {/* 1. Top Bar: Help Centre, Career & Social Icons */}
      <div className="w-full bg-white border-b border-neutral-200/80 text-[12px] text-neutral-700 py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Help Centre & Career */}
          <div className="flex items-center space-x-6 font-medium">
            <Link to="/faq" className="hover:text-black transition-colors">
              Help Centre
            </Link>
            <Link to="/about" className="hover:text-black transition-colors">
              Career
            </Link>
          </div>

          {/* Right: Social Media Icons */}
          <div className="flex items-center space-x-4 text-neutral-800">
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="hover:text-[#1877F2] transition-colors"
            >
              <Facebook className="w-3.5 h-3.5 fill-current" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Instagram"
              className="hover:text-[#E4405F] transition-colors"
            >
              <Instagram className="w-3.5 h-3.5" />
            </a>
            {/* TikTok Icon */}
            <a
              href="https://tiktok.com"
              target="_blank"
              rel="noreferrer"
              aria-label="TikTok"
              className="hover:text-black transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.24 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
              </svg>
            </a>
            {/* Pinterest Icon */}
            <a
              href="https://pinterest.com"
              target="_blank"
              rel="noreferrer"
              aria-label="Pinterest"
              className="hover:text-[#BD081C] transition-colors"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345-.09.375-.291 1.199-.332 1.357-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
              </svg>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noreferrer"
              aria-label="YouTube"
              className="hover:text-[#FF0000] transition-colors"
            >
              <Youtube className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Header Row: Logo, Central Search Bar, Sign In & Cart */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-3.5">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileNavOpen(true)}
            aria-label="Open navigation drawer"
            className="lg:hidden p-2 rounded-xl text-neutral-800 hover:bg-neutral-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo: Dynamic Site Name with Speedy Shopping Emblem */}
          <Link to="/" className="flex items-center space-x-2.5 flex-shrink-0 group">
            {/* Playful Speedy Cart Emblem */}
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-md transform group-hover:scale-105 transition-transform duration-300">
              <ShoppingCart className="w-5 h-5 text-white" />
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-yellow-300 rounded-full flex items-center justify-center text-[8px] font-black text-black">
                ★
              </span>
            </div>
            {/* Brand Wordmark */}
            <div className="flex flex-col">
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-neutral-950 font-sans leading-none lowercase">
                {settings.siteName || 'vexivo'}
              </span>
              <span className="text-[8px] font-extrabold uppercase tracking-[0.25em] text-neutral-400 mt-0.5">
                London
              </span>
            </div>
          </Link>

          {/* Central Search Bar with Category Dropdown */}
          <form
            onSubmit={handleSearchSubmit}
            className="hidden md:flex flex-1 max-w-2xl items-center bg-[#F1F3F5] hover:bg-[#EBEEF2] focus-within:bg-white focus-within:ring-2 focus-within:ring-neutral-900 border border-neutral-200/60 focus-within:border-neutral-900 rounded-full px-4 py-2 transition-all shadow-sm"
          >
            {/* Category Selector Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                className="flex items-center space-x-1.5 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black pr-3 focus:outline-none whitespace-nowrap"
              >
                <span>{selectedCategory}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 text-neutral-500 transition-transform duration-200 ${
                    isCatDropdownOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Dropdown Menu */}
              {isCatDropdownOpen && (
                <div className="absolute left-0 top-full mt-3 w-52 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
                  {searchCategoryNames.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat);
                        setIsCatDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-xs font-semibold hover:bg-neutral-50 transition-colors ${
                        selectedCategory === cat ? 'text-black bg-neutral-100 font-bold' : 'text-neutral-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Vertical Divider */}
            <div className="h-4 w-[1px] bg-neutral-300 mx-2 flex-shrink-0" />

            {/* Search Input Field */}
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="What are you looking for?"
              className="w-full bg-transparent text-xs sm:text-sm text-neutral-900 placeholder-neutral-500 focus:outline-none px-2"
            />

            {/* Search Submit Button */}
            <button
              type="submit"
              aria-label="Search"
              className="text-neutral-700 hover:text-black p-1 hover:scale-110 active:scale-95 transition-transform"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </form>

          {/* Right Action Icons: Sign in / Register & Cart */}
          <div className="flex items-center space-x-3 sm:space-x-4 flex-shrink-0">

            {/* Sign in / Register / Account */}
            <div className="relative group">
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-neutral-800 hover:text-black transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-neutral-100 group-hover:bg-neutral-200 flex items-center justify-center transition-colors">
                  <User className="w-4 h-4 text-neutral-700" />
                </div>
                <span className="hidden sm:inline-block">
                  {isAuthenticated ? `Hi, ${user?.name?.split(' ')[0]}` : 'Sign in/ Register'}
                </span>
              </Link>

              {/* Account Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-dropdown border border-neutral-100 p-2 hidden group-hover:block z-50 animate-fade-in">
                {isAuthenticated ? (
                  <div className="space-y-1">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <p className="text-xs font-bold text-neutral-900 truncate">{user?.name}</p>
                      <p className="text-[11px] text-neutral-500 truncate">{user?.email}</p>
                      {isAdmin && (
                        <span className="inline-block px-2 py-0.5 mt-1 bg-red-100 text-[#C4301C] text-[9px] font-extrabold rounded-full uppercase">
                          Administrator
                        </span>
                      )}
                    </div>
                    {isAdmin && (
                      <Link to="/admin" className="flex items-center space-x-2 px-3 py-2 text-xs font-bold text-white bg-[#C4301C] hover:bg-red-700 rounded-xl my-1 transition-colors">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Go to Admin Portal</span>
                      </Link>
                    )}
                    <Link to="/account" className="block px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 rounded-xl">
                      My Account Dashboard
                    </Link>
                    <Link to="/account/orders" className="block px-3 py-2 text-xs text-neutral-700 hover:bg-neutral-50 rounded-xl">
                      Order History
                    </Link>
                  </div>
                ) : (
                  <div className="p-2 space-y-2">
                    <Link to="/login" className="btn-pill-dark w-full py-2.5 text-xs text-center block">
                      Sign In
                    </Link>
                    <Link to="/register" className="btn-pill-light w-full py-2.5 text-xs text-center block">
                      Create Account
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Cart Icon in Circular Soft Button */}
            <button
              onClick={openCart}
              aria-label={`Cart with ${itemCount} items`}
              className="relative w-11 h-11 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-800 transition-all duration-200 active:scale-95"
            >
              <ShoppingCart className="w-5 h-5 text-neutral-800" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[#C4301C] text-white text-[11px] font-bold flex items-center justify-center shadow-md animate-fade-in">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Row */}
        <form onSubmit={handleSearchSubmit} className="mt-2.5 flex md:hidden items-center bg-[#F1F3F5] rounded-full px-4 py-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="What are you looking for?"
            className="w-full bg-transparent text-xs text-neutral-800 placeholder-neutral-500 focus:outline-none"
          />
          <button type="submit" aria-label="Search" className="text-neutral-700">
            <Search className="w-4 h-4" />
          </button>
        </form>
      </div>

      {/* 3. Subnav Row: Home, ✨ Fashion ▾ ✨, Shop by categories ▾, More Category ▾, Trending ▾ */}
      <div className="w-full bg-[#FAF9FD] border-y border-neutral-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex items-center space-x-6 sm:space-x-8 text-xs sm:text-[13px] font-bold text-neutral-800 overflow-x-auto no-scrollbar">
          {/* Home */}
          <Link to="/" className="flex-shrink-0 hover:text-black transition-colors whitespace-nowrap">
            Home
          </Link>

          {/* ✨ Fashion ▾ ✨ with Sparkles */}
          <div
            className="relative group py-1 flex-shrink-0"
            onMouseEnter={() => setActiveDropdown('fashion')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <Link
              to="/category/women"
              className="flex items-center space-x-1.5 text-purple-700 hover:text-purple-900 font-extrabold whitespace-nowrap transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
              <span>Fashion</span>
              <ChevronDown className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform" />
              <Sparkles className="w-3.5 h-3.5 text-purple-600 animate-pulse" />
            </Link>

            {/* Fashion Dropdown */}
            {activeDropdown === 'fashion' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 animate-fade-in">
                <Link to="/category/women" className="block px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 rounded-xl">
                  Women's Wear
                </Link>
                <Link to="/category/men" className="block px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 rounded-xl">
                  Men's Wear
                </Link>
                <Link to="/category/kids" className="block px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 rounded-xl">
                  Kids' Wear
                </Link>
                <Link to="/category/shoes" className="block px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 rounded-xl">
                  Footwear & Shoes
                </Link>
                <Link to="/category/hats" className="block px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 rounded-xl">
                  Hats & Caps
                </Link>
              </div>
            )}
          </div>

          {/* Shop by categories ▾ */}
          <div
            className="relative group py-1 flex-shrink-0"
            onMouseEnter={() => setActiveDropdown('shop_by_categories')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center space-x-1 hover:text-black transition-colors whitespace-nowrap">
              <span>Shop by categories</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:rotate-180 transition-transform" />
            </button>

            {/* Dropdown */}
            {activeDropdown === 'shop_by_categories' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
                {categories.slice(0, 6).map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="block px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 rounded-xl capitalize"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* More Category ▾ */}
          <div
            className="relative group py-1 flex-shrink-0"
            onMouseEnter={() => setActiveDropdown('more_category')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <button className="flex items-center space-x-1 hover:text-black transition-colors whitespace-nowrap">
              <span>More Category</span>
              <ChevronDown className="w-3.5 h-3.5 text-neutral-500 group-hover:rotate-180 transition-transform" />
            </button>

            {/* Dropdown */}
            {activeDropdown === 'more_category' && (
              <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 animate-fade-in max-h-80 overflow-y-auto">
                {categories.slice(6).map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    className="block px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-50 rounded-xl capitalize"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Trending ▾ (Interactive Pill with Dropdown & Direct Navigation) */}
          <div
            className="relative group py-1 flex-shrink-0"
            onMouseEnter={() => setActiveDropdown('trending')}
            onMouseLeave={() => setActiveDropdown(null)}
          >
            <div className="flex items-center">
              <Link
                to="/collection/bestsellers"
                className="bg-black text-white hover:bg-neutral-800 px-4 py-1.5 rounded-full flex items-center space-x-1.5 text-xs font-bold whitespace-nowrap shadow-sm active:scale-95 transition-all"
              >
                <span>Trending</span>
                <ChevronDown
                  className={`w-3 h-3 text-neutral-300 transition-transform duration-200 ${
                    activeDropdown === 'trending' ? 'rotate-180' : ''
                  }`}
                />
              </Link>
            </div>

            {/* Trending Dropdown Menu */}
            {activeDropdown === 'trending' && (
              <div className="absolute right-0 top-full mt-1 w-60 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 animate-fade-in divide-y divide-neutral-100">
                <div className="space-y-1 pb-1.5">
                  <Link
                    to="/collection/bestsellers"
                    className="flex items-center justify-between px-3 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors"
                  >
                    <span>🔥 Bestsellers Archive</span>
                    <span className="text-[10px] bg-red-100 text-[#C4301C] px-1.5 py-0.5 rounded-full font-bold">HOT</span>
                  </Link>
                  <Link
                    to="/collection/new-arrivals"
                    className="flex items-center justify-between px-3 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors"
                  >
                    <span>✨ New Arrivals 2026</span>
                    <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-bold">NEW</span>
                  </Link>
                  <Link
                    to="/collection/special-offers"
                    className="flex items-center justify-between px-3 py-2 text-xs font-bold text-[#C4301C] hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <span>⚡ Flash Sale & Offers</span>
                    <span className="text-[10px] bg-[#C4301C] text-white px-1.5 py-0.5 rounded-full font-bold">-40%</span>
                  </Link>
                  <Link
                    to="/collection/minimalist-luxury"
                    className="flex items-center justify-between px-3 py-2 text-xs font-bold text-neutral-900 hover:bg-neutral-50 rounded-xl transition-colors"
                  >
                    <span>💎 Minimalist Luxury</span>
                  </Link>
                </div>
                <div className="pt-1.5">
                  <Link
                    to="/shop"
                    className="block px-3 py-2 text-center text-xs font-extrabold text-purple-700 hover:bg-purple-50 rounded-xl transition-colors"
                  >
                    Browse All 27+ Products →
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </header>
  );
};

export default Header;

