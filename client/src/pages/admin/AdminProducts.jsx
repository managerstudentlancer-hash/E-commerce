import React, { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Upload,
  ArrowUp,
  ArrowDown,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';

const CATEGORIES = [
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
];

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [uploadingField, setUploadingField] = useState(null); // 'thumbnail' | 'hoverImage' | 'gallery'

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compareAtPrice: '',
    category: 'Women Wear',
    sku: '',
    stock: 50,
    description: '',
    shortDescription: '',
    thumbnail: '',
    hoverImage: '',
    images: [],
    bestseller: false,
    newArrival: true,
    specialOffer: false,
    status: 'active',
  });

  const [newGalleryUrl, setNewGalleryUrl] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.products.getAll({ limit: 300 });
      if (res.success) {
        setProducts(res.products || []);
      }
    } catch (err) {
      console.error(err);
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
        sku: prod.sku || '',
        stock: prod.stock !== undefined ? prod.stock : 50,
        description: prod.description || '',
        shortDescription: prod.shortDescription || '',
        thumbnail: prod.thumbnail || gallery[0] || '',
        hoverImage: prod.hoverImage || gallery[1] || '',
        images: gallery,
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
        category: 'Women Wear',
        sku: '',
        stock: 50,
        description: '',
        shortDescription: '',
        thumbnail: '',
        hoverImage: '',
        images: [],
        bestseller: false,
        newArrival: true,
        specialOffer: false,
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  // Image Upload helper
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
      alert(err.message || 'Image upload failed');
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

  const handleMoveImage = (index, direction) => {
    const newIdx = direction === 'up' ? index - 1 : index + 1;
    if (newIdx < 0 || newIdx >= formData.images.length) return;
    const reordered = [...formData.images];
    const [moved] = reordered.splice(index, 1);
    reordered.splice(newIdx, 0, moved);
    setFormData((prev) => ({
      ...prev,
      images: reordered,
      thumbnail: reordered[0] || prev.thumbnail,
    }));
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.price || !formData.description) {
      setFormError('Please fill in product name, price, and description');
      return;
    }

    setIsSaving(true);
    try {
      const imagesArray = Array.from(
        new Set(
          [
            formData.thumbnail,
            formData.hoverImage,
            ...(formData.images || []),
          ].filter(Boolean)
        )
      );

      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice || 0),
        stock: Number(formData.stock || 0),
        thumbnail: formData.thumbnail || imagesArray[0] || '',
        hoverImage: formData.hoverImage || imagesArray[1] || '',
        images: imagesArray.length > 0 ? imagesArray : (formData.thumbnail ? [formData.thumbnail] : []),
      };

      if (editingProduct) {
        await api.products.update(editingProduct._id, payload);
      } else {
        await api.products.create(payload);
      }

      setIsModalOpen(false);
      fetchProducts();
    } catch (err) {
      setFormError(err.message || 'Failed to save product');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you certain you wish to remove this product from the catalog?')) return;
    try {
      await api.products.delete(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Product Management ({products.length})
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your catalog, high-res visual assets, pricing, and stock.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center space-x-3 shadow-subtle">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by product name, SKU, or department..."
          className="flex-1 text-xs outline-none text-neutral-900 placeholder-neutral-400 font-medium"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-xs text-neutral-400 hover:text-black">
            Clear
          </button>
        )}
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
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
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-neutral-500">
                      No products match your search query.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((prod) => (
                    <tr key={prod._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3.5 px-6 flex items-center space-x-3">
                        <img
                          src={prod.thumbnail || prod.images?.[0] || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&q=80'}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&q=80';
                          }}
                        />
                        <div>
                          <p className="font-bold text-neutral-900 line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-neutral-600 font-mono">{prod.sku || 'NO-SKU'}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-medium">{prod.category}</td>
                      <td className="py-3.5 px-4 font-bold">
                        ₹{prod.price?.toFixed(2)}
                        {prod.compareAtPrice > prod.price && (
                          <span className="text-[10px] text-neutral-600 line-through ml-1.5">
                            ₹{prod.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                            prod.stock <= 10
                              ? 'bg-red-100 text-[#C4301C]'
                              : 'bg-green-50 text-[#0D8756]'
                          }`}
                        >
                          {prod.stock} in stock
                        </span>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                          {prod.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenModal(prod)}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                          title="Edit product"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(prod._id)}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:border-red-600 hover:text-red-600 transition-colors"
                          title="Delete product"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Product Edit / Create Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto animate-fade-in">
          <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <h3 className="text-lg font-bold text-neutral-900">
                  {editingProduct ? 'Edit Product & Visual Assets' : 'Add New Product'}
                </h3>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Full image management: main image, hover image, and gallery order.
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
                  placeholder="e.g. VEXIVO Silk Midi Wrap Dress"
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
                    placeholder="189.00"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Compare Price (₹)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: e.target.value })}
                    placeholder="249.00"
                    className="input-pill"
                  />
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Units in Stock
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

              {/* Category & SKU */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Department / Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-neutral-200 bg-white font-medium focus:outline-none focus:border-black"
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="VEX-WOM-001"
                    className="input-pill"
                  />
                </div>
              </div>

              {/* ============================================================ */}
              {/* IMAGE MANAGEMENT SECTION                                     */}
              {/* ============================================================ */}
              <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-200 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-extrabold uppercase tracking-wider text-neutral-900 text-xs">
                    Product Visual Assets (Main, Hover, Gallery)
                  </h4>
                  <span className="text-[11px] text-neutral-500">
                    Upload new file or paste direct URL
                  </span>
                </div>

                {/* 1. Main Product Image (Thumbnail) */}
                <div className="space-y-1.5">
                  <label className="block font-bold uppercase text-neutral-700 text-[11px]">
                    Main Product Image (Thumbnail) *
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={formData.thumbnail}
                      onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                      placeholder="https://images.unsplash.com/... or /uploads/..."
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
                        alt="Main preview"
                        className="w-12 h-14 object-cover rounded-lg border border-neutral-200 bg-white"
                      />
                      <span className="text-[11px] text-neutral-500">Main cover preview</span>
                    </div>
                  )}
                </div>

                {/* 2. Secondary / Hover Image */}
                <div className="space-y-1.5">
                  <label className="block font-bold uppercase text-neutral-700 text-[11px]">
                    Secondary / Hover Image (revealed on card hover)
                  </label>
                  <div className="flex gap-2 items-center">
                    <input
                      type="url"
                      value={formData.hoverImage}
                      onChange={(e) => setFormData({ ...formData, hoverImage: e.target.value })}
                      placeholder="https://images.unsplash.com/... (optional hover alternate)"
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
                  {formData.hoverImage && (
                    <div className="flex items-center space-x-3 pt-1">
                      <img
                        src={formData.hoverImage}
                        alt="Hover preview"
                        className="w-12 h-14 object-cover rounded-lg border border-neutral-200 bg-white"
                      />
                      <span className="text-[11px] text-neutral-500">Hover alternate preview</span>
                    </div>
                  )}
                </div>

                {/* 3. Gallery Images (Reorder / Delete / Add) */}
                <div className="space-y-2 pt-2 border-t border-neutral-200">
                  <div className="flex items-center justify-between">
                    <label className="block font-bold uppercase text-neutral-700 text-[11px]">
                      Gallery Images ({formData.images.length})
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

                  {/* Add URL Row */}
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={newGalleryUrl}
                      onChange={(e) => setNewGalleryUrl(e.target.value)}
                      placeholder="Paste image URL to add to gallery..."
                      className="input-pill flex-1 text-xs"
                    />
                    <button
                      type="button"
                      onClick={handleAddGalleryUrl}
                      className="btn-pill-dark py-2 px-4 text-xs whitespace-nowrap"
                    >
                      Add URL
                    </button>
                  </div>

                  {/* Gallery Reorder List */}
                  {formData.images.length > 0 ? (
                    <div className="space-y-1.5 pt-2">
                      {formData.images.map((imgUrl, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between bg-white p-2 rounded-xl border border-neutral-200"
                        >
                          <div className="flex items-center space-x-3 min-w-0">
                            <span className="text-[10px] font-bold text-neutral-400 w-4">
                              #{idx + 1}
                            </span>
                            <img
                              src={imgUrl}
                              alt=""
                              className="w-10 h-10 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                              onError={(e) => {
                                e.currentTarget.src = 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=100&q=80';
                              }}
                            />
                            <p className="text-[11px] text-neutral-700 truncate max-w-xs font-mono">
                              {imgUrl}
                            </p>
                          </div>

                          <div className="flex items-center space-x-1 flex-shrink-0">
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'up')}
                              disabled={idx === 0}
                              className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30"
                              title="Move up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleMoveImage(idx, 'down')}
                              disabled={idx === formData.images.length - 1}
                              className="p-1 rounded hover:bg-neutral-100 disabled:opacity-30"
                              title="Move down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleRemoveGalleryImage(idx)}
                              className="p-1 rounded text-red-500 hover:bg-red-50"
                              title="Remove image"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-400 italic">No gallery images added yet.</p>
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
                  placeholder="Elaborate on tailoring, materials, and fit..."
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black"
                />
              </div>

              {/* Marketing Toggles */}
              <div className="flex flex-wrap gap-4 pt-2">
                <label className="flex items-center space-x-2 font-semibold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.bestseller}
                    onChange={(e) => setFormData({ ...formData, bestseller: e.target.checked })}
                    className="rounded border-neutral-300 text-black w-4 h-4"
                  />
                  <span>Bestseller</span>
                </label>

                <label className="flex items-center space-x-2 font-semibold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.newArrival}
                    onChange={(e) => setFormData({ ...formData, newArrival: e.target.checked })}
                    className="rounded border-neutral-300 text-black w-4 h-4"
                  />
                  <span>New Arrival</span>
                </label>

                <label className="flex items-center space-x-2 font-semibold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.specialOffer}
                    onChange={(e) => setFormData({ ...formData, specialOffer: e.target.checked })}
                    className="rounded border-neutral-300 text-black w-4 h-4"
                  />
                  <span>Special Offer</span>
                </label>
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
                  className="btn-pill-dark py-2.5 px-7 flex items-center space-x-2"
                >
                  {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>{isSaving ? 'Saving...' : 'Save Product'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
