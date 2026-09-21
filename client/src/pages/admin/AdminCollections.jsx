import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Star, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AdminCollections = () => {
  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
    featured: false,
    sortOrder: 0,
    status: 'active',
  });

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setLoading(true);
    try {
      const res = await api.collections.getAll();
      if (res.success) setCollections(res.collections || []);
    } catch (err) {
      console.error('Failed to fetch collections:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (col = null) => {
    if (col) {
      setEditingCollection(col);
      setFormData({
        name: col.name || '',
        description: col.description || '',
        image: col.image || '',
        featured: !!col.featured,
        sortOrder: col.sortOrder || 0,
        status: col.status || 'active',
      });
    } else {
      setEditingCollection(null);
      setFormData({
        name: '',
        description: '',
        image: '',
        featured: false,
        sortOrder: collections.length + 1,
        status: 'active',
      });
    }
    setIsModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingCollection) {
        await api.collections.update(editingCollection._id, formData);
      } else {
        await api.collections.create(formData);
      }
      setIsModalOpen(false);
      fetchCollections();
    } catch (err) {
      alert(err.message || 'Failed to save collection');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this collection?')) return;
    try {
      await api.collections.delete(id);
      setCollections(collections.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message || 'Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Collection Management
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Curate thematic product showcases, seasonal catalogs, and promotional landing pages.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Collection</span>
        </button>
      </div>

      <div className="bg-white rounded-3xl border border-neutral-200 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : collections.length === 0 ? (
          <div className="p-12 text-center text-neutral-400 text-xs">
            No collections found. Click "Add Collection" above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-4">Name</th>
                  <th className="py-4 px-4">Slug</th>
                  <th className="py-4 px-4">Featured</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Sort Order</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {collections.map((col) => (
                  <tr key={col._id} className="hover:bg-neutral-50">
                    <td className="py-3 px-6">
                      <img
                        src={col.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                      />
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900">{col.name}</td>
                    <td className="py-3 px-4 font-mono text-neutral-500">{col.slug}</td>
                    <td className="py-3 px-4">
                      {col.featured ? (
                        <span className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-neutral-400">—</span>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          col.status === 'active'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-neutral-100 text-neutral-600'
                        }`}
                      >
                        {col.status || 'active'}
                      </span>
                    </td>
                    <td className="py-3 px-4">{col.sortOrder ?? 0}</td>
                    <td className="py-3 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(col)}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:border-black"
                        title="Edit collection"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(col._id)}
                        className="p-1.5 rounded-lg border border-neutral-200 text-neutral-700 hover:text-red-600 hover:border-red-600"
                        title="Delete collection"
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

      {/* Collection Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 z-10 text-xs max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">
                {editingCollection ? 'Edit Collection' : 'Create Collection'}
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
                  placeholder="e.g. Summer Essentials"
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
                  placeholder="Short description of this collection..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-neutral-200 text-xs focus:outline-none focus:border-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="input-pill"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="col-featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="w-4 h-4 text-black border-neutral-300 rounded focus:ring-0"
                />
                <label htmlFor="col-featured" className="text-xs font-bold text-neutral-700 cursor-pointer">
                  Feature on Homepage
                </label>
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
                  {editingCollection ? 'Update Collection' : 'Create Collection'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCollections;
