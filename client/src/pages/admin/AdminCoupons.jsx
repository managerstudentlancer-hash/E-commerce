import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Trash2,
  Edit2,
  X,
  Check,
  Loader2,
  Calendar,
  Percent,
  IndianRupee,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  // Delete Confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    type: 'percentage',
    value: 10,
    minimumOrder: 0,
    maximumDiscount: 0,
    expiryDate: '',
    usageLimit: 1000,
    active: true,
  });

  useEffect(() => {
    fetchCoupons();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.coupons.getAll();
      if (res.success) {
        setCoupons(res.coupons || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (coupon = null) => {
    setFormError('');
    if (coupon) {
      setEditingCoupon(coupon);
      setFormData({
        code: coupon.code || '',
        type: coupon.type || 'percentage',
        value: coupon.value || 10,
        minimumOrder: coupon.minimumOrder || 0,
        maximumDiscount: coupon.maximumDiscount || 0,
        expiryDate: coupon.expiryDate ? coupon.expiryDate.split('T')[0] : '',
        usageLimit: coupon.usageLimit || 1000,
        active: coupon.active !== false,
      });
    } else {
      setEditingCoupon(null);
      setFormData({
        code: '',
        type: 'percentage',
        value: 10,
        minimumOrder: 0,
        maximumDiscount: 0,
        expiryDate: '',
        usageLimit: 1000,
        active: true,
      });
    }
    setIsModalOpen(true);
  };

  const handleSaveCoupon = async (e) => {
    e.preventDefault();
    if (!formData.code || formData.value === undefined) {
      setFormError('Coupon code and discount value are required');
      return;
    }

    setIsSaving(true);
    setFormError('');

    try {
      const payload = {
        ...formData,
        code: formData.code.toUpperCase().trim(),
        value: Number(formData.value),
        minimumOrder: Number(formData.minimumOrder || 0),
        maximumDiscount: Number(formData.maximumDiscount || 0),
        usageLimit: Number(formData.usageLimit || 1000),
      };

      if (editingCoupon) {
        await api.coupons.update(editingCoupon._id, payload);
        showToast(`Coupon "${formData.code.toUpperCase()}" updated successfully!`);
      } else {
        await api.coupons.create(payload);
        showToast(`Coupon "${formData.code.toUpperCase()}" created and active!`);
      }

      setIsModalOpen(false);
      fetchCoupons();
    } catch (err) {
      setFormError(err.message || 'Failed to save coupon');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (coupon) => {
    try {
      const res = await api.coupons.toggle(coupon._id);
      if (res.success) {
        setCoupons((prev) =>
          prev.map((c) => (c._id === coupon._id ? { ...c, active: !c.active } : c))
        );
        showToast(`Coupon "${coupon.code}" status changed`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to toggle coupon');
    }
  };

  const handleDeleteCoupon = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);
    try {
      await api.coupons.delete(deleteConfirmId);
      setDeleteConfirmId(null);
      showToast('Coupon deleted successfully');
      fetchCoupons();
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
            Promotional Coupons &amp; Discount Vouchers
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Create percentage discounts, flat fee vouchers, spend caps, and expiry date restrictions.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 text-slate-950 font-black text-xs flex items-center space-x-2 self-start sm:self-auto shadow-lg shadow-cyan-500/20 active:scale-95 transition-all"
        >
          <Plus className="w-4 h-4 text-slate-950" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Querying promo vouchers...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Promo Code</th>
                  <th className="py-4 px-4">Discount Value</th>
                  <th className="py-4 px-4">Min. Spend</th>
                  <th className="py-4 px-4">Max. Cap</th>
                  <th className="py-4 px-4">Usage Counter</th>
                  <th className="py-4 px-4">Expiry Timeline</th>
                  <th className="py-4 px-4">Store Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-16 text-center text-slate-400 text-xs">
                      No promo vouchers configured. Click "Create New Coupon" above.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const isExpired =
                      coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                    return (
                      <tr key={coupon._id} className="hover:bg-white/[0.02] transition-colors group">
                        <td className="py-4 px-6 font-mono font-black text-white">
                          <span className="px-3 py-1 rounded-xl bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                            {coupon.code}
                          </span>
                        </td>

                        <td className="py-4 px-4 font-black text-emerald-400 font-mono text-sm">
                          {coupon.type === 'percentage'
                            ? `${coupon.value}% OFF`
                            : `₹${coupon.value?.toFixed(2)} FLAT`}
                        </td>

                        <td className="py-4 px-4 text-slate-300 font-mono">
                          {coupon.minimumOrder > 0 ? `₹${coupon.minimumOrder.toFixed(2)}` : 'No minimum'}
                        </td>

                        <td className="py-4 px-4 text-slate-300 font-mono">
                          {coupon.maximumDiscount > 0
                            ? `₹${coupon.maximumDiscount.toFixed(2)}`
                            : 'Unlimited'}
                        </td>

                        <td className="py-4 px-4 text-slate-400 font-mono">
                          {coupon.usedCount || 0} / {coupon.usageLimit || 1000} uses
                        </td>

                        <td className="py-4 px-4 text-slate-300 font-mono">
                          {coupon.expiryDate ? (
                            <span className={isExpired ? 'text-rose-400 font-bold' : ''}>
                              {new Date(coupon.expiryDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                              {isExpired && ' (Expired)'}
                            </span>
                          ) : (
                            <span className="text-slate-500 italic">No Expiry</span>
                          )}
                        </td>

                        <td className="py-4 px-4">
                          <button
                            onClick={() => handleToggleActive(coupon)}
                            className={`px-3 py-1 rounded-full text-[10px] font-black uppercase transition-all ${
                              coupon.active && !isExpired
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30'
                                : 'bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10'
                            }`}
                          >
                            {coupon.active && !isExpired ? 'Active' : 'Disabled'}
                          </button>
                        </td>

                        <td className="py-4 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(coupon)}
                            className="p-2 rounded-xl bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 border border-white/10 transition-colors"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(coupon._id)}
                            className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-4 h-4" />
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

      {/* Add / Edit Coupon Modal */}
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
                  {editingCoupon ? 'Edit Promotional Coupon' : 'Create New Promotional Coupon'}
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

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-slate-300 mb-1.5">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER25"
                  className="w-full px-4 py-3 rounded-2xl admin-input uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Discount Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl admin-input font-bold"
                  >
                    <option value="percentage" className="bg-slate-900 text-white">Percentage Discount (%)</option>
                    <option value="fixed" className="bg-slate-900 text-white">Fixed Amount Discount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === 'percentage' ? '15' : '25.00'}
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Min. Order Amount (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    placeholder="50"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Max. Discount Cap (₹)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.maximumDiscount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                    placeholder="0 for unlimited"
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl admin-input font-mono"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-slate-300 mb-1.5">
                    Usage Limit (Total)
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="1000"
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
                  <span>Active &amp; redeemable immediately at checkout</span>
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
                  <span>{isSaving ? 'Saving...' : 'Save Coupon'}</span>
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
            <h3 className="text-base font-extrabold text-white">Delete Coupon</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete this promo code? Existing orders will not be altered.
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
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

export default AdminCoupons;
