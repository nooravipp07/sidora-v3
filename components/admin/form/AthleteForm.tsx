'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader, Plus, Trash2, Upload, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { getImageUrl } from '@/lib/image-utils';
import { useAuth } from '@/lib/auth/useAuth';

interface AthleteFormProps {
  initialData?: any;
  isEdit?: boolean;
}

interface Achievement {
  id?: number;
  achievementName: string;
  category: string;
  medal: string;
  year: number;
}

interface DesaKelurahan {
  id: number;
  nama: string;
  kecamatan?: {
    id: number;
    nama: string;
  };
}

const AthleteForm: React.FC<AthleteFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [sportList, setSportList] = useState<any[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);

  const [formData, setFormData] = useState({
    nationalId: initialData?.nationalId || '',
    fullName: initialData?.fullName || '',
    birthPlace: initialData?.birthPlace || '',
    birthDate: initialData?.birthDate ? initialData.birthDate.slice(0, 10) : '',
    gender: initialData?.gender || '',
    desaKelurahanId: initialData?.desaKelurahanId || '',
    fullAddress: initialData?.fullAddress || '',
    organization: initialData?.organization || '',
    category: initialData?.category || '',
    status: initialData?.status || 'aktif',
    sportId: initialData?.sportId || '',
    photoUrl: initialData?.photoUrl || '',
  });

  const [achievements, setAchievements] = useState<Achievement[]>(initialData?.achievements || []);
  const [newAchievement, setNewAchievement] = useState<Achievement>({
    achievementName: '',
    category: '',
    medal: '',
    year: new Date().getFullYear(),
  });
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [duplicateNik, setDuplicateNik] = useState<{ nik: string; name: string } | null>(null);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  // Fetch dropdown options
  useEffect(() => {
    if (authLoading) return;

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        const kecamatanId = user?.roleId === 3 && user.kecamatanId ? user.kecamatanId : undefined;
        const desaUrl = kecamatanId
          ? `/api/masterdata/desa-kelurahan?page=1&limit=1000&kecamatanId=${kecamatanId}`
          : '/api/masterdata/desa-kelurahan?page=1&limit=1000';

        const [desaRes, sportRes] = await Promise.all([
          fetch(desaUrl),
          fetch('/api/masterdata/cabang-olahraga?page=1&limit=1000'),
        ]);

        if (desaRes.ok) {
          const desaData = await desaRes.json();
          setDesaKelurahanList(desaData.data || []);
        }

        if (sportRes.ok) {
          const sportData = await sportRes.json();
          setSportList(sportData.data || []);
        }
      } catch (err) {
        console.error('Error fetching options:', err);
      } finally {
        setLoadingOptions(false);
      }
    };

    fetchOptions();
  }, [authLoading, user]);

  const handleAddAchievement = () => {
    if (!newAchievement.achievementName.trim()) {
      setError('Nama Prestasi harus diisi');
      return;
    }

    if (!newAchievement.year) {
      setError('Tahun Prestasi harus diisi');
      return;
    }

    setAchievements([...achievements, { ...newAchievement, id: Date.now() }]);
    setNewAchievement({
      achievementName: '',
      category: '',
      medal: '',
      year: currentYear,
    });
    setError(null);
  };

  const handleRemoveAchievement = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(true);
    setError(null);

    try {
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      if (!response.ok) {
        let errorMessage = 'Gagal mengupload foto';
        
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorData.details || errorMessage;
          } else {
            const text = await response.text();
            console.error('[AthleteForm] Non-JSON error response:', text.substring(0, 200));
            errorMessage = `Upload gagal (${response.status}). Server tidak merespons dengan benar.`;
          }
        } catch (parseErr) {
          console.error('[AthleteForm] Error parsing error response:', parseErr);
          errorMessage = `Upload gagal (${response.status})`;
        }
        
        throw new Error(errorMessage);
      }

      let data;
      try {
        data = await response.json();
      } catch (parseErr) {
        console.error('[AthleteForm] Error parsing success response:', parseErr);
        throw new Error('Server mengembalikan respons yang tidak valid');
      }

      if (!data.url) {
        throw new Error('Server tidak mengembalikan URL foto');
      }

      setFormData({ ...formData, photoUrl: data.url });
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Gagal mengupload foto (kesalahan tidak diketahui)';
      setError(errorMsg);
      console.error('[AthleteForm] Error uploading photo:', err);
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleRemovePhoto = () => {
    setFormData({ ...formData, photoUrl: '' });
  };

  const checkDuplicateNik = async (nik: string) => {
    if (!nik.trim()) {
      setDuplicateNik(null);
      return;
    }

    try {
      // If editing, skip check for current athlete's NIK
      if (isEdit && initialData?.nationalId === nik) {
        setDuplicateNik(null);
        return;
      }

      const response = await fetch(`/api/masterdata/athlete?search=${nik}`);
      if (response.ok) {
        const data = await response.json();
        const existingAthlete = data.data?.find((a: any) => a.nationalId === nik.trim());

        if (existingAthlete) {
          setDuplicateNik({ nik: existingAthlete.nationalId, name: existingAthlete.fullName });
          
          // Show SweetAlert
          Swal.fire({
            icon: 'warning',
            title: 'NIK Sudah Ada',
            html: `Atlet dengan NIK <strong>"${existingAthlete.nationalId}"</strong> sudah pernah ditambahkan dengan nama <strong>"${existingAthlete.fullName}"</strong>`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#3b82f6',
          });
        } else {
          setDuplicateNik(null);
        }
      }
    } catch (err) {
      console.error('Error checking NIK:', err);
      setDuplicateNik(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Check for duplicate NIK
    if (duplicateNik && !isEdit) {
      setError(`Atlet dengan NIK "${duplicateNik.nik}" sudah terdaftar`);
      return;
    }

    // Validation
    if (!formData.nationalId.trim()) {
      setError('NIK harus diisi');
      return;
    }

    if (!formData.fullName.trim()) {
      setError('Nama Lengkap harus diisi');
      return;
    }

    if (!formData.status) {
      setError('Status atlet harus dipilih');
      return;
    }

    if (!formData.desaKelurahanId) {
      setError('Desa/Kelurahan harus dipilih');
      return;
    }

    setLoading(true);

    try {
      const url = isEdit
        ? `/api/masterdata/athlete/${initialData?.id}`
        : '/api/masterdata/athlete';
      const method = isEdit ? 'PUT' : 'POST';

      // Filter achievements - remove id field as it's only used for UI identification
      // Only include fields needed for creation/update
      const achievementsData = achievements.map(achievement => {
        const { id, ...rest } = achievement;
        return rest;
      });

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nationalId: formData.nationalId.trim(),
          fullName: formData.fullName.trim(),
          birthPlace: formData.birthPlace.trim() || null,
          birthDate: formData.birthDate ? new Date(formData.birthDate) : null,
          gender: formData.gender || null,
          desaKelurahanId: parseInt(formData.desaKelurahanId as string),
          fullAddress: formData.fullAddress.trim() || null,
          organization: formData.organization.trim() || null,
          category: formData.category.trim() || null,
          sportId: formData.sportId ? parseInt(formData.sportId as string) : null,
          photoUrl: formData.photoUrl || null,
          status: formData.status || 'aktif',
          achievements: achievementsData,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal menyimpan data');
      }

      router.push('/admin/athlete');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan data');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loadingOptions) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const medals = ['Emas', 'Perak', 'Perunggu'];
  const achievementCategories = ['Daerah', 'Nasional', 'Internasional'];

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
              {isEdit ? 'Edit Data Atlet' : 'Tambah Data Atlet Baru'}
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              {isEdit ? 'Ubah data atlet dan prestasi' : 'Tambah data atlet baru beserta prestasi'}
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

      {/* Data Atlet Section */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Atlet</h2>

        <div className="space-y-6">
          {/* NIK & Nama */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                NIK (Nomor Identitas Kependudukan) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nationalId}
                onChange={(e) => setFormData({ ...formData, nationalId: e.target.value })}
                onBlur={(e) => checkDuplicateNik(e.target.value)}
                disabled={loading}
                placeholder="Masukkan NIK"
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 ${
                  duplicateNik ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              />
              {duplicateNik && !isEdit && (
                <p className="mt-2 text-sm text-red-600">
                  NIK sudah terdaftar dengan nama: <strong>{duplicateNik.name}</strong>
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                disabled={loading}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
              />
            </div>
          </div>

          {/* Tempat & Tanggal Lahir */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempat Lahir
              </label>
              <input
                type="text"
                value={formData.birthPlace}
                onChange={(e) => setFormData({ ...formData, birthPlace: e.target.value })}
                disabled={loading}
                placeholder="Masukkan tempat lahir"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir
              </label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              />
            </div>
          </div>

          {/* Jenis Kelamin & Desa */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">-- Pilih Jenis Kelamin --</option>
                <option value="L">Laki-laki</option>
                <option value="P">Perempuan</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desa/Kelurahan <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.desaKelurahanId}
                onChange={(e) => setFormData({ ...formData, desaKelurahanId: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
                required
              >
                <option value="">-- Pilih Desa/Kelurahan --</option>
                {desaKelurahanList.map((desa) => (
                  <option key={desa.id} value={desa.id}>
                    {desa.kecamatan?.nama} - {desa.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Alamat Lengkap */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alamat Lengkap
            </label>
            <textarea
              value={formData.fullAddress}
              onChange={(e) => setFormData({ ...formData, fullAddress: e.target.value })}
              disabled={loading}
              placeholder="Masukkan alamat lengkap"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          {/* Organisasi & Cabang Olahraga */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisasi
              </label>
              <select
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">-- Pilih Organisasi --</option>
                <option value="KONI">KONI</option>
                <option value="NPCI">NPCI</option>
              </select>
            </div>

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
                <option value="">-- Pilih Cabang Olahraga --</option>
                {sportList.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.nama}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Kategori */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Kategori
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">-- Pilih Kategori --</option>
              <option value="ATLET">ATLET</option>
              <option value="PELATIH">PELATIH</option>
              <option value="WASIT">WASIT - JURI</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status Atlet
            </label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="aktif">Aktif</option>
              <option value="non-aktif">Non-Aktif</option>
            </select>
          </div>


          {/* Photo Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Foto Atlet
            </label>
            <div className="space-y-3">
              {formData.photoUrl ? (
                <div className="relative w-32 h-40">
                  <img
                    src={getImageUrl(formData.photoUrl)}
                    alt="Foto Atlet"
                    className="w-full h-full object-cover rounded-lg border border-gray-300"
                    onError={(e) => {
                      e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 240"%3E%3Crect fill="%23ddd" width="200" height="240"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999" font-size="14"%3ENot Found%3C/text%3E%3C/svg%3E';
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    disabled={loading || uploadingPhoto}
                    className="absolute top-1 right-1 p-1 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-400 transition-colors">
                  <label className="flex flex-col items-center justify-center cursor-pointer">
                    <Upload className="w-8 h-8 text-gray-400 mb-2" />
                    <span className="text-sm font-medium text-gray-700">Upload Foto</span>
                    <span className="text-xs text-gray-500 mt-1">JPG, PNG (max 5MB)</span>
                    <input
                      type="file"
                      accept="image/jpeg,image/png"
                      onChange={handlePhotoUpload}
                      disabled={loading || uploadingPhoto}
                      className="hidden"
                    />
                  </label>
                </div>
              )}
              {uploadingPhoto && (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  Mengupload foto...
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Prestasi/Achievements Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Data Prestasi</h2>

        {/* Achievements List */}
        {achievements.length > 0 && (
          <div className="mb-6 space-y-2">
            {achievements.map((achievement, index) => (
              <div key={achievement.id || index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{achievement.achievementName}</p>
                  <div className="flex gap-4 text-sm text-gray-600 mt-1">
                    {achievement.category && <span>Kategori: {achievement.category}</span>}
                    {achievement.medal && <span>Medali: {achievement.medal}</span>}
                    {achievement.year && <span>Tahun: {achievement.year}</span>}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveAchievement(index)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Add New Achievement Form */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-4">
          <h3 className="font-medium text-gray-900">Tambah Prestasi Baru</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nama Prestasi <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={newAchievement.achievementName}
              onChange={(e) =>
                setNewAchievement({ ...newAchievement, achievementName: e.target.value })
              }
              disabled={loading}
              placeholder="Contoh: Juara 1 Lari 100m"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori
              </label>
              <select
                value={newAchievement.category}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, category: e.target.value })
                }
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">-- Pilih Kategori --</option>
                {achievementCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Medali
              </label>
              <select
                value={newAchievement.medal}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, medal: e.target.value })
                }
                disabled={loading}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
              >
                <option value="">-- Pilih Medali --</option>
                {medals.map((medal) => (
                  <option key={medal} value={medal}>
                    {medal}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun <span className="text-red-500">*</span>
              </label>
              <select
                value={newAchievement.year}
                onChange={(e) =>
                  setNewAchievement({ ...newAchievement, year: parseInt(e.target.value) })
                }
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

          <button
            type="button"
            onClick={handleAddAchievement}
            disabled={loading}
            className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            Tambah Prestasi
          </button>
        </div>
      </div>
    </form>
  );
};

export default AthleteForm;
