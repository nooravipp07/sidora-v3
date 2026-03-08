'use client';

import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, History, Filter } from 'lucide-react';

const Verifikasi: React.FC = () => {

  const [activeTab, setActiveTab] = useState<'pending' | 'approved' | 'rejected'>('pending');

  const verificationData = [
    {
      id: 1,
      jenis: 'Pendaftaran Kecamatan',
      namaKecamatan: 'Kecamatan Utara',
      namaKepala: 'Budi Santoso',
      tanggalPengajuan: '2024-01-15',
      status: 'pending',
      dokumen: 'SK-Kecamatan-Utara.pdf',
      keterangan: 'Menunggu verifikasi dokumen SK'
    },
    {
      id: 2,
      jenis: 'Data Klub',
      namaKlub: 'Persija United',
      pengaju: 'Admin Kecamatan Utara',
      tanggalPengajuan: '2024-01-14',
      status: 'approved',
      dokumen: 'SK-Klub-Persija.pdf',
      keterangan: 'Dokumen lengkap dan valid'
    },
    {
      id: 3,
      jenis: 'Data Sarana',
      namaSarana: 'Lapangan Sepak Bola Baru',
      pengaju: 'Admin Kecamatan Selatan',
      tanggalPengajuan: '2024-01-13',
      status: 'rejected',
      dokumen: 'Dokumen-Sarana.pdf',
      keterangan: 'Dokumen tidak lengkap'
    }
  ];

  const pendingData = verificationData.filter(item => item.status === 'pending');
  const approvedData = verificationData.filter(item => item.status === 'approved');
  const rejectedData = verificationData.filter(item => item.status === 'rejected');

  const getCurrentData = () => {
    switch (activeTab) {
      case 'pending': return pendingData;
      case 'approved': return approvedData;
      case 'rejected': return rejectedData;
      default: return [];
    }
  };

  const handleApprove = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menyetujui data ini?')) {
      console.log('Approve data with id:', id);
    }
  };

  const handleReject = (id: number) => {
    const reason = prompt('Masukkan alasan penolakan:');
    if (reason) {
      console.log('Reject data with id:', id, 'Reason:', reason);
    }
  };

  const handleViewDetail = (id: number) => {
    console.log('View detail for id:', id);
  };

  return (
    <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Verifikasi Data</h1>
          <p className="text-gray-600">Kelola proses verifikasi data input kecamatan</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Menunggu Verifikasi</p>
                <p className="text-2xl font-bold text-gray-900">{pendingData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Disetujui</p>
                <p className="text-2xl font-bold text-gray-900">{approvedData.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm text-gray-600">Ditolak</p>
                <p className="text-2xl font-bold text-gray-900">{rejectedData.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('pending')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'pending'
                  ? 'bg-white text-yellow-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Pending ({pendingData.length})
            </button>
            <button
              onClick={() => setActiveTab('approved')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'approved'
                  ? 'bg-white text-green-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Approved ({approvedData.length})
            </button>
            <button
              onClick={() => setActiveTab('rejected')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'rejected'
                  ? 'bg-white text-red-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejected ({rejectedData.length})
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center">
            <History className="w-4 h-4 mr-2" />
            History
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis Data</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama/Identitas</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pengaju</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Keterangan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentData().map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.jenis}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaKecamatan || item.namaKlub || item.namaSarana}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.namaKepala || item.pengaju}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggalPengajuan}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        item.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        item.status === 'approved' ? 'bg-green-100 text-green-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {item.status === 'pending' ? 'Menunggu' :
                         item.status === 'approved' ? 'Disetujui' :
                         'Ditolak'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.keterangan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetail(item.id)}
                          className="text-blue-600 hover:text-blue-800"
                          title="Lihat Detail"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {item.status === 'pending' && (
                          <>
                            <button
                              onClick={() => handleApprove(item.id)}
                              className="text-green-600 hover:text-green-800"
                              title="Setujui"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleReject(item.id)}
                              className="text-red-600 hover:text-red-800"
                              title="Tolak"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {getCurrentData().length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Tidak ada data yang perlu diverifikasi</p>
              </div>
            </div>
          )}
        </div>
      </div>
  );
};

export default Verifikasi;
