// src/context/AdminAuthContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import api from '../utils/api';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // ✅ បន្ថែម state សម្រាប់ isAuthenticated
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // ពិនិត្យ Token ពេលបើកទំព័រឡើងវិញ (Reload)
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const userData = localStorage.getItem('admin_user');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setIsAuthenticated(true);  // ✅ កំណត់ isAuthenticated = true
        console.log('✅ Admin authenticated!');
      } catch (e) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        setIsAuthenticated(false);
      }
    } else {
      setIsAuthenticated(false);
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      console.log('🟡 Attempting login to localhost...');
      
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      const { access_token } = response; 
      
      if (access_token) {
        localStorage.setItem('admin_token', access_token); 
        
        const userResponse = await api.get('/auth/me');
        const userData = userResponse; 
        
        localStorage.setItem('admin_user', JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);  // ✅ កំណត់ isAuthenticated = true
        
        console.log('✅ Login successful!');
        return { success: true };
      } else {
        return { success: false, message: 'Backend did not send a token.' };
      }
    } catch (error) {
      console.error('❌ Login error:', error);

      let errorMessage = 'ការចូលប្រើបរាជ័យ (សូមពិនិត្យឡើងវិញ)';
      
      if (error.response?.status === 422 && error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          const firstError = detail[0];
          if (firstError.loc && firstError.loc.includes('username')) {
            errorMessage = 'សូមបញ្ចូលឈ្មោះអ្នកប្រើប្រាស់ដែលត្រឹមត្រូវ';
          } else if (firstError.loc && firstError.loc.includes('password')) {
            errorMessage = 'ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ 8 តួអក្សរ';
          } else if (firstError.msg) {
            errorMessage = firstError.msg;
          }
        } else if (typeof detail === 'string') {
          errorMessage = detail;
        }
      }
      else if (error.response?.status === 401) {
        errorMessage = 'ឈ្មោះអ្នកប្រើប្រាស់ ឬ ពាក្យសម្ងាត់មិនត្រឹមត្រូវ';
      }
      else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      // ✅ សំខាន់៖ ធានាថា errorMessage គឺជា String ជានិច្ច
      else if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else {
        errorMessage = 'មានបញ្ហាមិនដឹងមូលហេតុ។';
      }

      throw new Error(errorMessage); // ត្រឡប់ Error Object ដែលមាន message ជា String
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    setIsAuthenticated(false);  // ✅ កំណត់ isAuthenticated = false
    window.location.href = '/admin/login';
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated,  // ✅ បន្ថែម isAuthenticated ទៅក្នុង value
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