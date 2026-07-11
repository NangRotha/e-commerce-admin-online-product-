import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaTachometerAlt, FaBox, FaShoppingBag, FaCog, 
  FaImage, FaSignOutAlt, FaStore, FaFileAlt
} from 'react-icons/fa';
import { useAdminAuth } from '../../context/AdminAuthContext';

const AdminSidebar = () => {
  const location = useLocation();
  const { logout } = useAdminAuth();

  const menuItems = [
    { name: 'ផ្ទាំងគ្រប់គ្រង', path: '/admin', icon: FaTachometerAlt },
    { name: 'ផលិតផល', path: '/admin/products', icon: FaBox },
    { name: 'ការបញ្ជាទិញ', path: '/admin/orders', icon: FaShoppingBag },
    { name: 'ទំព័រ', path: '/admin/pages', icon: FaFileAlt },
    { name: 'ការកំណត់', path: '/admin/settings', icon: FaCog },
    { name: 'ផ្ទុកឡើង', path: '/admin/upload', icon: FaImage },
  ];

  return (
    <aside className="w-64 min-h-screen bg-white/80 backdrop-blur-xl border-r border-gray-200/50 shadow-2xl flex flex-col">
      <div className="p-6 border-b border-gray-200/50">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <FaStore className="text-xl" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Admin Panel
          </span>
        </div>
        
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 ${
                  isActive 
                    ? 'bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-700 shadow-md' 
                    : 'text-gray-600 hover:bg-gray-100/50 hover:text-indigo-600'
                }`}
              >
                <item.icon className={`text-xl ${isActive ? 'text-indigo-600' : 'text-gray-500 group-hover:text-indigo-600'}`} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="ml-auto w-1.5 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="mt-auto p-6 border-t border-gray-200/50">
        <button
          onClick={logout}
          className="w-full flex items-center justify-center space-x-3 px-4 py-3 bg-red-500/10 backdrop-blur-sm border border-red-200/50 text-red-500 rounded-xl font-medium hover:bg-red-500 hover:text-white transition-all duration-300"
        >
          <FaSignOutAlt className="text-xl" />
          <span>ចាកចេញ</span>
        </button>
      </div>
    </aside>
  );
};

export default AdminSidebar;