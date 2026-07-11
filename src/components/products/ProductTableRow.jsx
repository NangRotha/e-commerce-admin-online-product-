import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { motion } from 'framer-motion';

const ProductTableRow = ({ product, onEdit, onDelete }) => {
  return (
    <>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="font-medium text-gray-800">{product.name}</p>
            <p className="text-xs text-gray-500">{product.description?.substring(0, 50)}...</p>
          </div>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className="px-3 py-1 text-xs rounded-full bg-blue-500/10 backdrop-blur-sm border border-blue-200/50 text-blue-600 font-medium">
          {product.category}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div>
          <p className="font-medium text-indigo-600">${product.price.toFixed(2)}</p>
          {product.discounted_price && (
            <p className="text-xs text-gray-400 line-through">
              ${product.discounted_price.toFixed(2)}
            </p>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <span className={`px-3 py-1 text-xs rounded-full font-medium ${
          product.stock_quantity > 10 ? 'bg-green-500/10 border border-green-200/50 text-green-600' :
          product.stock_quantity > 0 ? 'bg-yellow-500/10 border border-yellow-200/50 text-yellow-600' :
          'bg-red-500/10 border border-red-200/50 text-red-600'
        }`}>
          {product.stock_quantity > 0 ? `មាន ${product.stock_quantity}` : 'អស់ស្តុក'}
        </span>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex gap-2">
          {product.is_new && (
            <span className="px-3 py-1 text-xs rounded-full bg-green-500/10 border border-green-200/50 text-green-600 font-medium">
              ថ្មី
            </span>
          )}
          {product.is_featured && (
            <span className="px-3 py-1 text-xs rounded-full bg-yellow-500/10 border border-yellow-200/50 text-yellow-600 font-medium">
              ពិសេស
            </span>
          )}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onEdit(product)}
            className="p-2 bg-blue-500/10 backdrop-blur-sm border border-blue-200/50 text-blue-600 rounded-lg hover:bg-blue-500 hover:text-white transition-all duration-300 shadow-sm"
          >
            <FaEdit className="text-sm" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete(product.id)}
            className="p-2 bg-red-500/10 backdrop-blur-sm border border-red-200/50 text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 shadow-sm"
          >
            <FaTrash className="text-sm" />
          </motion.button>
        </div>
      </td>
    </>
  );
};

export default ProductTableRow;