'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

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

interface UploadedPhoto {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl: string;
}

interface FacilityRecordInputFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const FacilityRecordInputForm: React.FC<FacilityRecordInputFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [prasaranaList, setPrasaranaList] = useState<Prasarana[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [photos, setPhotos] = useState<UploadedPhoto[]>(
    initialData?.photos?.map((photo: any) => ({
      id: `${photo.id}`,
      fileUrl: photo.fileUrl,
      fileName: photo.fileName || 'Existing Photo',
      fileSize: photo.fileSize || 0,
      mimeType: photo.mimeType || 'image/jpeg',
      previewUrl: photo.fileUrl,
    })) || []
  );
  const [uploadingPhotos, setUploadingPhotos] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    desaKelurahanId: initialData?.desaKelurahanId || '',
    prasaranaId: initialData?.prasaranaId || '',
    year: initialData?.year || new Date().getFullYear(),
    condition: initialData?.condition || '',
    ownershipStatus: initialData?.ownershipStatus || 'OWNED',
    address: initialData?.address || '',
    notes: initialData?.notes || '',
    isActive: initialData?.isActive ?? true,
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        desaKelurahanId: initialData.desaKelurahanId || '',
        prasaranaId: initialData.prasaranaId || '',
        year: initialData.year || new Date().getFullYear(),
        condition: initialData.condition || '',
        ownershipStatus: initialData.ownershipStatus || 'OWNED',
        address: initialData.address || '',
        notes: initialData.notes || '',
        isActive: initialData.isActive ?? true,
      });
      setPhotos(
        initialData.photos?.map((photo: any) => ({
          id: `${photo.id}`,
          fileUrl: photo.fileUrl,
          fileName: photo.fileName || 'Existing Photo',
          fileSize: photo.fileSize || 0,
          mimeType: photo.mimeType || 'image/jpeg',
          previewUrl: photo.fileUrl,
        })) || []
      );
    }
  }, [initialData]);

  // Fetch prasarana and desa/kelurahan lists
  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        // Fetch prasarana
        const prasaranaRes = await fetch('/api/masterdata/prasarana?page=1&limit=1000');
        if (prasaranaRes.ok) {
          const prasaranaData = await prasaranaRes.json();
          setPrasaranaList(prasaranaData.data || []);
        }

        // For kecamatan users (roleId === 3), filter desa by their kecamatan
        const desaUrl =
          user.roleId === 3 && user.kecamatanId
            ? `/api/masterdata/desa-kelurahan?page=1&limit=1000&kecamatanId=${user.kecamatanId}`
            : '/api/masterdata/desa-kelurahan?page=1&limit=1000';

        const desaRes = await fetch(desaUrl);
        if (desaRes.ok) {
          const desaData = await desaRes.json();
          setDesaKelurahanList(desaData.data || []);
        }
      } catch (err) {
        console.error('Error fetching options:', err);
        setError('Gagal memuat data dropdown');
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [authLoading, user, router]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.currentTarget;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.currentTarget as HTMLInputElement).checked : value,
    }));
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const files = Array.from(input.files || []);
    if (files.length === 0) return;

    setPhotoError(null);
    setUploadingPhotos(true);

    try {
      const uploads = await Promise.all(
        files.map(async file => {
          if (!file.type.startsWith('image/')) {
            throw new Error('Hanya file gambar yang boleh diupload');
          }
          if (file.size > 5 * 1024 * 1024) {
            throw new Error('Ukuran foto tidak boleh lebih dari 5MB');
          }

          const formDataUpload = new FormData();
          formDataUpload.append('file', file);

          const uploadResponse = await fetch('/api/upload', {
            method: 'POST',
            body: formDataUpload,
          });

          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json().catch(() => null);
            throw new Error(errorData?.error || 'Gagal mengupload foto');
          }

          const data = await uploadResponse.json();
          return {
            id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
            fileUrl: data.url,
            fileName: file.name,
            fileSize: file.size,
            mimeType: file.type,
            previewUrl: URL.createObjectURL(file),
          } as UploadedPhoto;
        })
      );

      setPhotos(prev => [...prev, ...uploads]);
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Gagal mengupload foto');
    } finally {
      setUploadingPhotos(false);
      input.value = '';
    }
  };

  const removePhoto = (id: string) => {
    setPhotos(prev => prev.filter(photo => photo.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.desaKelurahanId) {
      setError('Desa/Kelurahan harus dipilih');
      return;
    }
    if (!formData.prasaranaId) {
      setError('Jenis Prasarana harus dipilih');
      return;
    }
    if (!formData.condition) {
      setError('Kondisi harus dipilih');
      return;
    }
    if (!formData.address) {
      setError('Alamat harus diisi');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = isEdit ? `/api/staging/facility-record/${initialData.id}` : '/api/staging/facility-record';
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          desaKelurahanId: parseInt(formData.desaKelurahanId),
          prasaranaId: parseInt(formData.prasaranaId),
          year: parseInt(formData.year.toString()),
          photos: photos.map(photo => ({
            fileUrl: photo.fileUrl,
            fileName: photo.fileName,
            fileSize: photo.fileSize,
            mimeType: photo.mimeType,
          })),
          ...(isEdit && {
            actionType: 'UPDATE',
            referenceId: initialData.referenceId || initialData.id,
          }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan data');
      }

      setSuccess(isEdit ? 'Data fasilitas berhasil diperbarui dan disubmit ulang untuk verifikasi' : 'Data fasilitas berhasil disubmit untuk verifikasi');
      setTimeout(() => {
        router.push('/admin/data-keolahragaan/facility-record');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <button
              onClick={() => router.back()}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali
            </button>
            <h1 className="text-3xl font-bold text-gray-900">Input Data Fasilitas</h1>
            <p className="text-gray-600 mt-1">
              Silakan isi data fasilitas yang akan diverifikasi oleh admin
            </p>
          </div>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="grid grid-cols-2 gap-6">
            {/* Desa/Kelurahan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desa/Kelurahan <span className="text-red-500">*</span>
              </label>
              <select
                name="desaKelurahanId"
                value={formData.desaKelurahanId}
                onChange={handleInputChange}
                disabled={loadingOptions}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Pilih Desa/Kelurahan</option>
                {desaKelurahanList.map(desa => (
                  <option key={desa.id} value={desa.id}>
                    {desa.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Prasarana */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Prasarana <span className="text-red-500">*</span>
              </label>
              <select
                name="prasaranaId"
                value={formData.prasaranaId}
                onChange={handleInputChange}
                disabled={loadingOptions}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Pilih Jenis Prasarana</option>
                {prasaranaList.map(prasarana => (
                  <option key={prasarana.id} value={prasarana.id}>
                    {prasarana.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Tahun */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="2000"
                max={new Date().getFullYear()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Kondisi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kondisi <span className="text-red-500">*</span>
              </label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Kondisi</option>
                <option value="GOOD">Baik</option>
                <option value="FAIR">Sedang</option>
                <option value="POOR">Buruk</option>
              </select>
            </div>

            {/* Status Kepemilikan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Kepemilikan <span className="text-red-500">*</span>
              </label>
              <select
                name="ownershipStatus"
                value={formData.ownershipStatus}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="OWNED">Milik Pemerintah</option>
                <option value="RENTED">Disewa</option>
                <option value="SHARED">Bersama</option>
              </select>
            </div>

            {/* Status Aktif */}
            <div className="flex items-end">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleInputChange}
                  className="w-4 h-4 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Fasilitas Aktif</span>
              </label>
            </div>

            {/* Alamat */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Masukkan alamat lengkap fasilitas"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Catatan */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catatan Tambahan
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Masukkan catatan atau keterangan tambahan (opsional)"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lampiran Foto */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Lampiran Foto (opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handlePhotoSelect}
                disabled={uploadingPhotos}
                className="w-full text-sm text-gray-600 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0"
              />
              {photoError && (
                <p className="mt-2 text-sm text-red-600">{photoError}</p>
              )}
              {uploadingPhotos && (
                <p className="mt-2 text-sm text-gray-600">Mengunggah foto...</p>
              )}
              {photos.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {photos.map(photo => (
                    <div key={photo.id} className="relative border rounded-lg overflow-hidden">
                      <img
                        src={photo.previewUrl}
                        alt={photo.fileName}
                        className="h-28 w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removePhoto(photo.id)}
                        className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                      >
                        ✕
                      </button>
                      <div className="p-2 text-xs text-gray-700 bg-white">
                        <p className="truncate">{photo.fileName}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading || loadingOptions || uploadingPhotos}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  Submit Data
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FacilityRecordInputForm;
