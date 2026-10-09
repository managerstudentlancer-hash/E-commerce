import React, { useState } from 'react';
import { Ticket, Copy, Check, Info, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

const CouponsSection = ({ data = [], onCouponCopied }) => {
  const [copiedCode, setCopiedCode] = useState(null);
  const [expandedTerms, setExpandedTerms] = useState({});

  const handleCopy = (code) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code).catch(() => {});
    }
    setCopiedCode(code);
    if (onCouponCopied) {
      onCouponCopied(`Coupon "${code}" copied! Apply during checkout.`);
    }
    setTimeout(() => {
      setCopiedCode(null);
    }, 2500);
  };

  const toggleTerms = (code) => {
    setExpandedTerms((prev) => ({
      ...prev,
      [code]: !prev[code],
    }));
  };

  if (!data || data.length === 0) return null;

  return (
    <section id="coupons" className="mb-10 scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 pb-2.5 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-1">
            <Ticket className="w-3 h-3" />
            <span>Instant Cart Savings</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-sans tracking-tight">
            Coupons &amp; Promo Codes
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
            Click to copy verified voucher codes and get extra discounts at checkout.
          </p>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center space-x-1 text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Auto-applies at Checkout</span>
        </div>
      </div>

      {/* Compact Grid: 1 col on small mobile, 2 on tablet, 3 on desktop */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-4">
        {data.map((coupon) => {
          const isCopied = copiedCode === coupon.code;
          const isTermsOpen = !!expandedTerms[coupon.code];
          const discountDisplay = coupon.discountText || (coupon.discountPercent ? `${coupon.discountPercent}% OFF` : '₹100 OFF');

          return (
            <div
              key={coupon._id || coupon.code}
              className="relative bg-white rounded-2xl border border-neutral-200 shadow-2xs hover:shadow-md transition-all duration-300 flex flex-col justify-between overflow-hidden"
            >
              {/* Ticket Cutout Accents */}
              <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#f8f9fa] border-r border-neutral-200" />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-3.5 h-3.5 rounded-full bg-[#f8f9fa] border-l border-neutral-200" />

              <div className="p-3.5 sm:p-4 pb-2.5">
                {/* Header: Category & Discount Tag */}
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">
                    {coupon.category || 'Storewide'}
                  </span>
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.2 rounded-full bg-rose-50 text-rose-600 border border-rose-100">
                    {coupon.badge || 'Verified'}
                  </span>
                </div>

                {/* Main Offer Title & Value */}
                <div className="mb-1.5">
                  <div className="text-base sm:text-lg font-black text-neutral-900 font-sans tracking-tight">
                    {discountDisplay}
                  </div>
                  <div className="text-[11px] sm:text-xs font-bold text-neutral-700">
                    {coupon.title}
                  </div>
                </div>

                <p className="text-[11px] text-neutral-500 line-clamp-1 leading-relaxed">
                  {coupon.subtitle || coupon.description}
                </p>

                {/* Min Order & Validity Tag */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t border-dashed border-neutral-200 text-[10px] text-neutral-500">
                  <span>
                    Min Order: <strong className="text-neutral-800">₹{coupon.minimumOrder || coupon.minOrder || 499}</strong>
                  </span>
                  <span className="text-rose-600 font-medium">{coupon.validity}</span>
                </div>
              </div>

              {/* Bottom Voucher Code Bar */}
              <div className="bg-neutral-50/80 p-3 border-t border-neutral-100">
                <div className="flex items-center justify-between gap-2">
                  {/* Dashed Code Box */}
                  <div className="flex-1 bg-white border border-dashed border-neutral-300 rounded-xl px-2.5 py-1.5 flex items-center justify-between">
                    <span className="font-mono font-black text-xs text-neutral-900 tracking-wider select-all">
                      {coupon.code}
                    </span>
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(coupon.code)}
                    aria-label={`Copy coupon code ${coupon.code}`}
                    className={`flex-shrink-0 flex items-center space-x-1 px-3 py-1.5 rounded-xl font-bold text-[11px] transition-all active:scale-95 shadow-2xs ${
                      isCopied
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-950 hover:bg-black text-white'
                    }`}
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3 h-3" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Terms Toggle Button */}
                {coupon.terms && coupon.terms.length > 0 && (
                  <div className="mt-1.5 pt-1.5 border-t border-neutral-200/50 flex items-center justify-between">
                    <button
                      onClick={() => toggleTerms(coupon.code)}
                      className="inline-flex items-center space-x-1 text-[10px] font-semibold text-neutral-500 hover:text-neutral-900 transition-colors"
                    >
                      <Info className="w-2.5 h-2.5" />
                      <span>Terms</span>
                      {isTermsOpen ? <ChevronUp className="w-2.5 h-2.5" /> : <ChevronDown className="w-2.5 h-2.5" />}
                    </button>
                    <span className="text-[9px] text-neutral-400">100% Instant</span>
                  </div>
                )}

                {/* Terms Drawer Content */}
                {isTermsOpen && coupon.terms && (
                  <div className="mt-1.5 p-2 bg-white rounded-xl border border-neutral-200/70 text-[10px] text-neutral-600 space-y-0.5 animate-fade-in">
                    {coupon.terms.map((term, idx) => (
                      <div key={idx} className="flex items-start space-x-1">
                        <span className="text-neutral-400">•</span>
                        <span>{term}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default CouponsSection;
