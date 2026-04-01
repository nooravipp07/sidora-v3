'use client';

import React, { useState, useEffect } from 'react';
import { TrashIcon, PencilIcon, CheckCircleIcon, XCircleIcon, UploadIcon, EyeIcon } from 'lucide-react';
import Image from 'next/image';
import { validateHeroImage, formatFileSize, getValidationErrorMessage } from '@/lib/hero-image-validator';

interface HeroSectionConfig {
  id: number;
  title: string;
  description: string;
  bannerImageUrl: string;
  displayOrder: number;
  status: number;
  createdAt: string;
  updatedAt: string;
}

const HeroSectionManagement = () => {
  const [configs, setConfigs] = useState<HeroSectionConfig[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form state
  const [formMode, setFormMode] = useState<'create' | 'edit'>('create');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [displayOrder, setDisplayOrder] = useState(0);
  const [status, setStatus] = useState(1);

  // Image upload state
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);

  // Pagination state
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState(0);

  // Load data
  useEffect(() => {
    loadConfigs();
  }, [page]);

  const loadConfigs = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(
        `/api/hero-section?page=${page}&limit=${limit}`
      );
      const data = await response.json();

      if (data.data) {
        setConfigs(data.data);
        setTotal(data.pagination.total);
      }
    } catch (err) {
      setError('Gagal memuat data: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Handle image file select
  const handleImageSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setUploadError('');

    // Validate image
    const validation = await validateHeroImage(file);

    if (!validation.valid) {
      setUploadError(getValidationErrorMessage(validation.errors));
      setImageFile(null);
      setImagePreview('');
      return;
    }

    // Show preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    setImageFile(file);
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!imageFile) {
      setUploadError('Pilih gambar terlebih dahulu');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      setSuccess('');
      setUploadProgress(0);

      const formData = new FormData();
      formData.append('file', imageFile);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 200);

      const response = await fetch('/api/hero-section/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.details?.join(', ') || errorData.error || 'Upload gagal'
        );
      }

      const data = await response.json();
      
      // Debug log
      console.log('Upload response:', data);
      console.log('Setting bannerImageUrl to:', data.url);

      if (!data.url) {
        throw new Error('Response tidak mengandung URL gambar');
      }

      // Set URL dan clear upload state
      setBannerImageUrl(data.url);
      setImageFile(null);
      setImagePreview('');
      setUploadProgress(100);
      setSuccess('✓ Gambar berhasil diupload. Siap untuk disimpan.');
      
      // Clear upload progress after 2 seconds
      setTimeout(() => {
        setUploadProgress(0);
      }, 2000);
    } catch (err) {
      setUploadError('Gagal mengupload gambar: ' + (err as Error).message);
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  // Handle form submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Debug log
    console.log('Form submit:', { formMode, bannerImageUrl, title, description, uploadError });

    // Validation
    if (!title.trim()) {
      setError('Title harus diisi');
      return;
    }
    
    if (!description.trim()) {
      setError('Description harus diisi');
      return;
    }

    // Jika ada upload error, jangan submit
    if (uploadError) {
      setError('Perbaiki error gambar terlebih dahulu');
      return;
    }

    // Mode create: harus ada image yang diupload
    // Mode edit: bisa pakai image lama atau baru
    if (formMode === 'create') {
      if (!bannerImageUrl || bannerImageUrl.trim() === '') {
        setError('Upload gambar terlebih dahulu');
        return;
      }
    }
    
    if (formMode === 'edit') {
      if (!bannerImageUrl || bannerImageUrl.trim() === '') {
        setError('Gambar harus ada');
        return;
      }
    }

    try {
      setError('');

      const payload = {
        title,
        description,
        bannerImageUrl,
        displayOrder,
        status,
      };

      console.log('Submitting payload:', payload);

      if (formMode === 'create') {
        const response = await fetch('/api/hero-section', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal membuat hero section');
        }

        setSuccess('✓ Hero section berhasil dibuat');
        resetForm();
        loadConfigs();
        
        // Auto clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      } else if (editingId) {
        const response = await fetch(`/api/hero-section/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Gagal mengupdate hero section');
        }

        setSuccess('✓ Hero section berhasil diupdate');
        resetForm();
        loadConfigs();
        
        // Auto clear success message after 3 seconds
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      const errorMsg = (err as Error).message;
      setError(errorMsg);
      console.error('Submit error:', err);
    }
  };

  // Handle edit
  const handleEdit = (config: HeroSectionConfig) => {
    setFormMode('edit');
    setEditingId(config.id);
    setTitle(config.title);
    setDescription(config.description);
    setBannerImageUrl(config.bannerImageUrl);
    setDisplayOrder(config.displayOrder);
    setStatus(config.status);
    setImagePreview(config.bannerImageUrl);
  };

  // Handle delete
  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus?')) return;

    try {
      const response = await fetch(`/api/hero-section/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Gagal menghapus');

      setSuccess('Hero section berhasil dihapus');
      loadConfigs();
    } catch (err) {
      setError('Gagal menghapus: ' + (err as Error).message);
    }
  };

  // Handle status toggle
  const handleStatusToggle = async (id: number, currentStatus: number) => {
    try {
      const newStatus = currentStatus === 1 ? 0 : 1;
      const response = await fetch(`/api/hero-section/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Gagal mengubah status');

      setSuccess('Status berhasil diubah');
      
      // Auto clear success message after 3 seconds
      setTimeout(() => setSuccess(''), 3000);
      
      loadConfigs();
    } catch (err) {
      setError('Gagal mengubah status: ' + (err as Error).message);
    }
  };

  // Reset form
  const resetForm = () => {
    setFormMode('create');
    setEditingId(null);
    setTitle('');
    setDescription('');
    setBannerImageUrl('');
    setDisplayOrder(0);
    setStatus(1);
    setImageFile(null);
    setImagePreview('');
    setUploadError('');
    setError('');
    setSuccess('');
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Manajemen Hero Section
      </h1>

      {/* Alert Messages */}
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              {formMode === 'create' ? 'Tambah Hero Section' : 'Edit Hero Section'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Judul hero section"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Deskripsi hero section"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Display Order */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Urutan Tampil
                </label>
                <input
                  type="number"
                  value={displayOrder}
                  onChange={(e) => setDisplayOrder(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={1}>Aktif</option>
                  <option value={0}>Non-Aktif</option>
                </select>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Banner Image (1200x500px min) *
                </label>

                {/* Image Preview */}
                {imagePreview && (
                  <div className="mb-3 relative w-full h-32 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={imagePreview}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                )}

                {/* File Input */}
                <div className="flex items-center gap-2 mb-2">
                  <input
                    type="file"
                    id="file-input"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <label
                    htmlFor="file-input"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 flex items-center gap-2 text-sm"
                  >
                    <UploadIcon className="w-4 h-4" />
                    Pilih Gambar
                  </label>
                </div>

                {/* Upload Error */}
                {uploadError && (
                  <div className="mb-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-xs whitespace-pre-wrap">
                    {uploadError}
                  </div>
                )}

                {/* Upload Progress */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <div className="mb-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                {/* Upload Button */}
                {imageFile && (
                  <button
                    type="button"
                    onClick={handleImageUpload}
                    disabled={uploading}
                    className="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-400 text-sm font-medium"
                  >
                    {uploading ? 'Mengupload...' : 'Upload Gambar'}
                  </button>
                )}

                {bannerImageUrl && !uploadError && (
                  <div className="text-xs text-green-600 mt-2 p-2 bg-green-50 rounded border border-green-200">
                    ✓ Gambar siap digunakan
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="pt-4 border-t">
                <button
                  type="submit"
                  disabled={
                    formMode === 'create' 
                      ? !bannerImageUrl?.trim() || !!uploadError 
                      : !!uploadError
                  }
                  className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
                >
                  {formMode === 'create' ? (
                    !bannerImageUrl?.trim() 
                      ? '⚠️ Upload gambar dulu' 
                      : '✓ Buat'
                  ) : (
                    '✓ Update'
                  )}
                </button>
              </div>

              {formMode === 'edit' && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="w-full mt-2 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 font-medium"
                >
                  Batal
                </button>
              )}
            </form>
          </div>
        </div>

        {/* Table Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">Memuat data...</div>
            ) : configs.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                Belum ada hero section
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-100 border-b">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Urutan
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Title
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Preview
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Status
                        </th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                          Aksi
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {configs.map((config) => (
                        <tr key={config.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {config.displayOrder}
                          </td>
                          <td className="px-4 py-3 text-sm">
                            <div>
                              <div className="font-medium text-gray-900">
                                {config.title}
                              </div>
                              <div className="text-xs text-gray-500 line-clamp-1">
                                {config.description}
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="relative w-16 h-10 bg-gray-100 rounded overflow-hidden">
                              <Image
                                src={config.bannerImageUrl}
                                alt={config.title}
                                fill
                                className="object-cover"
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleStatusToggle(config.id, config.status)
                              }
                              className="inline-flex items-center gap-1"
                            >
                              {config.status === 1 ? (
                                <CheckCircleIcon className="w-5 h-5 text-green-500" />
                              ) : (
                                <XCircleIcon className="w-5 h-5 text-red-500" />
                              )}
                            </button>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEdit(config)}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                                title="Edit"
                              >
                                <PencilIcon className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(config.id)}
                                className="p-2 text-red-600 hover:bg-red-50 rounded"
                                title="Delete"
                              >
                                <TrashIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-between items-center px-4 py-3 border-t bg-gray-50">
                    <div className="text-sm text-gray-600">
                      Halaman {page} dari {totalPages}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setPage((p) => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                      >
                        Sebelumnya
                      </button>
                      <button
                        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="px-3 py-1 border rounded hover:bg-gray-100 disabled:opacity-50 text-sm"
                      >
                        Selanjutnya
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSectionManagement;
