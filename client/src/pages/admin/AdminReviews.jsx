import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  XCircle,
  Trash2,
  Loader2,
  Filter,
  Check,
  X,
  MessageSquare,
  ShieldCheck,
} from 'lucide-react';
import api from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [actionLoading, setActionLoading] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  // Delete Confirm
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.reviews.getAll();
      if (res.success) {
        setReviews(res.reviews || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    setActionLoading(id);
    try {
      const res = await api.reviews.updateStatus(id, status);
      if (res.success) {
        setReviews((prev) =>
          prev.map((r) => (r._id === id ? { ...r, status } : r))
        );
        showToast(`Review marked as ${status.toUpperCase()}`);
      }
    } catch (err) {
      showToast(err.message || 'Failed to update review status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteReview = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.reviews.delete(deleteConfirmId);
      setReviews((prev) => prev.filter((r) => r._id !== deleteConfirmId));
      setDeleteConfirmId(null);
      showToast('Review removed permanently');
    } catch (err) {
      showToast(err.message || 'Failed to delete review');
    }
  };

  const filteredReviews = reviews.filter((r) => {
    if (statusFilter === 'all') return true;
    return r.status === statusFilter;
  });

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
            Customer Reviews Moderation
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Audit buyer testimonials, filter verified purchase ratings, and moderate public feedback.
          </p>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center space-x-1.5 p-1 bg-neutral-100 rounded-xl self-start sm:self-auto">
          {[
            { id: 'all', label: 'All Reviews' },
            { id: 'approved', label: 'Approved' },
            { id: 'pending', label: 'Pending' },
            { id: 'rejected', label: 'Rejected' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
                statusFilter === tab.id
                  ? 'bg-white text-neutral-950 shadow-sm'
                  : 'text-neutral-500 hover:text-neutral-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="bg-white rounded-3xl border border-neutral-200/80 overflow-hidden shadow-subtle">
        {loading ? (
          <div className="p-16 flex items-center justify-center">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : filteredReviews.length === 0 ? (
          <div className="p-16 text-center text-xs text-neutral-400">
            No customer reviews found matching this filter.
          </div>
        ) : (
          <div className="divide-y divide-neutral-100">
            {filteredReviews.map((rev) => (
              <div
                key={rev._id}
                className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-4 hover:bg-neutral-50/50 transition-colors"
              >
                <div className="space-y-2 flex-1">
                  {/* Product & Reviewer Header */}
                  <div className="flex items-center space-x-3">
                    <img
                      src={rev.product?.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'}
                      alt=""
                      className="w-9 h-9 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-neutral-900">
                        {rev.product?.name || 'Catalog Item'}
                      </p>
                      <p className="text-[11px] text-neutral-500 flex items-center space-x-1">
                        <span>by {rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center text-emerald-600 font-semibold text-[10px]">
                            <ShieldCheck className="w-3 h-3 ml-1 mr-0.5" /> Verified Buyer
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Rating Stars & Title */}
                  <div className="flex items-center space-x-2 pt-1">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < rev.rating ? 'fill-current' : 'text-neutral-200'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-extrabold text-neutral-900">{rev.title}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-neutral-700 leading-relaxed max-w-2xl">
                    "{rev.comment}"
                  </p>

                  <p className="text-[10px] text-neutral-400">
                    Posted on{' '}
                    {new Date(rev.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Status Badge & Action Controls */}
                <div className="flex items-center md:flex-col md:items-end justify-between md:justify-start gap-2.5">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                      rev.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/60'
                        : rev.status === 'rejected'
                        ? 'bg-red-50 text-red-600 border border-red-200/60'
                        : 'bg-amber-50 text-amber-700 border border-amber-200/60'
                    }`}
                  >
                    {rev.status}
                  </span>

                  <div className="flex items-center space-x-1.5">
                    {rev.status !== 'approved' && (
                      <button
                        onClick={() => handleUpdateStatus(rev._id, 'approved')}
                        disabled={actionLoading === rev._id}
                        className="p-1.5 rounded-xl border border-emerald-200 text-emerald-700 hover:bg-emerald-50 transition-colors"
                        title="Approve Review"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {rev.status !== 'rejected' && (
                      <button
                        onClick={() => handleUpdateStatus(rev._id, 'rejected')}
                        disabled={actionLoading === rev._id}
                        className="p-1.5 rounded-xl border border-amber-200 text-amber-700 hover:bg-amber-50 transition-colors"
                        title="Reject Review"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => setDeleteConfirmId(rev._id)}
                      className="p-1.5 rounded-xl border border-neutral-200 text-neutral-700 hover:border-red-600 hover:text-red-600 transition-colors"
                      title="Delete Review"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
          <div
            onClick={() => setDeleteConfirmId(null)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="relative w-full max-w-sm bg-white p-6 rounded-3xl shadow-2xl space-y-4 z-10 border border-neutral-200">
            <h3 className="text-base font-extrabold text-neutral-900">Delete Review</h3>
            <p className="text-xs text-neutral-500">
              Are you sure you want to delete this customer review permanently?
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="btn-pill-light py-2 px-4 text-xs font-bold"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="btn-pill-dark bg-red-600 hover:bg-red-700 text-white py-2 px-4 text-xs font-bold"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReviews;
