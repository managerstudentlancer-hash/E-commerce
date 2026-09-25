import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import api from '../../services/api';

const tabDefinitions = [
  { id: 'women', label: "Women's Elegance", categorySlug: 'women' },
  { id: 'men', label: "Men's Tailoring", categorySlug: 'men' },
  { id: 'shoes', label: 'Shoes & Footwear', categorySlug: 'shoes' },
  { id: 'bags', label: 'Tuscan Leather Bags', categorySlug: 'bags' },
  { id: 'audio', label: 'Acoustic Audio & Tech', categorySlug: 'electronics' },
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
  }, [ref, threshold]);
  return inView;
}

const FeaturedCollectionTabs = () => {
  const [activeTab, setActiveTab] = useState('women');
  const [productsByTab, setProductsByTab] = useState({});
  const [loading, setLoading] = useState(false);
  const [gridKey, setGridKey] = useState(0);

  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);

  const currentTabDef = tabDefinitions.find((t) => t.id === activeTab) || tabDefinitions[0];

  useEffect(() => {
    // Fetch products for the active tab from MongoDB if not already fetched
    const fetchTabProducts = async () => {
      if (productsByTab[activeTab]?.length > 0) return;
      setLoading(true);
      try {
        const res = await api.products.getAll({
          category: currentTabDef.categorySlug,
          limit: 8,
        });
        if (res.success && res.products && res.products.length > 0) {
          setProductsByTab((prev) => ({
            ...prev,
            [activeTab]: res.products,
          }));
        }
      } catch (err) {
        console.warn(`Failed to fetch products for tab ${activeTab}:`, err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTabProducts();
  }, [activeTab, currentTabDef.categorySlug, productsByTab]);

  const handleTabChange = (id) => {
    setActiveTab(id);
    setGridKey((k) => k + 1);
  };

  const currentProducts = productsByTab[activeTab] || [];

  // per-element stagger delays (ms) for header row
  const delays = [0, 80, 160, 240];

  const fadeUp = (delay) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? 'translateY(0)' : 'translateY(2rem)',
    transition: `opacity 0.55s cubic-bezier(0,0,0.3,1) ${delay}ms, transform 0.55s cubic-bezier(0,0,0.3,1) ${delay}ms`,
  });

  return (
    <section ref={sectionRef} className="py-12 sm:py-16 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div
            className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2"
            style={fadeUp(delays[0])}
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Featured Collections</span>
          </div>

          <h2
            className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900"
            style={fadeUp(delays[1])}
          >
            Curated Wardrobe &amp; Living
          </h2>

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
            {tabDefinitions.map((tab) => {
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

        {/* Product Grid */}
        <div
          key={gridKey}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-6"
        >
          {currentProducts.slice(0, 8).map((item, idx) => (
            <div
              key={item._id || item.id || idx}
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
            to={`/category/${currentTabDef.categorySlug}`}
            className="btn-pill-dark px-8 py-3 text-xs uppercase tracking-wider inline-flex items-center space-x-2"
          >
            <span>Explore All {currentTabDef.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollectionTabs;
