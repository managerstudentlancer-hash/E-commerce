import React, { useState, useEffect } from 'react';
import {
  Image,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Loader2,
  ExternalLink,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete Confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    highlight: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    position: 'hero',
    active: true,
  });

  useEffect(() => {
    fetchBanners();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res = await api.banners.getAll();
      if (res.success) {
        setBanners(res.banners || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (banner = null) => {
    setFormError('');
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        highlight: banner.highlight || '',
        image: banner.image || '',
        buttonText: banner.buttonText || 'Shop Now',
        buttonLink: banner.buttonLink || '/shop',
        position: banner.position || 'hero',
        active: banner.active !== false,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        highlight: '',
        image: '',
        buttonText: 'Shop Collection',
        buttonLink: '/shop',
        position: 'hero',
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      setFormError('Please specify banner title and image URL');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      if (editingBanner) {
        await api.banners.update(editingBanner._id, formData);
        showToast('Banner updated successfully!');
      } else {
        await api.banners.create(formData);
        showToast('New promotional banner created!');
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      setFormError(err.message || 'Failed to save banner');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (banner) => {
    try {
      await api.banners.update(banner._id, { active: !banner.active });
      setBanners((prev) =>
        prev.map((b) => (b._id === banner._id ? { ...b, active: !b.active } : b))
      );
      showToast(`Banner visibility updated`);
    } catch (err) {
      showToast(err.message || 'Failed to toggle banner');
    }
  };

  const handleDeleteBanner = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await api.banners.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('Banner deleted successfully');
      fetchBanners();
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
            Marketing &amp; Hero Banners
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure homepage hero showcases, seasonal campaign banners, and call-to-action buttons.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5 self-start sm:self-auto font-bold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="p-16 flex items-center justify-center bg-white rounded-3xl border border-neutral-200">
          <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
        </div>
      ) : banners.length === 0 ? (
        <div className="p-16 text-center text-xs text-neutral-400 bg-white rounded-3xl border border-neutral-200">
          No promotional banners configured. Create your first banner above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-subtle flex flex-col justify-between group"
            >
              {/* Image Preview Banner */}
              <div className="relative h-48 sm:h-56 bg-neutral-900 overflow-hidden">
                <img
                  src={banner.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Badge Position */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-white text-black shadow">
                    {banner.position}
                  </span>
                  {banner.highlight && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-[#C4301C] text-white">
                      {banner.highlight}
                    </span>
                  )}
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <p className="text-base font-black line-clamp-1">{banner.title}</p>
                  <p className="text-xs text-neutral-300 line-clamp-1 mt-0.5">
                    {banner.subtitle || 'Promotional Campaign'}
                  </p>
                </div>
              </div>

              {/* Banner Details & Action Footer */}
              <div className="p-5 flex items-center justify-between gap-4 border-t border-neutral-100">
                <div className="text-xs">
                  <span className="font-semibold text-neutral-800 flex items-center space-x-1">
                    <span>CTA:</span>
                    <strong className="text-neutral-900 font-bold">"{banner.buttonText}"</strong>
                    <span className="text-neutral-400 font-mono">({banner.buttonLink})</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                      banner.active
                        ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                        : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                    }`}
                  >
                    {banner.active ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => handleOpenModal(banner)}
                    className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(banner._id)}
                    className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-red-600 hover:text-red-600 transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-neutral-900">
                {editingBanner ? 'Edit Banner' : 'Create Promotional Banner'}
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

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. THE AUTUMN ELEGANCE COLLECTION"
                  className="input-pill"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Subtitle / Sub-headline
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Crafted in London with sustainable fine fabrics"
                  className="input-pill"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Highlight Tag
                  </label>
                  <input
                    type="text"
                    value={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                    placeholder="e.g. NEW SEASON"
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Display Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-neutral-200 bg-white font-medium focus:outline-none focus:border-black"
                  >
                    <option value="hero">Homepage Main Hero</option>
                    <option value="promotional">Mid-page Promotional</option>
                    <option value="split">Split Double Feature</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Banner Image URL *
                </label>
                <input
                  type="url"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://images.unsplash.com/photo-..."
                  className="input-pill"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Explore Collection"
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    CTA Target Link
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="/shop or /category/women"
                    className="input-pill"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 font-semibold text-neutral-800 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-neutral-300 text-black w-4 h-4"
                  />
                  <span>Active &amp; published to live storefront</span>
                </label>
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
                  <span>{isSaving ? 'Saving...' : 'Save Banner'}</span>
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
            <h3 className="text-base font-extrabold text-neutral-900">Delete Banner</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to delete this homepage banner?
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-pill-light py-2 px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBanner}
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

export default AdminBanners;
