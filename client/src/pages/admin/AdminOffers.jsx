import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  Gift,
  Plus,
  Search,
  Edit2,
  Trash2,
  Eye,
  EyeOff,
  Check,
  X,
  RotateCcw,
  Loader2,
  Tag,
  Clock,
  Crown,
  Flame,
  Ticket,
  AlertCircle,
  ExternalLink,
  Image as ImageIcon,
} from 'lucide-react';
import api from '../../services/api';

const sectionOptions = [
  { id: 'all', label: 'All Offers', icon: Sparkles },
  { id: 'saree-deals', label: "Today's Saree Deals", icon: Tag },
  { id: 'coupons', label: 'Coupons & Codes', icon: Ticket },
  { id: 'exclusive-offers', label: 'Exclusive Offers', icon: Crown },
  { id: 'festival-offers', label: 'Festival Specials', icon: Flame },
  { id: 'flash-deals', label: 'Limited-Time Deals', icon: Clock },
];

const sampleOfferImages = [
  { name: 'Banarasi Silk Red', url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80' },
  { name: 'Kanjivaram Gold', url: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80' },
  { name: 'Chanderi Handloom', url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80' },
  { name: 'Embroidered Organza', url: 'https://images.unsplash.com/photo-1610030469668-9655ec843f55?auto=format&fit=crop&w=800&q=80' },
  { name: 'Designer Georgette', url: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&w=800&q=80' },
  { name: 'Festive Hamper', url: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=800&q=80' },
  { name: 'Luxury Jewelry', url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80' },
  { name: 'Beauty Tint', url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80' },
];

const AdminOffers = () => {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSection, setSelectedSection] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [saving, setSaving] = useState(false);
  const [actionMsg, setActionMsg] = useState('');

  // Form State
  const initialForm = {
    section: 'saree-deals',
    title: '',
    subtitle: '',
    code: '',
    discountPercent: 40,
    discountText: '',
    originalPrice: '',
    discountedPrice: '',
    minimumOrder: '',
    fabric: '',
    category: 'Women Wear',
    image: '',
    badge: 'Trending Deal',
    validity: 'Valid till midnight',
    link: '/category/women-wear',
    season: 'Festive Special',
    inStock: 10,
    unitsSold: 0,
    unitsTotal: 20,
    endsInMinutes: 60,
    active: true,
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchOffers = async () => {
    try {
      setLoading(true);
      const res = await api.offers.getAdminAll(selectedSection);
      if (res.success && res.offers) {
        setOffers(res.offers);
      }
    } catch (err) {
      console.error('Failed to load offers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [selectedSection]);

  const showFeedback = (msg) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(''), 3000);
  };

  const handleOpenCreate = () => {
    setEditingOffer(null);
    setFormData({
      ...initialForm,
      section: selectedSection === 'all' ? 'saree-deals' : selectedSection,
    });
    setModalOpen(true);
  };

  const handleOpenEdit = (offer) => {
    setEditingOffer(offer);
    setFormData({
      section: offer.section || 'saree-deals',
      title: offer.title || '',
      subtitle: offer.subtitle || '',
      code: offer.code || '',
      discountPercent: offer.discountPercent ?? '',
      discountText: offer.discountText || '',
      originalPrice: offer.originalPrice ?? '',
      discountedPrice: offer.discountedPrice ?? '',
      minimumOrder: offer.minimumOrder ?? '',
      fabric: offer.fabric || '',
      category: offer.category || 'Women Wear',
      image: offer.image || '',
      badge: offer.badge || '',
      validity: offer.validity || '',
      link: offer.link || '/shop',
      season: offer.season || 'Festive Special',
      inStock: offer.inStock ?? 10,
      unitsSold: offer.unitsSold ?? 0,
      unitsTotal: offer.unitsTotal ?? 20,
      endsInMinutes: offer.endsInMinutes ?? 60,
      active: offer.active !== undefined ? offer.active : true,
    });
    setModalOpen(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.title) {
      alert('Please provide a title for the offer.');
      return;
    }

    try {
      setSaving(true);
      const payload = {
        ...formData,
        discountPercent: Number(formData.discountPercent) || 0,
        originalPrice: Number(formData.originalPrice) || 0,
        discountedPrice: Number(formData.discountedPrice) || 0,
        minimumOrder: Number(formData.minimumOrder) || 0,
        inStock: Number(formData.inStock) || 0,
        unitsSold: Number(formData.unitsSold) || 0,
        unitsTotal: Number(formData.unitsTotal) || 0,
        endsInMinutes: Number(formData.endsInMinutes) || 60,
      };

      if (editingOffer) {
        await api.offers.update(editingOffer._id, payload);
        showFeedback('Offer updated successfully! Live on Storefront.');
      } else {
        await api.offers.create(payload);
        showFeedback('New offer created successfully! Live on Storefront.');
      }

      setModalOpen(false);
      fetchOffers();
    } catch (err) {
      alert(err.message || 'Failed to save offer');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (id) => {
    try {
      const res = await api.offers.toggle(id);
      if (res.success) {
        setOffers((prev) =>
          prev.map((item) => (item._id === id ? { ...item, active: res.offer.active } : item))
        );
        showFeedback(res.message);
      }
    } catch (err) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete offer "${title}"?`)) return;

    try {
      const res = await api.offers.delete(id);
      if (res.success) {
        setOffers((prev) => prev.filter((item) => item._id !== id));
        showFeedback('Offer deleted successfully from live store');
      }
    } catch (err) {
      alert(err.message || 'Failed to delete offer');
    }
  };

  const handleResetDefaults = async () => {
    if (
      !window.confirm(
        'Reset all offers to store defaults? This will restore original saree deals, coupons, and flash specials.'
      )
    ) {
      return;
    }

    try {
      setLoading(true);
      const res = await api.offers.resetDefault();
      if (res.success) {
        setOffers(res.offers);
        showFeedback('Offers reset to defaults and live on store!');
      }
    } catch (err) {
      alert(err.message || 'Failed to reset offers');
    } finally {
      setLoading(false);
    }
  };

  // Filtered offers by search query
  const filteredOffers = offers.filter((o) => {
    const q = searchQuery.toLowerCase();
    return (
      (o.title && o.title.toLowerCase().includes(q)) ||
      (o.code && o.code.toLowerCase().includes(q)) ||
      (o.fabric && o.fabric.toLowerCase().includes(q)) ||
      (o.category && o.category.toLowerCase().includes(q)) ||
      (o.section && o.section.toLowerCase().includes(q))
    );
  });

  const activeCount = offers.filter((o) => o.active).length;
  const sareeCount = offers.filter((o) => o.section === 'saree-deals').length;
  const couponCount = offers.filter((o) => o.section === 'coupons').length;
  const flashCount = offers.filter((o) => o.section === 'flash-deals').length;

  return (
    <div className="space-y-6">
      {/* Top Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-3xl border border-white/10 backdrop-blur-xl">
        <div>
          <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Gift className="w-4 h-4" />
            <span>Storefront Promotions Management</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Offers &amp; Deals Live Control
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Add, edit, price, and toggle today's saree deals, promo coupons, flash sales, and festival campaigns live on the customer store.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/offers"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-bold text-xs border border-white/15 flex items-center space-x-1.5 transition-all shadow-sm"
            title="Open customer offers page in new tab"
          >
            <span>View Live Offers Page</span>
            <ExternalLink className="w-3.5 h-3.5 text-rose-300" />
          </Link>

          <button
            onClick={handleResetDefaults}
            className="px-4 py-2.5 rounded-2xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs border border-white/10 flex items-center space-x-2 transition-all"
            title="Reset catalog offers to default templates"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Defaults</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold text-xs flex items-center space-x-2 shadow-lg hover:shadow-rose-500/20 transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Offer</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Deals</div>
          <div className="text-2xl font-black text-white mt-1">{offers.length}</div>
          <div className="text-[10px] text-emerald-400 font-semibold mt-0.5">{activeCount} Live Online</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Saree Deals</div>
          <div className="text-2xl font-black text-rose-400 mt-1">{sareeCount}</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Banarasi &amp; Silk</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Active Coupons</div>
          <div className="text-2xl font-black text-amber-300 mt-1">{couponCount}</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Voucher Codes</div>
        </div>
        <div className="bg-slate-900/40 border border-white/5 rounded-2xl p-4">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Flash Sales</div>
          <div className="text-2xl font-black text-purple-400 mt-1">{flashCount}</div>
          <div className="text-[10px] text-slate-400 font-semibold mt-0.5">Countdown Timers</div>
        </div>
      </div>

      {/* Action Notification Toast */}
      {actionMsg && (
        <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-fade-in">
          <Check className="w-4 h-4 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      {/* Section Filter Tabs & Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Horizontal Section Pills */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-1">
          {sectionOptions.map((sec) => {
            const Icon = sec.icon;
            const isSelected = selectedSection === sec.id;
            return (
              <button
                key={sec.id}
                onClick={() => setSelectedSection(sec.id)}
                className={`flex-shrink-0 flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-rose-500 text-white shadow-md shadow-rose-500/20'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{sec.label}</span>
              </button>
            );
          })}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search deals, codes, fabrics..."
            className="w-full bg-slate-800/80 border border-white/10 rounded-xl pl-9 pr-3.5 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-rose-500"
          />
        </div>
      </div>

      {/* Offers Table / Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
          <p className="text-xs text-slate-400">Syncing offers database...</p>
        </div>
      ) : filteredOffers.length === 0 ? (
        <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-12 text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-slate-400">
            <Gift className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-white">No Offers Found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            No active promotional deals match your selected category or search filter.
          </p>
          <button
            onClick={handleOpenCreate}
            className="btn-pill-dark px-5 py-2 text-xs font-bold mt-2"
          >
            Create Offer
          </button>
        </div>
      ) : (
        <div className="bg-slate-900/50 border border-white/10 rounded-3xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/70 text-slate-400 font-bold uppercase tracking-wider border-b border-white/10 text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Offer / Product</th>
                  <th className="py-3.5 px-4">Section</th>
                  <th className="py-3.5 px-4">Discount &amp; Price</th>
                  <th className="py-3.5 px-4">Validity / Code</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-200">
                {filteredOffers.map((offer) => (
                  <tr key={offer._id} className="hover:bg-white/[0.02] transition-colors">
                    {/* Item Image + Title */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center space-x-3">
                        {offer.image ? (
                          <img
                            src={offer.image}
                            alt={offer.title}
                            className="w-11 h-11 rounded-xl object-cover border border-white/10 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center text-slate-400 flex-shrink-0">
                            <Tag className="w-5 h-5" />
                          </div>
                        )}
                        <div className="min-w-0 max-w-[200px] sm:max-w-xs">
                          <p className="font-bold text-white text-xs truncate">{offer.title}</p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {offer.fabric ? `${offer.fabric} • ` : ''}
                            {offer.category || 'Women Fashion'}
                          </p>
                          {offer.badge && (
                            <span className="inline-block mt-0.5 text-[9px] font-black px-2 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                              {offer.badge}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Section Badge */}
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase tracking-wider bg-white/5 border border-white/10 text-slate-300">
                        {offer.section}
                      </span>
                    </td>

                    {/* Discount & Price */}
                    <td className="py-3.5 px-4">
                      {offer.discountedPrice > 0 ? (
                        <div>
                          <div className="font-bold text-white text-xs">
                            ₹{offer.discountedPrice.toLocaleString('en-IN')}
                            <span className="text-[10px] text-slate-500 line-through ml-1.5 font-normal">
                              ₹{offer.originalPrice?.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[10px] font-bold text-emerald-400">
                            {offer.discountPercent ? `${offer.discountPercent}% OFF` : offer.discountText}
                          </span>
                        </div>
                      ) : (
                        <div className="font-bold text-rose-300">
                          {offer.discountText || (offer.discountPercent ? `${offer.discountPercent}% OFF` : 'Special Deal')}
                        </div>
                      )}
                    </td>

                    {/* Code & Validity */}
                    <td className="py-3.5 px-4">
                      {offer.code ? (
                        <div className="inline-block font-mono font-bold text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2 py-0.5 rounded-lg text-[11px]">
                          {offer.code}
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-300 font-medium">{offer.validity || 'Ongoing'}</div>
                      )}
                      {offer.minimumOrder > 0 && (
                        <div className="text-[10px] text-slate-400 mt-0.5">Min Order: ₹{offer.minimumOrder}</div>
                      )}
                    </td>

                    {/* Active Toggle */}
                    <td className="py-3.5 px-4">
                      <button
                        onClick={() => handleToggleStatus(offer._id)}
                        className={`inline-flex items-center space-x-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-all ${
                          offer.active
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : 'bg-slate-800 text-slate-500 border border-slate-700'
                        }`}
                      >
                        {offer.active ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>Active</span>
                          </>
                        ) : (
                          <span>Inactive</span>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleOpenEdit(offer)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
                          title="Edit Offer"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(offer._id, offer.title)}
                          className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-rose-400 hover:text-rose-300 transition-colors"
                          title="Delete Offer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Offer Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-white/15 rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 animate-fade-in text-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <h3 className="text-xl font-black text-white">
                  {editingOffer ? 'Edit Promotional Offer' : 'Create New Promotional Offer'}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Set live discount rates, images, vouchers, and product links.
                </p>
              </div>
              <button
                onClick={() => setModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              {/* Row 1: Section & Badge */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Offer Section
                  </label>
                  <select
                    value={formData.section}
                    onChange={(e) => setFormData({ ...formData, section: e.target.value })}
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  >
                    <option value="saree-deals">Today's Saree Deals</option>
                    <option value="coupons">Coupons &amp; Promo Codes</option>
                    <option value="exclusive-offers">Exclusive Offers</option>
                    <option value="festival-offers">Festival Specials</option>
                    <option value="flash-deals">Limited-Time Flash Deals</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Badge Tag (e.g. Trending Deal, Bestseller)
                  </label>
                  <input
                    type="text"
                    value={formData.badge}
                    onChange={(e) => setFormData({ ...formData, badge: e.target.value })}
                    placeholder="e.g. Top Pick, Trending Deal, Bestseller"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Row 2: Title & Subtitle */}
              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Offer Title / Item Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Pure Banarasi Silk Saree"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                  Subtitle / Highlights Description
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. Woven with gold zari floral motifs & rich pallu"
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                />
              </div>

              {/* Coupon Code (if coupon section) */}
              {formData.section === 'coupons' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-3 bg-white/5 rounded-2xl border border-white/10">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-300 uppercase mb-1">
                      Coupon Code (e.g. SAVE100)
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                      placeholder="e.g. SAVE100, SAREE20, FESTIVE40"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 font-mono font-bold text-amber-300 focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Min Order Value (₹)
                    </label>
                    <input
                      type="number"
                      value={formData.minimumOrder}
                      onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                      placeholder="e.g. 999"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                    />
                  </div>
                </div>
              )}

              {/* Festival Specials Season Field */}
              {formData.section === 'festival-offers' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-300 uppercase mb-1">
                      Festival Season Tag
                    </label>
                    <input
                      type="text"
                      value={formData.season}
                      onChange={(e) => setFormData({ ...formData, season: e.target.value })}
                      placeholder="e.g. Festive Gala, Diwali Special, Wedding Edition"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Category
                    </label>
                    <input
                      type="text"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      placeholder="e.g. Bridal &amp; Festive"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              )}

              {/* Flash Deals Timer & Sold Controls */}
              {formData.section === 'flash-deals' && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3 bg-rose-500/10 rounded-2xl border border-rose-500/20">
                  <div>
                    <label className="block text-[11px] font-bold text-rose-300 uppercase mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      value={formData.endsInMinutes}
                      onChange={(e) => setFormData({ ...formData, endsInMinutes: e.target.value })}
                      placeholder="e.g. 60"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Units Claimed
                    </label>
                    <input
                      type="number"
                      value={formData.unitsSold}
                      onChange={(e) => setFormData({ ...formData, unitsSold: e.target.value })}
                      placeholder="e.g. 18"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                      Total Available
                    </label>
                    <input
                      type="number"
                      value={formData.unitsTotal}
                      onChange={(e) => setFormData({ ...formData, unitsTotal: e.target.value })}
                      placeholder="e.g. 25"
                      className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-400"
                    />
                  </div>
                </div>
              )}

              {/* Row 3: Pricing & Discount */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Original Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                    placeholder="e.g. 4999"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Discounted Deal Price (₹)
                  </label>
                  <input
                    type="number"
                    value={formData.discountedPrice}
                    onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                    placeholder="e.g. 2999"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Discount % / Text
                  </label>
                  <input
                    type="text"
                    value={formData.discountPercent || formData.discountText}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (!isNaN(val) && val.trim() !== '') {
                        setFormData({ ...formData, discountPercent: val, discountText: `${val}% OFF` });
                      } else {
                        setFormData({ ...formData, discountText: val });
                      }
                    }}
                    placeholder="e.g. 40 or 40% OFF"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Row 4: Fabric / Category & Validity */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Fabric / Material
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. Katan Silk, Mulberry Silk, Organza"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Validity Text
                  </label>
                  <input
                    type="text"
                    value={formData.validity}
                    onChange={(e) => setFormData({ ...formData, validity: e.target.value })}
                    placeholder="e.g. Valid till 11:59 PM today"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Image URL with Preview & Quick Presets */}
              <div className="space-y-2">
                <label className="block text-[11px] font-bold text-slate-300 uppercase">
                  Image URL
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="flex-1 bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Preview"
                      className="w-10 h-10 rounded-xl object-cover border border-white/20 flex-shrink-0"
                      onError={(e) => (e.target.style.display = 'none')}
                    />
                  )}
                </div>

                {/* Quick Sample Image Pills */}
                <div className="pt-1">
                  <span className="text-[10px] text-slate-400 font-semibold block mb-1">
                    Quick Sample Images:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {sampleOfferImages.map((s) => (
                      <button
                        key={s.name}
                        type="button"
                        onClick={() => setFormData({ ...formData, image: s.url })}
                        className="px-2 py-0.5 rounded-lg bg-white/5 hover:bg-white/10 text-[10px] text-slate-300 border border-white/10 transition-colors"
                      >
                        {s.name}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Target Link & Active Switch */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-center pt-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-300 uppercase mb-1">
                    Target Link
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    placeholder="/category/women-wear"
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-rose-500"
                  />
                </div>

                <div className="flex items-center space-x-3 pt-4">
                  <input
                    type="checkbox"
                    id="offerActive"
                    checked={formData.active}
                    onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                    className="w-4 h-4 rounded text-rose-500 focus:ring-rose-500 bg-slate-800 border-white/20"
                  />
                  <label htmlFor="offerActive" className="text-xs font-bold text-white cursor-pointer">
                    Enable &amp; Publish Live on Storefront
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-300 font-bold text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-400 hover:to-amber-400 text-white font-extrabold text-xs shadow-lg active:scale-95 disabled:opacity-50 flex items-center space-x-2"
                >
                  {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>{editingOffer ? 'Save Changes' : 'Create Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOffers;
