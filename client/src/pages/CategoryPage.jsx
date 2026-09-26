import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const CategoryPage = () => {
  const { slug } = useParams();
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const PAGE_LIMIT = 12;

  useEffect(() => {
    setPage(1);
    fetchCategory(1, false);
  }, [slug]);

  const fetchCategory = async (pageNum = 1, isAppend = false) => {
    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const res = await api.categories.getBySlug(slug, { page: pageNum, limit: PAGE_LIMIT });
      if (res.success) {
        setCategory(res.category);
        if (isAppend) {
          setProducts((prev) => [...prev, ...(res.products || [])]);
        } else {
          setProducts(res.products || []);
        }
        setTotalCount(res.total ?? (res.products?.length || 0));
      }
    } catch (err) {
      console.error('Failed to load category:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCategory(nextPage, true);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        <p className="text-xs font-semibold text-neutral-500">Loading department...</p>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-4">
        <h2 className="text-xl font-bold text-neutral-900">Category not found</h2>
        <p className="text-xs text-neutral-500">The department you are looking for does not exist.</p>
        <Link to="/shop" className="btn-pill-dark text-xs py-2.5 px-6">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Category Hero / Header */}
      <div className="relative bg-neutral-900 text-white py-16 sm:py-20 overflow-hidden">
        {category.image && (
          <div className="absolute inset-0 opacity-40">
            <img
              src={category.image}
              alt={category.name}
              onError={(e) => {
                e.currentTarget.src = 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80';
              }}
              className="w-full h-full object-cover object-center"
            />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-neutral-400 mb-3 flex items-center space-x-2">
            <Link to="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link to="/shop" className="hover:text-white">Shop</Link>
            <span>/</span>
            <span className="text-white font-semibold">{category.name}</span>
          </nav>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight uppercase">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs sm:text-base text-neutral-200 mt-2 max-w-xl leading-relaxed">
              {category.description}
            </p>
          )}
          <p className="text-xs text-neutral-400 mt-3 font-semibold">
            {totalCount} Items
          </p>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
        {products.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100">
            <p className="text-base font-bold text-neutral-900">
              No products found in this category currently.
            </p>
            <Link to="/shop" className="btn-pill-dark text-xs mt-4">
              Explore All Products
            </Link>
          </div>
        ) : (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>

            {/* Pagination / Load More Section */}
            <div className="mt-14 pt-8 border-t border-neutral-100 flex flex-col items-center justify-center text-center space-y-3">
              <p className="text-xs font-semibold text-neutral-600">
                Showing <span className="font-bold text-neutral-900">{products.length}</span> of{' '}
                <span className="font-bold text-neutral-900">{totalCount}</span> products
              </p>
              <div className="w-full max-w-xs bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className="bg-neutral-900 h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.round((products.length / Math.max(totalCount, 1)) * 100))}%`,
                  }}
                />
              </div>
              {products.length < totalCount ? (
                <button
                  onClick={handleLoadMore}
                  disabled={loadingMore}
                  className="btn-pill-dark text-xs py-3 px-8 flex items-center space-x-2 mt-2 shadow-sm hover:shadow active:scale-95 transition-all"
                >
                  {loadingMore && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{loadingMore ? 'Loading More Products...' : 'Load More Products'}</span>
                </button>
              ) : (
                <p className="text-xs text-neutral-400 mt-2 font-medium">
                  All {totalCount} products loaded
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPage;
