'use client';

import React, { useState, useMemo } from 'react';
import { medals, institutions, getAvailableYears } from '@/lib/institution/data';
import { MedalType, InstitutionType } from '@/lib/institution/types';

export default function MedalBarChart() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedInstitutionType, setSelectedInstitutionType] = useState<string>('all');
  const availableYears = getAvailableYears();

  const institutionTypes: { value: InstitutionType; label: string }[] = [
    { value: 'KONI', label: 'KONI' },
    { value: 'NPCI', label: 'NPCI' },
    { value: 'KORMI', label: 'KORMI' },
    { value: 'BAPOPSI', label: 'BAPOPSI' },
  ];

  const filteredMedals = useMemo(() => {
    return medals.filter((m) => {
      if (m.year !== selectedYear) return false;
      if (selectedInstitutionType !== 'all') {
        // Filter berdasarkan tipe institusi atlet yang meraih medali
        const athlete = institutions.find((inst) =>
          inst.name.toLowerCase().includes(m.athleteName.toLowerCase())
        );
        if (!athlete || athlete.type !== selectedInstitutionType) {
          return false;
        }
      }
      return true;
    });
  }, [selectedYear, selectedInstitutionType]);

  const medalCounts = useMemo(() => {
    const counts = {
      'Emas': 0,
      'Perak': 0,
      'Perunggu': 0,
    };

    filteredMedals.forEach((m) => {
      counts[m.type]++;
    });

    return counts;
  }, [filteredMedals]);

  const medalColors = {
    'Emas': {
      bg: 'bg-yellow-500',
      text: 'text-yellow-700',
    },
    'Perak': {
      bg: 'bg-gray-400',
      text: 'text-gray-700',
    },
    'Perunggu': {
      bg: 'bg-orange-600',
      text: 'text-orange-700',
    },
  };

  const medalTypes: MedalType[] = ['Emas', 'Perak', 'Perunggu'];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header dan Filter */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Perolehan Medali</h3>
          <p className="text-sm text-gray-600 mt-1">Total medali berdasarkan jenis dan lembaga</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Filter Tahun */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  Tahun {year}
                </option>
              ))}
            </select>
          </div>

          {/* Filter Lembaga */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Lembaga</label>
            <select
              value={selectedInstitutionType}
              onChange={(e) => setSelectedInstitutionType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Semua Lembaga</option>
              {institutionTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Medal Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {medalTypes.map((medalType) => {
          const count = medalCounts[medalType];
          const colors = medalColors[medalType];

          return (
            <div key={medalType} className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className={`w-4 h-4 rounded ${colors.bg}`}></div>
                <span className="font-medium text-gray-700">{medalType}</span>
              </div>
              <div className={`text-3xl font-bold ${colors.text}`}>
                {count}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total Summary */}
      <div className="pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">Total Medali</span>
          <span className="text-3xl font-bold text-gray-900">
            {medalCounts['Emas'] + medalCounts['Perak'] + medalCounts['Perunggu']}
          </span>
        </div>
      </div>
    </div>
  );
}
