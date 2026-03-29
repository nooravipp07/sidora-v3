'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface EquipmentFormProps {
  initialData?: any;
  isEdit?: boolean;
}

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

const EquipmentForm: React.FC<EquipmentFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saranaList, setSaranaList] = useState<Sarana[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    desaKelurahanId: initialData?.desaKelurahanId || '',
    saranaId: initialData?.saranaId || '',
    quantity: initialData?.quantity || 0,
    unit: initialData?.unit || '',
    isUsable: initialData?.isUsable !== false,
    isGovernmentGrant: initialData?.isGovernmentGrant || false,
    year: initialData?.year || new Date().getFullYear(),
  });

  // Fetch sarana and desa/kelurahan lists
  useEffect(() => {
    if (authLoading) return;

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        // Fetch sarana
        const saranaRes = await fetch('/api/masterdata/sarana?page=1&limit=1000');
        if (saranaRes.ok) {
          const saranaData = await saranaRes.json();
          setSaranaList(saranaData.data || []);
        }

        // Fetch desa/kelurahan by kecamatan for role 3 user, otherwise all
        const kecamatanId = user?.roleId === 3 && user.kecamatanId ? user.kecamatanId : undefined;
        const desaUrl = kecamatanId
          ? `/api/masterdata/desa-kelurahan?page=1&limit=1000&kecamatanId=${kecamatanId}`
          : '/api/masterdata/desa-kelurahan?page=1&limit=1000';

        const desaRes = await fetch(desaUrl);

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
  }, [authLoading, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.saranaId) {
      setError('Perlengkapan tidak boleh kosong');
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

    if (formData.quantity < 0) {
      setError('Jumlah tidak boleh negatif');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = isEdit ? `/api/masterdata/equipment/${initialData?.id}` : '/api/masterdata/equipment';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desaKelurahanId: parseInt(formData.desaKelurahanId as string),
          saranaId: parseInt(formData.saranaId as string),
          quantity: parseInt(formData.quantity as string) || 0,
          unit: formData.unit.trim() || null,
          isUsable: formData.isUsable,
          isGovernmentGrant: formData.isGovernmentGrant,
          year: formData.year,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data');
      }

      router.push('/admin/equipment');
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

  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
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
              {isEdit ? 'Edit Perlengkapan' : 'Tambah Perlengkapan Baru'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isEdit ? 'Ubah data perlengkapan olahraga' : 'Tambah data perlengkapan olahraga baru'}
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
        {/* Sarana Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Jenis Perlengkapan <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.saranaId}
            onChange={(e) => setFormData({ ...formData, saranaId: e.target.value })}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">-- Pilih Perlengkapan --</option>
            {saranaList.map((sarana) => (
              <option key={sarana.id} value={sarana.id}>
                {sarana.nama}
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

        {/* Quantity & Unit */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              disabled={loading}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Satuan
            </label>
            <input
              type="text"
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              disabled={loading}
              placeholder="Misal: Buah, Set, Pasang, dll"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
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

        {/* Status Kegunaan */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="isUsable"
            checked={formData.isUsable}
            onChange={(e) => setFormData({ ...formData, isUsable: e.target.checked })}
            disabled={loading}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isUsable" className="text-sm font-medium text-gray-700 cursor-pointer">
            Dapat Digunakan
          </label>
        </div>

        {/* Government Grant */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="isGovernmentGrant"
            checked={formData.isGovernmentGrant}
            onChange={(e) => setFormData({ ...formData, isGovernmentGrant: e.target.checked })}
            disabled={loading}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isGovernmentGrant" className="text-sm font-medium text-gray-700 cursor-pointer">
            Hibah Pemerintah
          </label>
        </div>
      </div>
    </form>
  );
};

export default EquipmentForm;
