// src/pages/Pages.jsx
import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaEdit, FaPlus, FaSave, FaTrash, FaImage, FaTimes, 
  FaCloudUploadAlt, FaCheckCircle, FaStar, FaArrowRight 
} from 'react-icons/fa';
import toast from 'react-hot-toast';

const Pages = () => {
  const [pages, setPages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  
  const [formData, setFormData] = useState({ 
    title: '', 
    content: '', 
    slug: '', 
    image_url: '',
    features: [],     
    gallery_images: [] 
  });
  
  const [uploading, setUploading] = useState(false);
  const [uploadingGallery, setUploadingGallery] = useState(false);
  const [newFeature, setNewFeature] = useState('');

  const availableSlugs = ['about', 'contact', 'terms', 'privacy', 'faq'];

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const data = await api.get('/pages/');
      setPages(data);
    } catch (error) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (page) => {
    setEditingPage(page);
    setFormData({ 
      title: page.title, 
      content: page.content, 
      slug: page.slug, 
      image_url: page.image_url || '',
      features: page.features || [],
      gallery_images: page.gallery_images || []
    });
  };

  const handleDelete = async (slug) => {
    if (!window.confirm(`Are you sure you want to delete page "${slug}"?`)) return;
    try {
      await api.delete(`/pages/${slug}`);
      toast.success('Page deleted!');
      fetchPages();
    } catch (error) {
      toast.error('Failed to delete page');
    }
  };

  const addFeature = () => {
    if (newFeature.trim() === '') {
      toast.error('Please enter a feature');
      return;
    }
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }));
    setNewFeature('');
  };

  const removeFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }));
  };

  // ✅ កែតម្រូវ Upload Handlers នៅទីនេះ
  const uploadImageToCloudinary = async (file) => {
    const formDataUpload = new FormData();
    // ✅ ត្រូវប្រាកដថា Field Name គឺ 'file'
    formDataUpload.append('file', file); 
    
    const response = await api.post('/admin/upload', formDataUpload);
    return response.url;
  };

  const handleMainImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setUploading(true);
      const url = await uploadImageToCloudinary(file);
      setFormData(prev => ({ ...prev, image_url: url }));
      toast.success('Main image uploaded!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload main image');
    } finally {
      setUploading(false);
    }
  };

  const handleGalleryUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingGallery(true);
    const uploadedUrls = [];

    for (const file of files) {
      try {
        const url = await uploadImageToCloudinary(file);
        uploadedUrls.push(url);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setFormData(prev => ({
      ...prev,
      gallery_images: [...prev.gallery_images, ...uploadedUrls]
    }));
    setUploadingGallery(false);
    toast.success(`Uploaded ${uploadedUrls.length} gallery images!`);
  };

  const removeGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      gallery_images: prev.gallery_images.filter((_, i) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!formData.slug) {
      toast.error('Please select a slug');
      return;
    }
    try {
      if (editingPage) {
        await api.put(`/pages/${editingPage.slug}`, formData);
        toast.success('Page updated!');
      } else {
        await api.post('/pages/', formData);
        toast.success('Page created!');
      }
      setEditingPage(null);
      setFormData({ title: '', content: '', slug: '', image_url: '', features: [], gallery_images: [] });
      fetchPages();
    } catch (error) {
      toast.error('Failed to save page');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">📄 Pages Management</h1>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-xl p-6 mb-10 border border-gray-100"
      >
        <h2 className="text-xl font-bold mb-6 flex items-center space-x-3 text-gray-800 border-b pb-4">
          {editingPage ? <><FaEdit className="text-indigo-600" /> <span>Edit Page</span></> : <><FaPlus className="text-indigo-600" /> <span>Create New Page</span></>}
        </h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* === Left Column === */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Slug (Page Identifier)</label>
              <select
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                disabled={!!editingPage}
                className="input-field bg-gray-50"
              >
                <option value="">Select a slug...</option>
                {availableSlugs.map((slug) => (
                  <option key={slug} value={slug}>{slug}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1">This will be the URL path (e.g. /about). Cannot be changed after creation.</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input type="text" placeholder="Page Title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="input-field" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Main Image (Optional)</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 hover:border-indigo-500 transition-colors duration-300 flex flex-col items-center justify-center w-32 h-32 bg-gray-50">
                    {uploading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-3xl text-gray-400 mb-2" />
                        <span className="text-xs text-gray-500 text-center">Click to Upload</span>
                      </>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleMainImageUpload} className="hidden" />
                </label>
                {formData.image_url && (
                  <div className="relative group">
                    <img src={formData.image_url} alt="Page preview" className="w-32 h-32 object-cover rounded-xl border shadow-sm" />
                    <button type="button" onClick={() => setFormData({ ...formData, image_url: '' })} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg hover:bg-red-600 transition-colors duration-200">
                      <FaTimes className="text-xs" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* === Middle Column: Features === */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Key Features (Add important points)</label>
              <div className="flex space-x-2 mb-3">
                <input type="text" placeholder="e.g. Free Shipping" value={newFeature} onChange={(e) => setNewFeature(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && addFeature()} className="input-field flex-1" />
                <button onClick={addFeature} className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                  <FaPlus />
                </button>
              </div>
              <div className="space-y-2 mt-3">
                {formData.features.map((feature, index) => (
                  <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="flex items-center justify-between bg-indigo-50 border border-indigo-100 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <FaCheckCircle className="text-indigo-600 text-sm" />
                      <span className="text-sm text-gray-700 font-medium">{feature}</span>
                    </div>
                    <button onClick={() => removeFeature(index)} className="text-red-500 hover:text-red-700 transition-colors duration-200">
                      <FaTimes className="text-sm" />
                    </button>
                  </motion.div>
                ))}
                {formData.features.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No features added yet.</p>
                )}
              </div>
            </div>
          </div>

          {/* === Right Column: Gallery Images === */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Gallery Images (Upload multiple)</label>
              <div className="space-y-3">
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-indigo-500 transition-colors duration-300 flex flex-col items-center justify-center bg-gray-50">
                    {uploadingGallery ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                    ) : (
                      <>
                        <FaCloudUploadAlt className="text-4xl text-gray-400 mb-2" />
                        <span className="text-sm text-gray-500">Click to upload multiple images</span>
                      </>
                    )}
                  </div>
                  <input type="file" multiple accept="image/*" onChange={handleGalleryUpload} className="hidden" />
                </label>

                {formData.gallery_images.length > 0 && (
                  <div className="grid grid-cols-3 gap-2 mt-3">
                    {formData.gallery_images.map((url, index) => (
                      <div key={index} className="relative group border rounded-lg overflow-hidden">
                        <img src={url} alt={`Gallery ${index}`} className="w-full h-20 object-cover" />
                        <button type="button" onClick={() => removeGalleryImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <FaTimes className="text-xs" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">Content (Use \n for new lines)</label>
          <textarea placeholder="Write your page content here..." rows="6" value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })} className="input-field" />
        </div>

        <div className="flex space-x-4 mt-6 pt-4 border-t">
          <button onClick={handleSave} className="btn-primary flex items-center space-x-2 px-6 py-3 shadow-md hover:shadow-lg transition-all duration-300" disabled={uploading || uploadingGallery}>
            <FaSave /> <span>{editingPage ? 'Update Page' : 'Create Page'}</span>
          </button>
          {editingPage && (
            <button onClick={() => { setEditingPage(null); setFormData({ title: '', content: '', slug: '', image_url: '', features: [], gallery_images: [] }); }} className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors duration-300">
              Cancel
            </button>
          )}
        </div>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
          <h3 className="text-lg font-bold text-gray-800">📋 Existing Pages</h3>
          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">{pages.length} pages</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-gray-50 transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">{page.slug}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{page.title}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{page.image_url ? <img src={page.image_url} alt={page.title} className="w-12 h-12 object-cover rounded-lg shadow-sm" /> : <span className="text-xs text-gray-400">No image</span>}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleEdit(page)} className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-full transition-all duration-200" title="Edit"><FaEdit className="text-lg" /></button>
                      <button onClick={() => handleDelete(page.slug)} className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-full transition-all duration-200" title="Delete"><FaTrash className="text-lg" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {pages.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-gray-500">
                    <div className="flex flex-col items-center space-y-2">
                      <FaPlus className="text-4xl text-gray-300" />
                      <p>No pages created yet. Start by creating one above!</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Pages;