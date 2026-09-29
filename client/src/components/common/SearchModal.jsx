import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Search, X, TrendingUp, ArrowRight, Loader2 } from 'lucide-react';
import api from '../../services/api';
import { getCategoryFallback, resolveImageUrl } from '../../utils/imageHelper';

const SearchModal = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState({ products: [], categories: [], suggestions: [] });
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('vexivo_recent_searches') || '[]');
    } catch {
      return [];
    }
  });

  const navigate = useNavigate();
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      // Load initial suggestions
      api.search('')
        .then((res) => {
          if (res.success) setResults(res);
        })
        .catch(() => {});
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Live search debounced
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await api.search(query);
        if (res.success) {
          setResults(res);
        }
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    // Save to recent searches
    const updated = [query.trim(), ...recentSearches.filter((s) => s.toLowerCase() !== query.trim().toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('vexivo_recent_searches', JSON.stringify(updated));

    onClose();
    navigate(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  const handleSelectTerm = (term) => {
    setQuery(term);
    const updated = [term, ...recentSearches.filter((s) => s.toLowerCase() !== term.toLowerCase())].slice(0, 6);
    setRecentSearches(updated);
    localStorage.setItem('vexivo_recent_searches', JSON.stringify(updated));
    onClose();
    navigate(`/search?q=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto animate-fade-in">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />

      {/* Modal Content */}
      <div className="relative min-h-screen sm:min-h-0 sm:max-w-2xl sm:mx-auto sm:my-16 bg-white sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col z-10">
        {/* Search Header Bar */}
        <form onSubmit={handleSearchSubmit} className="p-4 sm:p-5 border-b border-neutral-100 flex items-center space-x-3">
          <Search className="w-5 h-5 text-neutral-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products, categories, audio, cashmere..."
            className="flex-1 text-base sm:text-lg outline-none bg-transparent placeholder-neutral-400 font-medium text-neutral-900"
          />
          {loading && <Loader2 className="w-5 h-5 text-neutral-400 animate-spin" />}
          {query && !loading && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="text-neutral-400 hover:text-black p-1"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-bold uppercase tracking-wider text-neutral-500 hover:text-black px-2 py-1"
          >
            Close
          </button>
        </form>

        {/* Results / Suggestions Stage */}
        <div className="p-5 overflow-y-auto max-h-[70vh] space-y-6">
          {/* Recent Searches */}
          {!query && recentSearches.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
                  Recent Searches
                </span>
                <button
                  onClick={() => {
                    setRecentSearches([]);
                    localStorage.removeItem('vexivo_recent_searches');
                  }}
                  className="text-xs text-neutral-600 hover:text-black"
                >
                  Clear
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {recentSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleSelectTerm(term)}
                    className="px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-700 text-xs font-medium hover:bg-neutral-200 transition-colors"
                  >
                    {term}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Autocomplete suggestions */}
          {results.suggestions && results.suggestions.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 flex items-center gap-1.5 mb-2.5">
                <TrendingUp className="w-3.5 h-3.5 text-[#C4301C]" />
                <span>Trending Searches</span>
              </span>
              <div className="flex flex-wrap gap-2">
                {results.suggestions.map((sug) => (
                  <button
                    key={sug}
                    onClick={() => handleSelectTerm(sug)}
                    className="px-3.5 py-1.5 rounded-full bg-neutral-100 text-neutral-800 text-xs font-medium hover:bg-black hover:text-white transition-all"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Category Matches */}
          {results.categories && results.categories.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block mb-2.5">
                Categories
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {results.categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/category/${cat.slug}`}
                    onClick={onClose}
                    className="p-2.5 rounded-xl border border-neutral-100 hover:border-black transition-colors text-center text-xs font-semibold text-neutral-800 block"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Product Results */}
          {results.products && results.products.length > 0 && (
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 block mb-3">
                Matching Products ({results.products.length})
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {results.products.map((product) => (
                  <Link
                    key={product.slug}
                    to={`/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center space-x-3 p-2.5 rounded-xl hover:bg-neutral-50 transition-colors border border-transparent hover:border-neutral-200"
                  >
                    <img
                      src={resolveImageUrl(product.thumbnail || product.images?.[0] || product.image, product.category, product.categorySlug) || getCategoryFallback(product.category, product.categorySlug)}
                      alt={product.name}
                      onError={(e) => {
                        e.currentTarget.src = getCategoryFallback(product.category, product.categorySlug);
                      }}
                      className="w-14 h-16 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-neutral-900 truncate">
                        {product.name}
                      </p>
                      <p className="text-xs text-neutral-500">{product.category}</p>
                      <p className="text-xs font-bold text-neutral-900 mt-1">
                        ₹{product.price.toFixed(2)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* No results state */}
          {query && !loading && results.products?.length === 0 && results.categories?.length === 0 && (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-neutral-900">
                No matches found for "{query}"
              </p>
              <p className="text-xs text-neutral-500 mt-1">
                Try searching for 'Headphones', 'Cashmere', 'Leather', or 'Titanium'
              </p>
            </div>
          )}

          {query && (
            <div className="pt-2 text-center border-t border-neutral-100">
              <button
                type="button"
                onClick={handleSearchSubmit}
                className="btn-pill-dark text-xs py-2.5 px-6 inline-flex items-center space-x-2"
              >
                <span>View all results for "{query}"</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
