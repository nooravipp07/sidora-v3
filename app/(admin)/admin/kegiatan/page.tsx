'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Download, Filter, FileText, Image, Calendar } from 'lucide-react';

const Kegiatan: React.FC = () => {

  const [activeTab, setActiveTab] = useState<'berita' | 'galeri' | 'agenda'>('berita');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedData, setSelectedData] = useState<any>(null);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

  const beritaData = [
    {
      id: 1,
      judul: 'Kejuaraan Daerah Bulu Tangkis 2024',
      title: 'Turnamen Prestasi Tingkat Daerah',
      kategori: 'Trending',
      deskripsi: 'Kejuaraan bulu tangkis tingkat daerah dengan partisipasi 150 atlet dari berbagai kecamatan.',
      tanggal: '2024-01-15',
      gambar: 'badminton-tournament.jpg'
    },
    {
      id: 2,
      judul: 'Pembangunan Lapangan Sepak Bola',
      title: 'Fasilitas Olahraga Baru',
      kategori: 'Latest',
      deskripsi: 'Pembangunan lapangan sepak bola baru dengan anggaran 2.5 miliar rupiah.',
      tanggal: '2024-01-12',
      gambar: 'football-field.jpg'
    }
  ];

  const galeriData = [
    {
      id: 1,
      judul: 'Kejuaraan Renang Daerah',
      title: 'Dokumentasi Event Renang',
      gambar: 'swimming-championship.jpg',
      tanggal: '2023-12-20',
      terkaitBerita: 'Kejuaraan Renang Daerah 2023'
    },
    {
      id: 2,
      judul: 'Turnamen Basket Antar Sekolah',
      title: 'Kompetisi Basket Pelajar',
      gambar: 'basketball-tournament.jpg',
      tanggal: '2023-12-18',
      terkaitBerita: 'Turnamen Basket SMA'
    }
  ];

  const agendaData = [
    {
      id: 1,
      judul: 'Kejuaraan Tenis Meja Regional',
      title: 'Turnamen Tenis Meja Tingkat Regional',
      kategori: 'Trending',
      deskripsi: 'Turnamen tenis meja dengan hadiah total 50 juta rupiah.',
      tanggal: '2024-02-25',
      gambar: 'table-tennis.jpg',
      linkEvent: '/event/tenis-meja-regional'
    },
    {
      id: 2,
      judul: 'Pelatihan Wasit Sepak Bola',
      title: 'Workshop Wasit Berlisensi',
      kategori: 'Latest',
      deskripsi: 'Workshop pelatihan wasit sepak bola dengan instruktur berpengalaman.',
      tanggal: '2024-02-20',
      gambar: 'referee-training.jpg',
      linkEvent: '/event/wasit-sepakbola'
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

  const beritaFields = [
    { name: 'judul', label: 'Judul', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'kategori', label: 'Kategori', type: 'select', options: ['Trending', 'Latest', 'Popular'], required: true },
    { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
    { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
    { name: 'gambar', label: 'Gambar', type: 'file', required: false },
    { name: 'video', label: 'Video', type: 'file', required: false }
  ];

  const galeriFields = [
    { name: 'judul', label: 'Judul', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'gambar', label: 'Gambar', type: 'file', required: true },
    { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
    { name: 'terkaitBerita', label: 'Terkait dengan Berita', type: 'text', required: false }
  ];

  const agendaFields = [
    { name: 'judul', label: 'Judul', type: 'text', required: true },
    { name: 'title', label: 'Title', type: 'text', required: true },
    { name: 'kategori', label: 'Kategori', type: 'select', options: ['Trending', 'Latest', 'Popular'], required: true },
    { name: 'deskripsi', label: 'Deskripsi', type: 'textarea', required: true },
    { name: 'tanggal', label: 'Tanggal', type: 'date', required: true },
    { name: 'gambar', label: 'Gambar', type: 'file', required: false },
    { name: 'video', label: 'Video', type: 'file', required: false },
    { name: 'linkEvent', label: 'Link Event', type: 'text', required: false }
  ];

  const getCurrentData = () => {
    switch (activeTab) {
      case 'berita': return beritaData;
      case 'galeri': return galeriData;
      case 'agenda': return agendaData;
      default: return [];
    }
  };

  const getCurrentFields = () => {
    switch (activeTab) {
      case 'berita': return beritaFields;
      case 'galeri': return galeriFields;
      case 'agenda': return agendaFields;
      default: return [];
    }
  };

  const getModalTitle = () => {
    const type = activeTab === 'berita' ? 'Berita' : activeTab === 'galeri' ? 'Galeri' : 'Agenda';
    return modalMode === 'create' ? `Tambah ${type}` :
           modalMode === 'edit' ? `Edit ${type}` :
           `Detail ${type}`;
  };

  return (
    <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Kelola Kegiatan</h1>
          <p className="text-gray-600">Manajemen berita, galeri, dan agenda kegiatan</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('berita')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'berita'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <FileText className="w-4 h-4 mr-2" />
              Berita
            </button>
            <button
              onClick={() => setActiveTab('galeri')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'galeri'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Image className="w-4 h-4 mr-2" />
              Galeri
            </button>
            <button
              onClick={() => setActiveTab('agenda')}
              className={`flex items-center px-4 py-2 rounded-md transition-colors ${
                activeTab === 'agenda'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Calendar className="w-4 h-4 mr-2" />
              Agenda
            </button>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                  {activeTab !== 'galeri' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal</th>
                  {activeTab === 'galeri' && (
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Terkait Berita</th>
                  )}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {getCurrentData().map((item, index) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.judul}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.title}</td>
                    {activeTab !== 'galeri' && (
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          (item as any).kategori === 'Trending' ? 'bg-red-100 text-red-800' :
                          (item as any).kategori === 'Latest' ? 'bg-blue-100 text-blue-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {(item as any).kategori}
                        </span>
                      </td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.tanggal}</td>
                    {activeTab === 'galeri' && (
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{(item as any).terkaitBerita}</td>
                    )}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(item)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
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
  );
};

export default Kegiatan;
