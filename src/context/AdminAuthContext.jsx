import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

export const AdminAuthContext = createContext();

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};

export const AdminAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // ===== កែតម្រូវ Login Function ឱ្យប្រើ FormData + multipart/form-data =====
  const login = async (username, password) => {
    try {
      const formData = new FormData();
      formData.append('username', username);
      formData.append('password', password);
      
      const response = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'multipart/form-data' } // <--- សំខាន់ខ្លាំងណាស់!
      });
      
      const { access_token } = response;
      localStorage.setItem('admin_token', access_token);
      
      const userData = await api.get('/auth/me');
      
      if (!userData.is_admin) {
        localStorage.removeItem('admin_token');
        toast.error('អ្នកមិនមែនជា Admin ទេ');
        return { success: false, error: 'Not authorized' };
      }
      
      localStorage.setItem('admin_user', JSON.stringify(userData));
      setUser(userData);
      setIsAuthenticated(true);
      toast.success('សូមស្វាគមន៍ Admin!');
      return { success: true };
    } catch (error) {
      toast.error(error?.detail || 'ចូលប្រើប្រាស់មិនបានជោគជ័យ');
      return { success: false, error: error?.detail };
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
    setIsAuthenticated(false);
    toast.success('បានចាកចេញពីប្រព័ន្ធ');
  };

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export default AdminAuthProvider;