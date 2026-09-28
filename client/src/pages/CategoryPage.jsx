import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Loader2,
  Filter,
  X,
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  ChevronLeft,
  Search,
  Star,
  Check,
  RotateCcw,
  Sparkles,
  ArrowRight,
  LayoutGrid,
  Grid3X3,
} from 'lucide-react';
import api from '../services/api';
import ProductCard from '../components/common/ProductCard';

// Category-specific Top Brands mapping (Exact match to Flipkart & top retailers)
const CATEGORY_BRAND_MAP = {
  bags: [
    'SAFARI',
    'AMERICAN TOURISTER',
    'SKYBAGS',
    'ARISTOCRAT',
    'VIP',
    'Kamiliant by American Tourister',
    'WILDHORN',
    'LAVIE',
    'CAPRESE',
    'SAMSONITE',
    'TOMMY HILFIGER',
    'VEXIVO Bags',
  ],
  shoes: [
    'NIKE',
    'ADIDAS',
    'PUMA',
    'ZARA',
    'CAMPUS',
    'SPARX',
    'ASICS',
    'REEBOK',
    'CLARKS',
    'WOODLAND',
    'RED TAPE',
    'VEXIVO Shoes',
  ],
  'women-wear': [
    'ZARA',
    'H&M',
    'MANGO',
    'VERO MODA',
    'ONLY',
    'BIBA',
    'FOREVER 21',
    'LEVIS',
    'ALLEN SOLLY',
    'AND',
    'W FOR WOMAN',
    'VEXIVO Women',
  ],
  'men-wear': [
    'ZARA',
    'LEVIS',
    'PETER ENGLAND',
    'VAN HEUSEN',
    'LOUIS PHILIPPE',
    'RAYMOND',
    'JACK & JONES',
    'ARROW',
    'U.S. POLO ASSN.',
    'TOMMY HILFIGER',
    'VEXIVO Men',
  ],
  jewellery: [
    'FOSSIL',
    'CASIO',
    'TITAN',
    'FASTRACK',
    'TISSOT',
    'TOMMY HILFIGER',
    'TIMEX',
    'DANIEL WELLINGTON',
    'MICHAEL KORS',
    'ARMANI EXCHANGE',
    'VEXIVO Jewellery',
  ],
  electronics: [
    'SONY',
    'APPLE',
    'BOAT',
    'JBL',
    'BOSE',
    'SENNHEISER',
    'NOISE',
    'ONEPLUS',
    'SAMSUNG',
    'MARSHALL',
    'VEXIVO Audio',
  ],
  beauty: [
    'LOREAL',
    'MAYBELLINE',
    'THE BODY SHOP',
    'M.A.C',
    'NIVEA',
    'LAKME',
    'CETAPHIL',
    'KAMA AYURVEDA',
    'PLUM',
    'FOREST ESSENTIALS',
    'VEXIVO Beauty',
  ],
  'vision-care': [
    'RAY-BAN',
    'OAKLEY',
    'FASTRACK',
    'VINCENT CHASE',
    'JOHN JACOBS',
    'GUCCI',
    'PRADA',
    'POLAROID',
    'VEXIVO Vision',
  ],
  'kids-wear': [
    'MOTHERCARE',
    'GINI & JONY',
    'ZARA KIDS',
    'H&M KIDS',
    'FIRSTCRY',
    'MAX',
    'HOPSCOTCH',
    'VEXIVO Kids',
  ],
  'home-living': [
    'IKEA',
    'HOME CENTRE',
    'BOMBAY DYEING',
    'SPACES',
    'D-DECOR',
    'FABINDIA',
    'WAKEFIT',
    'VEXIVO Living',
  ],
  'health-fitness': [
    'DECATHLON',
    'NIKE',
    'ADIDAS',
    'UNDER ARMOUR',
    'COSCO',
    'FITKIT',
    'BOLD FIT',
    'VEXIVO Health',
  ],
  toys: [
    'LEGO',
    'HASBRO',
    'MATTEL',
    'NERF',
    'HOT WHEELS',
    'BARBIE',
    'FUNSKOOL',
    'SIMBA',
    'VEXIVO Toys',
  ],
};

