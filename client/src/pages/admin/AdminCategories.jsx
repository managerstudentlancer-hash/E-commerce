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
  Image,
  Layers,
} from 'lucide-react';
import api from '../../services/api';

const AdminCategories = () => {
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
            Categories & Taxonomies
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Organize the storefront navigation, parent departments, and subcategories.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5 self-start sm:self-auto font-bold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Category</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-subtle flex items-center space-x-3">
        <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by category name, slug, or parent..."
          className="w-full text-xs outline-none text-neutral-900 placeholder-neutral-400 font-medium"
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

      {/* Categories Grid/Table */}
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
                  <th className="py-4 px-6">Category</th>
                  <th className="py-4 px-4">Slug Identifier</th>
                  <th className="py-4 px-4">Parent Dept</th>
                  <th className="py-4 px-4">Sort Order</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-12 text-center text-neutral-400">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((cat) => {
                    const isActive = cat.status !== 'inactive';
                    return (
                      <tr key={cat._id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-6">
                          <div className="flex items-center space-x-3">
                            {cat.image ? (
                              <img
                                src={cat.image}
                                alt=""
                                className="w-10 h-10 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                              />
                            ) : (
                              <div className="w-10 h-10 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-500 flex-shrink-0">
                                <FolderTree className="w-5 h-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-bold text-neutral-900">{cat.name}</p>
                              {cat.description && (
                                <p className="text-[10px] text-neutral-400 line-clamp-1 max-w-xs">
                                  {cat.description}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 font-mono text-neutral-500">{cat.slug}</td>

                        <td className="py-3.5 px-4 text-neutral-600">
                          {cat.parentCategory ? (
                            <span className="px-2 py-0.5 rounded-lg bg-neutral-100 text-neutral-800 font-medium">
                              {cat.parentCategory}
                            </span>
                          ) : (
                            <span className="text-neutral-400 italic">Root Category</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">{cat.sortOrder || 0}</td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleStatus(cat)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                              isActive
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                            }`}
                          >
                            {isActive ? 'Active' : 'Inactive'}
                          </button>
                        </td>

                        <td className="py-3.5 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(cat)}
                            className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                            title="Edit Category"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(cat._id)}
                            className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-red-600 hover:text-red-600 transition-colors"
                            title="Delete Category"
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
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-neutral-900">
                {editingCategory ? 'Edit Category' : 'Create New Category'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-neutral-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-red-50 text-[#C4301C] text-xs font-bold border border-red-200">
                {formError}
              </div>
            )}

            <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Fine Jewellery"
                  className="input-pill"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Parent Category / Subcategory
                  </label>
                  <input
                    type="text"
                    value={formData.parentCategory}
                    onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                    placeholder="e.g. Accessories (optional)"
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Sort Order
                  </label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: e.target.value })}
                    placeholder="1"
                    className="input-pill"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Category Hero Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="input-pill"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief synopsis for catalog headers and SEO metadata..."
                  className="w-full px-4 py-3 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="flex items-center space-x-3 pt-2">
                <label className="font-bold uppercase text-neutral-700">Initial Status:</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-white font-bold text-xs outline-none focus:border-black"
                >
                  <option value="active">Active (Visible)</option>
                  <option value="inactive">Inactive (Hidden)</option>
                </select>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl space-y-4 z-10 border border-neutral-200">
            <h3 className="text-base font-extrabold text-neutral-900">Delete Category</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to delete this category? Products assigned to this category will not be deleted.
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-pill-light py-2 px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCategory}
                disabled={isDeleting}
                className="btn-pill-dark bg-red-600 hover:bg-red-700 text-white py-2 px-4 text-xs font-bold flex items-center space-x-1"
              >
                {isDeleting && <Loader2 className="w-3 h-3 animate-spin" />}
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
