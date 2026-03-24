'use client';

import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { CheckCircle, XCircle, Clock, Eye, Filter, ChevronLeft, ChevronRight, Download } from 'lucide-react';

interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

interface Registration {
  id: number;
  name: string;
  email: string;
  nip: string;
  namaLengkap: string;
  noTelepon: string;
  kecamatan: { id: number; nama: string };
  status: number; // 1 = PENDING, 2 = APPROVE, 3 = REJECT
  createdAt: string;
  verifiedAt?: string;
  rejectReason?: string;
  docUrl: string;
}

const Verifikasi: React.FC = () => {
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectingId, setRejectingId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    status: '',
    search: '',
  });

  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    hasMore: false,
  });

  // Fetch registrations
  useEffect(() => {
    fetchRegistrations(1);
  }, [filters]);

  const fetchRegistrations = async (page: number = 1) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      params.append('page', page.toString());
      params.append('limit', '10');
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const response = await fetch(`/api/registration?${params.toString()}`);
      if (!response.ok) throw new Error('Gagal mengambil data');
      const data = await response.json();
      setRegistrations(data.data || []);
      setPagination(data.meta);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal mengambil data registrasi');
      console.error('Error fetching registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    const result = await Swal.fire({
      title: 'Konfirmasi',
      text: 'Apakah Anda yakin ingin menyetujui pendaftaran ini dan membuat akun baru?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10b981',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Ya, Setujui',
      cancelButtonText: 'Batal'
    });

    if (!result.isConfirmed) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/registration/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          verifiedBy: 1, // should be current user ID
        }),
      });

      if (!response.ok) throw new Error('Gagal menyetujui');
      const result = await response.json();

      // Update local state
      setRegistrations(registrations.map(r => r.id === id ? result.data : r));
      setIsViewModalOpen(false);
      setSelectedRegistration(null);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Pendaftaran disetujui dan akun baru telah dibuat',
        confirmButtonColor: '#3b82f6'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : 'Gagal menyetujui pendaftaran',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectClick = (id: number) => {
    setRejectingId(id);
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const handleRejectSubmit = async () => {
    if (!rejectReason.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Validasi',
        text: 'Alasan penolakan tidak boleh kosong',
        confirmButtonColor: '#ef4444'
      });
      return;
    }

    if (!rejectingId) return;

    setIsProcessing(true);
    try {
      const response = await fetch(`/api/registration/${rejectingId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          rejectReason,
          verifiedBy: 1, // should be current user ID
        }),
      });

      if (!response.ok) throw new Error('Gagal menolak');
      const result = await response.json();

      // Update local state
      setRegistrations(registrations.map(r => r.id === rejectingId ? result.data : r));
      setIsViewModalOpen(false);
      setSelectedRegistration(null);
      setIsRejectModalOpen(false);
      setRejectReason('');
      setRejectingId(null);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Pendaftaran telah ditolak',
        confirmButtonColor: '#3b82f6'
      });
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: err instanceof Error ? err.message : 'Gagal menolak pendaftaran',
        confirmButtonColor: '#ef4444'
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusBadge = (status: number) => {
    switch (status) {
      case 1:
        return { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-800' };
      case 2:
        return { label: 'Disetujui', color: 'bg-green-100 text-green-800' };
      case 3:
        return { label: 'Ditolak', color: 'bg-red-100 text-red-800' };
      default:
        return { label: 'Unknown', color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handlePrevPage = () => {
    if (pagination.page > 1) {
      const prevPage = pagination.page - 1;
      setPagination(prev => ({ ...prev, page: prevPage }));
      fetchRegistrations(prevPage);
    }
  };

  const handleNextPage = () => {
    if (pagination.hasMore) {
      const nextPage = pagination.page + 1;
      setPagination(prev => ({ ...prev, page: nextPage }));
      fetchRegistrations(nextPage);
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
      status: '',
      search: '',
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  return (
    <div className="p-6 bg-white min-h-screen">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Verifikasi Pendaftaran</h1>
        <p className="text-gray-600">Kelola proses verifikasi pendaftaran anggota yang masuk</p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-yellow-600">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Menunggu Verifikasi</p>
              <p className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 1).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-green-600">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Disetujui</p>
              <p className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 2).length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg shadow-sm p-6 border-l-4 border-red-600">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Ditolak</p>
              <p className="text-2xl font-bold text-gray-900">{registrations.filter(r => r.status === 3).length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 mb-6">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Semua Status --</option>
                <option value="1">Menunggu Verifikasi</option>
                <option value="2">Disetujui</option>
                <option value="3">Ditolak</option>
              </select>
            </div>

            {/* Search Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cari (Nama/Email/NIP)
              </label>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                placeholder="Masukkan nama, email atau NIP"
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
        ) : registrations.length === 0 ? (
          <div className="p-8 text-center text-gray-600">
            Belum ada data pendaftaran
          </div>
        ) : (
          <>
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">NIP</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Kecamatan</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Tanggal Daftar</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {registrations.map((reg, index) => {
                  const statusBadge = getStatusBadge(reg.status);
                  return (
                    <tr key={reg.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-600">{(pagination.page - 1) * 10 + index + 1}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-medium">{reg.namaLengkap}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.nip}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.email}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{reg.kecamatan?.nama}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {new Date(reg.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${statusBadge.color}`}>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setSelectedRegistration(reg);
                              setIsViewModalOpen(true);
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Lihat Detail"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {reg.status === 1 && (
                            <>
                              <button
                                onClick={() => handleApprove(reg.id)}
                                disabled={isProcessing}
                                className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Setujui"
                              >
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleRejectClick(reg.id)}
                                disabled={isProcessing}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Tolak"
                              >
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {/* Pagination */}
            {registrations.length > 0 && (
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
      {isViewModalOpen && selectedRegistration && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Detail Pendaftaran</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <p className="text-sm text-gray-600">Nama Lengkap</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.namaLengkap}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">NIP</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.nip}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Nomor Telepon</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.noTelepon}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Kecamatan</p>
                <p className="font-semibold text-gray-900">{selectedRegistration.kecamatan?.nama}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Tanggal Pendaftaran</p>
                <p className="font-semibold text-gray-900">
                  {new Date(selectedRegistration.createdAt).toLocaleDateString('id-ID')}
                </p>
              </div>
              {selectedRegistration.verifiedAt && (
                <div>
                  <p className="text-sm text-gray-600">Tanggal Verifikasi</p>
                  <p className="font-semibold text-gray-900">
                    {new Date(selectedRegistration.verifiedAt).toLocaleDateString('id-ID')}
                  </p>
                </div>
              )}
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className={`font-semibold ${getStatusBadge(selectedRegistration.status).color}`}>
                  {getStatusBadge(selectedRegistration.status).label}
                </p>
              </div>

              {selectedRegistration.rejectReason && (
                <div className="md:col-span-2">
                  <p className="text-sm text-gray-600">Alasan Penolakan</p>
                  <p className="font-semibold text-red-600">{selectedRegistration.rejectReason}</p>
                </div>
              )}
            </div>

            {/* Document Section */}
            {selectedRegistration.docUrl && (
              <div className="mb-6 pb-6 border-b border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Dokumen SK</p>
                <a
                  href={selectedRegistration.docUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
                >
                  <Download className="w-4 h-4" />
                  Download Dokumen
                </a>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end">
              {selectedRegistration.status === 1 && (
                <>
                  <button
                    onClick={() => handleApprove(selectedRegistration.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    Setujui
                  </button>
                  <button
                    onClick={() => handleRejectClick(selectedRegistration.id)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    Tolak
                  </button>
                </>
              )}
              <button
                onClick={() => setIsViewModalOpen(false)}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejectModalOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Form Penolakan Pendaftaran</h2>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alasan Penolakan *
              </label>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                placeholder="Masukkan alasan penolakan data ini..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                rows={5}
              />
              <p className="text-xs text-gray-500 mt-1">
                {rejectReason.length}/500 karakter
              </p>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setIsRejectModalOpen(false);
                  setRejectReason('');
                  setRejectingId(null);
                }}
                disabled={isProcessing}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold disabled:opacity-50"
              >
                Batal
              </button>
              <button
                onClick={handleRejectSubmit}
                disabled={isProcessing || !rejectReason.trim()}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold disabled:opacity-50 flex items-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Memproses...
                  </>
                ) : (
                  'Tolak Pendaftaran'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Verifikasi;
