import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Loader2 } from 'lucide-react';
import ProductCard from '../common/ProductCard';
import api from '../../services/api';

const tabConfigs = [
  { id: 'women-wear', label: "Women's Fashion", subtitle: 'Dresses, Tops, Skirts & Modern Tailoring' },
  { id: 'men-wear', label: "Men's Fashion", subtitle: 'Shirts, T-Shirts, Trousers & Jackets' },
  { id: 'shoes', label: "Shoes & Footwear", subtitle: 'Sneakers, Boots, Sandals & Flats' },
  { id: 'electronics', label: "Electronics", subtitle: 'Acoustic Headphones, Keyboards & Gadgets' },
  { id: 'beauty', label: "Beauty & Skincare", subtitle: 'Skincare, Makeup & Beauty Essentials' },
  { id: 'home-living', label: "Home & Living", subtitle: 'Sculptural Decor, Furniture & Ambient Lighting' },
];

const FeaturedCollectionTabs = () => {
  const [activeTab, setActiveTab] = useState('women-wear');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const currentTab = tabConfigs.find((t) => t.id === activeTab) || tabConfigs[0];

  useEffect(() => {
    let isCancelled = false;
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await api.categories.getBySlug(activeTab, { limit: 8 });
        if (!isCancelled && res.success && res.products) {
          setProducts(res.products.slice(0, 8));
        }
      } catch (err) {
        console.error('Failed to load category products:', err);
      } finally {
        if (!isCancelled) setLoading(false);
      }
    };
    fetchProducts();
    return () => {
      isCancelled = true;
    };
  }, [activeTab]);

  const handleTabChange = (id) => {
    if (id !== activeTab) {
      setActiveTab(id);
    }
  };

  return (
    <section className="py-10 sm:py-14 bg-white border-b border-neutral-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold uppercase tracking-widest text-neutral-500 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-purple-600" />
            <span>Featured Collections</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-neutral-900">
            Curated Wardrobe &amp; Living
          </h2>
          <p className="text-neutral-500 text-xs sm:text-sm mt-1">
            Discover iconic tailoring, luxury leather, and lifestyle essentials crafted to the finest standards.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 mt-6">
            {tabConfigs.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`px-4 sm:px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 ${
                    isActive
                      ? 'bg-black text-white shadow-md scale-105'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-black'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {loading ? (
          <div className="min-h-[260px] flex flex-col justify-center items-center space-y-2">
            <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
            <p className="text-xs text-neutral-400 font-medium">Loading {currentTab.label} products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-12 text-center bg-neutral-50 rounded-2xl border border-neutral-100">
            <p className="text-sm font-bold text-neutral-800">No products found in {currentTab.label}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
            {products.map((item) => (
              <ProductCard key={item._id || item.id} product={item} />
            ))}
          </div>
        )}

        <div className="mt-10 text-center">
          <Link
            to={`/category/${activeTab}`}
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
