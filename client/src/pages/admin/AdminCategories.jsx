import React, { useState, useEffect } from 'react';
import {
  FolderTree,
  Plus,
  Edit2,
  Trash2,
  X,
  Check,
  Loader2,
  Search,
  CheckCircle2,
  Image as ImageIcon,
  Sparkles,
  Upload,
} from 'lucide-react';
import api from '../../services/api';
import { useCategories } from '../../context/CategoryContext';

const AdminCategories = () => {
  const { refreshCategories } = useCategories();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete Confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    parentCategory: '',
    sortOrder: 0,
    status: 'active',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const handleCategoryImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const data = new FormData();
    data.append('image', file);
    data.append('folder', 'categories');
    if (editingCategory?._id) data.append('categoryId', editingCategory._id);
    setIsUploadingImage(true);
    setFormError('');
    try {
      const res = await api.admin.uploadImage(data);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
        showToast('Category image uploaded to Supabase Storage!');
      }
    } catch (err) {
      setFormError(err.message || 'Image upload failed');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.categories.getAllAdmin();
      if (res.success) {
        setCategories(res.categories || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    setFormError('');
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name || '',
        description: cat.description || '',
        image: cat.image || '',
        parentCategory: cat.parentCategory || '',
        sortOrder: cat.sortOrder || 0,
        status: cat.status || 'active',
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        parentCategory: '',
        sortOrder: categories.length + 1,
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!formData.name) {
      setFormError('Category name is required');
      return;
    }

    setIsSaving(true);
    setFormError('');
    try {
      const payload = {
        ...formData,
        sortOrder: Number(formData.sortOrder || 0),
      };

      if (editingCategory) {
        await api.categories.update(editingCategory._id, payload);
        showToast(`Category "${formData.name}" updated!`);
      } else {
        await api.categories.create(payload);
        showToast(`Category "${formData.name}" created!`);
      }

      setIsModalOpen(false);
      fetchCategories();
      refreshCategories();
    } catch (err) {
      setFormError(err.message || 'Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await api.categories.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('Category deleted successfully');
      fetchCategories();
      refreshCategories();
    } catch (err) {
      showToast(err.message || 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggleStatus = async (cat) => {
    try {
      const newStatus = cat.status === 'active' ? 'inactive' : 'active';
      await api.categories.update(cat._id, { status: newStatus });
      setCategories((prev) =>
        prev.map((c) => (c._id === cat._id ? { ...c, status: newStatus } : c))
      );
      showToast(`Category "${cat.name}" is now ${newStatus}`);
      refreshCategories();
    } catch (err) {
      showToast(err.message || 'Failed to toggle category status');
    }
  };

  const filteredCategories = categories.filter((c) => {
    const term = searchTerm.toLowerCase();
    return (
      c.name?.toLowerCase().includes(term) ||
      c.slug?.toLowerCase().includes(term) ||
      c.parentCategory?.toLowerCase().includes(term)
    );
  });

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
            Departments &amp; Store Taxonomies
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Organize the storefront navigation menus, header dropdowns, and category bubble filters.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center space-x-2 self-start sm:self-auto shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="admin-card p-4 rounded-3xl flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by category name, slug, or parent department..."
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

      {/* Categories Grid/Table */}
      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Loading taxonomies...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-4">Slug URL</th>
                  <th className="py-4 px-4">Parent Dept</th>
                  <th className="py-4 px-4">Sort Order</th>
                  <th className="py-4 px-4">Storefront Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-16 text-center text-slate-400 text-xs">
                      No categories found matching your query.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => {
                    const isActive = cat.status !== 'inactive';
                    return (
                      <tr key={cat._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3.5">
                            {cat.image ? (
                              <img
                                src={cat.image}
                                alt=""
                                className="w-12 h-12 object-cover rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0 group-hover:scale-105 transition-transform"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 flex-shrink-0">
                                <FolderTree className="w-5 h-5 text-cyan-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-white group-hover:text-cyan-300 transition-colors">
                                {cat.name}
                              </p>
                              {cat.description && (
                                <p className="text-[10px] text-slate-400 line-clamp-1 max-w-xs mt-0.5">
                                  {cat.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-4 px-4 font-mono text-cyan-300">/{cat.slug}</td>

                        <td className="py-4 px-4 text-slate-300">
                          {cat.parentCategory ? (
                            <span className="px-2.5 py-1 rounded-xl bg-white/5 border border-white/10 font-bold">
                              {cat.parentCategory}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">Root Category</span>
                          )}
                        </td>

                        <td className="py-4 px-4 font-mono text-slate-400">{cat.sortOrder || 0}</td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleStatus(cat)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                              isActive
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(cat)}
                            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(cat._id)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                            title="Delete Category"
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
        )}
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-lg bg-[#0F172A] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-white/10 custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
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
              <div className="p-4 rounded-2xl bg-rose-500/10 text-rose-400 text-xs font-bold border border-rose-500/30">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fine Jewellery"
                  className="w-full px-4 py-3 rounded-2xl admin-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Parent Category
                  </label>
                  <input
                    type="text"
                    value={formData.parentCategory}
                    onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                    placeholder="e.g. Accessories (optional)"
                    className="w-full px-4 py-3 rounded-2xl admin-input"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    placeholder="1"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold uppercase text-slate-300">
                    Category Cover Image
                  </label>
                  <label className="text-[11px] font-bold text-cyan-400 hover:text-cyan-300 cursor-pointer flex items-center space-x-1 bg-cyan-500/10 px-2.5 py-1 rounded-lg border border-cyan-500/20">
                    {isUploadingImage ? (
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
                      disabled={isUploadingImage}
                      onChange={handleCategoryImageUpload}
                      className="hidden"
                    />
                  </label>
                </div>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://... or upload from your device above"
                  className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                />
                {formData.image && (
                  <div className="mt-2 flex items-center space-x-3 bg-white/5 p-2 rounded-xl border border-white/10">
                    <img
                      src={formData.image}
                      alt="Category Preview"
                      className="w-12 h-14 object-cover rounded-lg bg-slate-800"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-white font-bold truncate">Category Cover Attached</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{formData.image}</p>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Synopsis for catalog headers and SEO metadata..."
                  className="w-full px-4 py-3 rounded-2xl admin-input leading-relaxed"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <label className="font-bold uppercase text-slate-300">Initial Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-900 border border-white/10 text-white font-bold"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
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
                  <span>{isSaving ? 'Saving...' : 'Save Category'}</span>
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
            <h3 className="text-base font-extrabold text-white">Delete Category</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete this category? Products assigned to it will remain safe.
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
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

export default AdminCategories;
