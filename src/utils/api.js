import axios from 'axios';

// 1. Define API URL directly to your Render Backend
const API_URL = 'https://e-commerce-backend-online-product.onrender.com/api';

// 2. Create Axios Instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// 3. Request Interceptor (ដាក់ Token និងគ្រប់គ្រង FormData)
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // ប្រសិនបើកំពុងផ្ញើ Form Data (Upload រូបភាព) កុំឲ្យ Axios កំណត់ Content-Type
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Response Interceptor (ចាប់ 401)
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin/login')) {
        window.location.href = `${window.location.origin}/admin/login`;
      }
    }
    return Promise.reject(error);
  }
);

export default api;