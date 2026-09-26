import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { CheckCircle2, ShieldCheck, Lock, CreditCard, ArrowRight, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const CheckoutPage = () => {
  const { items, subtotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const initialDiscount = location.state?.couponDiscount || 0;
  const initialCoupon = location.state?.appliedCoupon || '';

  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.addresses?.[0]?.street || '',
    city: user?.addresses?.[0]?.city || '',
    postalCode: user?.addresses?.[0]?.postalCode || '',
    country: user?.addresses?.[0]?.country || 'India',
    deliveryMethod: 'standard', // 'standard' or 'express'
    paymentMethod: 'UPI / QR', // 'UPI / QR', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'
    cardNumber: '4242 •••• •••• 4242',
    cardExp: '12/28',
    cardCvc: '•••',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const shippingCost = formData.deliveryMethod === 'express' ? 6.99 : (subtotal >= 50 ? 0 : 3.99);
  const grandTotal = Math.max(0, subtotal - initialDiscount + shippingCost);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.address || !formData.city || !formData.postalCode || !formData.email) {
      setErrorMsg('Please complete all required customer and shipping fields.');
      return;
    }

    setIsProcessing(true);
    setErrorMsg('');

    try {
      const orderPayload = {
        items: items.map((item) => ({
          product: item.product || item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variant: item.variant,
        })),
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
          phone: formData.phone,
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          postalCode: formData.postalCode,
          country: formData.country,
        },
        paymentMethod: formData.paymentMethod,
        subtotal,
        discount: initialDiscount,
        shipping: shippingCost,
        total: grandTotal,
        coupon: initialCoupon,
        guestEmail: formData.email,
      };

      const res = await api.orders.create(orderPayload);
      if (res.success && res.order) {
        setCompletedOrder(res.order);
        clearCart();
      } else {
        setErrorMsg(res.message || 'Payment authorization failed');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Order submission failed');
    } finally {
      setIsProcessing(false);
    }
  };

  // Success Confirmation Stage
  if (completedOrder) {
    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center py-16 px-4 bg-white text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-50 border border-neutral-100 shadow-xl space-y-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[#0D8756]/10 text-[#0D8756] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#0D8756]">
              Order Confirmed
            </span>
            <h1 className="text-2xl font-extrabold text-neutral-900 mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Your order number is <strong className="text-neutral-900 font-mono">{completedOrder.orderNumber}</strong>.
              A receipt has been dispatched to {formData.email}.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-100 text-left text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-neutral-500">Order Status</span>
              <span className="font-bold text-neutral-900 capitalize">{completedOrder.orderStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Status</span>
              <span className="font-bold text-[#0D8756] uppercase">PAID</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Total Charged</span>
              <span className="font-bold text-neutral-900">₹{completedOrder.total?.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link to="/account/orders" className="btn-pill-dark w-full py-3 text-xs">
              View Order in Account
            </Link>
            <Link to="/" className="btn-pill-light w-full py-3 text-xs">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50 min-h-screen py-10 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-8 border-b border-neutral-200">
          <Link to="/" className="text-2xl font-extrabold tracking-tight text-neutral-900">
            VEXIVO
          </Link>
          <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-600">
            <Lock className="w-3.5 h-3.5 text-[#0D8756]" />
            <span>Secure 256-Bit SSL Checkout</span>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-8">
          {/* Form Column (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {errorMsg && (
              <div className="p-4 rounded-xl bg-red-50 text-[#C4301C] text-xs font-bold border border-red-200">
                {errorMsg}
              </div>
            )}

            {/* 1. Contact Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                1. Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="arpit123@gmail.com"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    required
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Last Name *
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    required
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="input-pill"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Mobile Phone (For delivery SMS alerts)
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+44 7700 900000"
                    className="input-pill"
                  />
                </div>
              </div>
            </div>

            {/* 2. Shipping Address */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  2. Shipping Address
                </h2>
                {user?.addresses && user.addresses.length > 0 && (
                  <span className="text-[11px] font-bold text-blue-600">
                    {user.addresses.length} saved address(es)
                  </span>
                )}
              </div>

              {/* Saved Address 1-Click Picker */}
              {user?.addresses && user.addresses.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 mb-2">
                  <p className="text-[11px] font-bold text-neutral-600 uppercase tracking-wider mb-2">
                    Select a Saved Address:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {user.addresses.map((addr) => {
                      const isSelected = formData.address === addr.street;
                      return (
                        <button
                          key={addr._id}
                          type="button"
                          onClick={() => {
                            setFormData((prev) => ({
                              ...prev,
                              firstName: addr.fullName ? addr.fullName.split(' ')[0] : prev.firstName,
                              lastName: addr.fullName ? addr.fullName.split(' ').slice(1).join(' ') || prev.lastName : prev.lastName,
                              phone: addr.phone || prev.phone,
                              address: addr.street,
                              city: addr.city,
                              postalCode: addr.postalCode,
                              country: addr.country || 'United Kingdom',
                            }));
                          }}
                          className={`p-3 rounded-xl border text-left text-xs transition-all ${
                            isSelected
                              ? 'border-blue-600 bg-blue-50/60 shadow-sm ring-1 ring-blue-600'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-neutral-900 truncate">
                              {addr.fullName || user.name}
                            </span>
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-neutral-100 uppercase text-neutral-600">
                              {addr.addressType || 'Home'}
                            </span>
                          </div>
                          <p className="text-neutral-500 line-clamp-1 mt-1 text-[11px]">
                            {addr.street}, {addr.city} - {addr.postalCode}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Apartment, suite, unit, building, floor..."
                    className="input-pill"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                      City / Town *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="London"
                      className="input-pill"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                      Postal Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="WC2H 9JQ"
                      className="input-pill"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Country / Territory
                  </label>
                  <select
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full px-5 py-3 rounded-full border border-neutral-200 text-xs font-semibold bg-white focus:outline-none focus:border-black"
                  >
                    <option value="United Kingdom">United Kingdom (UK)</option>
                    <option value="Ireland">Ireland</option>
                    <option value="United States">United States</option>
                    <option value="Germany">Germany</option>
                    <option value="France">France</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 3. Delivery Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                3. Delivery Method
              </h2>
              <div className="space-y-2">
                <label className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200 cursor-pointer hover:border-black transition-colors">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="standard"
                      checked={formData.deliveryMethod === 'standard'}
                      onChange={handleInputChange}
                      className="text-black focus:ring-black"
                    />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">
                        Pan-India Standard Delivery (2–4 Working Days)
                      </p>
                      <p className="text-[11px] text-neutral-500">Ekart Logistics & Delhivery Surface</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    {subtotal >= 50 ? 'FREE' : '₹3.99'}
                  </span>
                </label>

                <label className="flex items-center justify-between p-4 rounded-2xl border border-neutral-200 cursor-pointer hover:border-black transition-colors">
                  <div className="flex items-center space-x-3">
                    <input
                      type="radio"
                      name="deliveryMethod"
                      value="express"
                      checked={formData.deliveryMethod === 'express'}
                      onChange={handleInputChange}
                      className="text-black focus:ring-black"
                    />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">
                        Priority Guaranteed Express (1–2 Working Days)
                      </p>
                      <p className="text-[11px] text-neutral-500">BlueDart / Delhivery Air Express</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">₹6.99</span>
                </label>
              </div>
            </div>

            {/* 4. Payment Method */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                4. Payment Method
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['UPI / QR', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: method })}
                    className={`py-3 px-3 rounded-2xl border text-xs font-bold transition-all ${
                      formData.paymentMethod === method
                        ? 'border-black bg-black text-white shadow-sm'
                        : 'border-neutral-200 text-neutral-700 hover:border-black bg-neutral-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>

              {formData.paymentMethod === 'Credit/Debit Card' && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-3 pt-4">
                  <div>
                    <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                        Expiry (MM/YY)
                      </label>
                      <input
                        type="text"
                        name="cardExp"
                        value={formData.cardExp}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold uppercase text-neutral-600 mb-1">
                        CVC Security Code
                      </label>
                      <input
                        type="text"
                        name="cardCvc"
                        value={formData.cardCvc}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-neutral-200 text-xs font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {formData.paymentMethod === 'UPI / QR' && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-2 text-xs">
                  <p className="font-bold text-neutral-900">Instant UPI Payment via Google Pay / PhonePe / Paytm / BHIM</p>
                  <p className="text-neutral-500 text-[11px]">You can verify and approve the payment request directly on your mobile UPI application after confirming.</p>
                </div>
              )}

              {formData.paymentMethod === 'Cash on Delivery' && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-1">
                  <p className="font-bold">Pay on Delivery Available</p>
                  <p className="text-[11px]">Pay conveniently in cash or via QR code when the delivery executive arrives at your address.</p>
                </div>
              )}

              {formData.paymentMethod === 'Net Banking' && (
                <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 text-xs text-neutral-600 space-y-1">
                  <p className="font-bold text-neutral-900">All Major Indian Banks Supported</p>
                  <p className="text-[11px]">HDFC, SBI, ICICI, Axis, Kotak Mahindra, Punjab National Bank and more.</p>
                </div>
              )}
            </div>
          </div>

          {/* Order Review Column (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle sticky top-24 space-y-6">
              <h2 className="text-base font-bold uppercase tracking-wider text-neutral-900">
                Order Review ({items.length})
              </h2>

              {/* Items List */}
              <div className="max-h-72 overflow-y-auto divide-y divide-neutral-100 pr-2 space-y-3">
                {items.map((item) => (
                  <div key={item.id || item._id} className="pt-3 flex space-x-3 items-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-16 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{item.name}</p>
                      {item.variant && (
                        <p className="text-[11px] text-neutral-500">Variant: {item.variant}</p>
                      )}
                      <p className="text-xs text-neutral-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-extrabold text-neutral-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {initialDiscount > 0 && (
                  <div className="flex justify-between text-[#0D8756] font-bold">
                    <span>Discount Code ({initialCoupon})</span>
                    <span>-₹{initialDiscount.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Delivery ({formData.deliveryMethod})</span>
                  <span className="font-bold text-neutral-900">
                    {shippingCost === 0 ? 'FREE' : `₹${shippingCost.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-neutral-900 pt-3 border-t border-neutral-200">
                  <span>Total Amount</span>
                  <span>₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              {/* Place Order CTA */}
              <button
                type="submit"
                disabled={isProcessing}
                className="btn-pill-dark w-full py-4 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Authorizing Payment...</span>
                  </>
                ) : (
                  <>
                    <span>Confirm & Pay ₹{grandTotal.toFixed(2)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 text-center text-[11px] text-neutral-500 space-y-1">
                <p>30-Day Money-Back Guarantee & Return Portal Included</p>
                <p>Encrypted by 256-Bit SSL High-Security Gateway</p>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CheckoutPage;
