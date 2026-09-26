import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { SlidersHorizontal, X, Loader2 } from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

const categoriesList = [
  'All',
  'Women Wear',
  'Men Wear',
  'Kids Wear',
  'Shoes',
  'Beauty',
  'Jewellery',
  'Bags',
  'Hats',
  'Vision Care',
  'Pets Care',
  'Toys',
  'Health & Fitness',
  'Electronics',
  'Home & Living',
];

const sortOptions = [
  { label: 'Featured / Newest', value: 'newest' },
  { label: 'Bestsellers', value: 'bestseller' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Highest Rated', value: 'rating' },
];

const Shop = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const PAGE_LIMIT = 12;

  // Filters State
  const selectedCategory = searchParams.get('category') || 'All';
  const selectedSort = searchParams.get('sort') || 'newest';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const inStockOnly = searchParams.get('inStock') === 'true';

  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [searchParams]);

  const fetchProducts = async (pageNum = 1, isAppend = false) => {
    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = {
        sort: selectedSort,
        limit: PAGE_LIMIT,
        page: pageNum,
      };

      if (selectedCategory && selectedCategory !== 'All') {
        params.category = selectedCategory;
      }
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (searchParams.get('search')) params.search = searchParams.get('search');

      const res = await api.products.getAll(params);
      if (res.success) {
        let list = res.products || [];
        if (inStockOnly) {
          list = list.filter((p) => p.stock > 0);
        }

        if (isAppend) {
          setProducts((prev) => [...prev, ...list]);
        } else {
          setProducts(list);
        }
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error('Failed to load shop products:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  };

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return (
    <div className="bg-white min-h-screen pb-20">
      {/* Header & Breadcrumbs */}
      <div className="border-b border-neutral-100 bg-neutral-50/70 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="text-xs text-neutral-500 mb-2 flex items-center space-x-2">
            <Link to="/" className="hover:text-black">Home</Link>
            <span>/</span>
            <span className="text-black font-semibold">Shop All</span>
            {selectedCategory !== 'All' && (
              <>
                <span>/</span>
                <span className="text-[#C4301C] font-semibold">{selectedCategory}</span>
              </>
            )}
          </nav>

          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-900 uppercase">
            {selectedCategory === 'All' ? 'All Products' : `${selectedCategory} Collection`}
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 mt-1">
            Showing {totalCount} luxury essentials and acoustic hardware
          </p>

          {/* Quick Category Filter Pills */}
          <div className="flex items-center space-x-2 overflow-x-auto pt-6 pb-2 no-scrollbar">
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => updateParam('category', cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                    isSelected
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white border border-neutral-200 text-neutral-700 hover:border-black'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Controls Bar */}
        <div className="flex items-center justify-between pb-6 border-b border-neutral-100 gap-4 flex-wrap">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2 rounded-full border border-neutral-200 text-xs font-semibold"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Active Filter Tags */}
          <div className="hidden lg:flex items-center space-x-2 flex-wrap">
            {(selectedCategory !== 'All' || minPrice || maxPrice || inStockOnly) && (
              <>
                <span className="text-xs text-neutral-600 font-medium">Active filters:</span>
                {selectedCategory !== 'All' && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold">
                    <span>{selectedCategory}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-black"
                      onClick={() => updateParam('category', 'All')}
                    />
                  </span>
                )}
                {minPrice && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold">
                    <span>Min ₹{minPrice}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-black"
                      onClick={() => updateParam('minPrice', '')}
                    />
                  </span>
                )}
                {maxPrice && (
                  <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-neutral-100 text-xs font-semibold">
                    <span>Max ₹{maxPrice}</span>
                    <X
                      className="w-3 h-3 cursor-pointer hover:text-black"
                      onClick={() => updateParam('maxPrice', '')}
                    />
                  </span>
                )}
                <button
                  onClick={clearAllFilters}
                  className="text-xs text-[#C4301C] font-semibold hover:underline ml-2"
                >
                  Reset all
                </button>
              </>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-xs text-neutral-500 hidden sm:inline">Sort by:</span>
            <select
              value={selectedSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="px-4 py-2 rounded-full border border-neutral-200 text-xs font-semibold bg-white focus:outline-none focus:border-black cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Layout Grid: Sidebar Filters (Desktop) + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block space-y-6">
            {/* Price Range */}
            <div className="border-b border-neutral-100 pb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-4">
                Price Range (₹)
              </h3>
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => updateParam('minPrice', e.target.value)}
                  className="w-24 px-3 py-2 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-black"
                />
                <span className="text-neutral-400">—</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => updateParam('maxPrice', e.target.value)}
                  className="w-24 px-3 py-2 rounded-lg border border-neutral-200 text-xs focus:outline-none focus:border-black"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="border-b border-neutral-100 pb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                Availability
              </h3>
              <label className="flex items-center space-x-2 text-xs font-medium text-neutral-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                  className="rounded border-neutral-300 text-black focus:ring-black w-4 h-4"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Guarantees Box */}
            <div className="p-4 rounded-xl bg-neutral-50 border border-neutral-100 space-y-2 text-xs text-neutral-600">
              <p className="font-bold text-neutral-900">VEXIVO Guarantee</p>
              <p>• Pan-India Express Delivery across 28,000+ PIN codes.</p>
              <p>• 30-Day Hassle-Free Returns with prepaid label.</p>
            </div>
          </div>

          {/* Product Grid */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
                <p className="text-xs font-semibold text-neutral-500">Loading catalog...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20 px-4 bg-neutral-50 rounded-2xl border border-neutral-100 space-y-4">
                <p className="text-base font-bold text-neutral-900">No matching products found</p>
                <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                  Try clearing your active filters or searching for alternative department names.
                </p>
                <button
                  onClick={clearAllFilters}
                  className="btn-pill-dark text-xs py-2.5 px-6"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                  {products.map((product, idx) => (
                    <ProductCard key={product._id || product.id} product={product} index={idx} />
                  ))}
                </div>

                {/* Pagination / Load More Section */}
                <div className="mt-12 pt-6 border-t border-neutral-100 flex flex-col items-center justify-center text-center space-y-3">
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
      </div>

      {/* Mobile Filter Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative ml-auto w-full max-w-xs bg-white h-full shadow-2xl p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
                <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
                  Filters
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-neutral-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Price Filter */}
              <div className="py-6 border-b border-neutral-100 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-900">
                  Price Range (₹)
                </h4>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParam('minPrice', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs"
                  />
                  <span>—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParam('maxPrice', e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 text-xs"
                  />
                </div>
              </div>

              {/* Mobile Stock */}
              <div className="py-6 border-b border-neutral-100">
                <label className="flex items-center space-x-2 text-xs font-semibold text-neutral-800">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => updateParam('inStock', e.target.checked ? 'true' : '')}
                    className="rounded border-neutral-300 text-black w-4 h-4"
                  />
                  <span>In Stock Only</span>
                </label>
              </div>
            </div>

            <div className="pt-4 flex flex-col gap-2">
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="btn-pill-dark w-full py-3 text-xs"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  clearAllFilters();
                  setIsMobileFilterOpen(false);
                }}
                className="btn-pill-light w-full py-2.5 text-xs"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;
