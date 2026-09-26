import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('vexivo_token') || null);
  const [user, setUser] = useState(() => {
    try {
      const cached = localStorage.getItem('vexivo_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(!user);

  // Validate user profile on server if token exists
  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        localStorage.removeItem('vexivo_user');
        setLoading(false);
        return;
      }
      try {
        const response = await api.auth.getMe();
        if (response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('vexivo_user', JSON.stringify(response.user));
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
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
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
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Admin authentication failed');
  };

  const register = async (nameOrData, email, password, phone) => {
    const payload = typeof nameOrData === 'object' && nameOrData !== null
      ? nameOrData
      : { name: nameOrData, email, password, phone };
    const response = await api.auth.register(payload);
    if (response.success && response.token) {
      localStorage.setItem('vexivo_token', response.token);
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Registration failed');
  };

  const sendOtp = async (phone) => {
    const response = await api.auth.sendOtp({ phone });
    return response;
  };

  const verifyOtp = async (phone, otp, name) => {
    const response = await api.auth.verifyOtp({ phone, otp, name });
    if (response.success && response.token) {
      localStorage.setItem('vexivo_token', response.token);
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Verification failed');
  };

  const loginWithOtp = verifyOtp;

  const logout = () => {
    localStorage.removeItem('vexivo_token');
    localStorage.removeItem('vexivo_user');
    setToken(null);
    setUser(null);
    api.auth.logout().catch(() => {});
  };

  const updateProfile = async (profileData) => {
    const response = await api.auth.updateProfile(profileData);
    if (response.success && response.user) {
      setUser(response.user);
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
      return response.user;
    }
    throw new Error(response.message || 'Profile update failed');
  };

  const isAdmin = user && user.role === 'admin';
  const isSeller = user && (user.role === 'seller' || user.role === 'admin');

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        adminLogin,
        register,
        sendOtp,
        verifyOtp,
        loginWithOtp,
        logout,
        updateProfile,
        isAdmin,
        isSeller,
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
