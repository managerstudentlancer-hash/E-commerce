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
  Layers,
  Filter,
  Eye,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import api from '../../services/api';

const POSITION_LABELS = {
  hero: { label: 'Hero Slideshow', badge: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30' },
  'dual-left': { label: 'Dual Promo — Left Card', badge: 'bg-amber-500/20 text-amber-300 border-amber-500/30' },
  'dual-right': { label: 'Dual Promo — Right Card', badge: 'bg-rose-500/20 text-rose-300 border-rose-500/30' },
  promotional: { label: 'Promotional Mid-Page', badge: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' },
  split: { label: 'Split Double Feature', badge: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30' },
  'footer-banner': { label: 'Footer Banner', badge: 'bg-purple-500/20 text-purple-300 border-purple-500/30' },
};

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

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
    tag: '',
    productBadge: '',
    image: '',
    buttonText: 'Shop Now',
    buttonLink: '/shop',
    position: 'hero',
    active: true,
    sortOrder: 0,
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

  const handleOpenModal = (banner = null, defaultPosition = 'hero') => {
    setFormError('');
    if (banner) {
      setEditingBanner(banner);
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        highlight: banner.highlight || '',
        tag: banner.tag || '',
        productBadge: banner.productBadge || '',
        image: banner.image || '',
        buttonText: banner.buttonText || 'Shop Now',
        buttonLink: banner.buttonLink || '/shop',
        position: banner.position || 'hero',
        active: banner.active !== false,
        sortOrder: banner.sortOrder || 0,
      });
    } else {
      setEditingBanner(null);
      setFormData({
        title: '',
        subtitle: '',
        highlight: '',
        tag: defaultPosition === 'dual-left' ? 'AUTUMN ATELIER' : defaultPosition === 'dual-right' ? 'RESORT COLLECTION' : 'NEW SEASON',
        productBadge: defaultPosition === 'dual-left' ? 'Pure Cashmere Blend' : defaultPosition === 'dual-right' ? '100% Mulberry Silk' : '',
        image: '',
        buttonText: defaultPosition.includes('dual') ? 'Explore Suiting' : 'Shop Collection',
        buttonLink: '/shop',
        position: defaultPosition !== 'all' ? defaultPosition : 'hero',
        active: true,
        sortOrder: 0,
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);
    data.append('folder', 'banners');
    if (editingBanner?._id) data.append('bannerId', editingBanner._id);
    setIsUploadingImage(true);
    setFormError('');

    try {
      const res = await api.admin.uploadImage(data);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
        showToast('Banner image uploaded successfully!');
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
        showToast('New banner created and published to storefront!');
      }

      window.dispatchEvent(new Event('vexivo_banners_updated'));
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
      window.dispatchEvent(new Event('vexivo_banners_updated'));
      showToast(`Banner visibility updated on live storefront`);
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
      window.dispatchEvent(new Event('vexivo_banners_updated'));
      showToast('Banner deleted successfully');
      fetchBanners();
    } catch (err) {
      showToast(err.message || 'Deletion failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const filteredBanners = banners.filter((b) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'hero') return b.position === 'hero';
    if (activeTab === 'dual') return b.position === 'dual-left' || b.position === 'dual-right';
    if (activeTab === 'dual-left') return b.position === 'dual-left';
    if (activeTab === 'dual-right') return b.position === 'dual-right';
    if (activeTab === 'promotional') return b.position === 'promotional' || b.position === 'split' || b.position === 'footer-banner';
    return true;
  });

  const heroCount = banners.filter((b) => b.position === 'hero').length;
  const dualLeftCount = banners.filter((b) => b.position === 'dual-left').length;
  const dualRightCount = banners.filter((b) => b.position === 'dual-right').length;
  const promoCount = banners.filter((b) => b.position === 'promotional' || b.position === 'split' || b.position === 'footer-banner').length;

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
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center space-x-2.5">
            <span>Marketing &amp; Live Banners</span>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Live Connected
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Manage Homepage Hero carousels, Live Dual Promotional Cards (Left &amp; Right), and campaign CTA banners.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs flex items-center space-x-1.5 border border-white/10 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>View Live Store</span>
          </a>

          <button
            onClick={() => handleOpenModal(null, activeTab !== 'all' ? activeTab : 'hero')}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
          >
            <Plus className="w-4 h-4 text-slate-950" />
            <span>Add New Banner</span>
          </button>
        </div>
      </div>

      {/* Dual Banner Quick Notice / Info Pill */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-rose-500/10 to-indigo-500/10 border border-amber-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center flex-shrink-0 text-amber-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="font-bold text-white">Dual Promotional Section (Left &amp; Right Cards)</p>
            <p className="text-[11px] text-slate-400">
              Admin can customize both side-by-side cards ("Bespoke Italian Outerwear" on Left, "Effortless Silk Eveningwear" on Right) with live tags, titles, badges, and auto-rotation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-end md:self-auto">
          <button
            onClick={() => handleOpenModal(null, 'dual-left')}
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 font-bold text-[11px] border border-amber-500/30 flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Left Card</span>
          </button>
          <button
            onClick={() => handleOpenModal(null, 'dual-right')}
            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 font-bold text-[11px] border border-rose-500/30 flex items-center space-x-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Add Right Card</span>
          </button>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 border-b border-white/10 text-xs font-bold custom-scrollbar">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
            activeTab === 'all'
              ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>All Banners</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'all' ? 'bg-slate-950 text-cyan-400' : 'bg-white/10 text-slate-300'}`}>
            {banners.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('hero')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
            activeTab === 'hero'
              ? 'bg-indigo-500 text-white font-black shadow-md shadow-indigo-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>Hero Slideshow</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'hero' ? 'bg-white text-indigo-900' : 'bg-white/10 text-slate-300'}`}>
            {heroCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dual-left')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
            activeTab === 'dual-left'
              ? 'bg-amber-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>Dual Banner (Left Side)</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'dual-left' ? 'bg-slate-950 text-amber-400' : 'bg-white/10 text-slate-300'}`}>
            {dualLeftCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('dual-right')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
            activeTab === 'dual-right'
              ? 'bg-rose-500 text-white font-black shadow-md shadow-rose-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>Dual Banner (Right Side)</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'dual-right' ? 'bg-white text-rose-900' : 'bg-white/10 text-slate-300'}`}>
            {dualRightCount}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('promotional')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center space-x-2 flex-shrink-0 ${
            activeTab === 'promotional'
              ? 'bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20'
              : 'bg-white/5 text-slate-400 hover:text-white hover:bg-white/10'
          }`}
        >
          <span>Promotional / Split</span>
          <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${activeTab === 'promotional' ? 'bg-slate-950 text-emerald-400' : 'bg-white/10 text-slate-300'}`}>
            {promoCount}
          </span>
        </button>
      </div>

      {/* Banners Grid */}
      {loading ? (
        <div className="p-20 flex flex-col items-center justify-center space-y-3 admin-card rounded-3xl">
          <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
          <p className="text-xs text-slate-400 font-bold">Loading promotional banners...</p>
        </div>
      ) : filteredBanners.length === 0 ? (
        <div className="p-16 text-center text-xs text-slate-400 admin-card rounded-3xl space-y-3">
          <p>No banners found for this filter tab.</p>
          <button
            onClick={() => handleOpenModal(null, activeTab !== 'all' ? activeTab : 'hero')}
            className="px-4 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 font-bold hover:bg-cyan-500/30 transition-colors"
          >
            + Create Banner in this slot
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredBanners.map((banner) => {
            const posConfig = POSITION_LABELS[banner.position] || {
              label: banner.position,
              badge: 'bg-white/10 text-white border-white/20',
            };

            return (
              <div
                key={banner._id}
                className="admin-card rounded-3xl overflow-hidden flex flex-col justify-between group relative border border-white/10 hover:border-cyan-500/30 transition-all shadow-lg"
              >
                {/* Image Preview Banner */}
                <div className="relative h-56 bg-slate-950 overflow-hidden">
                  <img
                    src={banner.image}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-80"
                    onError={(e) => {
                      e.currentTarget.src =
                        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=85';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

                  {/* Position Badge & Custom Tags */}
                  <div className="absolute top-4 left-4 flex flex-wrap items-center gap-1.5 z-10">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase border ${posConfig.badge}`}>
                      {posConfig.label}
                    </span>
                    {banner.tag && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-white/90 text-slate-950 shadow-md">
                        {banner.tag}
                      </span>
                    )}
                    {banner.highlight && (
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-md">
                        {banner.highlight}
                      </span>
                    )}
                  </div>

                  {/* Product Badge Pill (Bottom Right) */}
                  {banner.productBadge && (
                    <div className="absolute top-4 right-4 z-10 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-white/20 text-[9px] font-bold text-amber-300">
                      ★ {banner.productBadge}
                    </div>
                  )}

                  {/* Overlay Headline & Subtitle */}
                  <div className="absolute bottom-4 left-5 right-5 text-white">
                    <p className="text-lg font-black line-clamp-1">{banner.title}</p>
                    <p className="text-xs text-slate-300 line-clamp-1 mt-0.5 font-medium">
                      {banner.subtitle || 'Promotional Campaign'}
                    </p>
                  </div>
                </div>

                {/* Banner Details & Action Footer */}
                <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/[0.02] border-t border-white/10">
                  <div className="text-xs space-y-0.5">
                    <div className="font-semibold text-slate-300 flex items-center space-x-1.5 flex-wrap">
                      <span className="text-slate-400">CTA:</span>
                      <strong className="text-white font-bold font-mono">"{banner.buttonText}"</strong>
                      <span className="text-cyan-400 font-mono text-[11px]">→ {banner.buttonLink}</span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 self-end sm:self-auto">
                    <button
                      onClick={() => handleToggleActive(banner)}
                      className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                        banner.active
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-white/5 text-slate-400 border border-white/10'
                      }`}
                    >
                      {banner.active ? '● Live Active' : '○ Paused'}
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
            );
          })}
        </div>
      )}

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-xl bg-[#0F172A] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-5 z-10 max-h-[90vh] overflow-y-auto border border-white/10 custom-scrollbar">
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-extrabold text-white">
                  {editingBanner ? 'Edit Promotional Banner' : 'Create Live Banner'}
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
              {/* Position Selection */}
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Banner Placement Slot *</span>
                  <span className="text-[10px] text-cyan-400 font-normal">Controls where this card appears</span>
                </label>
                <select
                  value={formData.position}
                  onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                >
                  <option value="dual-left" className="bg-slate-900 text-white">
                    ★ Dual Promo Banner — Left Card (e.g. Bespoke Italian Outerwear)
                  </option>
                  <option value="dual-right" className="bg-slate-900 text-white">
                    ★ Dual Promo Banner — Right Card (e.g. Effortless Silk Eveningwear)
                  </option>
                  <option value="hero" className="bg-slate-900 text-white">
                    Homepage Main Hero Slideshow
                  </option>
                  <option value="promotional" className="bg-slate-900 text-white">
                    Mid-page Promotional Banner
                  </option>
                  <option value="split" className="bg-slate-900 text-white">
                    Split Double Feature
                  </option>
                  <option value="footer-banner" className="bg-slate-900 text-white">
                    Footer Promotional Banner
                  </option>
                </select>
              </div>

              {/* Title & Subtitle */}
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Headline Title *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Bespoke Italian Outerwear or Effortless Silk Eveningwear"
                  className="w-full px-4 py-3 rounded-2xl admin-input font-bold text-sm"
                />
              </div>

              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Subtitle / Description
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Pure cashmere coats and masterfully tailored silhouettes."
                  className="w-full px-4 py-3 rounded-2xl admin-input"
                />
              </div>

              {/* Tag & Product Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Category Tag / Capsule
                  </label>
                  <input
                    type="text"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    placeholder="e.g. AUTUMN ATELIER or RESORT COLLECTION"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Floating Product Badge
                  </label>
                  <input
                    type="text"
                    value={formData.productBadge}
                    onChange={(e) => setFormData({ ...formData, productBadge: e.target.value })}
                    placeholder="e.g. Pure Cashmere Blend or 100% Mulberry Silk"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                  />
                </div>
              </div>

              {/* Banner Image Upload & URL */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold uppercase text-slate-300">
                    Banner / Product Image *
                  </label>
                  <span className="text-[10px] text-cyan-400 font-medium">Upload from device or enter URL</span>
                </div>

                {/* Direct File Upload Area */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label
                    className={`flex-1 w-full py-3 px-4 rounded-2xl border-2 border-dashed ${
                      formData.image
                        ? 'border-cyan-500/40 bg-cyan-500/5'
                        : 'border-white/10 hover:border-cyan-500/40 hover:bg-white/[0.02]'
                    } transition-all cursor-pointer flex items-center justify-center space-x-2 text-xs font-bold text-slate-300`}
                  >
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
                        <span className="text-cyan-300">Uploading Image...</span>
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
                    placeholder="Or paste image URL (e.g. https://images.unsplash.com/...)"
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
                        e.currentTarget.src =
                          'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80';
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

              {/* Button Text & Link */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    CTA Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="e.g. Explore Suiting or View Lookbook"
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
                    placeholder="e.g. /category/men-wear or /category/women-wear"
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
                  className="px-8 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black flex items-center space-x-2 shadow-lg shadow-cyan-500/20 cursor-pointer"
                >
                  {isSaving ? (
                    <Loader2 className="w-4 h-4 animate-spin text-slate-950" />
                  ) : (
                    <Check className="w-4 h-4 text-slate-950" />
                  )}
                  <span>{isSaving ? 'Saving...' : 'Save & Publish Banner'}</span>
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
