import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';

const tabCollections = [
  {
    id: 'women',
    label: "Women's Elegance",
    subtitle: 'Silks, Cashmere & Modern Tailoring',
    items: [
      {
        id: 'w1',
        name: "French-Style Flower Lantern Sleeve Linen Dress",
        price: 95.00,
        compareAtPrice: 135.00,
        discount: 30,
        rating: 4.9,
        numReviews: 48,
        slug: 'the-kensington-tailored-wool-pleated-trouser',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=500&q=80',
        category: "Women's Fashion",
      },
      {
        id: 'w2',
        name: "Off-Shoulder Velvet Two-Piece Soft Lounge Outfit",
        price: 110.00,
        compareAtPrice: 160.00,
        discount: 31,
        rating: 4.8,
        numReviews: 32,
        slug: 'the-mayfair-top-grain-leather-tote',
        image: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=500&q=80',
        category: "Women's Fashion",
      },
      {
        id: 'w3',
        name: "Stand Collar Batwing Sleeve Woolen Cloak Jacket",
        price: 180.00,
        compareAtPrice: 240.00,
        discount: 25,
        rating: 5.0,
        numReviews: 19,
        slug: 'the-kensington-tailored-wool-pleated-trouser',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&q=80',
        category: "Outerwear",
      },
      {
        id: 'w4',
        name: "Summer Flowy Lace Trim Maxi Dress Evening Edit",
        price: 88.00,
        compareAtPrice: 120.00,
        discount: 27,
        rating: 4.7,
        numReviews: 56,
        slug: 'the-kensington-tailored-wool-pleated-trouser',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=500&q=80',
        category: "Dresses",
      },
    ],
  },
  {
    id: 'men',
    label: "Men's Tailoring",
    subtitle: 'British Wool, Overshirts & Formal Wear',
    items: [
      {
        id: 'm1',
        name: "The Kensington Tailored Wool Pleated Trouser",
        price: 145.00,
        compareAtPrice: 190.00,
        discount: 24,
        rating: 4.9,
        numReviews: 64,
        slug: 'the-kensington-tailored-wool-pleated-trouser',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=500&q=80',
        category: "Men's Suiting",
      },
      {
        id: 'm2',
        name: "Classic Crewneck Pima Cotton Heavyweight Tee",
        price: 45.00,
        compareAtPrice: 65.00,
        discount: 30,
        rating: 4.8,
        numReviews: 112,
        slug: 'the-kensington-tailored-wool-pleated-trouser',
        image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=500&q=80',
        category: "Basics",
      },
      {
        id: 'm3',
        name: "Double-Faced Wool Camel Overcoat",
        price: 320.00,
        compareAtPrice: 420.00,
        discount: 24,
        rating: 5.0,
        numReviews: 28,
        slug: 'the-kensington-tailored-wool-pleated-trouser',
        image: 'https://images.unsplash.com/photo-1544441893-675973e31985?auto=format&fit=crop&w=500&q=80',
        category: "Outerwear",
      },
      {
        id: 'm4',
        name: "Minimalist Calfskin Leather Derby Shoes",
        price: 195.00,
        compareAtPrice: 260.00,
        discount: 25,
        rating: 4.9,
        numReviews: 41,
        slug: 'the-mayfair-top-grain-leather-tote',
        image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?auto=format&fit=crop&w=500&q=80',
        category: "Footwear",
      },
    ],
  },
  {
    id: 'leather',
    label: "Leather Goods & Bags",
    subtitle: 'Top-Grain Leather, Totes & Crossbody Bags',
    items: [
      {
        id: 'l1',
        name: "The Mayfair Top-Grain Leather Carryall Tote",
        price: 240.00,
        compareAtPrice: 320.00,
        discount: 25,
        rating: 4.9,
        numReviews: 73,
        slug: 'the-mayfair-top-grain-leather-tote',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=500&q=80',
        category: "Leather Goods",
      },
      {
        id: 'l2',
        name: "Italian Structured Flap Crossbody Bag in Cognac",
        price: 165.00,
        compareAtPrice: 220.00,
        discount: 25,
        rating: 4.8,
        numReviews: 39,
        slug: 'the-mayfair-top-grain-leather-tote',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=500&q=80',
        category: "Handbags",
      },
      {
        id: 'l3',
        name: "Handcrafted Bifold Pebble Grain Leather Wallet",
        price: 65.00,
        compareAtPrice: 90.00,
        discount: 28,
        rating: 5.0,
        numReviews: 88,
        slug: 'the-mayfair-top-grain-leather-tote',
        image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=80',
        category: "Small Leather",
      },
      {
        id: 'l4',
        name: "Weekend Duffle Bag in Waxed Canvas & Brass",
        price: 185.00,
        compareAtPrice: 250.00,
        discount: 26,
        rating: 4.9,
        numReviews: 52,
        slug: 'the-mayfair-top-grain-leather-tote',
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80',
        category: "Travel",
      },
    ],
  },
  {
    id: 'audio',
    label: "Acoustic Audio & Living",
    subtitle: 'Studio Transducers, Solid Walnut & Ambiance',
    items: [
      {
        id: 'a1',
        name: "The Apex Studio Wireless ANC Over-Ear Headphones",
        price: 280.00,
        compareAtPrice: 360.00,
        discount: 22,
        rating: 4.9,
        numReviews: 95,
        slug: 'the-apex-studio-wireless-anc-headphones',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80',
        category: "Acoustics",
      },
      {
        id: 'a2',
        name: "Acoustic Neodymium Bookshelf Speaker Pair",
        price: 340.00,
        compareAtPrice: 450.00,
        discount: 24,
        rating: 4.8,
        numReviews: 29,
        slug: 'the-apex-studio-wireless-anc-headphones',
        image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&w=500&q=80',
        category: "Home Audio",
      },
      {
        id: 'a3',
        name: "Fire Breathing Dragon Bookshelf Nook Ambience Light",
        price: 55.00,
        compareAtPrice: 80.00,
        discount: 31,
        rating: 4.9,
        numReviews: 120,
        slug: 'the-apex-studio-wireless-anc-headphones',
        image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=500&q=80',
        category: "Lighting",
      },
      {
        id: 'a4',
        name: "Solid Walnut Brass Weighted Headphone Stand",
        price: 60.00,
        compareAtPrice: 85.00,
        discount: 29,
        rating: 5.0,
        numReviews: 44,
        slug: 'the-apex-studio-wireless-anc-headphones',
        image: 'https://images.unsplash.com/photo-1524678606370-a47ad25cb82a?auto=format&fit=crop&w=500&q=80',
        category: "Accessories",
      },
    ],
  },
];

