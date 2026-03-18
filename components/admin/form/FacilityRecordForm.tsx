'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader, Trash2, Plus } from 'lucide-react';
import ImageUpload from '@/components/admin/form/ImageUpload';
import { FacilityRecord } from '@/types/masterdata';

interface FacilityRecordFormProps {
  initialData?: FacilityRecord;
  isEdit?: boolean;
}

interface Prasarana {
  id: number;
  nama: string;
}

interface DesaKelurahan {
  id: number;
  nama: string;
  kecamatan?: {
    id: number;
    nama: string;
  };
}

interface FacilityRecordPhoto {
  id: number;
  fileUrl: string;
  fileName?: string;
  description?: string;
  uploadedAt: string;
}

const FacilityRecordForm: React.FC<FacilityRecordFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [prasaranaList, setPrasaranaList] = useState<Prasarana[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [photos, setPhotos] = useState<FacilityRecordPhoto[]>([]);
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoDescription, setNewPhotoDescription] = useState('');
  const [loadingPhotos, setLoadingPhotos] = useState(false);

  const [formData, setFormData] = useState({
    desaKelurahanId: initialData?.desaKelurahanId || '',
    prasaranaId: initialData?.prasaranaId || '',
    year: initialData?.year || new Date().getFullYear(),
    condition: initialData?.condition || '',
    ownershipStatus: initialData?.ownershipStatus || 'OWNED',
    address: initialData?.address || '',
    notes: initialData?.notes || '',
    isActive: initialData?.isActive !== false,
  });

  // Fetch prasarana and desa/kelurahan lists
  useEffect(() => {
    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);
        
        // Fetch prasarana
        const prasaranaRes = await fetch('/api/masterdata/prasarana?page=1&limit=1000');
        if (prasaranaRes.ok) {
          const prasaranaData = await prasaranaRes.json();
          setPrasaranaList(prasaranaData.data || []);
        }

        // Fetch desa/kelurahan
        const desaRes = await fetch('/api/masterdata/desa-kelurahan?page=1&limit=1000');
        if (desaRes.ok) {
          const desaData = await desaRes.json();
          setDesaKelurahanList(desaData.data || []);
        }
      } catch (err) {
        console.error('Error fetching options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, []);

  // Fetch photos when editing
  useEffect(() => {
    if (isEdit && initialData?.id) {
      const fetchPhotos = async () => {
        try {
          const response = await fetch(`/api/facility-records/${initialData.id}/photos`);
          if (response.ok) {
            const data = await response.json();
            setPhotos(data || []);
          }
        } catch (err) {
          console.error('Error fetching photos:', err);
        }
      };

      fetchPhotos();
    }
  }, [isEdit, initialData?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.prasaranaId) {
      setError('Prasarana tidak boleh kosong');
      return;
    }

    if (!formData.desaKelurahanId) {
      setError('Desa/Kelurahan tidak boleh kosong');
      return;
    }

    if (!formData.year) {
      setError('Tahun tidak boleh kosong');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = isEdit ? `/api/facility-records/${initialData?.id}` : '/api/facility-records';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desaKelurahanId: parseInt(formData.desaKelurahanId as string),
          prasaranaId: parseInt(formData.prasaranaId as string),
          year: formData.year,
          condition: formData.condition.trim() || null,
          ownershipStatus: formData.ownershipStatus || null,
          address: formData.address.trim() || null,
          notes: formData.notes.trim() || null,
          isActive: formData.isActive,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save facility record');
      }

      router.push('/admin/prasarana');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - i);

  const handleAddPhoto = async () => {
    if (!newPhotoUrl.trim()) {
      setError('Foto URL tidak boleh kosong');
      return;
    }

    try {
      setLoadingPhotos(true);
      const response = await fetch(`/api/facility-records/${initialData?.id}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileUrl: newPhotoUrl,
          description: newPhotoDescription || null,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add photo');
      }

      const newPhoto = await response.json();
      setPhotos([newPhoto, ...photos]);
      setNewPhotoUrl('');
      setNewPhotoDescription('');
      setSuccess('Foto berhasil ditambahkan');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menambah foto');
      console.error('Error:', err);
    } finally {
      setLoadingPhotos(false);
    }
  };

  const handleRemovePhoto = async (photoId: number) => {
    if (!confirm('Yakin ingin menghapus foto ini?')) return;

    try {
      const response = await fetch(`/api/facility-records/${initialData?.id}/photos/${photoId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to remove photo');
      }

      setPhotos(photos.filter(photo => photo.id !== photoId));
      setSuccess('Foto berhasil dihapus');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus foto');
      console.error('Error:', err);
    }
  };

  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <>
    <form onSubmit={handleSubmit}>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Edit Prasarana' : 'Tambah Prasarana Baru'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isEdit ? 'Ubah data prasarana' : 'Tambah data prasarana baru'}
            </p>
          </div>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          {loading && <Loader className="w-4 h-4 animate-spin" />}
          {loading ? 'Menyimpan...' : isEdit ? 'Simpan Perubahan' : 'Tambah Data'}
        </button>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm p-6 space-y-6">
        {/* Prasarana Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Prasarana <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.prasaranaId}
            onChange={(e) => setFormData({ ...formData, prasaranaId: e.target.value })}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">-- Pilih Prasarana --</option>
            {prasaranaList.map((prasarana) => (
              <option key={prasarana.id} value={prasarana.id}>
                {prasarana.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Desa/Kelurahan Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Desa/Kelurahan <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.desaKelurahanId}
            onChange={(e) => setFormData({ ...formData, desaKelurahanId: e.target.value })}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">-- Pilih Desa/Kelurahan --</option>
            {desaKelurahanList.map((desa) => (
              <option key={desa.id} value={desa.id}>
                {desa.kecamatan?.nama} - {desa.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Year Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tahun <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            {years.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* Condition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Kondisi
          </label>
          <select
            value={formData.condition}
            onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">-- Pilih Kondisi --</option>
            <option value="Baik">Baik</option>
            <option value="Cukup">Cukup</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
          </select>
        </div>

        {/* Ownership Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Status Kepemilikan
          </label>
          <select
            value={formData.ownershipStatus}
            onChange={(e) => setFormData({ ...formData, ownershipStatus: e.target.value })}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="OWNED">Milik Sendiri</option>
            <option value="RENTED">Sewa</option>
            <option value="SHARED">Bersama</option>
          </select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Catatan
          </label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            disabled={loading}
            rows={4}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            placeholder="Masukkan catatan tambahan..."
          />
        </div>

        {/* Active Status */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="isActive"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
            disabled={loading}
            className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-gray-700 cursor-pointer">
            Aktif
          </label>
        </div>
      </div>
    </form>

    {/* Photo Management Section - only show if editing */}
    {isEdit && initialData && (
      <div className="mt-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Kelola Foto</h2>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
              {success}
            </div>
          )}

          {/* Add New Photo */}
          <div className="mb-8 pb-6 border-b">
            <h3 className="text-lg font-medium text-gray-700 mb-4">Tambah Foto Baru</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foto
                </label>
                <ImageUpload
                  value={newPhotoUrl}
                  onChange={setNewPhotoUrl}
                  disabled={loadingPhotos}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Keterangan
                </label>
                <input
                  type="text"
                  value={newPhotoDescription}
                  onChange={(e) => setNewPhotoDescription(e.target.value)}
                  placeholder="Keterangan foto (opsional)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="button"
                onClick={handleAddPhoto}
                disabled={!newPhotoUrl.trim() || loadingPhotos}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Plus className="w-4 h-4" />
                Tambah Foto
              </button>
            </div>
          </div>

          {/* Photos List */}
          {photos.length > 0 ? (
            <div>
              <h3 className="text-lg font-medium text-gray-700 mb-4">
                Foto ({photos.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {photos.map(photo => (
                  <div key={photo.id} className="relative group border rounded-lg overflow-hidden bg-gray-100">
                    <img
                      src={photo.fileUrl}
                      alt={photo.description}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-3">
                      {photo.description && (
                        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{photo.description}</p>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(photo.id)}
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
            <p className="text-center text-gray-500 py-8">Belum ada foto untuk prasarana ini</p>
          )}
        </div>
      </div>
    )}
    </>
  );
};

export default FacilityRecordForm;
