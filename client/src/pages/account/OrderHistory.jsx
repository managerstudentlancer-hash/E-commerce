import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, Loader2 } from 'lucide-react';
import api from '../../services/api';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.orders.getMy()
      .then((res) => {
        if (res.success) setOrders(res.orders || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
        <p className="text-xs font-semibold text-neutral-500">Loading order history...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="text-xs text-neutral-500 mb-2 flex items-center space-x-2">
          <Link to="/account" className="hover:text-black">Account</Link>
          <span>/</span>
          <span className="text-black font-semibold">Orders</span>
        </nav>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 uppercase tracking-tight mb-8">
          Order History ({orders.length})
        </h1>

        {orders.length === 0 ? (
          <div className="p-12 text-center bg-neutral-50 rounded-3xl border border-neutral-200 space-y-4">
            <Package className="w-12 h-12 text-neutral-400 mx-auto" />
            <h3 className="text-base font-bold text-neutral-900">No orders placed yet</h3>
            <p className="text-xs text-neutral-500 max-w-sm mx-auto">
              When you order, your shipping tracking codes and item receipts will appear here.
            </p>
            <Link to="/shop" className="btn-pill-dark text-xs py-2.5 px-6 inline-block">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div
                key={order._id || order.id}
                className="p-6 sm:p-8 rounded-3xl border border-neutral-200 bg-white space-y-6 shadow-subtle"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-neutral-100 gap-2">
                  <div>
                    <span className="text-xs text-neutral-500">Order Number</span>
                    <p className="font-mono text-base font-bold text-neutral-900">{order.orderNumber}</p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs text-neutral-500">
                      {new Date(order.createdAt).toLocaleDateString('en-GB')}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-4">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="flex space-x-4 items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-20 object-cover rounded-xl bg-neutral-100"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-neutral-900">{item.name}</p>
                        {item.variant && (
                          <p className="text-xs text-neutral-500">Variant: {item.variant}</p>
                        )}
                        <p className="text-xs text-neutral-600">Quantity: {item.quantity}</p>
                      </div>
                      <span className="text-sm font-bold text-neutral-900">
                        £{(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Tracking & Total Bar */}
                <div className="pt-4 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="flex items-center space-x-2 text-neutral-600">
                    <Truck className="w-4 h-4 text-black" />
                    <span>
                      Tracking:{' '}
                      <strong className="font-mono text-neutral-900">
                        {order.trackingNumber || 'DPD-UK-TRACK-PENDING'}
                      </strong>
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-neutral-500 mr-2">Total Paid:</span>
                    <span className="text-base font-extrabold text-neutral-900">
                      £{order.total?.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
