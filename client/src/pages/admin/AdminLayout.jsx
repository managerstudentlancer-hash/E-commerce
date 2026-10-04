import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Users,
  Boxes,
  Tag,
  Star,
  Image as ImageIcon,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
  Sparkles,
  Layers,
  ArrowUpRight,
  Database,
  Radio,
  HelpCircle,
  Loader2,
  Gift,
  Headphones,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const adminNavItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard, badge: null },
  { name: 'Products', path: '/admin/products', icon: Package, badge: null },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree, badge: null },
  { name: 'Collections', path: '/admin/collections', icon: Layers, badge: null },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart, badge: 'Live' },
  { name: 'Customers', path: '/admin/customers', icon: Users, badge: null },
  { name: 'Users & Roles', path: '/admin/users', icon: Users, badge: null },
  { name: '24/7 Customer Care', path: '/admin/support', icon: Headphones, badge: 'Live' },
  { name: 'Inventory', path: '/admin/inventory', icon: Boxes, badge: 'Stock' },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag, badge: null },
  { name: 'Offers & Deals', path: '/admin/offers', icon: Gift, badge: 'Live' },
  { name: 'Reviews', path: '/admin/reviews', icon: Star, badge: null },
  { name: 'Banners', path: '/admin/banners', icon: ImageIcon, badge: null },
  { name: 'Brand Logo', path: '/admin/logo', icon: Sparkles, badge: 'Live' },
  { name: 'Settings', path: '/admin/settings', icon: Sliders, badge: null },
];

