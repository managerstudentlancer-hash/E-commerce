import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('vexivo_wishlist');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.products)) return parsed.products;
      return [];
    } catch {
      return [];
    }
  });

  const safeWishlist = Array.isArray(wishlist) ? wishlist : [];

  useEffect(() => {
    localStorage.setItem('vexivo_wishlist', JSON.stringify(safeWishlist));
  }, [safeWishlist]);

  // Sync with API when logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.wishlist.get()
        .then((res) => {
          if (res.success && Array.isArray(res.products)) {
            setWishlist(res.products);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    if (!product) return false;
    const pId = product._id || product.id;
    const currentList = Array.isArray(wishlist) ? wishlist : [];
    const exists = currentList.some((item) => (item?._id || item?.id || item) === pId);

    if (exists) {
      setWishlist((prev) => (Array.isArray(prev) ? prev.filter((item) => (item?._id || item?.id || item) !== pId) : []));
      if (isAuthenticated) {
        api.wishlist.remove(pId).catch(() => {});
      }
      return false; // removed
    } else {
      setWishlist((prev) => (Array.isArray(prev) ? [...prev, product] : [product]));
      if (isAuthenticated) {
        api.wishlist.toggle(pId).catch(() => {});
      }
      return true; // added
    }
  };

  const isInWishlist = (productId) => {
    if (!productId || !Array.isArray(wishlist)) return false;
    return wishlist.some((item) => (item?._id || item?.id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist: safeWishlist,
        wishlistCount: safeWishlist.length,
        toggleWishlist,
        isInWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

export default WishlistContext;