// Hierarchy breadcrumb helper for Flipkart-style categories tree
const CATEGORY_HIERARCHY = {
  bags: { parent: 'Bags, Wallets & Belts', mid: 'Luggage & Travel', current: 'Suitcases & Bags' },
  shoes: { parent: 'Footwear', mid: "Men's & Women's Footwear", current: 'Shoes & Sneakers' },
  'women-wear': { parent: 'Clothing and Accessories', mid: "Women's Western & Ethnic", current: 'Apparel & Dresses' },
  'men-wear': { parent: 'Clothing and Accessories', mid: "Men's Clothing", current: 'Shirts & Trousers' },
  jewellery: { parent: 'Watches & Accessories', mid: 'Wrist Watches', current: 'Luxury & Chrono' },
  electronics: { parent: 'Electronics', mid: 'Audio & Personal Entertainment', current: 'Headphones & Audio' },
  beauty: { parent: 'Beauty, Personal Care', mid: 'Skin & Body Care', current: 'Luxury Skincare' },
  'vision-care': { parent: 'Eyewear & Accessories', mid: 'Sunglasses & Frames', current: 'Polarized Eyewear' },
  'kids-wear': { parent: 'Baby & Kids', mid: "Boys & Girls Clothing", current: 'Kids Apparel' },
  'home-living': { parent: 'Home & Kitchen', mid: 'Home Furnishing', current: 'Living & Decor' },
  'health-fitness': { parent: 'Sports, Books & More', mid: 'Fitness Accessories', current: 'Gym & Cardio' },
  toys: { parent: 'Toys & Games', mid: 'Action Figures & Board Games', current: 'Premium Toys' },
};

const PRICE_PRESETS = [
  { id: 'all', label: 'All Prices' },
  { id: 'under-50', label: 'Under $50', min: 0, max: 50 },
  { id: '50-100', label: '$50 - $100', min: 50, max: 100 },
  { id: '100-200', label: '$100 - $200', min: 100, max: 200 },
  { id: '200-plus', label: '$200 & Above', min: 200, max: 99999 },
];

const RATING_FILTERS = [
  { value: 4, label: '4★ & above' },
  { value: 3, label: '3★ & above' },
  { value: 2, label: '2★ & above' },
];

const DISCOUNT_FILTERS = [
  { value: 50, label: '50% or more' },
  { value: 30, label: '30% or more' },
  { value: 20, label: '20% or more' },
  { value: 10, label: '10% or more' },
];

const SORT_OPTIONS = [
  { id: 'popular', label: 'Popularity' },
  { id: 'price-asc', label: 'Price -- Low to High' },
  { id: 'price-desc', label: 'Price -- High to Low' },
  { id: 'newest', label: 'Newest First' },
  { id: 'rating', label: 'Customer Rating' },
];

const LIMIT_OPTIONS = [12, 24, 36, 48];

