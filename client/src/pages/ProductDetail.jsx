import React, { useState, useEffect } from 'react';
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
} from 'lucide-react';
import api from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import RatingStars from '../components/common/RatingStars';
import ProductCard from '../components/common/ProductCard';

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

  useEffect(() => {
    fetchProductDetails();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  const fetchProductDetails = async () => {
    setLoading(true);
    try {
      const res = await api.products.getBySlug(slug);
      if (res.success && res.product) {
        setProduct(res.product);
        setRelatedProducts(res.relatedProducts || []);
        setSelectedImageIndex(0);

        // Set default variant if available
        if (res.product.variants && res.product.variants.length > 0 && res.product.variants[0].options?.length > 0) {
          setSelectedVariant(res.product.variants[0].options[0]);
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
    addToCart(product, quantity, selectedVariant);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product, quantity, selectedVariant);
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
        setReviewsList([res.review, ...reviewsList]);
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

  const fallbackImg = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
  const images = (product.images && product.images.length > 0)
    ? product.images.filter(Boolean)
    : [product.thumbnail || product.image || fallbackImg];
  const activeImage = images[selectedImageIndex] || product.thumbnail || product.image || fallbackImg;
  const inWishlist = isInWishlist(product._id);

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
            <Link to={`/category/${product.categorySlug || product.category.toLowerCase()}`} className="hover:text-black">
              {product.category}
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
            {/* Primary Main Image with Interactive Zoom Lens on Hover */}
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
                src={activeImage}
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

            {/* Thumbnail Row */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto pb-2 no-scrollbar">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-24 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedImageIndex === idx
                        ? 'border-black shadow-md scale-95'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} view ${idx + 1}`}
                      onError={(e) => {
                        e.currentTarget.src = fallbackImg;
                      }}
                      className="w-full h-full object-cover object-center"
                    />
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
                £{product.price.toFixed(2)}
              </span>
              {product.compareAtPrice > product.price && (
                <span className="text-base text-neutral-600 line-through">
                  £{product.compareAtPrice.toFixed(2)}
                </span>
              )}
              {product.discount > 0 && (
                <span className="text-xs font-bold text-[#C4301C] bg-red-50 px-2.5 py-1 rounded-full">
                  Save £{(product.compareAtPrice - product.price).toFixed(2)} ({product.discount}%)
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

            {/* Variants Selector with Size Guide */}
            {product.variants && product.variants.length > 0 && (
              <div className="space-y-4">
                {product.variants.map((v) => {
                  const isSize = v.name.toLowerCase().includes('size') || v.name.toLowerCase().includes('fit');
                  return (
                    <div key={v.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                          {v.name}: <strong className="text-black">{selectedVariant || v.options[0]}</strong>
                        </span>
                        {isSize && (
                          <button
                            type="button"
                            onClick={() => setIsSizeGuideOpen(true)}
                            className="text-xs font-semibold text-neutral-700 hover:text-black flex items-center space-x-1 underline underline-offset-4 transition-colors"
                          >
                            <Ruler className="w-3.5 h-3.5" />
                            <span>Size Guide</span>
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {v.options.map((opt) => {
                          const isSelected = selectedVariant === opt;
                          return (
                            <button
                              key={opt}
                              onClick={() => setSelectedVariant(opt)}
                              className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                                isSelected
                                  ? 'bg-black text-white border-black shadow-sm scale-105'
                                  : 'bg-neutral-50 text-neutral-800 border-neutral-200 hover:border-black'
                              }`}
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

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
                    <span className="text-xs font-bold text-black">£18.00</span>
                    <span className="text-[11px] text-neutral-600 line-through">£28.00</span>
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

            {/* Guarantees Box */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 divide-y divide-neutral-100 text-xs text-neutral-600">
              <div className="flex items-center space-x-3 py-2.5 first:pt-0">
                <Truck className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>Complimentary UK Next-Day Delivery</strong> on orders over £50
                </span>
              </div>
              <div className="flex items-center space-x-3 py-2.5">
                <RotateCcw className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>30-Day Hassle-Free Returns</strong> with prepaid return label included
                </span>
              </div>
              <div className="flex items-center space-x-3 py-2.5 last:pb-0">
                <ShieldCheck className="w-4 h-4 text-black flex-shrink-0" />
                <span>
                  <strong>Lifetime Craft Guarantee</strong> on all hardware and stitching
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
                  Every VEXIVO creation undergoes extensive quality control in London. From the tensile
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
                  <p className="font-bold text-neutral-900">Lifetime Hardware & Acoustic Warranty</p>
                </div>
              </div>
            )}

            {activeTab === 'shipping' && (
              <div className="space-y-4 text-xs sm:text-sm text-neutral-700">
                <p>
                  <strong>United Kingdom:</strong> Complimentary Tracked Next-Day Delivery on all orders over £50. Orders under £50 are charged at £3.99 via Royal Mail Tracked 24.
                </p>
                <p>
                  <strong>International:</strong> Tracked Express Courier (DHL / DPD) delivery within 3–5 business days to Europe, US, and worldwide.
                </p>
                <p>
                  <strong>Returns:</strong> Returns are accepted within 30 days of receipt. A prepaid Royal Mail label is enclosed with all domestic parcels.
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

        {/* Related Products Carousel */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 pt-12 border-t border-neutral-100">
            <h3 className="text-2xl font-bold tracking-tight text-neutral-900 mb-6">
              You May Also Admire
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
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
                <span className="font-extrabold text-neutral-950">£{product.price.toFixed(2)}</span>
                {product.compareAtPrice > product.price && (
                  <span className="text-neutral-600 line-through text-[11px]">
                    £{product.compareAtPrice.toFixed(2)}
                  </span>
                )}
                {selectedVariant && (
                  <span className="text-neutral-500 font-medium hidden sm:inline">
                    • {selectedVariant}
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
            <img
              src={activeImage}
              alt={product.name}
              className="max-w-full max-h-[78vh] object-contain rounded-xl shadow-2xl"
            />
          </div>

          {images.length > 1 && (
            <div
              className="flex space-x-3 mt-6 z-50 overflow-x-auto max-w-md no-scrollbar"
              onClick={(e) => e.stopPropagation()}
            >
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                    selectedImageIndex === idx ? 'border-white scale-105' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={img} alt="Thumbnail preview" className="w-full h-full object-cover" />
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
                All measurements are tailored to British Standards. If you find yourself between two sizes, we recommend sizing up for a relaxed luxury silhouette or true-to-size for tailored elegance.
              </p>

              {/* Size Conversion Table */}
              <div className="overflow-x-auto border border-neutral-200 rounded-2xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-neutral-100/70 border-b border-neutral-200 text-neutral-900 font-bold uppercase tracking-wider">
                      <th className="p-3">UK Size</th>
                      <th className="p-3">Bust (in / cm)</th>
                      <th className="p-3">Waist (in / cm)</th>
                      <th className="p-3">Hips (in / cm)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    <tr>
                      <td className="p-3 font-bold text-neutral-900">XS (UK 6)</td>
                      <td className="p-3">32" / 81cm</td>
                      <td className="p-3">24" / 61cm</td>
                      <td className="p-3">34" / 86cm</td>
                    </tr>
                    <tr className="bg-neutral-50/50">
                      <td className="p-3 font-bold text-neutral-900">S (UK 8-10)</td>
                      <td className="p-3">34" / 86cm</td>
                      <td className="p-3">26" / 66cm</td>
                      <td className="p-3">36" / 91cm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-neutral-900">M (UK 12)</td>
                      <td className="p-3">36" / 91cm</td>
                      <td className="p-3">28" / 71cm</td>
                      <td className="p-3">38" / 96cm</td>
                    </tr>
                    <tr className="bg-neutral-50/50">
                      <td className="p-3 font-bold text-neutral-900">L (UK 14)</td>
                      <td className="p-3">38" / 96cm</td>
                      <td className="p-3">30" / 76cm</td>
                      <td className="p-3">40" / 101cm</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-neutral-900">XL (UK 16)</td>
                      <td className="p-3">40" / 101cm</td>
                      <td className="p-3">32" / 81cm</td>
                      <td className="p-3">42" / 106cm</td>
                    </tr>
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
