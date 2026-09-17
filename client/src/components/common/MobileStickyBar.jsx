import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Compass, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';

const MobileStickyBar = () => {
  const location = useLocation();
  const { itemCount, openCart } = useCart();
  const { wishlistCount } = useWishlist();
  const { isAuthenticated } = useAuth();

  // Hide on admin routes or checkout
  if (location.pathname.startsWith('/admin') || location.pathname === '/checkout') {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: Compass },
    { label: 'Wishlist', href: '/account/wishlist', icon: Heart, count: wishlistCount },
    { label: 'Bag', isCart: true, icon: ShoppingBag, count: itemCount },
    { label: 'Account', href: isAuthenticated ? '/account' : '/login', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-4px_16px_rgba(0,0,0,0.06)] lg:hidden">
      <div className="flex items-center justify-around h-14 px-2">
        {navItems.map((item, idx) => {
          const Icon = item.icon;
          const isActive = item.href && location.pathname === item.href;

          if (item.isCart) {
            return (
              <button
                key={idx}
                onClick={openCart}
                aria-label={`Open shopping bag with ${item.count} items`}
                className="relative flex flex-col items-center justify-center flex-1 h-full py-1 text-neutral-700 active:scale-90 transition-transform"
              >
                <div className="relative">
                  <Icon className="w-5 h-5 text-neutral-800" />
                  {item.count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#C4301C] text-white text-[9px] font-black flex items-center justify-center">
                      {item.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-bold mt-0.5 tracking-tight text-neutral-800">
                  {item.label}
                </span>
              </button>
            );
          }

          return (
            <Link
              key={idx}
              to={item.href}
              className={`relative flex flex-col items-center justify-center flex-1 h-full py-1 active:scale-90 transition-all ${
                isActive ? 'text-black' : 'text-neutral-500 hover:text-neutral-800'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'text-black stroke-[2.5]' : 'text-neutral-500 stroke-[1.8]'
                  }`}
                />
                {item.count > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-neutral-900 text-white text-[9px] font-black flex items-center justify-center">
                    {item.count}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-bold mt-0.5 tracking-tight ${
                  isActive ? 'text-black font-extrabold' : 'text-neutral-500'
                }`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default MobileStickyBar;