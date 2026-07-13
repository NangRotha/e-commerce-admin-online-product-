// src/context/AdminAuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api'; // នាំចូល api ត្រឹមត្រូវ

const AdminAuthContext = createContext();

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

  // ពិនិត្យ Token ពេលទំព័រផ្ទុកដំបូង
  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const storedUser = localStorage.getItem('admin_user');
    
    if (token && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
      }
    }
    setLoading(false);
  }, []);

  // =====================================================================
  // ✅ LOGIN FUNCTION (កែតម្រូវនៅទីនេះ!)
  // =====================================================================
  const login = async (username, password) => {
    try {
      // 1. បង្កើត Body ជា x-www-form-urlencoded
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      // 2. ផ្ញើ Request ទៅ Route /auth/login 
      // (ព្រោះ api.js មាន baseURL បញ្ចប់ដោយ /api រួចហើយ)
      const response = await api.post('/auth/login', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      // 3. ទាញ Token (FastAPI OAuth2 ច្រើនតែបញ្ជូនមកជា access_token)
      const token = response.access_token || response.token;
      
      if (!token) {
        throw new Error('មិនបានទទួល Token ពី Server');
      }

      // 4. រក្សាទុកក្នុង LocalStorage
      localStorage.setItem('admin_token', token);
      localStorage.setItem('admin_user', JSON.stringify(response.user || { username })); // រក្សាទុក User info បើមាន
      setUser(response.user || { username });

      return { success: true, user: response.user };

    } catch (error) {
      // 5. ចាប់ Error ហើយបោះចោលទៅ AdminLogin.jsx វិញ
      console.error('Login API Error:', error);
      
      let errorMsg = 'ការចូលប្រើបរាជ័យ';
      if (error.response) {
        // ប្រសិនបើមាន detail ពី FastAPI (ឧទាហរណ៍: Incorrect username or password)
        errorMsg = error.response.data?.detail || error.response.data?.message || errorMsg;
      }
      
      throw new Error(errorMsg);
    }
  };

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  const value = {
    user,
    loading,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  );
};