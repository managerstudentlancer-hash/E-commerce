import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, X } from 'lucide-react';

const mockSales = [
  {
    name: 'Eleanor from London',
    item: 'The Kensington Tailored Trouser',
    time: '2 minutes ago',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=200&q=80',
    slug: 'the-kensington-tailored-wool-pleated-trouser',
  },
  {
    name: 'Oliver from Manchester',
    item: 'The Mayfair Top-Grain Carryall Tote',
    time: '6 minutes ago',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=200&q=80',
    slug: 'the-mayfair-top-grain-leather-tote',
  },
  {
    name: 'Charlotte from Edinburgh',
    item: 'The Apex Studio ANC Headphones',
    time: '11 minutes ago',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=200&q=80',
    slug: 'the-apex-studio-wireless-anc-headphones',
  },
  {
    name: 'James from Bristol',
    item: 'French-Style Linen Lantern Sleeve Dress',
    time: '14 minutes ago',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=200&q=80',
    slug: 'the-kensington-tailored-wool-pleated-trouser',
  },
];

const SocialProofToast = () => {
  const [currentSale, setCurrentSale] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (isDismissed) return;

    let idx = 0;
    const interval = setInterval(() => {
      setCurrentSale(mockSales[idx % mockSales.length]);
      setIsVisible(true);
      idx++;

      // Hide after 5 seconds
      setTimeout(() => {
        setIsVisible(false);
      }, 5000);
    }, 14000);

    // Initial trigger after 4s
    const initialTimer = setTimeout(() => {
      setCurrentSale(mockSales[0]);
      setIsVisible(true);
      setTimeout(() => setIsVisible(false), 5000);
    }, 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimer);
    };
  }, [isDismissed]);

  if (!currentSale || isDismissed) return null;

  return (
    <div
      className={`fixed bottom-5 left-5 z-40 max-w-xs sm:max-w-sm bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-2xl border border-neutral-200/80 transition-all duration-500 ease-out transform ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0 pointer-events-none'
      }`}
    >
      <div className="flex items-center space-x-3 relative">
        <Link to={`/product/${currentSale.slug}`} className="flex-shrink-0">
          <img
            src={currentSale.image}
            alt={currentSale.item}
            className="w-12 h-14 rounded-xl object-cover border border-neutral-100 shadow-sm"
          />
        </Link>

        <div className="flex-1 min-w-0 pr-5">
          <div className="flex items-center space-x-1 text-[11px] font-semibold text-[#0D8756]">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Verified Purchase</span>
          </div>
          <p className="text-xs font-bold text-neutral-900 truncate mt-0.5">
            {currentSale.name}
          </p>
          <Link
            to={`/product/${currentSale.slug}`}
            className="text-[11px] text-neutral-600 truncate block hover:text-black hover:underline"
          >
            purchased {currentSale.item}
          </Link>
          <span className="text-[10px] text-neutral-600 block mt-0.5">
            {currentSale.time}
          </span>
        </div>

        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-0 right-0 p-1 text-neutral-400 hover:text-neutral-800 transition-colors"
          aria-label="Dismiss notification"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};

export default SocialProofToast;
