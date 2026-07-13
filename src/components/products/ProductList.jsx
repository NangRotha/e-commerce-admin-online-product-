import React from 'react';
import { FaEdit, FaTrash } from 'react-icons/fa';

// ✅ FIX: Set default value for products to [] to prevent undefined crash
const ProductList = ({ products = [], onDelete }) => {
  
  const handleDelete = (id) => {
    if (window.confirm('តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះទេ?')) {
      onDelete(id);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ឈ្មោះ</th>
              <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">តម្លៃ</th>
              <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ស្តុក</th>
              <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ស្ថានភាព</th>
              <th className="text-right py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">សកម្មភាព</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {/* ✅ FIX: Use Array.isArray() to safely check before mapping */}
            {Array.isArray(products) && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-6 text-sm font-medium text-gray-800">{product.name}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">${product.price?.toFixed(2) || '0.00'}</td>
                  <td className="py-3 px-6 text-sm text-gray-600">{product.stock || 0}</td>
                  <td className="py-3 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${product.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                      {product.is_active ? 'សកម្ម' : 'អសកម្ម'}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <FaEdit />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="py-8 text-center text-gray-500 text-sm">
                  មិនទាន់មានផលិតផលនៅឡើយទេ
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