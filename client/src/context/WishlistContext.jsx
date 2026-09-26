import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('vexivo_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('vexivo_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  // Sync with API when logged in
  useEffect(() => {
    if (isAuthenticated) {
      api.wishlist.get()
        .then((res) => {
          if (res.success && res.products) {
            setWishlist(res.products);
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const toggleWishlist = async (product) => {
    const pId = product._id || product.id;
    const exists = wishlist.some((item) => (item._id || item.id || item) === pId);

    if (exists) {
      setWishlist((prev) => prev.filter((item) => (item._id || item.id || item) !== pId));
      if (isAuthenticated) {
        api.wishlist.remove(pId).catch(() => {});
      }
      return false; // removed
    } else {
      setWishlist((prev) => [...prev, product]);
      if (isAuthenticated) {
        api.wishlist.toggle(pId).catch(() => {});
      }
      return true; // added
    }
  };

  const isInWishlist = (productId) => {
    return wishlist.some((item) => (item._id || item.id || item) === productId);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
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
