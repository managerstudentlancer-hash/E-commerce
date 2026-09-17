import React from 'react';
import { Link } from 'react-router-dom';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const CartDrawer = () => {
  const {
    items,
    isCartOpen,
    closeCart,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingRemaining,
    freeShippingProgress,
  } = useCart();

  if (!isCartOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        onClick={closeCart}
        className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity"
      />

      {/* Drawer Panel */}
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Drawer Header */}
          <div className="p-5 border-b border-neutral-100 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShoppingBag className="w-5 h-5 text-neutral-900" />
              <h2 className="text-base font-bold text-neutral-900 uppercase tracking-wider">
                Shopping Bag ({items.reduce((sum, i) => sum + i.quantity, 0)})
              </h2>
            </div>
            <button
              onClick={closeCart}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-black transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Meter */}
          <div className="bg-neutral-50 px-5 py-3 border-b border-neutral-100">
            <div className="text-xs font-medium text-neutral-700 mb-1.5 flex justify-between">
              <span>
                {freeShippingRemaining === 0 ? (
                  <strong className="text-[#0D8756]">🎉 You have unlocked Free UK Delivery!</strong>
                ) : (
                  <>
                    Add <strong className="text-black">£{freeShippingRemaining.toFixed(2)}</strong> more for Free UK Delivery
                  </>
                )}
              </span>
              <span className="font-bold text-neutral-900">{freeShippingProgress}%</span>
            </div>
            <div className="w-full bg-neutral-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#0D8756] h-full rounded-full transition-all duration-500 ease-out"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-neutral-900">Your bag is empty</h3>
                  <p className="text-xs text-neutral-500 mt-1">Explore our latest arrivals and elevate your everyday lifestyle.</p>
                </div>
                <button
                  onClick={closeCart}
                  className="btn-pill-dark text-xs mt-2"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id || item._id}
                  className="flex space-x-4 pb-4 border-b border-neutral-100 last:border-none"
                >
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';
                    }}
                    className="w-20 h-24 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <h4 className="text-sm font-semibold text-neutral-900 line-clamp-1 pr-2">
                          {item.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id || item._id)}
                          className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      {item.variant && (
                        <p className="text-xs text-neutral-500 mt-0.5 font-medium">
                          Variant: {item.variant}
                        </p>
                      )}
                      <p className="text-sm font-bold text-neutral-900 mt-1">
                        £{item.price.toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity controls */}
                    <div className="flex items-center space-x-2 w-28 border border-neutral-200 rounded-full py-1 px-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-black"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="flex-1 text-center text-xs font-semibold">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-neutral-600 hover:text-black"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Drawer Footer */}
          {items.length > 0 && (
            <div className="p-5 border-t border-neutral-100 bg-neutral-50 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-600">Subtotal</span>
                <span className="text-base font-bold text-neutral-900">
                  £{subtotal.toFixed(2)}
                </span>
              </div>
              <p className="text-[11px] text-neutral-500">
                Taxes and shipping calculated at checkout.
              </p>

              <div className="flex flex-col gap-2 pt-1">
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="btn-pill-dark w-full py-3.5 text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  to="/cart"
                  onClick={closeCart}
                  className="btn-pill-light w-full py-3 text-xs uppercase tracking-wider text-center"
                >
                  View Full Bag
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CartDrawer;
