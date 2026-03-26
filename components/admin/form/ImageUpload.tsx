'use client';

import React, { useState, useRef } from 'react';
import { Upload, X } from 'lucide-react';
import { getImageUrl, getImageErrorSrc } from '@/lib/image-utils';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, disabled = false }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('File harus berupa gambar');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError('Ukuran file tidak boleh lebih dari 5MB');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Create FormData for multipart/form-data
      const formData = new FormData();
      formData.append('file', file);

      // Upload to /api/upload endpoint
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload image');
      }

      const data = await response.json();
      
      // Build full URL for production
      let imageUrl = data.url;
      if (typeof window !== 'undefined') {
        const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
        if (!isDev && !imageUrl.startsWith('http')) {
          // In production, ensure full URL is used
          const baseUrl = process.env.NEXT_PUBLIC_APP_URL || window.location.origin;
          imageUrl = `${baseUrl}${imageUrl}`;
        }
      }
      
      onChange(imageUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload gagal');
      console.error('Upload error:', err);
    } finally {
      setLoading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = () => {
    onChange('');
  };

  return (
    <div className="space-y-3">
      {/* Preview */}
      {value && (
        <div className="relative w-full h-48 bg-gray-100 rounded-lg overflow-hidden group">
          <img
            src={getImageUrl(value)}
            alt="Image preview"
            className="w-full h-48 object-cover"
            onError={(e) => {
              e.currentTarget.src = getImageErrorSrc();
            }}
          />
          <button
            onClick={handleRemove}
            disabled={disabled}
            className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity disabled:opacity-50"
            title="Remove image"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
          disabled ? 'bg-gray-50 border-gray-300 cursor-not-allowed' : 'border-blue-300 hover:border-blue-500 hover:bg-blue-50'
        }`}
        onClick={() => !disabled && fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={disabled || loading}
          className="hidden"
        />

        <Upload className={`w-8 h-8 mx-auto mb-2 ${disabled ? 'text-gray-400' : 'text-blue-500'}`} />
        <p className={`font-medium ${disabled ? 'text-gray-500' : 'text-gray-700'}`}>
          {loading ? 'Uploading...' : 'Klik atau drag gambar di sini'}
        </p>
        <p className="text-sm text-gray-500">PNG, JPG, GIF (Max 5MB)</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* URL Input */}
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">
          Atau paste URL gambar
        </label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          placeholder="https://example.com/image.jpg atau /uploads/berita/image.jpg"
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
        />
      </div>
    </div>
  );
};

export default ImageUpload;
