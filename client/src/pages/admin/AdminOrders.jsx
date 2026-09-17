import React, { useState, useEffect } from 'react';
import { Package, Truck, Check, Loader2, Search, X } from 'lucide-react';
import api from '../../services/api';

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Status updates
  const [orderStatus, setOrderStatus] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.orders.getAll({ limit: 100 });
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenOrder = (order) => {
    setSelectedOrder(order);
    setOrderStatus(order.orderStatus);
    setPaymentStatus(order.paymentStatus);
    setTrackingNumber(order.trackingNumber || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setIsUpdating(true);

    try {
      const res = await api.orders.updateStatus(selectedOrder._id, {
        orderStatus,
        paymentStatus,
        trackingNumber,
      });

      if (res.success) {
        setOrders(orders.map((o) => (o._id === selectedOrder._id ? res.order : o)));
        setSelectedOrder(res.order);
        alert('Order status & tracking successfully updated.');
      }
    } catch (err) {
      alert(err.message || 'Update failed');
    } finally {
      setIsUpdating(false);
    }
  };

  const filteredOrders = orders.filter(
    (o) =>
      o.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.guestEmail?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            Order Fulfillment & Logistics
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Process incoming orders, assign dispatch tracking codes, and manage fulfillment stages.
          </p>
        </div>
      </div>

      {/* Search Filter */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center space-x-3 shadow-subtle">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by order number or customer email..."
          className="flex-1 text-xs outline-none text-neutral-900 placeholder-neutral-400 font-medium"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-xs text-neutral-400 hover:text-black">
            Clear
          </button>
        )}
      </div>

      {/* Orders Table */}
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
                  <th className="py-4 px-6">Order #</th>
                  <th className="py-4 px-4">Date</th>
                  <th className="py-4 px-4">Customer</th>
                  <th className="py-4 px-4">Payment</th>
                  <th className="py-4 px-4">Fulfillment</th>
                  <th className="py-4 px-4">Total</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-neutral-500">
                      No orders found matching criteria.
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-4 px-6 font-mono font-bold text-neutral-900">{ord.orderNumber}</td>
                      <td className="py-4 px-4 text-neutral-500">
                        {new Date(ord.createdAt).toLocaleDateString('en-GB')}
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-bold text-neutral-900">{ord.user?.name || 'Guest Checkout'}</p>
                        <p className="text-[10px] text-neutral-500">{ord.guestEmail || ord.user?.email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.paymentStatus === 'paid'
                              ? 'bg-green-100 text-[#0D8756]'
                              : 'bg-amber-100 text-amber-800'
                          }`}
                        >
                          {ord.paymentStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-extrabold text-neutral-900">
                        £{ord.total?.toFixed(2)}
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button
                          onClick={() => handleOpenOrder(ord)}
                          className="btn-pill-light py-1.5 px-4 text-xs font-semibold"
                        >
                          Manage
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

      {/* Order Manage Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 sm:p-6 animate-fade-in">
          <div onClick={() => setSelectedOrder(null)} className="fixed inset-0 bg-black/60 backdrop-blur-sm" />

          <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl p-6 sm:p-8 space-y-6 z-10">
            <div className="flex items-center justify-between pb-4 border-b border-neutral-100">
              <div>
                <span className="text-xs text-neutral-500 font-semibold">Order Management</span>
                <h3 className="text-base font-bold font-mono text-neutral-900">
                  {selectedOrder.orderNumber}
                </h3>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-1 text-neutral-400 hover:text-black">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Customer & Shipping Summary */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 text-xs space-y-1">
              <p className="font-bold text-neutral-900">
                Ship To: {selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}
              </p>
              <p className="text-neutral-600">
                {selectedOrder.shippingAddress?.address}, {selectedOrder.shippingAddress?.city}, {selectedOrder.shippingAddress?.postalCode}
              </p>
              <p className="text-neutral-500">Contact: {selectedOrder.guestEmail || selectedOrder.user?.email}</p>
            </div>

            {/* Order Items */}
            <div className="max-h-48 overflow-y-auto divide-y divide-neutral-100 border-y border-neutral-100 text-xs">
              {selectedOrder.items?.map((item, idx) => (
                <div key={idx} className="py-2.5 flex justify-between items-center">
                  <div className="flex items-center space-x-2.5">
                    <img src={item.image} alt="" className="w-8 h-10 object-cover rounded-lg bg-neutral-100" />
                    <div>
                      <p className="font-bold text-neutral-900">{item.name}</p>
                      <p className="text-neutral-500">Qty: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-bold">£{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Update Status Form */}
            <form onSubmit={handleUpdateStatus} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Fulfillment Status
                  </label>
                  <select
                    value={orderStatus}
                    onChange={(e) => setOrderStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-neutral-200 bg-white font-semibold focus:outline-none focus:border-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold uppercase text-neutral-700 mb-1">
                    Payment Status
                  </label>
                  <select
                    value={paymentStatus}
                    onChange={(e) => setPaymentStatus(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-full border border-neutral-200 bg-white font-semibold focus:outline-none focus:border-black"
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                    <option value="failed">Failed</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold uppercase text-neutral-700 mb-1">
                  Courier Tracking Code
                </label>
                <input
                  type="text"
                  value={trackingNumber}
                  onChange={(e) => setTrackingNumber(e.target.value)}
                  placeholder="e.g. DPD-UK-983742918"
                  className="input-pill"
                />
              </div>

              <div className="pt-2 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="btn-pill-light py-2 px-5"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="btn-pill-dark py-2 px-6 flex items-center space-x-1.5"
                >
                  {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
                  <span>Save Status</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
