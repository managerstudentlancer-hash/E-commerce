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

  // Firebase Phone Auth: confirmationResult is stored between sendOtp and verifyOtp
  const [firebaseConfirmation, setFirebaseConfirmation] = useState(null);

  const sendOtp = async (phone) => {
    // Dynamically import Firebase to keep initial bundle small
    const { sendFirebaseOtp, setupRecaptcha } = await import('../services/firebase');
    
    // Setup reCAPTCHA if not already done
    setupRecaptcha('recaptcha-container');
    
    // Firebase sends the OTP SMS automatically (FREE via Google's servers)
    const confirmationResult = await sendFirebaseOtp(phone);
    setFirebaseConfirmation(confirmationResult);
    
    return {
      success: true,
      provider: 'Google Firebase (Free)',
      realSmsSent: true,
      phone,
    };
  };

  const verifyOtp = async (phone, otp, name) => {
    if (!firebaseConfirmation) {
      throw new Error('No active OTP session. Please request a new code.');
    }

    // Verify OTP via Firebase SDK (client-side)
    const { verifyFirebaseOtp } = await import('../services/firebase');
    const firebaseResult = await verifyFirebaseOtp(firebaseConfirmation, otp);
    
    // Send Firebase ID token to our backend to create/login user
    const response = await api.auth.verifyOtp({
      firebaseIdToken: firebaseResult.idToken,
      name,
    });
    
    if (response.success && response.token) {
      localStorage.setItem('vexivo_token', response.token);
      setToken(response.token);
      setUser(response.user);
      setFirebaseConfirmation(null); // Clear the confirmation
      return response.user;
    }
    throw new Error(response.message || 'Verification failed');
  };

  const isAdmin = user && user.role === 'admin';

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        sendOtp,
        verifyOtp,
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
