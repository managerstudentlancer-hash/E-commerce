import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vexivo_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const freeShippingThreshold = 50;

  // Persist cart to localStorage
  useEffect(() => {
    localStorage.setItem('vexivo_cart', JSON.stringify(items));
  }, [items]);

  // If user is logged in, optionally sync cart with backend
  useEffect(() => {
    if (isAuthenticated) {
      api.cart.get()
        .then((res) => {
          if (res.success && res.cart && res.cart.items && res.cart.items.length > 0) {
            // merge or use server items
            setItems((prev) => {
              if (prev.length === 0) return res.cart.items;
              return prev;
            });
          }
        })
        .catch(() => {});
    }
  }, [isAuthenticated]);

  const addToCart = (product, quantity = 1, variant = '') => {
    setItems((prevItems) => {
      const pId = product._id || product.id;
      const existingIndex = prevItems.findIndex(
        (item) => (item.product === pId || item.id === pId) && item.variant === variant
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += Number(quantity);
        return updated;
      } else {
        const newItem = {
          id: `${pId}-${variant || 'default'}-${Date.now()}`,
          product: pId,
          name: product.name,
          price: product.price,
          quantity: Number(quantity),
          image: product.thumbnail || (product.images && product.images[0]) || '',
          variant: variant || '',
          slug: product.slug,
        };
        return [...prevItems, newItem];
      }
    });

    // Auto open cart drawer
    setIsCartOpen(true);
  };

  const updateQuantity = (itemId, quantity) => {
    setItems((prevItems) => {
      if (quantity <= 0) {
        return prevItems.filter((item) => item.id !== itemId && item._id !== itemId);
      }
      return prevItems.map((item) => {
        if (item.id === itemId || item._id === itemId) {
          return { ...item, quantity: Number(quantity) };
        }
        return item;
      });
    });
  };

  const removeFromCart = (itemId) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== itemId && item._id !== itemId));
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem('vexivo_cart');
    if (isAuthenticated) {
      api.cart.clear().catch(() => {});
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isCartOpen,
        openCart,
        closeCart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        freeShippingThreshold,
        freeShippingRemaining,
        freeShippingProgress,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export default CartContext;
