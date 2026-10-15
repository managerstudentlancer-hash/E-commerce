import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link, useNavigate, useSearchParams } from 'react-router-dom';
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
  const [searchParams] = useSearchParams();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [discontinuedInfo, setDiscontinuedInfo] = useState(null); // { productName, category, categorySlug, alternativeProducts }

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
  const [reviewError, setReviewError] = useState('');
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // Switch to review tab if URL has ?tab=reviews or ?rating=...
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    const ratingParam = searchParams.get('rating');
    if (tabParam === 'reviews') {
      setActiveTab('reviews');
      setTimeout(() => {
        const reviewEl = document.getElementById('product-reviews-section');
        if (reviewEl) reviewEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 350);
    }
    if (ratingParam) {
      const parsedRating = parseInt(ratingParam, 10);
      if (parsedRating >= 1 && parsedRating <= 5) {
        setReviewRating(parsedRating);
      }
    }
  }, [searchParams]);

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
    setDiscontinuedInfo(null);
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
      // Handle 410 Gone — product exists but is discontinued/archived
      if (err.status === 410 && err.data) {
        setDiscontinuedInfo({
          productName: err.data.productName || 'This product',
          message: err.data.message || 'This product is no longer available.',
          category: err.data.category || '',
          categorySlug: err.data.categorySlug || '',
          alternativeProducts: err.data.alternativeProducts || [],
        });
      }
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
    if (!user) {
      navigate('/login', { state: { from: { pathname: '/checkout' } } });
    } else {
      navigate('/checkout');
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewTitle.trim() || !reviewComment.trim()) return;

    setIsSubmittingReview(true);
    setReviewError('');
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
      const errMsg = err?.message || err?.data?.message || 'Failed to submit review. Please try again.';
      setReviewError(errMsg);
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
    // Product is discontinued/archived — show a helpful unavailable page with alternatives
    if (discontinuedInfo) {
      return (
        <div className="min-h-[60vh] bg-white">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
            {/* Unavailable Notice */}
            <div className="text-center space-y-4 mb-10 sm:mb-14">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-full bg-neutral-100 flex items-center justify-center">
                <ShoppingBag className="w-7 h-7 sm:w-9 sm:h-9 text-neutral-400" />
              </div>
              <h1 className="text-xl sm:text-2xl font-extrabold text-neutral-900 tracking-tight">
                Product No Longer Available
              </h1>
              <p className="text-sm sm:text-base text-neutral-500 max-w-md mx-auto leading-relaxed">
                {discontinuedInfo.message}
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                {discontinuedInfo.categorySlug && (
                  <Link
                    to={`/category/${discontinuedInfo.categorySlug}`}
                    className="btn-pill-dark text-xs py-2.5 px-6"
                  >
                    Browse {discontinuedInfo.category || 'Category'}
                  </Link>
                )}
                <Link to="/shop" className="text-xs font-semibold text-neutral-700 hover:text-black underline underline-offset-4 py-2.5 px-4">
                  Back to Shop
                </Link>
              </div>
            </div>

            {/* Alternative Products from Same Category */}
            {discontinuedInfo.alternativeProducts && discontinuedInfo.alternativeProducts.length > 0 && (
              <div>
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-neutral-900 mb-5 sm:mb-6 text-center">
                  You Might Also Like
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
                  {discontinuedInfo.alternativeProducts.map((altProduct) => (
                    <ProductCard key={altProduct._id} product={altProduct} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Truly missing product (never existed)
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
    <div className="bg-white min-h-screen pb-20 sm:pb-24">
      {/* Breadcrumbs */}
      <div className="border-b border-neutral-100 py-3 sm:py-3.5 bg-neutral-50/60">
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
          <nav className="text-[11px] sm:text-xs text-neutral-500 flex items-center space-x-1.5 sm:space-x-2 overflow-x-auto no-scrollbar py-0.5">
            <Link to="/" className="hover:text-black flex-shrink-0">Home</Link>
            <span className="flex-shrink-0">/</span>
            <Link to="/shop" className="hover:text-black flex-shrink-0">Shop</Link>
            <span className="flex-shrink-0">/</span>
            <Link to={`/category/${product.categorySlug || (product.category ? product.category.toLowerCase().replace(/\s+/g, '-') : 'all')}`} className="hover:text-black flex-shrink-0">
              {product.category || 'Category'}
            </Link>
            <span className="flex-shrink-0">/</span>
            <span className="text-black font-semibold truncate max-w-[140px] sm:max-w-xs">{product.name}</span>
          </nav>
        </div>
      </div>

      {/* Product Hero Section */}
      <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 pt-4 sm:pt-6 lg:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-14">
          {/* Gallery Column */}
          <div className="space-y-3 sm:space-y-4">
            {/* Primary Main Media Viewer: Image Zoom OR High-Res Video Player */}
            {activeMedia.type === 'video' ? (
              <div className="relative aspect-[4/5] max-h-[62vh] sm:max-h-none rounded-2xl overflow-hidden bg-neutral-950 border border-neutral-200 shadow-sm flex items-center justify-center group select-none">
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
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 z-10 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-neutral-900/80 backdrop-blur-md text-white text-[10px] font-extrabold uppercase tracking-wider border border-white/10 pointer-events-none">
                  <Play className="w-3 h-3 fill-emerald-400 text-emerald-400" />
                  <span>Product Video</span>
                </div>

                {/* Wishlist Button */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10">
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label="Toggle Wishlist"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-800 hover:text-red-600 transition-all hover:scale-110 active:scale-95"
                  >
                    <Heart
                      className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>
                </div>

                {/* Mobile Media Counter Badge (Phone Only) */}
                {mediaList.length > 1 && (
                  <div className="absolute bottom-3 right-3 sm:hidden z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold pointer-events-none">
                    {selectedImageIndex + 1} / {mediaList.length}
                  </div>
                )}
              </div>
            ) : (
              <div 
                className="relative aspect-[4/5] max-h-[62vh] sm:max-h-none rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-100 group select-none cursor-crosshair"
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
                  const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
                  setZoomPos({ x, y, isHovering: true });
                }}
                onMouseLeave={() => setZoomPos((prev) => ({ ...prev, isHovering: false }))}
                onClick={() => setIsLightboxOpen(true)}
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
                <div className="absolute top-3 left-3 sm:top-4 sm:left-4 flex flex-col gap-1.5 z-10 pointer-events-none">
                  {product.discount > 0 && (
                    <span className="badge-sale shadow-sm text-[10px] sm:text-xs">-{product.discount}% OFF</span>
                  )}
                  {product.newArrival && (
                    <span className="badge-new shadow-sm text-[10px] sm:text-xs">NEW</span>
                  )}
                </div>

                {/* Action Buttons on Image */}
                <div className="absolute top-3 right-3 sm:top-4 sm:right-4 z-10 flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => toggleWishlist(product)}
                    aria-label="Toggle Wishlist"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-800 hover:text-red-600 transition-all hover:scale-110 active:scale-95"
                  >
                    <Heart
                      className={`w-4.5 h-4.5 sm:w-5 sm:h-5 ${
                        inWishlist ? 'fill-red-500 text-red-500' : 'text-neutral-700'
                      }`}
                    />
                  </button>
                  <button
                    onClick={() => setIsLightboxOpen(true)}
                    aria-label="View Fullscreen"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/90 backdrop-blur-sm shadow-md flex items-center justify-center text-neutral-800 hover:text-black transition-all hover:scale-110 active:scale-95"
                    title="Fullscreen zoom view"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Hover Zoom Hint (Desktop Only) */}
                <div className="absolute bottom-3 left-3 z-10 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-[10px] font-medium opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                  Roll over image to zoom
                </div>

                {/* Mobile Media Counter Badge (Phone Only) */}
                {mediaList.length > 1 && (
                  <div className="absolute bottom-3 right-3 sm:hidden z-10 px-2 py-0.5 rounded-full bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold pointer-events-none">
                    {selectedImageIndex + 1} / {mediaList.length}
                  </div>
                )}
              </div>
            )}

            {/* Thumbnail Row (Supports both Images & Videos) */}
            {mediaList.length > 1 && (
              <div className="flex space-x-2 sm:space-x-3 overflow-x-auto pb-1.5 no-scrollbar touch-pan-x -mx-1 px-1">
                {mediaList.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-16 h-20 sm:w-20 sm:h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-black shadow-md scale-95'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    {item.type === 'video' ? (
                      <div className="w-full h-full bg-neutral-900 flex flex-col items-center justify-center text-white relative">
                        <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-emerald-500/90 flex items-center justify-center shadow-lg">
                          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white translate-x-0.5" />
                        </div>
                        <span className="text-[8px] sm:text-[9px] font-extrabold uppercase tracking-wider mt-1 text-neutral-300">
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
          <div className="flex flex-col justify-start space-y-5 sm:space-y-6">
            <div>
              <span className="text-[11px] sm:text-xs font-bold uppercase tracking-widest text-neutral-500">
                {product.brand || 'VEXIVO'}
              </span>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-neutral-900 tracking-tight mt-1 leading-snug break-words">
                {product.name}
              </h1>

              {/* Rating & Review Counter */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2.5 sm:mt-3">
                <RatingStars rating={product.rating || 4.8} numReviews={product.numReviews} />
                <span className="text-neutral-300 hidden sm:inline">|</span>
                <span className="text-xs text-[#0D8756] font-semibold flex items-center space-x-1">
                  <Check className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>In Stock ({product.stock} units available)</span>
                </span>
              </div>
            </div>

            {/* Pricing */}
            <div className="flex flex-wrap items-baseline gap-2 sm:gap-3 py-2 sm:py-2.5 border-y border-neutral-100">
              <span className="text-2xl sm:text-3xl font-extrabold text-neutral-900">
                ₹{Number(product.price || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
              {Number(product.compareAtPrice || 0) > Number(product.price || 0) && (
                <span className="text-sm sm:text-base text-neutral-500 line-through">
                  ₹{Number(product.compareAtPrice || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              )}
              {Number(product.discount || 0) > 0 && (
                <span className="text-[11px] sm:text-xs font-bold text-[#C4301C] bg-red-50 px-2.5 py-0.5 sm:py-1 rounded-full whitespace-nowrap">
                  Save ₹{(Number(product.compareAtPrice || 0) - Number(product.price || 0)).toFixed(2)} ({product.discount}%)
                </span>
              )}
            </div>

            {/* Live Conversion & Urgency Drivers (Shaporoo Style) */}
            <div className="space-y-2.5 sm:space-y-3 bg-neutral-50/80 p-3 sm:p-3.5 rounded-2xl border border-neutral-200/60">
              {/* Live Viewers Pulse */}
              <div className="flex items-center space-x-2 text-[11px] sm:text-xs font-semibold text-neutral-800">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#0D8756]"></span>
                </span>
                <Flame className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500 flex-shrink-0" />
                <span className="truncate">
                  <strong className="text-neutral-950 font-bold">{liveViewers} people</strong> are viewing this right now
                </span>
              </div>

              {/* Delivery Countdown Timer */}
              <div className="flex items-start sm:items-center space-x-2 sm:space-x-2.5 text-[11px] sm:text-xs text-neutral-700 pt-1 border-t border-neutral-200/50">
                <Clock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0 mt-0.5 sm:mt-0" />
                <div className="leading-snug">
                  Order within <strong className="text-neutral-950 font-mono font-bold">{String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s</strong> for <span className="font-semibold text-neutral-900 underline decoration-neutral-400">Complimentary Pan-India Delivery</span>
                </div>
              </div>

              {/* Stock Urgency Progress Bar */}
              <div className="space-y-1.5 pt-1 border-t border-neutral-200/50">
                <div className="flex justify-between text-[10px] sm:text-[11px] font-semibold">
                  <span className="text-red-600 flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping inline-block mr-1"></span>
                    Only {product.stock > 0 && product.stock <= 10 ? product.stock : 4} items left in stock — selling fast!
                  </span>
                  <span className="text-neutral-500 flex-shrink-0 ml-2">86% sold</span>
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
            <div className="space-y-3.5 sm:space-y-4 p-3.5 sm:p-4 rounded-2xl bg-neutral-50/90 border border-neutral-200/90 shadow-2xs">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 sm:space-x-2 min-w-0">
                    <Ruler className="w-3.5 h-3.5 text-neutral-700 flex-shrink-0" />
                    <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 truncate">
                      {sizeConfig.label}:
                    </span>
                    <span className="text-xs font-extrabold text-black bg-white px-2.5 py-0.5 rounded-md border border-neutral-200 shadow-2xs flex-shrink-0">
                      {selectedVariant || sizeConfig.defaultSize}
                    </span>
                  </div>
                  {sizeConfig.hasSizeGuide && (
                    <button
                      type="button"
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center space-x-1 underline underline-offset-4 transition-colors flex-shrink-0"
                    >
                      <span>Size Guide</span>
                    </button>
                  )}
                </div>

                {/* Size Options Pill Badges */}
                <div className="flex flex-wrap gap-1.5 sm:gap-2 pt-1">
                  {sizeConfig.sizes.map((opt) => {
                    const isSelected = (selectedVariant || sizeConfig.defaultSize) === opt;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setSelectedVariant(opt)}
                        className={`min-w-[42px] px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs font-bold border transition-all touch-manipulation active:scale-95 ${
                          isSelected
                            ? 'bg-black text-white border-black shadow-md scale-102 ring-2 ring-neutral-400/40'
                            : 'bg-white text-neutral-800 border-neutral-200 hover:border-black hover:bg-neutral-100/60'
                        }`}
                      >
                        {opt}
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-1.5 text-[10px] sm:text-[11px] text-neutral-500 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#0D8756] flex-shrink-0" />
                  <span className="leading-tight">
                    Size <strong className="text-neutral-800 font-bold">{selectedVariant || sizeConfig.defaultSize}</strong> is reserved upon addition
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
                      <div className="flex flex-wrap gap-1.5 sm:gap-2">
                        {v.options?.map((opt, oIdx) => {
                          const optLabel = typeof opt === 'object' ? (opt?.name || opt?.value || opt?.color || '') : String(opt);
                          return (
                            <span
                              key={oIdx}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white border border-neutral-200 text-neutral-700"
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
            <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-50/90 border border-neutral-200/80 space-y-2.5 sm:space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-900 flex items-center space-x-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                  <span>Frequently Bought Together</span>
                </span>
                <span className="text-[10px] font-bold text-[#0D8756] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex-shrink-0">
                  Save 15%
                </span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="relative w-11 h-13 sm:w-12 sm:h-14 rounded-lg overflow-hidden border border-neutral-200 bg-white flex-shrink-0">
                  <img src={activeImage} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-neutral-400 font-bold text-sm flex-shrink-0">+</span>
                <div className="relative w-11 h-13 sm:w-12 sm:h-14 rounded-lg overflow-hidden border border-neutral-200 bg-white flex-shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=300&q=80"
                    alt="Premium Protection Sleeve"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-neutral-900 truncate">VEXIVO Silk Care & Travel Pouch</p>
                  <div className="flex items-center space-x-1.5 mt-0.5">
                    <span className="text-xs font-bold text-black">₹199</span>
                    <span className="text-[11px] text-neutral-500 line-through">₹399</span>
                  </div>
                </div>
                <label className="flex items-center cursor-pointer select-none flex-shrink-0 p-1">
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
            <div className="space-y-2.5 sm:space-y-3 pt-2">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
                {/* Quantity */}
                <div className="flex items-center justify-between sm:justify-center border border-neutral-200 rounded-full py-2 px-4 h-12 flex-shrink-0">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black active:bg-neutral-100 transition-colors"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-sm font-bold w-8 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-600 hover:text-black active:bg-neutral-100 transition-colors"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Add To Cart */}
                <button
                  onClick={handleAddToCart}
                  className="btn-pill-dark flex-1 h-12 py-3 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2 active:scale-[0.98] transition-transform shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 flex-shrink-0" />
                  <span>Add to Bag</span>
                </button>
              </div>

              {/* Buy Now Direct Button */}
              <button
                onClick={handleBuyNow}
                className="btn-pill-yellow w-full h-12 py-3 text-xs sm:text-sm uppercase tracking-wider text-center font-bold shadow-xs active:scale-[0.98] transition-transform"
              >
                Instant Buy Now
              </button>
            </div>

            {/* Verified Marketplace Seller Card */}
            <div className="p-3 sm:p-3.5 rounded-2xl bg-neutral-50 border border-neutral-200/80 text-xs">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center space-x-2 sm:space-x-2.5 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold flex-shrink-0">
                    <Store className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] sm:text-[10px] font-bold text-neutral-400 uppercase tracking-wider block">
                      Sold by
                    </span>
                    <span className="font-extrabold text-neutral-900 text-xs truncate block">
                      {product.sellerName || 'VEXIVO Official Flagship'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-1 px-2 sm:px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[10px] sm:text-[11px] font-bold border border-emerald-200/60 flex-shrink-0">
                  <span className="text-amber-500">★</span>
                  <span>4.9</span>
                  <span className="text-[9px] sm:text-[10px] text-emerald-600 font-medium ml-0.5">Verified</span>
                </div>
              </div>
            </div>

            {/* Guarantees Box */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-neutral-50 border border-neutral-100 divide-y divide-neutral-100 text-[11px] sm:text-xs text-neutral-600">
              <div className="flex items-center space-x-2.5 sm:space-x-3 py-2.5 first:pt-0">
                <Truck className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>Complimentary Pan-India Express Delivery</strong> on orders over ₹499
                </span>
              </div>
              <div className="flex items-center space-x-2.5 sm:space-x-3 py-2.5">
                <RotateCcw className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>30-Day Hassle-Free Returns</strong> with doorstep courier pickup
                </span>
              </div>
              <div className="flex items-center space-x-2.5 sm:space-x-3 py-2.5 last:pb-0">
                <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>Genuine Product Guarantee</strong> verified by VEXIVO Marketplace
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Specs, Shipping, Reviews */}
        <div id="product-reviews-section" className="mt-12 sm:mt-16 lg:mt-24 pt-6 sm:pt-8 border-t border-neutral-100">
          {/* Tabs Navigation */}
          <div className="flex items-center justify-start sm:justify-center space-x-2 sm:space-x-8 border-b border-neutral-200 pb-2 overflow-x-auto no-scrollbar scroll-smooth px-1">
            {[
              { id: 'description', label: 'Full Description' },
              { id: 'specs', label: 'Specifications & Materials' },
              { id: 'shipping', label: 'Shipping & Returns' },
              { id: 'reviews', label: `Reviews (${reviewsList.length || product.numReviews})` },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-xs sm:text-sm uppercase tracking-wider font-bold py-2 border-b-2 transition-all whitespace-nowrap flex-shrink-0 px-2 sm:px-0 ${
                  activeTab === tab.id
                    ? 'border-black text-black'
                    : 'border-transparent text-neutral-500 hover:text-black'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="max-w-4xl mx-auto py-6 sm:py-10">
            {activeTab === 'description' && (
              <div className="prose max-w-none text-xs sm:text-sm text-neutral-700 leading-relaxed space-y-4">
                <p className="break-words">{product.description}</p>
                <h4 className="text-sm sm:text-base font-bold text-neutral-900 mt-6">Acoustic & Craftsmanship Details</h4>
                <p>
                  Every VEXIVO creation undergoes extensive quality control. From the tensile
                  strength of our double-faced cashmere seams to the acoustic frequency tuning of each
                  neodymium transducer, we ensure maximum fidelity and longevity.
                </p>
              </div>
            )}

            {activeTab === 'specs' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs sm:text-sm">
                <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-neutral-500 text-[11px] sm:text-xs">Brand / Atelier</p>
                  <p className="font-bold text-neutral-900">{product.brand || 'VEXIVO'}</p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-neutral-500 text-[11px] sm:text-xs">SKU / Model Number</p>
                  <p className="font-bold text-neutral-900">{product.sku || 'VEX-STD-001'}</p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-neutral-500 text-[11px] sm:text-xs">Department</p>
                  <p className="font-bold text-neutral-900">{product.category}</p>
                </div>
                <div className="p-3.5 sm:p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-1">
                  <p className="text-neutral-500 text-[11px] sm:text-xs">Warranty Coverage</p>
                  <p className="font-bold text-neutral-900">Lifetime Hardware & Craft Guarantee</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-neutral-700 leading-relaxed">
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
              <div className="space-y-6 sm:space-y-8">
                {/* Write Review Form */}
                <div className="bg-neutral-50 p-4 sm:p-8 rounded-2xl border border-neutral-100">
                  <h3 className="text-sm sm:text-base font-bold text-neutral-900 mb-3 sm:mb-4">Write a Verified Review</h3>
                  {reviewSuccess ? (
                    <div className="flex items-center space-x-2 text-[#0D8756] text-xs font-bold py-3">
                      <Check className="w-4 h-4 flex-shrink-0" />
                      <span>Thank you! Your review has been submitted and published.</span>
                    </div>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3.5 sm:space-y-4">
                      {reviewError && (
                        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                          {reviewError}
                        </div>
                      )}
                      <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase text-neutral-700 mb-1">
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
                                className={`w-5 h-5 sm:w-6 sm:h-6 ${
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
                          <label className="block text-[11px] sm:text-xs font-bold uppercase text-neutral-700 mb-1">
                            Your Name
                          </label>
                          <input
                            type="text"
                            required
                            value={reviewName}
                            onChange={(e) => setReviewName(e.target.value)}
                            placeholder="e.g. Eleanor Vance"
                            className="input-pill w-full"
                          />
                        </div>
                      )}

                      <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase text-neutral-700 mb-1">
                          Review Headline
                        </label>
                        <input
                          type="text"
                          required
                          value={reviewTitle}
                          onChange={(e) => setReviewTitle(e.target.value)}
                          placeholder="e.g. Masterful acoustics and supreme comfort"
                          className="input-pill w-full"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] sm:text-xs font-bold uppercase text-neutral-700 mb-1">
                          Review Feedback
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share details about the quality, fit, and audio performance..."
                          className="w-full px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingReview}
                        className="btn-pill-dark text-xs py-3 px-6 sm:px-8 flex items-center justify-center space-x-2 w-full sm:w-auto"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>{isSubmittingReview ? 'Submitting...' : 'Submit Review'}</span>
                      </button>
                    </form>
                  )}
                </div>

                {/* Reviews Listing */}
                <div className="space-y-3 sm:space-y-4">
                  {reviewsList.length === 0 ? (
                    <p className="text-xs text-neutral-500 text-center py-6">
                      Be the first to review this iconic piece.
                    </p>
                  ) : (
                    reviewsList.map((rev) => (
                      <div
                        key={rev._id || rev.id}
                        className="p-4 sm:p-5 rounded-2xl border border-neutral-100 bg-white space-y-2 shadow-subtle"
                      >
                        <div className="flex items-center justify-between">
                          <RatingStars rating={rev.rating} showText={false} />
                          <span className="text-[10px] sm:text-[11px] text-neutral-500">
                            {new Date(rev.createdAt || Date.now()).toLocaleDateString('en-GB')}
                          </span>
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-neutral-900 break-words">{rev.title}</h4>
                        <p className="text-xs text-neutral-600 leading-relaxed break-words">{rev.comment}</p>
                        <p className="text-[10px] sm:text-[11px] font-semibold text-neutral-500 pt-1">
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

        {/* Similar Products & Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="mt-12 sm:mt-16 pt-8 sm:pt-12 border-t border-neutral-100">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-1">
              <div>
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Curated For You
                </span>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-neutral-900 mt-0.5">
                  Similar Products & Recommendations
                </h3>
              </div>
              <p className="text-xs text-neutral-500 font-medium">
                Matching items in <span className="text-black font-bold">{product.category || 'Store'}</span>
              </p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-6">
              {relatedProducts.map((p, idx) => (
                <ProductCard key={p._id || p.id} product={p} index={idx} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Bottom Buy Bar (Shows on Scroll like Shaporoo, coordinated with MobileStickyBar) */}
      <div
        className={`fixed bottom-14 lg:bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-neutral-200/80 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] transition-transform duration-300 ${
          isStickyVisible ? 'translate-y-0' : 'translate-y-[200%]'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-2 sm:py-3 flex items-center justify-between gap-3">
          <div className="flex items-center space-x-2.5 sm:space-x-3 min-w-0">
            <img
              src={activeImage}
              alt={product.name}
              onError={(e) => {
                e.currentTarget.src = fallbackImg;
              }}
              className="w-10 h-12 sm:w-11 sm:h-13 rounded-lg object-cover border border-neutral-200 flex-shrink-0"
            />
            <div className="min-w-0">
              <h4 className="text-xs sm:text-sm font-bold text-neutral-900 truncate max-w-[140px] xs:max-w-xs sm:max-w-md">
                {product.name}
              </h4>
              <div className="flex items-center space-x-1.5 sm:space-x-2 text-xs">
                <span className="font-extrabold text-neutral-950">₹{Number(product.price || 0).toFixed(2)}</span>
                {Number(product.compareAtPrice || 0) > Number(product.price || 0) && (
                  <span className="text-neutral-500 line-through text-[11px] hidden xs:inline">
                    ₹{Number(product.compareAtPrice || 0).toFixed(2)}
                  </span>
                )}
                {(selectedVariant || sizeConfig.defaultSize) && (
                  <span className="text-neutral-700 bg-neutral-100 px-1.5 py-0.5 rounded font-semibold text-[10px] sm:text-[11px] truncate max-w-[80px]">
                    {selectedVariant || sizeConfig.defaultSize}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              onClick={handleAddToCart}
              className="btn-pill-dark px-3.5 sm:px-6 py-2 sm:py-2.5 text-xs sm:text-sm uppercase tracking-wider flex items-center space-x-1.5 shadow-md active:scale-95 transition-all"
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
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200"
          onClick={() => setIsLightboxOpen(false)}
        >
          <button
            onClick={() => setIsLightboxOpen(false)}
            aria-label="Close Fullscreen"
            className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/20 hover:bg-white text-white hover:text-black flex items-center justify-center transition-all"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <div
            className="relative max-w-4xl w-full max-h-[72vh] sm:max-h-[80vh] flex items-center justify-center select-none"
            onClick={(e) => e.stopPropagation()}
          >
            {activeMedia.type === 'video' ? (
              <video
                key={activeMedia.url}
                src={activeMedia.url}
                controls
                playsInline
                autoPlay
                className="max-w-full max-h-[70vh] sm:max-h-[78vh] object-contain rounded-xl shadow-2xl bg-black"
              />
            ) : (
              <img
                src={activeMedia.url}
                alt={product.name}
                className="max-w-full max-h-[70vh] sm:max-h-[78vh] object-contain rounded-xl shadow-2xl"
              />
            )}
          </div>

          {mediaList.length > 1 && (
            <div
              className="flex space-x-2 sm:space-x-3 mt-4 sm:mt-6 z-50 overflow-x-auto max-w-[90vw] sm:max-w-md no-scrollbar px-2"
              onClick={(e) => e.stopPropagation()}
            >
              {mediaList.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-12 h-14 sm:w-14 sm:h-16 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                    selectedImageIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  {item.type === 'video' ? (
                    <div className="w-full h-full bg-neutral-900 flex items-center justify-center">
                      <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white text-white" />
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
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200"
          onClick={() => setIsSizeGuideOpen(false)}
        >
          <div
            className="relative bg-white rounded-2xl sm:rounded-3xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-4 sm:p-8 shadow-2xl border border-neutral-100"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-neutral-100">
              <div className="flex items-center space-x-2">
                <Ruler className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-900 flex-shrink-0" />
                <h3 className="text-base sm:text-lg font-bold text-neutral-900">VEXIVO Size & Fit Guide</h3>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center text-neutral-700 transition-colors"
                aria-label="Close size guide"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 space-y-4 text-xs text-neutral-600">
              <p>
                Measurements for <strong className="text-black">{product.category || 'this item'}</strong>. If you are between two sizes, we recommend selecting one size up for a relaxed fit or true-to-size for tailored elegance.
              </p>

              {/* Dynamic Size Conversion Table */}
              <div className="overflow-x-auto border border-neutral-200 rounded-xl sm:rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-100/80 border-b border-neutral-200 text-neutral-900 font-bold uppercase tracking-wider">
                      {(sizeConfig.guideHeaders || ['Size', 'Fit']).map((h, idx) => (
                        <th key={idx} className="p-2.5 sm:p-3 whitespace-nowrap">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {(sizeConfig.guideRows || []).map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 1 ? 'bg-neutral-50/60' : 'bg-white'}>
                        <td className="p-2.5 sm:p-3 font-bold text-neutral-900 whitespace-nowrap">{row.col1}</td>
                        {row.col2 && <td className="p-2.5 sm:p-3 text-neutral-700 whitespace-nowrap">{row.col2}</td>}
                        {row.col3 && <td className="p-2.5 sm:p-3 text-neutral-700 whitespace-nowrap">{row.col3}</td>}
                        {row.col4 && <td className="p-2.5 sm:p-3 text-neutral-700 whitespace-nowrap">{row.col4}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-3 sm:p-3.5 bg-neutral-50 rounded-xl flex items-center space-x-2 text-neutral-700">
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
