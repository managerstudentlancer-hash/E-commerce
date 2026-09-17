import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Layers,
  FolderTree,
  Tag,
  Star,
  Image,
  Sliders,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const adminNavItems = [
  { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { name: 'Products', path: '/admin/products', icon: Package },
  { name: 'Orders', path: '/admin/orders', icon: ShoppingCart },
  { name: 'Categories', path: '/admin/categories', icon: FolderTree },
  { name: 'Collections', path: '/admin/collections', icon: Layers },
  { name: 'Coupons', path: '/admin/coupons', icon: Tag },
  { name: 'Reviews', path: '/admin/reviews', icon: Star },
  { name: 'Banners', path: '/admin/banners', icon: Image },
  { name: 'Site Settings', path: '/admin/settings', icon: Sliders },
];

const AdminLayout = () => {
  const { user, isAdmin, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Guard: require admin role
  if (!user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-neutral-100 text-center">
        <div className="max-w-md w-full bg-white p-8 rounded-3xl shadow-xl space-y-4">
          <ShieldCheck className="w-12 h-12 text-[#C4301C] mx-auto" />
          <h2 className="text-xl font-bold text-neutral-900">Administrator Access Required</h2>
          <p className="text-xs text-neutral-500">
            You must be authenticated with an administrator account to access the VEXIVO control panel.
          </p>
          <div className="pt-2 flex flex-col gap-2">
            <Link to="/login" className="btn-pill-dark text-xs py-2.5">
              Sign In with Admin Account
            </Link>
            <Link to="/" className="btn-pill-light text-xs py-2.5">
              Return to Store
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-neutral-100 flex">
      {/* Sidebar for Desktop */}
      <aside className="hidden lg:flex lg:flex-col w-64 bg-neutral-950 text-neutral-300 border-r border-neutral-900 flex-shrink-0">
        <div className="p-6 border-b border-neutral-900 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-black tracking-tight text-white">VEXIVO</span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#C4301C] text-white">
              ADMIN
            </span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {adminNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-white text-black font-bold shadow-md'
                    : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-neutral-900 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-4 py-2.5 rounded-2xl text-xs text-neutral-400 hover:text-white hover:bg-neutral-900 transition-colors"
          >
            <span>Live Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-2.5 rounded-2xl text-xs text-neutral-400 hover:text-red-400 hover:bg-neutral-900 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content View */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <header className="h-16 bg-white border-b border-neutral-200 px-4 sm:px-8 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-100 text-neutral-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-sm sm:text-base font-bold text-neutral-900">
              VEXIVO Control Center
            </h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-bold text-neutral-900">{user.name}</p>
              <p className="text-[10px] text-neutral-500">{user.email}</p>
            </div>
            <div className="w-8 h-8 rounded-full bg-neutral-950 text-white text-xs font-bold flex items-center justify-center">
              {user.name[0]}
            </div>
          </div>
        </header>

        {/* Dynamic Nested Route View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8">
          <Outlet />
        </main>
      </div>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
          />
          <div className="relative w-64 max-w-xs bg-neutral-950 text-white h-full flex flex-col justify-between p-4 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-neutral-900">
                <span className="text-lg font-bold">VEXIVO ADMIN</span>
                <button
                  onClick={() => setSidebarOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1 pt-4">
                {adminNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-white text-black' : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 text-xs text-neutral-400 hover:text-red-400 p-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLayout;
