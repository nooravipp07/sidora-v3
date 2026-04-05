'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';
import Swal from 'sweetalert2';
import { useAuth } from '@/lib/auth/useAuth';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

const SportsGroup: React.FC = () => {
  const router = useRouter();
  const [sportsGroups, setSportsGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSg, setSelectedSg] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [exporting, setExporting] = useState(false);

  const { user, isLoading: authLoading, error: authError, isAuthenticated } = useAuth();

  // Filter state
  const [filters, setFilters] = useState({
    kecamatanId: '',
    desaKelurahanId: '',
    year: '',
    isVerified: '',
    sportId: '',
  });

  // Filter dropdown data
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<any[]>([]);
  const [cabangOlahragaList, setCabangOlahragaList] = useState<any[]>([]);
  const [yearList, setYearList] = useState<number[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  // Fetch sports groups data
  useEffect(() => {
    fetchSportsGroups(1);
  }, [filters]);

  // Fetch filter options
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoadingFilters(true);

      const [kecamRes, desaRes, caborRes] = await Promise.all([
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

      if (caborRes.ok) {
        const caborData = await caborRes.json();
        setCabangOlahragaList(caborData.data || []);
      }

      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 10 }, (_, i) => currentYear - i).sort((a, b) => b - a);
      setYearList(years);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    } finally {
      setLoadingFilters(false);
    }
  };

  const fetchSportsGroups = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');

      // FILTER BERDASARKAN ROLE
      if (user?.roleId === 3 && user.kecamatanId) {
        params.append('kecamatanId', String(user.kecamatanId));
      } else if (filters.kecamatanId) {
        params.append('kecamatanId', filters.kecamatanId);
      }

      if (filters.desaKelurahanId) params.append('desaKelurahanId', filters.desaKelurahanId);
      if (filters.year) params.append('year', filters.year);
      if (filters.isVerified) params.append('isVerified', filters.isVerified);
      if (filters.sportId) params.append('sportId', filters.sportId);

      const response = await fetch(`/api/masterdata/sports-group?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch sports groups');
      const data = await response.json();
      setSportsGroups(data.data || []);
      setPagination(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch sports groups');
      console.error('Error fetching sports groups:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/masterdata/sports-group/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete sports group');

      setSportsGroups(sportsGroups.filter(sg => sg.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete sports group');
      console.error('Error deleting sports group:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handleExport = async () => {
    if (!filters.kecamatanId && !filters.desaKelurahanId) {
      Swal.fire({
        icon: 'warning',
        title: 'Filter Tidak Lengkap',
        text: 'Silakan pilih Kecamatan atau Desa/Kelurahan untuk mengekspor data',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (filters.kecamatanId) params.append('kecamatanId', filters.kecamatanId);
      if (filters.desaKelurahanId) params.append('desaKelurahanId', filters.desaKelurahanId);
      if (filters.year) params.append('year', filters.year);
      if (filters.isVerified !== undefined) params.append('isVerified', filters.isVerified);

      const response = await fetch(`/api/sports-groups/export?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal mengekspor data');
      }

      // Create blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Kelompok_Olahraga_${new Date().getTime()}.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Data berhasil diekspor ke Excel',
        confirmButtonColor: '#3B82F6'
      });
    } catch (err) {
      console.error('Export error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengekspor',
        text: err instanceof Error ? err.message : 'Terjadi kesalahan saat mengekspor data',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setExporting(false);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      const prevPage = pagination.page - 1;
      setPagination(prev => ({ ...prev, page: prevPage }));
      fetchSportsGroups(prevPage);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: nextPage }));
      fetchSportsGroups(nextPage);
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
      year: '',
      isVerified: '',
      sportId: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const effectiveKecamatanId =
    user?.roleId === 3
      ? user.kecamatanId
      : filters.kecamatanId;

  const filteredDesaKelurahan = effectiveKecamatanId
    ? desaKelurahanList.filter(
        d => d.kecamatan?.id === Number(effectiveKecamatanId)
      )
    : desaKelurahanList;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Kelompok Olahraga</h1>
        <p className="text-gray-600">Kelola data kelompok olahraga per desa/kelurahan</p>
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
          onClick={() => router.push('/admin/sports-group/create')}
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

        <button 
          onClick={handleExport}
          disabled={exporting || (!filters.kecamatanId && !filters.desaKelurahanId)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          {exporting ? 'Mengekspor...' : 'Export Excel'}
        </button>
      </div>

      {/* Filter Section */}
      {showFilters && (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Data</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Kecamatan Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Kecamatan
              </label>
              <select
                value={
                  user?.roleId === 3
                    ? String(user.kecamatanId)
                    : filters.kecamatanId
                }
                onChange={(e) => {
                  if (user?.roleId !== 3) {
                    handleFilterChange('kecamatanId', e.target.value);
                    setFilters(prev => ({ ...prev, desaKelurahanId: '' }));
                  }
                }}
                disabled={user?.roleId === 3}
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
                disabled={!effectiveKecamatanId}
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

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tahun
              </label>
              <select
                value={filters.year}
                onChange={(e) => handleFilterChange('year', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Semua Tahun --</option>
                {yearList.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Verification Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status Verifikasi
              </label>
              <select
                value={filters.isVerified}
                onChange={(e) => handleFilterChange('isVerified', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Semua --</option>
                <option value="true">Terverifikasi</option>
                <option value="false">Belum Terverifikasi</option>
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
                <option value="">-- Semua Cabang Olahraga --</option>
                {cabangOlahragaList.map((cabor) => (
                  <option key={cabor.id} value={cabor.id}>
                    {cabor.nama}
                  </option>
                ))}
              </select>
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
        ) : sportsGroups.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            Belum ada data kelompok olahraga
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Kelompok</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Cabang Olahraga</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Desa/Kelurahan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kecamatan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Ketua</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Anggota</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tahun</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {sportsGroups.map((sg, index) => (
                  <tr key={sg.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-600">{(pagination.page - 1) * 10 + index + 1}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">{sg.groupName}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sg.sport?.nama || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sg.desaKelurahan?.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sg.desaKelurahan?.kecamatan?.nama}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sg.leaderName || '-'}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sg.memberCount}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{sg.year}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        sg.isVerified
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sg.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedSg(sg);
                            setIsViewModalOpen(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/sports-group/${sg.id}/edit`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sg.id)}
                          disabled={deleting === sg.id}
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
            {sportsGroups.length > 0 && (
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
      {isViewModalOpen && selectedSg && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Detail Kelompok Olahraga</h2>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-600">Nama Kelompok</p>
                <p className="font-semibold text-gray-900">{selectedSg.groupName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Desa/Kelurahan</p>
                <p className="font-semibold text-gray-900">{selectedSg.desaKelurahan?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kecamatan</p>
                <p className="font-semibold text-gray-900">{selectedSg.desaKelurahan?.kecamatan?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Cabang Olahraga</p>
                <p className="font-semibold text-gray-900">{selectedSg.sport?.nama || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nama Ketua</p>
                <p className="font-semibold text-gray-900">{selectedSg.leaderName || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Jumlah Anggota</p>
                <p className="font-semibold text-gray-900">{selectedSg.memberCount}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tahun</p>
                <p className="font-semibold text-gray-900">{selectedSg.year}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nomor SK</p>
                <p className="font-semibold text-gray-900">{selectedSg.decreeNumber || '-'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Status Verifikasi</p>
                <p className="font-semibold">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedSg.isVerified
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {selectedSg.isVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                  </span>
                </p>
              </div>
            </div>
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
                  router.push(`/admin/sports-group/${selectedSg.id}/edit`);
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

export default SportsGroup;
