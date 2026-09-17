import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2, X, Check, Loader2, Image, AlertCircle } from 'lucide-react';
import api from '../../services/api';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    compareAtPrice: '',
    category: 'Women',
    sku: '',
    stock: 50,
    description: '',
    shortDescription: '',
    thumbnail: '',
    bestseller: false,
    newArrival: true,
    specialOffer: false,
    status: 'active',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await api.products.getAll({ limit: 100 });
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
    if (prod) {
      setEditingProduct(prod);
      setFormData({
        name: prod.name || '',
        price: prod.price || '',
        compareAtPrice: prod.compareAtPrice || '',
        category: prod.category || 'Women',
        sku: prod.sku || '',
        stock: prod.stock !== undefined ? prod.stock : 50,
        description: prod.description || '',
        shortDescription: prod.shortDescription || '',
        thumbnail: prod.thumbnail || (prod.images?.[0] || ''),
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
        category: 'Women',
        sku: '',
        stock: 50,
        description: '',
        shortDescription: '',
        thumbnail: '',
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
      setFormError('Please fill in product name, price, and description');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        price: Number(formData.price),
        compareAtPrice: Number(formData.compareAtPrice || 0),
        stock: Number(formData.stock || 0),
        images: formData.thumbnail ? [formData.thumbnail] : [],
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
            Product Management
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Manage your online merchandise, pricing tiers, and stock allocations.
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
                          src={prod.thumbnail || prod.images?.[0] || ''}
                          alt=""
                          className="w-10 h-12 object-cover rounded-lg bg-neutral-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-bold text-neutral-900 line-clamp-1">{prod.name}</p>
                          <p className="text-[10px] text-neutral-600 font-mono">{prod.sku || 'NO-SKU'}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">{prod.category}</td>
                      <td className="py-3.5 px-4 font-bold">
                        £{prod.price?.toFixed(2)}
                        {prod.compareAtPrice > prod.price && (
                          <span className="text-[10px] text-neutral-600 line-through ml-1.5">
                            £{prod.compareAtPrice.toFixed(2)}
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-bold text-neutral-900">
                {editingProduct ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="p-1 text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-[#C4301C] text-xs font-bold border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Product Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. VEXIVO Aethel ANC Headphones"
                  className="input-pill"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
                    placeholder="189.00"
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Department / Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-neutral-200 bg-white font-medium focus:outline-none focus:border-black"
                  >
                    <option value="Women">Women</option>
                    <option value="Men">Men</option>
                    <option value="Shoes">Shoes</option>
                    <option value="Bags">Bags</option>
                    <option value="Jewellery">Jewellery</option>
                    <option value="Electronics">Electronics</option>
                    <option value="Beauty">Beauty</option>
                    <option value="Accessories">Accessories</option>
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
                    placeholder="VEX-AUD-001"
                    className="input-pill"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Image URL (Unsplash or direct asset)
                </label>
                <input
                  type="url"
                  value={formData.thumbnail}
                  onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="input-pill"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Full Description *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Elaborate on tailoring, acoustic transducers, materials..."
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
