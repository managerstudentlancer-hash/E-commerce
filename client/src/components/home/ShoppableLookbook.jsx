import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, Eye, Plus, Check, Sparkles, ArrowRight } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const defaultLookbookItems = [
  {
    id: 'pin-1',
    name: "Women's Casual Tailored Blazer & Pleated Trouser",
    price: 185.0,
    compareAtPrice: 245.0,
    discount: 24,
    x: 48,
    y: 35,
    slug: 'vexivo-classic-venetian-suede-driving-loafers',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80',
    category: "Women's Suiting",
  },
  {
    id: 'pin-2',
    name: 'Top-Grain Genuine Leather Crossbody Bag',
    price: 140.0,
    compareAtPrice: 195.0,
    discount: 28,
    x: 62,
    y: 65,
    slug: 'vexivo-mountain-crest-all-weather-trail-walkers',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80',
    category: 'Leather Goods',
  },
  {
    id: 'pin-3',
    name: 'Star Loop Wireless ANC Studio Earbuds',
    price: 129.0,
    compareAtPrice: 180.0,
    discount: 28,
    x: 42,
    y: 18,
    slug: 'vexivo-classic-venetian-suede-driving-loafers',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
    category: 'Acoustic Audio',
  },
];

const pinCoordinates = [
  { x: 48, y: 35 },
  { x: 62, y: 65 },
  { x: 42, y: 18 },
];

const ShoppableLookbook = () => {
  const [items, setItems] = useState(defaultLookbookItems);
  const [activePin, setActivePin] = useState(defaultLookbookItems[0]);
  const [addedItem, setAddedItem] = useState(null);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchLookbookProducts = async () => {
      try {
        const res = await api.products.getAll({ limit: 3 });
        if (res.success && res.products && res.products.length >= 3) {
          const dynamicItems = res.products.slice(0, 3).map((p, idx) => ({
            id: p._id,
            name: p.name,
            price: p.price,
            compareAtPrice: p.compareAtPrice || 0,
            discount: p.discount || (p.compareAtPrice > p.price ? Math.round(((p.compareAtPrice - p.price) / p.compareAtPrice) * 100) : 0),
            x: pinCoordinates[idx].x,
            y: pinCoordinates[idx].y,
            slug: p.slug,
            image: p.thumbnail || (p.images && p.images[0]) || defaultLookbookItems[idx].image,
            category: p.category || 'Luxury Goods',
            stock: p.stock || 50,
          }));
          setItems(dynamicItems);
          setActivePin(dynamicItems[0]);
        }
      } catch (err) {
        console.warn('Failed to load lookbook products from API:', err.message);
      }
    };

    fetchLookbookProducts();
  }, []);

  const handleQuickAdd = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      _id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      images: [item.image],
      category: item.category,
      slug: item.slug,
      stock: item.stock || 10,
    });
    setAddedItem(item.id);
    setTimeout(() => setAddedItem(null), 2000);
  };

  return (
    <section className="py-16 sm:py-24 bg-neutral-50/50 border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-14">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold uppercase tracking-widest text-[#C4301C] mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>FoxTheme Lookbook Edit</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-neutral-900">
              Get Inspired by Spaces & Looks
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-lg">
              Hover and tap the glowing hotspot markers to instantly shop pieces from this London editorial shoot.
            </p>
          </div>
          <Link
            to="/shop"
            className="mt-4 md:mt-0 text-xs sm:text-sm font-bold uppercase tracking-wider text-black flex items-center space-x-1 hover:underline underline-offset-4"
          >
            <span>Explore Editorial</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Lookbook Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Editorial Image with Interactive Pins (7 Cols) */}
          <div className="lg:col-span-7 relative aspect-[4/5] sm:aspect-[16/11] rounded-3xl overflow-hidden bg-neutral-200 shadow-xl border border-neutral-200/80 group">
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1400&q=85"
              alt="VEXIVO Spring Editorial Lookbook"
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

            {/* Hotspot Pins */}
            {items.map((item) => {
              const isActive = activePin.id === item.id;
              return (
                <div
                  key={item.id}
                  style={{ top: `${item.y}%`, left: `${item.x}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <button
                    onClick={() => setActivePin(item)}
                    onMouseEnter={() => setActivePin(item)}
                    aria-label={`Inspect ${item.name}`}
                    className={`relative w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 animate-dotscale ${
                      isActive
                        ? 'bg-black text-white scale-125 shadow-2xl ring-4 ring-white/90'
                        : 'bg-white/95 text-black hover:scale-110 shadow-lg'
                    }`}
                  >
                    <span className="absolute -inset-2 rounded-full border-2 border-white/80 animate-pulse-ring pointer-events-none" />
                    <Plus className="w-4 h-4 font-bold" />
                  </button>
                </div>
              );
            })}

            {/* Lookbook Overlay Title */}
            <div className="absolute bottom-6 left-6 text-white pointer-events-none">
              <span className="text-[10px] font-bold uppercase tracking-widest bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full">
                Look 04 • The London Silhouette
              </span>
            </div>
          </div>

          {/* Active Product Preview Card (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-200/80 shadow-card">
              <div className="flex items-center space-x-2 text-[11px] font-extrabold uppercase tracking-widest text-[#C4301C] mb-3">
                <span>Shop this look</span>
                <span>•</span>
                <span className="text-neutral-500">{activePin.category}</span>
              </div>

              {/* Product Thumbnail & Details */}
              <div className="flex space-x-4 mb-6">
                <div className="relative w-24 h-32 rounded-2xl overflow-hidden bg-neutral-100 border border-neutral-200 flex-shrink-0">
                  <img
                    src={activePin.image}
                    alt={activePin.name}
                    onError={(e) => {
                      e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=400&q=80';
                    }}
                    className="w-full h-full object-cover"
                  />
                  {activePin.discount > 0 && (
                    <span className="absolute top-2 left-2 bg-[#C4301C] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                      -{activePin.discount}%
                    </span>
                  )}
                </div>

                <div className="flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                      {activePin.name}
                    </h3>
                    <div className="flex items-baseline space-x-2 mt-2">
                      <span className="text-xl font-extrabold text-neutral-900">
                        £{activePin.price.toFixed(2)}
                      </span>
                      {activePin.compareAtPrice > activePin.price && (
                        <span className="text-xs text-neutral-600 line-through">
                          £{activePin.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="text-[11px] text-[#0D8756] font-semibold">
                    ✓ In Stock (Complimentary UK Tracked Delivery)
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3 pt-2">
                <button
                  onClick={(e) => handleQuickAdd(activePin, e)}
                  className="btn-pill-dark flex-1 py-3 text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center space-x-2"
                >
                  {addedItem === activePin.id ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-400" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Quick Add</span>
                    </>
                  )}
                </button>

                <Link
                  to={`/product/${activePin.slug}`}
                  className="btn-pill-light px-4 py-3 text-xs flex items-center space-x-1.5"
                >
                  <Eye className="w-4 h-4" />
                  <span>Details</span>
                </Link>
              </div>
            </div>

            {/* Look Selector Pill Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {items.map((item, idx) => {
                const isActive = activePin.id === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActivePin(item)}
                    className={`p-3 rounded-2xl border text-left transition-all flex items-center space-x-2.5 ${
                      isActive
                        ? 'border-black bg-white shadow-md'
                        : 'border-neutral-200 bg-white/50 hover:bg-white hover:border-neutral-300'
                    }`}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-9 h-9 rounded-lg object-cover flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase text-neutral-600">Item 0{idx + 1}</p>
                      <p className="text-xs font-bold text-neutral-900 truncate">£{item.price.toFixed(2)}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShoppableLookbook;
