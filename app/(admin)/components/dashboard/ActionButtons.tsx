'use client';

import React from 'react';
import { Download, Plus } from 'lucide-react';
import { DistrictData } from '@/lib/district/types';

interface ActionButtonsProps {
  districts: DistrictData[];
  onAddData?: () => void;
}

export default function ActionButtons({ districts, onAddData }: ActionButtonsProps) {
  const handleExport = () => {
    // Create CSV content
    const headers = ['Kecamatan', 'Infrastruktur', 'Kelompok Olahraga', 'Prestasi Atlet', 'Total Atlet', 'Total Pelatih'];
    const rows = districts.map((d) => [
      d.kecamatan,
      d.totalInfrastructure,
      d.totalSportsGroups,
      d.totalAchievements,
      d.totalAthletes,
      d.totalCoaches,
    ]);

    const csvContent = [headers, ...rows].map((row) => row.join(',')).join('\n');

    // Create blob and download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `district-data-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-end">
      <button
        onClick={handleExport}
        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        <Download className="w-4 h-4" />
        Export
      </button>
      <button
        onClick={onAddData}
        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        Tambah Data
      </button>
    </div>
  );
}
