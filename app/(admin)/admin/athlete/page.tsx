'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

const Athlete: React.FC = () => {
  const router = useRouter();
  const [athletes, setAthletes] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    kecamatanId: '',
    desaKelurahanId: '',
    sportId: '',
    gender: '',
    search: '',
  });

  // Filter dropdown data
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<any[]>([]);
  const [sportList, setSportList] = useState<any[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  // Fetch athletes data
  useEffect(() => {
    fetchAthletes(1);
  }, [filters]);

  // Fetch filter options
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoadingFilters(true);

      const [kecamRes, desaRes, sportRes] = await Promise.all([
        fetch('/api/masterdata/kecamatan?page=1&limit=1000'),
        fetch('/api/masterdata/desa-kelurahan?page=1&limit=1000'),
        fetch('/api/masterdata/cabang-olahraga?page=1&limit=1000'),
      ]);

      if (kecamRes.ok) {
        const kecamData = await kecamRes.json();
        setKecamatanList(kecamData.data || []);
      }

      if (desaRes.ok) {
        const desaData = await desaRes.json();
        setDesaKelurahanList(desaData.data || []);
      }

      if (sportRes.ok) {
        const sportData = await sportRes.json();
        setSportList(sportData.data || []);
      }
    } catch (err) {
      console.error('Error fetching filter options:', err);
    } finally {
      setLoadingFilters(false);
    }
  };

  const fetchAthletes = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (filters.desaKelurahanId) params.append('desaKelurahanId', filters.desaKelurahanId);
      if (filters.sportId) params.append('sportId', filters.sportId);
      if (filters.gender) params.append('gender', filters.gender);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/masterdata/athlete?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch athletes');
      const data = await response.json();
      setAthletes(data.data || []);
      setPagination(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch athletes');
      console.error('Error fetching athletes:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data atlet ini?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/masterdata/athlete/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete athlete');

      setAthletes(athletes.filter(a => a.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete athlete');
      console.error('Error deleting athlete:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      const prevPage = pagination.page - 1;
      setPagination(prev => ({ ...prev, page: prevPage }));
      fetchAthletes(prevPage);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: nextPage }));
      fetchAthletes(nextPage);
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      kecamatanId: '',
      desaKelurahanId: '',
      sportId: '',
      gender: '',
      search: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const filteredDesaKelurahan = filters.kecamatanId
    ? desaKelurahanList.filter(d => d.kecamatan?.id === parseInt(filters.kecamatanId))
    : desaKelurahanList;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Data Atlet</h1>
        <p className="text-gray-600">Kelola data atlet dan prestasi mereka</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
        <button
          onClick={() => router.push('/admin/athlete/create')}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Tambah Data
        </button>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors"
        >
          <Filter className="w-4 h-4" />
          {showFilters ? 'Tutup Filter' : 'Buka Filter'}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Kecamatan Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kecamatan
              </label>
              <select
                value={filters.kecamatanId}
                onChange={(e) => {
                  handleFilterChange('kecamatanId', e.target.value);
                  setFilters(prev => ({ ...prev, desaKelurahanId: '' }));
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Semua Kecamatan --</option>
                {kecamatanList.map((kec) => (
                  <option key={kec.id} value={kec.id}>
                    {kec.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Desa/Kelurahan Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Desa/Kelurahan
              </label>
              <select
                value={filters.desaKelurahanId}
                onChange={(e) => handleFilterChange('desaKelurahanId', e.target.value)}
                disabled={!filters.kecamatanId}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">-- Semua Desa/Kelurahan --</option>
                {filteredDesaKelurahan.map((desa) => (
                  <option key={desa.id} value={desa.id}>
                    {desa.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Cabang Olahraga Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cabang Olahraga
              </label>
              <select
                value={filters.sportId}
                onChange={(e) => handleFilterChange('sportId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Semua --</option>
                {sportList.map((sport) => (
                  <option key={sport.id} value={sport.id}>
                    {sport.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Jenis Kelamin Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Kelamin
              </label>
              <select
                value={filters.gender}
                onChange={(e) => handleFilterChange('gender', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Semua --</option>
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari (Nama/NIK)
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Masukkan nama atau NIK"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Reset Button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500 transition-colors"
            >
              Reset Filter
            </button>
          </div>
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-x-auto">
        {loading ? (
          <div className="flex justify-center items-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : athletes.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            Belum ada data atlet
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NIK</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Desa/Kelurahan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cabang</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">JK</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prestasi</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {athletes.map((athlete, index) => (
                  <tr key={athlete.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{(pagination.page - 1) * 10 + index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{athlete.fullName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{athlete.nationalId}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{athlete.desaKelurahan?.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{athlete.sport?.nama || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{athlete.gender || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {athlete.achievements?.length > 0 ? (
                        <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                          {athlete.achievements.length}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedAthlete(athlete);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/athlete/${athlete.id}/edit`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(athlete.id)}
                          disabled={deleting === athlete.id}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                          title="Hapus"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {athletes.length > 0 && (
              <div className="flex flex-col items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4 sm:flex-row">
                <div className="text-sm text-gray-600">
                  Menampilkan {(pagination.page - 1) * 10 + 1} - {Math.min(pagination.page * 10, pagination.total)} dari {pagination.total} data
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handlePrevPage}
                    disabled={pagination.page === 1 || loading}
                    className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm text-gray-600">
                    Halaman {pagination.page} dari {pagination.totalPages}
                  </span>
                  <button
                    onClick={handleNextPage}
                    disabled={!pagination.hasMore || loading}
                    className="p-2 text-gray-600 hover:bg-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedAthlete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Atlet</h2>
            
            {/* Photo Display */}
            {selectedAthlete.photoUrl && (
              <div className="mb-6 flex justify-center">
                <img
                  src={selectedAthlete.photoUrl}
                  alt={selectedAthlete.fullName}
                  className="w-40 h-52 object-cover rounded-lg border border-gray-300 shadow-sm"
                />
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <p className="text-sm text-gray-600">Nama Lengkap</p>
                <p className="font-semibold text-gray-900">{selectedAthlete.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIK</p>
                <p className="font-semibold text-gray-900">{selectedAthlete.nationalId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tempat Lahir</p>
                <p className="font-semibold text-gray-900">{selectedAthlete.birthPlace || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Lahir</p>
                <p className="font-semibold text-gray-900">
                  {selectedAthlete.birthDate ? new Date(selectedAthlete.birthDate).toLocaleDateString('id-ID') : '-'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jenis Kelamin</p>
                <p className="font-semibold text-gray-900">{selectedAthlete.gender || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Desa/Kelurahan</p>
                <p className="font-semibold text-gray-900">{selectedAthlete.desaKelurahan?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Organisasi</p>
                <p className="font-semibold text-gray-900">{selectedAthlete.organization || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cabang Olahraga</p>
                <p className="font-semibold text-gray-900">{selectedAthlete.sport?.nama || '-'}</p>
              </div>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-600">Alamat Lengkap</p>
              <p className="font-semibold text-gray-900">{selectedAthlete.fullAddress || '-'}</p>
            </div>

            {/* Achievements */}
            {selectedAthlete.achievements && selectedAthlete.achievements.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Prestasi</h3>
                <div className="space-y-2">
                  {selectedAthlete.achievements.map((achievement: any, idx: number) => (
                    <div key={idx} className="p-3 bg-gray-50 rounded-lg">
                      <p className="font-medium text-gray-900">{achievement.achievementName}</p>
                      <div className="flex gap-4 text-sm text-gray-600 mt-1">
                        {achievement.category && <span>Kategori: {achievement.category}</span>}
                        {achievement.medal && <span>Medali: {achievement.medal}</span>}
                        {achievement.year && <span>Tahun: {achievement.year}</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  router.push(`/admin/athlete/${selectedAthlete.id}/edit`);
                }}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Athlete;
