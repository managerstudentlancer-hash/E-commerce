import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  IndianRupee,
  ShoppingCart,
  Users,
  Package,
  Clock,
  AlertTriangle,
  TrendingUp,
  ArrowUpRight,
  Loader2,
  ChevronRight,
  RefreshCw,
  Sparkles,
  Plus,
  Tag,
  Image as ImageIcon,
  BarChart3,
  LineChart as LineChartIcon,
  PieChart as PieChartIcon,
  Activity,
  Layers,
  CheckCircle2,
  Eye,
  Filter,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Graph Controls State
  const [timeRange, setTimeRange] = useState('7d'); // '7d' | '30d'
  const [chartType, setChartType] = useState('area'); // 'area' | 'bar' | 'dual'
  const [hoveredPoint, setHoveredPoint] = useState(null);
  const [hoveredCategory, setHoveredCategory] = useState(null);

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

  const s = data?.stats || {};
  const salesChart7d = data?.salesChart || [];
  const salesChart30d = data?.salesChart30d || [];
  const categoryDistribution = data?.categoryDistribution || [];
  const topProducts = data?.topProducts || [];
  const lowStock = data?.lowStockProducts || [];
  const recentOrders = data?.recentOrders || [];
  const statusCounts = s?.statusCounts || {};

  // Active chart data based on time range
  const activeSeries = useMemo(() => {
    return timeRange === '30d' && salesChart30d.length > 0 ? salesChart30d : salesChart7d;
  }, [timeRange, salesChart30d, salesChart7d]);

  // Max value calculation for chart scaling
  const maxSales = useMemo(() => {
    const max = Math.max(...activeSeries.map((d) => d.sales || 0), 100);
    return Math.ceil(max / 50) * 50; // rounded up
  }, [activeSeries]);

  const maxOrders = useMemo(() => {
    return Math.max(...activeSeries.map((d) => d.orders || 0), 5);
  }, [activeSeries]);

  const totalPeriodRevenue = useMemo(() => {
    return activeSeries.reduce((sum, d) => sum + (d.sales || 0), 0);
  }, [activeSeries]);

  const totalPeriodOrders = useMemo(() => {
    return activeSeries.reduce((sum, d) => sum + (d.orders || 0), 0);
  }, [activeSeries]);

  const averageOrderValue = useMemo(() => {
    return totalPeriodOrders > 0 ? (totalPeriodRevenue / totalPeriodOrders).toFixed(2) : '0.00';
  }, [totalPeriodRevenue, totalPeriodOrders]);

  // SVG Coordinate calculation for smooth Area / Spline curve
  const chartCoordinates = useMemo(() => {
    if (!activeSeries || activeSeries.length === 0) return [];
    const width = 800;
    const height = 240;
    const paddingX = 30;
    const paddingY = 30;

    const usableWidth = width - paddingX * 2;
    const usableHeight = height - paddingY * 2;
    const stepX = usableWidth / Math.max(1, activeSeries.length - 1);

    return activeSeries.map((d, idx) => {
      const x = paddingX + idx * stepX;
      const y = height - paddingY - (d.sales / maxSales) * usableHeight;
      const orderY = height - paddingY - (d.orders / maxOrders) * usableHeight;
      return { x, y, orderY, data: d, index: idx };
    });
  }, [activeSeries, maxSales, maxOrders]);

  // Generate SVG path strings
  const svgPaths = useMemo(() => {
    if (chartCoordinates.length === 0) return { areaPath: '', linePath: '', orderLinePath: '' };
    const width = 800;
    const height = 240;
    const paddingY = 30;

    let linePath = `M ${chartCoordinates[0].x} ${chartCoordinates[0].y}`;
    let orderLinePath = `M ${chartCoordinates[0].x} ${chartCoordinates[0].orderY}`;

    for (let i = 1; i < chartCoordinates.length; i++) {
      const prev = chartCoordinates[i - 1];
      const curr = chartCoordinates[i];
      // Catmull-Rom or cubic Bezier smoothing
      const cp1x = prev.x + (curr.x - prev.x) / 2;
      const cp1y = prev.y;
      const cp2x = prev.x + (curr.x - prev.x) / 2;
      const cp2y = curr.y;
      linePath += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${curr.x} ${curr.y}`;

      const ocp1x = prev.x + (curr.x - prev.x) / 2;
      const ocp1y = prev.orderY;
      const ocp2x = prev.x + (curr.x - prev.x) / 2;
      const ocp2y = curr.orderY;
      orderLinePath += ` C ${ocp1x} ${ocp1y}, ${ocp2x} ${ocp2y}, ${curr.x} ${curr.orderY}`;
    }

    const last = chartCoordinates[chartCoordinates.length - 1];
    const first = chartCoordinates[0];
    const areaPath = `${linePath} L ${last.x} ${height - paddingY} L ${first.x} ${height - paddingY} Z`;

    return { areaPath, linePath, orderLinePath };
  }, [chartCoordinates]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[65vh]">
        <div className="flex flex-col items-center space-y-4 text-slate-400">
          <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shadow-lg glow-cyan">
            <Loader2 className="w-7 h-7 animate-spin text-cyan-400" />
          </div>
          <p className="text-xs font-bold tracking-wider uppercase text-slate-300">
            Rendering Real-Time Analytics &amp; Graphs...
          </p>
        </div>
      </div>
    );
  }

  // Color palette for category donut
  const categoryColors = [
    '#38BDF8', // Cyan
    '#A855F7', // Purple
    '#10B981', // Emerald
    '#F59E0B', // Amber
    '#EC4899', // Pink
    '#6366F1', // Indigo
  ];

  return (
    <div className="space-y-6 sm:space-y-8 animate-fade-in text-slate-100">
      {/* Personalized Welcome Banner with Registered Admin's Name */}
      <div className="bg-gradient-to-r from-cyan-950/40 via-indigo-950/30 to-purple-950/20 p-6 rounded-3xl border border-cyan-500/25 shadow-xl backdrop-blur-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[2px] shadow-lg shadow-cyan-500/20 flex-shrink-0">
            <div className="w-full h-full bg-[#0C111D] rounded-[14px] flex items-center justify-center font-black text-xl text-cyan-300">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
            </div>
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-black text-white">
                Welcome back, {user?.name || 'Administrator'}! 👋
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-[10px] font-extrabold uppercase">
                Master Admin
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Logged in with account: <span className="font-mono text-slate-200">{user?.email}</span> • Real-time telemetry, store metrics, and control active.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-xs">
          <button
            onClick={handleRefresh}
            className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 flex items-center space-x-2 transition-all active:scale-95"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>Refresh Telemetry</span>
          </button>
        </div>
      </div>

      {/* Top Header & Fast Action Launchpad */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 bg-gradient-to-r from-white/[0.04] via-white/[0.02] to-transparent p-6 rounded-3xl border border-white/10 shadow-xl backdrop-blur-xl">
        <div className="space-y-1">
          <div className="flex items-center space-x-2.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse glow-emerald" />
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-400">
              Live Real-Time Telemetry Radar
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Store Performance &amp; Analytics
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Interactive revenue charts, order volume velocity, category breakdown, and inventory radar.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/admin/products"
            className="px-4 py-2.5 rounded-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-extrabold flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Product</span>
          </Link>

          <Link
            to="/admin/coupons"
            className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center space-x-2 transition-all active:scale-95"
          >
            <Tag className="w-3.5 h-3.5 text-amber-400" />
            <span>New Coupon</span>
          </Link>

          <Link
            to="/admin/banners"
            className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-white text-xs font-bold border border-white/10 flex items-center space-x-2 transition-all active:scale-95"
          >
            <ImageIcon className="w-3.5 h-3.5 text-purple-400" />
            <span>Banners</span>
          </Link>

          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="px-4 py-2.5 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 text-xs font-bold border border-white/10 flex items-center space-x-2 transition-all"
            title="Sync live MongoDB metrics"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Metrics'}</span>
          </button>
        </div>
      </div>

      {/* 6 Luxury Glowing KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Total Sales */}
        <div className="admin-card p-5 rounded-3xl flex flex-col justify-between group hover:border-emerald-500/40 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Gross Revenue
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 glow-emerald">
              <IndianRupee className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-white tracking-tight font-mono">
              ₹{(s.totalRevenue || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
            </p>
            <span className="text-[10px] text-emerald-400 font-bold flex items-center mt-1">
              <TrendingUp className="w-3 h-3 mr-1" /> All-Time Volume
            </span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="admin-card p-5 rounded-3xl flex flex-col justify-between group hover:border-cyan-500/40 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl group-hover:bg-cyan-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Total Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 glow-cyan">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-white tracking-tight font-mono">{s.totalOrders || 0}</p>
            <span className="text-[10px] text-cyan-300 font-semibold mt-1 block">
              Recorded orders
            </span>
          </div>
        </div>

        {/* Average Order Value (AOV) */}
        <div className="admin-card p-5 rounded-3xl flex flex-col justify-between group hover:border-purple-500/40 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-purple-500/10 rounded-full blur-xl group-hover:bg-purple-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Avg Order Value
            </span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 glow-purple">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-white tracking-tight font-mono">₹{averageOrderValue}</p>
            <span className="text-[10px] text-purple-300 font-bold flex items-center mt-1">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> AOV Efficiency
            </span>
          </div>
        </div>

        {/* Total Products */}
        <div className="admin-card p-5 rounded-3xl flex flex-col justify-between group hover:border-indigo-500/40 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-indigo-500/10 rounded-full blur-xl group-hover:bg-indigo-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Active SKUs
            </span>
            <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-white tracking-tight font-mono">{s.totalProducts || 0}</p>
            <span className="text-[10px] text-slate-400 font-medium mt-1 block">
              Marketplace items
            </span>
          </div>
        </div>

        {/* Pending Orders */}
        <div className="admin-card p-5 rounded-3xl flex flex-col justify-between group hover:border-amber-500/40 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Pending Orders
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 glow-amber">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-amber-400 tracking-tight font-mono">{s.pendingOrdersCount || 0}</p>
            <span className="text-[10px] text-amber-200 font-medium mt-1 block">
              Fulfillment queue
            </span>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="admin-card p-5 rounded-3xl flex flex-col justify-between group hover:border-rose-500/40 relative overflow-hidden">
          <div className="absolute -right-6 -top-6 w-20 h-20 bg-rose-500/10 rounded-full blur-xl group-hover:bg-rose-500/20 transition-colors" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400">
              Low Stock Alerts
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 glow-rose">
              <AlertTriangle className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4">
            <p className="text-xl font-black text-rose-400 tracking-tight font-mono">{s.lowStockCount || 0}</p>
            <span className="text-[10px] text-rose-300 font-medium mt-1 block">
              Under 10 units
            </span>
          </div>
        </div>
      </div>

      {/* 📊 SECTION 1: INTERACTIVE MULTI-VIEW GRAPH SUITE */}
      <div className="admin-card p-6 sm:p-8 rounded-3xl space-y-6">
        {/* Graph Header & Interactive Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 glow-cyan animate-pulse" />
              <h3 className="text-base font-black tracking-tight text-white uppercase">
                Interactive Revenue &amp; Sales Velocity Visualizer
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Hover over graph data points to inspect daily revenue, order throughput, and conversion metrics.
            </p>
          </div>

          {/* Control Pills (Time Range + Graph Mode) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Time Range Toggle */}
            <div className="flex items-center p-1 bg-slate-900/80 rounded-2xl border border-white/10">
              <button
                onClick={() => setTimeRange('7d')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === '7d'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                7 Days
              </button>
              <button
                onClick={() => setTimeRange('30d')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  timeRange === '30d'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                30 Days
              </button>
            </div>

            {/* Chart Type Toggle */}
            <div className="flex items-center p-1 bg-slate-900/80 rounded-2xl border border-white/10">
              <button
                onClick={() => setChartType('area')}
                className={`p-1.5 rounded-xl transition-all flex items-center space-x-1 text-xs font-bold px-2.5 ${
                  chartType === 'area'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Smooth Area Curve"
              >
                <LineChartIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Smooth Wave</span>
              </button>
              <button
                onClick={() => setChartType('bar')}
                className={`p-1.5 rounded-xl transition-all flex items-center space-x-1 text-xs font-bold px-2.5 ${
                  chartType === 'bar'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Neon Bar Histogram"
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Histogram</span>
              </button>
              <button
                onClick={() => setChartType('dual')}
                className={`p-1.5 rounded-xl transition-all flex items-center space-x-1 text-xs font-bold px-2.5 ${
                  chartType === 'dual'
                    ? 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-slate-950 font-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
                title="Dual Revenue + Orders Mode"
              >
                <Activity className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Dual Curve</span>
              </button>
            </div>
          </div>
        </div>

        {/* Live Period Highlights Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-900/40 p-4 rounded-2xl border border-white/5 text-xs">
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Period Total Revenue</p>
            <p className="text-lg font-black text-emerald-400 font-mono mt-0.5">
              ₹{totalPeriodRevenue.toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Period Orders</p>
            <p className="text-lg font-black text-cyan-300 font-mono mt-0.5">
              {totalPeriodOrders} orders
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Period Avg Basket</p>
            <p className="text-lg font-black text-purple-300 font-mono mt-0.5">
              ₹{averageOrderValue}
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase font-bold text-slate-400">Peak Velocity</p>
            <p className="text-lg font-black text-amber-300 font-mono mt-0.5">
              ₹{maxSales.toFixed(2)} / day
            </p>
          </div>
        </div>

        {/* 📈 MAIN SVG CHART CONTAINER */}
        <div className="relative w-full pt-4">
          {/* Active Hover Floating Telemetry Card */}
          {hoveredPoint && (
            <div
              className="absolute z-30 pointer-events-none p-3.5 rounded-2xl bg-slate-900/95 border border-cyan-500/40 shadow-2xl backdrop-blur-xl glow-cyan animate-fade-in text-xs font-medium min-w-[180px]"
              style={{
                left: `${Math.min(Math.max(10, (hoveredPoint.x / 800) * 100), 75)}%`,
                top: `${Math.max(0, (hoveredPoint.y / 240) * 100 - 35)}%`,
              }}
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-1.5 mb-1.5">
                <span className="font-bold text-white uppercase">{hoveredPoint.data.day}</span>
                <span className="text-[10px] text-cyan-300 font-mono">{hoveredPoint.data.date}</span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Revenue:</span>
                  <span className="font-black text-emerald-400 font-mono text-sm">
                    ₹{hoveredPoint.data.sales.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Orders:</span>
                  <span className="font-bold text-cyan-300 font-mono">
                    {hoveredPoint.data.orders} orders
                  </span>
                </div>
              </div>
            </div>
          )}

          {chartType === 'bar' ? (
            /* Bar Histogram View */
            <div className="h-64 flex items-end justify-between gap-1.5 sm:gap-3 px-2 border-b border-white/10 pb-2">
              {activeSeries.map((point, index) => {
                const heightPercent = Math.max(8, Math.round((point.sales / maxSales) * 100));
                const isHovered = hoveredPoint?.index === index;
                return (
                  <div
                    key={index}
                    onMouseEnter={() =>
                      setHoveredPoint({
                        x: (index / activeSeries.length) * 800,
                        y: 120,
                        data: point,
                        index,
                      })
                    }
                    onMouseLeave={() => setHoveredPoint(null)}
                    className="flex-1 flex flex-col items-center group relative h-full justify-end cursor-pointer"
                  >
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full rounded-t-2xl transition-all duration-300 relative overflow-hidden ${
                        isHovered
                          ? 'bg-gradient-to-t from-emerald-400 to-cyan-300 shadow-lg shadow-cyan-500/50 scale-x-110'
                          : 'bg-gradient-to-t from-cyan-500/30 via-cyan-400/70 to-indigo-400 group-hover:from-cyan-400 group-hover:to-emerald-300'
                      }`}
                    >
                      <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* SVG Area / Spline Wave Curve View */
            <div className="w-full relative h-64">
              <svg
                viewBox="0 0 800 240"
                preserveAspectRatio="none"
                className="w-full h-full overflow-visible"
              >
                <defs>
                  {/* Revenue Gradient */}
                  <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.45" />
                    <stop offset="50%" stopColor="#6366F1" stopOpacity="0.2" />
                    <stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
                  </linearGradient>

                  {/* Line Stroke Gradient */}
                  <linearGradient id="lineStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#10B981" />
                    <stop offset="50%" stopColor="#38BDF8" />
                    <stop offset="100%" stopColor="#818CF8" />
                  </linearGradient>

                  {/* Order Line Gradient */}
                  <linearGradient id="orderLineStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#F59E0B" />
                    <stop offset="100%" stopColor="#EC4899" />
                  </linearGradient>
                </defs>

                {/* Horizontal Gridlines */}
                {[0.25, 0.5, 0.75, 1].map((lvl, idx) => (
                  <line
                    key={idx}
                    x1="20"
                    y1={210 - lvl * 180}
                    x2="780"
                    y2={210 - lvl * 180}
                    stroke="rgba(255,255,255,0.06)"
                    strokeDasharray="4 4"
                  />
                ))}

                {/* Area Fill */}
                <path d={svgPaths.areaPath} fill="url(#areaGradient)" />

                {/* Main Revenue Curve */}
                <path
                  d={svgPaths.linePath}
                  fill="none"
                  stroke="url(#lineStroke)"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  className="filter drop-shadow-[0_0_12px_rgba(56,189,248,0.4)]"
                />

                {/* Dual Mode: Order Volume Curve */}
                {chartType === 'dual' && (
                  <path
                    d={svgPaths.orderLinePath}
                    fill="none"
                    stroke="url(#orderLineStroke)"
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                    strokeLinecap="round"
                  />
                )}

                {/* Interactive Points on Line */}
                {chartCoordinates.map((pt, idx) => {
                  const isHovered = hoveredPoint?.index === idx;
                  return (
                    <g
                      key={idx}
                      onMouseEnter={() => setHoveredPoint(pt)}
                      onMouseLeave={() => setHoveredPoint(null)}
                      className="cursor-pointer"
                    >
                      {/* Invisible hover capture target */}
                      <circle cx={pt.x} cy={pt.y} r="18" fill="transparent" />

                      {/* Visible Node */}
                      <circle
                        cx={pt.x}
                        cy={pt.y}
                        r={isHovered ? '7' : '4.5'}
                        fill="#0F172A"
                        stroke={isHovered ? '#10B981' : '#38BDF8'}
                        strokeWidth={isHovered ? '3.5' : '2.5'}
                        className="transition-all duration-200 filter drop-shadow-[0_0_8px_rgba(56,189,248,0.8)]"
                      />
                    </g>
                  );
                })}
              </svg>
            </div>
          )}

          {/* X-axis Timeline Labels */}
          <div className="flex justify-between gap-1 pt-3 text-[10px] font-bold uppercase text-slate-400">
            {activeSeries.map((point, idx) => {
              // On 30-day mode, only show every 4th label to avoid overlapping
              if (timeRange === '30d' && idx % 4 !== 0 && idx !== activeSeries.length - 1) {
                return <div key={idx} className="flex-1" />;
              }
              return (
                <div key={idx} className="flex-1 text-center">
                  <span className="block text-slate-200">{point.day}</span>
                  <span className="text-[9px] text-slate-500 font-mono">{point.date}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 border-t border-white/5 text-xs text-slate-400 font-semibold">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-gradient-to-r from-emerald-400 to-cyan-400" />
            <span>Gross Revenue (₹)</span>
          </div>
          {chartType === 'dual' && (
            <div className="flex items-center space-x-2">
              <span className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-400 to-pink-500" />
              <span>Orders Placed (Count)</span>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500" />
            <span>Baseline Volume (₹0.00)</span>
          </div>
        </div>
      </div>

      {/* 📊 SECTION 2: CATEGORY SALES RADIAL DONUT + FULFILLMENT PIPELINE */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Category Distribution Radial / Progress Rings */}
        <div className="admin-card p-6 sm:p-7 rounded-3xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-2">
                <PieChartIcon className="w-4 h-4 text-purple-400" />
                <span>Department Catalog Distribution</span>
              </h3>
              <p className="text-[11px] text-slate-400">Inventory share across luxury departments</p>
            </div>
            <Link
              to="/admin/categories"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center"
            >
              <span>Manage</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {/* Interactive Category Progress Bars */}
          <div className="space-y-4 pt-1">
            {categoryDistribution.length === 0 ? (
              <p className="py-10 text-center text-xs text-slate-400">No active categories found.</p>
            ) : (
              categoryDistribution.map((cat, idx) => {
                const color = categoryColors[idx % categoryColors.length];
                const isHovered = hoveredCategory === cat.name;
                return (
                  <div
                    key={cat.name}
                    onMouseEnter={() => setHoveredCategory(cat.name)}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className={`p-3 rounded-2xl transition-all cursor-pointer ${
                      isHovered ? 'bg-white/5 border border-white/10 shadow-lg' : 'hover:bg-white/[0.02]'
                    }`}
                  >
                    <div className="flex justify-between items-center text-xs mb-1.5">
                      <div className="flex items-center space-x-2.5">
                        <span
                          className="w-3 h-3 rounded-full shadow-sm"
                          style={{ backgroundColor: color }}
                        />
                        <span className="font-bold text-white">{cat.name}</span>
                        <span className="text-[10px] text-slate-400 font-mono">({cat.count} items)</span>
                      </div>
                      <div className="text-right flex items-center space-x-3">
                        <span className="text-[11px] text-slate-400 font-mono">Avg ₹{cat.avgPrice}</span>
                        <span className="font-black font-mono text-cyan-300">{cat.percentage}%</span>
                      </div>
                    </div>

                    {/* Progress Track */}
                    <div className="w-full h-2 rounded-full bg-slate-900 overflow-hidden">
                      <div
                        style={{ width: `${cat.percentage}%`, backgroundColor: color }}
                        className="h-full rounded-full transition-all duration-700 shadow-md"
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* 2. Order Fulfillment Funnel Pipeline */}
        <div className="admin-card p-6 sm:p-7 rounded-3xl space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div className="space-y-0.5">
              <h3 className="text-sm font-black uppercase tracking-wider text-white flex items-center space-x-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Order Fulfillment Pipeline</span>
              </h3>
              <p className="text-[11px] text-slate-400">Active status distribution of all recorded orders</p>
            </div>
            <Link
              to="/admin/orders"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center"
            >
              <span>Dispatch</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {/* Pipeline Stages */}
          <div className="space-y-3 pt-1">
            {[
              {
                label: 'Pending Approval',
                count: statusCounts.pending || 0,
                color: 'bg-amber-400',
                textColor: 'text-amber-400',
                bgLight: 'bg-amber-400/10',
              },
              {
                label: 'Confirmed & Processing',
                count: (statusCounts.confirmed || 0) + (statusCounts.processing || 0),
                color: 'bg-purple-400',
                textColor: 'text-purple-400',
                bgLight: 'bg-purple-400/10',
              },
              {
                label: 'Shipped & Out for Delivery',
                count: (statusCounts.shipped || 0) + (statusCounts.out_for_delivery || 0),
                color: 'bg-cyan-400',
                textColor: 'text-cyan-400',
                bgLight: 'bg-cyan-400/10',
              },
              {
                label: 'Delivered to Customer',
                count: statusCounts.delivered || 0,
                color: 'bg-emerald-400',
                textColor: 'text-emerald-400',
                bgLight: 'bg-emerald-400/10',
              },
              {
                label: 'Cancelled / Returned',
                count: (statusCounts.cancelled || 0) + (statusCounts.returned || 0),
                color: 'bg-rose-400',
                textColor: 'text-rose-400',
                bgLight: 'bg-rose-400/10',
              },
            ].map((stage, idx) => {
              const totalOrders = Math.max(1, s.totalOrders || 1);
              const percentage = Math.round((stage.count / totalOrders) * 100);
              return (
                <div key={idx} className="p-3 bg-slate-900/50 rounded-2xl border border-white/5 space-y-1.5">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-200">{stage.label}</span>
                    <div className="flex items-center space-x-2">
                      <span className={`font-mono font-black ${stage.textColor}`}>
                        {stage.count} orders
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">({percentage}%)</span>
                    </div>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-slate-900 overflow-hidden">
                    <div
                      style={{ width: `${Math.max(4, percentage)}%` }}
                      className={`h-full rounded-full ${stage.color} transition-all duration-500`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 📊 SECTION 3: TOP PRODUCTS LEADERBOARD & RECENT ORDERS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Selling Products */}
        <div className="admin-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Top Best Sellers</span>
            </h3>
            <Link
              to="/admin/products"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center"
            >
              <span>Catalog</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="divide-y divide-white/5 space-y-1">
            {topProducts.length === 0 ? (
              <p className="py-10 text-center text-xs text-slate-400">No recorded product sales yet.</p>
            ) : (
              topProducts.map((prod, idx) => (
                <div key={prod.id || idx} className="py-3 flex items-center justify-between space-x-3 group">
                  <div className="flex items-center space-x-3 min-w-0">
                    <span
                      className={`w-6 h-6 rounded-lg text-center text-xs font-black flex items-center justify-center flex-shrink-0 ${
                        idx === 0
                          ? 'bg-amber-400/20 text-amber-300 border border-amber-400/30'
                          : idx === 1
                          ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30'
                          : idx === 2
                          ? 'bg-amber-700/20 text-amber-400 border border-amber-700/30'
                          : 'bg-white/5 text-slate-400'
                      }`}
                    >
                      #{idx + 1}
                    </span>
                    <img
                      src={prod.image}
                      alt=""
                      className="w-10 h-10 object-cover rounded-xl bg-slate-900 border border-white/10 flex-shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                        {prod.name}
                      </p>
                      <p className="text-[10px] text-slate-400">{prod.soldUnits} units dispatched</p>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs font-black text-emerald-400 font-mono">
                      ₹{prod.revenue?.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="admin-card p-6 rounded-3xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/5">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-white flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Low Stock Radar</span>
            </h3>
            <Link
              to="/admin/inventory"
              className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
            >
              <span>Stock Control</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                <tr>
                  <th className="pb-3">Item Name</th>
                  <th className="pb-3">Department</th>
                  <th className="pb-3 text-right">Units Left</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-slate-300">
                {lowStock.length === 0 ? (
                  <tr>
                    <td colSpan="3" className="py-8 text-center text-slate-400 text-xs">
                      All inventory healthy. Zero shortage alerts logged.
                    </td>
                  </tr>
                ) : (
                  lowStock.map((prod) => (
                    <tr key={prod._id} className="hover:bg-white/[0.03] transition-colors">
                      <td className="py-3 flex items-center space-x-3">
                        <img
                          src={prod.thumbnail}
                          alt=""
                          className="w-8 h-8 rounded-xl object-cover bg-slate-900 border border-white/10 flex-shrink-0"
                        />
                        <span className="font-bold text-slate-200 truncate max-w-[180px]">
                          {prod.name}
                        </span>
                      </td>
                      <td className="py-3 text-slate-400">{prod.category}</td>
                      <td className="py-3 text-right">
                        <span className="px-2.5 py-1 rounded-full text-xs font-black bg-rose-500/10 text-rose-400 border border-rose-500/20 font-mono">
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
