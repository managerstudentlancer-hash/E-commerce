import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShieldCheck, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const CartPage = () => {
  const {
    items,
    updateQuantity,
    removeFromCart,
    subtotal,
    freeShippingRemaining,
    freeShippingProgress,
  } = useCart();

  const navigate = useNavigate();
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponError, setCouponError] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const shippingCost = subtotal >= 50 || items.length === 0 ? 0 : 3.99;
  const grandTotal = Math.max(0, subtotal - couponDiscount + shippingCost);

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    setCouponError('');
    setIsValidating(true);

    try {
      const res = await api.coupons.validate(couponCode.trim(), subtotal);
      if (res.success && res.valid) {
        setCouponDiscount(res.discount);
        setAppliedCoupon(res.code);
        setCouponCode('');
      } else {
        setCouponError(res.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCouponError(err.message || 'Invalid coupon code');
    } finally {
      setIsValidating(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h1 className="text-2xl font-bold text-neutral-900">Your shopping bag is empty</h1>
        <p className="text-xs text-neutral-500 max-w-sm">
          Discover our curated collections of precision acoustic audio, tailoring, and leathergoods.
        </p>
        <Link to="/shop" className="btn-pill-dark text-xs py-3 px-8">
          Explore Collections
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-neutral-900 tracking-tight uppercase mb-8">
          Your Shopping Bag ({items.reduce((s, i) => s + i.quantity, 0)})
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Items Table / List (2 columns) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Free shipping bar */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100">
              <div className="flex justify-between text-xs font-semibold text-neutral-700 mb-1.5">
                <span>
                  {freeShippingRemaining === 0 ? (
                    <strong className="text-[#0D8756]">🎉 Qualified for Complimentary UK Delivery!</strong>
                  ) : (
                    <>Add £{freeShippingRemaining.toFixed(2)} more for Free Next-Day UK Delivery</>
                  )}
                </span>
                <span>{freeShippingProgress}%</span>
              </div>
              <div className="w-full bg-neutral-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#0D8756] h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            {/* Product items */}
            <div className="divide-y divide-neutral-100 border-t border-b border-neutral-100">
              {items.map((item) => (
                <div key={item.id || item._id} className="py-5 flex space-x-4 sm:space-x-6 items-center">
                  <img
                    src={item.image || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80'}
                    alt={item.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80';
                    }}
                    className="w-20 h-24 sm:w-24 sm:h-28 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                  />

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <Link
                        to={`/product/${item.slug || ''}`}
                        className="text-sm sm:text-base font-bold text-neutral-900 hover:text-black line-clamp-1 pr-2"
                      >
                        {item.name}
                      </Link>
                      <button
                        onClick={() => removeFromCart(item.id || item._id)}
                        className="text-neutral-400 hover:text-red-600 transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {item.variant && (
                      <p className="text-xs text-neutral-500 mt-0.5">Option: {item.variant}</p>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                      {/* Quantity adjuster */}
                      <div className="flex items-center border border-neutral-200 rounded-full py-1 px-3 space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id || item._id, item.quantity - 1)}
                          className="text-neutral-500 hover:text-black"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="text-xs font-bold w-4 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id || item._id, item.quantity + 1)}
                          className="text-neutral-500 hover:text-black"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-sm sm:text-base font-extrabold text-neutral-900">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-between items-center pt-2">
              <Link to="/shop" className="text-xs font-semibold text-neutral-600 hover:text-black underline">
                &larr; Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary Column */}
          <div className="lg:col-span-1">
            <div className="bg-neutral-50 p-6 sm:p-8 rounded-3xl border border-neutral-100 space-y-6">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                Order Summary
              </h2>

              {/* Coupon Form */}
              <form onSubmit={handleApplyCoupon} className="space-y-2">
                <label className="block text-xs font-bold uppercase text-neutral-600">
                  Promo Code
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="e.g. VEX10"
                    className="flex-1 px-4 py-2.5 rounded-full border border-neutral-200 text-xs uppercase font-medium focus:outline-none focus:border-black"
                  />
                  <button
                    type="submit"
                    disabled={isValidating}
                    className="btn-pill-dark px-5 py-2.5 text-xs uppercase"
                  >
                    Apply
                  </button>
                </div>
                {couponError && (
                  <p className="text-xs text-[#C4301C] font-medium">{couponError}</p>
                )}
                {appliedCoupon && (
                  <div className="flex items-center space-x-1.5 text-xs text-[#0D8756] font-bold">
                    <Check className="w-3.5 h-3.5" />
                    <span>Coupon '{appliedCoupon}' applied (-£{couponDiscount.toFixed(2)})</span>
                  </div>
                )}
              </form>

              {/* Breakdown */}
              <div className="space-y-3 pt-2 text-xs text-neutral-600 border-t border-neutral-200">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">£{subtotal.toFixed(2)}</span>
                </div>

                {couponDiscount > 0 && (
                  <div className="flex justify-between text-[#0D8756] font-bold">
                    <span>Discount</span>
                    <span>-£{couponDiscount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated UK Delivery</span>
                  <span className="font-bold text-neutral-900">
                    {shippingCost === 0 ? 'FREE' : `£${shippingCost.toFixed(2)}`}
                  </span>
                </div>

                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-3 border-t border-neutral-200">
                  <span>Total</span>
                  <span>£{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => navigate('/checkout', { state: { couponDiscount, appliedCoupon } })}
                className="btn-pill-dark w-full py-4 text-xs uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-[11px] text-neutral-600 text-center space-y-1">
                <p>🔒 256-Bit SSL Encrypted & Secure Checkout</p>
                <p>Klarna, Apple Pay & PayPal Accepted</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
