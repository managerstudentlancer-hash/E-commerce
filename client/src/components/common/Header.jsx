import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingCart,
  User,
  Menu,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Package,
  Heart,
  Store,
  Gift,
  CreditCard,
  Bell,
  Headphones,
  LogOut,
  X,
  ShoppingBag,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useSettings } from '../../context/SettingsContext';
import MobileNav from './MobileNav';
import SearchModal from './SearchModal';

const searchCategories = [
  'All Categories',
  'Women Wear',
  'Men Wear',
  'Beauty',
  'Fragrances',
  'Skin Care',
  'Fine Jewellery',
  'Bags & Luggage',
  'Shoes & Footwear',
  'Sunglasses',
  'Furniture',
  'Home Decoration',
  'Kitchen Accessories',
  'Groceries',
  'Laptops',
  'Smartphones',
  'Tablets',
  'Mobile Accessories',
  'Sports Accessories',
  'Motorcycles',
  'Vehicles',
];

const categorySlugMap = {
  'Women Wear': 'women-wear',
  'Men Wear': 'men-wear',
  'Mens Wear': 'men-wear',
  'Kids Wear': 'kids-wear',
  'Shoes': 'womens-shoes',
  'Shoes & Footwear': 'womens-shoes',
  'Beauty': 'beauty',
  'Fragrances': 'fragrances',
  'Skin Care': 'skin-care',
  'Jewellery': 'womens-jewellery',
  'Fine Jewellery': 'womens-jewellery',
  'Bags': 'womens-bags',
  'Bags & Luggage': 'womens-bags',
  'Hats': 'hats',
  'Vision Care': 'sunglasses',
  'Sunglasses': 'sunglasses',
  'Pets Care': 'pets-care',
  'Toys': 'toys',
  'Health & Fitness': 'sports-accessories',
  'Sports Accessories': 'sports-accessories',
  'Electronics': 'smartphones',
  'Laptops': 'laptops',
  'Smartphones': 'smartphones',
  'Tablets': 'tablets',
  'Mobile Accessories': 'mobile-accessories',
  'Home & Living': 'furniture',
  'Furniture': 'furniture',
  'Home Decoration': 'home-decoration',
  'Kitchen Accessories': 'kitchen-accessories',
  'Groceries': 'groceries',
  'Motorcycles': 'motorcycle',
  'Vehicles': 'vehicle',
};

