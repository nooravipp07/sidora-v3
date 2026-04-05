'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Eye, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuth';

interface FacilityRecordPhoto {
  id: number;
  fileUrl: string;
  fileName?: string;
  fileSize?: number;
  mimeType?: string;
  description?: string;
}

interface FacilityRecordStaging {
  id: number;
  desaKelurahan: { nama: string };
  prasarana: { nama: string };
  year: number;
  condition: string;
  address: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  photos?: FacilityRecordPhoto[];
  notes?: string;
  ownershipStatus?: string;
  isActive?: boolean;
}

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

const FacilityRecordPage: React.FC = () => {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [records, setRecords] = useState<FacilityRecordStaging[]>([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [selectedRecord, setSelectedRecord] = useState<FacilityRecordStaging | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [loadingDetail, setLoadingDetail] = useState(false);

  // Fetch facility records
  useEffect(() => {
    if (!authLoading && user) {
      fetchRecords(1);
    }
  }, [authLoading, user]);

  const fetchRecords = async (page: number) => {
    try {
      setLoading(true);
      const response = await fetch(
        `/api/staging/facility-record?page=${page}&limit=${pagination.limit}`
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
        const response = await fetch(`/api/staging/facility-record/${id}`, {
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

  const handleViewDetail = async (record: FacilityRecordStaging) => {
    setSelectedRecord(record);
    setLoadingDetail(true);
    try {
      const response = await fetch(`/api/staging/facility-record/${record.id}`);
      if (response.ok) {
        const data = await response.json();
        setSelectedRecord(data.data);
      }
    } catch (err) {
      console.error('Error fetching record detail:', err);
    } finally {
      setLoadingDetail(false);
      setIsViewModalOpen(true);
    }
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
        <h1 className="text-3xl font-bold text-gray-900">Data Fasilitas Input</h1>
        <p className="text-gray-600 mt-1">Kelola data fasilitas yang Anda submit untuk verifikasi</p>
      </div>

      {/* Header dengan tombol tambah */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => router.push('/admin/data-keolahragaan/facility-record/create')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
        >
          <Plus className="h-4 w-4" />
          Input Data Baru
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Desa/Kelurahan</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Jenis Prasarana</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Tahun</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Kondisi</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {records.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Belum ada data. <button onClick={() => router.push('/admin/data-keolahragaan/facility-record/create')} className="text-blue-600 hover:underline">Tambah data baru</button>
                </td>
              </tr>
            ) : (
              records.map(record => (
                <tr key={record.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm text-gray-900">{record.desaKelurahan.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.prasarana.nama}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.year}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.condition}</td>
                  <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleViewDetail(record)}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      {record.status === 'REJECTED' && (
                        <button
                          onClick={() => handleDelete(record.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Menampilkan {records.length} dari {pagination.total} data
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => fetchRecords(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">
              Halaman {pagination.page} dari {pagination.totalPages}
            </span>
            <button
              onClick={() => fetchRecords(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="p-2 border border-gray-300 rounded-lg disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* View Modal */}
      {isViewModalOpen && selectedRecord && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full mx-4 max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <h2 className="text-xl font-semibold text-gray-900">Detail Data Fasilitas</h2>
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              <dl className="grid grid-cols-2 gap-6">
                <div>
                  <dt className="text-sm font-medium text-gray-600">Desa/Kelurahan</dt>
                  <dd className="mt-1 text-base text-gray-900">{selectedRecord.desaKelurahan.nama}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Jenis Prasarana</dt>
                  <dd className="mt-1 text-base text-gray-900">{selectedRecord.prasarana.nama}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Tahun</dt>
                  <dd className="mt-1 text-base text-gray-900">{selectedRecord.year}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Kondisi</dt>
                  <dd className="mt-1 text-base text-gray-900">{selectedRecord.condition}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Status</dt>
                  <dd className="mt-1">{getStatusBadge(selectedRecord.status)}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-600">Tanggal Submit</dt>
                  <dd className="mt-1 text-base text-gray-900">
                    {new Date(selectedRecord.createdAt).toLocaleDateString('id-ID')}
                  </dd>
                </div>
                <div className="col-span-2">
                  <dt className="text-sm font-medium text-gray-600">Alamat</dt>
                  <dd className="mt-1 text-base text-gray-900">{selectedRecord.address}</dd>
                </div>
                {selectedRecord.status === 'REJECTED' && selectedRecord.rejectionReason && (
                  <div className="col-span-2 p-4 bg-red-50 border border-red-200 rounded-lg">
                    <dt className="text-sm font-medium text-red-900">Alasan Penolakan</dt>
                    <dd className="mt-1 text-base text-red-800">{selectedRecord.rejectionReason}</dd>
                  </div>
                )}
              </dl>

              {/* Photos Section */}
              {selectedRecord.photos && selectedRecord.photos.length > 0 && (
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Lampiran Foto ({selectedRecord.photos.length})</h3>
                  {loadingDetail ? (
                    <p className="text-sm text-gray-500">Memuat foto...</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                      {selectedRecord.photos.map(photo => (
                        <div
                          key={photo.id}
                          className="relative border border-gray-200 rounded-lg overflow-hidden bg-gray-50 group"
                        >
                          <img
                            src={photo.fileUrl}
                            alt={photo.fileName || 'Foto Fasilitas'}
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22%3E%3Crect fill=%22%23eee%22 width=%22100%22 height=%22100%22/%3E%3Ctext x=%2250%22 y=%2250%22 text-anchor=%22middle%22 dy=%22.3em%22 fill=%22%23999%22 font-size=%2212%22%3EError%3C/text%3E%3C/svg%3E';
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                            <a
                              href={photo.fileUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="opacity-0 group-hover:opacity-100 text-white text-xs font-medium px-2 py-1 bg-blue-600 rounded transition-opacity"
                            >
                              Lihat
                            </a>
                          </div>
                          {photo.fileName && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                              <p className="text-white text-xs truncate">{photo.fileName}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 flex justify-end p-6 border-t border-gray-200 bg-gray-50">
              <button
                onClick={() => setIsViewModalOpen(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FacilityRecordPage;
