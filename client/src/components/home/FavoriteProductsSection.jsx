import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Star, ChevronLeft, ChevronRight, ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const defaultSlides = [
  {
    id: 1,
    bgImage: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85',
    colorScheme: 'bg-[#F9F6F0]',
    accentColor: '#C4301C',
    product: {
      id: 'fav-1',
      name: 'French-Style Flower Lantern Sleeve Linen Dress',
      slug: 'vexivo-classic-venetian-suede-driving-loafers',
      category: 'Lady Dresses',
      price: 95.0,
      compareAtPrice: 135.0,
      discount: 30,
      rating: 5,
      reviewsCount: 48,
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    },
    quote: '“Each piece is authentic and carefully sourced from its place of origin.”',
    author: 'Julie Mathers',
    location: 'London, UK',
    verified: true,
  },
  {
    id: 2,
    bgImage: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1600&q=85',
    colorScheme: 'bg-[#F2F5F8]',
    accentColor: '#1A365D',
    product: {
      id: 'fav-2',
      name: 'The Kensington Tailored Wool Pleated Trouser',
      slug: 'vexivo-mountain-crest-all-weather-trail-walkers',
      category: "Men's Tailoring",
      price: 145.0,
      compareAtPrice: 190.0,
      discount: 24,
      rating: 5,
      reviewsCount: 64,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?auto=format&fit=crop&w=600&q=80',
    },
    quote: '“All products are authentic and imported directly with bespoke Savile Row craft.”',
    author: 'Jenny Wilson',
    location: 'Manchester, UK',
    verified: true,
  },
];

const quotes = [
  '“Each piece is authentic and carefully sourced from its place of origin.”',
  '“All products are authentic and imported directly with bespoke Savile Row craft.”',
  '“Crafted with care using Tuscan full-grain leather, each piece reflects true luxury.”',
  '“Pure studio-grade resolution. The acoustic depth and craftsmanship are breathtaking.”',
];

const authors = [
  { name: 'Julie Mathers', location: 'London, UK' },
  { name: 'Jenny Wilson', location: 'Manchester, UK' },
  { name: 'Alexander Wright', location: 'Edinburgh, UK' },
  { name: 'Marcus Sterling', location: 'Cambridge, UK' },
];

