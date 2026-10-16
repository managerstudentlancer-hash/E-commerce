import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';
import { useSettings } from './SettingsContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const { settings } = useSettings();
  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('vexivo_cart');
      if (!saved) return [];
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.items)) return parsed.items;
      return [];
    } catch {
      return [];
    }
  });
  const [isCartOpen, setIsCartOpen] = useState(false);

  const freeShippingThreshold = settings?.freeShippingThreshold !== undefined ? Number(settings.freeShippingThreshold) : 499;

  // Coupon State & Persistence
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    try {
      return localStorage.getItem('vexivo_applied_coupon') || '';
    } catch {
      return '';
    }
  });

  const [couponDiscount, setCouponDiscount] = useState(() => {
    try {
      const val = localStorage.getItem('vexivo_coupon_discount');
      return val ? Number(val) : 0;
    } catch {
      return 0;
    }
  });

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

  const addToCart = (productInput, quantity = 1, variant = '') => {
    if (!productInput) return;

    // Resolve product object or order item (preserve real Product ID over order subdocument ID)
    const prodObj =
      typeof productInput === 'object' && productInput.product && typeof productInput.product === 'object'
        ? productInput.product
        : (typeof productInput === 'object' ? productInput : null);

    const pId =
      typeof productInput === 'string'
        ? productInput
        : String(prodObj?._id || prodObj?.id || productInput?._id || productInput?.product || `prod-${Date.now()}`);

    const resolvedProduct = prodObj ? { ...productInput, ...prodObj, _id: pId } : productInput;

    const name = resolvedProduct.name || resolvedProduct.title || 'Marketplace Item';
    const price = Number(resolvedProduct.price) || 0;
    const image =
      resolvedProduct.image ||
      resolvedProduct.thumbnail ||
      (resolvedProduct.images && resolvedProduct.images[0]) ||
      '';
    const itemVariant = variant || resolvedProduct.variant || '';
    const slug = resolvedProduct.slug || '';
    const qty = Math.max(1, Number(quantity) || 1);

    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => (item.product === pId || item.id === pId) && item.variant === itemVariant
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += qty;
        return updated;
      } else {
        const newItem = {
          id: `${pId}-${itemVariant || 'default'}-${Date.now()}`,
          product: pId,
          name,
          price,
          quantity: qty,
          image,
          variant: itemVariant,
          slug,
        };
        return [...prevItems, newItem];
      }
    });

    setIsCartOpen(true);
  };

  const addMultipleToCart = (productsArray = []) => {
    if (!Array.isArray(productsArray) || productsArray.length === 0) return;

    setItems((prevItems) => {
      let updated = [...prevItems];

      for (const itemInput of productsArray) {
        if (!itemInput) continue;
        const prodObj =
          typeof itemInput === 'object' && itemInput.product && typeof itemInput.product === 'object'
            ? itemInput.product
            : (typeof itemInput === 'object' ? itemInput : null);

        const pId =
          typeof itemInput === 'string'
            ? itemInput
            : String(prodObj?._id || prodObj?.id || itemInput?._id || itemInput?.product || `prod-${Date.now()}`);

        const resolved = prodObj ? { ...itemInput, ...prodObj, _id: pId } : itemInput;

        const name = resolved.name || resolved.title || 'Marketplace Item';
        const price = Number(resolved.price) || 0;
        const image =
          resolved.image ||
          resolved.thumbnail ||
          (resolved.images && resolved.images[0]) ||
          '';
        const itemVariant = resolved.variant || '';
        const slug = resolved.slug || '';
        const qty = Math.max(1, Number(resolved.quantity || 1));

        const existingIndex = updated.findIndex(
          (it) => (it.product === pId || it.id === pId) && it.variant === itemVariant
        );

        if (existingIndex > -1) {
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + qty,
          };
        } else {
          updated.push({
            id: `${pId}-${itemVariant || 'default'}-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            product: pId,
            name,
            price,
            quantity: qty,
            image,
            variant: itemVariant,
            slug,
          });
        }
      }

      return updated;
    });

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

  const applyCoupon = async (code, currentSubtotal = subtotal) => {
    const cleanCode = (code || '').trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code' };
    }
    try {
      const res = await api.coupons.validate(cleanCode, currentSubtotal);
      if (res.success && res.valid) {
        setAppliedCoupon(res.code);
        setCouponDiscount(res.discount);
        try {
          localStorage.setItem('vexivo_applied_coupon', res.code);
          localStorage.setItem('vexivo_coupon_discount', String(res.discount));
        } catch {}
        return { success: true, message: res.message, discount: res.discount, code: res.code };
      } else {
        return { success: false, message: res.message || 'Invalid coupon code' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Failed to apply coupon' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
    setCouponDiscount(0);
    try {
      localStorage.removeItem('vexivo_applied_coupon');
      localStorage.removeItem('vexivo_coupon_discount');
    } catch {}
  };

  const clearCart = () => {
    setItems([]);
    removeCoupon();
    localStorage.removeItem('vexivo_cart');
    if (isAuthenticated) {
      api.cart.clear().catch(() => {});
    }
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const safeItems = Array.isArray(items) ? items : [];
  const itemCount = safeItems.reduce((acc, item) => acc + (Number(item?.quantity) || 1), 0);
  const subtotal = safeItems.reduce((acc, item) => acc + ((Number(item?.price) || 0) * (Number(item?.quantity) || 1)), 0);
  const freeShippingRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  // Dynamic re-validation of coupon discount when subtotal changes
  useEffect(() => {
    if (appliedCoupon && subtotal > 0) {
      api.coupons.validate(appliedCoupon, subtotal)
        .then((res) => {
          if (res.success && res.valid) {
            setCouponDiscount(res.discount);
            try {
              localStorage.setItem('vexivo_coupon_discount', String(res.discount));
            } catch {}
          } else {
            removeCoupon();
          }
        })
        .catch(() => {});
    } else if (subtotal === 0 && appliedCoupon) {
      removeCoupon();
    }
  }, [subtotal, appliedCoupon]);

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
        addMultipleToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        freeShippingThreshold,
        freeShippingRemaining,
        freeShippingProgress,
        appliedCoupon,
        couponDiscount,
        applyCoupon,
        removeCoupon,
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
