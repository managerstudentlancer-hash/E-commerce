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
  PoundSterling,
  CheckCircle2,
  AlertCircle,
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
        showToast(`Coupon "${formData.code.toUpperCase()}" updated!`);
      } else {
        await api.coupons.create(payload);
        showToast(`Coupon "${formData.code.toUpperCase()}" created!`);
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
            Promotional Coupons
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Configure percentage discounts, flat fee vouchers, usage thresholds, and expiry rules.
          </p>
        </div>

        <button
          onClick={() => handleOpenModal()}
          className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5 self-start sm:self-auto font-bold shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-50/80 border-b border-neutral-200 text-neutral-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-6">Coupon Code</th>
                  <th className="py-4 px-4">Discount Value</th>
                  <th className="py-4 px-4">Min. Order</th>
                  <th className="py-4 px-4">Max. Discount</th>
                  <th className="py-4 px-4">Usage Limit</th>
                  <th className="py-4 px-4">Expiry Date</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {coupons.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-neutral-400">
                      No promo coupons active. Create your first coupon above.
                    </td>
                  </tr>
                ) : (
                  coupons.map((coupon) => {
                    const isExpired =
                      coupon.expiryDate && new Date(coupon.expiryDate) < new Date();
                    return (
                      <tr key={coupon._id} className="hover:bg-neutral-50/60 transition-colors">
                        <td className="py-3.5 px-6 font-mono font-black text-neutral-900">
                          <span className="px-2.5 py-1 rounded-lg bg-neutral-100 border border-neutral-200">
                            {coupon.code}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 font-bold text-neutral-900">
                          {coupon.type === 'percentage'
                            ? `${coupon.value}% OFF`
                            : `£${coupon.value?.toFixed(2)} FLAT`}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">
                          {coupon.minimumOrder > 0 ? `£${coupon.minimumOrder.toFixed(2)}` : 'No minimum'}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">
                          {coupon.maximumDiscount > 0
                            ? `£${coupon.maximumDiscount.toFixed(2)}`
                            : 'Unlimited'}
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">
                          {coupon.usedCount || 0} / {coupon.usageLimit || 1000} uses
                        </td>

                        <td className="py-3.5 px-4 text-neutral-600">
                          {coupon.expiryDate ? (
                            <span className={isExpired ? 'text-red-600 font-bold' : ''}>
                              {new Date(coupon.expiryDate).toLocaleDateString('en-GB', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                              })}
                              {isExpired && ' (Expired)'}
                            </span>
                          ) : (
                            <span className="text-neutral-400 italic">No Expiry</span>
                          )}
                        </td>

                        <td className="py-3.5 px-4">
                          <button
                            onClick={() => handleToggleActive(coupon)}
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase transition-colors ${
                              coupon.active && !isExpired
                                ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                                : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
                            }`}
                          >
                            {coupon.active && !isExpired ? 'Active' : 'Disabled'}
                          </button>
                        </td>

                        <td className="py-3.5 px-6 text-right space-x-2">
                          <button
                            onClick={() => handleOpenModal(coupon)}
                            className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors"
                            title="Edit Coupon"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(coupon._id)}
                            className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-red-600 hover:text-red-600 transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-neutral-200">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <h3 className="text-base font-extrabold text-neutral-900">
                {editingCoupon ? 'Edit Promotional Coupon' : 'Create New Promotional Coupon'}
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

            <form onSubmit={handleSaveCoupon} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Coupon Code *
                </label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. SUMMER25"
                  className="input-pill uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Discount Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-3 rounded-full border border-neutral-200 bg-white font-medium focus:outline-none focus:border-black"
                  >
                    <option value="percentage">Percentage Discount (%)</option>
                    <option value="fixed">Fixed Amount Discount (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Discount Value *
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    value={formData.value}
                    onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                    placeholder={formData.type === 'percentage' ? '15' : '25.00'}
                    className="input-pill"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Min. Order Amount (£)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.minimumOrder}
                    onChange={(e) => setFormData({ ...formData, minimumOrder: e.target.value })}
                    placeholder="50"
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Max. Discount Cap (£)
                  </label>
                  <input
                    type="number"
                    step="1"
                    value={formData.maximumDiscount}
                    onChange={(e) => setFormData({ ...formData, maximumDiscount: e.target.value })}
                    placeholder="0 for unlimited"
                    className="input-pill"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="input-pill"
                  />
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Usage Limit (Times)
                  </label>
                  <input
                    type="number"
                    value={formData.usageLimit}
                    onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
                    placeholder="1000"
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
                  <span>Active &amp; redeemable at storefront checkout</span>
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl space-y-4 z-10 border border-neutral-200">
            <h3 className="text-base font-extrabold text-neutral-900">Delete Coupon</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to delete this coupon? Existing orders using this coupon code will remain unaffected.
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-pill-light py-2 px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteCoupon}
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

export default AdminCoupons;
