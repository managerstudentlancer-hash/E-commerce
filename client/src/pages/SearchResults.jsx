import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [results, setResults] = useState({ products: [], categories: [], suggestions: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearch = async () => {
      setLoading(true);
      try {
        const res = await api.search(query);
        if (res.success) {
          setResults(res);
        }
      } catch (err) {
        console.error('Search query error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSearch();
  }, [query]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        <p className="text-xs font-semibold text-neutral-500">Searching catalog for "{query}"...</p>
      </div>
    );
  }

  const products = results.products || [];
  const categories = results.categories || [];

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="pb-8 border-b border-neutral-100">
          <nav className="text-xs text-neutral-500 mb-2 flex items-center space-x-2">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-black font-semibold">Search Results</span>
          </nav>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight">
            Search Results for "{query}"
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Found {products.length} matching products and {categories.length} matching categories
          </p>
        </div>

        {/* Matching Categories */}
        {categories.length > 0 && (
          <div className="py-6 border-b border-neutral-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-700 mb-3">
              Matching Departments
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  to={`/category/${cat.slug}`}
                  className="px-4 py-2 rounded-full border border-neutral-200 hover:border-black text-xs font-semibold text-neutral-800 transition-colors"
                >
                  {cat.name} &rarr;
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Product Results */}
        <div className="pt-8">
          {products.length === 0 ? (
            <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4">
              <Search className="w-10 h-10 text-neutral-400 mx-auto" />
              <p className="text-base font-bold text-neutral-900">
                No matching items found for "{query}"
              </p>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Try checking the spelling or exploring our curated departments.
              </p>
              <Link to="/shop" className="btn-pill-dark text-xs py-2.5 px-6">
                Explore All Products
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {products.map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;
