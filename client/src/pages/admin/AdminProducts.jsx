import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Image,
  AlertCircle,
  Tag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
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
    price: '',
    compareAtPrice: '',
    category: 'Women',
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
    fetchProducts();
  }, [categoryFilter, stockFilter, statusFilter, currentPage, searchTerm]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchCategories = async () => {
    try {
      const res = await api.categories.getAll();
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

      const payload = {
        name: formData.name,
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
      setFormError(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!deleteConfirmId) return;
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
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2 bg-neutral-900 text-white text-xs font-semibold px-4 py-3 rounded-2xl shadow-2xl border border-neutral-700 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Product Catalog
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Create, edit, and organize luxury inventory items across all marketplace categories.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5 self-start sm:self-auto font-bold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filters & Search Control Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-subtle space-y-3">
        <div className="flex items-center space-x-3 bg-neutral-50 px-3.5 py-2.5 rounded-xl border border-neutral-200/60">
          <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by title, SKU code, or brand..."
            className="w-full bg-transparent text-xs outline-none text-neutral-900 placeholder-neutral-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="text-[11px] text-neutral-400 hover:text-black font-semibold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Filter Dropdowns & Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white font-medium text-neutral-800 outline-none focus:border-black"
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
              className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white font-medium text-neutral-800 outline-none focus:border-black"
            >
              <option value="all">All Stock Levels</option>
              <option value="in">Healthy Stock (&gt;10)</option>
              <option value="low">Low Stock (1-10)</option>
              <option value="out">Out of Stock</option>
            </select>
          </div>

          {/* Active / Inactive Tabs */}
          <div className="flex items-center space-x-1.5 p-1 bg-neutral-100 rounded-xl">
            {[
              { id: 'all', label: 'All Status' },
              { id: 'active', label: 'Active' },
              { id: 'draft', label: 'Draft / Inactive' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                  statusFilter === tab.id
                    ? 'bg-white text-neutral-950 shadow-sm'
                    : 'text-neutral-500 hover:text-neutral-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
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
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-neutral-400">
                      No products match your selected filters.
                    </td>
                  </tr>
                ) : (
                  products.map((prod) => {
                    const isLow = prod.stock <= 10 && prod.stock > 0;
                    const isOut = prod.stock <= 0;
                    return (
                      <tr key={prod._id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center space-x-3">
                            <img
                              src={prod.thumbnail || prod.images?.[0] || ''}
                              alt=""
                              className="w-11 h-11 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                            />
                            <div>
                              <p className="font-bold text-neutral-900 line-clamp-1">{prod.name}</p>
                              <p className="text-[10px] text-neutral-500 font-mono">
                                {prod.sku || 'SKU-PENDING'}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">{prod.category}</td>

                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          £{prod.price?.toFixed(2)}
                          {prod.compareAtPrice > prod.price && (
                            <span className="text-[10px] text-neutral-400 line-through ml-1.5">
                              £{prod.compareAtPrice.toFixed(2)}
                            </span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                              isOut
                                ? 'bg-red-50 text-red-600'
                                : isLow
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-emerald-50 text-emerald-700'
                            }`}
                          >
                            {isOut ? '0 units' : `${prod.stock} in stock`}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                              prod.status === 'active'
                                ? 'bg-emerald-50 text-emerald-700'
                                : 'bg-neutral-100 text-neutral-600'
                            }`}
                          >
                            {prod.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(prod)}
                            className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                            title="Edit product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(prod._id)}
                            className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-red-600 hover:text-red-600 transition-colors"
                            title="Delete product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination Footer */}
        <div className="p-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-medium">
          <span>
            Showing {products.length} of {totalCount} products
          </span>
          <div className="flex items-center space-x-2">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="p-1.5 rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-bold text-neutral-900">
              {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="p-1.5 rounded-lg border border-neutral-200 disabled:opacity-40 hover:bg-neutral-50"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-neutral-900">
                {editingProduct ? 'Edit Catalog Product' : 'Add New Product to Catalog'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-[#C4301C] text-xs font-bold border border-red-200 flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Product Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. VEXIVO Cashmere Trench Coat"
                  className="input-pill"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Price (£) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="240.00"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Compare Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="320.00"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Stock Units
                  </label>
                  <input
                    type="number"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                    placeholder="50"
                    className="input-pill"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Department / Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-neutral-200 bg-white font-medium focus:outline-none focus:border-black"
                  >
                    {categories.length > 0 ? (
                      categories.map((c) => (
                        <option key={c._id || c.name} value={c.name}>
                          {c.name}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="Women">Women</option>
                        <option value="Men">Men</option>
                        <option value="Shoes">Shoes</option>
                        <option value="Bags">Bags</option>
                        <option value="Jewellery">Jewellery</option>
                        <option value="Electronics">Electronics</option>
                        <option value="Beauty">Beauty</option>
                      </>
                    )}
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    placeholder="e.g. Outerwear"
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">SKU Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="VEX-COAT-001"
                    className="input-pill"
                  />
                </div>
              </div>

              {/* Sizes and Colors */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Available Sizes (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.sizesText}
                    onChange={(e) => setFormData({ ...formData, sizesText: e.target.value })}
                    placeholder="S, M, L, XL, XXL"
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Available Colors (comma separated)
                  </label>
                  <input
                    type="text"
                    value={formData.colorsText}
                    onChange={(e) => setFormData({ ...formData, colorsText: e.target.value })}
                    placeholder="Midnight Black, Camel Beige, Olive"
                    className="input-pill"
                  />
                </div>
              </div>

              {/* Images */}
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Primary Thumbnail URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="input-pill"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Additional Images (one URL per line)
                </label>
                <textarea
                  rows={2}
                  value={formData.imagesText}
                  onChange={(e) => setFormData({ ...formData, imagesText: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-2...&#10;https://images.unsplash.com/photo-3..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black font-mono"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe material, fit, craftsmanship, care instructions..."
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black"
                />
              </div>

              {/* Status & Marketing Flags */}
              <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-neutral-100">
                <div className="flex items-center space-x-3">
                  <label className="font-bold uppercase text-neutral-700">Status:</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white font-bold text-xs outline-none focus:border-black"
                  >
                    <option value="active">Active (Visible)</option>
                    <option value="draft">Draft / Inactive</option>
                  </select>
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center space-x-1.5 font-semibold text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.bestseller}
                      onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                      className="rounded border-neutral-300 text-black w-4 h-4"
                    />
                    <span>Bestseller</span>
                  </label>

                  <label className="flex items-center space-x-1.5 font-semibold text-neutral-800 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.newArrival}
                      onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                      className="rounded border-neutral-300 text-black w-4 h-4"
                    />
                    <span>New Arrival</span>
                  </label>
                </div>
              </div>

              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-pill-light py-2.5 px-6 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="btn-pill-dark py-2.5 px-7 flex items-center space-x-2 font-bold shadow-md"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Check className="w-3.5 h-3.5" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl space-y-4 z-10 border border-neutral-200">
            <h3 className="text-base font-extrabold text-neutral-900">Delete Product</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to permanently remove this product from the catalog? This action cannot be undone.
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-pill-light py-2 px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={isDeleting}
                className="btn-pill-dark bg-red-600 hover:bg-red-700 text-white py-2 px-4 text-xs font-bold flex items-center space-x-1"
              >
                {isDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
                <span>{isDeleting ? 'Deleting...' : 'Delete Permanently'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
