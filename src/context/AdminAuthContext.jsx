import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is already logged in when the page refreshes
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
      
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      // If successful, save token and user data
      const { access_token } = response;
      if (access_token) {
        localStorage.setItem('admin_token', access_token); 
        
        const userData = await api.get('/auth/me');
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
        
        console.log('✅ Login successful!');
        return { success: true };
      } else {
        return { success: false, message: 'Backend did not send a token.' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);
      
      // --- CRITICAL FIX: Handle FastAPI 422 Error Details ---
      let errorMessage = 'ការចូលប្រើបរាជ័យ (សូមពិនិត្យឡើងវិញ)';
      
      // 1. Check for FastAPI 422 validation errors (the {detail: Array(2)} you saw)
      if (error.response?.status === 422 && error.response?.data?.detail) {
        const detail = error.response.data.detail;
        
        // If it's an array of errors (FastAPI format)
        if (Array.isArray(detail) && detail.length > 0) {
          const firstError = detail[0];
          
          // Convert FastAPI English error to Khmer message
          if (firstError.loc && firstError.loc.includes('username')) {
            errorMessage = 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ដែលត្រឹមត្រូវ';
          } else if (firstError.loc && firstError.loc.includes('password')) {
            errorMessage = 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 8 តួអក្សរ';
          } else if (firstError.msg) {
            // If backend sends a specific custom message
            errorMessage = firstError.msg;
          }
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }
      // 2. Check for 401 Unauthorized (Wrong Email or Password)
      else if (error.response?.status === 401) {
        errorMessage = 'ឈ្មោះអ្នកប្រើប្រាស់ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ';
      }
      // 3. Check for other backend custom messages
      else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }

      // Return the error to the frontend
      return { 
        success: false, 
        message: errorMessage 
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