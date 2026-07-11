import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaTrash, FaImage, FaTimes, FaPlus } from 'react-icons/fa';
import api from '../../utils/api';
import toast from 'react-hot-toast';

const ProductForm = ({ onSubmit, onCancel, initialData }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discounted_price: '',
    category: '',
    subcategory: '',
    stock_quantity: 0,
    is_new: true,
    is_featured: false,
    image_url: '',
    sub_images: [],
    specifications: {},
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingSub, setUploadingSub] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        description: initialData.description || '',
        price: initialData.price || '',
        discounted_price: initialData.discounted_price || '',
        category: initialData.category || '',
        subcategory: initialData.subcategory || '',
        stock_quantity: initialData.stock_quantity || 0,
        is_new: initialData.is_new ?? true,
        is_featured: initialData.is_featured ?? false,
        image_url: initialData.image_url || '',
        sub_images: initialData.sub_images || [],
        specifications: initialData.specifications || {},
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSpecificationChange = (key, value) => {
    setFormData({
      ...formData,
      specifications: {
        ...formData.specifications,
        [key]: value,
      },
    });
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/admin/upload', formDataUpload);
      setFormData(prev => ({
        ...prev,
        image_url: response.url,
      }));
      toast.success('រូបភាពធំបានផ្ទុកឡើង!');
    } catch (error) {
      toast.error('បរាជ័យក្នុងការផ្ទុករូបភាពធំ');
    } finally {
      setUploading(false);
    }
  };

  const handleSubImagesUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingSub(true);
    const uploadedUrls = [];

    for (const file of files) {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      try {
        const response = await api.post('/admin/upload', formDataUpload);
        uploadedUrls.push(response.url);
      } catch (error) {
        toast.error(`បរាជ័យក្នុងការផ្ទុក ${file.name}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      sub_images: [...prev.sub_images, ...uploadedUrls],
    }));
    setUploadingSub(false);
    toast.success(`បានផ្ទុករូបភាពរងចំនួន ${uploadedUrls.length}!`);
  };

  const removeSubImage = (index) => {
    const newSubImages = formData.sub_images.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      sub_images: newSubImages,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.image_url) {
      toast.error('សូមផ្ទុករូបភាពធំជាមុនសិន');
      return;
    }
    setLoading(true);
    onSubmit(formData);
    setLoading(false);
  };

  const categories = ['AI Models', 'Games', 'Software', 'Accessories', 'Electronics'];

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl shadow-2xl p-6 md:p-8"
    >
      <div className="flex items-center justify-between mb-6 border-b border-gray-200/50 pb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          {initialData ? 'កែសម្រួលផលិតផល' : 'បន្ថែមផលិតផលថ្មី'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ឈ្មោះផលិតផល *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
              placeholder="បញ្ចូលឈ្មោះផលិតផល"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ប្រភេទ *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 outline-none focus:border-indigo-400 transition-colors duration-300"
            >
              <option value="">ជ្រើសរើសប្រភេទ</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              តម្លៃ ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              min="0"
              step="0.01"
              className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              តម្លៃបញ្ចុះ ($)
            </label>
            <input
              type="number"
              name="discounted_price"
              value={formData.discounted_price}
              onChange={handleChange}
              min="0"
              step="0.01"
              className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
              placeholder="0.00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              បរិមាណស្តុក *
            </label>
            <input
              type="number"
              name="stock_quantity"
              value={formData.stock_quantity}
              onChange={handleChange}
              required
              min="0"
              className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
              placeholder="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              ប្រភេទរង
            </label>
            <input
              type="text"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
              placeholder="ស្រេចចិត្ត"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            ការពិពណ៌នា *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="w-full bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-4 py-3 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300"
            placeholder="បញ្ចូលការពិពណ៌នាផលិតផល"
          />
        </div>

        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_new"
              checked={formData.is_new}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-700">ផលិតផលថ្មី</span>
          </label>
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="is_featured"
              checked={formData.is_featured}
              onChange={handleChange}
              className="w-4 h-4 text-indigo-600 focus:ring-indigo-500 rounded cursor-pointer"
            />
            <span className="text-sm text-gray-700">ពិសេស</span>
          </label>
        </div>

        {/* ===== Main Image Upload ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            រូបភាពធំ *
          </label>
          <div className="flex items-center space-x-4">
            <label className="cursor-pointer">
              <div className="border-2 border-dashed border-gray-300/50 rounded-xl p-6 hover:border-indigo-400 transition-colors duration-300 bg-white/20 backdrop-blur-sm flex flex-col items-center justify-center w-32 h-32">
                {uploading ? (
                  <div className="animate-spin h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full"></div>
                ) : (
                  <>
                    <FaCloudUploadAlt className="text-3xl text-gray-400" />
                    <span className="text-xs text-gray-500 mt-2 text-center">ចុចដើម្បីផ្ទុក</span>
                  </>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleMainImageUpload}
                className="hidden"
              />
            </label>
            {formData.image_url && (
              <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-gray-200/50 shadow-lg">
                <img
                  src={formData.image_url}
                  alt="Main product preview"
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, image_url: '' }))}
                  className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ===== Sub-Images Upload ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            រូបភាពរង (ស្រេចចិត្ត)
          </label>
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300/50 rounded-xl p-4 hover:border-indigo-400 transition-colors duration-300 bg-white/20 backdrop-blur-sm flex items-center gap-3">
                  <FaImage className="text-xl text-gray-400" />
                  <span className="text-sm text-gray-500">
                    {uploadingSub ? 'កំពុងផ្ទុក...' : 'ផ្ទុកច្រើន'}
                  </span>
                </div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleSubImagesUpload}
                  className="hidden"
                />
              </label>
              <span className="text-xs text-gray-400">(ជ្រើសរើសរូបភាពច្រើនក្នុងពេលតែមួយ)</span>
            </div>

            {formData.sub_images.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2">
                {formData.sub_images.map((url, index) => (
                  <div key={index} className="relative group bg-white/20 backdrop-blur-sm border border-gray-200/50 rounded-xl overflow-hidden">
                    <img
                      src={url}
                      alt={`Sub-image ${index + 1}`}
                      className="w-full h-20 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeSubImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    >
                      <FaTrash className="text-xs" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ===== Specifications ===== */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            លក្ខណៈបច្ចេកទេស (ស្រេចចិត្ត)
          </label>
          <div className="space-y-2 bg-white/30 backdrop-blur-sm border border-gray-200/50 rounded-xl p-4">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="គន្លឹះ (ឧ. ដំណើរការ)"
                className="flex-1 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-3 py-2 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const key = e.target.value.trim();
                    if (key) {
                      handleSpecificationChange(key, '');
                      e.target.value = '';
                    }
                  }
                }}
              />
              <input
                type="text"
                placeholder="តម្លៃ (ឧ. Intel i7)"
                className="flex-1 bg-white/50 backdrop-blur-sm border border-gray-200/50 rounded-xl px-3 py-2 text-gray-700 placeholder-gray-400 outline-none focus:border-indigo-400 transition-colors duration-300 text-sm"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    const value = e.target.value.trim();
                    if (value) {
                      const lastKey = Object.keys(formData.specifications).pop();
                      if (lastKey) {
                        handleSpecificationChange(lastKey, value);
                        e.target.value = '';
                      }
                    }
                  }
                }}
              />
            </div>
            {Object.entries(formData.specifications).map(([key, value]) => (
              <div key={key} className="flex justify-between py-2 border-b border-gray-200/50 last:border-0">
                <span className="text-sm text-gray-600">{key}</span>
                <span className="text-sm text-gray-800 font-medium">{value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ===== Buttons ===== */}
        <div className="flex gap-4 pt-4 border-t border-gray-200/50">
          <button
            type="submit"
            disabled={loading || uploading || uploadingSub}
            className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-3.5 rounded-xl font-bold shadow-lg hover:shadow-2xl transition-all duration-300 disabled:opacity-70"
          >
            {loading ? 'កំពុងរក្សាទុក...' : initialData ? 'ធ្វើបច្ចុប្បន្នភាព' : 'បន្ថែមផលិតផល'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3.5 bg-red-500/10 backdrop-blur-sm border border-red-200/50 text-red-500 rounded-xl font-medium hover:bg-red-500 hover:text-white transition-all duration-300"
          >
            បោះបង់
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default ProductForm;