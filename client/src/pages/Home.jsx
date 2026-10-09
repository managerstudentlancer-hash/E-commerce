import React, { useState, useEffect } from 'react';
import api from '../services/api';

// Reference UI Components (Exact Visuals from Screenshots)
import ReferenceHero from '../components/home/ReferenceHero';
import CircularCategories from '../components/home/CircularCategories';
import DualPromoBanners from '../components/home/DualPromoBanners';
import TrendingProductsSection from '../components/home/TrendingProductsSection';

// Preserved Original VEXIVO Content & Interactive Sections
import FeaturedCollectionTabs from '../components/home/FeaturedCollectionTabs';
import TikTokCarousel from '../components/home/TikTokCarousel';
import ShoppableLookbook from '../components/home/ShoppableLookbook';
import SpecialOffersSection from '../components/home/SpecialOffersSection';
import FavoriteProductsSection from '../components/home/FavoriteProductsSection';
import SeoRichTextSection from '../components/home/SeoRichTextSection';
import SocialProofToast from '../components/home/SocialProofToast';
import WelcomeDiscountModal from '../components/common/WelcomeDiscountModal';

const Home = () => {
  const [heroBanners, setHeroBanners] = useState([]);
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // 1. Fetch active banners (including any admin-uploaded slides)
        api.banners.getActive()
          .then((res) => {
            if (res.success && res.banners?.length > 0) {
              setHeroBanners(res.banners.filter((b) => !b.position || b.position === 'hero'));
            }
          })
          .catch(() => {});

        // 2. Fetch all products for Trending & Special Offers
        api.products.getAll({ limit: 350 })
          .then((res) => {
            if (res.success && res.products) {
              const all = res.products;

              // Trending products
              const trending = all.filter(
                (p) => p.bestseller || p.featured || p.rating >= 4.7 || p.discount > 0
              );
              setTrendingProducts(trending.length >= 5 ? trending.slice(0, 10) : all.slice(0, 10));

              // Special offers
              const offers = all.filter((p) => p.specialOffer || p.discount > 0);
              setSpecialOffers(offers.length >= 4 ? offers : all.slice(0, 8));
            }
          })
          .catch(() => {});
      } catch (err) {
        console.error('Home data load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();

    // Auto-refresh when admin modifies banners and switches back to tab
    window.addEventListener('focus', loadHomeData);
    window.addEventListener('vexivo_banners_updated', loadHomeData);
    return () => {
      window.removeEventListener('focus', loadHomeData);
      window.removeEventListener('vexivo_banners_updated', loadHomeData);
    };
  }, []);

  return (
    <div className="w-full bg-white font-sans antialiased overflow-x-hidden pb-16 lg:pb-0">
      {/* ============================================================ */}
      {/* 1. REFERENCE SCREENSHOT SECTIONS (EXACT VISUAL MATCH)       */}
      {/* ============================================================ */}

      {/* Hero Section with Lifestyle Visual, Floating Trust Card & Banner Support */}
      <ReferenceHero banners={heroBanners} />

      {/* Circular Categories (Men, Women, Shoes, Bags, Watches, Accessories, etc.) */}
      <CircularCategories />

      {/* Two Promotional Banners Side-by-Side (Summer Sale & New Trends) */}
      <DualPromoBanners />

      {/* Trending Products (5-Column Grid with Warm Podium Cards) */}
      <TrendingProductsSection products={trendingProducts} />

      {/* ============================================================ */}
      {/* 2. PRESERVED ORIGINAL VEXIVO CONTENT & INTERACTIVE SECTIONS  */}
      {/* ============================================================ */}

      {/* Tabbed Featured Collections (Women, Men, Footwear, Bags, Luxury) */}
      <FeaturedCollectionTabs />

      {/* Interactive Shoppable Lookbook ("Get Inspired by Spaces") */}
      <ShoppableLookbook />

      {/* TikTok / Social Video Inspiration Carousel */}
      <TikTokCarousel />

      {/* Special Offers & Reductions */}
      <SpecialOffersSection products={specialOffers} />

      {/* Customer Favorites & Verified Reviews Section */}
      <FavoriteProductsSection />

      {/* SEO & Brand Rich Text Accordion */}
      <SeoRichTextSection />

      {/* Live Social Proof Purchase Notification Toast */}
      <SocialProofToast />

      {/* Welcome Offer Discount Popup Modal */}
      <WelcomeDiscountModal />
    </div>
  );
};

export default Home;
