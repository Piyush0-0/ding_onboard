import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is authenticated via cookie
    authAPI.verifyToken()
      .then(response => {
        if (response.data.isValid) {
          // If token is valid, get user info from /me endpoint
          return authAPI.getMe();
        } else {
          setLoading(false);
        }
      })
      .then(userResponse => {
        if (userResponse?.data) {
          setUser(userResponse.data);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const login = async (phoneNumber, password) => {
    try {
      const response = await authAPI.login(phoneNumber, password);
      if (response.data.success) {
        setUser(response.data.user);
        toast.success('Login successful!');
        return { success: true };
      } else {
        toast.error(response.data.message || 'Login failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    try {
      console.log('[AuthContext] register called with userData:', userData);
      const response = await authAPI.register(userData);
      console.log('[AuthContext] register API response:', response.data);
      
      if (response.data.success) {
        console.log('[AuthContext] Registration successful, setting user:', response.data.user);
        setUser(response.data.user);
        toast.success('Registration successful!');
        return { success: true };
      } else {
        console.log('[AuthContext] Registration failed with message:', response.data.message);
        toast.error(response.data.message || 'Registration failed');
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('[AuthContext] Registration error:', error);
      const message = error.response?.data?.message || 'Registration failed';
      toast.error(message);
      return { success: false, message };
    }
  };

  const refreshUser = async () => {
    try {
      const response = await authAPI.getMe();
      if (response.data) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Failed to refresh user data:', error);
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      setUser(null);
      toast.success('Logged out successfully');
      // Redirect to home page
      window.location.href = '/';
    } catch (error) {
      // Even if logout fails, clear user state
      setUser(null);
      toast.success('Logged out successfully');
      // Redirect to home page
      window.location.href = '/';
    }
  };

  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    refreshUser,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 