const AdminLayout = () => {
  const { user, loading, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // During auth check, show loading spinner
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#080B11]">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-400" />
      </div>
    );
  }

  // Role verification guard
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-[#080B11] text-center font-sans antialiased">
        <div className="max-w-md w-full admin-card p-8 rounded-3xl shadow-2xl space-y-5 border border-white/10 backdrop-blur-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto shadow-inner glow-rose">
            <ShieldCheck className="w-9 h-9" />
          </div>
          <div className="space-y-1.5">
            <h2 className="text-2xl font-black tracking-tight text-white">Administrator Access Required</h2>
            <p className="text-xs text-slate-400 leading-relaxed">
              High-privilege security clearance is required to enter the VEXIVO Master Control Panel.
            </p>
          </div>
          <div className="pt-3 flex flex-col gap-2.5">
            <Link
              to="/admin/login"
              className="w-full py-3.5 px-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-extrabold text-xs tracking-wider uppercase transition-all shadow-lg hover:shadow-cyan-500/20 active:scale-[0.98]"
            >
              Authenticate as Administrator
            </Link>
            <Link
              to="/"
              className="w-full py-3 px-6 rounded-full bg-white/5 hover:bg-white/10 text-slate-300 font-semibold text-xs border border-white/10 transition-colors"
            >
              Return to Public Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  const isNavActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex font-sans antialiased selection:bg-cyan-500 selection:text-black">
      {/* Background ambient lighting effects */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-72 bg-[#0C111D]/90 backdrop-blur-2xl border-r border-white/10 flex-shrink-0 z-30 shadow-2xl relative">
        {/* Brand Header */}
        <div className="h-20 px-6 border-b border-white/10 flex items-center justify-between">
          <Link to="/admin" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-indigo-500 to-emerald-400 p-[1.5px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full bg-[#0C111D] rounded-[14px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
              </div>
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-lg font-black tracking-wider text-white">VEXIVO</span>
                <span className="text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 text-white shadow-sm">
                  PRO
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-wide">Enterprise Suite</p>
            </div>
          </Link>
        </div>

        {/* Logged In Admin Identity Card */}
        <div className="px-5 pt-3">
          <div className="p-3.5 rounded-2xl bg-gradient-to-r from-cyan-500/15 via-indigo-500/10 to-transparent border border-cyan-500/30 flex items-center space-x-3 shadow-md">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] flex-shrink-0 shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#0C111D] rounded-[14px] flex items-center justify-center font-black text-sm text-cyan-300">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center space-x-1.5">
                <p className="text-xs font-black text-white truncate">{user?.name || 'Administrator'}</p>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />
              </div>
              <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider mt-0.5">
                Master Admin Portal
              </p>
              <p className="text-[10px] text-slate-400 truncate font-mono mt-0.5">{user?.email}</p>
            </div>
          </div>
        </div>

        {/* Live Telemetry Pill */}
        <div className="px-5 pt-2">
          <div className="p-3 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-slate-300">Live MongoDB Cloud</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
              ACTIVE
            </span>
          </div>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-extrabold uppercase tracking-widest text-slate-400 px-3 pt-2 pb-1">
            Store Command Center
          </p>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`group relative flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold transition-all duration-300 ${
                  active
                    ? 'bg-gradient-to-r from-cyan-500/20 via-indigo-500/15 to-transparent text-white border border-cyan-500/40 shadow-lg shadow-cyan-500/5'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.04] border border-transparent'
                }`}
              >
                <div className="flex items-center space-x-3.5">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center transition-colors ${
                      active
                        ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/30'
                        : 'bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="tracking-wide">{item.name}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                      item.badge === 'Live'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 animate-pulse'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                {active && (
                  <span className="absolute right-0 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-cyan-400 rounded-l-full shadow-lg shadow-cyan-400" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2 bg-[#0A0E17]/60">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-slate-300 bg-white/5 hover:bg-white/10 border border-white/10 transition-all group"
          >
            <span className="flex items-center space-x-2.5">
              <ExternalLink className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
              <span>Live Storefront</span>
            </span>
            <span className="text-[10px] text-slate-400 font-mono flex items-center">
              <span>View</span>
              <ArrowUpRight className="w-3 h-3 ml-0.5" />
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-bold text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Control</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Top Floating Glass Navigation Header */}
        <header className="h-20 bg-[#0C111D]/80 backdrop-blur-2xl border-b border-white/10 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10 hover:text-white transition-colors"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-base sm:text-lg font-black tracking-tight text-white">
                  VEXIVO Management Suite
                </h1>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-black uppercase bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 font-mono">
                  v2.6 Enterprise
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                All changes sync live with storefront instantly
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3 sm:space-x-4">
            {/* Quick Visit Storefront Button */}
            <Link
              to="/"
              target="_blank"
              className="hidden sm:inline-flex items-center space-x-2 px-3.5 py-2 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-bold transition-all shadow-sm group"
            >
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>Live Store</span>
              <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>

            {/* Admin User Profile */}
            <div className="flex items-center space-x-3 pl-2 sm:pl-3 border-l border-white/10">
              <div className="text-right">
                <p className="text-xs font-black text-white">{user?.name || 'Administrator'}</p>
                <p className="text-[10px] text-emerald-400 font-extrabold uppercase tracking-wider flex items-center justify-end space-x-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>{user?.role || 'admin'} Access</span>
                </p>
              </div>

              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20">
                  <div className="w-full h-full bg-[#0C111D] rounded-[14px] flex items-center justify-center font-black text-sm text-cyan-300">
                    {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 custom-scrollbar">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          />
          <div className="relative w-72 max-w-xs bg-[#0C111D] text-white h-full flex flex-col justify-between p-5 shadow-2xl z-10 border-r border-white/10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center space-x-2.5">
                  <span className="text-lg font-black tracking-wider text-white">VEXIVO</span>
                  <span className="text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-cyan-500 text-slate-950 font-black">
                    ADMIN
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-xl bg-white/5"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Mobile Drawer Admin Info */}
              <div className="p-3 my-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-xs shadow-md">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black text-white truncate">{user?.name || 'Administrator'}</p>
                  <p className="text-[10px] text-emerald-400 font-bold uppercase">{user?.role} Session</p>
                  <p className="text-[9px] text-slate-400 font-mono truncate">{user?.email}</p>
                </div>
              </div>

              <nav className="space-y-1.5 pt-4 overflow-y-auto max-h-[calc(100vh-170px)] custom-scrollbar">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold ${
                        active
                          ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20'
                          : 'text-slate-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-2 px-3.5 py-2.5 text-xs font-bold text-slate-300 bg-white/5 rounded-xl"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>Open Storefront</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 bg-rose-500/10 hover:bg-rose-500/20"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
