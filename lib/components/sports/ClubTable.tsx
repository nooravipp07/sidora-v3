'use client';

import { useState } from 'react';
import { Club } from '@/lib/sports/types';
import { filterClubs, getSportCategories, getDistricts } from '@/lib/sports/data';
import { Filter, X, CheckCircle, Clock } from 'lucide-react';

interface ClubTableProps {
  clubs: Club[];
}

export default function ClubTable({ clubs }: ClubTableProps) {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');

  const filteredClubs = filterClubs(
    selectedDistrict || undefined,
    selectedCategory || undefined,
    selectedStatus || undefined
  );

  const hasActiveFilters = selectedDistrict || selectedCategory || selectedStatus;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="p-4 sm:p-6 rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Filter Klub</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Kecamatan
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Kecamatan</option>
              {getDistricts().map((district) => (
                <option key={district} value={district}>
                  {district}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Cabang Olahraga
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Cabang</option>
              {getSportCategories().map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Status</option>
              <option value="verified">Terverifikasi</option>
              <option value="pending">Menunggu Verifikasi</option>
            </select>
          </div>
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">Filter aktif:</p>
            <div className="flex flex-wrap gap-2">
              {selectedDistrict && (
                <button
                  onClick={() => setSelectedDistrict('')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {selectedDistrict}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedCategory && (
                <button
                  onClick={() => setSelectedCategory('')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {selectedCategory}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedStatus && (
                <button
                  onClick={() => setSelectedStatus('')}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {selectedStatus === 'verified' ? 'Terverifikasi' : 'Menunggu Verifikasi'}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Clubs Grid - Mobile Cards */}
      <div className="grid grid-cols-1 gap-4 lg:hidden">
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club) => (
            <div
              key={club.id}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{club.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{club.sportCategory}</p>
                </div>
                {club.verified ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : (
                  <Clock className="w-5 h-5 text-yellow-500" />
                )}
              </div>

              <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Kecamatan</span>
                  <span className="text-xs font-medium text-gray-900">{club.district}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Total Atlet</span>
                  <span className="text-xs font-medium text-gray-900">{club.totalAthletes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Atlet Aktif</span>
                  <span className="text-xs font-medium text-gray-900">{club.activeAthletes}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Medali</span>
                  <span className="text-xs font-medium text-amber-700">{club.totalMedals}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">Tidak ada klub ditemukan</p>
          </div>
        )}
      </div>

      {/* Clubs Table - Desktop */}
      <div className="hidden lg:block rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Nama Klub
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Cabang
                </th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                  Kecamatan
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Total Atlet
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Aktif
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Medali
                </th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredClubs.length > 0 ? (
                filteredClubs.map((club) => (
                  <tr
                    key={club.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-900 text-sm">{club.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{club.sportCategory}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-gray-700">{club.district}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm font-medium text-gray-900">{club.totalAthletes}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm font-medium text-green-600">{club.activeAthletes}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <p className="text-sm font-bold text-amber-700">{club.totalMedals}</p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {club.verified ? (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-green-50 rounded-full">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span className="text-xs font-medium text-green-700">Terverifikasi</span>
                        </div>
                      ) : (
                        <div className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 rounded-full">
                          <Clock className="w-4 h-4 text-yellow-600" />
                          <span className="text-xs font-medium text-yellow-700">Menunggu</span>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center">
                    <p className="text-sm text-gray-500">Tidak ada klub ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredClubs.length > 0 && (
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Menampilkan {filteredClubs.length} dari {clubs.length} klub
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
