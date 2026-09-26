import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Plus,
  Package,
  Edit2,
  Trash2,
  Upload,
  X,
  Check,
  Loader2,
  AlertCircle,
  Eye,
  Store,
  Layers,
  ArrowUp,
  ArrowDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const MARKETPLACE_CATEGORIES = [
  { name: 'Women Wear', slug: 'women-wear' },
  { name: 'Men Wear', slug: 'men-wear' },
  { name: 'Shoes', slug: 'shoes' },
  { name: 'Electronics', slug: 'electronics' },
  { name: 'Beauty', slug: 'beauty' },
  { name: 'Bags', slug: 'bags' },
  { name: 'Home & Living', slug: 'home-living' },
  { name: 'Jewellery', slug: 'jewellery' },
  { name: 'Kids Wear', slug: 'kids-wear' },
  { name: 'Hats', slug: 'hats' },
  { name: 'Vision Care', slug: 'vision-care' },
  { name: 'Pets Care', slug: 'pets-care' },
  { name: 'Toys', slug: 'toys' },
  { name: 'Health & Fitness', slug: 'health-fitness' },
];

const SellerDashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingField, setUploadingField] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compareAtPrice: '',
    category: 'Women Wear',
    categorySlug: 'women-wear',
    stock: 25,
    description: '',
    shortDescription: '',
    sellerName: '',
    sellerInfo: '',
    thumbnail: '',
    hoverImage: '',
    images: [],
    status: 'active',
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate('/login?redirect=/account/seller');
    } else if (!authLoading && isAuthenticated && !user?.isSeller) {
      navigate('/become-a-seller');
    }
  }, [authLoading, isAuthenticated, user, navigate]);

  useEffect(() => {
    if (isAuthenticated && user?.isSeller) {
      fetchMyProducts();
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    if (searchParams.get('action') === 'add') {
      handleOpenModal();
    }
  }, [searchParams]);

  const fetchMyProducts = async () => {
    setLoading(true);
    try {
      const res = await api.products.getMySellerProducts();
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error('Failed to load seller products:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prod = null) => {
    setFormError('');
    setNewGalleryUrl('');
    if (prod) {
      setEditingProduct(prod);
      const gallery = Array.isArray(prod.images) ? [...prod.images] : [];
      setFormData({
        name: prod.name || '',
        price: prod.price || '',
        compareAtPrice: prod.compareAtPrice || '',
        category: prod.category || 'Women Wear',
        categorySlug: prod.categorySlug || 'women-wear',
        stock: prod.stock !== undefined ? prod.stock : 25,
        description: prod.description || '',
        shortDescription: prod.shortDescription || '',
        sellerName: prod.sellerName || user?.name || '',
        sellerInfo: prod.sellerInfo || '',
        thumbnail: prod.thumbnail || gallery[0] || '',
        hoverImage: prod.hoverImage || gallery[1] || '',
        images: gallery,
        status: prod.status || 'active',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        price: '',
        compareAtPrice: '',
        category: 'Women Wear',
        categorySlug: 'women-wear',
        stock: 25,
        description: '',
        shortDescription: '',
        sellerName: user?.name ? `${user.name}'s Boutique` : 'Independent Seller',
        sellerInfo: 'Verified Independent Marketplace Creator',
        thumbnail: '',
        hoverImage: '',
        images: [],
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleCategoryChange = (e) => {
    const selectedName = e.target.value;
    const catObj = MARKETPLACE_CATEGORIES.find((c) => c.name === selectedName);
    setFormData((prev) => ({
      ...prev,
      category: selectedName,
      categorySlug: catObj ? catObj.slug : selectedName.toLowerCase().replace(/\s+/g, '-'),
    }));
  };

  // Image Upload handler
  const handleFileUpload = async (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingField(field);
    try {
      const fd = new FormData();
      fd.append('image', file);
      const res = await api.products.uploadImage(fd);
      if (res.success && res.url) {
        if (field === 'thumbnail') {
          setFormData((prev) => ({
            ...prev,
            thumbnail: res.url,
            images: prev.images.includes(res.url) ? prev.images : [res.url, ...prev.images],
          }));
        } else if (field === 'hoverImage') {
          setFormData((prev) => ({ ...prev, hoverImage: res.url }));
        } else if (field === 'gallery') {
          setFormData((prev) => ({ ...prev, images: [...prev.images, res.url] }));
        }
      }
    } catch (err) {
      alert(err.message || 'Image upload failed. You can also paste an image URL directly.');
    } finally {
      setUploadingField(null);
      e.target.value = '';
    }
  };

  const handleAddGalleryUrl = () => {
    if (!newGalleryUrl.trim()) return;
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, newGalleryUrl.trim()],
    }));
    setNewGalleryUrl('');
  };

  const handleRemoveGalleryImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      setFormError('Please fill in product title, price, and description');
      return;
    }

    if (!formData.thumbnail && (!formData.images || formData.images.length === 0)) {
      setFormError('Please provide at least one product image or upload a photo.');
      return;
    }

    setIsSaving(true);
    setFormError('');
    try {
      const imagesArray = Array.from(
        new Set(
          [formData.thumbnail, formData.hoverImage, ...(formData.images || [])].filter(Boolean)
        )
      );

      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice || 0),
        stock: Number(formData.stock || 0),
        thumbnail: formData.thumbnail || imagesArray[0] || '',
        hoverImage: formData.hoverImage || imagesArray[1] || '',
        images: imagesArray,
      };

      if (editingProduct) {
        await api.products.update(editingProduct._id, payload);
      } else {
        await api.products.create(payload);
      }

      setIsModalOpen(false);
      fetchMyProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to publish product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this listing from your store?')) return;
    try {
      await api.products.delete(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalStockUnits = products.reduce((acc, p) => acc + (p.stock || 0), 0);
  const totalCatalogValue = products.reduce((acc, p) => acc + ((p.price || 0) * (p.stock || 0)), 0);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/60 min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Navigation Breadcrumb */}
        <nav className="text-xs text-neutral-500 flex items-center space-x-2">
          <Link to="/" className="hover:text-black">Home</Link>
          <span>/</span>
          <Link to="/account" className="hover:text-black">My Account</Link>
          <span>/</span>
          <span className="text-neutral-900 font-bold">Seller Dashboard</span>
        </nav>

        {/* Dashboard Banner Header */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-neutral-200/80 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-50 text-[#0D8756] text-[11px] font-bold uppercase tracking-wider">
                <Store className="w-3.5 h-3.5" />
                <span>{user?.sellerProfile?.storeName || 'Verified Merchant Store'}</span>
              </span>
              {user?.sellerProfile?.gstin && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-mono font-bold">
                  GSTIN: {user.sellerProfile.gstin}
                </span>
              )}
              {user?.sellerProfile?.bankDetails?.bankName && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[10px] font-bold">
                  🏦 Payouts: {user.sellerProfile.bankDetails.bankName} (₹ INR)
                </span>
              )}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 tracking-tight">
              Seller Dashboard & Products
            </h1>
            <p className="text-xs text-neutral-500">
              Manage your catalog listings, photos, ₹ pricing, and inventory dispatched from {user?.sellerProfile?.pickupAddress?.city || 'India Hub'}.
            </p>
          </div>

          <button
            onClick={() => handleOpenModal()}
            className="btn-pill-dark text-xs py-3 px-6 flex items-center space-x-2 self-start sm:self-auto shadow-md hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>List New Product</span>
          </button>
        </div>

        {/* Seller Metrics Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Your Listings</p>
              <p className="text-2xl font-black text-neutral-900">{products.length} Products</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Available Stock</p>
              <p className="text-2xl font-black text-neutral-900">{totalStockUnits} Units</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs text-neutral-500 font-semibold uppercase tracking-wider">Inventory Value</p>
              <p className="text-2xl font-black text-neutral-900">₹{totalCatalogValue.toFixed(2)}</p>
            </div>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center space-x-3 shadow-subtle">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search your listings by name, category, or SKU..."
            className="flex-1 text-xs outline-none text-neutral-900 placeholder-neutral-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-xs text-neutral-400 hover:text-black font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-subtle">
          {loading ? (
            <div className="p-16 flex items-center justify-center">
              <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-20 px-4 space-y-4">
              <div className="w-16 h-16 rounded-full bg-neutral-100 text-neutral-400 flex items-center justify-center mx-auto">
                <Store className="w-8 h-8" />
              </div>
              <h3 className="text-base font-bold text-neutral-900">
                {searchTerm ? 'No products match your search' : 'You have not listed any products yet'}
              </h3>
              <p className="text-xs text-neutral-500 max-w-sm mx-auto">
                Start selling today! Add your crafted products, upload high-res images, and publish to the marketplace.
              </p>
              <button
                onClick={() => handleOpenModal()}
                className="btn-pill-dark text-xs py-2.5 px-6 inline-flex items-center space-x-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Publish Your First Product</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-4 px-6">Product</th>
                    <th className="py-4 px-4">Category</th>
                    <th className="py-4 px-4">Price</th>
                    <th className="py-4 px-4">Stock</th>
                    <th className="py-4 px-4">Status</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                  {filteredProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3.5 px-6 flex items-center space-x-3">
                        <img
                          src={prod.thumbnail || prod.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          className="w-12 h-14 object-cover rounded-xl bg-neutral-100 flex-shrink-0 border border-neutral-200"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                        <div className="min-w-0">
                          <p className="font-bold text-neutral-900 line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-neutral-500 font-mono">{prod.sku || 'CUSTOM-SKU'}</p>
                          <span className="text-[10px] text-neutral-400 block truncate">
                            By {prod.sellerName || user?.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-semibold text-neutral-700">{prod.category}</td>
                      <td className="py-3.5 px-4 font-bold text-neutral-900">
                        ₹{prod.price?.toFixed(2)}
                        {prod.compareAtPrice > prod.price && (
                          <span className="text-[10px] text-neutral-400 line-through ml-1.5">
                            ₹{prod.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                            prod.stock <= 5
                              ? 'bg-red-50 text-[#C4301C]'
                              : 'bg-emerald-50 text-[#0D8756]'
                          }`}
                        >
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right space-x-2">
                        <Link
                          to={`/product/${prod.slug}`}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 inline-block rounded-lg border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors"
                          title="View on live storefront"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => handleOpenModal(prod)}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-black hover:text-black transition-colors"
                          title="Edit my product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-red-600 hover:text-red-600 transition-colors"
                          title="Delete my product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {editingProduct ? 'Edit Your Product' : 'List New Marketplace Product'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Your listing will be published immediately into the category catalog.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-black"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 bg-red-50 text-[#C4301C] rounded-xl text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="mt-6 space-y-4 text-xs">
              {/* Product Title */}
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Handmade Leather Shoulder Bag"
                  className="input-pill"
                />
              </div>

              {/* Price, Compare Price, Stock */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="1499.00"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Regular / Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="99.00"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Units in Stock *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="25"
                    className="input-pill"
                  />
                </div>
              </div>

              {/* Category & Seller Brand */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Department / Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={handleCategoryChange}
                    className="w-full px-4 py-3 rounded-full border border-neutral-200 bg-white font-medium focus:outline-none focus:border-black"
                  >
                    {MARKETPLACE_CATEGORIES.map((cat) => (
                      <option key={cat.name} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Seller Name / Shop Info
                  </label>
                  <input
                    type="text"
                    value={formData.sellerName}
                    onChange={(e) => setFormData({ ...formData, sellerName: e.target.value })}
                    placeholder="Your Shop or Creator Brand"
                    className="input-pill"
                  />
                </div>
              </div>

              {/* Image Upload & Management Box */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold uppercase tracking-wider text-neutral-900 text-xs">
                    Product Images & Visuals
                  </h4>
                  <span className="text-[11px] text-neutral-500">
                    Upload image file or paste web URL
                  </span>
                </div>

                {/* Main Product Image */}
                <div className="space-y-1.5">
                  <label className="block font-bold uppercase text-neutral-700 text-[11px]">
                    Main Product Image (Cover) *
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="Paste image URL (e.g. Unsplash) or click Upload"
                      className="input-pill flex-1"
                    />
                    <label className="btn-pill-light py-2.5 px-4 cursor-pointer flex items-center space-x-1 whitespace-nowrap flex-shrink-0">
                      {uploadingField === 'thumbnail' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'thumbnail')}
                      />
                    </label>
                  </div>
                  {formData.thumbnail && (
                    <div className="flex items-center space-x-3 pt-1">
                      <img
                        src={formData.thumbnail}
                        alt="Preview"
                        className="w-12 h-14 object-cover rounded-lg border border-neutral-200 bg-white"
                      />
                      <span className="text-[11px] text-neutral-500">Cover preview</span>
                    </div>
                  )}
                </div>

                {/* Secondary / Hover Image */}
                <div className="space-y-1.5">
                  <label className="block font-bold uppercase text-neutral-700 text-[11px]">
                    Secondary / Hover Image (Optional)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={formData.hoverImage}
                      onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
                      placeholder="Alternate photo revealed when user hovers"
                      className="input-pill flex-1"
                    />
                    <label className="btn-pill-light py-2.5 px-4 cursor-pointer flex items-center space-x-1 whitespace-nowrap flex-shrink-0">
                      {uploadingField === 'hoverImage' ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Upload className="w-3.5 h-3.5" />
                      )}
                      <span>Upload</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'hoverImage')}
                      />
                    </label>
                  </div>
                </div>

                {/* Gallery Images */}
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold uppercase text-neutral-700 text-[11px]">
                      Additional Gallery Images ({formData.images.length})
                    </label>
                    <label className="text-[11px] font-bold text-neutral-700 hover:text-black cursor-pointer flex items-center space-x-1">
                      {uploadingField === 'gallery' ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Upload className="w-3 h-3" />
                      )}
                      <span>Upload to gallery</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, 'gallery')}
                      />
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="Add another image URL..."
                      className="input-pill flex-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="btn-pill-dark py-2 px-4 text-xs whitespace-nowrap"
                    >
                      Add
                    </button>
                  </div>

                  {formData.images.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2">
                      {formData.images.map((img, idx) => (
                        <div key={idx} className="relative group/thumb">
                          <img
                            src={img}
                            alt=""
                            className="w-14 h-16 object-cover rounded-xl border border-neutral-200 bg-white"
                          />
                          <button
                            type="button"
                            onClick={() => handleRemoveGalleryImage(idx)}
                            className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 text-white rounded-full flex items-center justify-center text-[10px]"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Detail your item's materials, craftsmanship, dimensions, and specifications..."
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black font-medium"
                />
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-pill-light py-2.5 px-6"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-pill-dark py-2.5 px-7 flex items-center space-x-2 shadow-md"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isSaving ? 'Publishing...' : editingProduct ? 'Save Changes' : 'Publish Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SellerDashboard;
