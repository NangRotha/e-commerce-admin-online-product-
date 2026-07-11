import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AdminAuthProvider, useAdminAuth } from './context/AdminAuthContext';

// Pages
import AdminLogin from './pages/AdminLogin';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Settings from './pages/Settings';
import Upload from './pages/Upload';
import Pages from './pages/Pages'; // <--- បន្ថែមនេះ

// Layout
import AdminLayout from './components/layout/AdminLayout';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAdminAuth();
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div></div>;
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

function App() {
  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <AdminAuthProvider>
        <Routes>
          <Route path="/admin/login" element={<AdminLogin />} />
          
          <Route path="/admin" element={
            <ProtectedRoute><AdminLayout><Dashboard /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/products" element={
            <ProtectedRoute><AdminLayout><Products /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/orders" element={
            <ProtectedRoute><AdminLayout><Orders /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute><AdminLayout><Settings /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/upload" element={
            <ProtectedRoute><AdminLayout><Upload /></AdminLayout></ProtectedRoute>
          } />
          <Route path="/admin/pages" element={   // <--- បន្ថែមនេះ
            <ProtectedRoute><AdminLayout><Pages /></AdminLayout></ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
        <Toaster position="top-right" toastOptions={{ duration: 3000, style: { background: '#363636', color: '#fff' } }} />
      </AdminAuthProvider>
    </Router>
  );
}

export default App;