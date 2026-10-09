import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  Lock,
  CreditCard,
  ArrowRight,
  Loader2,
  MapPin,
  QrCode,
  Smartphone,
  Building2,
  Wallet,
  Banknote,
  RefreshCw,
  Info,
  Check,
  Shield,
  Sparkles,
  X,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { INDIAN_STATES } from '../utils/indiaConstants';

const TOP_INDIAN_BANKS = [
  { code: 'HDFC', name: 'HDFC Bank', color: '#004C8F', short: 'HDFC' },
  { code: 'SBI', name: 'State Bank of India', color: '#280071', short: 'SBI' },
  { code: 'ICICI', name: 'ICICI Bank', color: '#F37021', short: 'ICICI' },
  { code: 'AXIS', name: 'Axis Bank', color: '#97144D', short: 'Axis' },
  { code: 'KOTAK', name: 'Kotak Mahindra', color: '#ED1C24', short: 'Kotak' },
  { code: 'PNB', name: 'Punjab National Bank', color: '#A20E37', short: 'PNB' },
];

const ALL_OTHER_BANKS = [
  'Bank of Baroda',
  'Canara Bank',
  'Union Bank of India',
  'IndusInd Bank',
  'Federal Bank',
  'IDFC FIRST Bank',
  'Yes Bank',
  'Indian Bank',
  'Central Bank of India',
  'RBL Bank',
  'Bank of India',
  'UCO Bank',
  'South Indian Bank',
  'Punjab & Sind Bank',
  'Karur Vysya Bank',
  'Bandhan Bank',
];

