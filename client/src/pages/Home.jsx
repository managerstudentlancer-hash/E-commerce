import React, { useState, useEffect } from 'react';
import api from '../services/api';
import CategoryBubbles from '../components/home/CategoryBubbles';
import CountdownTimerBanner from '../components/home/CountdownTimerBanner';
import HeroBanner from '../components/home/HeroBanner';
import TikTokCarousel from '../components/home/TikTokCarousel';
import NewArrivalsSection from '../components/home/NewArrivalsSection';
import PromotionalBanners from '../components/home/PromotionalBanners';
import FeaturedCollectionTabs from '../components/home/FeaturedCollectionTabs';
import { CustomProductSpotlight, CustomDualBanners } from '../components/home/CustomContentPromos';
import FavoriteProductsSection from '../components/home/FavoriteProductsSection';
import ShoppableLookbook from '../components/home/ShoppableLookbook';
import SpecialOffersSection from '../components/home/SpecialOffersSection';
import SeoRichTextSection from '../components/home/SeoRichTextSection';
import MulticolumnTrustIcons from '../components/home/MulticolumnTrustIcons';
import SocialProofToast from '../components/home/SocialProofToast';
import WelcomeDiscountModal from '../components/common/WelcomeDiscountModal';

const Home = () => {
  const [banners, setBanners] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [newArrivals, setNewArrivals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        // Fetch hero banners
        api.banners.getActive('hero')
          .then((res) => {
            if (res.success && res.banners?.length > 0) setBanners(res.banners);
          })
          .catch(() => {});

        // Fetch products for Special Offers & New Arrivals
        api.products.getAll({ limit: 48 })
          .then((res) => {
            if (res.success && res.products) {
              const all = res.products;
              const offers = all.filter((p) => p.specialOffer || p.discount > 0);
              const arrivals = all.filter((p) => p.newArrival || p.bestseller);
              setSpecialOffers(offers.length >= 4 ? offers.slice(0, 8) : all.slice(0, 8));
              setNewArrivals(arrivals.length >= 4 ? arrivals.slice(0, 8) : all.slice(8, 16));
            }
          })
          .catch(() => {});
      } catch (err) {
        console.error('Home load error:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="w-full">
      {/* 1. Category Quick Navigation Bubbles (Shaporoo collection_list_slider) */}
      <CategoryBubbles />

      {/* 2. Urgent Flash Event Countdown Ribbon (Shaporoo countdown_timer) */}
      <CountdownTimerBanner />

      {/* 3. Hero Slider with Multicolumn (Shaporoo slider_with_multicolumn) */}
      <HeroBanner banners={banners} />

      {/* 4. TikTok / Social Video Inspiration Carousel (Shaporoo ticktock_carousal) */}
      <TikTokCarousel />

      {/* 5. New Arrivals Carousel (Shaporoo featured_collection "New Arrivals") */}
      <NewArrivalsSection products={newArrivals} />

      {/* 6. Bento Promotional Grid (Shaporoo grid_banner "Our Best Winter Products") */}
      <PromotionalBanners />

      {/* 7. Tabbed Featured Collections (Shaporoo collection_tabs) */}
      <FeaturedCollectionTabs />

      {/* 8. Feature Product Spotlight Block (Shaporoo custom_content_HPgFTK) */}
      <CustomProductSpotlight />

      {/* 9. OUR FAVORITE PRODUCTS & REVIEWS (Shaporoo favorite_products "Our Favorite Products") */}
      <FavoriteProductsSection />

      {/* 10. Interactive Shoppable Lookbook (Shaporoo lookbook_slider "Get Inspired by Spaces") */}
      <ShoppableLookbook />

      {/* 11. Two-Column Category Promo Banners (Shaporoo custom_content_JxRy7x) */}
      <CustomDualBanners />

      {/* 12. Special Offers & Reductions (Shaporoo featured_collection "Special Offers") */}
      <SpecialOffersSection products={specialOffers} />

      {/* 13. SEO & Brand Rich Text Accordion (Shaporoo seo_rich_text "Buy Trending Products Online UK") */}
      <SeoRichTextSection />

      {/* 14. Multicolumn Trust Icons (Shaporoo multicolumn_icon - Free Delivery, 24/7 Support, Returns, Secure) */}
      <MulticolumnTrustIcons />

      {/* 15. Live Purchase Social Proof Toast (Bottom-Left) */}
      <SocialProofToast />

      {/* 16. Welcome Offer Discount Popup Modal (Shaporoo popup-welcome-discount) */}
      <WelcomeDiscountModal />
    </div>
  );
};

export default Home;
