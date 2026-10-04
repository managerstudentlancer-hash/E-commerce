import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ChevronRight,
  ShieldCheck,
  Gift,
  Truck,
  RotateCcw,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import api from '../services/api';

// Subcomponents
import OfferHero from '../components/offers/OfferHero';
import OfferFilterTabs from '../components/offers/OfferFilterTabs';
import SareeDealsSection from '../components/offers/SareeDealsSection';
import ExclusiveOffersSection from '../components/offers/ExclusiveOffersSection';
import CouponsSection from '../components/offers/CouponsSection';
import GiftCardSection from '../components/offers/GiftCardSection';
import FestivalOffersSection from '../components/offers/FestivalOffersSection';
import FlashDealsSection from '../components/offers/FlashDealsSection';

// Static fallback data if API/network is ever offline
import {
  sareeDeals as fallbackSarees,
  couponsList as fallbackCoupons,
  exclusiveOffers as fallbackExclusive,
  festivalOffers as fallbackFestival,
  limitedTimeFlashDeals as fallbackFlash,
} from '../data/offersData';

const OffersPage = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [toastMessage, setToastMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  // Dynamic offer lists loaded from Backend API
  const [offersList, setOffersList] = useState({
    sarees: fallbackSarees,
    coupons: fallbackCoupons,
    exclusive: fallbackExclusive,
    festival: fallbackFestival,
    flash: fallbackFlash,
  });

  const fetchBackendOffers = async () => {
    try {
      const res = await api.offers.getAll();
      if (res.success && Array.isArray(res.offers)) {
        const sarees = res.offers.filter((o) => o.section === 'saree-deals');
        const coupons = res.offers.filter((o) => o.section === 'coupons');
        const exclusive = res.offers.filter((o) => o.section === 'exclusive-offers');
        const festival = res.offers.filter((o) => o.section === 'festival-offers');
        const flash = res.offers.filter((o) => o.section === 'flash-deals');

        setOffersList({
          sarees: sarees.length > 0 ? sarees : (res.offers.length === 0 ? fallbackSarees : []),
          coupons: coupons.length > 0 ? coupons : (res.offers.length === 0 ? fallbackCoupons : []),
          exclusive: exclusive.length > 0 ? exclusive : (res.offers.length === 0 ? fallbackExclusive : []),
          festival: festival.length > 0 ? festival : (res.offers.length === 0 ? fallbackFestival : []),
          flash: flash.length > 0 ? flash : (res.offers.length === 0 ? fallbackFlash : []),
        });
      }
    } catch (err) {
      console.warn('Using local offers dataset:', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    document.title = 'Offers & Gift Cards | VEXIVO Women Fashion';
    fetchBackendOffers();

    // Auto-refresh when admin switches tabs or window gains focus
    const onFocus = () => fetchBackendOffers();
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 3500);
  };

  const handleSelectTab = (tabId) => {
    setActiveTab(tabId);
    if (tabId !== 'all') {
      const element = document.getElementById(tabId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  const handleScrollToSection = (sectionId) => {
    setActiveTab(sectionId);
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const featuredOffer =
    (offersList.flash && offersList.flash.length > 0 && offersList.flash[0]) ||
    (offersList.sarees && offersList.sarees.length > 0 && offersList.sarees[0]) ||
    null;

  return (
    <div className="min-h-screen bg-[#FAFAFA] text-neutral-900 pb-16 font-sans">
      {/* 1. Breadcrumb Bar */}
      <div className="bg-white border-b border-neutral-200/70 py-2.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex items-center space-x-2 text-xs text-neutral-500 font-medium">
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
          <span className="text-neutral-900 font-bold">Offers &amp; Gift Cards</span>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 sm:pt-6">
        {/* 2. Hero Section */}
        <OfferHero onScrollToSection={handleScrollToSection} featuredOffer={featuredOffer} />

        {/* 3. Sticky Filter Pills Bar */}
        <OfferFilterTabs activeTab={activeTab} onSelectTab={handleSelectTab} />

        {/* 4. Sections with Dynamic Data */}
        {(activeTab === 'all' || activeTab === 'saree-deals') && (
          <SareeDealsSection data={offersList.sarees} onOfferClaimed={triggerToast} />
        )}

        {(activeTab === 'all' || activeTab === 'coupons') && (
          <CouponsSection data={offersList.coupons} onCouponCopied={triggerToast} />
        )}

        {(activeTab === 'all' || activeTab === 'gift-cards') && (
          <GiftCardSection onGiftCardPurchased={triggerToast} />
        )}

        {(activeTab === 'all' || activeTab === 'exclusive-offers') && (
          <ExclusiveOffersSection data={offersList.exclusive} />
        )}

        {(activeTab === 'all' || activeTab === 'flash-deals') && (
          <FlashDealsSection data={offersList.flash} onFlashDealClaimed={triggerToast} />
        )}

        {(activeTab === 'all' || activeTab === 'festival-offers') && (
          <FestivalOffersSection data={offersList.festival} />
        )}

        {/* 5. Compact Trust Badges */}
        <div className="mt-8 bg-white rounded-2xl p-4 sm:p-6 border border-neutral-200 shadow-2xs grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
              <ShieldCheck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase">
                100% Authentic
              </h4>
              <p className="text-[10px] text-neutral-500">
                Silk Mark certified drapes.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Gift className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase">
                Instant Vouchers
              </h4>
              <p className="text-[10px] text-neutral-500">
                Immediate email delivery.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Truck className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase">
                Free Delivery
              </h4>
              <p className="text-[10px] text-neutral-500">
                On all offer orders &gt; ₹999.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center flex-shrink-0">
              <RotateCcw className="w-4.5 h-4.5" />
            </div>
            <div>
              <h4 className="text-[11px] font-bold text-neutral-900 uppercase">
                7-Day Returns
              </h4>
              <p className="text-[10px] text-neutral-500">
                Quick door pickup &amp; refunds.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in">
          <div className="bg-neutral-950 text-white px-4 py-3 rounded-2xl shadow-xl border border-white/20 flex items-center space-x-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default OffersPage;
