import React, { useState, useEffect } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaSave, FaCloudUploadAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Settings = () => {
  const [settings, setSettings] = useState({
    site_name: 'TechStore',
    logo_url: '',
    favicon_url: '',
    slide_images: [],
    meta_description: '',
    meta_keywords: '',
  });
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

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
    const { name, value } = e.target;
    setSettings({
      ...settings,
      [name]: value,
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
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Settings</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 max-w-2xl"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              type="text"
              name="site_name"
              value={settings.site_name}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter site name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logo
            </label>
            <div className="flex items-center space-x-4">
              <label className="cursor-pointer">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-indigo-500 transition-colors duration-300">
                  <FaCloudUploadAlt className="text-3xl text-gray-400 mx-auto" />
                  <span className="text-sm text-gray-500 mt-2 block">
                    {uploading ? 'Uploading...' : 'Upload Logo'}
                  </span>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, 'logo_url')}
                  className="hidden"
                />
              </label>
              {settings.logo_url && (
                <img
                  src={settings.logo_url}
                  alt="Logo"
                  className="w-24 h-24 object-contain rounded-lg bg-gray-50"
                />
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Description
            </label>
            <textarea
              name="meta_description"
              value={settings.meta_description}
              onChange={handleChange}
              rows="3"
              className="input-field"
              placeholder="Enter meta description for SEO"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Meta Keywords
            </label>
            <input
              type="text"
              name="meta_keywords"
              value={settings.meta_keywords}
              onChange={handleChange}
              className="input-field"
              placeholder="Enter meta keywords separated by commas"
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2"
            >
              <FaSave />
              <span>{loading ? 'Saving...' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Settings;