import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Loader2 } from 'lucide-react';
import api from '../../services/api';

const AdminReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.reviews.getAll();
      if (res.success) setReviews(res.reviews || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.reviews.updateStatus(id, status);
      setReviews(reviews.map((r) => (r._id === id ? { ...r, status } : r)));
    } catch (err) {
      alert('Failed to update review status');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review permanently?')) return;
    try {
      await api.reviews.delete(id);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      alert('Deletion failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          Client Reviews & Moderation
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Moderate verified buyer feedback and public testimonials.
        </p>
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
                  <th className="py-4 px-6">Product</th>
                  <th className="py-4 px-4">Author</th>
                  <th className="py-4 px-4">Rating</th>
                  <th className="py-4 px-4">Headline & Feedback</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {reviews.map((rev) => (
                  <tr key={rev._id} className="hover:bg-neutral-50">
                    <td className="py-4 px-6">
                      <p className="font-bold text-neutral-900 truncate max-w-[150px]">
                        {rev.product?.name || 'Product'}
                      </p>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-bold">{rev.userName}</p>
                      <p className="text-[10px] text-neutral-500">{rev.userEmail || 'verified'}</p>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex text-amber-400">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </td>
                    <td className="py-4 px-4 max-w-xs">
                      <p className="font-bold text-neutral-900 truncate">{rev.title}</p>
                      <p className="text-neutral-500 text-[11px] line-clamp-2">{rev.comment}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                          rev.status === 'approved'
                            ? 'bg-green-100 text-[#0D8756]'
                            : rev.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-red-100 text-[#C4301C]'
                        }`}
                      >
                        {rev.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right space-x-1.5">
                      {rev.status !== 'approved' && (
                        <button
                          onClick={() => handleUpdateStatus(rev._id, 'approved')}
                          title="Approve"
                          className="p-1 rounded bg-green-50 text-[#0D8756] hover:bg-green-100"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {rev.status !== 'rejected' && (
                        <button
                          onClick={() => handleUpdateStatus(rev._id, 'rejected')}
                          title="Reject"
                          className="p-1 rounded bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(rev._id)}
                        title="Delete"
                        className="p-1 rounded bg-red-50 text-[#C4301C] hover:bg-red-100"
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
    </div>
  );
};

export default AdminReviews;
