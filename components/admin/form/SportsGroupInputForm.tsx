'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface CabangOlahraga {
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

interface SportsGroupInputFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const SportsGroupInputForm: React.FC<SportsGroupInputFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [cabangOlahragaList, setCabangOlahragaList] = useState<CabangOlahraga[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    desaKelurahanId: initialData?.desaKelurahanId || '',
    groupName: initialData?.groupName || '',
    leaderName: initialData?.leaderName || '',
    memberCount: initialData?.memberCount || 0,
    isVerified: initialData?.isVerified ?? false,
    decreeNumber: initialData?.decreeNumber || '',
    secretariatAddress: initialData?.secretariatAddress || '',
    year: initialData?.year || new Date().getFullYear(),
    sportId: initialData?.sportId || '',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        desaKelurahanId: initialData.desaKelurahanId || '',
        groupName: initialData.groupName || '',
        leaderName: initialData.leaderName || '',
        memberCount: initialData.memberCount || 0,
        isVerified: initialData.isVerified ?? false,
        decreeNumber: initialData.decreeNumber || '',
        secretariatAddress: initialData.secretariatAddress || '',
        year: initialData.year || new Date().getFullYear(),
        sportId: initialData.sportId || '',
      });
    }
  }, [initialData]);

  // Fetch cabang olahraga and desa/kelurahan lists
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        // Fetch cabang olahraga
        const cabangRes = await fetch('/api/masterdata/cabang-olahraga?page=1&limit=1000');
        if (cabangRes.ok) {
          const cabangData = await cabangRes.json();
          setCabangOlahragaList(cabangData.data || []);
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

    if (!formData.groupName || formData.groupName.trim() === '') {
      setError('Nama grup harus diisi');
      return;
    }

    if (formData.memberCount < 0) {
      setError('Jumlah anggota tidak boleh negatif');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = isEdit ? `/api/staging/sports-group/${initialData.id}` : '/api/staging/sports-group';
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          desaKelurahanId: parseInt(formData.desaKelurahanId),
          sportId: formData.sportId ? parseInt(formData.sportId) : undefined,
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

      setSuccess(isEdit ? 'Data grup olahraga berhasil diperbarui dan disubmit ulang untuk verifikasi' : 'Data grup olahraga berhasil disubmit untuk verifikasi');
      setTimeout(() => {
        router.push('/admin/data-keolahragaan/sports-group');
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
            <h1 className="text-3xl font-bold text-gray-900">Input Data Grup Olahraga</h1>
            <p className="text-gray-600 mt-1">
              Silakan isi data grup olahraga yang akan diverifikasi oleh admin
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

            {/* Group Name */}
            <div>
              <label htmlFor="groupName" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Grup <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="groupName"
                name="groupName"
                value={formData.groupName}
                onChange={handleInputChange}
                placeholder="Masukkan nama grup olahraga"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {/* Leader Name */}
            <div>
              <label htmlFor="leaderName" className="block text-sm font-medium text-gray-700 mb-2">
                Nama Ketua
              </label>
              <input
                type="text"
                id="leaderName"
                name="leaderName"
                value={formData.leaderName}
                onChange={handleInputChange}
                placeholder="Masukkan nama ketua grup"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Member Count and Sport */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="memberCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Anggota
                </label>
                <input
                  type="number"
                  id="memberCount"
                  name="memberCount"
                  value={formData.memberCount}
                  onChange={handleInputChange}
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="sportId" className="block text-sm font-medium text-gray-700 mb-2">
                  Cabang Olahraga
                </label>
                <select
                  id="sportId"
                  name="sportId"
                  value={formData.sportId}
                  onChange={handleInputChange}
                  disabled={loadingOptions}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="">
                    {loadingOptions ? 'Memuat...' : 'Pilih Cabang Olahraga'}
                  </option>
                  {cabangOlahragaList.map((sport) => (
                    <option key={sport.id} value={sport.id}>
                      {sport.nama}
                    </option>
                  ))}
                </select>
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

            {/* Decree Number */}
            <div>
              <label htmlFor="decreeNumber" className="block text-sm font-medium text-gray-700 mb-2">
                Nomor SK
              </label>
              <input
                type="text"
                id="decreeNumber"
                name="decreeNumber"
                value={formData.decreeNumber}
                onChange={handleInputChange}
                placeholder="Masukkan nomor surat keputusan"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Secretariat Address */}
            <div>
              <label htmlFor="secretariatAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Sekretariat
              </label>
              <textarea
                id="secretariatAddress"
                name="secretariatAddress"
                value={formData.secretariatAddress}
                onChange={handleInputChange}
                rows={3}
                placeholder="Masukkan alamat sekretariat grup"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Checkbox */}
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isVerified"
                name="isVerified"
                checked={formData.isVerified}
                onChange={handleInputChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="isVerified" className="ml-2 block text-sm text-gray-900">
                Sudah terverifikasi
              </label>
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

export default SportsGroupInputForm;