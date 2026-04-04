'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface SportsGroupFormProps {
  initialData?: any;
  isEdit?: boolean;
}

interface DesaKelurahan {
  id: number;
  nama: string;
  kecamatan?: {
    id: number;
    nama: string;
  };
}

interface CabangOlahraga {
  id: number;
  nama: string;
}

const SportsGroupForm: React.FC<SportsGroupFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [cabangOlahragaList, setCabangOlahragaList] = useState<CabangOlahraga[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    desaKelurahanId: initialData?.desaKelurahanId || '',
    groupName: initialData?.groupName || '',
    leaderName: initialData?.leaderName || '',
    memberCount: initialData?.memberCount || 0,
    isVerified: initialData?.isVerified || false,
    decreeNumber: initialData?.decreeNumber || '',
    secretariatAddress: initialData?.secretariatAddress || '',
    year: initialData?.year || new Date().getFullYear(),
    sportId: initialData?.sportId || '',
  });

  // Fetch desa/kelurahan list
  useEffect(() => {
    if (authLoading) return;

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        const kecamatanId = user?.roleId === 3 && user.kecamatanId ? user.kecamatanId : undefined;
        const desaUrl = kecamatanId
          ? `/api/masterdata/desa-kelurahan?page=1&limit=1000&kecamatanId=${kecamatanId}`
          : '/api/masterdata/desa-kelurahan?page=1&limit=1000';

        // Fetch desa/kelurahan and cabang olahraga
        const [desaRes, caborRes] = await Promise.all([
          fetch(desaUrl),
          fetch('/api/masterdata/cabang-olahraga?page=1&limit=1000'),
        ]);

        if (desaRes.ok) {
          const desaData = await desaRes.json();
          setDesaKelurahanList(desaData.data || []);
        }

        if (caborRes.ok) {
          const caborData = await caborRes.json();
          setCabangOlahragaList(caborData.data || []);
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
    if (!formData.groupName) {
      setError('Nama Kelompok tidak boleh kosong');
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

    if (formData.memberCount < 0) {
      setError('Jumlah Anggota tidak boleh negatif');
      return;
    }

    if (formData.isVerified && !formData.decreeNumber) {
      setError('Nomor SK harus diisi jika status terverifikasi');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const url = isEdit ? `/api/masterdata/sports-group/${initialData?.id}` : '/api/masterdata/sports-group';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          desaKelurahanId: parseInt(formData.desaKelurahanId as string),
          groupName: formData.groupName.trim(),
          leaderName: formData.leaderName.trim() || null,
          memberCount: parseInt(formData.memberCount as string) || 0,
          isVerified: formData.isVerified,
          decreeNumber: formData.decreeNumber.trim() || null,
          secretariatAddress: formData.secretariatAddress.trim() || null,
          year: formData.year,
          sportId: formData.sportId ? parseInt(formData.sportId as string) : null,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data');
      }

      router.push('/admin/sports-group');
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
              {isEdit ? 'Edit Kelompok Olahraga' : 'Tambah Kelompok Olahraga Baru'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isEdit ? 'Ubah data kelompok olahraga' : 'Tambah data kelompok olahraga baru'}
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

        {/* Cabang Olahraga */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cabang Olahraga
          </label>
          <select
            value={formData.sportId}
            onChange={(e) => setFormData({ ...formData, sportId: e.target.value })}
            disabled={loading}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          >
            <option value="">-- Pilih Cabang Olahraga (Opsional) --</option>
            {cabangOlahragaList.map((cabor) => (
              <option key={cabor.id} value={cabor.id}>
                {cabor.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Group Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Kelompok <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.groupName}
            onChange={(e) => setFormData({ ...formData, groupName: e.target.value })}
            disabled={loading}
            placeholder="Masukkan nama kelompok olahraga"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            required
          />
        </div>

        {/* Leader Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nama Ketua
          </label>
          <input
            type="text"
            value={formData.leaderName}
            onChange={(e) => setFormData({ ...formData, leaderName: e.target.value })}
            disabled={loading}
            placeholder="Masukkan nama ketua kelompok"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* Member Count & Year */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Jumlah Anggota
            </label>
            <input
              type="number"
              value={formData.memberCount}
              onChange={(e) => setFormData({ ...formData, memberCount: parseInt(e.target.value) || 0 })}
              disabled={loading}
              min="0"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

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
        </div>

        {/* Decree Number - Only show if verified */}
        {formData.isVerified && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nomor SK (Surat Keputusan)
            </label>
            <input
              type="text"
              value={formData.decreeNumber}
              onChange={(e) => setFormData({ ...formData, decreeNumber: e.target.value })}
              disabled={loading}
              placeholder="Masukkan nomor SK"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Alamat Sekretariat
          </label>
          <textarea
            value={formData.secretariatAddress}
            onChange={(e) => setFormData({ ...formData, secretariatAddress: e.target.value })}
            disabled={loading}
            placeholder="Masukkan alamat sekretariat"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          />
        </div>

        {/* Verified Status */}
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
          <input
            type="checkbox"
            id="isVerified"
            checked={formData.isVerified}
            onChange={(e) => setFormData({ ...formData, isVerified: e.target.checked })}
            disabled={loading}
            className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label htmlFor="isVerified" className="text-sm font-medium text-gray-700 cursor-pointer">
            Terverifikasi
          </label>
        </div>
      </div>
    </form>
  );
};

export default SportsGroupForm;
