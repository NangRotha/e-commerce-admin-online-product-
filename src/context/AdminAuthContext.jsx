import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ពិនិត្យមើលថាតើអ្នកប្រើបាន Login រួចហើយឬនៅពេល Refresh ទំព័រ
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
      // ផ្ញើ Request ទៅ Backend
      const response = await api.post('/admin/auth/login', { username, password });
      
      // ពិនិត្យមើល Data ដែល Backend បញ្ជូនមក
      // ខាងក្រោមនេះសន្មតថា Backend បញ្ជូនមកដូចជា: { token: "xxxx", user: { ... } }
      if (response && response.token) {
        // 🔥 ចំណុចសំខាន់: Save ត្រូវដាក់ឈ្មោះឱ្យត្រូវគ្នានឹង api.js
        localStorage.setItem('admin_token', response.token); 
        localStorage.setItem('admin_user', JSON.stringify(response.user || { role: 'admin' }));
        
        setUser(response.user || { role: 'admin' });
        return { success: true };
      } else {
        // ករណី Backend មិនបញ្ជូន Token មក (ឧ. ឈ្មោះឬលេខសម្ងាត់ខុស)
        return { success: false, message: 'ព័ត៌មានមិនត្រឹមត្រូវ' };
      }
    } catch (error) {
      console.error('Login error:', error);
      // ចាប់កំហុសពី Backend មកបង្ហាញ
      return { 
        success: false, 
        message: error.response?.data?.message || 'ការចូលប្រើបរាជ័យ' 
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