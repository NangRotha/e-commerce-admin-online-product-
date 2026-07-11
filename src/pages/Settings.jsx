import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaSave, FaCloudUploadAlt, FaTrash, FaPlus, FaImage, FaToggleOn, FaToggleOff } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    site_name: 'TechStore',
    logo_url: '',
    favicon_url: '',
    slide_images: [],
    meta_description: '',
    meta_keywords: '',
    // Promo Banner Fields
    promo_title: 'Special Offer: Get 20% Off Your First Order!',
    promo_subtitle: 'Use code WELCOME20 at checkout',
    promo_button_text: 'Shop Now',
    promo_code: 'WELCOME20',
    promo_is_active: true,
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [newSlideImage, setNewSlideImage] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.get('/admin/settings');
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load settings');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setSettings({
      ...settings,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/admin/upload', formData);
      setSettings({
        ...settings,
        [field]: response.url,
      });
      toast.success(`${field} updated successfully!`);
    } catch (error) {
      toast.error('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSlideImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    try {
      setUploading(true);
      const response = await api.post('/admin/upload', formData);
      setNewSlideImage(response.url);
      toast.success('Slide image uploaded! Click Add to include it.');
    } catch (error) {
      toast.error('Failed to upload slide image');
    } finally {
      setUploading(false);
    }
  };

  const addSlideImage = () => {
    if (newSlideImage) {
      setSettings({
        ...settings,
        slide_images: [...settings.slide_images, newSlideImage],
      });
      setNewSlideImage(null);
      toast.success('Slide image added to slideshow!');
    }
  };

  const removeSlideImage = (index) => {
    const newSlideImages = settings.slide_images.filter((_, i) => i !== index);
    setSettings({
      ...settings,
      slide_images: newSlideImages,
    });
    toast.success('Slide image removed');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.put('/admin/settings', settings);
      toast.success('Settings updated successfully!');
    } catch (error) {
      toast.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
        onSubmit={handleSubmit}
      >
        {/* Site Information */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Site Information</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
              <input type="text" name="site_name" value={settings.site_name} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Description (SEO)</label>
              <textarea name="meta_description" value={settings.meta_description || ''} onChange={handleChange} rows="3" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meta Keywords (SEO)</label>
              <input type="text" name="meta_keywords" value={settings.meta_keywords || ''} onChange={handleChange} className="input-field" />
            </div>
          </div>
        </div>

        {/* Branding */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Branding</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors duration-300 w-32 h-32 flex flex-col items-center justify-center">
                    <FaCloudUploadAlt className="text-3xl text-gray-400" />
                    <span className="text-xs text-gray-500 mt-2 text-center">{uploading ? 'Uploading...' : 'Upload Logo'}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'logo_url')} className="hidden" />
                </label>
                {settings.logo_url && <img src={settings.logo_url} alt="Logo" className="w-32 h-32 object-contain rounded-lg bg-gray-50 border" />}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Favicon</label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors duration-300 w-32 h-32 flex flex-col items-center justify-center">
                    <FaCloudUploadAlt className="text-3xl text-gray-400" />
                    <span className="text-xs text-gray-500 mt-2 text-center">{uploading ? 'Uploading...' : 'Upload Favicon'}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={(e) => handleImageUpload(e, 'favicon_url')} className="hidden" />
                </label>
                {settings.favicon_url && <img src={settings.favicon_url} alt="Favicon" className="w-16 h-16 object-contain rounded-lg bg-gray-50 border" />}
              </div>
            </div>
          </div>
        </div>

        {/* Slideshow Images */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">Slideshow Images</h2>
          <div className="space-y-4">
            <div className="flex items-end space-x-4">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload New Slide Image</label>
                <label className="cursor-pointer block">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors duration-300 flex items-center justify-center">
                    <FaCloudUploadAlt className="text-2xl text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">{newSlideImage ? 'Image ready to add' : 'Click to upload'}</span>
                  </div>
                  <input type="file" accept="image/*" onChange={handleSlideImageUpload} className="hidden" />
                </label>
              </div>
              <button type="button" onClick={addSlideImage} disabled={!newSlideImage} className="btn-primary flex items-center space-x-2 h-12 px-6 disabled:opacity-50">
                <FaPlus /> <span>Add to Slideshow</span>
              </button>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Current Slideshow ({settings.slide_images.length} images)</h3>
              {settings.slide_images.length === 0 ? (
                <p className="text-sm text-gray-500 italic">No slideshow images yet.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {settings.slide_images.map((url, index) => (
                    <div key={index} className="relative group">
                      <img src={url} alt={`Slide ${index + 1}`} className="w-full h-32 object-cover rounded-lg border" />
                      <button type="button" onClick={() => removeSlideImage(index)} className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <FaTrash className="text-xs" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ===== NEW: Promo Banner Section ===== */}
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2 flex items-center space-x-3">
            <span>Promo Banner</span>
            <button
              type="button"
              onClick={() => setSettings({ ...settings, promo_is_active: !settings.promo_is_active })}
              className={`ml-auto flex items-center space-x-2 px-3 py-1 rounded-full text-sm font-medium ${
                settings.promo_is_active ? 'bg-green-100 text-green-700' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {settings.promo_is_active ? <><FaToggleOn className="text-xl" /> <span>Active</span></> : <><FaToggleOff className="text-xl" /> <span>Inactive</span></>}
            </button>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input type="text" name="promo_title" value={settings.promo_title} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Subtitle</label>
              <input type="text" name="promo_subtitle" value={settings.promo_subtitle} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Button Text</label>
              <input type="text" name="promo_button_text" value={settings.promo_button_text} onChange={handleChange} className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Promo Code</label>
              <input type="text" name="promo_code" value={settings.promo_code} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Preview:</p>
            <div className={`mt-2 py-4 px-6 rounded-xl text-center ${settings.promo_is_active ? 'bg-gradient-to-r from-indigo-600 to-purple-600' : 'bg-gray-300'}`}>
              <h3 className="text-xl font-bold text-white">{settings.promo_title}</h3>
              <p className="text-white/90 text-sm mt-1">{settings.promo_subtitle}</p>
              <button className="mt-3 bg-white text-indigo-600 px-6 py-2 rounded-lg text-sm font-medium">{settings.promo_button_text}</button>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t">
          <button type="submit" disabled={loading} className="btn-primary flex items-center space-x-2 px-8 py-3">
            <FaSave /> <span>{loading ? 'Saving...' : 'Save All Settings'}</span>
          </button>
        </div>
      </motion.form>
    </div>
  );
};

export default Settings;