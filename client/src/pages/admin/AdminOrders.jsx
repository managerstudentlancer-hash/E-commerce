import React, { useState, useEffect } from 'react';
import {
  ShoppingCart,
  Search,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  PackageCheck,
  AlertCircle,
  X,
  Loader2,
  RefreshCw,
  RotateCcw,
  Ban,
  User,
  MapPin,
  IndianRupee,
  CreditCard,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const ORDER_STATUS_ORDER = [
  'pending',
  'confirmed',
  'processing',
  'shipped',
  'out_for_delivery',
  'delivered',
];

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [statusCounts, setStatusCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Selected Order Drawer / Modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [trackingNumberInput, setTrackingNumberInput] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = {};
      if (statusFilter !== 'all') params.status = statusFilter;
      if (searchTerm) params.search = searchTerm;

      const res = await api.orders.getAll(params);
      if (res.success) {
        setOrders(res.orders || []);
        if (res.statusCounts) setStatusCounts(res.statusCounts);
      }
    } catch (err) {
      console.error('Failed to fetch orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setTrackingNumberInput(order.trackingNumber || '');
  };

  const handleUpdateStatus = async (newOrderStatus, newPaymentStatus = null) => {
    if (!selectedOrder) return;
    setUpdatingStatus(true);
    try {
      const payload = {
        orderStatus: newOrderStatus,
        trackingNumber: trackingNumberInput,
      };
      if (newPaymentStatus) payload.paymentStatus = newPaymentStatus;

      const res = await api.orders.updateStatus(selectedOrder._id, payload);
      if (res.success) {
        setSelectedOrder(res.order);
        setOrders((prev) =>
          prev.map((o) => (o._id === selectedOrder._id ? res.order : o))
        );
        showToast(`Order status updated to ${newOrderStatus.toUpperCase()}`);
        fetchOrders();
      }
    } catch (err) {
      showToast(err.message || 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order and replenish its inventory?')) return;
    await handleUpdateStatus('cancelled');
  };

  const handleProcessRefund = async () => {
    if (!window.confirm('Process full refund and mark order as RETURNED & REFUNDED?')) return;
    await handleUpdateStatus('returned', 'refunded');
  };

  const filteredOrders = orders.filter((o) => {
    const term = searchTerm.toLowerCase();
    return (
      o.orderNumber?.toLowerCase().includes(term) ||
      o.guestEmail?.toLowerCase().includes(term) ||
      o.user?.name?.toLowerCase().includes(term) ||
      o.user?.email?.toLowerCase().includes(term) ||
      o.shippingAddress?.firstName?.toLowerCase().includes(term) ||
      o.shippingAddress?.lastName?.toLowerCase().includes(term) ||
      o.shippingAddress?.phone?.toLowerCase().includes(term) ||
      o.trackingNumber?.toLowerCase().includes(term)
    );
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30';
      case 'processing':
      case 'confirmed':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'cancelled':
      case 'returned':
        return 'bg-rose-500/20 text-rose-300 border-rose-500/30';
      default:
        return 'bg-white/5 text-slate-300 border-white/10';
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {/* Toast */}
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
            Order Fulfillment & Logistics
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Process client orders, dispatch courier tracking numbers, and manage returns & refunds.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="px-5 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 flex items-center space-x-2 self-start sm:self-auto transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5 text-cyan-400" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Status Filter Tabs Bar */}
      <div className="admin-card p-2 rounded-2xl flex items-center gap-1.5 overflow-x-auto custom-scrollbar">
        {[
          { id: 'all', label: 'All Orders', count: statusCounts.all },
          { id: 'pending', label: 'Pending', count: statusCounts.pending },
          { id: 'confirmed', label: 'Confirmed', count: statusCounts.confirmed },
          { id: 'processing', label: 'Processing', count: statusCounts.processing },
          { id: 'shipped', label: 'Shipped', count: statusCounts.shipped },
          { id: 'out_for_delivery', label: 'Out for Delivery', count: statusCounts.out_for_delivery },
          { id: 'delivered', label: 'Delivered', count: statusCounts.delivered },
          { id: 'cancelled', label: 'Cancelled', count: statusCounts.cancelled },
          { id: 'returned', label: 'Returned', count: statusCounts.returned },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center space-x-2 ${
              statusFilter === tab.id
                ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                : 'text-slate-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-2 py-0.2 rounded-full text-[10px] font-black ${
                  statusFilter === tab.id ? 'bg-slate-950/30 text-slate-950' : 'bg-white/10 text-slate-300'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="admin-card p-4 rounded-3xl flex items-center space-x-3">
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order #, customer name, email address, tracking #..."
          className="w-full bg-transparent text-xs outline-none text-white placeholder-slate-500 font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-[11px] text-slate-400 hover:text-white font-bold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders Table */}
      <div className="admin-card rounded-3xl overflow-hidden shadow-2xl">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center space-y-3">
            <Loader2 className="w-8 h-8 animate-spin text-cyan-400" />
            <p className="text-xs text-slate-400 font-bold">Querying order fulfillment...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-white/[0.03] border-b border-white/10 text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Client</th>
                  <th className="py-4 px-4">Items</th>
                  <th className="py-4 px-4">Amount (₹)</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Fulfillment Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-16 text-center text-slate-400 text-xs">
                      No customer orders found matching this filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="py-4 px-6 font-mono font-bold text-cyan-300">
                        {ord.orderNumber}
                      </td>

                      <td className="py-4 px-4 text-slate-400 font-mono">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-4">
                        <p className="font-bold text-white">
                          {ord.shippingAddress?.firstName
                            ? `${ord.shippingAddress.firstName} ${ord.shippingAddress.lastName || ''}`
                            : ord.user?.name || 'Direct Buyer'}
                        </p>
                        <p className="text-[10px] text-slate-400">
                          {ord.user?.email || ord.guestEmail || 'N/A'}
                        </p>
                      </td>

                      <td className="py-4 px-4">
                        <span className="font-bold text-slate-300 px-2.5 py-1 rounded-xl bg-white/5 border border-white/10">
                          {ord.items?.length || 0} items
                        </span>
                      </td>

                      <td className="py-4 px-4 font-black text-emerald-400 font-mono text-sm">
                        ₹{ord.total?.toFixed(2)}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                              : ord.paymentStatus === 'refunded'
                              ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                              : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus?.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenOrder(ord)}
                          className="px-4 py-2 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs inline-flex items-center space-x-1.5 shadow-md shadow-cyan-500/20 active:scale-95 transition-all"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Details</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal with Live Progression Timeline */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          <div className="relative w-full max-w-3xl bg-[#0F172A] rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-white/10 custom-scrollbar">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-white/10">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-black text-white font-mono">
                    {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`inline-flex items-center px-3 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusBadge(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-1">
                  Placed on{' '}
                  {new Date(selectedOrder.createdAt).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean Order Timeline (6 Stages) */}
            {selectedOrder.orderStatus !== 'cancelled' && selectedOrder.orderStatus !== 'returned' ? (
              <div className="bg-slate-900/80 p-5 sm:p-6 rounded-2xl border border-white/10 space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Fulfillment Progression Timeline
                </p>
                <div className="grid grid-cols-6 gap-1 sm:gap-2 text-center pt-2">
                  {ORDER_STATUS_ORDER.map((stage, idx) => {
                    const currentIdx = ORDER_STATUS_ORDER.indexOf(selectedOrder.orderStatus);
                    const isPassed = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={stage} className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black transition-all ${
                            isPassed
                              ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/30'
                              : 'bg-white/10 text-slate-500'
                          } ${isCurrent ? 'ring-4 ring-cyan-500/20' : ''}`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold mt-2 capitalize ${
                            isPassed ? 'text-white' : 'text-slate-500'
                          }`}
                        >
                          {stage.replace('_', ' ')}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-rose-500/10 p-4 rounded-2xl border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-xs font-bold">
                <AlertCircle className="w-5 h-5 flex-shrink-0 text-rose-400" />
                <span>
                  This order is marked as <strong className="uppercase">{selectedOrder.orderStatus}</strong>. Reserved inventory units have been automatically released.
                </span>
              </div>
            )}

            {/* Quick Status Update Selector */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3.5">
              <div className="flex items-center space-x-2.5">
                <label className="text-xs font-bold uppercase text-slate-300">Change Status:</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="px-3.5 py-2 rounded-xl bg-slate-900 border border-white/10 font-bold text-xs text-white focus:border-cyan-400 uppercase"
                >
                  <option value="pending">PENDING</option>
                  <option value="confirmed">CONFIRMED</option>
                  <option value="processing">PROCESSING</option>
                  <option value="shipped">SHIPPED</option>
                  <option value="out_for_delivery">OUT FOR DELIVERY</option>
                  <option value="delivered">DELIVERED</option>
                  <option value="cancelled">CANCELLED</option>
                  <option value="returned">RETURNED</option>
                </select>
              </div>

              {/* Tracking Number Input */}
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  placeholder="Royal Mail / DPD Tracking #"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="px-3.5 py-2 rounded-xl admin-input text-xs font-mono w-48"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.orderStatus)}
                  disabled={updatingStatus}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black text-xs shadow-md shadow-cyan-500/20"
                >
                  {updatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
                </button>
              </div>
            </div>

            {/* Customer & Shipping Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Client Contact</span>
                </p>
                <p className="font-bold text-white text-sm">
                  {selectedOrder.shippingAddress?.firstName}{' '}
                  {selectedOrder.shippingAddress?.lastName}
                </p>
                <p className="text-slate-300 font-mono">
                  {selectedOrder.user?.email || selectedOrder.guestEmail}
                </p>
                <p className="text-slate-400 font-mono">
                  {selectedOrder.shippingAddress?.phone || 'No phone supplied'}
                </p>
              </div>

              <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dispatch Address</span>
                </p>
                <p className="font-semibold text-slate-200">
                  {selectedOrder.shippingAddress?.address}
                </p>
                <p className="text-slate-300">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-slate-400">
                  {selectedOrder.shippingAddress?.country || 'United Kingdom'}
                </p>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-300">
                Purchased Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-white/5 border-y border-white/10">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between space-x-3 text-xs">
                    <div className="flex items-center space-x-3.5">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 object-cover rounded-2xl bg-slate-900 border border-white/10 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-white">{item.name}</p>
                        {item.variant && (
                          <p className="text-[10px] text-slate-400 font-mono">Option: {item.variant}</p>
                        )}
                        <p className="text-[11px] text-slate-400">Quantity: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-emerald-400 font-mono text-sm">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-slate-400 font-mono">₹{item.price?.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-slate-900/60 rounded-2xl border border-white/10 space-y-1.5 text-xs font-medium">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal</span>
                <span className="font-bold text-white font-mono">
                  ₹{selectedOrder.subtotal?.toFixed(2)}
                </span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-400 font-bold">
                  <span>Coupon Discount ({selectedOrder.coupon || 'PROMO'})</span>
                  <span className="font-mono">-₹{selectedOrder.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-slate-400">
                <span>Delivery</span>
                <span className="font-bold text-white font-mono">
                  {selectedOrder.shipping === 0 ? 'FREE' : `₹${selectedOrder.shipping?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10">
                <span>Total Charged</span>
                <span className="text-emerald-400 font-mono">₹{selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Actions & Close */}
            <div className="pt-2 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                {selectedOrder.orderStatus !== 'cancelled' && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-4 py-2 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}

                {selectedOrder.paymentStatus !== 'refunded' && (
                  <button
                    onClick={handleProcessRefund}
                    className="px-4 py-2 rounded-full bg-purple-500/10 text-purple-300 border border-purple-500/20 hover:bg-purple-500/20 text-xs font-bold flex items-center space-x-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Process Refund</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="px-6 py-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-xs"
              >
                Close Window
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
