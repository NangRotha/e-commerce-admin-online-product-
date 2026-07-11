import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import OrderTableRow from '../components/orders/OrderTableRow';
import { motion } from 'framer-motion';
import { FaSpinner, FaShoppingBag } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const data = await api.get('/admin/orders');
      setOrders(data);
    } catch (error) {
      toast.error('បរាជ័យក្នុងការទាញយកការបញ្ជាទិញ');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, status) => {
    try {
      await api.put(`/admin/orders/${orderId}/status`, { status });
      toast.success('បានធ្វើបច្ចុប្បន្នភាពស្ថានភាពការបញ្ជាទិញ!');
      fetchOrders();
    } catch (error) {
      toast.error('បរាជ័យក្នុងការធ្វើបច្ចុប្បន្នភាពស្ថានភាព');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/40 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <FaSpinner className="text-4xl text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent mb-8">
        គ្រប់គ្រងការបញ្ជាទិញ
      </h1>

      <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100/50 backdrop-blur-sm border-b border-gray-200/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">លេខបញ្ជាទិញ</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">អតិថិជន</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ចំនួន</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ស្ថានភាព</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">កាលបរិច្ឆេទ</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200/50">
              {orders.map((order, index) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-gray-50/50 transition-colors duration-300"
                >
                  <OrderTableRow
                    order={order}
                    onStatusUpdate={handleStatusUpdate}
                  />
                </motion.tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-12">
                    <div className="flex flex-col items-center justify-center text-gray-500">
                      <FaShoppingBag className="text-4xl mb-2 opacity-50" />
                      <p>មិនទាន់មានការបញ្ជាទិញនៅឡើយទេ</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Orders;