import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Globe, PhoneCall, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const defaultAnnouncements = [
  '✨ COMPLIMENTARY PAN-INDIA NEXT-DAY COURIER ON ORDERS OVER ₹499',
  '🔥 FESTIVE 2026 CAPSULE HAS ARRIVED | USE CODE AUTUMN30 FOR 30% OFF',
  '⭐ RATED 4.9/5 ACROSS 18,500+ VERIFIED CLIENTELE REVIEWS IN INDIA',
  '⚡ 30-DAY COMPLIMENTARY RETURNS & BESPOKE LUXURY PACKAGING',
];

const AnnouncementBar = ({ announcements = defaultAnnouncements }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currency, setCurrency] = useState('INR');

  useEffect(() => {
    if (!announcements.length) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4200);
    return () => clearInterval(timer);
  }, [announcements.length]);

  if (!isVisible || !announcements.length) return null;

  const next = () => setCurrentIndex((prev) => (prev + 1) % announcements.length);
  const prev = () => setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);

  return (
    <div className="bg-[#0D0D0D] text-white text-xs font-semibold py-2 px-3 sm:px-6 transition-all relative z-40 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-[11px]">
        {/* Left: Region & Currency Selector */}
        <div className="hidden md:flex items-center space-x-3 text-neutral-400">
          <div className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
            <span className="text-sm">🇮🇳</span>
            <span className="font-semibold text-neutral-200">India</span>
            <span className="text-neutral-500 font-mono text-[10px]">(₹ INR)</span>
          </div>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-300 font-medium flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span>Pan-India Dispatch Live</span>
          </span>
        </div>

        {/* Center: Interactive Announcement Ticker */}
        <div className="flex items-center justify-center flex-1 max-w-xl mx-2">
          <button
            onClick={prev}
            aria-label="Previous announcement"
            className="text-neutral-400 hover:text-white transition-colors p-1"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="overflow-hidden text-center mx-2 w-full">
            <p
              key={currentIndex}
              className="tracking-wider uppercase text-[10px] sm:text-[11px] font-semibold text-neutral-100 animate-fade-in truncate select-none"
            >
              {announcements[currentIndex]}
            </p>
          </div>

          <button
            onClick={next}
            aria-label="Next announcement"
            className="text-neutral-400 hover:text-white transition-colors p-1"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Links (Track, Concierge, Dismiss) */}
        <div className="hidden lg:flex items-center space-x-4 text-neutral-400">
          <Link
            to="/account/orders"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <Package className="w-3 h-3 text-neutral-400" />
            <span>Track Order</span>
          </Link>
          <span className="text-neutral-700">|</span>
          <Link
            to="/contact"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <PhoneCall className="w-3 h-3 text-neutral-400" />
            <span>Concierge (+44 20 7946 0991)</span>
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement"
            className="text-neutral-500 hover:text-white transition-colors p-1 ml-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Mobile Dismiss */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement"
            className="text-neutral-500 hover:text-white transition-colors p-1"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
