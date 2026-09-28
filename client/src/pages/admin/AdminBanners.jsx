import React, { useState, useEffect } from 'react';
import {
  Image as ImageIcon,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Loader2,
  ExternalLink,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Upload,
} from 'lucide-react';
import api from '../../services/api';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
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

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    setIsUploadingImage(true);
    setFormError('');

    try {
      const res = await api.admin.uploadImage(data);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
        showToast('Slide image uploaded successfully from your device!');
      }
    } catch (err) {
      setFormError(err.message || 'Failed to upload image file');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveBanner = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.image) {
      setFormError('Please specify banner headline and upload or enter an image');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      if (editingBanner) {
        await api.banners.update(editingBanner._id, formData);
        showToast('Banner updated successfully on live storefront!');
      } else {
        await api.banners.create(formData);
        showToast('New promotional banner created and published!');
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
      showToast(`Banner visibility updated on storefront`);
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
            Marketing &amp; Hero Banners
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure homepage hero carousels, seasonal promotional slots, and direct CTA actions.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center space-x-2 self-start sm:self-auto shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Add New Banner</span>
        </button>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center space-y-3 admin-card rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs text-slate-400 font-bold">Loading promotional banners...</p>
        </div>
      ) : banners.length === 0 ? (
        <div className="p-16 text-center text-xs text-slate-400 admin-card rounded-3xl">
          No promotional banners configured yet. Create your first banner above.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {banners.map((banner) => (
            <div
              key={banner._id}
              className="admin-card rounded-3xl overflow-hidden flex flex-col justify-between group relative"
            >
              {/* Image Preview Banner */}
              <div className="relative h-52 sm:h-60 bg-slate-950 overflow-hidden">
                <img
                  src={banner.image}
                  alt=""
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-75"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                {/* Badge Position */}
                <div className="absolute top-4 left-4 flex items-center space-x-2">
                  <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-white text-slate-950 shadow-md">
                    {banner.position}
                  </span>
                  {banner.highlight && (
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md">
                      {banner.highlight}
                    </span>
                  )}
                </div>

                {/* Overlay Text */}
                <div className="absolute bottom-4 left-5 right-5 text-white">
                  <p className="text-lg font-black line-clamp-1">{banner.title}</p>
                  <p className="text-xs text-slate-300 line-clamp-1 mt-1 font-medium">
                    {banner.subtitle || 'Seasonal Promotional Campaign'}
                  </p>
                </div>
              </div>

              {/* Banner Details & Action Footer */}
              <div className="p-5 flex items-center justify-between gap-4 bg-white/[0.02] border-t border-white/10">
                <div className="text-xs">
                  <span className="font-semibold text-slate-300 flex items-center space-x-1.5">
                    <span>CTA:</span>
                    <strong className="text-white font-bold font-mono">"{banner.buttonText}"</strong>
                    <span className="text-cyan-400 font-mono text-[11px]">({banner.buttonLink})</span>
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleToggleActive(banner)}
                    className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                      banner.active
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-white/5 text-slate-400 border border-white/10'
                    }`}
                  >
                    {banner.active ? 'Active' : 'Disabled'}
                  </button>

                  <button
                    onClick={() => handleOpenModal(banner)}
                    className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(banner._id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-4 h-4" />
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-lg bg-[#0F172A] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-white/10 custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingBanner ? 'Edit Banner' : 'Create Promotional Banner'}
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

            <form onSubmit={handleSaveBanner} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Banner Headline *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. THE AUTUMN ELEGANCE COLLECTION"
                  className="w-full px-4 py-3 rounded-2xl admin-input"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Subtitle / Synopsis
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Crafted in London with sustainable Italian fine fabrics"
                  className="w-full px-4 py-3 rounded-2xl admin-input"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Highlight Badge Tag
                  </label>
                  <input
                    type="text"
                    value={formData.highlight}
                    onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                    placeholder="e.g. NEW SEASON"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Display Position
                  </label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                  >
                    <option value="hero" className="bg-slate-900 text-white">Homepage Main Hero</option>
                    <option value="promotional" className="bg-slate-900 text-white">Mid-page Promotional</option>
                    <option value="split" className="bg-slate-900 text-white">Split Double Feature</option>
                  </select>
                </div>
              </div>

              {/* Banner Image Upload & URL Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold uppercase text-slate-300">
                    Slide Image *
                  </label>
                  <span className="text-[10px] text-cyan-400 font-medium">Upload from device or enter URL</span>
                </div>

                {/* Direct File Upload Area */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className={`flex-1 w-full py-3 px-4 rounded-2xl border-2 border-dashed ${
                    formData.image ? 'border-cyan-500/40 bg-cyan-500/5' : 'border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.02]'
                  } transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs font-bold text-slate-300`}>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={isUploadingImage}
                      className="hidden"
                    />
                    {isUploadingImage ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-cyan-400" />
                        <span className="text-cyan-300">Uploading Slide Image...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4 text-cyan-400" />
                        <span>Upload Image File from Device (PNG, JPG, WEBP)</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Alternative URL Input */}
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="Or paste image URL (e.g. https://... or /uploads/...)"
                    className="w-full px-4 py-2.5 rounded-xl admin-input font-mono text-xs"
                  />
                  {formData.image && (
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, image: '' })}
                      className="absolute right-3 top-2.5 text-slate-400 hover:text-white text-xs"
                    >
                      Clear
                    </button>
                  )}
                </div>

                {/* Live Image Preview Card */}
                {formData.image && (
                  <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-slate-950/80 p-3 flex items-center space-x-3 mt-2">
                    <img
                      src={formData.image}
                      alt="Banner Preview"
                      className="w-20 h-14 object-cover rounded-xl border border-white/10 flex-shrink-0"
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div className="min-w-0 flex-1 text-xs">
                      <p className="font-bold text-white truncate">Image Attached</p>
                      <p className="text-[10px] text-slate-400 font-mono truncate">{formData.image}</p>
                      <span className="text-[9px] text-emerald-400 font-bold">✓ Ready for live storefront publish</span>
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="Explore Collection"
                    className="w-full px-4 py-3 rounded-2xl admin-input"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    CTA Target URL
                  </label>
                  <input
                    type="text"
                    value={formData.buttonLink}
                    onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                    placeholder="/shop or /category/women"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>
              </div>

              <div className="pt-2">
                <label className="flex items-center space-x-2 font-bold text-slate-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="rounded border-white/20 text-cyan-500 w-4 h-4 bg-slate-900"
                  />
                  <span>Active &amp; published immediately to live storefront</span>
                </label>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <div className="relative w-full max-w-sm bg-[#0F172A] p-6 rounded-3xl shadow-2xl space-y-4 z-10 border border-white/10">
            <h3 className="text-base font-extrabold text-white">Delete Banner</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to remove this promotional banner from the homepage?
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteBanner}
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

export default AdminBanners;
