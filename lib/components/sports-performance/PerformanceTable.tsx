'use client';

import { PerformancePerson } from '@/lib/sports-performance/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PerformanceTableProps {
  data: PerformancePerson[];
  totalPages: number;
  totalItems: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export default function PerformanceTable({
  data,
  totalPages,
  totalItems,
  currentPage,
  onPageChange,
  itemsPerPage
}: PerformanceTableProps) {
  const getOrganizationBadgeColor = (org: string) => {
    return org === 'KONI'
      ? 'bg-red-100 text-red-700 border-red-300'
      : 'bg-blue-100 text-blue-700 border-blue-300';
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'athlete':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'coach':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'referee':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'athlete':
        return 'Atlet';
      case 'coach':
        return 'Pelatih';
      case 'referee':
        return 'Wasit/Juri';
      default:
        return role;
    }
  };

  const getStatusBadgeColor = (status: string) => {
    return status === 'active'
      ? 'bg-green-50 text-green-700 border-green-200'
      : 'bg-gray-50 text-gray-700 border-gray-200';
  };

  const getStatusLabel = (status: string) => {
    return status === 'active' ? 'Aktif' : 'Tidak Aktif';
  };

  const startIndex = (currentPage - 1) * itemsPerPage + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="space-y-4">
      {/* Desktop Table */}
      <div className="hidden lg:block rounded-lg border border-gray-200 overflow-hidden bg-white">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Organisasi
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Nama
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Posisi
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Cabang Olahraga
                </th>
                <th className="px-4 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Kecamatan
                </th>
                <th className="px-4 sm:px-6 py-3 text-center text-xs sm:text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((person, idx) => (
                  <tr
                    key={person.id}
                    className={`border-b border-gray-200 hover:bg-gray-50 transition-colors ${
                      idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                    }`}
                  >
                    <td className="px-4 sm:px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${getOrganizationBadgeColor(
                          person.organization
                        )}`}
                      >
                        {person.organization}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">{person.name}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${getRoleBadgeColor(
                          person.role
                        )}`}
                      >
                        {getRoleLabel(person.role)}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <p className="text-xs sm:text-sm text-gray-700">{person.sport}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3">
                      <p className="text-xs sm:text-sm text-gray-700">{person.district}</p>
                    </td>
                    <td className="px-4 sm:px-6 py-3 text-center">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(
                          person.status
                        )}`}
                      >
                        {getStatusLabel(person.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <p className="text-sm text-gray-500">Tidak ada data ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3">
        {data.length > 0 ? (
          data.map((person) => (
            <div
              key={person.id}
              className="p-4 rounded-lg border border-gray-200 bg-white hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 text-sm">{person.name}</h3>
                  <p className="text-xs text-gray-600 mt-1">{person.sport}</p>
                </div>
                <span
                  className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${getOrganizationBadgeColor(
                    person.organization
                  )}`}
                >
                  {person.organization}
                </span>
              </div>

              <div className="space-y-2 bg-gray-50 p-3 rounded border border-gray-100">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Posisi</span>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${getRoleBadgeColor(
                      person.role
                    )}`}
                  >
                    {getRoleLabel(person.role)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Kecamatan</span>
                  <span className="text-xs font-medium text-gray-900">{person.district}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Status</span>
                  <span
                    className={`inline-block px-2 py-1 text-xs font-semibold rounded border ${getStatusBadgeColor(
                      person.status
                    )}`}
                  >
                    {getStatusLabel(person.status)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center rounded-lg border border-gray-200 bg-gray-50">
            <p className="text-sm text-gray-500">Tidak ada data ditemukan</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6">
        <p className="text-xs sm:text-sm text-gray-600">
          Menampilkan {startIndex}-{endIndex} dari {totalItems} data
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4 text-gray-600" />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4 text-gray-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
