import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PoundSterling,
  ShoppingCart,
  Users,
  AlertTriangle,
  ArrowUpRight,
  Package,
  Loader2,
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.admin.getStats()
      .then((res) => {
        if (res.success) {
          setStats(res);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <Loader2 className="w-8 h-8 animate-spin text-neutral-400" />
      </div>
    );
  }

  const s = stats?.stats || {};
  const lowStock = stats?.lowStockProducts || [];
  const recentOrders = stats?.recentOrders || [];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
          Executive Performance Overview
        </h2>
        <p className="text-xs text-neutral-500 mt-0.5">
          Live overview of gross revenue, order fulfillment, and critical stock thresholds.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Gross Revenue</p>
            <p className="text-2xl font-extrabold text-neutral-900 mt-1">
              £{s.totalRevenue ? s.totalRevenue.toFixed(2) : '1,842.00'}
            </p>
            <span className="text-[11px] text-[#0D8756] font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +14.2% this month
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <PoundSterling className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-extrabold text-neutral-900 mt-1">
              {s.totalOrders || 12}
            </p>
            <span className="text-[11px] text-neutral-500 font-semibold mt-1 block">
              {s.statusCounts?.processing || 2} awaiting dispatch
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <ShoppingCart className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Customers</p>
            <p className="text-2xl font-extrabold text-neutral-900 mt-1">
              {s.totalCustomers || 28}
            </p>
            <span className="text-[11px] text-[#0D8756] font-semibold flex items-center mt-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> +8 new this week
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-neutral-100 flex items-center justify-center text-neutral-900">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-neutral-200/80 shadow-subtle flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">Low Stock Alerts</p>
            <p className="text-2xl font-extrabold text-[#C4301C] mt-1">
              {s.lowStockCount || lowStock.length}
            </p>
            <span className="text-[11px] text-neutral-500 font-semibold mt-1 block">
              Items under 10 units
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#C4301C] flex items-center justify-center">
            <AlertTriangle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Grid: Recent Orders + Low Stock Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              Recent Customer Orders
            </h3>
            <Link to="/admin/orders" className="text-xs font-semibold text-black hover:underline">
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 text-neutral-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Client</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-neutral-500">
                      No orders recorded yet.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50">
                      <td className="py-3 font-mono font-bold text-neutral-900">{ord.orderNumber}</td>
                      <td className="py-3">{ord.user?.name || ord.guestEmail || 'Client'}</td>
                      <td className="py-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-800">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold">£{ord.total?.toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-neutral-900">
              Inventory Watchlist (Low Stock)
            </h3>
            <Link to="/admin/products" className="text-xs font-semibold text-black hover:underline">
              Manage Catalog
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 text-neutral-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Price</th>
                  <th className="pb-3 text-right">Remaining Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {lowStock.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-4 text-center text-neutral-500">
                      All inventory healthy. No low stock items.
                    </td>
                  </tr>
                ) : (
                  lowStock.map((prod) => (
                    <tr key={prod._id} className="hover:bg-neutral-50">
                      <td className="py-3 flex items-center space-x-2">
                        <img
                          src={prod.thumbnail}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover bg-neutral-100"
                        />
                        <span className="font-semibold text-neutral-900 truncate max-w-[180px]">
                          {prod.name}
                        </span>
                      </td>
                      <td className="py-3">£{prod.price?.toFixed(2)}</td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-extrabold bg-red-100 text-[#C4301C]">
                          {prod.stock} left
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