const CategoryPage = () => {
  const { slug } = useParams();

  // Data states
  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [availableSubcategories, setAvailableSubcategories] = useState([]);

  // Active filter states
  const [selectedBrands, setSelectedBrands] = useState([]); // Array of selected brands
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [selectedPricePreset, setSelectedPricePreset] = useState('all');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);
  const [selectedDiscount, setSelectedDiscount] = useState(null);
  const [sortBy, setSortBy] = useState('popular');
  const [productLimit, setProductLimit] = useState(12);
  const [inStockOnly, setInStockOnly] = useState(false);

  // Sidebar accordions & brand search
  const [isBrandExpanded, setIsBrandExpanded] = useState(true);
  const [isPriceExpanded, setIsPriceExpanded] = useState(true);
  const [isRatingExpanded, setIsRatingExpanded] = useState(true);
  const [isDiscountExpanded, setIsDiscountExpanded] = useState(true);
  const [brandSearch, setBrandSearch] = useState('');
  const [showAllBrands, setShowAllBrands] = useState(false);

  // Mobile drawer state
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Reset when slug changes
  useEffect(() => {
    setPage(1);
    setSelectedBrands([]);
    setSelectedSubcategory('all');
    setSelectedPricePreset('all');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSelectedRating(null);
    setSelectedDiscount(null);
    setInStockOnly(false);
    setBrandSearch('');
    setShowAllBrands(false);
  }, [slug]);

  // Fetch when filters or page change
  useEffect(() => {
    setPage(1);
    fetchProducts(1, false);
  }, [
    slug,
    selectedBrands,
    selectedSubcategory,
    selectedPricePreset,
    minPriceInput,
    maxPriceInput,
    selectedRating,
    selectedDiscount,
    sortBy,
    productLimit,
    inStockOnly,
  ]);

  const fetchProducts = async (pageNum = 1, isAppend = false) => {
    if (isAppend) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }

    try {
      const params = {
        page: pageNum,
        limit: productLimit,
        sort: sortBy,
      };

      // Multiple brands filter
      if (selectedBrands.length > 0) {
        params.brand = selectedBrands.join(',');
      }

      // Subcategory
      if (selectedSubcategory && selectedSubcategory !== 'all') {
        params.subcategory = selectedSubcategory;
      }

      // Price
      if (minPriceInput || maxPriceInput) {
        if (minPriceInput) params.minPrice = minPriceInput;
        if (maxPriceInput) params.maxPrice = maxPriceInput;
      } else if (selectedPricePreset !== 'all') {
        const pObj = PRICE_PRESETS.find((p) => p.id === selectedPricePreset);
        if (pObj) {
          if (pObj.min !== undefined) params.minPrice = pObj.min;
          if (pObj.max !== undefined) params.maxPrice = pObj.max;
        }
      }

      // Ratings
      if (selectedRating) {
        params.rating = selectedRating;
      }

      // Discount
      if (selectedDiscount) {
        params.minDiscount = selectedDiscount;
      }

      // In stock
      if (inStockOnly) {
        params.inStock = 'true';
      }

      const res = await api.categories.getBySlug(slug, params);
      if (res.success) {
        setCategory(res.category);
        if (res.availableBrands) setAvailableBrands(res.availableBrands);
        if (res.availableSubcategories) setAvailableSubcategories(res.availableSubcategories);

        if (isAppend) {
          setProducts((prev) => [...prev, ...(res.products || [])]);
        } else {
          setProducts(res.products || []);
        }
        setTotalCount(res.total ?? (res.products?.length || 0));
      }
    } catch (err) {
      console.error('Failed to load category products:', err);
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

  // Toggle single brand selection checkbox
  const handleToggleBrand = (brandName) => {
    setSelectedBrands((prev) => {
      const exists = prev.some((b) => b.toLowerCase() === brandName.toLowerCase());
      if (exists) {
        return prev.filter((b) => b.toLowerCase() !== brandName.toLowerCase());
      } else {
        return [...prev, brandName];
      }
    });
  };

  // Reset all active filters
  const handleClearAll = () => {
    setSelectedBrands([]);
    setSelectedSubcategory('all');
    setSelectedPricePreset('all');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSelectedRating(null);
    setSelectedDiscount(null);
    setInStockOnly(false);
    setSortBy('popular');
  };

  // Compile combined brands list for this category
  const categoryBrandsList = useMemo(() => {
    const preset = CATEGORY_BRAND_MAP[slug] || [];
    const dynamic = availableBrands.map((b) => b.trim());
    return [...new Set([...preset, ...dynamic])];
  }, [slug, availableBrands]);

  // Filtered brands based on user search input
  const filteredBrandsList = useMemo(() => {
    if (!brandSearch.trim()) return categoryBrandsList;
    return categoryBrandsList.filter((b) =>
      b.toLowerCase().includes(brandSearch.toLowerCase().trim())
    );
  }, [categoryBrandsList, brandSearch]);

  const displayedBrands = showAllBrands
    ? filteredBrandsList
    : filteredBrandsList.slice(0, 6);

  const activeFilterCount =
    selectedBrands.length +
    (selectedSubcategory !== 'all' ? 1 : 0) +
    (selectedPricePreset !== 'all' || minPriceInput || maxPriceInput ? 1 : 0) +
    (selectedRating ? 1 : 0) +
    (selectedDiscount ? 1 : 0) +
    (inStockOnly ? 1 : 0);

  const hierarchy = CATEGORY_HIERARCHY[slug] || {
    parent: 'All Departments',
    mid: category?.name || 'Catalog',
    current: category?.name || 'Items',
  };

  return (
    <div className="bg-[#F1F3F6] min-h-screen py-4 sm:py-6 font-sans text-neutral-900 antialiased">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6">
        
        {/* Main 2-Column Flipkart Style Layout: Left Sidebar (Filters) + Right Content (Products) */}
        <div className="flex flex-col lg:flex-row items-start gap-3 sm:gap-4">
          
          {/* ======================================================== */}
          {/* LEFT SIDEBAR: FLIPKART STYLE FILTERS PANEL               */}
          {/* ======================================================== */}
          <aside className="hidden lg:block w-72 flex-shrink-0 bg-white rounded-xl shadow-xs border border-neutral-200/80 overflow-hidden sticky top-20">
            {/* 1. Header: Filters Title & Clear All */}
            <div className="p-4 border-b border-neutral-200/70 flex items-center justify-between">
              <h3 className="text-base font-black tracking-tight text-neutral-900">
                Filters
              </h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-blue-600 hover:text-blue-800 uppercase tracking-wider transition-colors"
                >
                  CLEAR ALL
                </button>
              )}
            </div>

            {/* 2. CATEGORIES TREE (Matching Screenshot Exactly) */}
            <div className="p-4 border-b border-neutral-200/70 text-xs">
              <span className="block text-[11px] font-black uppercase tracking-wider text-neutral-800 mb-2.5">
                CATEGORIES
              </span>
              <div className="space-y-1.5 pl-1">
                <Link
                  to="/shop"
                  className="flex items-center text-neutral-600 hover:text-blue-600 transition-colors"
                >
                  <ChevronLeft className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                  <span>{hierarchy.parent}</span>
                </Link>

                <div className="flex items-center text-neutral-600 pl-2">
                  <ChevronLeft className="w-3.5 h-3.5 mr-1 text-neutral-400" />
                  <span>{hierarchy.mid}</span>
                </div>

                <div className="font-extrabold text-neutral-950 pl-6 pt-0.5">
                  {hierarchy.current}
                </div>

                {/* Subcategories Pills if any */}
                {availableSubcategories.length > 0 && (
                  <div className="pl-6 pt-2 space-y-1">
                    {availableSubcategories.slice(0, 5).map((sub) => (
                      <button
                        key={sub}
                        onClick={() =>
                          setSelectedSubcategory(selectedSubcategory === sub ? 'all' : sub)
                        }
                        className={`block text-[11px] text-left transition-colors ${
                          selectedSubcategory.toLowerCase() === sub.toLowerCase()
                            ? 'font-bold text-blue-600'
                            : 'text-neutral-600 hover:text-neutral-950'
                        }`}
                      >
                        • {sub}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 3. BRAND SECTION (1:1 with Reference Screenshot) */}
            <div className="p-4 border-b border-neutral-200/70">
              <button
                type="button"
                onClick={() => setIsBrandExpanded(!isBrandExpanded)}
                className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 focus:outline-none"
              >
                <span>BRAND</span>
                {isBrandExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              {isBrandExpanded && (
                <div className="pt-3 space-y-2.5">
                  {/* Search Brand Input */}
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={brandSearch}
                      onChange={(e) => setBrandSearch(e.target.value)}
                      placeholder="Search Brand"
                      className="w-full pl-8 pr-3 py-1.5 rounded-lg border border-neutral-300 text-xs placeholder-neutral-400 focus:outline-none focus:border-blue-600"
                    />
                    {brandSearch && (
                      <X
                        className="w-3.5 h-3.5 text-neutral-400 absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer hover:text-black"
                        onClick={() => setBrandSearch('')}
                      />
                    )}
                  </div>

                  {/* Brand Checkboxes List */}
                  <div className="space-y-2 pt-1 max-h-56 overflow-y-auto pr-1">
                    {displayedBrands.length === 0 ? (
                      <p className="text-[11px] text-neutral-400 py-1">No brands found</p>
                    ) : (
                      displayedBrands.map((bName) => {
                        const isChecked = selectedBrands.some(
                          (b) => b.toLowerCase() === bName.toLowerCase()
                        );

                        return (
                          <label
                            key={bName}
                            className="flex items-center space-x-2.5 text-xs text-neutral-800 hover:text-black cursor-pointer select-none group"
                          >
                            <input
                              type="checkbox"
                              checked={isChecked}
                              onChange={() => handleToggleBrand(bName)}
                              className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
                            />
                            <span
                              className={`truncate uppercase ${
                                isChecked ? 'font-bold text-blue-600' : 'font-normal'
                              }`}
                            >
                              {bName}
                            </span>
                          </label>
                        );
                      })
                    )}
                  </div>

                  {/* MORE / LESS Brands Toggle */}
                  {filteredBrandsList.length > 6 && (
                    <button
                      type="button"
                      onClick={() => setShowAllBrands(!showAllBrands)}
                      className="text-xs font-bold text-blue-600 hover:text-blue-800 pt-1 block"
                    >
                      {showAllBrands
                        ? 'SHOW LESS'
                        : `${filteredBrandsList.length - 6} MORE`}
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* 4. PRICE FILTER SECTION */}
            <div className="p-4 border-b border-neutral-200/70">
              <button
                type="button"
                onClick={() => setIsPriceExpanded(!isPriceExpanded)}
                className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 focus:outline-none"
              >
                <span>PRICE</span>
                {isPriceExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              {isPriceExpanded && (
                <div className="pt-3 space-y-2 text-xs">
                  {PRICE_PRESETS.map((pr) => (
                    <label
                      key={pr.id}
                      className="flex items-center space-x-2.5 cursor-pointer text-neutral-700 hover:text-black"
                    >
                      <input
                        type="radio"
                        name="price-preset-desktop"
                        checked={selectedPricePreset === pr.id}
                        onChange={() => {
                          setSelectedPricePreset(pr.id);
                          setMinPriceInput('');
                          setMaxPriceInput('');
                        }}
                        className="text-blue-600 focus:ring-blue-500"
                      />
                      <span>{pr.label}</span>
                    </label>
                  ))}

                  {/* Custom Min / Max Inputs */}
                  <div className="pt-2 flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min $"
                      value={minPriceInput}
                      onChange={(e) => {
                        setMinPriceInput(e.target.value);
                        setSelectedPricePreset('all');
                      }}
                      className="w-20 px-2 py-1 border border-neutral-300 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                    <span className="text-neutral-400">to</span>
                    <input
                      type="number"
                      placeholder="Max $"
                      value={maxPriceInput}
                      onChange={(e) => {
                        setMaxPriceInput(e.target.value);
                        setSelectedPricePreset('all');
                      }}
                      className="w-20 px-2 py-1 border border-neutral-300 rounded text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* 5. CUSTOMER RATINGS SECTION */}
            <div className="p-4 border-b border-neutral-200/70">
              <button
                type="button"
                onClick={() => setIsRatingExpanded(!isRatingExpanded)}
                className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 focus:outline-none"
              >
                <span>CUSTOMER RATINGS</span>
                {isRatingExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              {isRatingExpanded && (
                <div className="pt-3 space-y-2 text-xs">
                  {RATING_FILTERS.map((rf) => (
                    <label
                      key={rf.value}
                      className="flex items-center space-x-2.5 cursor-pointer text-neutral-700 hover:text-black"
                    >
                      <input
                        type="checkbox"
                        checked={selectedRating === rf.value}
                        onChange={() =>
                          setSelectedRating(selectedRating === rf.value ? null : rf.value)
                        }
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
                      />
                      <span className="flex items-center space-x-1">
                        <span>{rf.value}</span>
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>&amp; above</span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 6. DISCOUNT SECTION */}
            <div className="p-4 border-b border-neutral-200/70">
              <button
                type="button"
                onClick={() => setIsDiscountExpanded(!isDiscountExpanded)}
                className="w-full flex items-center justify-between text-xs font-black uppercase tracking-wider text-neutral-900 focus:outline-none"
              >
                <span>DISCOUNT</span>
                {isDiscountExpanded ? (
                  <ChevronUp className="w-4 h-4 text-neutral-500" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-neutral-500" />
                )}
              </button>

              {isDiscountExpanded && (
                <div className="pt-3 space-y-2 text-xs">
                  {DISCOUNT_FILTERS.map((df) => (
                    <label
                      key={df.value}
                      className="flex items-center space-x-2.5 cursor-pointer text-neutral-700 hover:text-black"
                    >
                      <input
                        type="checkbox"
                        checked={selectedDiscount === df.value}
                        onChange={() =>
                          setSelectedDiscount(selectedDiscount === df.value ? null : df.value)
                        }
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
                      />
                      <span>{df.label}</span>
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* 7. AVAILABILITY SECTION */}
            <div className="p-4">
              <label className="flex items-center space-x-2.5 cursor-pointer text-xs font-medium text-neutral-800">
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300 cursor-pointer"
                />
                <span>Exclude Out of Stock</span>
              </label>
            </div>
          </aside>

          {/* ======================================================== */}
          {/* RIGHT SIDE: PRODUCTS AREA & CONTROLS                     */}
          {/* ======================================================== */}
          <main className="flex-1 w-full bg-white rounded-xl shadow-xs border border-neutral-200/80 p-4 sm:p-6 min-h-[70vh]">
            
            {/* Top Bar: Breadcrumb + Total Count */}
            <div className="border-b border-neutral-200 pb-3 mb-4">
              <nav className="text-[11px] text-neutral-500 flex items-center space-x-1.5 mb-1.5">
                <Link to="/" className="hover:text-blue-600">Home</Link>
                <span>&gt;</span>
                <Link to="/shop" className="hover:text-blue-600">{hierarchy.parent}</Link>
                <span>&gt;</span>
                <span className="text-neutral-900 font-bold">{category?.name}</span>
              </nav>

              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
                <h1 className="text-base sm:text-lg font-black text-neutral-900 flex items-baseline space-x-2">
                  <span>{category?.name}</span>
                  <span className="text-xs text-neutral-500 font-normal">
                    (Showing 1 – {products.length} of {totalCount} products)
                  </span>
                </h1>

                {/* Mobile Filter Button */}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center space-x-2 px-3.5 py-1.5 bg-neutral-100 rounded-lg text-xs font-bold text-neutral-800 self-start"
                >
                  <Filter className="w-3.5 h-3.5" />
                  <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
                </button>
              </div>
            </div>

            {/* Sort Tabs & Product Limit Controls Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-200 pb-3 mb-5">
              
              {/* Sort By Tabs (Flipkart Style) */}
              <div className="flex items-center space-x-1 sm:space-x-3 overflow-x-auto no-scrollbar text-xs">
                <span className="font-bold text-neutral-900 mr-1 flex-shrink-0">
                  Sort By
                </span>
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setSortBy(opt.id)}
                    className={`px-2.5 py-1 rounded transition-colors flex-shrink-0 ${
                      sortBy === opt.id
                        ? 'font-bold text-blue-600 border-b-2 border-blue-600'
                        : 'text-neutral-600 hover:text-black font-medium'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {/* Product Limit per page (Show: 12 | 24 | 36 | 48) */}
              <div className="flex items-center space-x-1.5 text-xs text-neutral-500 font-medium ml-auto">
                <span>Per Page:</span>
                <div className="flex items-center bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
                  {LIMIT_OPTIONS.map((lim) => (
                    <button
                      key={lim}
                      onClick={() => setProductLimit(lim)}
                      className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                        productLimit === lim
                          ? 'bg-neutral-950 text-white shadow-xs'
                          : 'text-neutral-600 hover:text-black'
                      }`}
                    >
                      {lim}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Active Filters Chips Bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-5 p-2.5 bg-neutral-50 rounded-xl border border-neutral-200">
                <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-wider">
                  Active Filters:
                </span>

                {selectedBrands.map((b) => (
                  <span
                    key={b}
                    className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 text-xs font-bold text-neutral-800 shadow-2xs"
                  >
                    <span>{b}</span>
                    <X
                      className="w-3.5 h-3.5 cursor-pointer text-neutral-400 hover:text-black"
                      onClick={() => handleToggleBrand(b)}
                    />
                  </span>
                ))}

                {selectedSubcategory !== 'all' && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 text-xs font-bold text-neutral-800 shadow-2xs">
                    <span>{selectedSubcategory}</span>
                    <X
                      className="w-3.5 h-3.5 cursor-pointer text-neutral-400 hover:text-black"
                      onClick={() => setSelectedSubcategory('all')}
                    />
                  </span>
                )}

                {(selectedPricePreset !== 'all' || minPriceInput || maxPriceInput) && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 text-xs font-bold text-neutral-800 shadow-2xs">
                    <span>
                      Price:{' '}
                      {minPriceInput || maxPriceInput
                        ? `$${minPriceInput || '0'} - $${maxPriceInput || '∞'}`
                        : PRICE_PRESETS.find((p) => p.id === selectedPricePreset)?.label}
                    </span>
                    <X
                      className="w-3.5 h-3.5 cursor-pointer text-neutral-400 hover:text-black"
                      onClick={() => {
                        setSelectedPricePreset('all');
                        setMinPriceInput('');
                        setMaxPriceInput('');
                      }}
                    />
                  </span>
                )}

                {selectedRating && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 text-xs font-bold text-neutral-800 shadow-2xs">
                    <span>{selectedRating}★ &amp; above</span>
                    <X
                      className="w-3.5 h-3.5 cursor-pointer text-neutral-400 hover:text-black"
                      onClick={() => setSelectedRating(null)}
                    />
                  </span>
                )}

                {selectedDiscount && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 text-xs font-bold text-neutral-800 shadow-2xs">
                    <span>{selectedDiscount}% or more</span>
                    <X
                      className="w-3.5 h-3.5 cursor-pointer text-neutral-400 hover:text-black"
                      onClick={() => setSelectedDiscount(null)}
                    />
                  </span>
                )}

                {inStockOnly && (
                  <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-white border border-neutral-300 text-xs font-bold text-emerald-800 shadow-2xs">
                    <span>In Stock Only</span>
                    <X
                      className="w-3.5 h-3.5 cursor-pointer text-neutral-400 hover:text-black"
                      onClick={() => setInStockOnly(false)}
                    />
                  </span>
                )}

                <button
                  onClick={handleClearAll}
                  className="text-xs font-bold text-blue-600 hover:underline ml-1"
                >
                  Clear All
                </button>
              </div>
            )}

            {/* Products Grid */}
            {loading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-3">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
                <p className="text-xs font-bold text-neutral-500">Loading {category?.name}...</p>
              </div>
            ) : products.length === 0 ? (
              <div className="py-20 text-center bg-[#FAF8F5] rounded-2xl border border-neutral-200/80 p-8 space-y-3">
                <p className="text-base font-black text-neutral-900">
                  No products found matching your current filters.
                </p>
                <p className="text-xs text-neutral-500">
                  Try removing some filters or changing brand selection.
                </p>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center space-x-2 px-6 py-2.5 rounded-xl bg-neutral-950 text-white font-bold text-xs uppercase tracking-wider hover:bg-neutral-800 transition-all shadow-md active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset All Filters</span>
                </button>
              </div>
            ) : (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {products.map((product, idx) => (
                    <ProductCard key={product._id || product.id} product={product} index={idx} />
                  ))}
                </div>

                {/* Pagination & Load More */}
                <div className="mt-12 pt-6 border-t border-neutral-200 flex flex-col items-center justify-center text-center space-y-3">
                  <p className="text-xs font-semibold text-neutral-500">
                    Showing <span className="font-bold text-neutral-900">{products.length}</span> of{' '}
                    <span className="font-bold text-neutral-900">{totalCount}</span> products
                  </p>

                  <div className="w-full max-w-xs bg-neutral-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-600 h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min(
                          100,
                          Math.round((products.length / Math.max(totalCount, 1)) * 100)
                        )}%`,
                      }}
                    />
                  </div>

                  {products.length < totalCount && (
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="mt-2 inline-flex items-center space-x-2 px-8 py-3 rounded-xl bg-neutral-950 hover:bg-neutral-800 text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-95 disabled:opacity-50"
                    >
                      {loadingMore ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span>Loading More...</span>
                        </>
                      ) : (
                        <>
                          <span>Load More Products</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* ======================================================== */}
      {/* MOBILE FILTER SLIDE-OUT DRAWER                           */}
      {/* ======================================================== */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-fade-in">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
          />

          <div className="relative w-full max-w-xs bg-white h-full shadow-2xl p-5 overflow-y-auto flex flex-col justify-between z-10 animate-slide-left">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-3 border-b border-neutral-200">
                <h3 className="text-base font-black text-neutral-900">Filters</h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-black"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Brands */}
              <div className="py-4 border-b border-neutral-200">
                <span className="block text-xs font-bold uppercase text-neutral-900 mb-2">
                  Brand Selection
                </span>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {categoryBrandsList.slice(0, 12).map((bName) => {
                    const isChecked = selectedBrands.some(
                      (b) => b.toLowerCase() === bName.toLowerCase()
                    );
                    return (
                      <label
                        key={bName}
                        className="flex items-center space-x-2 text-xs text-neutral-800"
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleToggleBrand(bName)}
                          className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-neutral-300"
                        />
                        <span className="truncate">{bName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Mobile Price */}
              <div className="py-4 border-b border-neutral-200">
                <span className="block text-xs font-bold uppercase text-neutral-900 mb-2">
                  Price
                </span>
                <div className="space-y-2 text-xs">
                  {PRICE_PRESETS.map((pr) => (
                    <label key={pr.id} className="flex items-center space-x-2 text-neutral-700">
                      <input
                        type="radio"
                        name="price-preset-mobile"
                        checked={selectedPricePreset === pr.id}
                        onChange={() => setSelectedPricePreset(pr.id)}
                        className="text-blue-600"
                      />
                      <span>{pr.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Mobile Ratings */}
              <div className="py-4 border-b border-neutral-200">
                <span className="block text-xs font-bold uppercase text-neutral-900 mb-2">
                  Customer Ratings
                </span>
                <div className="space-y-2 text-xs">
                  {RATING_FILTERS.map((rf) => (
                    <label key={rf.value} className="flex items-center space-x-2 text-neutral-700">
                      <input
                        type="checkbox"
                        checked={selectedRating === rf.value}
                        onChange={() =>
                          setSelectedRating(selectedRating === rf.value ? null : rf.value)
                        }
                        className="text-blue-600"
                      />
                      <span>{rf.value}★ &amp; above</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Mobile Bottom Apply */}
            <div className="pt-4 border-t border-neutral-200 flex items-center space-x-2">
              <button
                onClick={handleClearAll}
                className="flex-1 py-2.5 rounded-xl border border-neutral-300 text-xs font-bold text-neutral-900"
              >
                Reset All
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white shadow-md"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;
