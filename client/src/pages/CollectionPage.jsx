import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Sparkles, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const CollectionPage = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    const fetchCollection = async () => {
      setLoading(true);
      try {
        const cleanSlug = (slug || '').toLowerCase().trim();
        const res = await api.collections.getBySlug(cleanSlug);
        
        if (
          res &&
          res.success &&
          res.collection &&
          Array.isArray(res.collection.products) &&
          res.collection.products.length > 0
        ) {
          setCollection(res.collection);
        } else {
          // Robust fallback: fetch matching products directly
          const prodRes = await api.products.getAll();
          if (prodRes && prodRes.success) {
            const all = prodRes.products || [];
            let matched = [];

            if (cleanSlug.includes('new')) {
              matched = all.filter((p) => p.newArrival || (p.tags && p.tags.includes('New Arrival')));
            } else if (cleanSlug.includes('special') || cleanSlug.includes('offer') || cleanSlug.includes('sale')) {
              matched = all.filter((p) => p.specialOffer || (p.discount && p.discount >= 15));
            } else if (cleanSlug.includes('trend') || cleanSlug.includes('best')) {
              matched = all.filter((p) => p.bestseller || p.featured);
            } else {
              matched = all.filter(
                (p) =>
                  p.collectionSlug === cleanSlug ||
                  p.categorySlug === cleanSlug ||
                  (p.tags && p.tags.some((t) => t.toLowerCase().includes(cleanSlug)))
              );
            }

            if (matched.length === 0) {
              matched = all.slice(0, 36);
            }

            const formattedName = cleanSlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

            setCollection({
              name: formattedName ? `${formattedName} Collection` : 'Curated Collection',
              description: `Handpicked selection curated for timeless luxury and everyday lifestyle.`,
              products: matched,
            });
          }
        }
      } catch (err) {
        console.error('Failed to load collection:', err);
        try {
          const prodRes = await api.products.getAll();
          if (prodRes && prodRes.success) {
            setCollection({
              name: (slug || 'Featured').replace(/-/g, ' ').toUpperCase() + ' COLLECTION',
              description: 'Exclusive seasonal handpicked selections.',
              products: (prodRes.products || []).slice(0, 24),
            });
          }
        } catch (fbErr) {
          console.error('Fallback failed:', fbErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCollection();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [slug]);

  // Extract unique categories from collection products
  const rawProducts = collection?.products || [];
  const categories = useMemo(() => {
    const cats = new Set();
    rawProducts.forEach((p) => {
      if (p.category) cats.add(p.category);
    });
    return Array.from(cats);
  }, [rawProducts]);

  // Filter & Sort
  const filteredProducts = useMemo(() => {
    let list = [...rawProducts];

    if (selectedCategory !== 'all') {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (sortBy === 'price-low') {
      list.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortBy === 'price-high') {
      list.sort((a, b) => (b.price || 0) - (a.price || 0));
    } else if (sortBy === 'rating') {
      list.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }

    return list;
  }, [rawProducts, selectedCategory, sortBy]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        <p className="text-xs font-semibold text-neutral-500">Loading collection...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header Banner */}
      <div className="border-b border-neutral-100 bg-gradient-to-b from-[#F5EFE7]/50 via-neutral-50/60 to-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-neutral-500 mb-3 flex items-center space-x-2">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-black">Collections</Link>
            <span>/</span>
            <span className="text-black font-semibold">{collection?.name || slug}</span>
          </nav>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-black/5 text-[10px] font-extrabold uppercase tracking-widest text-neutral-800 mb-3">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Curated Drop</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900 uppercase">
                {collection?.name || slug}
              </h1>
              {collection?.description && (
                <p className="text-xs sm:text-sm text-neutral-600 mt-2 max-w-xl leading-relaxed">
                  {collection.description}
                </p>
              )}
            </div>

            <div className="text-xs font-semibold text-neutral-600 bg-white/80 border border-neutral-200/80 px-4 py-2 rounded-full self-start md:self-auto shadow-2xs">
              <strong className="text-neutral-950 font-bold">{filteredProducts.length}</strong> items available
            </div>
          </div>

          {/* Filter & Sort Bar */}
          {rawProducts.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-200/60 flex flex-wrap items-center justify-between gap-4">
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-black text-white shadow-xs'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:border-black'
                  }`}
                >
                  All ({rawProducts.length})
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      selectedCategory === cat
                        ? 'bg-black text-white shadow-xs'
                        : 'bg-white text-neutral-700 border border-neutral-200 hover:border-black'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Selector */}
              <div className="flex items-center space-x-2 text-xs font-medium text-neutral-600">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500" />
                <span>Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-black"
                >
                  <option value="featured">Featured / Trending</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Customer Rating</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100 space-y-4">
            <p className="text-base font-bold text-neutral-900">
              No products found in this selection.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn-pill-dark text-xs py-2.5 px-6"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product._id || product.id} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
