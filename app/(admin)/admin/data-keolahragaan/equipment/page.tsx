'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Trash2, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface EquipmentStaging {
  id: number;
  saranaName: string;
  quantity: number;
  unit?: string;
  isUsable: boolean;
  isGovernmentGrant: boolean;
  year?: number;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  updatedAt?: string;
  desaKelurahanName: string;
  kecamatanName: string;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const EquipmentPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [records, setRecords] = useState<EquipmentStaging[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [selectedRecord, setSelectedRecord] = useState<EquipmentStaging | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch equipment records
  useEffect(() => {
    if (!authLoading && user) {
      fetchRecords(1);
    }
  }, [authLoading, user]);

  const fetchRecords = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/staging/equipment?page=${page}&limit=${pagination.limit}`
      );

      if (response.ok) {
        const data = await response.json();
        setRecords(data.data || []);
        setPagination(prev => ({
          ...prev,
          ...data.meta,
          page,
        }));
      }
    } catch (err) {
      console.error('Error fetching records:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      try {
        const response = await fetch(`/api/staging/equipment/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setRecords(records.filter(r => r.id !== id));
        }
      } catch (err) {
        console.error('Error deleting record:', err);
      }
    }
  };

  const handleViewDetail = async (record: EquipmentStaging) => {
    setSelectedRecord(record);
    setLoadingDetail(true);
    try {
      const response = await fetch(`/api/staging/equipment/${record.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedRecord(data);
      }
    } catch (err) {
      console.error('Error fetching record detail:', err);
    } finally {
      setLoadingDetail(false);
      setIsViewModalOpen(true);
    }
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/data-keolahragaan/equipment/${id}/edit`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">Menunggu</span>;
      case 'APPROVED':
        return <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">Disetujui</span>;
      case 'REJECTED':
        return <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Ditolak</span>;
      default:
        return null;
    }
  };

  if (authLoading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Peralatan Input</h1>
        <p className="text-gray-600 mt-1">Kelola data peralatan yang Anda submit untuk verifikasi</p>
      </div>

      {/* Header dengan tombol tambah */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push('/admin/data-keolahragaan/equipment/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-4 w-4" />
          Tambah Peralatan
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Sarana
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Kondisi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hibah Pemerintah
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Lokasi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal Dibuat
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2">Memuat...</span>
                    </div>
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    Belum ada data peralatan
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.saranaName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.quantity} {record.unit || 'unit'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.isUsable ? 'Layak Pakai' : 'Tidak Layak Pakai'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.isGovernmentGrant ? 'Ya' : 'Tidak'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.desaKelurahanName}, {record.kecamatanName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(record.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => handleViewDetail(record)}
                          className="text-blue-600 hover:text-blue-900 p-1"
                          title="Lihat Detail"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {record.status === 'REJECTED' && (
                          <button
                            onClick={() => handleEdit(record.id)}
                            className="text-green-600 hover:text-green-900 p-1"
                            title="Edit dan Submit Ulang"
                          >
                            <Edit3 className="h-4 w-4" />
                          </button>
                        )}
                        {record.status === 'PENDING' && (
                          <button
                            onClick={() => handleDelete(record.id)}
                            className="text-red-600 hover:text-red-900 p-1"
                            title="Hapus"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <div className="text-sm text-gray-700">
            Menampilkan {((pagination.page - 1) * pagination.limit) + 1} sampai{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} dari{' '}
            {pagination.total} hasil
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRecords(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
              Sebelumnya
            </button>
            <span className="px-3 py-2 text-sm font-medium text-gray-700">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchRecords(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Selanjutnya
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-900">Detail Peralatan</h2>
                <button
                  onClick={() => setIsViewModalOpen(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>

              {loadingDetail ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-2">Memuat detail...</span>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Sarana</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRecord.saranaName}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Jumlah</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRecord.quantity} {selectedRecord.unit || 'unit'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Kondisi</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRecord.isUsable ? 'Layak Pakai' : 'Tidak Layak Pakai'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Hibah Pemerintah</label>
                      <p className="mt-1 text-sm text-gray-900">
                        {selectedRecord.isGovernmentGrant ? 'Ya' : 'Tidak'}
                      </p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Tahun</label>
                      <p className="mt-1 text-sm text-gray-900">{selectedRecord.year || '-'}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <div className="mt-1">{getStatusBadge(selectedRecord.status)}</div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Lokasi</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {selectedRecord.desaKelurahanName}, {selectedRecord.kecamatanName}
                    </p>
                  </div>

                  {selectedRecord.status === 'REJECTED' && selectedRecord.rejectionReason && (
                    <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <label className="block text-sm font-medium text-red-900">Alasan Penolakan</label>
                      <p className="mt-2 text-sm text-red-800">{selectedRecord.rejectionReason}</p>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Tanggal Dibuat</label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(selectedRecord.createdAt).toLocaleString('id-ID')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EquipmentPage;