'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Edit, Trash2, Eye, Download, Upload, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import Swal from 'sweetalert2';
import { FacilityRecord } from '@/types/masterdata';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

const Prasarana: React.FC = () => {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [facilityRecords, setFacilityRecords] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importingFile, setImportingFile] = useState(false);
  const [exporting, setExporting] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    kecamatanId: '',
    desaKelurahanId: '',
    year: '',
  });

  // Filter dropdown data
  const [kecamatanList, setKecamatanList] = useState<any[]>([]);
  const [desaKelurahanList, setDesaKelurahanList] = useState<any[]>([]);
  const [yearList, setYearList] = useState<number[]>([]);
  const [loadingFilters, setLoadingFilters] = useState(false);

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  // Fetch facility records
  useEffect(() => {
    fetchFacilityRecords(1);
  }, [filters]);

  // Fetch filter options
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  // Fetch facility records
  useEffect(() => {
    fetchFacilityRecords(1);
  }, [filters]);

  // Fetch filter options
  useEffect(() => {
    fetchFilterOptions();
  }, []);

  const fetchFilterOptions = async () => {
    try {
      setLoadingFilters(true);

      // Fetch kecamatan list
      const kecamRes = await fetch('/api/masterdata/kecamatan?page=1&limit=1000');
      if (kecamRes.ok) {
        const kecamData = await kecamRes.json();
        setKecamatanList(kecamData.data || []);
      }

      // Fetch desa/kelurahan list
      const desaRes = await fetch('/api/masterdata/desa-kelurahan?page=1&limit=1000');
      if (desaRes.ok) {
        const desaData = await desaRes.json();
        setDesaKelurahanList(desaData.data || []);
      }

      // Generate year list (current year and previous 9 years)
      const currentYear = new Date().getFullYear();
      const years = Array.from({ length: 10 }, (_, i) => currentYear - i).sort((a, b) => b - a);
      setYearList(years);
    } catch (err) {
      console.error('Error fetching filter options:', err);
    } finally {
      setLoadingFilters(false);
    }
  };

  const fetchFacilityRecords = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build query string with filters
      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (filters.kecamatanId) params.append('kecamatanId', filters.kecamatanId);
      if (filters.desaKelurahanId) params.append('desaKelurahanId', filters.desaKelurahanId);
      if (filters.year) params.append('year', filters.year);

      const response = await fetch(`/api/facility-records?${params.toString()}`);
      if (!response.ok) throw new Error('Failed to fetch facility records');
      const data = await response.json();
      setFacilityRecords(data.data || []);
      setPagination(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch facility records');
      console.error('Error fetching facility records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    router.push('/admin/prasarana/create');
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/prasarana/${id}/edit`);
  };

  const handleView = (record: any) => {
    setSelectedRecord(record);
    setIsViewModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data ini?')) return;

    setDeleting(id);
    try {
      const response = await fetch(`/api/facility-records/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete facility record');

      setFacilityRecords(facilityRecords.filter(record => record.id !== id));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete facility record');
      console.error('Error deleting facility record:', err);
    } finally {
      setDeleting(null);
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      const prevPage = pagination.page - 1;
      setPagination(prev => ({ ...prev, page: prevPage }));
      fetchFacilityRecords(prevPage);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: nextPage }));
      fetchFacilityRecords(nextPage);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination({ ...pagination, page: newPage });
    }
  };

  const handleFilterChange = (field: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [field]: value,
    }));
    // Reset to page 1
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleResetFilters = () => {
    setFilters({
      kecamatanId: '',
      desaKelurahanId: '',
      year: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handleExport = async () => {
    // Validate filters
    if (!filters.year || !filters.kecamatanId) {
      Swal.fire({
        icon: 'warning',
        title: 'Filter Tidak Lengkap',
        text: 'Silakan pilih Kecamatan dan Tahun untuk mengekspor data',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setExporting(true);
    try {
      const params = new URLSearchParams();
      params.append('year', filters.year);
      params.append('kecamatanId', filters.kecamatanId);

      const response = await fetch(`/api/facility-records/export?${params.toString()}`);

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Gagal mengekspor data');
      }

      // Create blob from response
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Prasarana_${filters.year}_${new Date().getTime()}.xlsx`;
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

  const handleImportClick = () => {
    // Validate filters
    if (!filters.year || !filters.kecamatanId) {
      Swal.fire({
        icon: 'warning',
        title: 'Filter Tidak Lengkap',
        text: 'Silakan pilih Kecamatan dan Tahun sebelum mengimpor data',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }
    setIsImportModalOpen(true);
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      Swal.fire({
        icon: 'error',
        title: 'Format File Salah',
        text: 'File harus berformat .xlsx atau .xls',
        confirmButtonColor: '#3B82F6'
      });
      return;
    }

    setImportingFile(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('createdBy', 'Admin'); // You might want to get actual user

      const response = await fetch('/api/facility-records/import', {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Gagal mengimpor data');
      }

      // Show result
      if (result.failed > 0) {
        Swal.fire({
          icon: 'warning',
          title: 'Import Selesai dengan Peringatan',
          html: `<div class="text-left">
            <p><strong>Berhasil:</strong> ${result.success} data</p>
            <p><strong>Gagal:</strong> ${result.failed} data</p>
            ${result.errors.length > 0 ? `<details class="mt-2">
              <summary class="cursor-pointer font-medium">Lihat Error</summary>
              <pre class="text-xs mt-2 bg-gray-100 p-2 rounded whitespace-pre-wrap">${result.errors.map((e: any) => `Baris ${e.row}: ${e.error}`).join('\n')}</pre>
            </details>` : ''}
          </div>`,
          confirmButtonColor: '#3B82F6'
        });
      } else {
        Swal.fire({
          icon: 'success',
          title: 'Import Berhasil',
          text: `${result.success} data berhasil diimpor`,
          confirmButtonColor: '#3B82F6'
        });
      }

      setIsImportModalOpen(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      
      // Refresh data
      fetchFacilityRecords(1);
    } catch (err) {
      console.error('Import error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Mengimpor',
        text: err instanceof Error ? err.message : 'Terjadi kesalahan saat mengimpor data',
        confirmButtonColor: '#3B82F6'
      });
    } finally {
      setImportingFile(false);
    }
  };

  const filteredDesaKelurahan = filters.kecamatanId
    ? desaKelurahanList.filter(d => d.kecamatan?.id === parseInt(filters.kecamatanId))
    : desaKelurahanList;

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Prasarana Olahraga</h1>
        <p className="text-gray-600">Kelola data prasarana olahraga per kecamatan</p>
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
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
        >
          <Plus className="w-4 h-4 mr-2" />
          Tambah Data
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
            showFilters
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-600 text-white hover:bg-gray-700'
          }`}
        >
          <Filter className="w-4 h-4 mr-2" />
          {showFilters ? 'Sembunyikan Filter' : 'Tampilkan Filter'}
        </button>
        <button 
          onClick={handleExport}
          disabled={exporting || !filters.year || !filters.kecamatanId}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Download className="w-4 h-4 mr-2" />
          {exporting ? 'Mengekspor...' : 'Export Excel'}
        </button>
        <button
          onClick={handleImportClick}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
        >
          <Upload className="w-4 h-4 mr-2" />
          Import Excel
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
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
                  // Reset desa/kelurahan when kecamatan changes
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

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : facilityRecords.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              Tidak ada data prasarana. Klik "Tambah Data" untuk membuat data prasarana baru.
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Prasarana</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Desa/Kelurahan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kecamatan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tahun</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kondisi</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {facilityRecords.map((record, index) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {(pagination.page - 1) * pagination.limit + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.prasarana?.nama || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.desaKelurahan?.nama || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.desaKelurahan?.kecamatan?.nama || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {record.year}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                        {record.condition || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        record.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {record.isActive ? 'Aktif' : 'Tidak Aktif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(record.id)}
                          className="text-blue-600 hover:text-blue-800 transition-colors"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(record.id)}
                          disabled={deleting === record.id}
                          className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
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
          )}
        </div>

        {/* Pagination */}
        {facilityRecords.length > 0 && (
          <div className="flex flex-col items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-200 gap-4 sm:flex-row">
            <div className="text-sm text-gray-600">
              Menampilkan {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} dari {pagination.total} data
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
      </div>

      {/* View Modal */}
      {isViewModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full max-h-96 overflow-y-auto">
            <div className="sticky top-0 bg-gray-50 px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Detail Prasarana</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-4 space-y-3">
              <div>
                <p className="text-sm font-medium text-gray-500">Prasarana</p>
                <p className="text-gray-900">{selectedRecord.prasarana?.nama || '-'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Desa/Kelurahan</p>
                  <p className="text-gray-900">{selectedRecord.desaKelurahan?.nama || '-'}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Kecamatan</p>
                  <p className="text-gray-900">{selectedRecord.desaKelurahan?.kecamatan?.nama || '-'}</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Tahun</p>
                  <p className="text-gray-900">{selectedRecord.year}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Kondisi</p>
                  <p className="text-gray-900">{selectedRecord.condition || '-'}</p>
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Alamat</p>
                <p className="text-gray-900">{selectedRecord.address || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status Kepemilikan</p>
                <p className="text-gray-900">{selectedRecord.ownershipStatus || '-'}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className={`text-gray-900 font-medium ${selectedRecord.isActive ? 'text-green-600' : 'text-red-600'}`}>
                  {selectedRecord.isActive ? 'Aktif' : 'Tidak Aktif'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Catatan</p>
                <p className="text-gray-900">{selectedRecord.notes || '-'}</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Tutup
              </button>
              <button
                onClick={() => {
                  setIsViewModalOpen(false);
                  handleEdit(selectedRecord.id);
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Edit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-bold text-gray-900">Import Data Prasarana</h2>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Format File</p>
                <p className="text-sm text-gray-600 mb-4">File harus berformat .xlsx atau .xls dengan kolom: Tahun, Prasarana, Desa/Kelurahan</p>
              </div>
              <div>
                <label className="block">
                  <div className="flex items-center justify-center w-full px-4 py-8 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">Klik untuk memilih file</p>
                      <p className="text-xs text-gray-500">atau drag & drop</p>
                    </div>
                    <input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileSelect}
                      disabled={importingFile}
                      className="hidden"
                    />
                  </div>
                </label>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded p-3">
                <p className="text-xs text-blue-700"><strong>Catatan:</strong> Pastikan kolom Tahun, Prasarana, dan Desa/Kelurahan sudah diisi</p>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 border-t flex justify-end gap-2">
              <button
                onClick={() => setIsImportModalOpen(false)}
                disabled={importingFile}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={importingFile}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 flex items-center"
              >
                <Upload className="w-4 h-4 mr-2" />
                {importingFile ? 'Mengimpor...' : 'Pilih File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Prasarana;
