import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PoundSterling,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  ChevronRight,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import api from '../../services/api';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const res = await api.admin.getStats();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error('Failed to load dashboard metrics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchDashboard();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center space-y-3 text-neutral-400">
          <Loader2 className="w-8 h-8 animate-spin text-neutral-900" />
          <p className="text-xs font-semibold">Aggregating live store performance...</p>
        </div>
      </div>
    );
  }

  const s = data?.stats || {};
  const salesChart = data?.salesChart || [];
  const topProducts = data?.topProducts || [];
  const lowStock = data?.lowStockProducts || [];
  const recentOrders = data?.recentOrders || [];

  // Calculate max sales value for chart scaling
  const maxSales = Math.max(...salesChart.map((d) => d.sales || 0), 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-neutral-900 tracking-tight">
            Store Performance & Analytics
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Real-time telemetry on revenue, active orders, customer acquisition, and inventory health.
          </p>
        </div>

        <div className="flex items-center space-x-2.5 self-start sm:self-auto">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="btn-pill-light text-xs py-2 px-4 flex items-center space-x-1.5 font-bold"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Metrics'}</span>
          </button>
        </div>
      </div>

      {/* 6 Essential KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Total Sales
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <PoundSterling className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-neutral-900">
              £{(s.totalRevenue || 0).toLocaleString('en-GB', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center mt-0.5">
              <TrendingUp className="w-3 h-3 mr-0.5" /> Live Gross
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-neutral-900">{s.totalOrders || 0}</p>
            <span className="text-[10px] text-neutral-500 font-semibold mt-0.5 block">
              Recorded orders
            </span>
          </div>
        </div>

        {/* Total Customers */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Total Customers
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-neutral-900">{s.totalCustomers || 0}</p>
            <span className="text-[10px] text-emerald-600 font-bold flex items-center mt-0.5">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> Buyer base
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Total Products
            </span>
            <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-900">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-neutral-900">{s.totalProducts || 0}</p>
            <span className="text-[10px] text-neutral-500 font-semibold mt-0.5 block">
              Live catalog items
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-amber-600">{s.pendingOrdersCount || 0}</p>
            <span className="text-[10px] text-neutral-500 font-semibold mt-0.5 block">
              Awaiting fulfillment
            </span>
          </div>
        </div>

        {/* Low Stock Products */}
        <div className="p-5 rounded-2xl bg-white border border-neutral-200/80 shadow-subtle flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-red-50 text-[#C4301C] flex items-center justify-center">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <p className="text-xl font-black text-[#C4301C]">{s.lowStockCount || 0}</p>
            <span className="text-[10px] text-neutral-500 font-semibold mt-0.5 block">
              Under 10 units left
            </span>
          </div>
        </div>
      </div>

      {/* Main Row: Sales Trend Chart & Top Selling Products */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sales Overview Visual Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900">
                Sales & Revenue Overview
              </h3>
              <p className="text-[11px] text-neutral-400">7-Day Real Order Performance Trend</p>
            </div>
            <div className="flex items-center space-x-3 text-xs font-semibold">
              <span className="flex items-center space-x-1.5 text-neutral-700">
                <span className="w-2.5 h-2.5 rounded-full bg-neutral-950" />
                <span>Revenue (£)</span>
              </span>
            </div>
          </div>

          {/* Interactive Chart Bars */}
          <div className="pt-4">
            <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 px-2 border-b border-neutral-100">
              {salesChart.map((point, index) => {
                const heightPercent = Math.max(8, Math.round((point.sales / maxSales) * 100));
                return (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center group relative h-full justify-end"
                  >
                    {/* Tooltip on hover */}
                    <div className="absolute -top-12 bg-neutral-900 text-white text-[10px] font-bold py-1 px-2.5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl whitespace-nowrap z-20">
                      £{point.sales.toFixed(2)} ({point.orders} orders)
                    </div>

                    {/* Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full max-w-[42px] bg-neutral-950 rounded-t-xl group-hover:bg-[#C4301C] transition-all duration-300 relative overflow-hidden"
                    >
                      <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* X-axis Labels */}
            <div className="flex justify-between gap-2 sm:gap-4 px-2 pt-2.5 text-[11px] text-neutral-400 font-bold uppercase">
              {salesChart.map((point, idx) => (
                <div key={idx} className="flex-1 text-center">
                  <span className="block text-neutral-900">{point.day}</span>
                  <span className="text-[9px] text-neutral-400 font-normal">{point.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Selling Products */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900">
              Top Selling Products
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-neutral-500 hover:text-black transition-colors"
            >
              All Items
            </Link>
          </div>

          <div className="divide-y divide-neutral-100">
            {topProducts.length === 0 ? (
              <p className="py-8 text-center text-xs text-neutral-400">No product sales logged yet.</p>
            ) : (
              topProducts.map((prod, idx) => (
                <div key={prod.id || idx} className="py-3 flex items-center justify-between space-x-3">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span className="w-5 text-center text-xs font-black text-neutral-400">
                      #{idx + 1}
                    </span>
                    <img
                      src={prod.image}
                      alt=""
                      className="w-10 h-10 object-cover rounded-xl bg-neutral-100 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-neutral-900 truncate">{prod.name}</p>
                      <p className="text-[10px] text-neutral-500">{prod.soldUnits} units sold</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black text-neutral-900">£{prod.revenue?.toFixed(2)}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Bottom Row: Recent Orders & Low Stock Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900">
              Recent Orders
            </h3>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-neutral-500 hover:text-black flex items-center space-x-1"
            >
              <span>Manage Orders</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 text-neutral-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">Order #</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-6 text-center text-neutral-400">
                      No recent customer orders found.
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((ord) => (
                    <tr key={ord._id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 font-mono font-bold text-neutral-900">
                        <Link to="/admin/orders" className="hover:underline">
                          {ord.orderNumber}
                        </Link>
                      </td>
                      <td className="py-3">{ord.user?.name || ord.guestEmail || 'Direct Client'}</td>
                      <td className="py-3">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-neutral-100 text-neutral-800">
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td className="py-3 text-right font-black text-neutral-900">
                        £{ord.total?.toFixed(2)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200/80 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-neutral-900">
              Low Stock Alerts
            </h3>
            <Link
              to="/admin/inventory"
              className="text-xs font-bold text-neutral-500 hover:text-black flex items-center space-x-1"
            >
              <span>Manage Stock</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-100 text-neutral-400 uppercase font-semibold">
                <tr>
                  <th className="pb-3">Product</th>
                  <th className="pb-3">Category</th>
                  <th className="pb-3 text-right">Units Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {lowStock.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-6 text-center text-neutral-400">
                      All inventory is healthy. Zero low stock items.
                    </td>
                  </tr>
                ) : (
                  lowStock.map((prod) => (
                    <tr key={prod._id} className="hover:bg-neutral-50/70 transition-colors">
                      <td className="py-3 flex items-center space-x-2.5">
                        <img
                          src={prod.thumbnail}
                          alt=""
                          className="w-8 h-8 rounded-lg object-cover bg-neutral-100 flex-shrink-0"
                        />
                        <span className="font-bold text-neutral-900 truncate max-w-[180px]">
                          {prod.name}
                        </span>
                      </td>
                      <td className="py-3 text-neutral-500">{prod.category}</td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-red-100 text-[#C4301C]">
                          {prod.stock} units
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
