import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Package, Heart, MapPin, User, LogOut, ShieldCheck, ChevronRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useWishlist } from '../../context/WishlistContext';
import api from '../../services/api';

const AccountDashboard = () => {
  const { user, logout, isAdmin } = useAuth();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

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

  const handleSignOut = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-white min-h-screen py-10 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <div className="pb-8 border-b border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#C4301C]">
              Customer Account
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-neutral-900 tracking-tight mt-1">
              Welcome back, {user?.name}
            </h1>
            <p className="text-xs text-neutral-500 mt-1">{user?.email}</p>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Link
                to="/admin"
                className="btn-pill-dark text-xs py-2.5 px-5 flex items-center space-x-1.5 bg-[#C4301C] hover:bg-red-700"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Panel</span>
              </Link>
            )}
            <button
              onClick={handleSignOut}
              className="btn-pill-light text-xs py-2.5 px-5 flex items-center space-x-1.5"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Quick Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-8">
          <Link
            to="/account/orders"
            className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-black transition-colors group flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-neutral-900 shadow-sm">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Orders</p>
                <p className="text-xl font-extrabold text-neutral-900">{orders.length} Placed</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
          </Link>

          <Link
            to="/account/wishlist"
            className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-black transition-colors group flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-neutral-900 shadow-sm">
                <Heart className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Wishlist</p>
                <p className="text-xl font-extrabold text-neutral-900">{wishlistCount} Saved</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
          </Link>

          <Link
            to="/account/addresses"
            className="p-6 rounded-3xl bg-neutral-50 border border-neutral-200 hover:border-black transition-colors group flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-neutral-900 shadow-sm">
                <MapPin className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Addresses</p>
                <p className="text-xl font-extrabold text-neutral-900">
                  {user?.addresses?.length || 1} Saved
                </p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-neutral-400 group-hover:text-black transition-colors" />
          </Link>
        </div>

        {/* Recent Orders Section */}
        <div className="pt-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold tracking-tight text-neutral-900">Recent Orders</h2>
            <Link to="/account/orders" className="text-xs font-semibold text-neutral-600 hover:text-black underline">
              View All Orders
            </Link>
          </div>

          {orders.length === 0 ? (
            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 text-center space-y-3">
              <p className="text-sm font-semibold text-neutral-900">You haven't placed any orders yet.</p>
              <Link to="/shop" className="btn-pill-dark text-xs py-2 px-6 inline-block">
                Start Shopping
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 3).map((order) => (
                <div
                  key={order._id || order.id}
                  className="p-5 sm:p-6 rounded-2xl border border-neutral-200 bg-white flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-subtle"
                >
                  <div className="space-y-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono text-sm font-bold text-neutral-900">
                        {order.orderNumber}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-neutral-100 text-neutral-800">
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-xs text-neutral-500">
                      Placed on {new Date(order.createdAt).toLocaleDateString('en-GB')} • {order.items?.length || 1} items
                    </p>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="text-sm font-extrabold text-neutral-900">
                      £{order.total?.toFixed(2)}
                    </span>
                    <Link
                      to={`/account/orders`}
                      className="btn-pill-light text-xs py-2 px-4"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountDashboard;
