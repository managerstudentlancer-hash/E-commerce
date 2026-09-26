import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX, ChevronLeft, ChevronRight, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';

const tiktokVideos = [
  {
    id: 'tt-1',
    title: 'French-Style Linen Dress Editorial Styling',
    creator: '@vexivo_style',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/8948acfcaa964179ae1e8d0047f0f0ec.mp4',
    poster: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    product: {
      name: 'French-Style Linen Lantern Dress',
      price: 95.00,
      compareAtPrice: 135.00,
      slug: 'the-kensington-tailored-wool-pleated-trouser',
    },
  },
  {
    id: 'tt-2',
    title: 'Titanium Smart Watch & Health Tracker',
    creator: '@tech_london',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/e4d781e74abe4f3292a67457117d71c4.mp4',
    poster: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    product: {
      name: 'Titanium Chrono Automatic Watch',
      price: 245.00,
      compareAtPrice: 320.00,
      slug: 'the-kensington-tailored-wool-pleated-trouser',
    },
  },
  {
    id: 'tt-3',
    title: 'Savile Row Pleated Wool Trousers in Movement',
    creator: '@menswear_atelier',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/678114669f964e7ba402774fba2ec69d.mp4',
    poster: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    product: {
      name: 'The Kensington Wool Pleated Trouser',
      price: 145.00,
      compareAtPrice: 190.00,
      slug: 'the-kensington-tailored-wool-pleated-trouser',
    },
  },
  {
    id: 'tt-4',
    title: 'Tuscan Full-Grain Leather Saddle Bag Unboxing',
    creator: '@luxury_daily_uk',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/e30998a37445413d921fbf807b043e75.mp4',
    poster: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    product: {
      name: 'Top-Grain Genuine Leather Crossbody Bag',
      price: 140.00,
      compareAtPrice: 195.00,
      slug: 'the-mayfair-top-grain-leather-tote',
    },
  },
  {
    id: 'tt-5',
    title: 'Aethel Spatial Noise-Cancelling Headphones Test',
    creator: '@sound_lab_uk',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/f86aa773d0e44d3ab0dfd5d4abfb4b61.mp4',
    poster: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    product: {
      name: 'VEXIVO Spatial ANC Headphones',
      price: 189.00,
      compareAtPrice: 249.00,
      slug: 'vexivo-aethel-spatial-headphones',
    },
  },
];

const ContinuousVideoCard = ({ video, isMuted, toggleMute }) => {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  // Guarantee continuous uninterrupted autoplay on mount & updates
  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = isMuted;

    const playVideo = () => {
      const promise = vid.play();
      if (promise !== undefined) {
        promise.catch(() => {
          // Retry muted autoplay
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    };

    playVideo();

    // Prevent any browser pause event: automatically resume playback immediately
    const handlePause = () => {
      vid.play().catch(() => {});
    };

    vid.addEventListener('pause', handlePause);
    return () => {
      vid.removeEventListener('pause', handlePause);
    };
  }, [isMuted, video.videoUrl]);

  return (
    <div className="flex-shrink-0 w-[220px] sm:w-[250px] md:w-[270px] flex flex-col gap-2.5 group select-none">
      {/* 9:16 Video Stage (177.78% padding-top) */}
      <div className="relative w-full pt-[177.78%] rounded-2xl overflow-hidden bg-neutral-950 shadow-md border border-neutral-100 transition-all duration-300 hover:shadow-xl">
        
        {/* Continuous Autoplaying Video */}
        {!hasError ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            onError={() => setHasError(true)}
            className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          />
        ) : (
          <img
            src={video.poster}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Video Gradient Shadow Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

        {/* Top Header: Creator Handle & Sound Toggle */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/10">
            {video.creator}
          </span>

          {/* Sound Toggle Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleMute();
            }}
            aria-label={isMuted ? 'Unmute video sound' : 'Mute video sound'}
            className="w-7 h-7 rounded-full bg-black/50 backdrop-blur-md text-white hover:bg-black flex items-center justify-center transition-all shadow-sm active:scale-95"
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 text-white" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 text-white" />
            )}
          </button>
        </div>

        {/* Bottom Shaporoo Shop Now Sweep-Fill Button */}
        <Link
          to={`/product/${video.product.slug}`}
          className="absolute bottom-3 inset-x-3 z-10 py-2.5 px-4 rounded-full bg-white text-black hover:bg-neutral-900 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg transition-all duration-300"
        >
          <span>Shop Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Card Below Title & Price */}
      <div className="px-1 text-left">
        <Link
          to={`/product/${video.product.slug}`}
          className="text-xs sm:text-[13px] font-extrabold text-neutral-900 hover:text-black line-clamp-1 transition-colors block"
        >
          {video.product.name}
        </Link>
        <div className="flex items-baseline space-x-2 mt-0.5">
          <span className="text-xs font-extrabold text-[#C4301C]">
            ₹{video.product.price.toFixed(2)}
          </span>
          {video.product.compareAtPrice > video.product.price && (
            <span className="text-[11px] text-neutral-400 line-through">
              ₹{video.product.compareAtPrice.toFixed(2)}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const TikTokCarousel = () => {
  const scrollRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      const scrollOffset = dir === 'left' ? -380 : 380;
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Shaporoo 1:1 TikTok / Social Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#C4301C] mb-1.5">
              {/* TikTok Music Note SVG Icon */}
              <svg className="w-4 h-4 fill-current text-[#C4301C]" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.77a8.27 8.27 0 0 0 4.9 1.6V6.92a4.85 4.85 0 0 1-1-.23z" />
              </svg>
              <span>Trending On TikTok & Social</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
              Watch & <strong className="font-black text-[#C4301C]">Shop</strong>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md font-medium">
              Community styling, live unboxings, and viral fashion clips running non-stop. Tap to shop any look.
            </p>
          </div>

          {/* Controls: Left & Right Arrows */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => handleScroll('left')}
              aria-label="Previous social videos"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200 hover:border-black text-neutral-700 hover:text-black shadow-sm flex items-center justify-center transition-all active:scale-95 hover:bg-neutral-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              aria-label="Next social videos"
              className="w-10 h-10 rounded-full bg-white border border-neutral-200 hover:border-black text-neutral-700 hover:text-black shadow-sm flex items-center justify-center transition-all active:scale-95 hover:bg-neutral-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 9:16 Video Track — Runs Continuously */}
        <div
          ref={scrollRef}
          className="flex space-x-4 sm:space-x-6 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {tiktokVideos.map((video) => (
            <ContinuousVideoCard
              key={video.id}
              video={video}
              isMuted={isMuted}
              toggleMute={toggleMute}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default TikTokCarousel;
