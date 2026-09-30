import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  ShoppingBag,
  Truck,
  RotateCcw,
  ShieldCheck,
  Star,
  Check,
  Share2,
  Plus,
  Minus,
  ChevronDown,
  Loader2,
  Send,
  Flame,
  Clock,
  Ruler,
  Maximize2,
  X,
  Sparkles,
  CheckCircle2,
  Store,
  Play,
  Film,
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/common/RatingStars';
import ProductCard from '../components/common/ProductCard';
import { analyzeProductSizes } from '../utils/sizeHelper';
import { getCategoryFallback, resolveImageUrl } from '../utils/imageHelper';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Gallery & Zoom state
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50, isHovering: false });
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  // Live Conversion / Animation states
  const [liveViewers, setLiveViewers] = useState(16);
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 48, seconds: 20 });
  const [isStickyVisible, setIsStickyVisible] = useState(false);
  const [bundleAdded, setBundleAdded] = useState(true);
  const [cartJustAdded, setCartJustAdded] = useState(false);

  // Selection state
  const [selectedVariant, setSelectedVariant] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');

  // Live viewers pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(Math.floor(13 + Math.random() * 11));
    }, 5500);
    return () => clearInterval(interval);
  }, []);

  // Order countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 3, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sticky buy bar visibility listener
  useEffect(() => {
    const handleScroll = () => {
      setIsStickyVisible(window.scrollY > 480);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewTitle, setReviewTitle] = useState('');
  const [reviewComment, setReviewComment] = useState('');
  const [reviewName, setReviewName] = useState('');
  const [reviewsList, setReviewsList] = useState([]);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Contexts
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user } = useAuth();

  // Intelligent Size Configuration Analysis for current product
  const sizeConfig = useMemo(() => analyzeProductSizes(product), [product]);

  const fallbackImg = useMemo(() => {
    return getCategoryFallback(product?.category, product?.categorySlug);
  }, [product?.category, product?.categorySlug]);

  // Construct unified media list (both photos & videos)
  const mediaList = useMemo(() => {
    const list = [];
    if (!product) return list;

    // 1. Structured product.media items
    if (product.media && Array.isArray(product.media) && product.media.length > 0) {
      product.media.forEach((item) => {
        if (item?.url) {
          list.push({
            type: item.type === 'video' ? 'video' : 'image',
            url: item.url,
            thumbnailUrl: item.thumbnailUrl || (item.type === 'video' ? null : item.url),
            filename: item.filename || '',
          });
        }
      });
    }

    // 2. Direct product.videos
    if (product.videos && Array.isArray(product.videos)) {
      product.videos.forEach((vid) => {
        if (vid && !list.some((m) => m.url === vid)) {
          list.push({ type: 'video', url: vid, thumbnailUrl: null, filename: '' });
        }
      });
    }

    // 3. Direct product.images
    if (product.images && Array.isArray(product.images)) {
      product.images.forEach((img) => {
        if (img) {
          const resolved = resolveImageUrl(img, product.category, product.categorySlug);
          if (!list.some((m) => m.url === resolved || m.url === img)) {
            list.push({ type: 'image', url: resolved, thumbnailUrl: resolved, filename: '' });
          }
        }
      });
    }

    // 4. Fallback thumbnail/image
    if (list.length === 0) {
      const single = resolveImageUrl(product.thumbnail || product.image, product.category, product.categorySlug) || fallbackImg;
      list.push({ type: 'image', url: single, thumbnailUrl: single, filename: '' });
    }

    return list;
  }, [product, fallbackImg]);

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Sync selected variant with analyzed size configuration
  useEffect(() => {
    if (sizeConfig?.defaultSize) {
      setSelectedVariant((prev) => {
        if (prev && sizeConfig.sizes?.includes(prev)) return prev;
        return sizeConfig.defaultSize;
      });
    }
  }, [sizeConfig]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await api.products.getBySlug(slug);
      if (res.success && res.product) {
        setProduct(res.product);
        setRelatedProducts(res.relatedProducts || []);
        setSelectedImageIndex(0);

        // Dynamic SEO & Title
        document.title = `${res.product.name} | Buy Online | VEXIVO`;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', res.product.shortDescription || res.product.description?.slice(0, 155) || res.product.name);
        }

        // Fetch reviews
        api.reviews.getForProduct(res.product._id)
          .then((revRes) => {
            if (revRes.success && revRes.reviews) setReviewsList(revRes.reviews);
          })
          .catch(() => {});
      }
    } catch (err) {
      console.error('Failed to load product:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!product) return;
    const finalVariant = selectedVariant || sizeConfig.defaultSize || 'Standard';
    addToCart(product, quantity, finalVariant);
  };

  const handleBuyNow = () => {
    if (!product) return;
    const finalVariant = selectedVariant || sizeConfig.defaultSize || 'Standard';
    addToCart(product, quantity, finalVariant);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    try {
      const res = await api.reviews.create(product._id, {
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
        userName: user?.name || reviewName || 'Verified Customer',
        userEmail: user?.email || '',
      });

      if (res.success && res.review) {
        setReviewsList((prev) => {
          const exists = prev.some((r) => (r._id && r._id === res.review._id) || (r.id && r.id === res.review.id));
          if (exists) {
            return prev.map((r) => ((r._id === res.review._id || r.id === res.review.id) ? res.review : r));
          }
          return [res.review, ...prev];
        });

        // Instantly update product's live rating and review count on the page
        if (res.product) {
          setProduct((prev) => ({
            ...prev,
            rating: res.product.rating,
            numReviews: res.product.numReviews,
          }));
        } else {
          setProduct((prev) => ({
            ...prev,
            numReviews: (prev?.numReviews || 0) + 1,
          }));
        }

        setReviewSuccess(true);
        setReviewTitle('');
        setReviewComment('');
        setTimeout(() => setReviewSuccess(false), 4000);
      }
    } catch (err) {
      console.error('Failed to post review:', err);
    } finally {
      setIsSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        <p className="text-xs font-semibold text-neutral-500">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Product not found</h2>
        <p className="text-xs text-neutral-500">The product you requested could not be located.</p>
        <Link to="/shop" className="btn-pill-dark text-xs py-2.5 px-6">
          Back to Shop
        </Link>
      </div>
    );
  }

  const activeMedia = mediaList[selectedImageIndex] || mediaList[0] || { type: 'image', url: fallbackImg };
  const activeImage =
    (activeMedia.type === 'video' ? activeMedia.thumbnailUrl || fallbackImg : activeMedia.url) || fallbackImg;
  const inWishlist = isInWishlist(product?._id);

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-100 py-3.5 bg-neutral-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-neutral-500 flex items-center space-x-2 truncate">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-black">Shop</Link>
            <span>/</span>
            <Link to={`/category/${product.categorySlug || (product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : 'all')}`} className="hover:text-black">
              {product.category || 'Category'}
            </Link>
            <span>/</span>
            <span className="text-black font-semibold truncate">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14">
          {/* Gallery Column */}
          <div className="space-y-4">
            {/* Primary Main Media Viewer: Image Zoom OR High-Res Video Player */}
            {activeMedia.type === 'video' ? (
              <div className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 shadow-sm flex items-center justify-center group select-none">
                <video
                  key={activeMedia.url}
                  src={activeMedia.url}
                  controls
                  playsInline
                  preload="metadata"
                  className="w-full h-full object-contain"
                >
                  <source src={activeMedia.url} type="video/mp4" />
                  Your browser does not support high-definition video playback.
                </video>

                {/* Video Indicator Badge */}
                <div className="absolute top-4 left-4 z-10 flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/10 pointer-events-none">
                  <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  <span>Product Video</span>
                </div>

                {/* Wishlist Button */}
                <div className="absolute top-4 right-4 z-10">
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label="Toggle Wishlist"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-800 hover:text-red-600 transition-all hover:scale-110 active:scale-95"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>
                </div>
              </div>
            ) : (
              <div 
                className="relative aspect-[4/5] rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100 group cursor-crosshair select-none"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                  const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                  setZoomPos({ x, y, isHovering: true });
                }}
                onMouseLeave={() => setZoomPos((prev) => ({ ...prev, isHovering: false }))}
              >
                <img
                  src={activeMedia.url}
                  alt={product.name}
                  onError={(e) => {
                    e.currentTarget.src = fallbackImg;
                  }}
                  style={{
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: zoomPos.isHovering ? 'scale(1.9)' : 'scale(1)',
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-150 ease-out pointer-events-none"
                />
                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                  {product.discount > 0 && (
                    <span className="badge-sale shadow-sm">-{product.discount}% OFF</span>
                  )}
                  {product.newArrival && (
                    <span className="badge-new shadow-sm">NEW</span>
                  )}
                </div>

                {/* Action Buttons on Image */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label="Toggle Wishlist"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-800 hover:text-red-600 transition-all hover:scale-110 active:scale-95"
                  >
                    <Heart
                      className={`w-5 h-5 ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label="View Fullscreen"
                    className="w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-800 hover:text-black transition-all hover:scale-110 active:scale-95"
                    title="Fullscreen zoom view"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Hover Zoom Hint */}
                <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Roll over image to zoom
                </div>
              </div>
            )}

            {/* Thumbnail Row (Supports both Images & Videos) */}
            {mediaList.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
                {mediaList.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-black shadow-md scale-95'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-white relative">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg">
                          <Play className="w-4 h-4 fill-white text-white translate-x-0.5" />
                        </div>
                        <span className="text-[9px] font-extrabold uppercase tracking-wider mt-1.5 text-neutral-300">
                          Video
                        </span>
                      </div>
                    ) : (
                      <img
                        src={item.url}
                        alt={`${product.name} view ${idx + 1}`}
                        onError={(e) => {
                          e.currentTarget.src = fallbackImg;
                        }}
                        className="w-full h-full object-cover object-center"
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Details Column */}
          <div className="flex flex-col justify-start space-y-6">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-neutral-600">
                {product.brand || 'VEXIVO'}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex items-center space-x-3 mt-3">
                <RatingStars rating={product.rating || 4.8} numReviews={product.numReviews} />
                <span className="text-neutral-300">|</span>
                <span className="text-xs text-[#0D8756] font-semibold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5" />
                  <span>In Stock ({product.stock} units available)</span>
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex items-baseline space-x-3 py-2 border-y border-neutral-100">
              <span className="text-3xl font-extrabold text-neutral-900">
                ₹{Number(product.price || 0).toFixed(2)}
              </span>
              {Number(product.compareAtPrice || 0) > Number(product.price || 0) && (
                <span className="text-base text-neutral-600 line-through">
                  ₹{Number(product.compareAtPrice || 0).toFixed(2)}
                </span>
              )}
              {Number(product.discount || 0) > 0 && (
                <span className="text-xs font-bold text-[#C4301C] bg-red-50 px-2.5 py-1 rounded-full">
                  Save ₹{(Number(product.compareAtPrice || 0) - Number(product.price || 0)).toFixed(2)} ({product.discount}%)
                </span>
              )}
            </div>

            {/* Live Conversion & Urgency Drivers (Shaporoo Style) */}
            <div className="space-y-3 bg-neutral-50/70 p-3.5 rounded-2xl border border-neutral-200/60">
              {/* Live Viewers Pulse */}
              <div className="flex items-center space-x-2 text-xs font-semibold text-neutral-800">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0D8756]"></span>
                </span>
                <Flame className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>
                  <strong className="text-neutral-950 font-bold">{liveViewers} people</strong> are viewing this item right now
                </span>
              </div>

              {/* Delivery Countdown Timer */}
              <div className="flex items-center space-x-2.5 text-xs text-neutral-700 pt-1 border-t border-neutral-200/50">
                <Clock className="w-4 h-4 text-amber-600 flex-shrink-0" />
                <div>
                  Order within <strong className="text-neutral-950 font-mono font-bold">{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</strong> for <span className="font-semibold text-neutral-900 underline decoration-neutral-400">Complimentary UK Next-Day Delivery</span>
                </div>
              </div>

              {/* Stock Urgency Progress Bar */}
              <div className="space-y-1.5 pt-1 border-t border-neutral-200/50">
                <div className="flex justify-between text-[11px] font-semibold">
                  <span className="text-red-600 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block mr-1"></span>
                    Only {product.stock > 0 && product.stock <= 10 ? product.stock : 4} items left in stock — selling fast!
                  </span>
                  <span className="text-neutral-500">86% sold</span>
                </div>
                <div className="w-full bg-neutral-200/80 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 h-1.5 rounded-full w-[86%] transition-all duration-500"></div>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
              {product.shortDescription || product.description?.slice(0, 180) + '...'}
            </p>

            {/* Intelligent Category-Aware Size & Variant Selector */}
            <div className="space-y-4 p-4 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Ruler className="w-3.5 h-3.5 text-neutral-700" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                      {sizeConfig.label}:
                    </span>
                    <span className="text-xs font-extrabold text-black bg-white px-2.5 py-0.5 rounded-md border border-neutral-200 shadow-2xs">
                      {selectedVariant || sizeConfig.defaultSize}
                    </span>
                  </div>
                  {sizeConfig.hasSizeGuide && (
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center space-x-1 underline underline-offset-4 transition-colors"
                    >
                      <span>Size & Fit Guide</span>
                    </button>
                  )}
                </div>

                {/* Size Options Pill Badges */}
                <div className="flex flex-wrap gap-2 pt-1">
                  {sizeConfig.sizes.map((opt) => {
                    const isSelected = (selectedVariant || sizeConfig.defaultSize) === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedVariant(opt)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-md scale-105 ring-2 ring-neutral-400/40'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-black hover:bg-neutral-100/60'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-1.5 text-[11px] text-neutral-500 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D8756] flex-shrink-0" />
                  <span>
                    Size <strong className="text-neutral-800 font-bold">{selectedVariant || sizeConfig.defaultSize}</strong> is in stock & reserved upon bag addition
                  </span>
                </div>
              </div>

              {/* Extra Custom Variants if present (e.g. Color) */}
              {product.variants &&
                product.variants
                  .filter((v) => v && v.name && !v.name.toLowerCase().includes('size') && !v.name.toLowerCase().includes('fit'))
                  .map((v, vIdx) => (
                    <div key={v.name || vIdx} className="space-y-1.5 pt-2 border-t border-neutral-200/60">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          {v.name}: <strong className="text-black">{typeof v.options?.[0] === 'object' ? (v.options[0]?.name || v.options[0]?.value || '') : (v.options?.[0] || '')}</strong>
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {v.options?.map((opt, oIdx) => {
                          const optLabel = typeof opt === 'object' ? (opt?.name || opt?.value || opt?.color || '') : String(opt);
                          return (
                            <span
                              key={oIdx}
                              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-neutral-200 text-neutral-700"
                            >
                              {optLabel}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  ))}
            </div>

            {/* Frequently Bought Together Bundle Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                  <span>Frequently Bought Together</span>
                </span>
                <span className="text-[10px] font-bold text-[#0D8756] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  Save 15% Bundle
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-neutral-200 bg-white flex-shrink-0">
                  <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-neutral-400 font-bold text-sm">+</span>
                <div className="relative w-12 h-14 rounded-lg overflow-hidden border border-neutral-200 bg-white flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80"
                    alt="Premium Protection Sleeve"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">VEXIVO Silk Care & Travel Pouch</p>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-xs font-bold text-black">₹18.00</span>
                    <span className="text-[11px] text-neutral-600 line-through">₹28.00</span>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={bundleAdded}
                    onChange={(e) => setBundleAdded(e.target.checked)}
                    className="w-4 h-4 rounded text-black focus:ring-black cursor-pointer accent-black"
                  />
                </label>
              </div>
            </div>

            {/* Quantity Selector & Action Buttons */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center space-x-3">
                {/* Quantity */}
                <div className="flex items-center border border-neutral-200 rounded-full py-2.5 px-4 space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="text-neutral-500 hover:text-black p-0.5"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-6 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="text-neutral-500 hover:text-black p-0.5"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  className="btn-pill-dark flex-1 py-3.5 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to Bag</span>
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                onClick={handleBuyNow}
                className="btn-pill-yellow w-full py-3.5 text-xs sm:text-sm uppercase tracking-wider text-center"
              >
                Instant Buy Now
              </button>
            </div>

            {/* Verified Marketplace Seller Card */}
            <div className="p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Sold by
                    </span>
                    <span className="font-extrabold text-neutral-900 text-xs">
                      {product.sellerName || 'VEXIVO Official Flagship'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200/60">
                  <span className="text-amber-500">★</span>
                  <span>4.9</span>
                  <span className="text-[10px] text-emerald-600 font-medium ml-1">Verified Seller</span>
                </div>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 divide-y divide-neutral-100 text-xs text-neutral-600">
              <div className="flex items-center space-x-3 py-2.5 first:pt-0">
                <Truck className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>Complimentary Pan-India Express Delivery</strong> on orders over ₹499
                </span>
              </div>
              <div className="flex items-center space-x-3 py-2.5">
                <RotateCcw className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>30-Day Hassle-Free Returns</strong> with doorstep courier pickup
                </span>
              </div>
              <div className="flex items-center space-x-3 py-2.5 last:pb-0">
                <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>Genuine Product Guarantee</strong> verified by VEXIVO Marketplace
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Specs, Shipping, Reviews */}
        <div className="mt-16 sm:mt-24 pt-8 border-t border-neutral-100">
          {/* Tabs Navigation */}
          <div className="flex items-center justify-center space-x-4 sm:space-x-8 border-b border-neutral-200 pb-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'description', label: 'Full Description' },
              { id: 'specs', label: 'Specifications & Materials' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Reviews (${reviewsList.length || product.numReviews})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm uppercase tracking-wider font-bold py-2 border-b-2 transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-600 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto py-10">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4">
                <p>{product.description}</p>
                <h4 className="text-base font-bold text-neutral-900 mt-6">Acoustic & Craftsmanship Details</h4>
                <p>
                  Every VEXIVO creation undergoes extensive quality control. From the tensile
                  strength of our double-faced cashmere seams to the acoustic frequency tuning of each
                  neodymium transducer, we ensure maximum fidelity and longevity.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-neutral-500">Brand / Atelier</p>
                  <p className="font-bold text-neutral-900">{product.brand || 'VEXIVO'}</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-neutral-500">SKU / Model Number</p>
                  <p className="font-bold text-neutral-900">{product.sku || 'VEX-STD-001'}</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-neutral-500">Department</p>
                  <p className="font-bold text-neutral-900">{product.category}</p>
                </div>
                <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-neutral-500">Warranty Coverage</p>
                  <p className="font-bold text-neutral-900">Lifetime Hardware & Craft Guarantee</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-neutral-700">
                <p>
                  <strong>Pan-India Express:</strong> Complimentary Tracked Delivery on all orders over ₹499 across 28,000+ Indian PIN codes. Orders under ₹499 are charged at ₹49 via Ekart / Delhivery / Bluedart.
                </p>
                <p>
                  <strong>Dispatch:</strong> Orders are dispatched from seller hubs within 24 hours. Expected delivery is 2–4 business days.
                </p>
                <p>
                  <strong>Returns:</strong> Hassle-free 30-day returns with free doorstep courier pickup arranged directly from your saved address.
                </p>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Write Review Form */}
                <div className="bg-neutral-50 p-6 sm:p-8 rounded-2xl border border-neutral-100">
                  <h3 className="text-base font-bold text-neutral-900 mb-4">Write a Verified Review</h3>
                  {reviewSuccess ? (
                    <div className="flex items-center space-x-2 text-[#0D8756] text-xs font-bold py-3">
                      <Check className="w-4 h-4" />
                      <span>Thank you! Your review has been submitted and published.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-4">
                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                          Rating
                        </label>
                        <div className="flex space-x-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              type="button"
                              key={star}
                              onClick={() => setReviewRating(star)}
                              className="focus:outline-none"
                            >
                              <Star
                                className={`w-6 h-6 ${
                                  star <= reviewRating
                                    ? 'fill-amber-400 text-amber-400'
                                    : 'text-neutral-300'
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      {!user && (
                        <div>
                          <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="e.g. Eleanor Vance"
                            className="input-pill"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                          Review Headline
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="e.g. Masterful acoustics and supreme comfort"
                          className="input-pill"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase text-neutral-700 mb-1">
                          Review Feedback
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share details about the quality, fit, and audio performance..."
                          className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="btn-pill-dark text-xs py-3 px-8 flex items-center space-x-2"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Reviews Listing */}
                <div className="space-y-4">
                  {reviewsList.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-6">
                      Be the first to review this iconic piece.
                    </p>
                  ) : (
                    reviewsList.map((rev) => (
                      <div
                        key={rev._id || rev.id}
                        className="p-5 rounded-2xl border border-neutral-100 bg-white space-y-2 shadow-subtle"
                      >
                        <div className="flex items-center justify-between">
                          <RatingStars rating={rev.rating} showText={false} />
                          <span className="text-[11px] text-neutral-600">
                            {new Date(rev.createdAt || Date.now()).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        <h4 className="text-sm font-bold text-neutral-900">{rev.title}</h4>
                        <p className="text-xs text-neutral-600 leading-relaxed">{rev.comment}</p>
                        <p className="text-[11px] font-semibold text-neutral-500 pt-1">
                          — {rev.userName}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Similar Products & Recommendations Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Curated For You
                </span>
                <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mt-1">
                  Similar Products & Recommendations
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-1 sm:mt-0 font-medium">
                Matching items in <span className="text-black font-bold">{product.category || 'Store'}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p._id || p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Buy Bar (Shows on Scroll like Shaporoo) */}
      <div
        className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] transition-transform duration-300 ${
          isStickyVisible ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-3 min-w-0">
            <img
              src={activeImage}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = fallbackImg;
              }}
              className="w-11 h-13 rounded-lg object-cover border border-neutral-200 flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate max-w-xs sm:max-w-md">
                {product.name}
              </h4>
              <div className="flex items-center space-x-2 text-xs">
                <span className="font-extrabold text-neutral-950">₹{Number(product.price || 0).toFixed(2)}</span>
                {Number(product.compareAtPrice || 0) > Number(product.price || 0) && (
                  <span className="text-neutral-600 line-through text-[11px]">
                    ₹{Number(product.compareAtPrice || 0).toFixed(2)}
                  </span>
                )}
                {(selectedVariant || sizeConfig.defaultSize) && (
                  <span className="text-neutral-700 bg-neutral-100 px-2 py-0.5 rounded font-semibold text-[11px] hidden sm:inline">
                    Size: {selectedVariant || sizeConfig.defaultSize}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3 flex-shrink-0">
            <button
              onClick={handleAddToCart}
              className="btn-pill-dark px-6 py-2.5 text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-2 shadow-md hover:scale-105 active:scale-95 transition-all"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Bag</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close Fullscreen"
            className="absolute top-6 right-6 z-50 w-11 h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div
            className="relative max-w-4xl max-h-[80vh] flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMedia.type === 'video' ? (
              <video
                key={activeMedia.url}
                src={activeMedia.url}
                controls
                playsInline
                autoPlay
                className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl bg-black"
              />
            ) : (
              <img
                src={activeMedia.url}
                alt={product.name}
                className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>

          {mediaList.length > 1 && (
            <div
              className="flex space-x-3 mt-6 z-50 overflow-x-auto max-w-md no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {mediaList.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <Play className="w-4 h-4 fill-white text-white" />
                    </div>
                  ) : (
                    <img src={item.url} alt="Thumbnail preview" className="w-full h-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Size Guide Modal */}
      {isSizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className="relative bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-neutral-100 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <Ruler className="w-5 h-5 text-neutral-900" />
                <h3 className="text-lg font-bold text-neutral-900">VEXIVO Size & Fit Guide</h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-neutral-600">
              <p>
                Measurements for <strong className="text-black">{product.category || 'this item'}</strong>. If you are between two sizes, we recommend selecting one size up for a relaxed fit or true-to-size for tailored elegance.
              </p>

              {/* Dynamic Size Conversion Table */}
              <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-100/80 border-b border-neutral-200 text-neutral-900 font-bold uppercase tracking-wider">
                      {(sizeConfig.guideHeaders || ['Size', 'Fit']).map((h, idx) => (
                        <th key={idx} className="p-3">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {(sizeConfig.guideRows || []).map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-neutral-50/60' : 'bg-white'}>
                        <td className="p-3 font-bold text-neutral-900">{row.col1}</td>
                        {row.col2 && <td className="p-3 text-neutral-700">{row.col2}</td>}
                        {row.col3 && <td className="p-3 text-neutral-700">{row.col3}</td>}
                        {row.col4 && <td className="p-3 text-neutral-700">{row.col4}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3.5 bg-neutral-50 rounded-xl flex items-center space-x-2 text-neutral-700">
                <Sparkles className="w-4 h-4 text-amber-500 flex-shrink-0" />
                <span>Complimentary exchanges are available within 30 days if you need a different size.</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
