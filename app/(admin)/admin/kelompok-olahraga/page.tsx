'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Download, Filter, CheckCircle, XCircle } from 'lucide-react';

const KelompokOlahraga: React.FC = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

    const klubData = [
    {
      id: 1,
      cabangOlahraga: 'Sepak Bola',
      namaKlub: 'Persija United',
      namaKetua: 'Budi Santoso',
      jumlahAnggota: 25,
      verifikasi: 'Ya',
      nomorSK: 'SK/001/2023',
      alamatSekretariat: 'Jl. Olahraga No. 15, Kota',
      tahun: '2023',
      kecamatan: 'Kecamatan Utara',
      desa: 'Kelurahan Stadion'
    },
    {
      id: 2,
      cabangOlahraga: 'Basket',
      namaKlub: 'Satria Basket Club',
      namaKetua: 'Siti Aminah',
      jumlahAnggota: 18,
      verifikasi: 'Tidak',
      nomorSK: '-',
      alamatSekretariat: 'Jl. Basket No. 8, Kota',
      tahun: '2023',
      kecamatan: 'Kecamatan Selatan',
      desa: 'Kelurahan Olahraga'
    }
  ];

  const handleCreate = () => {
    setSelectedData(null);
    setModalMode('create');
    setIsModalOpen(true);
  };

  const handleEdit = (data: any) => {
    setSelectedData(data);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleView = (data: any) => {
    setSelectedData(data);
    setModalMode('view');
    setIsModalOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      console.log('Delete data with id:', id);
    }
  };

  return (
    <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Data Kelompok/Klub Olahraga</h1>
          <p className="text-gray-600">Kelola data klub olahraga per kecamatan</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-4 mb-6">
          <button
            onClick={handleCreate}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Tambah Data
          </button>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export Excel
          </button>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center">
            <Download className="w-4 h-4 mr-2" />
            Export PDF
          </button>
          <button className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors flex items-center">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang Olahraga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Klub</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ketua</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Anggota</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Verifikasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {klubData.map((klub, index) => (
                  <tr key={klub.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{klub.cabangOlahraga}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{klub.namaKlub}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{klub.namaKetua}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{klub.jumlahAnggota}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {klub.verifikasi === 'Ya' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                          klub.verifikasi === 'Ya' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {klub.verifikasi}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{klub.kecamatan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{klub.tahun}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(klub)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(klub)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(klub.id)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
  );
};

export default KelompokOlahraga;
