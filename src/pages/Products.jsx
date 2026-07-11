import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import ProductForm from '../components/products/ProductForm';
import ProductList from '../components/products/ProductList'; // <-- Import component ថ្មី
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await api.get('/products/');
      setProducts(data);
    } catch (error) {
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await api.post('/admin/products', productData);
      toast.success('Product added successfully!');
      setShowForm(false);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to add product');
    }
  };

  const handleUpdateProduct = async (productData) => {
    try {
      await api.put(`/admin/products/${editingProduct.id}`, productData);
      toast.success('Product updated successfully!');
      setShowForm(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error('Failed to update product');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await api.delete(`/admin/products/${productId}`);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      toast.error('Failed to delete product');
    }
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Products Management</h1>
        <button
          onClick={() => {
            setEditingProduct(null);
            setShowForm(!showForm);
          }}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus />
          <span>Add New Product</span>
        </button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-8"
          >
            <ProductForm
              onSubmit={editingProduct ? handleUpdateProduct : handleAddProduct}
              onCancel={() => {
                setShowForm(false);
                setEditingProduct(null);
              }}
              initialData={editingProduct}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ប្រើ ProductList component នៅទីនេះ */}
      <ProductList
        products={products}
        onEdit={handleEditProduct}
        onDelete={handleDeleteProduct}
        loading={loading}
      />
    </div>
  );
};

export default Products;