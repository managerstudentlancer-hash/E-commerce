import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, RefreshCw, AlertCircle, ShoppingBag } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import api from '../../services/api';

const womenTabs = [
  { id: 'women-dresses', label: 'Dresses', subtitle: 'Evening gowns, maxi dresses & floral casuals' },
  { id: 'women-shoes', label: 'Shoes', subtitle: 'Stilettos, designer pumps & comfort flats' },
  { id: 'women-bags', label: 'Bags', subtitle: 'Luxury totes, shoulder bags & clutch wallets' },
  { id: 'women-jewellery', label: 'Jewellery', subtitle: 'Fine earrings, necklaces & statement pieces' },
  { id: 'women-watches', label: 'Watches', subtitle: 'Elegantly crafted timepieces & chrono accents' },
];

const WomenSection = () => {
  const [activeTab, setActiveTab] = useState('women-dresses');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentTab = womenTabs.find((t) => t.id === activeTab) || womenTabs[0];

  const fetchCollectionProducts = async (collectionSlug) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.products.getAll({
        collection: collectionSlug,
        limit: 12,
      });

      if (res && res.success) {
        setProducts(res.products || []);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.error(`Failed to load ${collectionSlug}:`, err);
      setError(err.message || 'Unable to load products. Please check connection.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCollectionProducts(activeTab);
  }, [activeTab]);

  return (
    <section className="py-12 sm:py-16 bg-[#FAF9F7] border-b border-neutral-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-100 text-rose-800 text-[11px] font-extrabold uppercase tracking-widest mb-2">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" />
              <span>Women's Edit</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
              Women's Collection
            </h2>
            <p className="text-neutral-500 text-xs sm:text-sm mt-1 max-w-xl">
              {currentTab.subtitle}
            </p>
          </div>

          {/* Sub-Tabs Selector */}
          <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
            {womenTabs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3.5 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-neutral-900 text-white shadow-sm scale-105'
                      : 'bg-white text-neutral-700 hover:bg-neutral-100 border border-neutral-200/80 hover:border-neutral-300'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Stage */}
        {loading ? (
          /* Loading Skeleton */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-lg border border-neutral-200/70 p-3 flex flex-col space-y-3 animate-pulse"
              >
                <div className="w-full pt-[120%] bg-neutral-200 rounded-md" />
                <div className="h-3 bg-neutral-200 rounded-sm w-1/3" />
                <div className="h-4 bg-neutral-200 rounded-sm w-3/4" />
                <div className="h-4 bg-neutral-200 rounded-sm w-1/2" />
              </div>
            ))}
          </div>
        ) : error ? (
          /* Error State */
          <div className="py-12 px-4 text-center bg-white rounded-2xl border border-red-100 shadow-2xs max-w-lg mx-auto space-y-3">
            <AlertCircle className="w-10 h-10 text-red-500 mx-auto" />
            <p className="text-sm font-bold text-neutral-800">Failed to load {currentTab.label}</p>
            <p className="text-xs text-neutral-500">{error}</p>
            <button
              onClick={() => fetchCollectionProducts(activeTab)}
              className="btn-pill-dark text-xs py-2 px-4 inline-flex items-center space-x-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry</span>
            </button>
          </div>
        ) : products.length === 0 ? (
          /* Empty State */
          <div className="py-16 text-center bg-white rounded-2xl border border-neutral-200/70 shadow-2xs space-y-3">
            <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-base font-bold text-neutral-800">
              No products found in Women's {currentTab.label}
            </p>
            <p className="text-xs text-neutral-500">
              Check back soon for new arrivals or explore other collections.
            </p>
          </div>
        ) : (
          /* Product Grid */
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map((item, idx) => (
              <ProductCard
                key={item._id || item.id || idx}
                product={item}
                index={idx}
                dealBadge="Women's Special"
              />
            ))}
          </div>
        )}

        {/* Footer Link */}
        <div className="mt-10 text-center">
          <Link
            to={`/collection/${activeTab}`}
            className="btn-pill-dark px-8 py-3 text-xs uppercase tracking-wider inline-flex items-center space-x-2"
          >
            <span>View All Women's {currentTab.label}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default WomenSection;
