// src/pages/Products.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaPlus, FaEdit, FaTrash, FaSpinner, FaTimes, FaImage, FaCloudUploadAlt } from 'react-icons/fa';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // === State គ្រប់គ្រង Modal ===
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  
  // === State គ្រប់គ្រងទម្រង់ ===
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    discounted_price: '', // ✅ បន្ថែម field តម្លៃបញ្ចុះ
    stock_quantity: '',
    description: '',
    category: '',
    is_new: false,
    is_featured: false,
    image_url: '',
    sub_images: [],
  });
  
  // === State គ្រប់គ្រង Upload រូបភាព ===
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingSubImages, setUploadingSubImages] = useState(false);

  // === Fetch Products ===
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/admin/products');
      const productData = Array.isArray(response) ? response : (response?.data || []);
      setProducts(productData);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // === Open Create Modal ===
  const handleOpenCreate = () => {
    setEditingProduct(null);
    setFormData({ 
      name: '', 
      price: '', 
      discounted_price: '', // ✅ Reset discounted_price
      stock_quantity: '', 
      description: '', 
      category: '', 
      is_new: false,
      is_featured: false,
      image_url: '',
      sub_images: []
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // === Open Edit Modal ===
  const handleOpenEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name || '',
      price: product.price || '',
      discounted_price: product.discounted_price || '', // ✅ Load discounted_price
      stock_quantity: product.stock_quantity || '',
      description: product.description || '',
      category: product.category || '',
      is_new: product.is_new || false,
      is_featured: product.is_featured || false,
      image_url: product.image_url || '',
      sub_images: product.sub_images || [],
    });
    setSelectedFile(null);
    setIsModalOpen(true);
  };

  // === Handle Form Change ===
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  // === Handle Main Image File Selection ===
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // === Upload Main Image to Backend ===
  const uploadMainImage = async () => {
    if (!selectedFile) return formData.image_url;

    setUploadingImage(true);
    const uploadData = new FormData();
    uploadData.append('file', selectedFile);

    try {
      const response = await api.post('/admin/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setUploadingImage(false);
      return response.url;
    } catch (error) {
      console.error('Error uploading main image:', error);
      setUploadingImage(false);
      alert('មានបញ្ហាក្នុងការផ្ទុករូបភាពធំ');
      return formData.image_url;
    }
  };

  // === Upload Sub-Images to Backend ===
  const uploadSubImages = async (files) => {
    if (!files || files.length === 0) return [];

    setUploadingSubImages(true);
    const uploadedUrls = [];

    for (const file of files) {
      const uploadData = new FormData();
      uploadData.append('file', file);
      try {
        const response = await api.post('/admin/upload', uploadData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        uploadedUrls.push(response.url);
      } catch (error) {
        console.error('Error uploading sub-image:', error);
        alert(`មានបញ្ហាក្នុងការផ្ទុករូបភាពរង: ${file.name}`);
      }
    }

    setUploadingSubImages(false);
    return uploadedUrls;
  };

  // === Handle Sub-Images Selection ===
  const handleSubImagesChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadedUrls = await uploadSubImages(files);
    
    setFormData(prev => ({
      ...prev,
      sub_images: [...prev.sub_images, ...uploadedUrls]
    }));
  };

  // === Remove Sub-Image ===
  const removeSubImage = (index) => {
    setFormData(prev => ({
      ...prev,
      sub_images: prev.sub_images.filter((_, i) => i !== index)
    }));
  };

  // === Create / Update Submit ===
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      
      const uploadedMainImageUrl = await uploadMainImage();

      const payload = { 
        name: formData.name,
        price: parseFloat(formData.price) || 0,
        discounted_price: parseFloat(formData.discounted_price) || 0, // ✅ Include discounted_price
        stock_quantity: parseInt(formData.stock_quantity) || 0,
        description: formData.description || '',
        category: formData.category || '',
        is_new: formData.is_new,
        is_featured: formData.is_featured,
        image_url: uploadedMainImageUrl,
        sub_images: formData.sub_images,
      };

      if (editingProduct) {
        await api.put(`/admin/products/${editingProduct.id}`, payload);
        alert('ផលិតផលត្រូវបានកែប្រែដោយជោគជ័យ!');
      } else {
        await api.post('/admin/products', payload);
        alert('ផលិតផលថ្មីត្រូវបានបង្កើតដោយជោគជ័យ!');
      }
      setIsModalOpen(false);
      fetchProducts();
    } catch (error) {
      console.error('Error saving product:', error);
      alert('មានបញ្ហាក្នុងការរក្សាទុកផលិតផល');
    } finally {
      setLoading(false);
    }
  };

  // === Delete Product ===
  const handleDelete = async (id) => {
    if (!window.confirm('តើអ្នកប្រាកដថាចង់លុបផលិតផលនេះទេ?')) return;
    try {
      await api.delete(`/admin/products/${id}`);
      fetchProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('មានបញ្ហាក្នុងការលុបផលិតផល');
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <FaSpinner className="text-4xl text-indigo-600" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">ផលិតផលទាំងអស់</h1>
        <button 
          onClick={handleOpenCreate}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-md font-medium"
        >
          <FaPlus /> បន្ថែមផលិតផលថ្មី
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">រូបភាព</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ឈ្មោះ</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">តម្លៃ</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ស្តុក</th>
                <th className="text-left py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">ស្ថានភាព</th>
                <th className="text-right py-3 px-6 text-xs font-bold text-gray-500 uppercase tracking-wider">សកម្មភាព</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {Array.isArray(products) && products.length > 0 ? (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-6">
                      {product.image_url ? (
                        <img 
                          src={product.image_url} 
                          alt={product.name} 
                          className="w-12 h-12 object-cover rounded-lg border border-gray-200 shadow-sm"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                          <FaImage size={16} />
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-6 text-sm font-medium text-gray-800">{product.name}</td>
                    <td className="py-3 px-6 text-sm">
                      <div>
                        <span className="font-medium text-indigo-600">${product.price?.toFixed(2) || '0.00'}</span>
                        {product.discounted_price && product.discounted_price > 0 && (
                          <span className="ml-2 text-xs text-gray-400 line-through">
                            ${product.discounted_price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-sm text-gray-600">{product.stock_quantity || 0}</td>
                    <td className="py-3 px-6">
                      <div className="flex gap-1 flex-wrap">
                        {product.is_new && (
                          <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                            ថ្មី
                          </span>
                        )}
                        {product.is_featured && (
                          <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-yellow-100 text-yellow-700">
                            ពិសេស
                          </span>
                        )}
                        {!product.is_new && !product.is_featured && (
                          <span className="px-2.5 py-1 text-xs rounded-full font-medium bg-gray-100 text-gray-600">
                            ធម្មតា
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenEdit(product)}
                          className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product.id)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <FaTrash size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-gray-500 text-sm">
                    មិនទាន់មានផលិតផលនៅឡើយទេ
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ===== CRUD MODAL ===== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 relative max-h-[90vh] overflow-y-auto"
          >
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </button>

            <h2 className="text-xl font-bold text-gray-800 mb-5">
              {editingProduct ? 'កែប្រែផលិតផល' : 'បន្ថែមផលិតផលថ្មី'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* ===== Main Image ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">រូបភាពធំ</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 border border-gray-200 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50">
                    {selectedFile ? (
                      <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="w-full h-full object-cover" />
                    ) : formData.image_url ? (
                      <img src={formData.image_url} alt="Current" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <FaImage size={24} />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleFileChange}
                      className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                    {uploadingImage && <p className="text-xs text-indigo-600 mt-1 animate-pulse">កំពុងផ្ទុករូបភាព...</p>}
                  </div>
                </div>
              </div>

              {/* ===== Sub-Images ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">រូបភាពរង (អាចជ្រើសរើសច្រើន)</label>
                <div className="flex flex-col gap-2">
                  {/* Upload Button */}
                  <div className="flex items-center gap-4">
                    <label className="cursor-pointer">
                      <div className="flex items-center gap-2 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-indigo-500 transition-colors">
                        <FaCloudUploadAlt className="text-xl text-gray-400" />
                        <span className="text-sm text-gray-500">
                          {uploadingSubImages ? 'កំពុងផ្ទុក...' : 'ជ្រើសរើសរូបភាពរង'}
                        </span>
                      </div>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleSubImagesChange}
                        className="hidden"
                      />
                    </label>
                    <span className="text-xs text-gray-400">(អាចជ្រើសរើសច្រើនក្នុងពេលតែមួយ)</span>
                  </div>

                  {/* Preview Sub-images */}
                  {formData.sub_images.length > 0 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {formData.sub_images.map((url, index) => (
                        <div key={index} className="relative group border rounded-lg overflow-hidden">
                          <img
                            src={url}
                            alt={`Sub-image ${index}`}
                            className="w-full h-20 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeSubImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          >
                            <FaTimes className="text-xs" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* ===== Basic Info ===== */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ឈ្មោះផលិតផល</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              {/* ===== Price & Discount ===== */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃ ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="price"
                    value={formData.price || ''}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">តម្លៃបញ្ចុះ ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    name="discounted_price"
                    value={formData.discounted_price || ''}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                    placeholder="ស្រេចចិត្ត"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ចំនួនស្តុក</label>
                <input
                  type="number"
                  name="stock_quantity"
                  value={formData.stock_quantity || ''}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ប្រភេទ</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ការពិពណ៌នា</label>
                <textarea
                  name="description"
                  rows="3"
                  value={formData.description || ''}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none resize-none"
                />
              </div>

              {/* ===== Checkboxes ===== */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_new"
                    checked={formData.is_new || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">ថ្មី (New)</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    name="is_featured"
                    checked={formData.is_featured || false}
                    onChange={handleChange}
                    className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <label className="text-sm text-gray-700">ពិសេស (Featured)</label>
                </div>
              </div>

              <div className="flex gap-3 justify-end pt-2 border-t border-gray-100 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  disabled={uploadingImage || uploadingSubImages}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md disabled:opacity-70"
                >
                  {editingProduct ? 'រក្សាទុកការកែប្រែ' : 'បង្កើតផលិតផល'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Products;