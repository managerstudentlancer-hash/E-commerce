import React, { useState } from 'react';
import { Gift, Sparkles, ShieldCheck, ShoppingBag } from 'lucide-react';
import { giftCardPresets, giftCardThemes } from '../../data/offersData';
import { useCart } from '../../context/CartContext';

const GiftCardSection = ({ onGiftCardPurchased }) => {
  const { addToCart } = useCart();
  const [selectedAmount, setSelectedAmount] = useState(1000);
  const [isCustom, setIsCustom] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [selectedTheme, setSelectedTheme] = useState(giftCardThemes[0]);
  const [recipientName, setRecipientName] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const effectiveAmount = isCustom ? Number(customAmount) || 0 : selectedAmount;

  const handleSelectPreset = (amount) => {
    setIsCustom(false);
    setSelectedAmount(amount);
  };

  const handleCustomClick = () => {
    setIsCustom(true);
  };

  const handleBuyGiftCard = (e) => {
    e.preventDefault();
    if (effectiveAmount < 100) {
      alert('Please select or enter an amount of at least ₹100.');
      return;
    }

    setIsProcessing(true);

    const giftCardProduct = {
      id: `giftcard-${Date.now()}`,
      _id: `giftcard-${Date.now()}`,
      name: `VEXIVO Luxury Gift Card (₹${effectiveAmount.toLocaleString('en-IN')})`,
      price: effectiveAmount,
      image: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?auto=format&fit=crop&w=400&q=80',
      variant: `${selectedTheme.name} | For: ${recipientName || 'Myself'}`,
      slug: 'gift-cards',
    };

    setTimeout(() => {
      addToCart(giftCardProduct, 1);
      setIsProcessing(false);
      if (onGiftCardPurchased) {
        onGiftCardPurchased(
          `VEXIVO Luxury Gift Card worth ₹${effectiveAmount.toLocaleString('en-IN')} added to bag!`
        );
      }
    }, 400);
  };

  return (
    <section id="gift-cards" className="mb-10 scroll-mt-28">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 pb-2.5 border-b border-neutral-200">
        <div>
          <div className="inline-flex items-center space-x-1 text-[11px] font-bold uppercase tracking-wider text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full mb-1">
            <Gift className="w-3 h-3" />
            <span>Digital Luxury Gifting</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 font-sans tracking-tight">
            VEXIVO Luxury Gift Cards
          </h2>
          <p className="text-[11px] sm:text-xs text-neutral-500 mt-0.5">
            Instant digital vouchers delivered via email with no expiry date.
          </p>
        </div>

        <div className="mt-2 sm:mt-0 flex items-center space-x-1.5 text-[11px] font-semibold text-neutral-600 bg-neutral-100 px-2.5 py-1 rounded-full">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Valid Across Store • 1-Year Validity</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Compact Virtual Card Graphic */}
        <div className="lg:col-span-5 space-y-3">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/20 to-rose-400/20 rounded-2xl blur-md opacity-70" />

            <div
              className={`relative aspect-[1.65/1] rounded-2xl p-5 text-white shadow-xl flex flex-col justify-between overflow-hidden border border-white/20 transition-all duration-300 ${selectedTheme.bgClass}`}
            >
              <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-white/10 blur-lg pointer-events-none" />

              {/* Card Header */}
              <div className="relative z-10 flex items-center justify-between">
                <div className="flex items-center space-x-1.5">
                  <span className="text-base font-black tracking-widest uppercase">
                    VEXIVO
                  </span>
                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-white/20">
                    GIFT CARD
                  </span>
                </div>
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </div>

              {/* Center Amount Display */}
              <div className="relative z-10 py-1">
                <span className="text-[9px] font-semibold text-white/80 uppercase tracking-widest">
                  GIFT VALUE
                </span>
                <div className="text-2xl sm:text-3xl font-black tracking-tight font-sans text-white">
                  ₹{effectiveAmount ? effectiveAmount.toLocaleString('en-IN') : '0'}
                </div>
              </div>

              {/* Card Footer */}
              <div className="relative z-10 flex items-end justify-between text-[11px]">
                <div>
                  <div className="text-[9px] text-white/70 uppercase">FOR</div>
                  <div className="font-bold text-white truncate max-w-[130px]">
                    {recipientName.trim() || 'A Special Someone'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[9px] text-white/70 uppercase">THEME</div>
                  <div className="font-bold text-white text-[10px]">
                    {selectedTheme.name}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Theme Selector */}
          <div className="bg-white rounded-2xl p-3 border border-neutral-200 shadow-2xs">
            <label className="block text-[10px] font-bold text-neutral-600 uppercase tracking-wider mb-1.5">
              Select Card Theme Skin
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {giftCardThemes.map((thm) => (
                <button
                  key={thm.id}
                  type="button"
                  onClick={() => setSelectedTheme(thm)}
                  className={`p-1.5 rounded-xl text-left border transition-all ${
                    selectedTheme.id === thm.id
                      ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-900/20'
                      : 'border-neutral-200 hover:border-neutral-300'
                  }`}
                >
                  <div className={`w-full h-3 rounded mb-1 ${thm.bgClass}`} />
                  <span className="block text-[10px] font-bold text-neutral-800 truncate">
                    {thm.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Compact Denominations & Personalization */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-4 sm:p-5 border border-neutral-200 shadow-2xs space-y-4">
          {/* Step 1: Select Denomination */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700 mb-2">
              1. Choose Gift Amount
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {giftCardPresets.map((preset) => (
                <button
                  key={preset.amount}
                  type="button"
                  onClick={() => handleSelectPreset(preset.amount)}
                  className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                    !isCustom && selectedAmount === preset.amount
                      ? 'border-neutral-950 bg-neutral-950 text-white shadow-2xs'
                      : 'border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-900'
                  }`}
                >
                  <div className="text-sm font-black">{preset.label}</div>
                  <div
                    className={`text-[9px] mt-0.5 truncate ${
                      !isCustom && selectedAmount === preset.amount
                        ? 'text-neutral-300'
                        : 'text-neutral-500'
                    }`}
                  >
                    {preset.benefit}
                  </div>
                </button>
              ))}
            </div>

            {/* Custom Amount Option */}
            <div className="mt-2">
              <button
                type="button"
                onClick={handleCustomClick}
                className={`w-full py-1.5 px-3 rounded-xl border text-[11px] font-bold flex items-center justify-between transition-all ${
                  isCustom
                    ? 'border-neutral-950 bg-neutral-50 ring-1 ring-neutral-950/20'
                    : 'border-neutral-200 hover:bg-neutral-50 text-neutral-700'
                }`}
              >
                <span>Enter Custom Amount (₹100 - ₹50,000)</span>
                <span className="text-[10px] font-bold text-rose-600">Custom</span>
              </button>

              {isCustom && (
                <div className="mt-1.5 relative animate-fade-in">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-neutral-500 text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="100"
                    max="50000"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                    placeholder="e.g. 3500"
                    className="w-full pl-7 pr-3 py-1.5 rounded-xl border border-neutral-300 text-xs font-bold focus:outline-none focus:border-neutral-950"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Step 2: Recipient Details */}
          <div className="space-y-2 pt-2 border-t border-neutral-100">
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-700">
              2. Personalize (Optional)
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <input
                  type="text"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  placeholder="Recipient Name"
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-950"
                />
              </div>
              <div>
                <input
                  type="email"
                  value={recipientEmail}
                  onChange={(e) => setRecipientEmail(e.target.value)}
                  placeholder="Recipient Email"
                  className="w-full px-3 py-1.5 rounded-xl border border-neutral-200 text-xs focus:outline-none focus:border-neutral-950"
                />
              </div>
            </div>
          </div>

          {/* Step 3: Purchase Action Bar */}
          <div className="pt-3 border-t border-neutral-100 flex items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-neutral-500">Gift Value</div>
              <div className="text-lg sm:text-xl font-black text-neutral-950">
                ₹{effectiveAmount ? effectiveAmount.toLocaleString('en-IN') : '0'}
              </div>
            </div>

            <button
              type="button"
              onClick={handleBuyGiftCard}
              disabled={isProcessing || !effectiveAmount}
              className="flex items-center justify-center space-x-1.5 px-6 py-2.5 rounded-full bg-neutral-950 hover:bg-black text-white font-bold text-xs tracking-wide shadow-md transition-all active:scale-95 disabled:opacity-50"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-amber-300" />
              <span>{isProcessing ? 'Adding...' : 'Buy Gift Card'}</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GiftCardSection;
