'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Download, Filter } from 'lucide-react';

const Sarana: React.FC = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const saranaData = [
    {
      id: 1,
      nama: 'Lapangan Sepak Bola Utama',
      tipe: 'Lapangan Sepak Bola',
      status: 'Pemerintah',
      pemilik: 'Pemerintah Kota',
      ukuran: '100x70 meter',
      kondisi: 'Baik',
      longitude: '110.3695',
      latitude: '-7.7956',
      alamat: 'Jl. Stadion No. 1, Kota',
      tahun: '2020',
      kecamatan: 'Kecamatan Utara',
      desa: 'Kelurahan Stadion'
    },
    {
      id: 2,
      nama: 'GOR Basket Indoor',
      tipe: 'Gedung Olahraga',
      status: 'Swasta',
      pemilik: 'PT. Olahraga Sejahtera',
      ukuran: '28x15 meter',
      kondisi: 'Sangat Baik',
      longitude: '110.3712',
      latitude: '-7.7845',
      alamat: 'Jl. Olahraga No. 25, Kota',
      tahun: '2022',
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

  const fields = [
    { name: 'nama', label: 'Nama Sarana', type: 'text', required: true },
    { name: 'tipe', label: 'Tipe Sarana', type: 'select', options: ['Lapangan Sepak Bola', 'Gedung Olahraga', 'Lapangan Basket', 'Lapangan Tennis', 'Kolam Renang'], required: true },
    { name: 'status', label: 'Status Kepemilikan', type: 'select', options: ['Pemerintah', 'Swasta', 'Hibah'], required: true },
    { name: 'pemilik', label: 'Nama Pemilik', type: 'text', required: true },
    { name: 'ukuran', label: 'Ukuran', type: 'text', required: true },
    { name: 'kondisi', label: 'Status Kondisi', type: 'select', options: ['Sangat Baik', 'Baik', 'Rusak Ringan', 'Rusak Berat'], required: true },
    { name: 'kecamatan', label: 'Kecamatan', type: 'select', options: ['Kecamatan Utara', 'Kecamatan Selatan', 'Kecamatan Timur', 'Kecamatan Barat'], required: true },
    { name: 'desa', label: 'Desa/Kelurahan', type: 'text', required: true },
    { name: 'longitude', label: 'Longitude', type: 'text', required: true },
    { name: 'latitude', label: 'Latitude', type: 'text', required: true },
    { name: 'alamat', label: 'Alamat', type: 'textarea', required: true },
    { name: 'tahun', label: 'Tahun', type: 'number', required: true },
    { name: 'foto', label: 'Foto Sarana', type: 'file', required: false }
  ];

  return (
    <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Data Sarana Olahraga</h1>
          <p className="text-gray-600">Kelola data sarana olahraga per kecamatan</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Sarana</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kondisi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {saranaData.map((sarana, index) => (
                  <tr key={sarana.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{sarana.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sarana.tipe}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sarana.status === 'Pemerintah' ? 'bg-blue-100 text-blue-800' :
                        sarana.status === 'Swasta' ? 'bg-green-100 text-green-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {sarana.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        sarana.kondisi === 'Sangat Baik' ? 'bg-green-100 text-green-800' :
                        sarana.kondisi === 'Baik' ? 'bg-blue-100 text-blue-800' :
                        sarana.kondisi === 'Rusak Ringan' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {sarana.kondisi}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sarana.kecamatan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sarana.tahun}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(sarana)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(sarana)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(sarana.id)}
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

export default Sarana;
