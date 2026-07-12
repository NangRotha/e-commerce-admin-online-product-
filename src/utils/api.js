import axios from 'axios';

const API_URL = 'https://e-commerce-backend-online-product.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - admin_token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // ប្រសិនបើ config.data គឺជា FormData, កុំបន្ថែម Content-Type
    // ព្រោះ Axios នឹងបន្ថែមវាដោយស្វ័យប្រវត្តិជាមួយ boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = 'https://e-commerce-admin-online-product.vercel.app/admin/login';
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;