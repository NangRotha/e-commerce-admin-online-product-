import React from 'react';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';
import { motion } from 'framer-motion';

const AdminLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 via-white to-indigo-50/30">
      <AdminSidebar />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminNavbar />
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex-1 p-6 md:p-8 overflow-y-auto"
        >
          <div className="max-w-7xl mx-auto bg-white/40 backdrop-blur-lg border border-gray-200/50 rounded-3xl shadow-2xl p-6 md:p-8 min-h-[500px]">
            {children}
          </div>
        </motion.main>
      </div>
    </div>
  );
};

export default AdminLayout;