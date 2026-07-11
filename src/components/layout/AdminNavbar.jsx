import React, { useState } from 'react';
import { useAdminAuth } from '../../context/AdminAuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUserCircle, FaBell, FaCaretDown } from 'react-icons/fa';

const AdminNavbar = () => {
  const { user } = useAdminAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 shadow-sm px-6 md:px-8 py-4 sticky top-0 z-40">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Dashboard
        </h2>
        
        <div className="flex items-center space-x-6">
          <button className="relative text-gray-500 hover:text-indigo-600 transition-colors duration-300 p-2 hover:bg-indigo-50 rounded-full">
            <FaBell className="text-xl" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
              3
            </span>
          </button>
          
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center space-x-3 group focus:outline-none"
            >
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white shadow-lg">
                <FaUserCircle className="text-xl" />
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors duration-300">
                  {user?.full_name || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 group-hover:text-indigo-500 transition-colors duration-300">
                  {user?.email || 'admin@example.com'}
                </p>
              </div>
              <FaCaretDown className="text-gray-400 group-hover:text-indigo-600 transition-colors duration-300" />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-3 w-48 bg-white/90 backdrop-blur-md border border-gray-200/50 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <div className="py-2">
                    <button className="block w-full text-left px-4 py-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 text-sm transition-all duration-300">
                      ប្រវត្តិរូប
                    </button>
                    <button className="block w-full text-left px-4 py-2.5 text-gray-700 hover:text-indigo-600 hover:bg-indigo-50/50 text-sm transition-all duration-300">
                      ការកំណត់
                    </button>
                    <div className="border-t border-gray-200/50 my-1"></div>
                    <button className="block w-full text-left px-4 py-2.5 text-red-600 hover:text-red-700 hover:bg-red-50/50 text-sm transition-all duration-300">
                      ចាកចេញ
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminNavbar;