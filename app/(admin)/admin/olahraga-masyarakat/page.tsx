'use client';

import React, { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Download, Filter, Award, User } from 'lucide-react';

const OlahragaMasyarakat: React.FC = () => {

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedData, setSelectedData] = useState<any>(null);
    const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create');

    const masyarakatData = [
        {
            id: 1,
            namaLengkap: 'Budi Prasetyo',
            tempatLahir: 'Surabaya',
            tanggalLahir: '1990-03-10',
            jenisKelamin: 'Laki-laki',
            desa: 'Kelurahan Masyarakat',
            alamat: 'Jl. Rakyat No. 20, RT 03/RW 05',
            organisasiPembina: 'KONI',
            indukOlahraga: 'PBSI',
            kategori: 'Atlet',
            cabangOlahraga: 'Badminton',
            namaPrestasi: 'Juara 2 Turnamen Lokal',
            kategoriPrestasi: 'Senior',
            jenisEvent: 'Turnamen Lokal',
            medali: 'Perak',
            tahunPrestasi: '2023'
        },
        {
        id: 2,
            namaLengkap: 'Dewi Sartika',
            tempatLahir: 'Yogyakarta',
            tanggalLahir: '1988-11-15',
            jenisKelamin: 'Perempuan',
            desa: 'Kelurahan Rakyat',
            alamat: 'Jl. Gotong Royong No. 15, RT 01/RW 02',
            organisasiPembina: 'NPCI',
            indukOlahraga: 'PBVSI',
            kategori: 'Pelatih',
            cabangOlahraga: 'Voli',
            namaLisensi: 'Lisensi Pelatih Voli B',
            masaBerlaku: '2024-12-31',
            kategoriLisensi: 'Daerah',
            jenisEvent: 'Turnamen Daerah',
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
        { name: 'indukOlahraga', label: 'Induk Olahraga', type: 'select', options: ['PSSI', 'PBSI', 'PBVSI', 'PERBASI', 'PRSI'], required: true },
        { name: 'kategori', label: 'Kategori', type: 'select', options: ['Atlet', 'Pelatih', 'Wasit-Juri'], required: true },
        { name: 'cabangOlahraga', label: 'Cabang Olahraga', type: 'select', options: ['Sepak Bola', 'Basket', 'Voli', 'Tenis', 'Badminton', 'Renang'], required: true },
        { name: 'foto', label: 'Foto', type: 'file', required: false }
    ];

    const atletFields = [
        { name: 'namaPrestasi', label: 'Nama Prestasi', type: 'text', required: true },
        { name: 'kategoriPrestasi', label: 'Kategori', type: 'select', options: ['Junior', 'Senior', 'Veteran'], required: true },
        { name: 'jenisEvent', label: 'Jenis Event', type: 'select', options: ['Turnamen Lokal', 'Turnamen Daerah', 'Turnamen Nasional'], required: true },
        { name: 'medali', label: 'Medali', type: 'select', options: ['Emas', 'Perak', 'Perunggu'], required: true },
        { name: 'tahunPrestasi', label: 'Tahun', type: 'number', required: true }
    ];

    const pelatihFields = [
        { name: 'namaLisensi', label: 'Nama Lisensi', type: 'text', required: true },
        { name: 'masaBerlaku', label: 'Masa Berlaku', type: 'date', required: true },
        { name: 'kategoriLisensi', label: 'Kategori', type: 'select', options: ['Daerah', 'Nasional', 'Internasional'], required: true },
        { name: 'jenisEvent', label: 'Jenis Event', type: 'select', options: ['Turnamen Lokal', 'Turnamen Daerah', 'Turnamen Nasional'], required: true },
        { name: 'tahunLisensi', label: 'Tahun', type: 'number', required: true }
    ];

    const wasitFields = [
        { name: 'namaLisensi', label: 'Nama Lisensi', type: 'text', required: true },
        { name: 'masaBerlaku', label: 'Masa Berlaku', type: 'date', required: true },
        { name: 'kategoriLisensi', label: 'Kategori', type: 'select', options: ['Daerah', 'Nasional', 'Internasional'], required: true },
        { name: 'jenisEvent', label: 'Jenis Event', type: 'select', options: ['Turnamen Lokal', 'Turnamen Daerah', 'Turnamen Nasional'], required: true },
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
            <h1 className="text-2xl font-bold text-gray-900">Data Olahraga Masyarakat</h1>
            <p className="text-gray-600">Kelola data olahraga masyarakat dengan induk olahraga</p>
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
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Induk Olahraga</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Organisasi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prestasi/Lisensi</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Aksi</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {masyarakatData.map((data, index) => (
                    <tr key={data.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{data.namaLengkap}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full flex items-center ${
                            data.kategori === 'Atlet' ? 'bg-blue-100 text-blue-800' :
                            data.kategori === 'Pelatih' ? 'bg-green-100 text-green-800' :
                            'bg-purple-100 text-purple-800'
                        }`}>
                            {data.kategori === 'Atlet' ? <Award className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                            {data.kategori}
                        </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.cabangOlahraga}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.indukOlahraga}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{data.organisasiPembina}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {data.kategori === 'Atlet' ? data.namaPrestasi : data.namaLisensi}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex space-x-2">
                            <button
                            onClick={() => handleView(data)}
                            className="text-blue-600 hover:text-blue-800"
                            >
                            <Eye className="w-4 h-4" />
                            </button>
                            <button
                            onClick={() => handleEdit(data)}
                            className="text-green-600 hover:text-green-800"
                            >
                            <Edit className="w-4 h-4" />
                            </button>
                            <button
                            onClick={() => handleDelete(data.id)}
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

export default OlahragaMasyarakat;
