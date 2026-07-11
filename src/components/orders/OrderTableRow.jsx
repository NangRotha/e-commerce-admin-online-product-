import React from 'react';
import { motion } from 'framer-motion';

const OrderTableRow = ({ order, onStatusUpdate }) => {
  const statusColors = {
    pending: 'bg-yellow-100/80 backdrop-blur-sm text-yellow-700',
    processing: 'bg-blue-100/80 backdrop-blur-sm text-blue-700',
    shipped: 'bg-purple-100/80 backdrop-blur-sm text-purple-700',
    delivered: 'bg-green-100/80 backdrop-blur-sm text-green-700',
    cancelled: 'bg-red-100/80 backdrop-blur-sm text-red-700',
  };

  const statusLabels = {
    pending: 'រង់ចាំ',
    processing: 'កំពុងដំណើរការ',
    shipped: 'បានដឹកជញ្ជូន',
    delivered: 'បានប្រគល់',
    cancelled: 'បានលុប',
  };

  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="bg-white/30 backdrop-blur-sm border border-gray-200/50 rounded-xl px-3 py-1.5 inline-block">
          <p className="text-sm font-mono font-medium text-gray-800">
            {order.order_number}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-gray-600 text-xs">
            {order.user?.full_name?.charAt(0) || 'ភ'}
          </div>
          <span className="text-sm font-medium text-gray-700">
            {order.user?.full_name || 'ភ្ញៀវ'}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="bg-indigo-500/10 backdrop-blur-sm border border-indigo-200/50 rounded-xl px-3 py-1.5 inline-block">
          <p className="text-sm font-bold text-indigo-600">
            ${order.total_amount.toFixed(2)}
          </p>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={order.status}
          onChange={(e) => onStatusUpdate(order.id, e.target.value)}
          className={`px-3 py-1.5 text-xs rounded-full font-medium outline-none cursor-pointer transition-all duration-300 border border-transparent hover:border-gray-300/50 ${
            statusColors[order.status] || 'bg-gray-100/80 backdrop-blur-sm text-gray-600'
          }`}
          style={{
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <option value="pending">រង់ចាំ</option>
          <option value="processing">កំពុងដំណើរការ</option>
          <option value="shipped">បានដឹកជញ្ជូន</option>
          <option value="delivered">បានប្រគល់</option>
          <option value="cancelled">បានលុប</option>
        </select>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="bg-white/30 backdrop-blur-sm border border-gray-200/50 rounded-xl px-3 py-1.5 inline-block">
          <span className="text-sm text-gray-500">
            {new Date(order.created_at).toLocaleDateString()}
          </span>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-4 py-2 bg-indigo-500/10 backdrop-blur-sm border border-indigo-200/50 text-indigo-600 rounded-full text-xs font-medium hover:bg-indigo-500 hover:text-white transition-all duration-300 shadow-sm"
        >
          មើលលម្អិត
        </motion.button>
      </td>
    </>
  );
};

export default OrderTableRow;