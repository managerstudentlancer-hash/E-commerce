import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2, Sparkles, ArrowUpDown, AlertCircle, ShoppingBag, RefreshCw } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const collectionMeta = {
  'women-dresses': {
    name: "Women's Dresses",
    gender: 'women',
    description: 'Evening gowns, tailored dresses, floral maxis, and contemporary silhouettes.',
  },
  'womens-dresses': {
    name: "Women's Dresses",
    gender: 'women',
    description: 'Evening gowns, tailored dresses, floral maxis, and contemporary silhouettes.',
  },
  'women-shoes': {
    name: "Women's Shoes & Heels",
    gender: 'women',
    description: 'Designer stilettos, casual sneakers, pumps, and everyday comfort footwear.',
  },
  'womens-shoes': {
    name: "Women's Shoes & Heels",
    gender: 'women',
    description: 'Designer stilettos, casual sneakers, pumps, and everyday comfort footwear.',
  },
  'women-bags': {
    name: "Women's Bags & Luggage",
    gender: 'women',
    description: 'Luxury shoulder bags, leather totes, clutches, and travel luggage.',
  },
  'womens-bags': {
    name: "Women's Bags & Luggage",
    gender: 'women',
    description: 'Luxury shoulder bags, leather totes, clutches, and travel luggage.',
  },
  'women-jewellery': {
    name: "Women's Fine Jewellery",
    gender: 'women',
    description: 'Artisanal earrings, statement pendants, and elegant luxury accessories.',
  },
  'womens-jewellery': {
    name: "Women's Fine Jewellery",
    gender: 'women',
    description: 'Artisanal earrings, statement pendants, and elegant luxury accessories.',
  },
  'women-watches': {
    name: "Women's Luxury Watches",
    gender: 'women',
    description: 'Masterfully crafted timepieces and timeless luxury chronographs.',
  },
  'womens-watches': {
    name: "Women's Luxury Watches",
    gender: 'women',
    description: 'Masterfully crafted timepieces and timeless luxury chronographs.',
  },
  'women-tops': {
    name: "Women's Tops & Shirts",
    gender: 'women',
    description: 'Silk blouses, casual tees, tailored button-downs, and elegant tops.',
  },
  tops: {
    name: "Women's Tops & Shirts",
    gender: 'women',
    description: 'Silk blouses, casual tees, tailored button-downs, and elegant tops.',
  },
  'men-shirts': {
    name: "Men's Shirts",
    gender: 'men',
    description: 'Tailored oxfords, casual checks, pure linen button-downs, and overshirts.',
  },
  'mens-shirts': {
    name: "Men's Shirts",
    gender: 'men',
    description: 'Tailored oxfords, casual checks, pure linen button-downs, and overshirts.',
  },
  'men-shoes': {
    name: "Men's Shoes",
    gender: 'men',
    description: 'Sports trainers, off-white street sneakers, and formal leather footwear.',
  },
  'mens-shoes': {
    name: "Men's Shoes",
    gender: 'men',
    description: 'Sports trainers, off-white street sneakers, and formal leather footwear.',
  },
  'men-watches': {
    name: "Men's Watches",
    gender: 'men',
    description: 'Automatic timepieces, dive watches, and precision chronographs.',
  },
  'mens-watches': {
    name: "Men's Watches",
    gender: 'men',
    description: 'Automatic timepieces, dive watches, and precision chronographs.',
  },
};

const CollectionPage = () => {
  const { slug } = useParams();
  const [collection, setCollection] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const fetchCollection = async () => {
    setLoading(true);
    setError(null);
    try {
      const cleanSlug = (slug || '').toLowerCase().trim();

      // 1. Try fetching directly by collectionSlug or category from products endpoint
      let prodRes = await api.products.getAll({
        collection: cleanSlug,
        limit: 100,
      });

      if (!prodRes?.products?.length) {
        prodRes = await api.products.getAll({
          category: cleanSlug,
          limit: 100,
        });
      }

      if (prodRes && prodRes.success && Array.isArray(prodRes.products) && prodRes.products.length > 0) {
        const meta = collectionMeta[cleanSlug];
        const formattedName = meta?.name || cleanSlug
          .split('-')
          .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');

        setCollection({
          name: formattedName.includes('Collection') ? formattedName : `${formattedName} Collection`,
          description: meta?.description || 'Curated luxury styles crafted to highest standards.',
          products: prodRes.products,
        });
      } else {
        // 2. Try collections endpoint
        const colRes = await api.collections.getBySlug(cleanSlug).catch(() => null);

        if (
          colRes &&
          colRes.success &&
          colRes.collection &&
          Array.isArray(colRes.collection.products) &&
          colRes.collection.products.length > 0
        ) {
          setCollection(colRes.collection);
        } else {
          // 3. Fallback to general catalog search
          const allRes = await api.products.getAll({ limit: 100 });
          if (allRes && allRes.success) {
            const all = allRes.products || [];
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
                  p.category === cleanSlug ||
                  (p.tags && p.tags.some((t) => t.toLowerCase() === cleanSlug))
              );
            }

            const meta = collectionMeta[cleanSlug];
            const formattedName = meta?.name || cleanSlug
              .split('-')
              .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
              .join(' ');

            setCollection({
              name: formattedName.includes('Collection') ? formattedName : `${formattedName} Collection`,
              description: meta?.description || 'Handpicked selection curated for timeless luxury and everyday lifestyle.',
              products: matched,
            });
          }
        }
      }
    } catch (err) {
      console.error('Failed to load collection:', err);
      setError(err.message || 'Unable to connect to product catalog.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  if (error) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center space-y-3 px-4 text-center">
        <AlertCircle className="w-10 h-10 text-red-500" />
        <p className="text-base font-bold text-neutral-800">Failed to load collection</p>
        <p className="text-xs text-neutral-500 max-w-sm">{error}</p>
        <button
          onClick={fetchCollection}
          className="btn-pill-dark text-xs py-2 px-5 inline-flex items-center space-x-1.5 cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Try Again</span>
        </button>
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
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
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
                  className="bg-white border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:border-black cursor-pointer"
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

      {/* Grid Stage */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-3xl border border-neutral-100 space-y-4">
            <ShoppingBag className="w-10 h-10 text-neutral-300 mx-auto" />
            <p className="text-base font-bold text-neutral-900">
              No products found in this collection.
            </p>
            <button
              onClick={() => setSelectedCategory('all')}
              className="btn-pill-dark text-xs py-2.5 px-6 cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {filteredProducts.map((product, idx) => (
              <ProductCard key={product._id || product.id || idx} product={product} index={idx} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
