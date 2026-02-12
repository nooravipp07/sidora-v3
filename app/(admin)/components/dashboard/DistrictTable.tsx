'use client';

import React, { useMemo } from 'react';
import { ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
import { DistrictData } from '@/lib/district/types';

interface DistrictTableProps {
  districts: DistrictData[];
  currentPage?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onViewDetail?: (district: DistrictData) => void;
}

const ITEMS_PER_PAGE = 10;

export default function DistrictTable({
  districts,
  currentPage = 1,
  onPageChange,
  itemsPerPage = ITEMS_PER_PAGE,
  onViewDetail,
}: DistrictTableProps) {
  const totalPages = Math.ceil(districts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;

  const paginatedDistricts = useMemo(() => {
    return districts.slice(startIndex, startIndex + itemsPerPage);
  }, [districts, startIndex, itemsPerPage]);

  const handleExportRow = (district: DistrictData) => {
    const data = `Kecamatan: ${district.kecamatan}\nInfrastruktur: ${district.totalInfrastructure}\nKelompok Olahraga: ${district.totalSportsGroups}\nPrestasi Atlet: ${district.totalAchievements}\nTotal Atlet: ${district.totalAthletes}\nTotal Pelatih: ${district.totalCoaches}`;
    const blob = new Blob([data], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${district.kecamatan}-data.txt`;
    link.click();
  };

  if (districts.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-12 text-center">
        <p className="text-gray-500 text-lg font-medium">Tidak ada data ditemukan</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Kecamatan</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Jumlah Sarana</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Kelompok Olahraga</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Prestasi Atlet</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Total Atlet</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedDistricts.map((district, idx) => (
              <tr
                key={district.id}
                className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4 text-sm font-semibold text-gray-900">{district.kecamatan}</td>
                <td className="px-6 py-4 text-center text-sm font-medium text-blue-600">{district.totalInfrastructure}</td>
                <td className="px-6 py-4 text-center text-sm font-medium text-green-600">{district.totalSportsGroups}</td>
                <td className="px-6 py-4 text-center text-sm font-medium text-orange-600">{district.totalAchievements}</td>
                <td className="px-6 py-4 text-center text-sm font-medium text-purple-600">{district.totalAthletes}</td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={() => onViewDetail?.(district)}
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 font-medium text-xs"
                      title="Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleExportRow(district)}
                      className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600 font-medium text-xs"
                      title="Export"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {paginatedDistricts.map((district) => (
          <div key={district.id} className="p-4 hover:bg-blue-50 transition-colors">
            <div className="mb-3">
              <h4 className="font-bold text-gray-900 text-lg">{district.kecamatan}</h4>
            </div>
            <div className="grid grid-cols-2 gap-2 mb-4">
              <div className="bg-blue-50 p-2 rounded">
                <p className="text-xs text-gray-600">Sarana</p>
                <p className="font-bold text-blue-600">{district.totalInfrastructure}</p>
              </div>
              <div className="bg-green-50 p-2 rounded">
                <p className="text-xs text-gray-600">Kelompok</p>
                <p className="font-bold text-green-600">{district.totalSportsGroups}</p>
              </div>
              <div className="bg-orange-50 p-2 rounded">
                <p className="text-xs text-gray-600">Prestasi</p>
                <p className="font-bold text-orange-600">{district.totalAchievements}</p>
              </div>
              <div className="bg-purple-50 p-2 rounded">
                <p className="text-xs text-gray-600">Atlet</p>
                <p className="font-bold text-purple-600">{district.totalAthletes}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => onViewDetail?.(district)}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold hover:bg-blue-200 transition-colors flex items-center justify-center gap-1"
              >
                <Eye className="w-3 h-3" />
                Detail
              </button>
              <button
                onClick={() => handleExportRow(district)}
                className="flex-1 px-3 py-2 bg-green-100 text-green-700 rounded-lg text-xs font-semibold hover:bg-green-200 transition-colors flex items-center justify-center gap-1"
              >
                <Download className="w-3 h-3" />
                Export
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {districts.length > itemsPerPage && onPageChange && (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-600">
              Menampilkan {startIndex + 1}-{Math.min(startIndex + itemsPerPage, districts.length)} dari{' '}
              <span className="font-semibold text-gray-900">{districts.length}</span> data kecamatan
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="p-1 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-gray-600" />
              </button>

              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => onPageChange(page)}
                    className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-white'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="p-1 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-gray-600" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
