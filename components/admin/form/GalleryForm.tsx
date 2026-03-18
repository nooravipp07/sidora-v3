'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader, Trash2, Plus } from 'lucide-react';
import ImageUpload from '@/components/admin/form/ImageUpload';
import { Gallery, GalleryItem } from '@/types/gallery';

interface GalleryFormProps {
  initialData?: Gallery;
  isEdit?: boolean;
}

const GalleryForm: React.FC<GalleryFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    description: initialData?.description || '',
  });
  const [items, setItems] = useState<GalleryItem[]>(initialData?.items || []);
  const [newItemCaption, setNewItemCaption] = useState('');
  const [newItemImage, setNewItemImage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.title.trim()) {
      setError('Judul galeri tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const url = isEdit ? `/api/gallery/${initialData?.id}` : '/api/gallery';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: formData.title.trim(),
          description: formData.description.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to save gallery');
      }

      const result = await response.json();
      router.push('/admin/kegiatan');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan galeri');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItemImage.trim()) {
      setError('Pilih gambar terlebih dahulu');
      return;
    }

    try {
      const response = await fetch('/api/gallery/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          galleryId: initialData?.id,
          imageUrl: newItemImage,
          caption: newItemCaption || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add item');
      }

      const newItem = await response.json();
      setItems([newItem, ...items]);
      setNewItemImage('');
      setNewItemCaption('');
      setSuccess('Gambar berhasil ditambahkan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah gambar');
      console.error('Error:', err);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (!confirm('Yakin ingin menghapus gambar ini?')) return;

    try {
      const response = await fetch(`/api/gallery/items/${itemId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove item');
      }

      setItems(items.filter(item => item.id !== itemId));
      setSuccess('Gambar berhasil dihapus');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus gambar');
      console.error('Error:', err);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isEdit ? 'Edit Galeri' : 'Buat Galeri Baru'}
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                {isEdit ? 'Ubah informasi galeri' : 'Buat galeri dengan gambar-gambar menarik'}
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader className="w-4 h-4 animate-spin" />}
            {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Galeri'}
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
            {success}
          </div>
        )}

        <div className="bg-white rounded-lg space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Judul Galeri <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deskripsi
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              disabled={loading}
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => router.back()}
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Buat Galeri'}
            </button>
          </div>
        </div>
      </form>

      {/* Gallery Items Section - only show if editing */}
      {isEdit && initialData && (
        <div className="mt-8">
          <div className="bg-white">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Kelola Gambar</h2>

            {/* Add New Item */}
            <div className="mb-8 pb-6 border-b">
              <h3 className="text-lg font-medium text-gray-700 mb-4">Tambah Gambar Baru</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gambar
                  </label>
                  <ImageUpload
                    value={newItemImage}
                    onChange={setNewItemImage}
                    disabled={false}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Keterangan
                  </label>
                  <input
                    type="text"
                    value={newItemCaption}
                    onChange={(e) => setNewItemCaption(e.target.value)}
                    placeholder="Keterangan gambar (opsional)"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddItem}
                  disabled={!newItemImage.trim()}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Gambar
                </button>
              </div>
            </div>

            {/* Items List */}
            {items.length > 0 ? (
              <div>
                <h3 className="text-lg font-medium text-gray-700 mb-4">
                  Gambar ({items.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {items.map(item => (
                    <div key={item.id} className="relative group border rounded-lg overflow-hidden bg-gray-100">
                      <img
                        src={item.imageUrl}
                        alt={item.caption}
                        className="w-full h-40 object-cover"
                      />
                      <div className="p-3">
                        {item.caption && (
                          <p className="text-sm text-gray-600 mb-2 line-clamp-2">{item.caption}</p>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveItem(item.id)}
                          className="w-full flex items-center justify-center gap-2 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">Belum ada gambar dalam galeri ini</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryForm;