/* ─── Fires once when the element enters the viewport ─── */
function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

const FeaturedCollectionTabs = () => {
  const [activeTab, setActiveTab] = useState('women');
  const [gridKey, setGridKey] = useState(0); // re-mounts grid on tab change → cards re-animate

  const currentTab = tabCollections.find((t) => t.id === activeTab) || tabCollections[0];

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setGridKey((k) => k + 1);
  };

  // per-element stagger delays (ms) for header row
  const delays = [0, 80, 160, 240];

  // shared inline style factory
  const fadeUp = (delay) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(2rem)',
    transition: `opacity 0.55s cubic-bezier(0,0,0.3,1) ${delay}ms, transform 0.55s cubic-bezier(0,0,0.3,1) ${delay}ms`,
  });

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Section Header — staggered fade-up on scroll ── */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">

          {/* Overline label */}
          <div
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2"
            style={fadeUp(delays[0])}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Featured Collections</span>
          </div>

          {/* Heading */}
          <h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900"
            style={fadeUp(delays[1])}
          >
            Curated Wardrobe &amp; Living
          </h2>

          {/* Subtitle */}
          <p
            className="text-neutral-500 text-xs sm:text-sm mt-1"
            style={fadeUp(delays[2])}
          >
            Discover iconic tailoring, luxury leather, and acoustic innovations tailored to British standards.
          </p>

          {/* Tab buttons row */}
          <div
            className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6"
            style={fadeUp(delays[3])}
          >
            {tabCollections.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white shadow-md'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* ── Product Grid — re-keyed on tab change so cards re-animate ── */}
        <div
          key={gridKey}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6"
        >
          {currentTab.items.map((item, idx) => (
            <div
              key={item.id}
              style={{
                opacity: 0,
                transform: 'translateY(2rem)',
                animation: `featuredCardIn 0.55s cubic-bezier(0,0,0.3,1) ${320 + idx * 80}ms forwards`,
              }}
            >
              <ProductCard product={item} />
            </div>
          ))}
        </div>

        {/* View All Category Link */}
        <div className="mt-12 text-center" style={fadeUp(650)}>
          <Link
            to="/shop"
            className="btn-pill-dark px-8 py-3 text-xs uppercase tracking-wider inline-flex items-center space-x-2"
          >
            <span>Explore All {currentTab.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollectionTabs;
