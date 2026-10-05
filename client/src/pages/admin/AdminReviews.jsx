import React, { useState, useEffect } from 'react';
import {
  Star,
  CheckCircle2,
  Trash2,
  Loader2,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState('');
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

  const handleDeleteReview = async () => {
    if (!deleteConfirmId) return;
    try {
      await api.reviews.delete(deleteConfirmId);
      setReviews((prev) => prev.filter((r) => r._id !== deleteConfirmId));
      setDeleteConfirmId(null);
      showToast('Review removed permanently and product rating updated');
    } catch (err) {
      showToast(err.message || 'Failed to delete review');
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
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-wider mb-2">
            <Sparkles className="w-3 h-3" />
            <span>Instant Auto-Publish Active</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            Customer Reviews &amp; Testimonials
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            All reviews submitted by users are automatically published directly to products in real-time. No admin approval required.
          </p>
        </div>

        <div className="text-xs font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
          Total Reviews: <span className="text-white font-extrabold">{reviews.length}</span>
        </div>
      </div>

      {/* Reviews List */}
      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Querying customer testimonials...</p>
          </div>
        ) : reviews.length === 0 ? (
          <div className="p-16 text-center text-xs text-slate-400">
            No customer reviews submitted yet.
          </div>
        ) : (
          <div className="divide-y divide-white/5">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="p-6 flex flex-col md:flex-row md:items-start justify-between gap-5 hover:bg-white/[0.02] transition-colors"
              >
                <div className="space-y-2.5 flex-1">
                  {/* Product & Reviewer Header */}
                  <div className="flex items-center space-x-3.5">
                    <img
                      src={rev.product?.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=300&q=80'}
                      alt=""
                      className="w-11 h-11 object-cover rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0"
                    />
                    <div>
                      <p className="text-xs font-bold text-white">
                        {rev.product?.name || 'Catalog Item'}
                      </p>
                      <p className="text-[11px] text-slate-400 flex items-center space-x-1.5 mt-0.5">
                        <span>by {rev.userName}</span>
                        {rev.verifiedPurchase && (
                          <span className="inline-flex items-center text-emerald-400 font-bold text-[10px]">
                            <ShieldCheck className="w-3 h-3 ml-1 mr-0.5 text-emerald-400" /> Verified Customer
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
                            i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs font-black text-white">{rev.title}</span>
                  </div>

                  {/* Comment */}
                  <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                    "{rev.comment}"
                  </p>

                  <p className="text-[10px] text-slate-500 font-mono">
                    Posted on{' '}
                    {new Date(rev.createdAt).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>

                {/* Status Badge & Delete Control */}
                <div className="flex items-center md:flex-col md:items-end justify-between md:justify-start gap-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Auto-Published
                  </span>

                  <button
                    onClick={() => setDeleteConfirmId(rev._id)}
                    className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-colors"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
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
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />
          <div className="relative w-full max-w-sm bg-[#0F172A] p-6 rounded-3xl shadow-2xl space-y-4 z-10 border border-white/10">
            <h3 className="text-base font-extrabold text-white">Delete Customer Review</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Are you sure you want to delete this customer review permanently? Product rating will automatically re-calculate.
            </p>
            <div className="pt-2 flex justify-end space-x-2.5">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-full bg-white/5 text-slate-300 font-bold text-xs hover:bg-white/10"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-5 py-2 rounded-full bg-rose-500 hover:bg-rose-600 text-white font-black text-xs shadow-lg shadow-rose-500/20"
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