const Header = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('EN');

  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { settings } = useSettings();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();
  const searchInputRef = useRef(null);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setIsMobileNavOpen(false);
    setSearchOpen(false);
  }, [location]);

  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setSearchOpen(false);
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md border-b border-neutral-100/80 sticky top-0 z-40 transition-all shadow-[0_2px_15px_rgba(0,0,0,0.02)]">
      {/* 1. Reference Top Bar: Free shipping announcement + Utility links */}
      <div className="w-full bg-[#FAFAFA] border-b border-neutral-200/60 text-[11px] sm:text-xs text-neutral-500 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Left: Free shipping & Easy returns */}
          <div className="flex items-center space-x-2.5">
            <span className="font-medium text-neutral-600">
              Free shipping on all orders over $50
            </span>
            <span className="text-neutral-300">|</span>
            <span className="font-medium text-neutral-600">
              Easy returns
            </span>
          </div>

          {/* Right: Help & Support, Track Order, Currency, Language */}
          <div className="hidden sm:flex items-center space-x-4 sm:space-x-5 font-medium">
            <Link to="/faq" className="hover:text-neutral-900 transition-colors">
              Help &amp; Support
            </Link>
            <Link to="/account/orders" className="hover:text-neutral-900 transition-colors">
              Track Order
            </Link>
            
            <div className="flex items-center space-x-1 cursor-pointer hover:text-neutral-900 transition-colors">
              <span>{currency}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>

            <div className="flex items-center space-x-1 cursor-pointer hover:text-neutral-900 transition-colors">
              <span>{language}</span>
              <ChevronDown className="w-3 h-3 text-neutral-400" />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Reference Navigation Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
        <div className="flex items-center justify-between gap-4">
          
          {/* Left: Mobile Drawer Trigger + Brand Logo */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            <button
              onClick={() => setIsMobileNavOpen(true)}
              aria-label="Open mobile navigation"
              className="lg:hidden p-1.5 rounded-lg text-neutral-800 hover:bg-neutral-100 transition-colors"
            >
              <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            {/* Logo matching Reference Screenshot ("Shopio." weight and aesthetic) */}
            <Link to="/" className="flex items-center space-x-1.5 flex-shrink-0 group">
              {settings?.logo ? (
                <img
                  src={settings.logo}
                  alt={settings?.siteName || 'VEXIVO'}
                  className="h-8 sm:h-9 w-auto max-w-[160px] object-contain"
                />
              ) : (
                <div className="flex items-center">
                  <span className="text-2xl sm:text-[1.75rem] font-black tracking-tight text-neutral-950 font-sans leading-none">
                    {settings?.siteName ? settings.siteName : 'Shopio'}
                  </span>
                  <span className="w-2 h-2 rounded-full bg-amber-400 ml-0.5 inline-block" />
                </div>
              )}
            </Link>
          </div>

          {/* Center Navigation Links (Matching Reference Screenshot) */}
          <nav className="hidden lg:flex items-center space-x-7 text-[13px] font-semibold text-neutral-700">
            {/* Home */}
            <Link
              to="/"
              className={`transition-colors ${
                isActive('/') && location.pathname === '/'
                  ? 'text-neutral-950 font-bold'
                  : 'hover:text-black'
              }`}
            >
              Home
            </Link>

            {/* Shop */}
            <Link
              to="/shop"
              className={`transition-colors ${
                isActive('/shop') ? 'text-neutral-950 font-bold' : 'hover:text-black'
              }`}
            >
              Shop
            </Link>

            {/* Categories Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 hover:text-black transition-colors focus:outline-none cursor-pointer">
                <span>Categories</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 transition-transform duration-200" />
              </button>

              {activeDropdown === 'categories' && (
                <div className="absolute left-0 top-full mt-1 w-80 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2.5 z-50 animate-fade-in">
                  <div className="grid grid-cols-2 gap-0.5">
                    {searchCategories.slice(1).map((cat) => (
                      <Link
                        key={cat}
                        to={`/category/${categorySlugMap[cat] || cat.toLowerCase().replace(/\s+/g, '-')}`}
                        className="block px-3 py-2 text-xs font-semibold text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl transition-colors"
                      >
                        {cat}
                      </Link>
                    ))}
                  </div>
                  <div className="pt-2 mt-1 border-t border-neutral-100 px-3">
                    <Link
                      to="/shop"
                      className="block text-center text-xs font-bold text-neutral-900 hover:underline"
                    >
                      View All Departments →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Deals */}
            <Link
              to="/collection/special-offers"
              className={`transition-colors ${
                isActive('/collection/special-offers')
                  ? 'text-neutral-950 font-bold'
                  : 'hover:text-black'
              }`}
            >
              Deals
            </Link>

            {/* New Arrivals */}
            <Link
              to="/collection/new-arrivals"
              className={`transition-colors ${
                isActive('/collection/new-arrivals')
                  ? 'text-neutral-950 font-bold'
                  : 'hover:text-black'
              }`}
            >
              New Arrivals
            </Link>

            {/* Pages Dropdown */}
            <div
              className="relative py-2"
              onMouseEnter={() => setActiveDropdown('pages')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button className="flex items-center space-x-1 hover:text-black transition-colors focus:outline-none">
                <span>Pages</span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-400 transition-transform duration-200" />
              </button>

              {activeDropdown === 'pages' && (
                <div className="absolute left-0 top-full mt-1 w-52 bg-white rounded-2xl shadow-xl border border-neutral-100 p-2 z-50 animate-fade-in space-y-0.5">
                  <Link
                    to="/about"
                    className="block px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl"
                  >
                    About Us
                  </Link>
                  <Link
                    to="/contact"
                    className="block px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl"
                  >
                    Contact Us
                  </Link>
                  <Link
                    to="/faq"
                    className="block px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl"
                  >
                    FAQ Centre
                  </Link>
                  <Link
                    to="/shipping-policy"
                    className="block px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl"
                  >
                    Shipping Policy
                  </Link>
                  <Link
                    to="/return-policy"
                    className="block px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl"
                  >
                    Return Policy
                  </Link>
                  <Link
                    to="/become-a-seller"
                    className="block px-3 py-2 text-xs font-bold text-neutral-900 bg-neutral-50 hover:bg-neutral-100 rounded-xl mt-1"
                  >
                    Become a Seller
                  </Link>
                </div>
              )}
            </div>
          </nav>

          {/* Right Action Icons (Matching Reference Screenshot: Search, Account, Wishlist, Cart) */}
          <div className="flex items-center space-x-3 sm:space-x-4">
            
            {/* 1. Search Icon Button */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                aria-label="Search products"
                className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
              >
                <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </button>

              <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
            </div>

            {/* 2. Account / Sign In Icon Button */}
            <div className="relative group">
              <Link
                to={isAuthenticated ? '/account' : '/login'}
                aria-label="Customer account"
                className="w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
              >
                <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </Link>

              {/* Account Dropdown Menu (Preserving Customer/Seller Auth & Separation) */}
              <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-neutral-200/90 p-2 hidden group-hover:block z-50 animate-fade-in font-sans">
                {isAuthenticated ? (
                  <div className="px-3 py-2.5 border-b border-neutral-100 flex items-center justify-between">
                    <div>
                      <p className="text-[10px] text-neutral-400 font-medium">Signed in as</p>
                      <p className="text-xs font-bold text-neutral-900 truncate max-w-[150px]">{user?.name}</p>
                    </div>
                    {user?.isSeller && (
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 uppercase">
                        Seller
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="px-3 py-2.5 border-b border-neutral-100 flex items-center justify-between">
                    <span className="text-xs text-neutral-800">New customer?</span>
                    <Link to="/register" className="text-xs font-bold text-blue-600 hover:underline">
                      Sign Up
                    </Link>
                  </div>
                )}

                <div className="py-1 space-y-0.5">
                  <Link
                    to="/account?tab=profile"
                    className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-neutral-500" />
                    <span>My Profile</span>
                  </Link>

                  <Link
                    to="/account/orders"
                    className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl transition-colors"
                  >
                    <Package className="w-4 h-4 text-neutral-500" />
                    <span>Orders</span>
                  </Link>

                  <Link
                    to="/account/wishlist"
                    className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl transition-colors"
                  >
                    <Heart className="w-4 h-4 text-neutral-500" />
                    <span>Wishlist</span>
                  </Link>

                  <Link
                    to="/account?tab=support"
                    className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl transition-colors"
                  >
                    <Headphones className="w-4 h-4 text-neutral-500" />
                    <span>24x7 Customer Care</span>
                  </Link>

                  <Link
                    to="/offers"
                    className="flex items-center justify-between px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl transition-colors group/offers"
                  >
                    <div className="flex items-center space-x-2.5">
                      <Gift className="w-4 h-4 text-rose-500 transition-transform group-hover/offers:scale-110" />
                      <span>Offers &amp; Gift Cards</span>
                    </div>
                    <span className="text-[9px] font-black px-1.5 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                      NEW
                    </span>
                  </Link>

                  {/* Customer / Seller Mode Toggle */}
                  <Link
                    to={user?.isSeller ? '/account/seller' : '/become-a-seller'}
                    className="flex items-center space-x-2.5 px-3 py-2 text-xs font-medium text-neutral-700 hover:bg-neutral-50 hover:text-black rounded-xl transition-colors"
                  >
                    <Store className="w-4 h-4 text-neutral-500" />
                    <span>{user?.isSeller ? 'Seller Dashboard' : 'Become a Seller'}</span>
                  </Link>

                  {isAuthenticated ? (
                    <div className="pt-1 mt-1 border-t border-neutral-100">
                      <button
                        onClick={logout}
                        className="flex items-center space-x-2.5 w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Log Out</span>
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 mt-1 border-t border-neutral-100">
                      <Link
                        to="/login"
                        className="block w-full text-center py-2 rounded-xl bg-neutral-950 hover:bg-black text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        Sign In
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* 3. Wishlist Icon Button */}
            <Link
              to="/account/wishlist"
              aria-label="Wishlist"
              className="relative w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-950 text-white text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* 4. Cart Icon Button (Reference Shopping Bag Icon with count badge) */}
            <button
              onClick={openCart}
              aria-label={`Cart with ${itemCount} items`}
              className="relative w-9 h-9 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-700 hover:text-black transition-colors"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-neutral-950 text-white text-[9px] font-bold flex items-center justify-center">
                  {itemCount}
                </span>
              )}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <MobileNav isOpen={isMobileNavOpen} onClose={() => setIsMobileNavOpen(false)} />
    </header>
  );
};

export default Header;
