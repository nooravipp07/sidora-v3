'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Filter, X, CheckCircle, Clock, ChevronLeft, ChevronRight, Loader } from 'lucide-react';

interface SportsGroup {
  id: number;
  groupName: string;
  leaderName?: string | null;
  memberCount: number;
  isVerified: boolean;
  desaKelurahanId: number;
  year?: number | null;
  sport?: {
    id: number;
    nama: string;
  } | null;
  desaKelurahan: {
    id: number;
    nama: string;
    kecamatan: {
      id: number;
      nama: string;
    };
  };
}

interface FilterOption {
  id: number;
  nama: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

interface ClubTableProps {
  clubs?: any[];
}

const ITEMS_PER_PAGE = 10;

export default function ClubTable({ clubs }: ClubTableProps) {
  const [sportsGroups, setSportsGroups] = useState<SportsGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedKecamatan, setSelectedKecamatan] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filter options
  const [kecamatanList, setKecamatanList] = useState<FilterOption[]>([]);
  const [cabangOlahragaList, setCabangOlahragaList] = useState<FilterOption[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  // Pagination state
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: ITEMS_PER_PAGE,
    totalPages: 0,
    hasMore: false,
  });

  // Fetch filter options
  useEffect(() => {
    const fetchFilterOptions = async () => {
      try {
        setLoadingFilters(true);
        const [kecRes, caborRes] = await Promise.all([
          fetch('/api/masterdata/kecamatan?page=1&limit=1000'),
          fetch('/api/masterdata/cabang-olahraga?page=1&limit=1000'),
        ]);

        if (kecRes.ok) {
          const kecData = await kecRes.json();
          setKecamatanList(kecData.data || []);
        }

        if (caborRes.ok) {
          const caborData = await caborRes.json();
          setCabangOlahragaList(caborData.data || []);
        }
      } catch (err) {
        console.error('Error fetching filter options:', err);
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchFilterOptions();
  }, []);

  // Fetch sports groups
  const fetchSportsGroups = useCallback(async (page: number = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', ITEMS_PER_PAGE.toString());

      if (selectedKecamatan) {
        params.append('kecamatanId', selectedKecamatan);
      }

      if (selectedStatus !== '') {
        params.append('isVerified', selectedStatus);
      }

      if (selectedSport) {
        params.append('sportId', selectedSport);
      }

      const response = await fetch(`/api/masterdata/sports-group?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch sports groups');

      const data = await response.json();
      setSportsGroups(data.data || []);
      setPaginationMeta(data.meta || {});
    } catch (err) {
      console.error('Error fetching sports groups:', err);
      setSportsGroups([]);
    } finally {
      setLoading(false);
    }
  }, [selectedKecamatan, selectedStatus, selectedSport]);

  // Fetch when filters change
  useEffect(() => {
    setCurrentPage(1);
    fetchSportsGroups(1);
  }, [selectedKecamatan, selectedStatus, fetchSportsGroups]);

  // Fetch when page changes
  useEffect(() => {
    fetchSportsGroups(currentPage);
  }, [currentPage, fetchSportsGroups]);

  const hasActiveFilters = selectedKecamatan || selectedStatus !== '' || selectedSport;

  const handleResetFilters = () => {
    setSelectedKecamatan('');
    setSelectedStatus('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= paginationMeta.totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="p-4 sm:p-6 rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Filter Kelompok Olahraga</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* Kecamatan Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Kecamatan
            </label>
            <select
              value={selectedKecamatan}
              onChange={(e) => {
                setSelectedKecamatan(e.target.value);
                setCurrentPage(1);
              }}
              disabled={loadingFilters}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Semua Kecamatan</option>
              {kecamatanList.map((kec) => (
                <option key={kec.id} value={kec.id}>
                  {kec.nama}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Status Verifikasi
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="true">Terverifikasi</option>
              <option value="false">Belum Terverifikasi</option>
            </select>
          </div>

          {/* Cabang Olahraga Filter */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Cabang Olahraga
            </label>
            <select
              value={selectedSport}
              onChange={(e) => {
                setSelectedSport(e.target.value);
                setCurrentPage(1);
              }}
              disabled={loadingFilters}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
            >
              <option value="">Semua Cabang</option>
              {cabangOlahragaList.map((cabor) => (
                <option key={cabor.id} value={cabor.id}>
                  {cabor.nama}
                </option>
              ))}
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">Filter aktif:</p>
            <div className="flex flex-wrap gap-2">
              {selectedKecamatan && (
                <button
                  onClick={() => {
                    setSelectedKecamatan('');
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {kecamatanList.find(k => k.id.toString() === selectedKecamatan)?.nama || selectedKecamatan}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedStatus !== '' && (
                <button
                  onClick={() => {
                    setSelectedStatus('');
                    setCurrentPage(1);
                  }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {selectedStatus === 'true' ? 'Terverifikasi' : 'Belum Terverifikasi'}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-8">
          <Loader className="w-5 h-5 text-blue-600 animate-spin mr-2" />
          <p className="text-sm text-gray-600">Memuat data...</p>
        </div>
      )}

      {/* Mobile Cards View */}
      {!loading && (
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {sportsGroups.length > 0 ? (
            sportsGroups.map((group) => (
              <div
                key={group.id}
                className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 text-sm">{group.groupName}</h3>
                    <p className="text-xs text-gray-600 mt-1">{group.desaKelurahan?.kecamatan?.nama}</p>
                  </div>
                  {group.isVerified ? (
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <Clock className="w-5 h-5 text-yellow-500 flex-shrink-0" />
                  )}
                </div>

                <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-100">
                  <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Kecamatan</span>
                  <span className="text-xs font-medium text-gray-900">{group.desaKelurahan?.kecamatan?.nama}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Cabang Olahraga</span>
                  <span className="text-xs font-medium text-gray-900">{group.sport?.nama || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Anggota</span>
                    <span className="text-xs font-medium text-gray-900">{group.memberCount}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-600">Ketua</span>
                    <span className="text-xs font-medium text-gray-900">{group.leaderName || '-'}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center rounded-lg border border-gray-200 bg-gray-50">
              <p className="text-sm text-gray-500">Tidak ada data kelompok olahraga ditemukan</p>
            </div>
          )}
        </div>
      )}

      {/* Pagination - Mobile */}
      {!loading && sportsGroups.length > 0 && (
        <div className="mt-4 p-4 lg:hidden bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <p className="text-xs sm:text-sm text-gray-600">
              Menampilkan {paginationMeta.total > 0 ? (paginationMeta.page - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(paginationMeta.page * ITEMS_PER_PAGE, paginationMeta.total)} dari {paginationMeta.total} data
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 hover:bg-gray-200 disabled:hover:bg-gray-50 disabled:opacity-50 rounded transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>
              <div className="flex gap-1">
                {Array.from({ length: paginationMeta.totalPages }, (_, i) => i + 1)
                  .filter(p => Math.abs(p - currentPage) <= 1 || p === 1 || p === paginationMeta.totalPages)
                  .map((page, idx, arr) => {
                    if (idx > 0 && arr[idx - 1] !== page - 1) {
                      return (
                        <span key={`dots-${page}`} className="px-1 text-gray-600">...</span>
                      );
                    }
                    return (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-2 py-1 rounded text-xs transition-colors ${
                          currentPage === page
                            ? 'bg-blue-600 text-white font-medium'
                            : 'text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
              </div>
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === paginationMeta.totalPages}
                className="p-1 hover:bg-gray-200 disabled:hover:bg-gray-50 disabled:opacity-50 rounded transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Table View */}
      {!loading && (
        <div className="hidden lg:block rounded-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Nama Kelompok
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Cabang Olahraga
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Desa/Kelurahan
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Kecamatan
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Total Anggota
                  </th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                    Ketua
                  </th>
                  <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                    Status Verifikasi
                  </th>
                </tr>
              </thead>
              <tbody>
                {sportsGroups.length > 0 ? (
                  sportsGroups.map((group) => (
                    <tr
                      key={group.id}
                      className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-900 text-sm">{group.groupName}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{group.sport?.nama || '-'}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{group.desaKelurahan?.nama}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{group.desaKelurahan?.kecamatan?.nama}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <p className="text-sm font-medium text-gray-900">{group.memberCount}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="text-sm text-gray-700">{group.leaderName || '-'}</p>
                      </td>
                      <td className="px-6 py-4 text-center">
                        {group.isVerified ? (
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 rounded-full">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-xs font-medium text-green-700">Terverifikasi</span>
                          </div>
                        ) : (
                          <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-50 rounded-full">
                            <Clock className="w-4 h-4 text-yellow-600" />
                            <span className="text-xs font-medium text-yellow-700">Belum Verifikasi</span>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center">
                      <p className="text-sm text-gray-500">Tidak ada data kelompok olahraga ditemukan</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {sportsGroups.length > 0 ? (
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <p className="text-sm text-gray-600">
                  Menampilkan {paginationMeta.total > 0 ? (paginationMeta.page - 1) * ITEMS_PER_PAGE + 1 : 0}-{Math.min(paginationMeta.page * ITEMS_PER_PAGE, paginationMeta.total)} dari {paginationMeta.total} data
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-1 hover:bg-gray-200 disabled:hover:bg-gray-50 disabled:opacity-50 rounded transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                  </button>
                  <div className="flex gap-1">
                    {Array.from({ length: paginationMeta.totalPages }, (_, i) => i + 1)
                      .filter(p => Math.abs(p - currentPage) <= 1 || p === 1 || p === paginationMeta.totalPages)
                      .map((page, idx, arr) => {
                        if (idx > 0 && arr[idx - 1] !== page - 1) {
                          return (
                            <span key={`dots-${page}`} className="px-2 py-1 text-gray-600">...</span>
                          );
                        }
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`px-3 py-1 rounded text-sm transition-colors ${
                              currentPage === page
                                ? 'bg-blue-600 text-white font-medium'
                                : 'text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === paginationMeta.totalPages}
                    className="p-1 hover:bg-gray-200 disabled:hover:bg-gray-50 disabled:opacity-50 rounded transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="px-6 py-8 bg-gray-50 border-t border-gray-200 text-center">
              <p className="text-sm text-gray-500">Tidak ada data kelompok olahraga ditemukan</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
