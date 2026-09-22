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
  Image,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Bell,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

// Exactly 10 essential admin sections as specified
const adminNavItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Customers', path: '/admin/customers', icon: Users },
  { name: 'Inventory', path: '/admin/inventory', icon: Boxes },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Banners', path: '/admin/banners', icon: Image },
  { name: 'Settings', path: '/admin/settings', icon: Sliders },
];

const AdminLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Role verification guard
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-100 text-center font-sans">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl space-y-4 border border-neutral-200">
          <div className="w-14 h-14 rounded-2xl bg-red-50 text-[#C4301C] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-black text-neutral-900">Administrator Access Required</h2>
          <p className="text-xs text-neutral-500 leading-relaxed">
            You must be signed in with an administrator account to access the VEXIVO control panel.
          </p>
          <div className="pt-2 flex flex-col gap-2.5">
            <Link to="/admin/login" className="btn-pill-dark text-xs py-3 font-bold">
              Sign In to Admin Portal
            </Link>
            <Link to="/" className="btn-pill-light text-xs py-2.5 font-medium">
              Return to Storefront
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
    <div className="min-h-screen bg-[#F8F9FA] flex font-sans antialiased text-neutral-900">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-neutral-950 text-neutral-300 border-r border-neutral-900 flex-shrink-0 z-20">
        {/* Brand Header */}
        <div className="h-16 px-6 border-b border-neutral-900 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <span className="text-xl font-black tracking-tight text-white group-hover:text-neutral-300 transition-colors">
              VEXIVO
            </span>
            <span className="text-[9px] font-extrabold tracking-widest px-2 py-0.5 rounded-full bg-[#C4301C] text-white">
              ADMIN
            </span>
          </Link>
        </div>

        {/* Navigation List */}
        <nav className="flex-1 p-3.5 space-y-1 overflow-y-auto custom-scrollbar">
          <p className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 px-3 py-2">
            Main Management
          </p>
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const active = isNavActive(item.path);
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200 ${
                  active
                    ? 'bg-white text-neutral-950 shadow-md font-bold'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className={`w-4 h-4 flex-shrink-0 ${active ? 'text-neutral-950' : 'text-neutral-400'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-3.5 border-t border-neutral-900 space-y-1">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span className="flex items-center space-x-2.5">
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Live Storefront</span>
            </span>
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-2.5 px-3.5 py-2.5 rounded-xl text-xs text-neutral-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200/80 px-4 sm:px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50"
              aria-label="Open navigation menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-sm sm:text-base font-extrabold text-neutral-900 tracking-tight">
                VEXIVO Management Suite
              </h1>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex items-center space-x-2 px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-600 text-[11px] font-medium border border-neutral-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>System Operational</span>
            </div>

            {/* Admin User Chip */}
            <div className="flex items-center space-x-3 pl-2 border-l border-neutral-200">
              <div className="text-right hidden md:block">
                <p className="text-xs font-bold text-neutral-900">{user.name}</p>
                <p className="text-[10px] text-neutral-500 capitalize">{user.role}</p>
              </div>
              <div className="w-9 h-9 rounded-full bg-neutral-950 text-white text-xs font-extrabold flex items-center justify-center ring-2 ring-neutral-200">
                {user.name ? user.name.charAt(0).toUpperCase() : 'A'}
              </div>
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-fade-in">
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          />
          <div className="relative w-72 max-w-xs bg-neutral-950 text-white h-full flex flex-col justify-between p-4 shadow-2xl z-10">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900 px-2">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-black tracking-tight text-white">VEXIVO</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#C4301C] text-white">
                    ADMIN
                  </span>
                </div>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1 pt-4 overflow-y-auto max-h-[calc(100vh-160px)]">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const active = isNavActive(item.path);
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        active
                          ? 'bg-white text-neutral-950 font-bold shadow'
                          : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="pt-4 border-t border-neutral-900 space-y-2">
              <Link
                to="/"
                onClick={() => setSidebarOpen(false)}
                className="flex items-center space-x-2 px-3 py-2 text-xs text-neutral-400 hover:text-white"
              >
                <ExternalLink className="w-4 h-4" />
                <span>Storefront</span>
              </Link>
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-900"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
