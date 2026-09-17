import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Check, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    sortOrder: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await api.categories.getAll();
      if (res.success) setCategories(res.categories || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setFormData({
        name: cat.name || '',
        description: cat.description || '',
        image: cat.image || '',
        sortOrder: cat.sortOrder || 0,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        sortOrder: categories.length + 1,
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    try {
      if (editingCategory) {
        await api.categories.update(editingCategory._id, formData);
      } else {
        await api.categories.create(formData);
      }
      setIsModalOpen(false);
      fetchCategories();
    } catch (err) {
      alert(err.message || 'Failed to save category');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.categories.delete(id);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Category Management
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Organize departments, category bubbles, and navigation sorting.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Category</span>
        </button>
      </div>

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
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-4">Name</th>
                  <th className="py-4 px-4">Slug</th>
                  <th className="py-4 px-4">Sort Order</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {categories.map((cat) => (
                  <tr key={cat._id} className="hover:bg-neutral-50">
                    <td className="py-3 px-6">
                      <img
                        src={cat.image || 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">{cat.name}</td>
                    <td className="py-3 px-4 font-mono text-neutral-500">{cat.slug}</td>
                    <td className="py-3 px-4">{cat.sortOrder}</td>
                    <td className="py-3 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(cat)}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:border-black"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:text-red-600 hover:border-red-600"
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

      {/* Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 z-10 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingCategory ? 'Edit Category' : 'Create Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Footwear"
                  className="input-pill"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="input-pill"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  className="input-pill"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="btn-pill-light py-2 px-5"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-pill-dark py-2 px-6">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;
