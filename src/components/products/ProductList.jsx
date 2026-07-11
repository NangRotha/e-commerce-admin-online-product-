import React from 'react';
import ProductTableRow from './ProductTableRow';
import { motion } from 'framer-motion';
import { FaBox } from 'react-icons/fa';

const ProductList = ({ products, onEdit, onDelete, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64 bg-white/40 backdrop-blur-sm border border-gray-200/50 rounded-2xl shadow-lg">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead className="bg-gray-100/50 backdrop-blur-sm border-b border-gray-200/50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ផលិតផល</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ប្រភេទ</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">តម្លៃ</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ស្តុក</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">ស្ថានភាព</th>
              <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200/50">
            {products.map((product, index) => (
              <motion.tr
                key={product.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.05 }}
                className="hover:bg-gray-50/50 transition-colors duration-300"
              >
                <ProductTableRow
                  product={product}
                  onEdit={onEdit}
                  onDelete={onDelete}
                />
              </motion.tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-12">
                  <div className="flex flex-col items-center justify-center text-gray-500">
                    <FaBox className="text-4xl mb-2 opacity-50" />
                    <p>មិនទាន់មានផលិតផលនៅឡើយទេ</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductList;