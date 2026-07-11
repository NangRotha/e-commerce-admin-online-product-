import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminAuth } from '../context/AdminAuthContext';
import { motion } from 'framer-motion';
import { FaLock, FaUser, FaEye, FaEyeSlash, FaShieldAlt } from 'react-icons/fa';

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAdminAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const result = await login(formData.username, formData.password);
    if (result.success) {
      navigate('/admin');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 via-white to-indigo-50/30 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      
      {/* Floating Blobs Decoration */}
      <div className="absolute -top-20 -right-20 w-96 h-96 bg-indigo-200/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-md w-full bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl p-8 md:p-10"
      >
        {/* Header Icon */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <FaShieldAlt className="text-3xl text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">
            Admin Login
          </h2>
          <p className="mt-2 text-gray-500">
            បញ្ចូលព័ត៌មានដើម្បីចូលទៅកាន់ Dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Username Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ឈ្មោះអ្នកប្រើប្រាស់
            </label>
            <div className="relative">
              <FaUser className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl pl-12 pr-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
                placeholder="បញ្ចូលឈ្មោះអ្នកប្រើប្រាស់"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ពាក្យសម្ងាត់
            </label>
            <div className="relative">
              <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl pl-12 pr-12 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
                placeholder="បញ្ចូលពាក្យសម្ងាត់"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-indigo-600 transition-colors duration-300"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
          >
            {loading ? 'កំពុងចូល...' : 'ចូលប្រើប្រាស់'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;