const CheckoutPage = () => {
  const {
    items,
    subtotal,
    clearCart,
    removeFromCart,
    appliedCoupon,
    couponDiscount,
    applyCoupon,
    removeCoupon,
  } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const effectiveDiscount = couponDiscount || location.state?.couponDiscount || 0;
  const effectiveCoupon = appliedCoupon || location.state?.appliedCoupon || '';

  const [checkoutCouponCode, setCheckoutCouponCode] = useState('');
  const [checkoutCouponLoading, setCheckoutCouponLoading] = useState(false);
  const [checkoutCouponError, setCheckoutCouponError] = useState('');
  const [checkoutCouponSuccess, setCheckoutCouponSuccess] = useState('');
  const [availableCoupons, setAvailableCoupons] = useState([]);

  // Fetch available store coupons
  useEffect(() => {
    api.coupons
      .getAvailable()
      .then((res) => {
        if (res.success && res.coupons) {
          setAvailableCoupons(res.coupons);
        }
      })
      .catch(() => {});
  }, []);

  const handleApplyCheckoutCoupon = async (e, directCode = null) => {
    if (e && e.preventDefault) e.preventDefault();
    const targetCode = directCode || checkoutCouponCode;
    if (!targetCode.trim()) return;
    setCheckoutCouponError('');
    setCheckoutCouponSuccess('');
    setCheckoutCouponLoading(true);

    try {
      const res = await applyCoupon(targetCode.trim(), subtotal);
      if (res.success) {
        setCheckoutCouponSuccess(res.message || `Coupon '${res.code}' applied!`);
        setCheckoutCouponCode('');
      } else {
        setCheckoutCouponError(res.message || 'Invalid coupon code');
      }
    } catch (err) {
      setCheckoutCouponError(err.message || 'Failed to apply coupon');
    } finally {
      setCheckoutCouponLoading(false);
    }
  };

  const [formData, setFormData] = useState(() => {
    try {
      const saved = sessionStorage.getItem('vexivo_checkout_form');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...parsed,
          email: user?.email || parsed.email || '',
        };
      }
    } catch {}
    return {
      firstName: user?.name?.split(' ')[0] || '',
      lastName: user?.name?.split(' ').slice(1).join(' ') || '',
      email: user?.email || '',
      phone: user?.phone || user?.addresses?.[0]?.phone || '',
      address: user?.addresses?.[0]?.street || '',
      landmark: user?.addresses?.[0]?.landmark || '',
      city: user?.addresses?.[0]?.city || '',
      state: user?.addresses?.[0]?.state || 'Rajasthan',
      postalCode: user?.addresses?.[0]?.postalCode || '',
      country: 'India',
      deliveryMethod: 'standard', // 'standard' or 'express'
      paymentMethod: 'UPI / QR', // 'UPI / QR', 'Credit/Debit Card', 'Net Banking', 'Cash on Delivery', 'Wallets'
      cardNumber: '',
      cardExp: '',
      cardCvc: '',
      cardHolder: user?.name || '',
    };
  });

  // Indian Payment Specific State
  const [upiMode, setUpiMode] = useState('qr'); // 'qr' or 'id'
  const [upiId, setUpiId] = useState('');
  const [upiVerified, setUpiVerified] = useState(false);
  const [selectedBank, setSelectedBank] = useState('HDFC');
  const [otherBank, setOtherBank] = useState('');
  const [selectedWallet, setSelectedWallet] = useState('paytm');
  const [saveCard, setSaveCard] = useState(true);
  const [codCaptcha, setCodCaptcha] = useState(() => Math.floor(100 + Math.random() * 900));
  const [userCodCaptchaInput, setUserCodCaptchaInput] = useState('');
  const [qrExpirySeconds, setQrExpirySeconds] = useState(299); // 5 min countdown for QR
  const [upiUtr, setUpiUtr] = useState('');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [cardOtp, setCardOtp] = useState('');
  const [otpTimer, setOtpTimer] = useState(120);
  const [otpError, setOtpError] = useState('');

  // 3D Secure Timer Countdown
  useEffect(() => {
    let interval;
    if (showOtpModal) {
      setOtpTimer(120);
      interval = setInterval(() => {
        setOtpTimer((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [showOtpModal]);

  // QR Code Timer Countdown
  useEffect(() => {
    if (formData.paymentMethod === 'UPI / QR' && upiMode === 'qr') {
      const timer = setInterval(() => {
        setQrExpirySeconds((prev) => (prev > 0 ? prev - 1 : 299));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [formData.paymentMethod, upiMode]);

  // Format QR timer string
  const formatTimer = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `0${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Card brand auto-detection
  const getCardBrand = (num = '') => {
    const clean = num.replace(/\s+/g, '');
    if (clean.startsWith('4')) return 'Visa';
    if (/^(5[1-5]|2[2-7])/.test(clean)) return 'MasterCard';
    if (/^(60|65|81|82|508)/.test(clean)) return 'RuPay';
    if (/^3[47]/.test(clean)) return 'Amex';
    return 'RuPay / Visa';
  };

  // Persist form values so users don't lose data on page refresh
  useEffect(() => {
    try {
      sessionStorage.setItem('vexivo_checkout_form', JSON.stringify(formData));
    } catch {}
  }, [formData]);

  const [isProcessing, setIsProcessing] = useState(false);
  const [completedOrder, setCompletedOrder] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const shippingCost = formData.deliveryMethod === 'express' ? 99 : (subtotal >= 499 ? 0 : 49);
  const grandTotal = Math.max(0, subtotal - effectiveDiscount + shippingCost);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'postalCode') {
      const numeric = value.replace(/\D/g, '').slice(0, 6);
      setFormData((prev) => ({ ...prev, postalCode: numeric }));
      return;
    }
    if (name === 'phone') {
      const numeric = value.replace(/[^\d+ ]/g, '').slice(0, 15);
      setFormData((prev) => ({ ...prev, phone: numeric }));
      return;
    }
    if (name === 'cardNumber') {
      const digits = value.replace(/\D/g, '').slice(0, 16);
      const formatted = digits.match(/.{1,4}/g)?.join(' ') || digits;
      setFormData((prev) => ({ ...prev, cardNumber: formatted }));
      return;
    }
    if (name === 'cardExp') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      const formatted = digits.length >= 3 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits;
      setFormData((prev) => ({ ...prev, cardExp: formatted }));
      return;
    }
    if (name === 'cardCvc') {
      const digits = value.replace(/\D/g, '').slice(0, 4);
      setFormData((prev) => ({ ...prev, cardCvc: digits }));
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const effectiveEmail = user?.email || formData.email;
    if (!formData.firstName || !formData.address || !formData.city || !formData.postalCode || !formData.state || !effectiveEmail) {
      setErrorMsg('Kripya sabhi required customer details aur address fields fill karein.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (formData.postalCode.length !== 6) {
      setErrorMsg('Kripya valid 6-digit Indian PIN code enter karein (e.g. 302017).');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Payment validation
    if (formData.paymentMethod === 'Cash on Delivery') {
      if (userCodCaptchaInput.trim() !== String(codCaptcha)) {
        setErrorMsg(`Kripya Cash on Delivery confirm karne ke liye screen par diya gaya 3-digit security code (${codCaptcha}) enter karein.`);
        return;
      }
    }

    if (formData.paymentMethod === 'UPI / QR') {
      if (upiMode === 'id' && (!upiId || !upiId.includes('@'))) {
        setErrorMsg('Kripya valid UPI ID enter karein (e.g. yourname@okhdfcbank).');
        return;
      }
      if (!upiUtr || upiUtr.trim().length !== 12) {
        setErrorMsg('Kripya UPI App (PhonePe/GPay/Paytm) par payment complete karne ke baad mila hua 12-digit UTR / Reference No. enter karein taaki payment verify ho sake.');
        return;
      }
    }

    if (formData.paymentMethod === 'Credit/Debit Card') {
      const cleanNum = (formData.cardNumber || '').replace(/\s+/g, '');
      if (cleanNum.length < 15) {
        setErrorMsg('Kripya valid 16-digit card number enter karein.');
        return;
      }
      if (!formData.cardExp || !formData.cardCvc) {
        setErrorMsg('Kripya valid Expiry Date aur CVV enter karein.');
        return;
      }
      // Open Bank 3D Secure 2.0 verification modal
      setOtpError('');
      setCardOtp('');
      setShowOtpModal(true);
      return;
    }

    if (formData.paymentMethod === 'Net Banking') {
      if (!selectedBank && !otherBank) {
        setErrorMsg('Kripya checkout complete karne ke liye apna Bank select karein.');
        return;
      }
    }

    await executeOrderSubmission();
  };

  const handleVerifyCardOtp = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!cardOtp || cardOtp.trim().length !== 6) {
      setOtpError('Kripya valid 6-digit Bank OTP enter karein.');
      return;
    }
    setOtpError('');
    const success = await executeOrderSubmission({
      is3dSecureVerified: true,
      authCode: `AUTH-3DS-${Date.now().toString().slice(-6)}`,
      cardLast4: (formData.cardNumber || '').replace(/\s+/g, '').slice(-4),
      cardBrand: getCardBrand(formData.cardNumber),
    });
    if (success) {
      setShowOtpModal(false);
    }
  };

  const executeOrderSubmission = async (paymentDetailsParam = null) => {
    setIsProcessing(true);
    setErrorMsg('');

    try {
      const effectiveEmail = user?.email || formData.email;

      let paymentDetails = paymentDetailsParam || {};
      if (formData.paymentMethod === 'UPI / QR') {
        paymentDetails = {
          utrNumber: upiUtr.trim(),
          transactionId: `UPI-${upiUtr.trim()}`,
          gateway: 'Direct UPI / Dynamic QR',
        };
      } else if (formData.paymentMethod === 'Net Banking') {
        paymentDetails = {
          bank: selectedBank || otherBank,
          gateway: 'Net Banking Gateway',
        };
      } else if (formData.paymentMethod === 'Wallets') {
        paymentDetails = {
          wallet: selectedWallet,
          gateway: 'Digital Wallet Gateway',
        };
      }

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
          landmark: formData.landmark || '',
          city: formData.city,
          state: formData.state || 'Rajasthan',
          postalCode: formData.postalCode,
          country: 'India',
          phone: formData.phone,
        },
        billingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          state: formData.state || 'Rajasthan',
          postalCode: formData.postalCode,
          country: 'India',
        },
        paymentMethod: formData.paymentMethod,
        paymentDetails,
        subtotal,
        discount: effectiveDiscount,
        shipping: shippingCost,
        total: grandTotal,
        coupon: effectiveCoupon,
        guestEmail: effectiveEmail,
      };

      const res = await api.orders.create(orderPayload);
      if (res.success && res.order) {
        setCompletedOrder(res.order);
        clearCart();
        try { sessionStorage.removeItem('vexivo_checkout_form'); } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return true;
      } else {
        const msg = res.message || 'Payment authorization failed';
        setErrorMsg(msg);
        setOtpError(msg);
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return false;
      }
    } catch (err) {
      const msg = err.message || 'Order submission failed';
      setErrorMsg(msg);
      setOtpError(msg);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // Success Confirmation Stage
  if (completedOrder) {
    const isCod = completedOrder.paymentMethod?.toLowerCase().includes('cash') || completedOrder.paymentMethod?.toLowerCase().includes('cod');
    const isUpi = completedOrder.paymentMethod?.toLowerCase().includes('upi') || completedOrder.paymentMethod?.toLowerCase().includes('qr');
    const isPaid = completedOrder.paymentStatus === 'paid';

    return (
      <div className="min-h-[75vh] flex flex-col items-center justify-center py-16 px-4 bg-white text-center">
        <div className="max-w-md w-full p-8 rounded-3xl bg-neutral-50 border border-neutral-100 shadow-xl space-y-6 animate-fade-in">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto ${
            isPaid ? 'bg-[#0D8756]/10 text-[#0D8756]' : 'bg-amber-500/10 text-amber-600'
          }`}>
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div>
            <span className={`text-xs font-bold uppercase tracking-widest ${
              isPaid ? 'text-[#0D8756]' : 'text-amber-600'
            }`}>
              {isPaid ? 'Order Placed & Paid' : isCod ? 'Order Placed (Pay on Delivery)' : 'Order Placed (Under Verification)'}
            </span>
            <h1 className="text-2xl font-extrabold text-neutral-900 mt-1">
              Thank You for Your Order!
            </h1>
            <p className="text-xs text-neutral-500 mt-2">
              Your order number is <strong className="text-neutral-900 font-mono">{completedOrder.orderNumber}</strong>.
              A confirmation has been sent to {formData.email}.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-neutral-100 text-left text-xs space-y-2.5">
            <div className="flex justify-between">
              <span className="text-neutral-500">Order Number</span>
              <span className="font-bold text-neutral-900 font-mono">{completedOrder.orderNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Order Status</span>
              <span className="font-bold text-neutral-900 capitalize">{completedOrder.orderStatus}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-500">Payment Mode</span>
              <span className="font-bold text-neutral-900">{completedOrder.paymentMethod || 'Online'}</span>
            </div>
            {completedOrder.paymentDetails?.utrNumber && (
              <div className="flex justify-between">
                <span className="text-neutral-500">UPI Ref / UTR No.</span>
                <span className="font-mono font-bold text-neutral-900">{completedOrder.paymentDetails.utrNumber}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-neutral-500">Payment Status</span>
              <span className={`font-bold px-2 py-0.5 rounded text-[10px] uppercase ${
                isPaid
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-900'
              }`}>
                {isPaid
                  ? 'PAID (VERIFIED)'
                  : isCod
                  ? 'PENDING (PAY ON DELIVERY)'
                  : 'AWAITING BANK VERIFICATION'}
              </span>
            </div>
            <div className="flex justify-between pt-1 border-t border-neutral-100">
              <span className="text-neutral-500">
                {isPaid
                  ? 'Total Paid Online'
                  : isCod
                  ? 'Amount to Pay on Delivery'
                  : 'Amount Submitted'}
              </span>
              <span className="font-bold text-neutral-900 text-sm">₹{completedOrder.total?.toFixed(2)}</span>
            </div>
          </div>

          {!isPaid && isUpi && (
            <div className="p-3.5 bg-amber-50 border border-amber-200/80 rounded-2xl text-left text-xs text-amber-900 space-y-1">
              <p className="font-bold flex items-center gap-1.5 text-amber-950">
                <ShieldCheck className="w-4 h-4 text-amber-700" />
                <span>UPI Payment Under Verification</span>
              </p>
              <p className="text-[11px] leading-relaxed text-amber-800">
                Your 12-digit UPI UTR reference ({completedOrder.paymentDetails?.utrNumber}) has been submitted. Our automated verification desk validates the transaction credit against banking records before shipping.
              </p>
            </div>
          )}

          <div className="pt-2 flex flex-col gap-2">
            <Link to="/account?tab=orders" className="btn-pill-dark w-full py-3 text-xs">
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
              <div className="p-4 rounded-2xl bg-red-50 text-[#C4301C] text-xs font-bold border border-red-200 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setErrorMsg('')}
                    className="text-neutral-400 hover:text-neutral-700"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {errorMsg.toLowerCase().includes('no longer available') && (
                  <div className="pt-2 border-t border-red-200/60 flex flex-wrap items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        const match = items.find((it) =>
                          errorMsg.toLowerCase().includes(it.name?.toLowerCase())
                        );
                        if (match) {
                          removeFromCart(match.id || match._id);
                        } else if (items.length > 0) {
                          removeFromCart(items[0].id || items[0]._id);
                        }
                        setErrorMsg('');
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-[11px] shadow-sm transition-all"
                    >
                      Cart se ye item hatayein (Remove item from bag)
                    </button>
                    <Link
                      to="/shop"
                      className="px-3 py-1.5 rounded-xl bg-white border border-red-200 text-neutral-700 hover:text-black font-semibold text-[11px]"
                    >
                      Explore other products
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* 1. Contact Info */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle space-y-4">
              <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                1. Contact Details
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Email Address — Locked if logged in */}
                <div className="sm:col-span-2">
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block text-xs font-bold uppercase text-neutral-700 flex items-center space-x-1.5">
                      <Lock className="w-3.5 h-3.5 text-neutral-500" />
                      <span>Email Address *</span>
                    </label>
                    {user?.email && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200/80 flex items-center space-x-1">
                        <Lock className="w-2.5 h-2.5" />
                        <span>Registered Login Email (Non-Editable)</span>
                      </span>
                    )}
                  </div>
                  {user?.email ? (
                    <div>
                      <input
                        type="email"
                        name="email"
                        readOnly
                        disabled
                        value={user.email}
                        className="w-full px-5 py-3 rounded-full bg-neutral-100 border border-neutral-300 text-neutral-600 cursor-not-allowed text-xs font-mono font-bold select-none shadow-2xs"
                      />
                      <p className="text-[11px] text-neutral-400 mt-1">
                        🔒 Aap is logged-in account ({user.email}) se checkout kar rahe hain, isliye yeh email change nahi ho sakta.
                      </p>
                    </div>
                  ) : (
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="customer@gmail.com"
                      className="input-pill"
                    />
                  )}
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
                    placeholder="First Name"
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
                    placeholder="Sharma"
                    className="input-pill"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    10-Digit Mobile Phone (For WhatsApp & Delivery SMS updates) *
                  </label>
                  <div className="flex items-center">
                    <span className="px-3.5 py-3 rounded-l-full bg-neutral-100 border border-r-0 border-neutral-200 text-xs font-bold text-neutral-700 select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9876543210"
                      className="w-full px-4 py-3 rounded-r-full border border-neutral-200 text-xs font-semibold focus:outline-none focus:border-black font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Shipping Address — India Format */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                  <MapPin className="w-4 h-4 text-neutral-700" />
                  <span>2. Delivery Address (India)</span>
                </h2>
                {user?.addresses && user.addresses.length > 0 && (
                  <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
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
                              landmark: addr.landmark || '',
                              city: addr.city,
                              state: addr.state || 'Rajasthan',
                              postalCode: addr.postalCode,
                              country: 'India',
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
                          <p className="text-neutral-500 line-clamp-2 mt-1 text-[11px]">
                            {addr.street}, {addr.landmark ? `${addr.landmark}, ` : ''}{addr.city}, {addr.state || ''} - {addr.postalCode}
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
                    Flat, House no., Building, Apartment *
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="e.g. Flat 402, Royal Palms, Malviya Nagar"
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g. Near World Trade Park (WTP) / Metro Station"
                    className="input-pill"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                      City / District *
                    </label>
                    <input
                      type="text"
                      name="city"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g. Jaipur"
                      className="input-pill"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                      State / UT *
                    </label>
                    <select
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-full border border-neutral-200 text-xs font-semibold bg-white focus:outline-none focus:border-black"
                    >
                      {INDIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                      6-Digit PIN Code *
                    </label>
                    <input
                      type="text"
                      name="postalCode"
                      maxLength={6}
                      required
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      placeholder="e.g. 302017"
                      className="input-pill font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                    Country / Region
                  </label>
                  <div className="w-full px-5 py-3 rounded-full border border-neutral-200 text-xs font-bold bg-neutral-100/70 text-neutral-800 flex items-center justify-between shadow-2xs">
                    <span className="flex items-center space-x-2">
                      <span>🇮🇳</span>
                      <span>India</span>
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      Pan-India Express Delivery Enabled
                    </span>
                  </div>
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
                        Pan-India Standard Delivery (3–5 Working Days)
                      </p>
                      <p className="text-[11px] text-neutral-500">Ekart Logistics & Delhivery Surface</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    {subtotal >= 499 ? 'FREE' : '₹49.00'}
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
                        Priority Guaranteed Air Express (1–2 Working Days)
                      </p>
                      <p className="text-[11px] text-neutral-500">Blue Dart / Delhivery Air Express</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">₹99.00</span>
                </label>
              </div>
            </div>

            {/* 4. Payment Method (Indian E-Commerce Standard) */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200 shadow-subtle space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-900 flex items-center gap-2">
                    4. Payment Method
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full lowercase first-letter:uppercase">
                      100% Safe & Verified
                    </span>
                  </h2>
                  <p className="text-xs text-neutral-500 mt-0.5">Choose your preferred payment mode</p>
                </div>
                <div className="flex items-center space-x-1.5 text-xs text-neutral-500 bg-neutral-100 px-3 py-1 rounded-full font-medium">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-Bit SSL Encrypted</span>
                </div>
              </div>

              {/* Payment Method Selector Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {[
                  { id: 'UPI / QR', label: 'UPI / QR', sub: 'GPay, PhonePe', badge: 'FASTEST', icon: Smartphone },
                  { id: 'Credit/Debit Card', label: 'Cards', sub: 'RuPay, Visa, MC', badge: 'POPULAR', icon: CreditCard },
                  { id: 'Net Banking', label: 'Net Banking', sub: '50+ Banks', icon: Building2 },
                  { id: 'Wallets', label: 'Wallets', sub: 'Paytm, Amazon', icon: Wallet },
                  { id: 'Cash on Delivery', label: 'Cash on Delivery', sub: 'Pay at Doorstep', icon: Banknote },
                ].map((method) => {
                  const Icon = method.icon;
                  const isSelected = formData.paymentMethod === method.id;
                  return (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, paymentMethod: method.id }));
                        setErrorMsg('');
                      }}
                      className={`relative flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                        isSelected
                          ? 'border-black bg-neutral-950 text-white shadow-md ring-2 ring-black/10'
                          : 'border-neutral-200 text-neutral-700 hover:border-neutral-400 bg-neutral-50/50 hover:bg-neutral-50'
                      }`}
                    >
                      {method.badge && (
                        <span
                          className={`absolute -top-2 px-1.5 py-0.5 text-[9px] font-black rounded-full uppercase tracking-wider ${
                            isSelected
                              ? 'bg-amber-400 text-black'
                              : 'bg-neutral-900 text-white'
                          }`}
                        >
                          {method.badge}
                        </span>
                      )}
                      <Icon className={`w-5 h-5 mb-1.5 ${isSelected ? 'text-white' : 'text-neutral-700'}`} />
                      <span className="text-xs font-bold leading-tight">{method.label}</span>
                      <span className={`text-[10px] mt-0.5 line-clamp-1 ${isSelected ? 'text-neutral-300' : 'text-neutral-600'}`}>
                        {method.sub}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* 1. UPI / QR Container */}
              {formData.paymentMethod === 'UPI / QR' && (
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
                    <div className="flex items-center space-x-2">
                      <Smartphone className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-neutral-900">Unified Payments Interface (UPI)</span>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      Zero Surcharge
                    </span>
                  </div>

                  {/* Mode switcher: QR Code vs UPI ID */}
                  <div className="grid grid-cols-2 p-1 bg-neutral-200/60 rounded-xl gap-1">
                    <button
                      type="button"
                      onClick={() => setUpiMode('qr')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                        upiMode === 'qr'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>Scan Dynamic QR</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setUpiMode('id')}
                      className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center space-x-1.5 ${
                        upiMode === 'id'
                          ? 'bg-white text-neutral-900 shadow-sm'
                          : 'text-neutral-600 hover:text-neutral-900'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Enter UPI ID / VPA</span>
                    </button>
                  </div>

                  {upiMode === 'qr' ? (
                    <div className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-2xl border border-neutral-200/80">
                      {/* Dynamic QR Box */}
                      <div className="relative p-3 bg-white rounded-2xl border-2 border-dashed border-neutral-300 shadow-sm text-center flex-shrink-0">
                        <img
                          src={`https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=upi%3A%2F%2Fpay%3Fpa%3Dvexivo%40icici%26pn%3DVexivo%2BMarketplace%26am%3D${grandTotal}%26cu%3DINR`}
                          alt="VEXIVO Dynamic UPI QR"
                          className="w-36 h-36 mx-auto object-contain rounded-lg"
                        />
                        <div className="mt-2 text-[10px] font-bold text-neutral-500 uppercase tracking-wider flex items-center justify-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                          <span>QR Live • Auto-Verifies</span>
                        </div>
                      </div>

                      {/* Instructions & Timer */}
                      <div className="space-y-3 flex-1 text-center sm:text-left">
                        <div className="inline-flex items-center space-x-2 bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1 rounded-full text-xs font-bold">
                          <RefreshCw className="w-3 h-3 animate-spin text-amber-700" />
                          <span>QR Code Expires in: {formatTimer(qrExpirySeconds)}</span>
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">
                            Scan with any UPI App on your phone
                          </p>
                          <p className="text-xs text-neutral-600 mt-1 leading-relaxed">
                            Amount <span className="font-bold text-neutral-900">₹{grandTotal.toLocaleString('en-IN')}</span> will be automatically populated. Supports Google Pay, PhonePe, Paytm, CRED, BHIM & Amazon Pay.
                          </p>
                        </div>
                        {/* Supported apps pills */}
                        <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start pt-1">
                          {['Google Pay', 'PhonePe', 'Paytm', 'BHIM', 'CRED'].map((app) => (
                            <span
                              key={app}
                              className="text-[10px] font-bold px-2 py-0.5 bg-neutral-100 border border-neutral-200 rounded-md text-neutral-700"
                            >
                              {app}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 bg-white p-4 rounded-2xl border border-neutral-200/80">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                          Virtual Payment Address (UPI ID)
                        </label>
                        <div className="relative flex items-center">
                          <input
                            type="text"
                            value={upiId}
                            onChange={(e) => {
                              setUpiId(e.target.value);
                              setUpiVerified(false);
                            }}
                            placeholder="e.g. mobile@oksbi or yourname@okhdfcbank"
                            className="w-full pl-3.5 pr-24 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              if (upiId && upiId.includes('@')) {
                                setUpiVerified(true);
                              } else {
                                setErrorMsg('Kripya valid UPI ID format enter karein (e.g. username@okhdfcbank)');
                              }
                            }}
                            className={`absolute right-1.5 px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                              upiVerified
                                ? 'bg-emerald-600 text-white'
                                : 'bg-neutral-900 text-white hover:bg-neutral-800'
                            }`}
                          >
                            {upiVerified ? 'Verified ✓' : 'Verify'}
                          </button>
                        </div>
                      </div>

                      {/* Quick Handle Suggestions */}
                      <div>
                        <p className="text-[11px] font-medium text-neutral-500 mb-1.5">Quick UPI Handles:</p>
                        <div className="flex flex-wrap gap-1.5">
                          {['@okhdfcbank', '@oksbi', '@okicici', '@okaxis', '@ybl', '@paytm'].map((handle) => (
                            <button
                              key={handle}
                              type="button"
                              onClick={() => {
                                const prefix = upiId.includes('@') ? upiId.split('@')[0] : upiId;
                                const newId = `${prefix || 'user'}${handle}`;
                                setUpiId(newId);
                                setUpiVerified(true);
                              }}
                              className="text-[11px] font-mono font-medium px-2 py-1 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-neutral-700 border border-neutral-200 transition-colors"
                            >
                              {handle}
                            </button>
                          ))}
                        </div>
                      </div>

                      {upiVerified && (
                        <div className="flex items-center space-x-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-xl">
                          <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                          <span>UPI ID is active & verified. A collect request of <strong>₹{grandTotal.toLocaleString('en-IN')}</strong> will be triggered.</span>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mandatory Bank UTR Reference Box for Payment Verification */}
                  <div className="p-4 bg-emerald-50/80 border border-emerald-200/90 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-emerald-950 flex items-center space-x-1.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-700" />
                        <span>12-Digit Bank UTR / UPI Reference No. *</span>
                      </label>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                        Required for Verification
                      </span>
                    </div>
                    <input
                      type="text"
                      maxLength={12}
                      value={upiUtr}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').slice(0, 12);
                        setUpiUtr(val);
                      }}
                      placeholder="Enter 12-digit UTR from GPay / PhonePe / Paytm (e.g. 428192039481)"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-emerald-300 text-xs font-mono font-bold tracking-wider bg-white focus:ring-1 focus:ring-emerald-600 focus:border-emerald-600"
                    />
                    <div className="flex items-center justify-between text-[11px] text-emerald-800">
                      <span>💡 PhonePe / Google Pay / Paytm par payment complete hone ke baad mila 12-digit UTR number yahan enter karein.</span>
                      {upiUtr.length === 12 && (
                        <span className="font-bold text-emerald-700 flex items-center space-x-1 flex-shrink-0">
                          <Check className="w-3.5 h-3.5" />
                          <span>12 Digits Verified</span>
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* 2. Credit / Debit / RuPay Cards */}
              {formData.paymentMethod === 'Credit/Debit Card' && (
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                  {/* Schemes Header */}
                  <div className="flex items-center justify-between flex-wrap gap-2 border-b border-neutral-200/70 pb-3">
                    <div className="flex items-center space-x-2">
                      <CreditCard className="w-4 h-4 text-neutral-900" />
                      <span className="text-xs font-bold text-neutral-900">All Major Cards Accepted</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-extrabold text-blue-900 bg-blue-100 px-2 py-0.5 rounded border border-blue-200">
                        RuPay Domestic
                      </span>
                      <span className="text-[10px] font-bold text-neutral-700 bg-neutral-200 px-1.5 py-0.5 rounded">
                        Visa
                      </span>
                      <span className="text-[10px] font-bold text-neutral-700 bg-neutral-200 px-1.5 py-0.5 rounded">
                        Mastercard
                      </span>
                      <span className="text-[10px] font-bold text-neutral-700 bg-neutral-200 px-1.5 py-0.5 rounded">
                        Amex
                      </span>
                    </div>
                  </div>

                  {/* Card Form */}
                  <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 space-y-3.5">
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-xs font-bold uppercase text-neutral-700">
                          Card Number
                        </label>
                        {formData.cardNumber && (
                          <span className="text-[11px] font-bold text-neutral-900 bg-neutral-100 px-2 py-0.5 rounded">
                            {getCardBrand(formData.cardNumber)} Card
                          </span>
                        )}
                      </div>
                      <div className="relative">
                        <input
                          type="text"
                          name="cardNumber"
                          value={formData.cardNumber}
                          onChange={handleInputChange}
                          maxLength={19}
                          placeholder="4111 2222 3333 4444"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono tracking-wider focus:ring-1 focus:ring-black focus:border-black"
                        />
                        <CreditCard className="w-4 h-4 text-neutral-400 absolute right-3.5 top-3" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                        Cardholder Name
                      </label>
                      <input
                        type="text"
                        name="cardHolder"
                        value={formData.cardHolder}
                        onChange={handleInputChange}
                        placeholder="NAME AS PRINTED ON CARD"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium uppercase tracking-wide focus:ring-1 focus:ring-black focus:border-black"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                          Expiry Date
                        </label>
                        <input
                          type="text"
                          name="cardExp"
                          value={formData.cardExp}
                          onChange={handleInputChange}
                          maxLength={5}
                          placeholder="MM/YY"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:ring-1 focus:ring-black focus:border-black text-center"
                        />
                      </div>
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold uppercase text-neutral-700">
                            CVV / CVC
                          </label>
                          <span className="text-[10px] text-neutral-400">3 or 4 digits</span>
                        </div>
                        <input
                          type="password"
                          name="cardCvc"
                          value={formData.cardCvc}
                          onChange={handleInputChange}
                          maxLength={4}
                          placeholder="•••"
                          className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono focus:ring-1 focus:ring-black focus:border-black text-center"
                        />
                      </div>
                    </div>

                    {/* RBI Tokenization Checkbox */}
                    <label className="flex items-start space-x-2.5 pt-1 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={saveCard}
                        onChange={(e) => setSaveCard(e.target.checked)}
                        className="mt-0.5 rounded border-neutral-300 text-black focus:ring-black"
                      />
                      <span className="text-[11px] text-neutral-600 leading-snug">
                        Securely tokenize and save card for future purchases as per <strong className="text-neutral-900">RBI Guidelines</strong>. CVV is never stored.
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* 3. Net Banking */}
              {formData.paymentMethod === 'Net Banking' && (
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
                    <div className="flex items-center space-x-2">
                      <Building2 className="w-4 h-4 text-neutral-900" />
                      <span className="text-xs font-bold text-neutral-900">Select Net Banking Gateway</span>
                    </div>
                    <span className="text-[11px] text-neutral-500 font-medium">Direct Bank Redirect</span>
                  </div>

                  {/* Top Indian Banks Grid */}
                  <div>
                    <p className="text-[11px] font-bold uppercase text-neutral-500 tracking-wider mb-2">
                      Popular Indian Banks
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {TOP_INDIAN_BANKS.map((b) => {
                        const isSelected = selectedBank === b.code;
                        return (
                          <button
                            key={b.code}
                            type="button"
                            onClick={() => {
                              setSelectedBank(b.code);
                              setOtherBank('');
                            }}
                            className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                              isSelected
                                ? 'border-black bg-white shadow-sm ring-2 ring-black'
                                : 'border-neutral-200 bg-white hover:border-neutral-300'
                            }`}
                          >
                            <span className="text-xs font-bold text-neutral-900">{b.name}</span>
                            {isSelected && <Check className="w-4 h-4 text-black flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Other 50+ Banks Dropdown */}
                  <div className="bg-white p-3.5 rounded-2xl border border-neutral-200/80">
                    <label className="block text-xs font-bold uppercase text-neutral-700 mb-1.5">
                      All Other Scheduled Indian Banks (50+)
                    </label>
                    <select
                      value={otherBank}
                      onChange={(e) => {
                        setOtherBank(e.target.value);
                        setSelectedBank('');
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-medium focus:ring-1 focus:ring-black focus:border-black bg-white"
                    >
                      <option value="">-- Choose from other Indian Banks --</option>
                      {ALL_OTHER_BANKS.map((b) => (
                        <option key={b} value={b}>
                          {b}
                        </option>
                      ))}
                    </select>
                  </div>

                  <p className="text-[11px] text-neutral-500 flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                    <span>You will be safely routed to your bank's authenticated 3D-Secure portal to complete this payment.</span>
                  </p>
                </div>
              )}

              {/* 4. Digital Wallets */}
              {formData.paymentMethod === 'Wallets' && (
                <div className="p-5 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-4">
                  <div className="flex items-center justify-between border-b border-neutral-200/70 pb-3">
                    <div className="flex items-center space-x-2">
                      <Wallet className="w-4 h-4 text-neutral-900" />
                      <span className="text-xs font-bold text-neutral-900">Supported Digital Wallets & Postpaid</span>
                    </div>
                    <span className="text-[11px] text-emerald-800 font-bold bg-emerald-100 px-2 py-0.5 rounded-full">
                      Instant Approval
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {[
                      { id: 'paytm', name: 'Paytm Wallet & Postpaid', desc: 'Fast 1-click checkout' },
                      { id: 'phonepe', name: 'PhonePe Wallet', desc: 'Link & pay balance directly' },
                      { id: 'amazonpay', name: 'Amazon Pay Balance', desc: 'Use gift cards & cashback balance' },
                      { id: 'mobikwik', name: 'Mobikwik ZIP & Wallet', desc: 'Pay Later or wallet balance' },
                      { id: 'airtel', name: 'Airtel Payments Bank', desc: 'Secure digital banking wallet' },
                    ].map((w) => {
                      const isSelected = selectedWallet === w.id;
                      return (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => setSelectedWallet(w.id)}
                          className={`p-3.5 rounded-xl border text-left transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-black bg-white shadow-sm ring-2 ring-black'
                              : 'border-neutral-200 bg-white hover:border-neutral-300'
                          }`}
                        >
                          <div>
                            <p className="text-xs font-bold text-neutral-900">{w.name}</p>
                            <p className="text-[11px] text-neutral-500 mt-0.5">{w.desc}</p>
                          </div>
                          {isSelected && <Check className="w-4 h-4 text-black flex-shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 5. Cash on Delivery (COD) with Flipkart-style 3-digit Captcha */}
              {formData.paymentMethod === 'Cash on Delivery' && (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4">
                  <div className="flex items-center justify-between border-b border-emerald-200/80 pb-3">
                    <div className="flex items-center space-x-2">
                      <Banknote className="w-4 h-4 text-emerald-700" />
                      <span className="text-xs font-bold text-emerald-950">Cash on Delivery Available</span>
                    </div>
                    <span className="text-[11px] font-bold text-emerald-800 bg-emerald-200/80 px-2 py-0.5 rounded-full">
                      Pay at Doorstep
                    </span>
                  </div>

                  <p className="text-xs text-emerald-900 leading-relaxed">
                    You can pay in cash or scan the delivery executive's UPI QR code when your shipment arrives at your delivery address. No advance payment is needed.
                  </p>

                  {/* Flipkart-style 3-digit verification captcha */}
                  <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-3">
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div>
                        <p className="text-xs font-bold text-neutral-900">
                          Security Verification Required
                        </p>
                        <p className="text-[11px] text-neutral-500">
                          Enter the 3-digit security code below to confirm this order:
                        </p>
                      </div>

                      {/* Captcha Display Badge */}
                      <div className="flex items-center space-x-2">
                        <div className="px-4 py-2 bg-neutral-950 text-white font-mono text-xl font-black tracking-widest rounded-xl shadow-inner select-none border border-neutral-700 flex items-center justify-center">
                          {codCaptcha}
                        </div>
                        <button
                          type="button"
                          title="Generate new captcha code"
                          onClick={() => {
                            setCodCaptcha(Math.floor(100 + Math.random() * 900));
                            setUserCodCaptchaInput('');
                          }}
                          className="p-2 rounded-xl border border-neutral-200 text-neutral-600 hover:text-black hover:bg-neutral-100 transition-colors"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        maxLength={3}
                        value={userCodCaptchaInput}
                        onChange={(e) => {
                          const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                          setUserCodCaptchaInput(val);
                        }}
                        placeholder="Enter the 3 digits shown above"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-300 text-xs font-mono tracking-widest text-center focus:ring-1 focus:ring-black focus:border-black font-bold"
                      />
                    </div>

                    {userCodCaptchaInput && userCodCaptchaInput === String(codCaptcha) && (
                      <div className="flex items-center space-x-1.5 text-xs text-emerald-700 font-bold">
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Security code verified! Click &quot;Confirm & Place Order&quot; below.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Trust & Compliance Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-neutral-100">
                <div className="flex items-center space-x-2 text-[11px] text-neutral-600">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>100% Safe Payments</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-neutral-600">
                  <Lock className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span>RBI Tokenized</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-neutral-600">
                  <Sparkles className="w-4 h-4 text-purple-600 flex-shrink-0" />
                  <span>NPCI UPI Certified</span>
                </div>
                <div className="flex items-center space-x-2 text-[11px] text-neutral-600">
                  <CheckCircle2 className="w-4 h-4 text-neutral-900 flex-shrink-0" />
                  <span>7-Day Easy Return</span>
                </div>
              </div>
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
                        <p className="text-[11px] text-neutral-600 mt-0.5">
                          <span className="font-semibold text-neutral-800 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200/60">
                            Size: {item.variant}
                          </span>
                        </p>
                      )}
                      <p className="text-xs text-neutral-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-xs font-extrabold text-neutral-900">
                      ₹{(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Coupon / Promo Code Input Card */}
              <div className="pt-2 border-t border-neutral-100 space-y-2.5">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold uppercase tracking-wider text-neutral-700 flex items-center space-x-1.5">
                    <Tag className="w-3.5 h-3.5 text-neutral-500" />
                    <span>Promo / Coupon Code</span>
                  </label>
                  {effectiveCoupon && (
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-[11px] font-bold text-red-600 hover:underline"
                    >
                      Remove
                    </button>
                  )}
                </div>

                {effectiveCoupon ? (
                  <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center space-x-2 text-xs text-emerald-800">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <div>
                        <span className="font-bold">Code '{effectiveCoupon}' Applied</span>
                        <p className="text-[11px] text-emerald-700">Saved ₹{effectiveDiscount.toFixed(2)} on this order</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="px-2.5 py-1 text-[10px] font-bold uppercase rounded-full bg-emerald-100 text-emerald-900 hover:bg-emerald-200 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex space-x-2">
                      <input
                        type="text"
                        value={checkoutCouponCode}
                        onChange={(e) => setCheckoutCouponCode(e.target.value.toUpperCase())}
                        placeholder="e.g. AUTUMN30"
                        className="flex-1 px-4 py-2 rounded-full border border-neutral-200 text-xs font-mono uppercase font-bold focus:outline-none focus:border-black"
                      />
                      <button
                        type="button"
                        onClick={(e) => handleApplyCheckoutCoupon(e)}
                        disabled={checkoutCouponLoading || !checkoutCouponCode.trim()}
                        className="btn-pill-dark px-4 py-2 text-xs uppercase disabled:opacity-50"
                      >
                        {checkoutCouponLoading ? 'Checking...' : 'Apply'}
                      </button>
                    </div>

                    {checkoutCouponError && (
                      <p className="text-xs text-[#C4301C] font-semibold">{checkoutCouponError}</p>
                    )}
                    {checkoutCouponSuccess && (
                      <p className="text-xs text-[#0D8756] font-semibold">{checkoutCouponSuccess}</p>
                    )}

                    {/* Available Offers Quick Pick */}
                    <div className="pt-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 mb-1">
                        Available Offers (Tap to Apply):
                      </p>
                      <div className="flex flex-wrap gap-1.5">
                        {(availableCoupons.length > 0 ? availableCoupons.slice(0, 4) : [
                          { code: 'AUTUMN30', value: 30, type: 'percentage' },
                          { code: 'WELCOME20', value: 20, type: 'percentage' },
                          { code: 'VEX10', value: 10, type: 'percentage' },
                          { code: 'FREESHIP', value: 99, type: 'fixed' },
                        ]).map((c) => (
                          <button
                            key={c.code}
                            type="button"
                            onClick={() => handleApplyCheckoutCoupon(null, c.code)}
                            className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-neutral-50 border border-neutral-200 text-neutral-700 hover:border-black hover:text-black hover:bg-neutral-100 transition-colors flex items-center space-x-1"
                          >
                            <span>🏷️ {c.code}</span>
                            {c.value && (
                              <span className="text-neutral-500 font-normal">
                                ({c.type === 'percentage' ? `${c.value}%` : `₹${c.value}`})
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Calculation */}
              <div className="space-y-2 pt-4 border-t border-neutral-100 text-xs text-neutral-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-bold text-neutral-900">₹{subtotal.toFixed(2)}</span>
                </div>
                {effectiveDiscount > 0 && (
                  <div className="flex justify-between text-[#0D8756] font-bold">
                    <span>Discount Code ({effectiveCoupon})</span>
                    <span>-₹{effectiveDiscount.toFixed(2)}</span>
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

      {/* 3D Secure 2.0 Bank OTP Verification Modal */}
      {showOtpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Bank Header */}
            <div className="p-5 bg-gradient-to-r from-blue-900 to-indigo-950 text-white flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center border border-white/20">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Bank 3D Secure 2.0 Authentication</h3>
                  <p className="text-[10px] text-blue-200">Verified by Visa / RuPay / Mastercard</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowOtpModal(false);
                  setCardOtp('');
                  setOtpError('');
                }}
                className="w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white/70 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleVerifyCardOtp} className="p-6 space-y-4">
              <div className="p-3 rounded-2xl bg-neutral-50 border border-neutral-200/80 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-neutral-500">Merchant</span>
                  <span className="font-bold text-neutral-900">VEXIVO India Marketplace</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Card</span>
                  <span className="font-mono font-bold text-neutral-900">
                    •••• •••• •••• {(formData.cardNumber || '').replace(/\s+/g, '').slice(-4)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-neutral-500">Amount</span>
                  <span className="font-extrabold text-neutral-900 text-sm">₹{grandTotal.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-neutral-800">
                    Enter 6-Digit Bank OTP *
                  </label>
                  <span className="text-[11px] font-mono text-neutral-500">
                    Expires in: {Math.floor(otpTimer / 60)}:{(otpTimer % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  autoFocus
                  value={cardOtp}
                  onChange={(e) => {
                    setCardOtp(e.target.value.replace(/\D/g, '').slice(0, 6));
                    setOtpError('');
                  }}
                  placeholder="e.g. 123456"
                  className="w-full text-center text-xl font-mono font-black tracking-[0.4em] py-3 rounded-2xl border-2 border-neutral-300 focus:border-blue-600 focus:outline-none bg-neutral-50/50"
                />
                <p className="text-[11px] text-neutral-500">
                  💡 A one-time verification password has been sent to your bank registered mobile number. For demo/testing, enter any 6 digits (e.g. <strong>123456</strong>).
                </p>
                {otpError && (
                  <p className="text-xs font-bold text-red-600">{otpError}</p>
                )}
              </div>

              <div className="pt-2 flex flex-col gap-2">
                <button
                  type="submit"
                  disabled={isProcessing || cardOtp.length !== 6}
                  className="btn-pill-dark w-full py-3 text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-2"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Verifying with Bank...</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-3.5 h-3.5" />
                      <span>Authorize Payment of ₹{grandTotal.toFixed(2)}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowOtpModal(false);
                    setCardOtp('');
                    setOtpError('');
                  }}
                  className="btn-pill-light w-full py-2.5 text-xs text-neutral-600"
                >
                  Cancel Transaction
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
