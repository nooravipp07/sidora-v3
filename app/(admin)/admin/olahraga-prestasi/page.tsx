'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Download, Filter, Award, User } from 'lucide-react';

const OlahragaPrestasi: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

    const atletData = [
        {
        id: 1,
        namaLengkap: 'Ahmad Suharto',
        tempatLahir: 'Jakarta',
        tanggalLahir: '1995-05-15',
        jenisKelamin: 'Laki-laki',
        desa: 'Kelurahan Stadion',
        alamat: 'Jl. Merdeka No. 10, RT 01/RW 02',
        organisasiPembina: 'KONI',
        kategori: 'Atlet',
        cabangOlahraga: 'Sepak Bola',
        namaPrestasi: 'Juara 1 POPDA',
        kategoriPrestasi: 'Senior',
        jenisEvent: 'POPDA',
        medali: 'Emas',
        tahunPrestasi: '2023'
        },
        {
        id: 2,
        namaLengkap: 'Siti Nurhaliza',
        tempatLahir: 'Bandung',
        tanggalLahir: '1992-08-20',
        jenisKelamin: 'Perempuan',
        desa: 'Kelurahan Olahraga',
        alamat: 'Jl. Kemerdekaan No. 25, RT 02/RW 03',
        organisasiPembina: 'NPCI',
        kategori: 'Pelatih',
        cabangOlahraga: 'Renang',
        namaLisensi: 'Lisensi Pelatih Renang A',
        masaBerlaku: '2025-12-31',
        kategoriLisensi: 'Nasional',
        jenisEvent: 'PORDA',
        tahunLisensi: '2023'
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

    const baseFields = [
        { name: 'namaLengkap', label: 'Nama Lengkap', type: 'text', required: true },
        { name: 'tempatLahir', label: 'Tempat Lahir', type: 'text', required: true },
        { name: 'tanggalLahir', label: 'Tanggal Lahir', type: 'date', required: true },
        { name: 'jenisKelamin', label: 'Jenis Kelamin', type: 'select', options: ['Laki-laki', 'Perempuan'], required: true },
        { name: 'desa', label: 'Desa/Kelurahan', type: 'text', required: true },
        { name: 'alamat', label: 'Alamat Lengkap', type: 'textarea', required: true },
        { name: 'organisasiPembina', label: 'Organisasi Pembina', type: 'select', options: ['KONI', 'NPCI', 'BAPOPSI'], required: true },
        { name: 'kategori', label: 'Kategori', type: 'select', options: ['Atlet', 'Pelatih', 'Wasit-Juri'], required: true },
        { name: 'cabangOlahraga', label: 'Cabang Olahraga', type: 'select', options: ['Sepak Bola', 'Basket', 'Voli', 'Tenis', 'Badminton', 'Renang'], required: true },
        { name: 'foto', label: 'Foto', type: 'file', required: false }
    ];

    const atletFields = [
        { name: 'namaPrestasi', label: 'Nama Prestasi', type: 'text', required: true },
        { name: 'kategoriPrestasi', label: 'Kategori', type: 'select', options: ['Junior', 'Senior', 'Veteran'], required: true },
        { name: 'jenisEvent', label: 'Jenis Event', type: 'select', options: ['POPDA', 'PORDA', 'O2SN'], required: true },
        { name: 'medali', label: 'Medali', type: 'select', options: ['Emas', 'Perak', 'Perunggu'], required: true },
        { name: 'tahunPrestasi', label: 'Tahun', type: 'number', required: true }
    ];

    const pelatihFields = [
        { name: 'namaLisensi', label: 'Nama Lisensi', type: 'text', required: true },
        { name: 'masaBerlaku', label: 'Masa Berlaku', type: 'date', required: true },
        { name: 'kategoriLisensi', label: 'Kategori', type: 'select', options: ['Daerah', 'Nasional', 'Internasional'], required: true },
        { name: 'jenisEvent', label: 'Jenis Event', type: 'select', options: ['POPDA', 'PORDA', 'O2SN'], required: true },
        { name: 'tahunLisensi', label: 'Tahun', type: 'number', required: true }
    ];

    const wasitFields = [
        { name: 'namaLisensi', label: 'Nama Lisensi', type: 'text', required: true },
        { name: 'masaBerlaku', label: 'Masa Berlaku', type: 'date', required: true },
        { name: 'kategoriLisensi', label: 'Kategori', type: 'select', options: ['Daerah', 'Nasional', 'Internasional'], required: true },
        { name: 'jenisEvent', label: 'Jenis Event', type: 'select', options: ['POPDA', 'PORDA', 'O2SN'], required: true },
        { name: 'tahunLisensi', label: 'Tahun', type: 'number', required: true }
    ];

    const getFields = (kategori?: string) => {
        let fields = [...baseFields];
        
        if (kategori === 'Atlet') {
        fields = fields.concat(atletFields);
        } else if (kategori === 'Pelatih') {
        fields = fields.concat(pelatihFields);
        } else if (kategori === 'Wasit-Juri') {
        fields = fields.concat(wasitFields);
        }
        
        return fields;
    };

    return (
        <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Data Olahraga Prestasi</h1>
          <p className="text-gray-600">Kelola data atlet & tenaga keolahragaan</p>
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama Lengkap</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Kategori</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cabang Olahraga</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisasi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prestasi/Lisensi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tahun</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {atletData.map((atlet, index) => (
                  <tr key={atlet.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{atlet.namaLengkap}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full flex items-center ${
                        atlet.kategori === 'Atlet' ? 'bg-blue-100 text-blue-800' :
                        atlet.kategori === 'Pelatih' ? 'bg-green-100 text-green-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {atlet.kategori === 'Atlet' ? <Award className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                        {atlet.kategori}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{atlet.cabangOlahraga}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{atlet.organisasiPembina}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atlet.kategori === 'Atlet' ? atlet.namaPrestasi : atlet.namaLisensi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {atlet.kategori === 'Atlet' ? atlet.tahunPrestasi : atlet.tahunLisensi}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleView(atlet)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleEdit(atlet)}
                          className="text-green-600 hover:text-green-800"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(atlet.id)}
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

export default OlahragaPrestasi;