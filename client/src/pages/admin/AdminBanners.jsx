import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, Check, X, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    highlight: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    position: 'hero',
    sortOrder: 1,
    active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.banners.getAll();
      if (res.success) setBanners(res.banners || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) return;

    try {
      await api.banners.create(formData);
      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      alert(err.message || 'Failed to save banner');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this banner?')) return;
    try {
      await api.banners.delete(id);
      setBanners(banners.filter((b) => b._id !== id));
    } catch (err) {
      alert('Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Hero & Promo Banner Management
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure homepage hero slider sequences and split banners.
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Add Banner</span>
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
                  <th className="py-4 px-6">Preview</th>
                  <th className="py-4 px-4">Headline</th>
                  <th className="py-4 px-4">Position</th>
                  <th className="py-4 px-4">CTA Link</th>
                  <th className="py-4 px-4">Order</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {banners.map((b) => (
                  <tr key={b._id} className="hover:bg-neutral-50">
                    <td className="py-3 px-6">
                      <img src={b.image} alt="" className="w-16 h-10 object-cover rounded-lg border" />
                    </td>
                    <td className="py-3 px-4 font-bold text-neutral-900 max-w-[200px] truncate">
                      {b.title}
                    </td>
                    <td className="py-3 px-4 uppercase text-[10px] font-bold tracking-wider">
                      {b.position}
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-neutral-500">{b.buttonLink}</td>
                    <td className="py-3 px-4">{b.sortOrder}</td>
                    <td className="py-3 px-6 text-right">
                      <button
                        onClick={() => handleDelete(b._id)}
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

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div onClick={() => setIsModalOpen(false)} className="fixed inset-0 bg-black/50 backdrop-blur-sm" />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl space-y-4 z-10 text-xs">
            <div className="flex justify-between items-center pb-2 border-b border-neutral-100">
              <h3 className="text-sm font-bold text-neutral-900">Add New Banner</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-neutral-400 hover:text-black">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Headline Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. DEFINING CONTEMPORARY LUXURY"
                  className="input-pill"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Subtitle</label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. SPRING / SUMMER 2026 CAPSULE"
                  className="input-pill"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">Image URL *</label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="input-pill"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">Position</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-full border border-neutral-200 bg-white"
                  >
                    <option value="hero">Hero Slider</option>
                    <option value="promotional">Promotional</option>
                    <option value="split">Split Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    className="input-pill"
                  />
                </div>
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
                  Save Banner
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminBanners;
