import React, { useState, useEffect } from 'react';
import {
  Users,
  Search,
  Shield,
  User,
  Trash2,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import api from '../../services/api';
import { useAuth } from '../../context/AuthContext';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.admin.getUsers();
      if (res.success) {
        setUsers(res.users || []);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleRole = async (targetUser) => {
    const newRole = targetUser.role === 'admin' ? 'customer' : 'admin';
    if (targetUser._id === currentUser?._id && newRole !== 'admin') {
      alert('You cannot revoke your own administrator role.');
      return;
    }

    if (!window.confirm(`Change ${targetUser.name}'s role to ${newRole.toUpperCase()}?`)) return;

    try {
      const res = await api.admin.updateUserRole(targetUser._id, newRole);
      if (res.success) {
        setActionMessage(`Role for ${targetUser.name} updated to ${newRole}`);
        setUsers((prev) =>
          prev.map((u) => (u._id === targetUser._id ? { ...u, role: newRole } : u))
        );
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to update role');
    }
  };

  const handleDeleteUser = async (targetUser) => {
    if (targetUser._id === currentUser?._id) {
      alert('You cannot delete your own account.');
      return;
    }

    if (!window.confirm(`Permanently remove ${targetUser.name} (${targetUser.email}) from marketplace?`)) return;

    try {
      const res = await api.admin.deleteUser(targetUser._id);
      if (res.success) {
        setActionMessage(`Account for ${targetUser.name} removed`);
        setUsers((prev) => prev.filter((u) => u._id !== targetUser._id));
        setTimeout(() => setActionMessage(''), 4000);
      }
    } catch (err) {
      alert(err.message || 'Failed to delete user');
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const customerCount = users.filter((u) => u.role === 'customer').length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900">
            User & Seller Management ({users.length})
          </h2>
          <p className="text-xs text-neutral-500 mt-0.5">
            Overview of all marketplace accounts, customers, sellers, and administrator roles.
          </p>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold">
          <span className="px-3 py-1.5 rounded-full bg-red-50 text-[#C4301C]">
            {adminCount} Admins
          </span>
          <span className="px-3 py-1.5 rounded-full bg-neutral-100 text-neutral-700">
            {customerCount} Customers / Sellers
          </span>
        </div>
      </div>

      {actionMessage && (
        <div className="p-3 bg-emerald-50 text-[#0D8756] rounded-xl text-xs flex items-center space-x-2 animate-fade-in font-semibold">
          <CheckCircle2 className="w-4 h-4" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Search Input */}
      <div className="bg-white p-4 rounded-2xl border border-neutral-200 flex items-center space-x-3 shadow-subtle">
        <Search className="w-4 h-4 text-neutral-400" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search accounts by name, email, or role..."
          className="flex-1 text-xs outline-none text-neutral-900 placeholder-neutral-400 font-medium"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm('')} className="text-xs text-neutral-400 hover:text-black font-semibold">
            Clear
          </button>
        )}
      </div>

      {/* Users Table */}
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
                  <th className="py-4 px-6">User Account</th>
                  <th className="py-4 px-4">Contact Phone</th>
                  <th className="py-4 px-4">Role</th>
                  <th className="py-4 px-4">Joined Date</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100 font-medium text-neutral-800">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-12 text-center text-neutral-500">
                      No user accounts match your search.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((u) => (
                    <tr key={u._id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3.5 px-6 flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 text-neutral-700 font-bold flex items-center justify-center flex-shrink-0">
                          {u.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{u.name}</p>
                          <p className="text-[11px] text-neutral-500 font-mono">{u.email}</p>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-600 font-mono text-[11px]">
                        {u.phone || '—'}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-red-50 text-[#C4301C] border border-red-200'
                              : 'bg-neutral-100 text-neutral-800'
                          }`}
                        >
                          {u.role === 'admin' ? (
                            <>
                              <Shield className="w-3 h-3" />
                              <span>Admin</span>
                            </>
                          ) : (
                            <>
                              <User className="w-3 h-3" />
                              <span>Customer / Seller</span>
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-neutral-500 text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString('en-GB') : '—'}
                      </td>
                      <td className="py-3.5 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleToggleRole(u)}
                          className="px-2.5 py-1 rounded-lg border border-neutral-200 text-neutral-700 hover:border-black hover:text-black transition-colors text-[11px] font-bold"
                          title="Change user role"
                        >
                          Make {u.role === 'admin' ? 'Customer' : 'Admin'}
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u)}
                          disabled={u._id === currentUser?._id}
                          className="p-1.5 rounded-lg border border-neutral-200 text-neutral-600 hover:border-red-600 hover:text-red-600 transition-colors disabled:opacity-30"
                          title="Delete user account"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
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
    </div>
  );
};

export default AdminUsers;
