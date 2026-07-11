import React, { useState } from 'react';
import api from '../utils/api';
import { motion } from 'framer-motion';
import { FaCloudUploadAlt, FaImage, FaCheckCircle } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Upload = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      toast.error('Please select files to upload');
      return;
    }

    setUploading(true);
    const urls = [];

    for (const file of files) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await api.post('/admin/upload', formData);
        urls.push(response.url);
      } catch (error) {
        toast.error(`Failed to upload ${file.name}`);
      }
    }

    setUploadedUrls(urls);
    setUploading(false);
    setFiles([]);
    
    if (urls.length > 0) {
      toast.success(`Successfully uploaded ${urls.length} images!`);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Image Upload</h1>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 max-w-2xl"
      >
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Images
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors duration-300">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="cursor-pointer">
              <FaCloudUploadAlt className="text-5xl text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {files.length > 0 
                  ? `${files.length} files selected` 
                  : 'Click or drag to upload images'}
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Supports: JPG, PNG, GIF, WebP
              </p>
            </label>
          </div>
        </div>

        {files.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Selected Files</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {files.map((file, index) => (
                <div key={index} className="relative bg-gray-100 rounded-lg p-2">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={file.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-1 truncate">{file.name}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={handleUpload}
          disabled={uploading || files.length === 0}
          className="w-full btn-primary"
        >
          {uploading ? 'Uploading...' : 'Upload Images'}
        </button>
      </motion.div>

      {uploadedUrls.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card p-6 max-w-2xl mt-8"
        >
          <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center space-x-2">
            <FaCheckCircle className="text-green-500" />
            <span>Uploaded Images</span>
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {uploadedUrls.map((url, index) => (
              <div key={index} className="relative group">
                <img
                  src={url}
                  alt={`Uploaded ${index}`}
                  className="w-full h-32 object-cover rounded-lg"
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg flex items-center justify-center">
                  <button
                    onClick={() => navigator.clipboard.writeText(url)}
                    className="text-white bg-indigo-600 px-3 py-1 rounded-lg text-sm"
                  >
                    Copy URL
                  </button>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Upload;