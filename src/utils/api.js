import axios from 'axios';

// ===== ប្តូរទៅប្រើ Render URL ថ្មី =====
const API_URL = 'https://e-commerce-backend-online-product.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - បន្ថែម admin_token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token'); // <--- កែត្រង់នេះ! (មិនមែន token)
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - គ្រប់គ្រងកំហុស
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token'); // <--- កែត្រង់នេះ!
      localStorage.removeItem('admin_user');
      // ប្តូរទៅប្រើ Absolute URL របស់ Vercel Admin
      window.location.href = 'https://e-commerce-admin-online-product.vercel.app/admin/login'; // <--- កែត្រង់នេះ!
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;