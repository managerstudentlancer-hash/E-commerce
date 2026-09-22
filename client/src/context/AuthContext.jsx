import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('vexivo_token') || null);
  const [loading, setLoading] = useState(true);

  // Load user profile if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }
      try {
        const response = await api.auth.getMe();
        if (response.success && response.user) {
          setUser(response.user);
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to load user session:', err.message);
        logout();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email, password) => {
    const response = await api.auth.login({ email, password });
    if (response.success && response.token) {
      localStorage.setItem('vexivo_token', response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Login failed');
  };

  const adminLogin = async (email, password) => {
    const response = await api.auth.adminLogin({ email, password });
    if (response.success && response.token) {
      localStorage.setItem('vexivo_token', response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Admin authentication failed');
  };

  const register = async (name, email, password, phone) => {
    const response = await api.auth.register({ name, email, password, phone });
    if (response.success && response.token) {
      localStorage.setItem('vexivo_token', response.token);
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const logout = () => {
    localStorage.removeItem('vexivo_token');
    setToken(null);
    setUser(null);
    api.auth.logout().catch(() => {});
  };

  const updateProfile = async (profileData) => {
    const response = await api.auth.updateProfile(profileData);
    if (response.success && response.user) {
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Profile update failed');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        adminLogin,
        register,
        logout,
        updateProfile,
        isAdmin,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export default AuthContext;
