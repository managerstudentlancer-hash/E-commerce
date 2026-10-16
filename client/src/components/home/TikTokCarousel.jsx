import React, { useRef, useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
  ShoppingBag,
  ArrowRight,
  X,
  Star,
  Check,
  Sparkles,
  ExternalLink,
  Play,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '../../context/CartContext';

const tiktokVideos = [
  {
    id: 'tt-1',
    title: 'French-Style Floral Lantern Sleeve Midi Dress',
    creator: '@vexivo_style',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/8948acfcaa964179ae1e8d0047f0f0ec.mp4',
    poster: 'https://images.unsplash.com/photo-1485230895905-ec40ba36b9bc?auto=format&fit=crop&w=800&q=80',
    product: {
      id: 'tt-prod-1',
      name: 'French Floral Lantern Sleeve Midi Dress',
      price: 1999,
      compareAtPrice: 2899,
      discount: 31,
      rating: 4.9,
      reviewsCount: 48,
      category: 'Women Wear',
      slug: 'french-floral-lantern-sleeve-midi-dress',
      image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'tt-2',
    title: 'Minimalist Ceramic Quartz Chrono Watch',
    creator: '@tech_india',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/e4d781e74abe4f3292a67457117d71c4.mp4',
    poster: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    product: {
      id: 'tt-prod-2',
      name: 'Minimalist Ceramic Quartz Wrist Watch',
      price: 2499,
      compareAtPrice: 3499,
      discount: 28,
      rating: 5.0,
      reviewsCount: 38,
      category: 'Watches',
      slug: 'minimalist-ceramic-quartz-wrist-watch',
      image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'tt-3',
    title: 'Savile Row Pleated Wool Trousers in Movement',
    creator: '@menswear_atelier',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/678114669f964e7ba402774fba2ec69d.mp4',
    poster: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80',
    product: {
      id: 'tt-prod-3',
      name: 'The Kensington Super 120s Double-Pleat Trouser',
      price: 1899,
      compareAtPrice: 2499,
      discount: 24,
      rating: 4.9,
      reviewsCount: 64,
      category: 'Men Wear',
      slug: 'the-kensington-super-120s-double-pleat-trouser',
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'tt-4',
    title: 'Tuscan Full-Grain Leather Saddle Bag Unboxing',
    creator: '@luxury_daily',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/e30998a37445413d921fbf807b043e75.mp4',
    poster: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    product: {
      id: 'tt-prod-4',
      name: 'Top-Grain Genuine Leather Crossbody Bag',
      price: 2199,
      compareAtPrice: 2999,
      discount: 26,
      rating: 4.8,
      reviewsCount: 52,
      category: 'Bags',
      slug: 'the-mayfair-top-grain-leather-tote',
      image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    },
  },
  {
    id: 'tt-5',
    title: 'Spatial Active Noise-Cancelling Headphones Test',
    creator: '@sound_lab',
    videoUrl: 'https://cdn.shopify.com/videos/c/o/v/f86aa773d0e44d3ab0dfd5d4abfb4b61.mp4',
    poster: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    product: {
      id: 'tt-prod-5',
      name: 'Active Noise-Cancelling Wireless Headphones',
      price: 1499,
      compareAtPrice: 2199,
      discount: 31,
      rating: 4.9,
      reviewsCount: 112,
      category: 'Electronics',
      slug: 'active-noise-cancelling-wireless-headphones',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    },
  },
];

const ContinuousVideoCard = ({ video, index, isAudioActive, onToggleAudio, onOpenModal }) => {
  const videoRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    vid.muted = !isAudioActive;

    const playVideo = () => {
      const promise = vid.play();
      if (promise !== undefined) {
        promise.catch(() => {
          vid.muted = true;
          vid.play().catch(() => {});
        });
      }
    };

    playVideo();

    const handlePause = () => {
      vid.play().catch(() => {});
    };

    vid.addEventListener('pause', handlePause);
    return () => {
      vid.removeEventListener('pause', handlePause);
    };
  }, [isAudioActive, video.videoUrl]);

  return (
    <div className="flex-shrink-0 w-[78vw] max-w-[260px] sm:w-[250px] md:w-[270px] snap-center flex flex-col gap-2.5 group select-none">
      {/* 9:16 Video Stage */}
      <div
        onClick={() => onOpenModal(index)}
        className="relative w-full pt-[177.78%] rounded-2xl overflow-hidden bg-neutral-950 shadow-md border border-neutral-100 transition-all duration-300 hover:shadow-xl cursor-pointer group/card"
      >
        {/* Continuous Autoplaying Video */}
        {!hasError ? (
          <video
            ref={videoRef}
            src={video.videoUrl}
            autoPlay
            loop
            muted={!isAudioActive}
            playsInline
            preload="auto"
            onError={() => setHasError(true)}
            className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none group-hover/card:scale-105 transition-transform duration-700 ease-out"
          />
        ) : (
          <img
            src={video.poster}
            alt={video.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}

        {/* Video Gradient Shadow Overlay for Text Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-black/35 pointer-events-none" />

        {/* Top Header: Creator Handle & Sound Toggle Button */}
        <div className="absolute top-3 inset-x-3 flex items-center justify-between z-10">
          <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold tracking-wider uppercase border border-white/10 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <span>{video.creator}</span>
          </span>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleAudio(video.id);
            }}
            aria-label={isAudioActive ? 'Mute audio' : 'Turn on audio'}
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-all shadow-md active:scale-95 ${
              isAudioActive
                ? 'bg-amber-500 text-neutral-950 ring-2 ring-amber-300'
                : 'bg-black/60 backdrop-blur-md text-white hover:bg-black/90'
            }`}
          >
            {isAudioActive ? (
              <Volume2 className="w-4 h-4 text-neutral-950 animate-pulse" />
            ) : (
              <VolumeX className="w-4 h-4 text-white" />
            )}
          </button>
        </div>

        {/* Floating Mini Product Pill over Video */}
        <div className="absolute bottom-14 inset-x-3 z-10 flex items-center space-x-2 bg-white/95 backdrop-blur-md p-2 rounded-xl border border-white/80 shadow-md">
          <img
            src={video.product.image}
            alt={video.product.name}
            className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
          />
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-bold text-neutral-950 truncate leading-tight">
              {video.product.name}
            </p>
            <p className="text-[11px] font-extrabold text-[#C4301C] mt-0.5 leading-none">
              ₹{video.product.price.toLocaleString('en-IN')}
            </p>
          </div>
        </div>

        {/* Bottom "Shop Look" Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onOpenModal(index);
          }}
          className="absolute bottom-3 inset-x-3 z-10 py-2.5 px-4 rounded-xl bg-white text-neutral-950 hover:bg-neutral-950 hover:text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-1.5 shadow-lg transition-all duration-300 active:scale-95"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Shop Look</span>
        </button>
      </div>

      {/* Card Details Below Video */}
      <div className="px-1 text-left">
        <Link
          to={`/product/${video.product.slug}`}
          className="text-xs sm:text-[13px] font-extrabold text-neutral-900 hover:text-amber-900 line-clamp-1 transition-colors block"
        >
          {video.product.name}
        </Link>
        <div className="flex items-baseline space-x-2 mt-0.5">
          <span className="text-xs font-extrabold text-neutral-950">
            ₹{video.product.price.toLocaleString('en-IN')}
          </span>
          {video.product.compareAtPrice > video.product.price && (
            <span className="text-[11px] text-neutral-400 line-through">
              ₹{video.product.compareAtPrice.toLocaleString('en-IN')}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

const TikTokCarousel = () => {
  const scrollRef = useRef(null);
  const [activeAudioId, setActiveAudioId] = useState(null);
  const [activeModalIndex, setActiveModalIndex] = useState(null);
  const [modalAdded, setModalAdded] = useState(false);
  const [isCarouselHovered, setIsCarouselHovered] = useState(false);
  const [isModalPlaying, setIsModalPlaying] = useState(true);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const modalVideoRef = useRef(null);
  const { addToCart } = useCart();

  // Continuous auto-scrolling ticker for the homepage carousel
  useEffect(() => {
    if (isCarouselHovered || activeModalIndex !== null) return;
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 30) {
          scrollRef.current.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          const scrollStep = clientWidth < 640 ? clientWidth * 0.8 : 280;
          scrollRef.current.scrollBy({ left: scrollStep, behavior: 'smooth' });
        }
      }
    }, 4500);
    return () => clearInterval(timer);
  }, [isCarouselHovered, activeModalIndex]);

  const handleScroll = (dir) => {
    if (scrollRef.current) {
      const scrollOffset = dir === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollOffset, behavior: 'smooth' });
    }
  };

  const toggleAudio = (videoId) => {
    setActiveAudioId((prev) => (prev === videoId ? null : videoId));
  };

  const handleOpenModal = (index) => {
    setActiveModalIndex(index);
    setModalAdded(false);
    setIsModalPlaying(true);
  };

  const handleCloseModal = () => {
    setActiveModalIndex(null);
  };

  const toggleModalPlay = () => {
    if (modalVideoRef.current) {
      if (modalVideoRef.current.paused) {
        modalVideoRef.current.play();
        setIsModalPlaying(true);
      } else {
        modalVideoRef.current.pause();
        setIsModalPlaying(false);
      }
    }
  };

  // Continuous Navigation handlers in Modal: seamlessly auto-advances or manual jumps
  const handleNextVideo = useCallback(() => {
    setActiveModalIndex((prev) => (prev === null ? 0 : (prev + 1) % tiktokVideos.length));
    setModalAdded(false);
    setIsModalPlaying(true);
  }, []);

  const handlePrevVideo = useCallback(() => {
    setActiveModalIndex((prev) => (prev === null ? 0 : (prev - 1 + tiktokVideos.length) % tiktokVideos.length));
    setModalAdded(false);
    setIsModalPlaying(true);
  }, []);

  // Keyboard navigation when modal is open
  useEffect(() => {
    if (activeModalIndex === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault();
        handleNextVideo();
      } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrevVideo();
      } else if (e.key === 'Escape') {
        handleCloseModal();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeModalIndex, handleNextVideo, handlePrevVideo]);

  const activeVideo = activeModalIndex !== null ? tiktokVideos[activeModalIndex] : null;

  const handleModalAddToCart = () => {
    if (!activeVideo?.product) return;
    const p = activeVideo.product;
    addToCart(
      {
        _id: p.id,
        id: p.id,
        name: p.name,
        price: p.price,
        image: p.image,
        images: [p.image],
        category: p.category,
        slug: p.slug,
        stock: 15,
      },
      1
    );
    setModalAdded(true);
    setTimeout(() => setModalAdded(false), 2200);
  };

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-amber-900/90 mb-1.5">
              <svg className="w-4 h-4 fill-current text-neutral-900" viewBox="0 0 24 24">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.82 4.47 6.27 6.27 0 0 0 1.87-4.47V8.77a8.27 8.27 0 0 0 4.9 1.6V6.92a4.85 4.85 0 0 1-1-.23z" />
              </svg>
              <span>Trending On TikTok &amp; Social</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-neutral-900">
              Watch &amp; <span className="font-serif italic font-normal text-amber-950">Shop</span>
            </h2>

            <p className="text-xs sm:text-sm text-neutral-600 mt-1 max-w-md font-medium">
              Community styling, live unboxings, and viral fashion clips running non-stop. Tap any video to inspect and watch continuous live reels.
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

        {/* 9:16 Video Track — Runs Continuously with Snap Centering */}
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsCarouselHovered(true)}
          onMouseLeave={() => setIsCarouselHovered(false)}
          className="flex space-x-4 sm:space-x-6 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory px-4 sm:px-0 pb-2"
        >
          {tiktokVideos.map((video, idx) => (
            <ContinuousVideoCard
              key={video.id}
              video={video}
              index={idx}
              isAudioActive={activeAudioId === video.id}
              onToggleAudio={toggleAudio}
              onOpenModal={handleOpenModal}
            />
          ))}
        </div>

      </div>

      {/* Continuous Reel Watch & Shop Modal */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
          {/* Backdrop */}
          <div
            onClick={handleCloseModal}
            className="fixed inset-0 bg-neutral-950/85 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <div className="relative w-full max-w-xl md:max-w-3xl bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl z-10 border border-neutral-100 flex flex-col md:flex-row max-h-[92vh] mx-auto">
            
            {/* Close Button */}
            <button
              onClick={handleCloseModal}
              aria-label="Close modal"
              className="absolute top-3 right-3 sm:top-4 sm:right-4 z-40 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black text-white flex items-center justify-center shadow-md active:scale-95 transition-all backdrop-blur-md border border-white/20"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Left/Top: Continuous Video Player with TikTok Navigation & Story Bars */}
            <div 
              onClick={toggleModalPlay}
              className="relative w-full md:w-[48%] bg-black flex items-center justify-center overflow-hidden cursor-pointer select-none h-[42vh] sm:h-[48vh] md:h-auto md:min-h-[500px]"
            >
              {/* Top Story Progress Segments */}
              <div className="absolute top-2.5 inset-x-3 z-30 flex items-center space-x-1.5">
                {tiktokVideos.map((v, i) => (
                  <div
                    key={v.id}
                    className="flex-1 h-1 rounded-full bg-white/30 overflow-hidden"
                  >
                    <div
                      className={`h-full transition-all duration-300 ${
                        i < activeModalIndex
                          ? 'w-full bg-white'
                          : i === activeModalIndex
                          ? 'w-full bg-amber-400 animate-pulse'
                          : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Seamless Centered Video Element: plays centered with object-contain/object-cover */}
              <video
                key={activeVideo.id}
                ref={modalVideoRef}
                src={activeVideo.videoUrl}
                autoPlay
                playsInline
                loop={false}
                muted={isModalMuted}
                onEnded={handleNextVideo}
                className="w-full h-full object-contain md:object-cover mx-auto"
              />

              {/* Sound Toggle Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsModalMuted((prev) => !prev);
                }}
                className="absolute top-7 left-3 z-30 p-2 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md border border-white/20 transition-all"
                title={isModalMuted ? 'Unmute' : 'Mute'}
              >
                {isModalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-amber-400" />}
              </button>

              {/* Play/Pause Center Indicator */}
              {!isModalPlaying && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-20 pointer-events-none">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-neutral-950 flex items-center justify-center shadow-xl">
                    <Play className="w-6 h-6 ml-1 fill-current" />
                  </div>
                </div>
              )}

              {/* Floating Vertical Next/Prev Reel Controls (TikTok / Reels Style) */}
              <div 
                className="absolute right-3 top-1/2 -translate-y-1/2 z-30 flex flex-col items-center space-y-2 pointer-events-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={handlePrevVideo}
                  title="Previous Video"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 border border-white/20 shadow-md"
                >
                  <ChevronUp className="w-5 h-5" />
                </button>
                <div className="text-[10px] font-black text-white bg-black/70 px-2 py-0.5 rounded-full border border-white/20 select-none shadow">
                  {activeModalIndex + 1}/{tiktokVideos.length}
                </div>
                <button
                  type="button"
                  onClick={handleNextVideo}
                  title="Next Video"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/90 text-white backdrop-blur-md flex items-center justify-center transition-transform active:scale-90 border border-white/20 shadow-md animate-bounce"
                >
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>

              {/* Auto-Advance Continuous Notice Pill */}
              <div className="absolute bottom-2 left-2.5 z-20 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20 pointer-events-none">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Auto-plays Next Reel</span>
              </div>
            </div>

            {/* Right/Bottom: Exact Matching Product Details */}
            <div className="w-full md:w-[52%] p-4 sm:p-6 flex flex-col justify-between overflow-y-auto">
              <div>
                {/* Creator tag */}
                <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-neutral-100 text-[10px] font-extrabold uppercase tracking-wider text-neutral-800 mb-2">
                  <Sparkles className="w-3 h-3 text-amber-600" />
                  <span>{activeVideo.creator} • Reel {activeModalIndex + 1} of {tiktokVideos.length}</span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-neutral-950 tracking-tight leading-snug line-clamp-1 sm:line-clamp-2">
                  {activeVideo.title}
                </h3>

                {/* Matching Product Card Box */}
                <div className="mt-2.5 sm:mt-4 p-3 sm:p-3.5 rounded-xl sm:rounded-2xl bg-[#FAF8F5] border border-[#ECE5DB] flex items-center space-x-3">
                  <img
                    src={activeVideo.product.image}
                    alt={activeVideo.product.name}
                    className="w-12 h-12 sm:w-14 sm:h-14 rounded-lg object-cover border border-white shadow-xs flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-900/80 block">
                      {activeVideo.product.category}
                    </span>
                    <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate">
                      {activeVideo.product.name}
                    </h4>

                    {/* Star Rating & Price */}
                    <div className="flex items-center space-x-2 mt-0.5">
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-current" />
                        ))}
                      </div>
                      <span className="text-xs font-black text-neutral-950">
                        ₹{activeVideo.product.price.toLocaleString('en-IN')}
                      </span>
                      {activeVideo.product.compareAtPrice > activeVideo.product.price && (
                        <span className="text-[10px] text-neutral-400 line-through">
                          ₹{activeVideo.product.compareAtPrice.toLocaleString('en-IN')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Continuous Playlist Thumbnails Strip */}
                <div className="mt-3 pt-2.5 border-t border-neutral-100 hidden sm:block">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-bold text-neutral-600 uppercase tracking-wider">
                      Reels Playlist:
                    </span>
                    <span className="text-[9px] text-neutral-400 font-medium">
                      Tap or use ↑↓ keys
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-0.5">
                    {tiktokVideos.map((item, idx) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveModalIndex(idx);
                          setModalAdded(false);
                          setIsModalPlaying(true);
                        }}
                        className={`relative w-10 h-12 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-all ${
                          idx === activeModalIndex
                            ? 'border-amber-500 scale-105 shadow-md ring-2 ring-amber-300'
                            : 'border-transparent opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={item.poster} alt={item.title} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0.5 right-1 text-[8px] font-black text-white drop-shadow">
                          #{idx + 1}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 space-y-2">
                <button
                  type="button"
                  onClick={handleModalAddToCart}
                  disabled={modalAdded}
                  className={`w-full py-2.5 sm:py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 transition-all shadow-md active:scale-95 ${
                    modalAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-neutral-950 hover:bg-neutral-800 text-white'
                  }`}
                >
                  {modalAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add To Bag • ₹{activeVideo.product.price.toLocaleString('en-IN')}</span>
                    </>
                  )}
                </button>

                <div className="flex items-center space-x-2">
                  <Link
                    to={`/product/${activeVideo.product.slug}`}
                    onClick={handleCloseModal}
                    className="flex-1 py-2 sm:py-2.5 rounded-xl bg-white border border-neutral-300 hover:border-black text-neutral-900 font-bold text-xs flex items-center justify-center space-x-1.5 transition-all hover:bg-neutral-50"
                  >
                    <span>View Product</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </Link>

                  <button
                    type="button"
                    onClick={handleNextVideo}
                    className="px-3.5 py-2 sm:py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-bold text-xs flex items-center space-x-1 transition-all"
                  >
                    <span>Next Reel</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </section>
  );
};

export default TikTokCarousel;
