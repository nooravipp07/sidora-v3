'use client';

import React, { FC, useState } from 'react';
import { Plus, Edit, Trash2, Database, Settings, MapPin, Trophy, Users, Building } from 'lucide-react';
import DataModal from '../../../../lib/admin/DataModal';

const MasterData: FC = () => {
  const [activeTab, setActiveTab] = useState<'cabang' | 'tipe' | 'organisasi' | 'wilayah' | 'status'>('cabang');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const cabangData = [
    { id: 1, nama: 'Sepak Bola', kode: 'SB', deskripsi: 'Olahraga sepak bola' },
    { id: 2, nama: 'Basket', kode: 'BS', deskripsi: 'Olahraga basket' },
    { id: 3, nama: 'Voli', kode: 'VL', deskripsi: 'Olahraga voli' },
    { id: 4, nama: 'Badminton', kode: 'BM', deskripsi: 'Olahraga badminton' },
    { id: 5, nama: 'Tenis', kode: 'TN', deskripsi: 'Olahraga tenis' }
  ];

  const tipeData = [
    { id: 1, nama: 'Lapangan Sepak Bola', kategori: 'Lapangan', deskripsi: 'Lapangan untuk sepak bola' },
    { id: 2, nama: 'Gedung Olahraga', kategori: 'Gedung', deskripsi: 'Gedung serbaguna olahraga' },
    { id: 3, nama: 'Kolam Renang', kategori: 'Kolam', deskripsi: 'Fasilitas renang' },
    { id: 4, nama: 'Lapangan Basket', kategori: 'Lapangan', deskripsi: 'Lapangan khusus basket' }
  ];

  const organisasiData = [
    { id: 1, nama: 'KONI', namaLengkap: 'Komite Olahraga Nasional Indonesia', tipe: 'Nasional' },
    { id: 2, nama: 'NPCI', namaLengkap: 'National Paralympic Committee of Indonesia', tipe: 'Nasional' },
    { id: 3, nama: 'BAPOPSI', namaLengkap: 'Badan Pembina Olahraga Pelajar Seluruh Indonesia', tipe: 'Pelajar' }
  ];

  const wilayahData = [
    { id: 1, kecamatan: 'Kecamatan Utara', jumlahDesa: 12, luasWilayah: '25.5 km²' },
    { id: 2, kecamatan: 'Kecamatan Selatan', jumlahDesa: 15, luasWilayah: '30.2 km²' },
    { id: 3, kecamatan: 'Kecamatan Timur', jumlahDesa: 10, luasWilayah: '22.8 km²' },
    { id: 4, kecamatan: 'Kecamatan Barat', jumlahDesa: 8, luasWilayah: '18.3 km²' }
  ];

  const statusData = [
    { id: 1, nama: 'Sangat Baik', warna: 'Hijau', deskripsi: 'Kondisi fasilitas sangat baik' },
    { id: 2, nama: 'Baik', warna: 'Biru', deskripsi: 'Kondisi fasilitas baik' },
    { id: 3, nama: 'Rusak Ringan', warna: 'Kuning', deskripsi: 'Kondisi fasilitas rusak ringan' },
    { id: 4, nama: 'Rusak Berat', warna: 'Merah', deskripsi: 'Kondisi fasilitas rusak berat' }
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

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) {
      console.log('Delete data with id:', id);
    }
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'cabang': return cabangData;
      case 'tipe': return tipeData;
      case 'organisasi': return organisasiData;
      case 'wilayah': return wilayahData;
      case 'status': return statusData;
      default: return [];
    }
  };

  const getCurrentFields = (): any[] => {
    switch (activeTab) {
      case 'cabang':
        return [
          { name: 'nama', label: 'Nama Cabang', type: 'text' as const, required: true },
          { name: 'kode', label: 'Kode', type: 'text' as const, required: true },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' as const, required: false }
        ];
      case 'tipe':
        return [
          { name: 'nama', label: 'Nama Tipe', type: 'text' as const, required: true },
          { name: 'kategori', label: 'Kategori', type: 'select' as const, options: ['Lapangan', 'Gedung', 'Kolam', 'Lainnya'], required: true },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' as const, required: false }
        ];
      case 'organisasi':
        return [
          { name: 'nama', label: 'Nama Singkat', type: 'text' as const, required: true },
          { name: 'namaLengkap', label: 'Nama Lengkap', type: 'text' as const, required: true },
          { name: 'tipe', label: 'Tipe', type: 'select' as const, options: ['Nasional', 'Pelajar', 'Masyarakat'], required: true }
        ];
      case 'wilayah':
        return [
          { name: 'kecamatan', label: 'Nama Kecamatan', type: 'text' as const, required: true },
          { name: 'jumlahDesa', label: 'Jumlah Desa', type: 'number' as const, required: true },
          { name: 'luasWilayah', label: 'Luas Wilayah', type: 'text' as const, required: true }
        ];
      case 'status':
        return [
          { name: 'nama', label: 'Nama Status', type: 'text' as const, required: true },
          { name: 'warna', label: 'Warna', type: 'select' as const, options: ['Hijau', 'Biru', 'Kuning', 'Merah'], required: true },
          { name: 'deskripsi', label: 'Deskripsi', type: 'textarea' as const, required: false }
        ];
      default:
        return [];
    }
  };

  const getModalTitle = () => {
    const titles = {
      cabang: 'Cabang Olahraga',
      tipe: 'Tipe Sarana',
      organisasi: 'Organisasi Pembina',
      wilayah: 'Wilayah',
      status: 'Status Kondisi'
    };
    const title = titles[activeTab];
    return modalMode === 'create' ? `Tambah ${title}` : `Edit ${title}`;
  };

  const tabIcons = {
    cabang: Trophy,
    tipe: Building,
    organisasi: Users,
    wilayah: MapPin,
    status: Settings
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Master Data</h1>
          <p className="text-gray-600">Kelola data master sistem</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2 bg-gray-100 p-2 rounded-lg">
            {Object.entries(tabIcons).map(([key, Icon]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                  activeTab === key
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {key === 'cabang' ? 'Cabang Olahraga' :
                 key === 'tipe' ? 'Tipe Sarana' :
                 key === 'organisasi' ? 'Organisasi' :
                 key === 'wilayah' ? 'Wilayah' :
                 'Status Kondisi'}
              </button>
            ))}
          </div>
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
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">No</th>
                  {activeTab === 'cabang' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Cabang</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kode</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    </>
                  )}
                  {activeTab === 'tipe' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Tipe</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    </>
                  )}
                  {activeTab === 'organisasi' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Singkat</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipe</th>
                    </>
                  )}
                  {activeTab === 'wilayah' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kecamatan</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jumlah Desa</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Luas Wilayah</th>
                    </>
                  )}
                  {activeTab === 'status' && (
                    <>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Warna</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Deskripsi</th>
                    </>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentData().map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    {activeTab === 'cabang' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kode}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.deskripsi}</td>
                      </>
                    )}
                    {activeTab === 'tipe' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.kategori}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.deskripsi}</td>
                      </>
                    )}
                    {activeTab === 'organisasi' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.namaLengkap}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tipe}</td>
                      </>
                    )}
                    {activeTab === 'wilayah' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.kecamatan}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.jumlahDesa}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.luasWilayah}</td>
                      </>
                    )}
                    {activeTab === 'status' && (
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.nama}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            item.warna === 'Hijau' ? 'bg-green-100 text-green-800' :
                            item.warna === 'Biru' ? 'bg-blue-100 text-blue-800' :
                            item.warna === 'Kuning' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {item.warna}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.deskripsi}</td>
                      </>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
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

      {/* Modal */}
      {isModalOpen && (
        <DataModal
          title={getModalTitle()}
          fields={getCurrentFields()}
          data={selectedData}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => {
            console.log('Save data:', data);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default MasterData;
