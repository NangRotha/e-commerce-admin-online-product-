import axios from 'axios';

/**
 * 1. DEFINE API BASE URL
 * - Production (Render): Directly uses your live backend URL
 * - DO NOT change this unless your backend URL changes
 */
const API_URL = 'https://e-commerce-backend-online-product.onrender.com/api';

// Small check to verify the URL is loading (visible only in local dev console)
if (import.meta.env.DEV) {
  console.log('✅ Admin Panel connected to:', API_URL);
}

/**
 * 2. CREATE AXIOS INSTANCE
 */
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Prevent long hanging requests
  timeout: 15000, 
});

/**
 * 3. REQUEST INTERCEPTOR
 * - Adds the Admin Token automatically
 * - Fixes FormData headers for image uploads
 */
api.interceptors.request.use(
  (config) => {
    // Get token from local storage
    const token = localStorage.getItem('admin_token');
    
    // If token exists, attach it to headers
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // CRITICAL: If sending FormData (like product images), 
    // delete 'Content-Type' so the browser sets it correctly with boundaries.
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * 4. RESPONSE INTERCEPTOR
 * - Extracts data automatically
 * - Handles 401 Unauthorized (logs admin out)
 */
api.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    // Check for server response status
    const status = error.response?.status;

    // If Unauthorized (Token expired or invalid)
    if (status === 401) {
      // Clear admin session
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');

      // Prevent redirect loop if already on login page
      const currentPath = window.location.pathname;
      if (!currentPath.includes('/admin/login')) {
        // Redirect to login page dynamically
        window.location.href = `${window.location.origin}/admin/login`;
      }
    }

    // Forward the error to your components (e.g., show Toast notification)
    return Promise.reject(error); 
  }
);

export default api;