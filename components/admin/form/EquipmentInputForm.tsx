'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface Sarana {
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

interface EquipmentInputFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const EquipmentInputForm: React.FC<EquipmentInputFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [saranaList, setSaranaList] = useState<Sarana[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    desaKelurahanId: initialData?.desaKelurahanId || '',
    saranaId: initialData?.saranaId || '',
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || '',
    isUsable: initialData?.isUsable ?? true,
    isGovernmentGrant: initialData?.isGovernmentGrant ?? false,
    year: initialData?.year || new Date().getFullYear(),
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        desaKelurahanId: initialData.desaKelurahanId || '',
        saranaId: initialData.saranaId || '',
        quantity: initialData.quantity || 0,
        unit: initialData.unit || '',
        isUsable: initialData.isUsable ?? true,
        isGovernmentGrant: initialData.isGovernmentGrant ?? false,
        year: initialData.year || new Date().getFullYear(),
      });
    }
  }, [initialData]);

  // Fetch sarana and desa/kelurahan lists
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        // Fetch sarana
        const saranaRes = await fetch('/api/masterdata/sarana?page=1&limit=1000');
        if (saranaRes.ok) {
          const saranaData = await saranaRes.json();
          setSaranaList(saranaData.data || []);
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
    const target = e.target;
    const { name, value, type } = target;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (target as HTMLInputElement).checked :
             type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.desaKelurahanId) {
      setError('Desa/Kelurahan harus dipilih');
      return;
    }
    if (!formData.saranaId) {
      setError('Jenis Sarana harus dipilih');
      return;
    }
    if (formData.quantity <= 0) {
      setError('Jumlah harus lebih dari 0');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = isEdit ? `/api/staging/equipment/${initialData.id}` : '/api/staging/equipment';
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          desaKelurahanId: parseInt(formData.desaKelurahanId),
          saranaId: parseInt(formData.saranaId),
          year: parseInt(formData.year.toString()),
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

      setSuccess(isEdit ? 'Data peralatan berhasil diperbarui dan disubmit ulang untuk verifikasi' : 'Data peralatan berhasil disubmit untuk verifikasi');
      setTimeout(() => {
        router.push('/admin/data-keolahragaan/equipment');
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
            <h1 className="text-3xl font-bold text-gray-900">Input Data Peralatan</h1>
            <p className="text-gray-600 mt-1">
              Silakan isi data peralatan yang akan diverifikasi oleh admin
            </p>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {success && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <p className="text-green-800">{success}</p>
          </div>
        )}

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Desa/Kelurahan */}
            <div>
              <label htmlFor="desaKelurahanId" className="block text-sm font-medium text-gray-700 mb-2">
                Desa/Kelurahan <span className="text-red-500">*</span>
              </label>
              <select
                id="desaKelurahanId"
                name="desaKelurahanId"
                value={formData.desaKelurahanId}
                onChange={handleInputChange}
                disabled={loadingOptions}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                required
              >
                <option value="">
                  {loadingOptions ? 'Memuat...' : 'Pilih Desa/Kelurahan'}
                </option>
                {desaKelurahanList.map((desa) => (
                  <option key={desa.id} value={desa.id}>
                    {desa.nama} - {desa.kecamatan?.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Sarana */}
            <div>
              <label htmlFor="saranaId" className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Sarana <span className="text-red-500">*</span>
              </label>
              <select
                id="saranaId"
                name="saranaId"
                value={formData.saranaId}
                onChange={handleInputChange}
                disabled={loadingOptions}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                required
              >
                <option value="">
                  {loadingOptions ? 'Memuat...' : 'Pilih Jenis Sarana'}
                </option>
                {saranaList.map((sarana) => (
                  <option key={sarana.id} value={sarana.id}>
                    {sarana.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  min="1"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                  Satuan
                </label>
                <input
                  type="text"
                  id="unit"
                  name="unit"
                  value={formData.unit}
                  onChange={handleInputChange}
                  placeholder="Contoh: Buah, Set, Lembar"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Year */}
            <div>
              <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-2">
                Tahun
              </label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                min="2000"
                max={new Date().getFullYear() + 1}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isUsable"
                  name="isUsable"
                  checked={formData.isUsable}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isUsable" className="ml-2 block text-sm text-gray-900">
                  Masih layak pakai
                </label>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isGovernmentGrant"
                  name="isGovernmentGrant"
                  checked={formData.isGovernmentGrant}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="isGovernmentGrant" className="ml-2 block text-sm text-gray-900">
                  Hibah dari pemerintah
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
              >
                {loading ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Simpan & Submit
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EquipmentInputForm;