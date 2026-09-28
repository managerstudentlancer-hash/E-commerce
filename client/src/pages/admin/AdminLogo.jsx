import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  UploadCloud,
  CheckCircle2,
  Trash2,
  ExternalLink,
  Loader2,
  Store,
  RefreshCw,
  Eye,
  Sliders,
  Image as ImageIcon,
  Check,
  AlertCircle,
} from 'lucide-react';
import api from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

const AdminLogo = () => {
  const { settings, refreshSettings } = useSettings();
  const [currentLogo, setCurrentLogo] = useState(settings?.logo || '');
  const [siteName, setSiteName] = useState(settings?.siteName || 'VEXIVO');
  const [customUrl, setCustomUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('light'); // 'light' | 'dark' | 'mobile'

  useEffect(() => {
    if (settings) {
      setCurrentLogo(settings.logo || '');
      setSiteName(settings.siteName || 'VEXIVO');
    }
  }, [settings]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  // Instant File Upload & Immediate Storefront Update
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showToast('Image file size must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const data = new FormData();
      data.append('image', file);
      const res = await api.admin.uploadImage(data);
      if (res.success && res.url) {
        const uploadedUrl = res.url;
        setCurrentLogo(uploadedUrl);

        // Instantly save to settings backend
        await api.settings.update({ logo: uploadedUrl });
        refreshSettings();
        showToast('Logo uploaded & updated live across storefront! 🎉');
      } else {
        showToast(res.message || 'Logo upload failed');
      }
    } catch (err) {
      showToast(err.message || 'Failed to upload logo image');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  // Apply custom URL directly
  const handleApplyUrl = async (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;

    setSaving(true);
    try {
      const urlToSave = customUrl.trim();
      setCurrentLogo(urlToSave);
      await api.settings.update({ logo: urlToSave });
      refreshSettings();
      setCustomUrl('');
      showToast('Custom logo URL applied & live on storefront! 🎉');
    } catch (err) {
      showToast(err.message || 'Failed to update logo URL');
    } finally {
      setSaving(false);
    }
  };

  // Reset to default brandmark
  const handleResetToDefault = async () => {
    setSaving(true);
    try {
      setCurrentLogo('');
      await api.settings.update({ logo: '' });
      refreshSettings();
      showToast('Reset to default brandmark successfully!');
    } catch (err) {
      showToast(err.message || 'Failed to reset logo');
    } finally {
      setSaving(false);
    }
  };

  // Update brand name
  const handleUpdateBrandName = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.settings.update({ siteName: siteName.trim() });
      refreshSettings();
      showToast('Brand name updated live across store!');
    } catch (err) {
      showToast(err.message || 'Failed to update brand name');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl animate-fade-in text-slate-100">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center space-x-2.5 bg-slate-900 text-white text-xs font-bold px-5 py-3.5 rounded-2xl shadow-2xl border border-emerald-500/40 glow-emerald animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/20 p-6 sm:p-8 rounded-3xl border border-cyan-500/25 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse glow-emerald" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              Live Brandmark Engine
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-1.5 flex items-center space-x-2.5">
            <span>Store Brand Logo Manager</span>
            <Sparkles className="w-6 h-6 text-amber-400" />
          </h1>
          <p className="text-xs text-slate-400 max-w-2xl mt-1 leading-relaxed">
            Upload and update your storefront brand logo anytime with instant real-time synchronization across desktop headers, mobile menus, and dark footers.
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <a
            href="/"
            target="_blank"
            rel="noreferrer"
            className="px-5 py-3 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-lg shadow-cyan-500/20 transition-all active:scale-95"
          >
            <span>View Live Storefront</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </div>

      {/* Main Grid: Upload & Controls + Live Multi-Platform Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Upload Controls (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Direct Image File Upload Box */}
          <div className="admin-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  1-Click Direct File Upload
                </h3>
              </div>
              <span className="text-[10px] font-mono text-cyan-300 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/20">
                Instant Auto-Save
              </span>
            </div>

            <p className="text-xs text-slate-400">
              Select or drop your new brand logo from your device. As soon as you select the file, it will be uploaded and applied live to the storefront immediately.
            </p>

            {/* Drag & Drop Upload Label */}
            <label
              className={`relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-3xl cursor-pointer transition-all ${
                uploading
                  ? 'border-cyan-400 bg-cyan-500/10'
                  : 'border-white/20 hover:border-cyan-400/80 bg-white/[0.02] hover:bg-white/[0.05]'
              }`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                disabled={uploading || saving}
                className="sr-only"
              />

              {uploading ? (
                <div className="flex flex-col items-center space-y-3 py-4 text-center">
                  <Loader2 className="w-10 h-10 animate-spin text-cyan-400" />
                  <div>
                    <p className="text-sm font-black text-white">Uploading &amp; Syncing Logo...</p>
                    <p className="text-xs text-cyan-300 mt-0.5">Updating all storefront components in real-time</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center space-y-3 py-3 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
                    <div className="w-full h-full bg-[#0C111D] rounded-[14px] flex items-center justify-center text-cyan-300">
                      <UploadCloud className="w-7 h-7" />
                    </div>
                  </div>
                  <div>
                    <span className="text-sm font-black text-white hover:text-cyan-300">
                      Click to choose file from computer / mobile
                    </span>
                    <p className="text-xs text-slate-400 mt-1">
                      PNG, SVG, JPG, WebP supported (Transparent PNG or SVG recommended)
                    </p>
                    <p className="text-[10px] text-cyan-400 font-mono mt-1">
                      Max file size: 5 MB • Best height: 35px - 60px
                    </p>
                  </div>
                </div>
              )}
            </label>
          </div>

          {/* 2. Direct Image URL Input */}
          <div className="admin-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
              <ImageIcon className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Or Use Online Image URL
              </h3>
            </div>

            <form onSubmit={handleApplyUrl} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://example.com/logo.png"
                  className="flex-1 px-4 py-3 rounded-2xl admin-input text-xs font-mono"
                />
                <button
                  type="submit"
                  disabled={saving || !customUrl.trim()}
                  className="px-6 py-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-50 text-slate-950 font-black text-xs flex items-center justify-center space-x-1.5 transition-all whitespace-nowrap active:scale-95"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin text-slate-950" /> : <Check className="w-4 h-4 text-slate-950" />}
                  <span>Apply URL Logo</span>
                </button>
              </div>
              <p className="text-[10px] text-slate-400">
                You can host your logo on Cloudinary, Imgur, AWS S3, or any external image host.
              </p>
            </form>
          </div>

          {/* 3. Brand Wordmark Text Quick Update */}
          <div className="admin-card p-6 rounded-3xl space-y-4">
            <div className="flex items-center space-x-2.5 pb-3 border-b border-white/10">
              <Store className="w-4 h-4 text-cyan-400" />
              <h3 className="text-xs font-black uppercase tracking-widest text-white">
                Brand Name Text (Site Title)
              </h3>
            </div>

            <form onSubmit={handleUpdateBrandName} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                required
                value={siteName}
                onChange={(e) => setSiteName(e.target.value)}
                placeholder="VEXIVO"
                className="flex-1 px-4 py-3 rounded-2xl admin-input text-xs font-bold uppercase tracking-wider"
              />
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs flex items-center justify-center space-x-1.5 transition-all whitespace-nowrap active:scale-95"
              >
                <span>Update Brand Name</span>
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Live Multi-Platform Visualizer (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="admin-card p-6 rounded-3xl space-y-5 sticky top-24">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center space-x-2.5">
                <Eye className="w-4 h-4 text-cyan-400" />
                <h3 className="text-xs font-black uppercase tracking-widest text-white">
                  Real-Time Live Previews
                </h3>
              </div>

              {currentLogo && (
                <button
                  type="button"
                  onClick={handleResetToDefault}
                  disabled={saving}
                  className="text-[11px] font-bold text-rose-400 hover:text-rose-300 flex items-center space-x-1 transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Reset to Default</span>
                </button>
              )}
            </div>

            {/* Current Active Logo Status */}
            <div className="p-3.5 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-between">
              <div className="flex items-center space-x-2.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <p className="text-xs font-bold text-white">
                    {currentLogo ? 'Custom Uploaded Logo Active' : 'Default Emblem Wordmark Active'}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono truncate max-w-[200px]">
                    {currentLogo ? currentLogo : 'Speedy Cart ★ + ' + siteName}
                  </p>
                </div>
              </div>

              <span className="px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                LIVE SYNCED
              </span>
            </div>

            {/* Preview Viewport Switcher */}
            <div className="flex rounded-2xl bg-slate-900 p-1 border border-white/10">
              <button
                type="button"
                onClick={() => setActiveTab('light')}
                className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all ${
                  activeTab === 'light'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Desktop Header
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('dark')}
                className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all ${
                  activeTab === 'dark'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dark Footer
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('mobile')}
                className={`flex-1 py-2 text-[11px] font-bold rounded-xl transition-all ${
                  activeTab === 'mobile'
                    ? 'bg-cyan-500 text-slate-950 shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Mobile Drawer
              </button>
            </div>

            {/* Visualizer Canvas */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              {/* Tab 1: Desktop Header Light */}
              {activeTab === 'light' && (
                <div className="bg-white p-5 text-neutral-900 space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                      Storefront Header Simulation (White Background)
                    </span>
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  </div>

                  <div className="py-4 flex items-center justify-between">
                    {/* Rendered Logo */}
                    {currentLogo ? (
                      <img
                        src={currentLogo}
                        alt="Brand Logo"
                        className="h-10 w-auto max-w-[170px] object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex items-center space-x-2.5">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 flex items-center justify-center text-white shadow-sm font-bold text-sm">
                          ★
                        </div>
                        <div className="flex flex-col">
                          <span className="text-xl font-extrabold tracking-tight text-neutral-950 leading-none">
                            {siteName.toLowerCase()}
                          </span>
                          <span className="text-[7px] font-black uppercase tracking-[0.25em] text-neutral-400 mt-0.5">
                            London
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="hidden sm:flex items-center space-x-3 text-[11px] font-bold text-neutral-500">
                      <span className="hover:text-black cursor-pointer">Shop</span>
                      <span className="hover:text-black cursor-pointer">Categories</span>
                      <span className="hover:text-black cursor-pointer">Search 🔍</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Dark Footer */}
              {activeTab === 'dark' && (
                <div className="bg-[#121212] p-5 text-white space-y-3">
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-800">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest text-neutral-400">
                      Dark Footer Simulation
                    </span>
                    <span className="w-2 h-2 rounded-full bg-cyan-400" />
                  </div>

                  <div className="py-4 space-y-3">
                    {currentLogo ? (
                      <img
                        src={currentLogo}
                        alt="Brand Logo Dark"
                        className="h-9 w-auto max-w-[160px] object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-extrabold tracking-tight text-white uppercase">
                          {siteName}
                        </span>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C4301C] mb-1" />
                      </div>
                    )}
                    <p className="text-[10px] text-neutral-400 leading-relaxed max-w-xs">
                      Curated luxury fashion, artisan footwear, fine jewellery, and lifestyle essentials.
                    </p>
                  </div>
                </div>
              )}

              {/* Tab 3: Mobile Drawer */}
              {activeTab === 'mobile' && (
                <div className="bg-neutral-50 p-4 text-neutral-900 space-y-3 max-w-[280px] mx-auto my-2 rounded-2xl border border-neutral-200 shadow-lg">
                  <div className="flex items-center justify-between pb-2 border-b border-neutral-200">
                    <span className="text-[9px] font-bold text-neutral-400 uppercase">Mobile Navigation</span>
                    <span className="text-xs text-neutral-400">✕</span>
                  </div>

                  <div className="py-2">
                    {currentLogo ? (
                      <img
                        src={currentLogo}
                        alt="Brand Logo Mobile"
                        className="h-7 w-auto max-w-[140px] object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span className="text-base font-extrabold tracking-tight text-neutral-900">
                        {siteName}
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-[11px] font-medium text-neutral-600 pt-2 border-t border-neutral-200">
                    <p className="py-1">🔥 New Arrivals</p>
                    <p className="py-1">👗 Women Wear</p>
                    <p className="py-1">👔 Men Wear</p>
                  </div>
                </div>
              )}
            </div>

            {/* Instruction Footer */}
            <div className="p-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-[11px] flex items-start space-x-2">
              <Sparkles className="w-4 h-4 flex-shrink-0 mt-0.5 text-cyan-400" />
              <span>
                Tip: Whenever you upload a file or apply a link here, it immediately updates across all customers' browsers without needing to restart the server!
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogo;
