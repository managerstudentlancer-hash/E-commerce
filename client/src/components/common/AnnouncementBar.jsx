import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X, Globe, PhoneCall, Package, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useSettings } from '../../context/SettingsContext';

const defaultAnnouncements = [
  '✨ COMPLIMENTARY PAN-INDIA NEXT-DAY COURIER ON ORDERS OVER ₹499',
  '🔥 FESTIVE 2026 CAPSULE HAS ARRIVED | USE CODE AUTUMN30 FOR 30% OFF',
  '⭐ RATED 4.9/5 ACROSS 18,500+ VERIFIED CLIENTELE REVIEWS IN INDIA',
  '⚡ 30-DAY COMPLIMENTARY RETURNS & BESPOKE LUXURY PACKAGING',
];

const AnnouncementBar = ({ announcements: customAnnouncements }) => {
  const { settings } = useSettings();
  const announcements =
    customAnnouncements && customAnnouncements.length > 0
      ? customAnnouncements
      : (settings?.announcements && settings.announcements.length > 0 ? settings.announcements : (settings?.announcementText ? [settings.announcementText] : defaultAnnouncements));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [currency] = useState(settings?.currencyCode || 'INR');

  useEffect(() => {
    if (!announcements.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [announcements.length]);

  if (!isVisible) return null;

  return (
    <div className="bg-neutral-900 text-white text-[11px] tracking-wide relative border-b border-neutral-800 z-50">
      <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between select-none">
        {/* Left: Region & Currency Selector */}
        <div className="hidden md:flex items-center space-x-3 text-neutral-400">
          <div className="flex items-center space-x-1.5 cursor-pointer hover:text-white transition-colors">
            <span className="text-sm">🇮🇳</span>
            <span className="font-semibold text-neutral-200">India</span>
            <span className="text-neutral-500 font-mono text-[10px]">(₹ {currency})</span>
          </div>
          <span className="text-neutral-700">|</span>
          <span className="text-neutral-300 font-medium flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse inline-block" />
            <span>Pan-India Dispatch Live</span>
          </span>
        </div>

        {/* Center: Dynamic Carousel */}
        <div className="flex-1 flex items-center justify-center space-x-2 px-2 text-center">
          <button
            onClick={() =>
              setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length)
            }
            className="text-neutral-400 hover:text-white p-0.5 transition-colors"
            aria-label="Previous announcement"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          <div className="min-h-[18px] flex items-center justify-center overflow-hidden max-w-xl">
            <p
              key={currentIndex}
              className="font-medium uppercase tracking-wider text-[10px] sm:text-[11px] text-amber-200 animate-in fade-in duration-300"
            >
              {announcements[currentIndex]}
            </p>
          </div>

          <button
            onClick={() => setCurrentIndex((prev) => (prev + 1) % announcements.length)}
            className="text-neutral-400 hover:text-white p-0.5 transition-colors"
            aria-label="Next announcement"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Right: Quick Utility Links & Close */}
        <div className="hidden lg:flex items-center space-x-4 text-neutral-400">
          <Link
            to="/track-order"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <Package className="w-3 h-3 text-neutral-400" />
            <span>Track Order</span>
          </Link>
          <span className="text-neutral-700">•</span>
          <Link
            to="/contact"
            className="hover:text-white transition-colors flex items-center space-x-1"
          >
            <PhoneCall className="w-3 h-3 text-neutral-400" />
            <span>Concierge ({settings?.contactInfo?.phone || '+91 80000 12345'})</span>
          </Link>
          <button
            onClick={() => setIsVisible(false)}
            className="text-neutral-500 hover:text-white transition-colors ml-2"
            aria-label="Dismiss announcement bar"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
