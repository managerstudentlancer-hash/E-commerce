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
  PoundSterling,
  CreditCard,
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
        return 'bg-emerald-50 text-emerald-700 border-emerald-200/60';
      case 'shipped':
      case 'out_for_delivery':
        return 'bg-blue-50 text-blue-700 border-blue-200/60';
      case 'processing':
      case 'confirmed':
        return 'bg-purple-50 text-purple-700 border-purple-200/60';
      case 'pending':
        return 'bg-amber-50 text-amber-700 border-amber-200/60';
      case 'cancelled':
      case 'returned':
        return 'bg-red-50 text-red-600 border-red-200/60';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
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
            Order Fulfillment Center
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Process incoming orders, track shipping logistics, and manage returns & refunds.
          </p>
        </div>

        <button
          onClick={fetchOrders}
          className="btn-pill-light text-xs py-2 px-4 flex items-center space-x-1.5 self-start sm:self-auto font-bold"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Status Filter Tabs Bar */}
      <div className="bg-white p-2 rounded-2xl border border-neutral-200/80 shadow-subtle flex items-center gap-1.5 overflow-x-auto">
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
            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              statusFilter === tab.id
                ? 'bg-neutral-950 text-white shadow-sm'
                : 'text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && tab.count > 0 && (
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-black ${
                  statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-neutral-200 text-neutral-800'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200/80 shadow-subtle flex items-center space-x-3">
        <Search className="w-4 h-4 text-neutral-400 flex-shrink-0" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order #, customer name, email address, tracking #..."
          className="w-full text-xs outline-none text-neutral-900 placeholder-neutral-400 font-medium"
        />
        {searchTerm && (
          <button
            onClick={() => setSearchTerm('')}
            className="text-[11px] text-neutral-400 hover:text-black font-semibold"
          >
            Clear
          </button>
        )}
      </div>

      {/* Orders Table */}
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
                  <th className="py-4 px-6">Order ID</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Items</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="py-12 text-center text-neutral-400">
                      No orders found under this status filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50/60 transition-colors">
                      <td className="py-3.5 px-6 font-mono font-bold text-neutral-900">
                        {ord.orderNumber}
                      </td>

                      <td className="py-3.5 px-4 text-neutral-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-3.5 px-4">
                        <p className="font-bold text-neutral-900">
                          {ord.shippingAddress?.firstName
                            ? `${ord.shippingAddress.firstName} ${ord.shippingAddress.lastName || ''}`
                            : ord.user?.name || 'Direct Buyer'}
                        </p>
                        <p className="text-[10px] text-neutral-500">
                          {ord.user?.email || ord.guestEmail || 'N/A'}
                        </p>
                      </td>

                      <td className="py-3.5 px-4">
                        <span className="font-semibold text-neutral-700">
                          {ord.items?.length || 0} items
                        </span>
                      </td>

                      <td className="py-3.5 px-4 font-black text-neutral-900">
                        £{ord.total?.toFixed(2)}
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-emerald-50 text-emerald-700'
                              : ord.paymentStatus === 'refunded'
                              ? 'bg-purple-50 text-purple-700'
                              : 'bg-amber-50 text-amber-700'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>

                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(
                            ord.orderStatus
                          )}`}
                        >
                          {ord.orderStatus?.replace('_', ' ')}
                        </span>
                      </td>

                      <td className="py-3.5 px-6 text-right">
                        <button
                          onClick={() => handleOpenOrder(ord)}
                          className="btn-pill-dark text-xs py-1.5 px-3.5 font-bold inline-flex items-center space-x-1"
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
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          />

          <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10 max-h-[90vh] overflow-y-auto border border-neutral-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-neutral-100">
              <div>
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-black text-neutral-900 font-mono">
                    {selectedOrder.orderNumber}
                  </h3>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${getStatusBadge(
                      selectedOrder.orderStatus
                    )}`}
                  >
                    {selectedOrder.orderStatus?.replace('_', ' ')}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 mt-1">
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
                className="p-1 text-neutral-400 hover:text-black rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Clean Order Timeline (6 Stages) */}
            {selectedOrder.orderStatus !== 'cancelled' && selectedOrder.orderStatus !== 'returned' ? (
              <div className="bg-neutral-50 p-4 sm:p-6 rounded-2xl border border-neutral-200/60 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400">
                  Fulfillment Timeline Progression
                </p>
                <div className="grid grid-cols-6 gap-1 sm:gap-2 text-center pt-2">
                  {ORDER_STATUS_ORDER.map((stage, idx) => {
                    const currentIdx = ORDER_STATUS_ORDER.indexOf(selectedOrder.orderStatus);
                    const isPassed = idx <= currentIdx;
                    const isCurrent = idx === currentIdx;

                    return (
                      <div key={stage} className="flex flex-col items-center">
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] font-bold transition-colors ${
                            isPassed
                              ? 'bg-neutral-950 text-white'
                              : 'bg-neutral-200 text-neutral-400'
                          } ${isCurrent ? 'ring-4 ring-neutral-200' : ''}`}
                        >
                          {idx + 1}
                        </div>
                        <span
                          className={`text-[9px] sm:text-[10px] font-bold mt-1.5 capitalize ${
                            isPassed ? 'text-neutral-900' : 'text-neutral-400'
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
              <div className="bg-red-50 p-4 rounded-2xl border border-red-200 flex items-center space-x-3 text-red-700 text-xs font-bold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <span>
                  This order is marked as{' '}
                  <strong className="uppercase">{selectedOrder.orderStatus}</strong>. Reserved inventory has been automatically released back to stock.
                </span>
              </div>
            )}

            {/* Quick Status Update Selector */}
            <div className="p-4 bg-white rounded-2xl border border-neutral-200 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                <label className="text-xs font-bold uppercase text-neutral-700">Change Status:</label>
                <select
                  value={selectedOrder.orderStatus}
                  onChange={(e) => handleUpdateStatus(e.target.value)}
                  disabled={updatingStatus}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 font-bold text-xs text-neutral-900 focus:outline-none focus:border-black uppercase"
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
                  placeholder="Royal Mail Tracking #"
                  value={trackingNumberInput}
                  onChange={(e) => setTrackingNumberInput(e.target.value)}
                  className="px-3 py-1.5 rounded-xl border border-neutral-200 text-xs font-mono w-44 outline-none focus:border-black"
                />
                <button
                  onClick={() => handleUpdateStatus(selectedOrder.orderStatus)}
                  disabled={updatingStatus}
                  className="btn-pill-dark text-xs py-1.5 px-3 font-bold"
                >
                  {updatingStatus ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save'}
                </button>
              </div>
            </div>

            {/* Customer & Shipping Addresses */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center space-x-1">
                  <User className="w-3.5 h-3.5" />
                  <span>Customer Details</span>
                </p>
                <p className="font-bold text-neutral-900">
                  {selectedOrder.shippingAddress?.firstName}{' '}
                  {selectedOrder.shippingAddress?.lastName}
                </p>
                <p className="text-neutral-600">
                  {selectedOrder.user?.email || selectedOrder.guestEmail}
                </p>
                <p className="text-neutral-600 font-mono">
                  {selectedOrder.shippingAddress?.phone || 'No phone provided'}
                </p>
              </div>

              <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60 space-y-2">
                <p className="text-[10px] font-extrabold uppercase tracking-wider text-neutral-400 flex items-center space-x-1">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Shipping Address</span>
                </p>
                <p className="font-semibold text-neutral-800">
                  {selectedOrder.shippingAddress?.address}
                </p>
                <p className="text-neutral-600">
                  {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
                </p>
                <p className="text-neutral-600">
                  {selectedOrder.shippingAddress?.country || 'United Kingdom'}
                </p>
              </div>
            </div>

            {/* Ordered Items List */}
            <div className="space-y-3">
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-neutral-900">
                Purchased Line Items ({selectedOrder.items?.length || 0})
              </h4>
              <div className="divide-y divide-neutral-100 border-y border-neutral-100">
                {selectedOrder.items?.map((item, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between space-x-3 text-xs">
                    <div className="flex items-center space-x-3">
                      <img
                        src={item.image}
                        alt=""
                        className="w-11 h-11 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                      />
                      <div>
                        <p className="font-bold text-neutral-900">{item.name}</p>
                        {item.variant && (
                          <p className="text-[10px] text-neutral-500">Variant: {item.variant}</p>
                        )}
                        <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-neutral-900">
                        £{(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-[10px] text-neutral-400">£{item.price?.toFixed(2)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Financial Summary */}
            <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200/60 space-y-1.5 text-xs">
              <div className="flex justify-between text-neutral-500">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">
                  £{selectedOrder.subtotal?.toFixed(2)}
                </span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount Applied ({selectedOrder.coupon || 'PROMO'})</span>
                  <span>-£{selectedOrder.discount?.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-neutral-500">
                <span>Standard Delivery</span>
                <span className="font-semibold text-neutral-900">
                  {selectedOrder.shipping === 0 ? 'FREE' : `£${selectedOrder.shipping?.toFixed(2)}`}
                </span>
              </div>
              <div className="flex justify-between text-sm font-black text-neutral-900 pt-2 border-t border-neutral-200/60">
                <span>Total Amount</span>
                <span>£{selectedOrder.total?.toFixed(2)}</span>
              </div>
            </div>

            {/* Dangerous Actions & Close */}
            <div className="pt-2 border-t border-neutral-100 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center space-x-2">
                {selectedOrder.orderStatus !== 'cancelled' && (
                  <button
                    onClick={handleCancelOrder}
                    className="btn-pill py-2 px-4 text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50 flex items-center space-x-1"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Cancel Order</span>
                  </button>
                )}

                {selectedOrder.paymentStatus !== 'refunded' && (
                  <button
                    onClick={handleProcessRefund}
                    className="btn-pill py-2 px-4 text-xs font-bold border border-purple-200 text-purple-700 hover:bg-purple-50 flex items-center space-x-1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Process Return & Refund</span>
                  </button>
                )}
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="btn-pill-dark text-xs py-2.5 px-6 font-bold"
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
