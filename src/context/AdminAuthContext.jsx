import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when page refreshes
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData));
      } catch (e) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('🟡 Attempting login at path: /auth/login');

      // ✅ FIXED: Removed "/admin" because your Backend expects /auth/login
      // (api.js automatically adds the /api prefix for us)
      const response = await api.post('/auth/login', { username, password });
      
      // Check if Backend sent a token
      if (response && response.token) {
        localStorage.setItem('admin_token', response.token); 
        localStorage.setItem('admin_user', JSON.stringify(response.user || { role: 'admin' }));
        setUser(response.user || { role: 'admin' });
        console.log('✅ Login successful!');
        return { success: true };
      } else {
        return { success: false, message: 'Backend did not send a token.' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // Handle 401 (Wrong Username/Password) specifically
      if (error.response?.status === 401) {
        return { 
          success: false, 
          message: 'ឈ្មោះអ្នកប្រើ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ' 
        };
      }

      // Handle other errors (Network issues, 500 Server error, etc.)
      return { 
        success: false, 
        message: error.response?.data?.message || 'ការចូលប្រើបរាជ័យ (សូមពិនិត្យបណ្តាញ)' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    window.location.href = '/admin/login';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading
  };

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};