const FavoriteProductsSection = () => {
  const [slides, setSlides] = useState(defaultSlides);
  const [current, setCurrent] = useState(0);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const res = await api.products.getAll({ limit: 4 });
        if (res.success && res.products && res.products.length > 0) {
          const dynamicSlides = res.products.map((p, idx) => ({
            id: p._id || idx,
            bgImage: (p.images && p.images[0]) || p.thumbnail || defaultSlides[0].bgImage,
            colorScheme: idx % 2 === 0 ? 'bg-[#F9F6F0]' : 'bg-[#F2F5F8]',
            accentColor: '#C4301C',
            product: {
              id: p._id,
              name: p.name,
              slug: p.slug,
              category: p.category || 'Luxury Goods',
              price: p.price || 99,
              compareAtPrice: p.compareAtPrice || 0,
              discount: p.discount || (p.compareAtPrice > p.price ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0),
              rating: Math.round(p.rating || 5),
              reviewsCount: p.numReviews || 24,
              image: p.thumbnail || (p.images && p.images[0]) || defaultSlides[0].product.image,
              stock: p.stock || 50,
            },
            quote: quotes[idx % quotes.length],
            author: authors[idx % authors.length].name,
            location: authors[idx % authors.length].location,
            verified: true,
          }));
          setSlides(dynamicSlides);
        }
      } catch (err) {
        console.warn('Failed to load favorite products from API:', err.message);
      }
    };

    fetchFavorites();
  }, []);

  const slide = slides[current] || defaultSlides[0];

  const handleNext = () => {
    setCurrent((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(
      {
        _id: slide.product.id,
        name: slide.product.name,
        price: slide.product.price,
        image: slide.product.image,
        images: [slide.product.image],
        category: slide.product.category,
        slug: slide.product.slug,
        stock: slide.product.stock || 50,
      },
      1
    );
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-neutral-100 bg-white">
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 min-h-[560px] lg:min-h-[640px]">
        {/* LEFT SIDE: Lifestyle Backdrop with Centered Floating Product Card */}
        <div className="lg:col-span-7 xl:col-span-7 relative min-h-[460px] sm:min-h-[520px] lg:min-h-full overflow-hidden bg-neutral-900 group">
          <img
            key={`bg-${slide.id}`}
            src={slide.bgImage}
            alt={slide.product.name}
            onError={(e) => {
              e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85';
            }}
            className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-1000 ease-out animate-in fade-in zoom-in-95"
          />
          <div className="absolute inset-0 bg-black/25 pointer-events-none" />

          {/* Centered Floating Product Card */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-6 z-10">
            <div className="w-full max-w-[310px] sm:max-w-[340px] bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.22)] border border-white/60 transition-all duration-500 hover:shadow-[0_24px_60px_rgba(0,0,0,0.3)] hover:-translate-y-1">
              <div className="relative aspect-square rounded-xl overflow-hidden bg-[#F3F4F6] mb-3.5 group/card">
                <img
                  key={`card-img-${slide.product.id}`}
                  src={slide.product.image}
                  alt={slide.product.name}
                  onError={(e) => {
                    e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80';
                  }}
                  className="w-full h-full object-cover object-center transition-transform duration-700 [transition-timing-function:cubic-bezier(0.4,0,0.2,1)] group-hover/card:scale-105"
                />

                {slide.product.discount > 0 && (
                  <span className="absolute top-2.5 left-2.5 badge-sale shadow-sm">
                    -{slide.product.discount}%
                  </span>
                )}

                <Link
                  to={`/product/${slide.product.slug}`}
                  className="absolute bottom-2.5 left-1/2 -translate-x-1/2 opacity-0 group-hover/card:opacity-100 transition-all duration-300 py-1.5 px-3.5 rounded-full bg-white/95 text-neutral-900 text-[11px] font-bold shadow-md hover:bg-white flex items-center space-x-1 whitespace-nowrap"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                </Link>
              </div>

              <div className="space-y-1 text-left">
                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-600 block">
                  {slide.product.category}
                </span>

                <Link
                  to={`/product/${slide.product.slug}`}
                  className="block text-sm sm:text-[15px] font-extrabold text-neutral-900 hover:text-black line-clamp-1 transition-colors"
                >
                  {slide.product.name}
                </Link>

                <div className="flex items-center space-x-1.5 pt-0.5">
                  <div className="flex text-amber-400">
                    {[...Array(Math.max(1, slide.product.rating))].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-[11px] font-semibold text-neutral-600">
                    ({slide.product.reviewsCount})
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-neutral-100 mt-2">
                  <div>
                    <div className="flex items-baseline space-x-1.5">
                      <span className="text-base font-extrabold text-[#C4301C]">
                        £{slide.product.price.toFixed(2)}
                      </span>
                      {slide.product.compareAtPrice > slide.product.price && (
                        <span className="text-xs text-neutral-600 line-through">
                          £{slide.product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-neutral-600 block">Inc. VAT / UK delivery</span>
                  </div>

                  <button
                    onClick={handleAddToCart}
                    aria-label="Add to bag"
                    className={`p-2.5 rounded-xl transition-all duration-200 ${
                      added
                        ? 'bg-emerald-600 text-white'
                        : 'bg-neutral-900 text-white hover:bg-neutral-800 active:scale-95'
                    }`}
                  >
                    {added ? <Check className="w-4 h-4" /> : <ShoppingBag className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE: Testimonial & Navigation */}
        <div
          className={`lg:col-span-5 xl:col-span-5 ${slide.colorScheme} p-8 sm:p-12 lg:p-14 flex flex-col justify-between transition-colors duration-700`}
        >
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-6 sm:mb-8">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Our Favorite Products</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900 leading-tight mb-6">
              Verified British Clientele Feedback
            </h2>

            <blockquote className="text-base sm:text-lg lg:text-xl font-medium text-neutral-800 italic leading-relaxed mb-6">
              {slide.quote}
            </blockquote>

            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-bold text-neutral-900">{slide.author}</span>
                {slide.verified && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800">
                    ✓ Verified Buyer
                  </span>
                )}
              </div>
              <p className="text-xs text-neutral-500">{slide.location}</p>
            </div>
          </div>

          <div className="flex items-center justify-between pt-8 border-t border-neutral-200/80 mt-8">
            <div className="flex items-center space-x-2">
              {slides.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrent(idx)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    idx === current ? 'w-8 bg-neutral-900' : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                aria-label="Previous review"
                className="w-10 h-10 rounded-full bg-white border border-neutral-200 hover:border-black flex items-center justify-center text-neutral-700 hover:text-black transition-all shadow-sm active:scale-95"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next review"
                className="w-10 h-10 rounded-full bg-white border border-neutral-200 hover:border-black flex items-center justify-center text-neutral-700 hover:text-black transition-all shadow-sm active:scale-95"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FavoriteProductsSection;
