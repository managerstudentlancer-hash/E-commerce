import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, X, Star, Loader2, Sparkles, Check } from 'lucide-react';
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
    <div className="space-y-6 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Curated Collections Management
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Curate thematic product showcases, seasonal catalogs, and promotional landing pages.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center space-x-2 self-start sm:self-auto shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add Collection</span>
        </button>
      </div>

      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Loading curated collections...</p>
          </div>
        ) : collections.length === 0 ? (
          <div className="p-16 text-center text-slate-400 text-xs">
            No collections found. Click "Add Collection" above to create one.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Image</th>
                  <th className="py-4 px-4">Collection Title</th>
                  <th className="py-4 px-4">Slug URL</th>
                  <th className="py-4 px-4">Homepage Spotlight</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-4">Sort Order</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {collections.map((col) => (
                  <tr key={col._id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="py-4 px-6">
                      <img
                        src={col.image || 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=100&q=80'}
                        alt=""
                        className="w-11 h-11 rounded-2xl object-cover border border-white/10"
                      />
                    </td>
                    <td className="py-4 px-4 font-bold text-white group-hover:text-cyan-300 transition-colors">
                      {col.name}
                    </td>
                    <td className="py-4 px-4 font-mono text-cyan-300">/{col.slug}</td>
                    <td className="py-4 px-4">
                      {col.featured ? (
                        <span className="inline-flex items-center space-x-1 px-3 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>Featured</span>
                        </span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-block px-3 py-0.5 rounded-full text-[10px] font-black uppercase ${
                          col.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 border border-white/10'
                        }`}
                      >
                        {col.status || 'active'}
                      </span>
                    </td>
                    <td className="py-4 px-4 font-mono text-slate-400">{col.sortOrder ?? 0}</td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenModal(col)}
                        className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                        title="Edit collection"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(col._id)}
                        className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                        title="Delete collection"
                      >
                        <Trash2 className="w-4 h-4" />
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
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/80 backdrop-blur-md" />
          <div className="relative w-full max-w-md bg-[#0F172A] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 z-10 text-xs max-h-[90vh] overflow-y-auto border border-white/10 custom-scrollbar">
            <div className="flex justify-between items-center pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingCollection ? 'Edit Collection' : 'Create Collection'}
                </h3>
              </div>
              <button onClick={() => setIsModalOpen(false)} className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">Collection Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Summer Essentials"
                  className="w-full px-4 py-3 rounded-2xl admin-input"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">Image URL</label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Short description of this collection..."
                  className="w-full px-4 py-3 rounded-2xl admin-input leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">Sort Order</label>
                  <input
                    type="number"
                    value={formData.sortOrder}
                    onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                  >
                    <option value="active" className="bg-slate-900 text-white">Active</option>
                    <option value="inactive" className="bg-slate-900 text-white">Inactive</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="col-featured"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="rounded border-white/20 text-cyan-500 w-4 h-4 bg-slate-900"
                />
                <label htmlFor="col-featured" className="text-xs font-bold text-slate-300 cursor-pointer">
                  Feature on Storefront Homepage
                </label>
              </div>

              <div className="pt-3 flex justify-end space-x-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20"
                >
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
