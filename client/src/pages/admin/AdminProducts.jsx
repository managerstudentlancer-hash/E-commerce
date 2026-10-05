import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Image as ImageIcon,
  AlertCircle,
  Tag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Filter,
  Sparkles,
  Eye,
  Star,
  Upload,
  Play,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { getCategoryFallback } from '../../utils/imageHelper';

import { useSearchParams } from 'react-router-dom';

const AdminProducts = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [stockFilter, setStockFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete Confirm Modal
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    brand: 'VEXIVO',
    rating: 4.8,
    numReviews: 0,
    price: '',
    compareAtPrice: '',
    category: 'Women Wear',
    subcategory: '',
    sku: '',
    stock: 50,
    description: '',
    shortDescription: '',
    thumbnail: '',
    imagesText: '',
    sizesText: 'S, M, L, XL',
    colorsText: 'Black, White',
    bestseller: false,
    newArrival: true,
    specialOffer: false,
    status: 'active',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const urlCat = searchParams.get('category');
    if (urlCat) {
      setCategoryFilter(urlCat);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!authLoading) {
      fetchProducts();
    }
  }, [categoryFilter, stockFilter, statusFilter, currentPage, searchTerm, authLoading]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const [isUploadingThumb, setIsUploadingThumb] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);

  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated || authLoading) {
      setFormError('Authentication required: Administrator session is still verifying or expired.');
      return;
    }

    const data = new FormData();
    data.append('image', file);
    data.append('folder', 'products');
    if (editingProduct?._id) data.append('productId', editingProduct._id);
    setIsUploadingThumb(true);
    setFormError('');
    try {
      const res = await api.admin.uploadImage(data);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, thumbnail: res.url }));
        showToast('Product cover uploaded to Supabase Storage!');
      }
    } catch (err) {
      if (err.status === 401 || err.message?.toLowerCase().includes('authorized') || err.message?.toLowerCase().includes('token')) {
        setFormError('Session expired. Please re-login to upload images. Your form data is saved.');
      } else {
        setFormError(err.message || 'Image upload failed');
      }
    } finally {
      setIsUploadingThumb(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated || authLoading) {
      setFormError('Authentication required: Administrator session is still verifying or expired.');
      return;
    }

    const data = new FormData();
    data.append('image', file);
    data.append('folder', 'products');
    if (editingProduct?._id) data.append('productId', editingProduct._id);
    setIsUploadingGallery(true);
    setFormError('');
    try {
      const res = await api.admin.uploadImage(data);
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          imagesText: prev.imagesText ? `${prev.imagesText}\n${res.url}` : res.url,
        }));
        showToast('Gallery image uploaded to Supabase Storage!');
      }
    } catch (err) {
      if (err.status === 401 || err.message?.toLowerCase().includes('authorized') || err.message?.toLowerCase().includes('token')) {
        setFormError('Session expired. Please re-login to upload images. Your form data is saved.');
      } else {
        setFormError(err.message || 'Image upload failed');
      }
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const [isUploadingVideo, setIsUploadingVideo] = useState(false);

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!isAuthenticated || authLoading) {
      setFormError('Authentication required: Administrator session is still verifying or expired.');
      return;
    }

    const data = new FormData();
    data.append('image', file);
    data.append('video', file);
    data.append('folder', 'products');
    if (editingProduct?._id) data.append('productId', editingProduct._id);
    setIsUploadingVideo(true);
    setFormError('');
    try {
      const res = await api.admin.uploadVideo(data);
      if (res.success && res.url) {
        setFormData((prev) => ({
          ...prev,
          videoUrl: res.url,
        }));
        showToast('Product video uploaded to Supabase Storage (product-media)!');
      }
    } catch (err) {
      if (err.status === 401 || err.message?.toLowerCase().includes('authorized') || err.message?.toLowerCase().includes('token')) {
        setFormError('Session expired. Please re-login to upload video. Your form data is saved.');
      } else {
        setFormError(err.message || 'Video upload failed');
      }
    } finally {
      setIsUploadingVideo(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.categories.getAllAdmin();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        status: statusFilter,
      };
      if (categoryFilter !== 'all') params.category = categoryFilter;
      if (stockFilter !== 'all') params.stockStatus = stockFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await api.products.getAll(params);
      if (res.success) {
        setProducts(res.products || []);
        setTotalPages(res.totalPages || 1);
        setTotalCount(res.total || 0);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (prod = null) => {
    setFormError('');
    if (prod) {
      setEditingProduct(prod);

      // Extract sizes and colors
      let sizes = 'S, M, L, XL';
      let colors = 'Black, White';
      if (prod.options && Array.isArray(prod.options) && prod.options.length > 0) {
        const szList = [...new Set(prod.options.map((o) => o.size).filter(Boolean))];
        const clList = [...new Set(prod.options.map((o) => o.color).filter(Boolean))];
        if (szList.length > 0) sizes = szList.join(', ');
        if (clList.length > 0) colors = clList.join(', ');
      }

      setFormData({
        name: prod.name || '',
        brand: prod.brand || 'VEXIVO',
        rating: prod.rating !== undefined ? prod.rating : 4.8,
        numReviews: prod.numReviews !== undefined ? prod.numReviews : 0,
        price: prod.price || '',
        compareAtPrice: prod.compareAtPrice || '',
        category: prod.category || 'Women',
        subcategory: prod.subcategory || '',
        sku: prod.sku || '',
        stock: prod.stock !== undefined ? prod.stock : 50,
        description: prod.description || '',
        shortDescription: prod.shortDescription || '',
        thumbnail: prod.thumbnail || prod.images?.[0] || '',
        imagesText: (prod.images || []).join('\n'),
        videoUrl: prod.videos?.[0] || prod.media?.find((m) => m.type === 'video')?.url || '',
        sizesText: sizes,
        colorsText: colors,
        bestseller: !!prod.bestseller,
        newArrival: !!prod.newArrival,
        specialOffer: !!prod.specialOffer,
        status: prod.status || 'active',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        brand: 'VEXIVO',
        rating: 4.8,
        numReviews: 0,
        price: '',
        compareAtPrice: '',
        category: categories[0]?.name || 'Women',
        subcategory: '',
        sku: '',
        stock: 50,
        description: '',
        shortDescription: '',
        thumbnail: '',
        imagesText: '',
        videoUrl: '',
        sizesText: 'S, M, L, XL',
        colorsText: 'Black, White',
        bestseller: false,
        newArrival: true,
        specialOffer: false,
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      setFormError('Please enter product title, price, and description');
      return;
    }

    if (!isAuthenticated || authLoading) {
      setFormError('Authentication required: Administrator session is still verifying or expired.');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      // Parse images list
      const rawImages = formData.imagesText
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

      const images = formData.thumbnail
        ? [formData.thumbnail, ...rawImages.filter((img) => img !== formData.thumbnail)]
        : rawImages;

      // Parse sizes and colors into options array
      const parsedSizes = formData.sizesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      const parsedColors = formData.colorsText
        .split(',')
        .map((c) => c.trim())
        .filter(Boolean);

      const options = [];
      for (const col of parsedColors.length > 0 ? parsedColors : ['Default']) {
        for (const sz of parsedSizes.length > 0 ? parsedSizes : ['Standard']) {
          options.push({
            color: col,
            size: sz,
            sku: formData.sku ? `${formData.sku}-${sz}-${col}` : '',
            price: Number(formData.price),
            stock: Math.round(Number(formData.stock || 50) / (parsedSizes.length * parsedColors.length || 1)),
          });
        }
      }

      const mediaItems = [
        ...images.map((img, idx) => ({
          type: 'image',
          url: img,
          displayOrder: idx,
          isPrimary: idx === 0,
        })),
        ...(formData.videoUrl
          ? [
              {
                type: 'video',
                url: formData.videoUrl,
                displayOrder: images.length,
                isPrimary: false,
              },
            ]
          : []),
      ];

      const payload = {
        name: formData.name,
        brand: formData.brand ? formData.brand.trim() : 'VEXIVO',
        rating: Number(formData.rating || 4.8),
        numReviews: Number(formData.numReviews || 0),
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice || 0),
        category: formData.category,
        subcategory: formData.subcategory,
        sku: formData.sku,
        stock: Number(formData.stock || 0),
        description: formData.description,
        shortDescription: formData.shortDescription,
        thumbnail: formData.thumbnail || images[0] || '',
        images: images.length > 0 ? images : [formData.thumbnail].filter(Boolean),
        videos: formData.videoUrl ? [formData.videoUrl] : [],
        media: mediaItems,
        options,
        bestseller: formData.bestseller,
        newArrival: formData.newArrival,
        specialOffer: formData.specialOffer,
        status: formData.status,
      };

      if (editingProduct) {
        await api.products.update(editingProduct._id, payload);
        showToast(`Product "${formData.name}" updated successfully!`);
      } else {
        await api.products.create(payload);
        showToast(`Product "${formData.name}" added to catalog!`);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      if (err.status === 401 || err.message?.toLowerCase().includes('authorized') || err.message?.toLowerCase().includes('token')) {
        setFormError('Session expired. Please re-login to save products. Your form data is saved.');
      } else {
        setFormError(err.message || 'Failed to save product');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirmId) return;
    if (!isAuthenticated || authLoading) {
      showToast('Authentication required: Administrator session expired.');
      return;
    }
    setIsDeleting(true);
    try {
      await api.products.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('Product removed successfully from catalog');
      fetchProducts();
    } catch (err) {
      showToast(err.message || 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 glow-emerald animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Product Catalog Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create, update, and publish inventory directly to the live customer storefront in real-time.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center space-x-2 self-start sm:self-auto shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Search & Multi-Filter Control Bar */}
      <div className="admin-card p-4 rounded-3xl space-y-3">
        <div className="flex items-center space-x-3 bg-slate-900/60 px-4 py-3 rounded-2xl border border-white/10">
          <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by product title, SKU code, or department..."
            className="w-full bg-transparent text-xs outline-none text-white placeholder-slate-500 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[11px] text-slate-400 hover:text-white font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2.5 text-xs">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 font-bold text-slate-200 outline-none focus:border-cyan-400"
            >
              <option value="all">All Categories</option>
              {categories.map((c) => (
                <option key={c._id || c.slug} value={c.slug || c.name}>
                  {c.name}
                </option>
              ))}
            </select>

            {/* Stock Filter */}
            <select
              value={stockFilter}
              onChange={(e) => {
                setStockFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 border border-white/10 font-bold text-slate-200 outline-none focus:border-cyan-400"
            >
              <option value="all">All Stock Status</option>
              <option value="in">Healthy Stock (&gt;10 units)</option>
              <option value="low">Low Stock (1-10 units)</option>
              <option value="out">Out of Stock (0 units)</option>
            </select>
          </div>

          {/* Active / Inactive Tabs */}
          <div className="flex items-center space-x-1.5 p-1 bg-white/5 rounded-2xl border border-white/5">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'active', label: 'Active' },
              { id: 'draft', label: 'Draft / Hidden' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  statusFilter === tab.id
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Querying catalog inventory...</p>
          </div>
        ) : (
          <div>
            {/* Mobile Products Card View (Screens < md) */}
            <div className="md:hidden divide-y divide-white/5">
              {products.length === 0 ? (
                <div className="py-16 text-center text-slate-400 text-xs">
                  No products match your selected search or filter criteria.
                </div>
              ) : (
                products.map((prod) => {
                  const isLow = prod.stock <= 10 && prod.stock > 0;
                  const isOut = prod.stock <= 0;
                  return (
                    <div key={prod._id} className="p-4 space-y-3 hover:bg-white/[0.02] transition-colors">
                      <div className="flex items-center space-x-3">
                        <img
                          src={prod.thumbnail || prod.images?.[0] || getCategoryFallback(prod.category)}
                          alt=""
                          onError={(e) => {
                            e.currentTarget.src = getCategoryFallback(prod.category);
                          }}
                          className="w-14 h-14 object-cover rounded-xl bg-slate-900 border border-white/10 flex-shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-white text-xs line-clamp-1">
                            {prod.name}
                          </p>
                          <div className="flex items-center space-x-1.5 mt-1 flex-wrap gap-1">
                            <span className="text-[10px] text-slate-400 font-mono">
                              {prod.sku || 'SKU-PENDING'}
                            </span>
                            <span className="text-[9px] px-2 py-0.5 rounded-md bg-white/5 text-slate-300 font-semibold">
                              {prod.category}
                            </span>
                            {prod.brand && (
                              <span className="text-[9px] px-2 py-0.5 rounded-md bg-cyan-500/10 text-cyan-300 font-semibold">
                                {prod.brand}
                              </span>
                            )}
                            <span className="text-[9px] px-1.5 py-0.5 rounded-md bg-amber-500/15 text-amber-300 font-bold flex items-center space-x-0.5">
                              <span>★</span>
                              <span>{prod.rating || 4.8}</span>
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-black text-cyan-300 font-mono text-sm">
                              ₹{prod.price?.toLocaleString('en-IN')}
                            </span>
                            {prod.compareAtPrice > prod.price && (
                              <>
                                <span className="text-[10px] text-slate-500 line-through">
                                  ₹{prod.compareAtPrice?.toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-emerald-400 font-bold">
                                  -{Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)}%
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs">
                        <div className="flex items-center space-x-2">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase font-mono ${
                              isOut
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : isLow
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : `${prod.stock} in stock`}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase ${
                              prod.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-white/5 text-slate-400 border border-white/10'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleOpenModal(prod)}
                            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(prod._id)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* Desktop Table View (Screens >= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Product Details</th>
                  <th className="py-4 px-4">Department</th>
                  <th className="py-4 px-4">Price (₹)</th>
                  <th className="py-4 px-4">Stock Health</th>
                  <th className="py-4 px-4">Storefront Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400 text-xs">
                      No products match your selected search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    const isLow = prod.stock <= 10 && prod.stock > 0;
                    const isOut = prod.stock <= 0;
                    return (
                      <tr key={prod._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3.5">
                            <img
                              src={prod.thumbnail || prod.images?.[0] || getCategoryFallback(prod.category)}
                              alt=""
                              onError={(e) => {
                                e.currentTarget.src = getCategoryFallback(prod.category);
                              }}
                              className="w-12 h-12 object-cover rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                            />
                            <div>
                              <p className="font-bold text-white line-clamp-1 group-hover:text-cyan-300 transition-colors">
                                {prod.name}
                              </p>
                              <div className="flex items-center space-x-2 mt-0.5 flex-wrap gap-1">
                                <span className="text-[10px] text-slate-400 font-mono">
                                  {prod.sku || 'SKU-PENDING'}
                                </span>
                                {prod.source === 'dummyjson' && (
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                                    DummyJSON
                                  </span>
                                )}
                                {prod.brand && (
                                  <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25">
                                    {prod.brand}
                                  </span>
                                )}
                                <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-500/15 text-amber-300 border border-amber-500/25 flex items-center space-x-0.5">
                                  <span>★</span>
                                  <span>{prod.rating || 4.8}</span>
                                </span>
                                {prod.bestseller && (
                                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                    Bestseller
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 text-slate-300">
                          <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 font-bold">
                            {prod.category}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-black text-white font-mono text-sm">
                          ₹{prod.price?.toLocaleString('en-IN')}
                          {prod.compareAtPrice > prod.price && (
                            <>
                              <span className="text-[10px] text-slate-500 line-through ml-2 font-normal">
                                ₹{prod.compareAtPrice?.toLocaleString('en-IN')}
                              </span>
                              <span className="text-[10px] text-emerald-400 font-bold ml-1.5">
                                ({Math.round(((prod.compareAtPrice - prod.price) / prod.compareAtPrice) * 100)}% off)
                              </span>
                            </>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[11px] font-black uppercase font-mono ${
                              isOut
                                ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                : isLow
                                ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                                : 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            }`}
                          >
                            {isOut ? 'Out of Stock' : `${prod.stock} in stock`}
                          </span>
                        </td>

                        <td className="py-4 px-4">
                          <span
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase ${
                              prod.status === 'active'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-white/5 text-slate-400 border border-white/10'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(prod)}
                            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(prod._id)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

        {/* Pagination Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 flex items-center justify-between text-xs text-slate-400 font-bold bg-white/[0.02]">
          <span>
            Displaying {products.length} of {totalCount} luxury catalog items
          </span>
          <div className="flex items-center space-x-2.5">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-white px-2">
              Page {currentPage} of {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-2 rounded-xl bg-white/5 border border-white/10 disabled:opacity-30 hover:bg-white/10 text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-2xl bg-[#0F172A] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-white/10 custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/30 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. VEXIVO Cashmere Trench Coat"
                  className="w-full px-4 py-3 rounded-2xl admin-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Price (₹) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="240.00"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Compare Price / MRP (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="320.00"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono font-bold"
                  />
                </div>

                {/* Live Discount Calculator Preview */}
                {Number(formData.compareAtPrice) > Number(formData.price) && Number(formData.price) > 0 ? (
                  <div className="col-span-1 sm:col-span-3 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-xs font-bold flex flex-wrap items-center justify-between gap-2">
                    <span className="flex items-center space-x-2">
                      <span className="px-2 py-0.5 rounded-lg bg-emerald-500/20 text-emerald-300 font-black font-mono">
                        {Math.round(((Number(formData.compareAtPrice) - Number(formData.price)) / Number(formData.compareAtPrice)) * 100)}% OFF
                      </span>
                      <span>Active Discount Badge (Automatically filters on category pages)</span>
                    </span>
                    <span className="text-[11px] font-mono text-emerald-300">
                      Customer saves ₹{(Number(formData.compareAtPrice) - Number(formData.price)).toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <div className="col-span-1 sm:col-span-3 px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-slate-400 text-[11px] flex items-center justify-between">
                    <span>💡 Tip: Set <strong>Compare Price</strong> higher than <strong>Price</strong> to automatically calculate and activate discount filters & badges.</span>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Department / Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c._id || c.name} value={c.name} className="bg-slate-900 text-white">
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Women" className="bg-slate-900 text-white">Women</option>
                        <option value="Men" className="bg-slate-900 text-white">Men</option>
                        <option value="Shoes" className="bg-slate-900 text-white">Shoes</option>
                        <option value="Bags" className="bg-slate-900 text-white">Bags</option>
                        <option value="Jewellery" className="bg-slate-900 text-white">Jewellery</option>
                        <option value="Electronics" className="bg-slate-900 text-white">Electronics</option>
                        <option value="Beauty" className="bg-slate-900 text-white">Beauty</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Outerwear"
                    className="w-full px-4 py-3 rounded-2xl admin-input"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="VEX-COAT-001"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>
              </div>

              {/* Brand, Rating & Review Count Controls (Filters & Display) */}
              <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold uppercase tracking-wider text-cyan-400 flex items-center space-x-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Brand, Rating & Reviews Control (Filters)</span>
                  </span>
                  <span className="text-[10px] text-slate-400">Controls rating stars & brand filter tags</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                  <div>
                    <label className="block font-bold uppercase text-slate-300 mb-1.5 text-[11px]">
                      Brand Name (Brand Filter)
                    </label>
                    <input
                      type="text"
                      value={formData.brand}
                      onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                      placeholder="VEXIVO, ZARA, NIKE, etc."
                      className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-300 mb-1.5 text-[11px] flex items-center space-x-1">
                      <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      <span>Rating (1.0 - 5.0)</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                      placeholder="4.8"
                      className="w-full px-4 py-3 rounded-2xl admin-input font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="block font-bold uppercase text-slate-300 mb-1.5 text-[11px]">
                      Verified Review Count
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.numReviews}
                      onChange={(e) => setFormData({ ...formData, numReviews: e.target.value })}
                      placeholder="24"
                      className="w-full px-4 py-3 rounded-2xl admin-input font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Sizes and Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Available Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizesText}
                    onChange={(e) => setFormData({ ...formData, sizesText: e.target.value })}
                    placeholder="S, M, L, XL, XXL"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Available Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colorsText}
                    onChange={(e) => setFormData({ ...formData, colorsText: e.target.value })}
                    placeholder="Midnight Black, Camel Beige, Olive"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>
              </div>

              {/* Images */}
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold uppercase text-slate-300">
                      Primary Thumbnail Image *
                    </label>
                    <label className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center space-x-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      {isUploadingThumb ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to Supabase...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File from Device</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingThumb}
                        onChange={handleThumbnailUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    required
                    value={formData.thumbnail}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    placeholder="https://... or upload from your device above"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                  {formData.thumbnail && (
                    <div className="mt-2 flex items-center space-x-3 bg-white/5 p-2 rounded-xl border border-white/10">
                      <img
                        src={formData.thumbnail}
                        alt="Thumbnail Preview"
                        className="w-12 h-14 object-cover rounded-lg bg-slate-800"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] text-white font-bold truncate">Cover Image Attached</p>
                        <p className="text-[10px] text-slate-400 font-mono truncate">{formData.thumbnail}</p>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold uppercase text-slate-300">
                      Additional Carousel Images (one URL per line)
                    </label>
                    <label className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center space-x-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                      {isUploadingGallery ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to Supabase...</span>
                        </>
                      ) : (
                        <>
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload to Carousel</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        disabled={isUploadingGallery}
                        onChange={handleGalleryUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <textarea
                    rows={2}
                    value={formData.imagesText}
                    onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                    placeholder="https://images.unsplash.com/...&#10;https://...supabase.co/..."
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>

                {/* Product Video (Supabase Storage product-media) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="block font-bold uppercase text-slate-300">
                      Product Video (Optional MP4, WEBM, MOV)
                    </label>
                    <label className="text-[11px] font-bold text-emerald-400 hover:text-emerald-300 cursor-pointer flex items-center space-x-1 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                      {isUploadingVideo ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Uploading to Supabase...</span>
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-emerald-400" />
                          <span>Upload Video File</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="video/mp4,video/webm,video/quicktime,.mp4,.webm,.mov"
                        disabled={isUploadingVideo}
                        onChange={handleVideoUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                    placeholder="https://...supabase.co/.../videos/...mp4 (or upload file above)"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                  {formData.videoUrl && (
                    <div className="mt-2.5 bg-white/5 p-3 rounded-xl border border-white/10 space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
                          <span className="text-[11px] text-white font-bold">Supabase Product Video Ready</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setFormData((prev) => ({ ...prev, videoUrl: '' }))}
                          className="text-[10px] text-rose-400 hover:text-rose-300 font-bold px-2 py-0.5 rounded bg-rose-500/10 hover:bg-rose-500/20"
                        >
                          Remove Video
                        </button>
                      </div>
                      <video
                        src={formData.videoUrl}
                        controls
                        preload="metadata"
                        className="w-full max-h-48 rounded-lg bg-black object-contain border border-white/10"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Product Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe material, Italian tailoring, fit, craftsmanship..."
                  className="w-full px-4 py-3 rounded-2xl admin-input leading-relaxed"
                />
              </div>

              {/* Status & Marketing Flags */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
                <div className="flex items-center space-x-3">
                  <label className="font-bold uppercase text-slate-300">Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft / Inactive</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-2 font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bestseller}
                      onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                      className="rounded border-white/20 text-cyan-500 w-4 h-4 bg-slate-900"
                    />
                    <span>Bestseller</span>
                  </label>

                  <label className="flex items-center space-x-2 font-bold text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.newArrival}
                      onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                      className="rounded border-white/20 text-cyan-500 w-4 h-4 bg-slate-900"
                    />
                    <span>New Arrival</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center space-x-2 shadow-lg shadow-cyan-500/20"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <Check className="w-4 h-4 text-slate-950" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            onClick={() => setDeleteConfirmId(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <div className="relative w-full max-w-sm bg-[#0F172A] p-6 rounded-3xl shadow-2xl space-y-4 z-10 border border-white/10">
            <h3 className="text-base font-extrabold text-white">Delete Catalog Item</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to permanently remove this product from the live catalog?
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs flex items-center space-x-1 shadow-lg shadow-rose-500/20"
              >
                {isDeleting && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
