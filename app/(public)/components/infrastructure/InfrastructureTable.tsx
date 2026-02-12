'use client';

import React from 'react';
import { DistrictInfrastructure } from '@/lib/infrastructure/types';
import ProgressBar from './ProgressBar';
import { ChevronRight, Building2, BarChart3 } from 'lucide-react';
import Link from 'next/link';

interface InfrastructureTableProps {
  districts: DistrictInfrastructure[];
  onViewDetail?: (district: string) => void;
}

export default function InfrastructureTable({ districts, onViewDetail }: InfrastructureTableProps) {
  if (districts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
        <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">Tidak ada data infrastruktur yang ditemukan</p>
        <p className="text-gray-400 text-sm mt-2">Coba ubah filter Anda untuk melihat hasil yang berbeda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kecamatan</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Total</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Lapangan</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Gedung</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Baik</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Perlu Perbaikan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kesehatan</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {districts.map((district, idx) => (
              <tr
                key={district.district}
                className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 font-semibold text-gray-900">{district.district}</td>
                <td className="px-6 py-4 text-center text-gray-900 font-semibold">
                  {district.totalFacilities}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <BarChart3 className="w-4 h-4 text-orange-500" />
                    {district.lapangan}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2 text-gray-600">
                    <Building2 className="w-4 h-4 text-purple-500" />
                    {district.gedung}
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {district.goodCondition}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
                    {district.needsRepair}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="w-full max-w-xs">
                    <ProgressBar
                      value={district.conditionPercentage}
                      max={100}
                      showLabel={true}
                      color="green"
                      height="md"
                    />
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onViewDetail?.(district.district)}
                    className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 font-semibold transition-colors"
                  >
                    Detail
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {districts.map((district) => (
            <div key={district.district} className="p-3 sm:p-4 hover:bg-green-50 transition-colors">
              <div className="mb-4">
                <h3 className="font-bold text-base sm:text-lg text-gray-900 mb-3 line-clamp-2">{district.district}</h3>
                <div className="grid grid-cols-2 gap-2 sm:gap-3 mb-4">
                  <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                    <p className="text-xs text-gray-600 mb-1">Total</p>
                    <p className="text-lg sm:text-xl font-bold text-blue-700">{district.totalFacilities}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-orange-50 p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Lapangan</p>
                      <p className="text-base sm:text-lg font-bold text-orange-700">{district.lapangan}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded-lg text-center">
                      <p className="text-xs text-gray-600">Gedung</p>
                      <p className="text-base sm:text-lg font-bold text-purple-700">{district.gedung}</p>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Baik</p>
                    <p className="text-lg sm:text-xl font-bold text-green-700">{district.goodCondition}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Perlu Perbaikan</p>
                    <p className="text-lg sm:text-xl font-bold text-red-700">{district.needsRepair}</p>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <p className="text-xs text-gray-600 mb-2">Kesehatan Infrastruktur</p>
                <ProgressBar
                  value={district.conditionPercentage}
                  max={100}
                  showLabel={true}
                  color="green"
                  height="md"
                />
              </div>
              <button
                onClick={() => onViewDetail?.(district.district)}
                className="w-full flex items-center justify-center gap-2 py-2 text-sm sm:text-base bg-green-50 text-green-700 hover:bg-green-100 rounded-lg font-semibold transition-colors"
              >
                Lihat Detail
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
