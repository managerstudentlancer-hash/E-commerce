import React, { createContext, useContext, useState, useEffect } from 'react';
import api, { getAuthToken, setAuthToken } from '../services/api';
import { registerWithEmail } from '../services/firebase';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => getAuthToken() || null);
  const [user, setUser] = useState(() => {
    try {
      const activeToken = getAuthToken();
      if (!activeToken) return null;
      const cached =
        localStorage.getItem('vexivo_user') ||
        sessionStorage.getItem('vexivo_user');
      return cached ? JSON.parse(cached) : null;
    } catch {
      return null;
    }
  });

  // Always wait for authentication to be verified if a token exists in storage
  const [loading, setLoading] = useState(Boolean(getAuthToken()));

  // Validate user profile on server if token exists
  useEffect(() => {
    let isMounted = true;

    const fetchUser = async () => {
      const activeToken = getAuthToken();
      if (!activeToken) {
        if (isMounted) {
          setUser(null);
          setToken(null);
          setLoading(false);
        }
        return;
      }

      try {
        const response = await api.auth.getMe();
        if (isMounted && response.success && response.user) {
          setUser(response.user);
          localStorage.setItem('vexivo_user', JSON.stringify(response.user));
          sessionStorage.setItem('vexivo_user', JSON.stringify(response.user));
        } else if (isMounted) {
          logout();
        }
      } catch (err) {
        console.warn('[AuthContext] Session verification note:', err.message);
        // CRITICAL FIX: Only wipe the token if the server explicitly rejected the token with 401 Unauthorized!
        // If it was a network timeout, 500, or ECONNREFUSED during development restart, PRESERVE the token and cached user!
        if (err.status === 401) {
          if (isMounted) logout();
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUser();

    // Listen for unauthorized 401 events dispatched by api client
    const handleUnauthorized = (e) => {
      const msg = e.detail?.message || '';
      const endpoint = e.detail?.endpoint || '';
      console.warn('[AuthContext] Unauthorized event on:', endpoint, msg);

      // Only invalidate session if server explicitly validated that the token itself is invalid/expired or user deleted
      const isTokenInvalid =
        msg.toLowerCase().includes('expired') ||
        msg.toLowerCase().includes('invalid') ||
        msg.toLowerCase().includes('associated with token not found') ||
        endpoint === '/auth/me';

      if (isMounted && isTokenInvalid) {
        logout();
      }
    };
    window.addEventListener('vexivo_auth_unauthorized', handleUnauthorized);

    return () => {
      isMounted = false;
      window.removeEventListener('vexivo_auth_unauthorized', handleUnauthorized);
    };
  }, [token]);

  const login = async (email, password) => {
    const response = await api.auth.login({ email, password });
    if (response.success && response.token) {
      setAuthToken(response.token);
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
      sessionStorage.setItem('vexivo_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Login failed');
  };

  const adminLogin = async (email, password) => {
    const response = await api.auth.adminLogin({ email, password });
    if (response.success && response.token) {
      setAuthToken(response.token);
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
      sessionStorage.setItem('vexivo_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Admin authentication failed');
  };

  const register = async (nameOrData, email, password, phone) => {
    const payload =
      typeof nameOrData === 'object' && nameOrData !== null
        ? nameOrData
        : {
          name: nameOrData,
          email,
          password,
          phone,
        };

    // Firebase: create account + send verification email
    await registerWithEmail(
      payload.email,
      payload.password
    );

    // VEXIVO backend: save user in PostgreSQL
    const response = await api.auth.register(payload);

    if (response.success && response.token) {
      setAuthToken(response.token);
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
      sessionStorage.setItem('vexivo_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);

      return response.user;
    }

    throw new Error(
      response.message || 'Registration failed'
    );
  };
  const sendOtp = async (phone) => {
    const response = await api.auth.sendOtp({ phone });
    return response;
  };

  const verifyOtp = async (phone, otp, name) => {
    const response = await api.auth.verifyOtp({ phone, otp, name });
    if (response.success && response.token) {
      setAuthToken(response.token);
      localStorage.setItem('vexivo_user', JSON.stringify(response.user));
      sessionStorage.setItem('vexivo_user', JSON.stringify(response.user));
      setToken(response.token);
      setUser(response.user);
      return response.user;
    }
    throw new Error(response.message || 'Verification failed');
  };

  const loginWithOtp = verifyOtp;

  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem('vexivo_user');
    sessionStorage.removeItem('vexivo_user');
    setToken(null);
    setUser(null);
    api.auth.logout().catch(() => { });
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
  const isDeliveryPartner = user && (user.role === 'delivery_partner' || user.role === 'admin');

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
        isDeliveryPartner,
        isAuthenticated: Boolean(user && token),
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
