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

interface UploadedPhoto {
  id: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  previewUrl: string;
}

interface AthleteAchievement {
  id: string;
  achievementName: string;
  category: string;
  medal: string;
  year: number;
}

interface AthleteInputFormProps {
  initialData?: any;
  isEdit?: boolean;
}

const AthleteInputForm: React.FC<AthleteInputFormProps> = ({ initialData, isEdit = false }) => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [sportList, setSportList] = useState<CabangOlahraga[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<DesaKelurahan[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(true);
  const [photo, setPhoto] = useState<UploadedPhoto | null>(
    initialData?.photoUrl ? {
      id: 'existing',
      fileUrl: initialData.photoUrl,
      fileName: 'Existing Photo',
      fileSize: 0,
      mimeType: 'image/jpeg',
      previewUrl: initialData.photoUrl,
    } : null
  );
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [achievements, setAchievements] = useState<AthleteAchievement[]>(
    initialData?.achievements?.map((achievement: any) => ({
      id: achievement.id?.toString() || `temp-${Date.now()}-${Math.random()}`,
      achievementName: achievement.achievementName || '',
      category: achievement.category || '',
      medal: achievement.medal || 'EMAS',
      year: achievement.year || new Date().getFullYear(),
    })) || []
  );
  const [newAchievement, setNewAchievement] = useState({
    achievementName: '',
    category: '',
    medal: 'EMAS',
    year: new Date().getFullYear(),
  });

  const [formData, setFormData] = useState({
    nationalId: initialData?.nationalId || '',
    fullName: initialData?.fullName || '',
    birthPlace: initialData?.birthPlace || '',
    birthDate: initialData?.birthDate || '',
    gender: initialData?.gender || 'MALE',
    desaKelurahanId: initialData?.desaKelurahanId || '',
    fullAddress: initialData?.fullAddress || '',
    organization: initialData?.organization || '',
    sportId: initialData?.sportId || '',
    category: initialData?.athleteCategory || initialData?.category || '',
    statusAthlete: initialData?.statusAthlete || 'aktif',
  });

  // Fetch sports and desa/kelurahan lists
  useEffect(() => {
    if (authLoading) return;

    if (!user) {
      router.push('/login');
      return;
    }

    const fetchOptions = async () => {
      try {
        setLoadingOptions(true);

        // Fetch sports
        const sportsRes = await fetch('/api/masterdata/cabang-olahraga?page=1&limit=1000');
        if (sportsRes.ok) {
          const sportsData = await sportsRes.json();
          setSportList(sportsData.data || []);
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
    setUploadingPhoto(true);

    try {
      const file = files[0];
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
      setPhoto({
        id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        fileUrl: data.url,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        previewUrl: URL.createObjectURL(file),
      });
    } catch (err) {
      setPhotoError(err instanceof Error ? err.message : 'Gagal mengupload foto');
    } finally {
      setUploadingPhoto(false);
      input.value = '';
    }
  };

  const removePhoto = () => {
    setPhoto(null);
  };

  const handleAchievementChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.currentTarget;
    setNewAchievement(prev => ({
      ...prev,
      [name]: name === 'year' ? parseInt(value) : value,
    }));
  };

  const addAchievement = () => {
    if (!newAchievement.achievementName.trim()) {
      setError('Nama prestasi harus diisi');
      return;
    }

    const achievement: AthleteAchievement = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      ...newAchievement,
    };

    setAchievements(prev => [...prev, achievement]);
    setNewAchievement({
      achievementName: '',
      category: '',
      medal: 'EMAS',
      year: new Date().getFullYear(),
    });
    setError(null);
  };

  const removeAchievement = (id: string) => {
    setAchievements(prev => prev.filter(achievement => achievement.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.nationalId) {
      setError('Nomor Induk Kependudukan harus diisi');
      return;
    }
    if (!formData.fullName) {
      setError('Nama Lengkap harus diisi');
      return;
    }
    if (!formData.birthDate) {
      setError('Tanggal Lahir harus diisi');
      return;
    }
    if (!formData.desaKelurahanId) {
      setError('Desa/Kelurahan harus dipilih');
      return;
    }
    if (!formData.fullAddress) {
      setError('Alamat Lengkap harus diisi');
      return;
    }
    if (!formData.sportId) {
      setError('Cabang Olahraga harus dipilih');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const url = isEdit ? `/api/staging/athlete/${initialData.id}` : '/api/staging/athlete';
      const method = isEdit ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          desaKelurahanId: parseInt(formData.desaKelurahanId),
          sportId: parseInt(formData.sportId),
          photo: photo
            ? {
                fileUrl: photo.fileUrl,
                fileName: photo.fileName,
                fileSize: photo.fileSize,
                mimeType: photo.mimeType,
              }
            : null,
          achievements: achievements.map(achievement => ({
            achievementName: achievement.achievementName,
            category: achievement.category,
            medal: achievement.medal,
            year: achievement.year,
          })),
          ...(isEdit && { actionType: 'UPDATE', referenceId: initialData.referenceId || initialData.id }),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menyimpan data');
      }

      setSuccess(isEdit ? 'Data atlet berhasil diperbarui dan disubmit ulang untuk verifikasi' : 'Data atlet berhasil disubmit untuk verifikasi');
      setTimeout(() => {
        router.push('/admin/data-keolahragaan/athlete');
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
            <h1 className="text-3xl font-bold text-gray-900">Input Data Atlet</h1>
            <p className="text-gray-600 mt-1">
              Silakan isi data atlet yang akan diverifikasi oleh admin
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
            {/* Nomor Induk Kependudukan */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nomor Induk Kependudukan (NIK) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nationalId"
                value={formData.nationalId}
                onChange={handleInputChange}
                placeholder="Masukkan NIK"
                maxLength={20}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Nama Lengkap */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Masukkan nama lengkap"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tempat Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tempat Lahir
              </label>
              <input
                type="text"
                name="birthPlace"
                value={formData.birthPlace}
                onChange={handleInputChange}
                placeholder="Masukkan tempat lahir"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Tanggal Lahir */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tanggal Lahir <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="birthDate"
                value={formData.birthDate}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Jenis Kelamin */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin <span className="text-red-500">*</span>
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="MALE">Laki-laki</option>
                <option value="FEMALE">Perempuan</option>
              </select>
            </div>

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

            {/* Cabang Olahraga */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cabang Olahraga <span className="text-red-500">*</span>
              </label>
              <select
                name="sportId"
                value={formData.sportId}
                onChange={handleInputChange}
                disabled={loadingOptions}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
              >
                <option value="">Pilih Cabang Olahraga</option>
                {sportList.map(sport => (
                  <option key={sport.id} value={sport.id}>
                    {sport.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Kategori Atlet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kategori Atlet
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Pilih Kategori</option>
                <option value="JUNIOR">Junior</option>
                <option value="SENIOR">Senior</option>
                <option value="MASTER">Master</option>
              </select>
            </div>

            {/* Status Atlet */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Atlet
              </label>
              <select
                name="statusAthlete"
                value={formData.statusAthlete}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="aktif">Aktif</option>
                <option value="tidak_aktif">Tidak Aktif</option>
                <option value="pensiun">Pensiun</option>
              </select>
            </div>

            {/* Organisasi */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Organisasi
              </label>
              <input
                type="text"
                name="organization"
                value={formData.organization}
                onChange={handleInputChange}
                placeholder="Masukkan organisasi/klub"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Alamat Lengkap */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alamat Lengkap <span className="text-red-500">*</span>
              </label>
              <textarea
                name="fullAddress"
                value={formData.fullAddress}
                onChange={handleInputChange}
                placeholder="Masukkan alamat lengkap"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Lampiran Foto */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Foto (opsional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handlePhotoSelect}
                disabled={uploadingPhoto}
                className="w-full text-sm text-gray-600 file:bg-blue-600 file:text-white file:px-4 file:py-2 file:rounded-lg file:border-0"
              />
              {photoError && (
                <p className="mt-2 text-sm text-red-600">{photoError}</p>
              )}
              {uploadingPhoto && (
                <p className="mt-2 text-sm text-gray-600">Mengunggah foto...</p>
              )}
              {photo && (
                <div className="mt-4">
                  <div className="relative border rounded-lg overflow-hidden w-32">
                    <img
                      src={photo.previewUrl}
                      alt={photo.fileName}
                      className="h-40 w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={removePhoto}
                      className="absolute top-2 right-2 bg-black/60 text-white rounded-full p-1 hover:bg-black"
                    >
                      ✕
                    </button>
                  </div>
                  <p className="mt-2 text-xs text-gray-600">{photo.fileName}</p>
                </div>
              )}
            </div>

            {/* Prestasi Atlet */}
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prestasi Atlet (opsional)
              </label>

              {/* Form Tambah Prestasi */}
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
                  <div>
                    <input
                      type="text"
                      name="achievementName"
                      value={newAchievement.achievementName}
                      onChange={handleAchievementChange}
                      placeholder="Nama Prestasi"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="category"
                      value={newAchievement.category}
                      onChange={handleAchievementChange}
                      placeholder="Kategori"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <select
                      name="medal"
                      value={newAchievement.medal}
                      onChange={handleAchievementChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    >
                      <option value="EMAS">Emas</option>
                      <option value="PERAK">Perak</option>
                      <option value="PERUNGGU">Perunggu</option>
                    </select>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="year"
                      value={newAchievement.year}
                      onChange={handleAchievementChange}
                      min="2000"
                      max={new Date().getFullYear()}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    <button
                      type="button"
                      onClick={addAchievement}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium"
                    >
                      Tambah
                    </button>
                  </div>
                </div>
              </div>

              {/* List Prestasi */}
              {achievements.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">Daftar Prestasi:</h4>
                  <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                    {achievements.map((achievement, index) => (
                      <div key={achievement.id} className="flex items-center justify-between p-3 border-b border-gray-100 last:border-b-0">
                        <div className="flex-1">
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium text-gray-900">{index + 1}.</span>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{achievement.achievementName}</p>
                              <p className="text-xs text-gray-600">
                                {achievement.category} • {achievement.medal} • {achievement.year}
                              </p>
                            </div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeAchievement(achievement.id)}
                          className="text-red-600 hover:text-red-800 p-1"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
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
              disabled={loading || loadingOptions || uploadingPhoto}
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

export default AthleteInputForm;
