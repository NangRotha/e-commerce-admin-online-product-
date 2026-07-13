// src/utils/api.js
import axios from 'axios';

// ✅ កែតម្រូវ៖ ប្តូរទៅប្រើ Environment Variable ឬ Render URL
const API_URL = import.meta.env.VITE_API_URL || 'https://e-commerce-backend-online-product.onrender.com/api';

console.log('🔗 API URL:', API_URL);

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token'); 
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ✅ សំខាន់៖ លុប Content-Type នៅពេលផ្ញើ FormData
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      // ✅ កែតម្រូវ៖ ប្រើ window.location.origin ដើម្បីទាញ URL បច្ចុប្បន្នដោយស្វ័យប្រវត្តិ
      if (!window.location.pathname.includes('/admin/login')) {
        window.location.href = `${window.location.origin}/admin/login`;
      }
    }
    return Promise.reject(error); 
  }
);

export default api;