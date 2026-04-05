'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Building2, Package, Users, Trophy, Plus } from 'lucide-react';

interface Module {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  path: string;
  color: string;
}

const DataKeolahragaanPage: React.FC = () => {
  const router = useRouter();

  const modules: Module[] = [
    {
      id: 'facility-record',
      name: 'Data Fasilitas',
      description: 'Input data sarana dan prasarana olahraga',
      icon: <Building2 className="h-8 w-8" />,
      path: '/admin/data-keolahragaan/facility-record',
      color: 'bg-blue-50 border-blue-200 text-blue-700',
    },
    {
      id: 'equipment',
      name: 'Data Peralatan',
      description: 'Input data peralatan olahraga',
      icon: <Package className="h-8 w-8" />,
      path: '/admin/data-keolahragaan/equipment',
      color: 'bg-green-50 border-green-200 text-green-700',
    },
    {
      id: 'athlete',
      name: 'Data Atlet',
      description: 'Input data atlet dan pencapaiannya',
      icon: <Users className="h-8 w-8" />,
      path: '/admin/data-keolahragaan/athlete',
      color: 'bg-purple-50 border-purple-200 text-purple-700',
    },
    {
      id: 'sport-group',
      name: 'Data Grup Olahraga',
      description: 'Input data grup/organisasi olahraga',
      icon: <Trophy className="h-8 w-8" />,
      path: '/admin/data-keolahragaan/sport-group',
      color: 'bg-orange-50 border-orange-200 text-orange-700',
    },
  ];

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Input Data Keolahragaan</h1>
        <p className="text-gray-600 mt-1">
          Pilih jenis data yang ingin Anda input untuk diverifikasi
        </p>
      </div>

      {/* Modules Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {modules.map(module => (
          <div
            key={module.id}
            onClick={() => router.push(module.path)}
            className={`${module.color} border-2 rounded-lg p-6 cursor-pointer hover:shadow-lg transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className="text-4xl">{module.icon}</div>
            </div>
            <h3 className="text-lg font-semibold mb-2">{module.name}</h3>
            <p className="text-sm opacity-75 mb-4">{module.description}</p>
            <button className="inline-flex items-center gap-2 text-sm font-medium">
              <Plus className="h-4 w-4" />
              Akses
            </button>
          </div>
        ))}
      </div>

      {/* Info Box */}
      <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Informasi Penting</h3>
        <ul className="text-blue-800 text-sm space-y-2">
          <li>✓ Data yang Anda input akan disimpan dalam status "Menunggu Verifikasi"</li>
          <li>✓ Admin akan melakukan verifikasi dan dapat menyetujui atau menolak data Anda</li>
          <li>✓ Jika ditolak, Anda akan diberitahu alasan dan dapat melakukan revisi</li>
          <li>✓ Data yang sudah disetujui akan masuk ke database utama sistem</li>
        </ul>
      </div>
    </div>
  );
};

export default DataKeolahragaanPage;
