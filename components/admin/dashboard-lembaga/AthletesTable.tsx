'use client';

import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Eye, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuthh';

const ITEMS_PER_PAGE = 10;

interface Athlete {
  id: number;
  nationalId: string;
  fullName: string;
  birthPlace: string | null;
  birthDate: Date | null;
  gender: string | null;
  organization: string | null;
  category: string | null;
  status: string;
  sport: { id: number; nama: string } | null;
  achievements: { year: number; medal: string }[];
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

interface ApiResponse {
  success: boolean;
  data: {
    athletes: Athlete[];
    pagination: PaginationMeta;
  };
}

interface SportOption {
  id: number;
  nama: string;
}

export default function AthletesTable() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedOrganization, setSelectedOrganization] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [pagination, setPagination] = useState<PaginationMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sports, setSports] = useState<SportOption[]>([]);
  const [organizations, setOrganizations] = useState<string[]>(['KONI', 'NPCI']);
  const [availableYears, setAvailableYears] = useState<number[]>([]);

  // Fetch sports list
  useEffect(() => {
    const fetchSports = async () => {
      try {
        const response = await fetch('/api/athlete/sports');
        const result = await response.json();
        if (result.success) {
          setSports(result.data);
        }
      } catch (err) {
        console.error('Error fetching sports:', err);
      }
    };

    fetchSports();
  }, []);

  // Fetch athletes data
  useEffect(() => {
    const fetchAthletes = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: ITEMS_PER_PAGE.toString(),
        });

        // Determine organization filter based on roleId
        let orgFilter = selectedOrganization;
        if (user?.roleId === 4) {
          orgFilter = 'KONI';
        } else if (user?.roleId === 5) {
          orgFilter = 'NPCI';
        }

        if (orgFilter && orgFilter !== 'all') {
          params.append('organization', orgFilter);
        }

        if (selectedSport && selectedSport !== 'all') {
          params.append('sportId', selectedSport);
        }

        if (selectedYear && selectedYear !== 'all') {
          params.append('year', selectedYear);
        }

        if (searchTerm) {
          params.append('search', searchTerm);
        }

        const response = await fetch(`/api/athlete/list?${params.toString()}`, {
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error('Failed to fetch athletes');
        }

        const result: ApiResponse = await response.json();
        if (result.success) {
          setAthletes(result.data.athletes);
          setPagination(result.data.pagination);

          // Extract available years from achievements
          const yearsSet = new Set<number>();
          result.data.athletes.forEach((athlete) => {
            athlete.achievements.forEach((achievement) => {
              if (achievement.year) {
                yearsSet.add(achievement.year);
              }
            });
          });
          const sortedYears = Array.from(yearsSet).sort((a, b) => b - a);
          setAvailableYears(sortedYears);
        } else {
          setError('Failed to load athletes');
        }
      } catch (err) {
        console.error('Error fetching athletes:', err);
        setError('An error occurred while fetching athletes');
      } finally {
        setLoading(false);
      }
    };

    fetchAthletes();
  }, [currentPage, selectedYear, selectedOrganization, selectedSport, searchTerm, user?.roleId]);

  const handlePageChange = (page: number) => {
    if (pagination) {
      setCurrentPage(Math.max(1, Math.min(page, pagination.totalPages)));
    }
  };

  // Format date for display
  const formatDate = (date: Date | string | null) => {
    if (!date) return '-';
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  // Show loading skeleton
  if (loading && athletes.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Data Atlet</h3>
          <div className="space-y-4">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <div className="p-6 text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-600" />
        </div>
      </div>
    );
  }


  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-gray-200">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Data Atlet</h3>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Cari nama atlet atau nomor identitas..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Filters Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Organization Filter */}
            {user?.roleId !== 4 && user?.roleId !== 5 && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Organisasi:
                </label>
                <select
                  value={selectedOrganization}
                  onChange={(e) => {
                    setSelectedOrganization(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Semua Organisasi</option>
                  {organizations.map((org) => (
                    <option key={org} value={org}>
                      {org}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Sport/Cabang Olahraga Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Cabang Olahraga:
              </label>
              <select
                value={selectedSport}
                onChange={(e) => {
                  setSelectedSport(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Cabang</option>
                {sports.map((sport) => (
                  <option key={sport.id} value={sport.id.toString()}>
                    {sport.nama}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tahun:
              </label>
              <select
                value={selectedYear}
                onChange={(e) => {
                  setSelectedYear(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Semua Tahun</option>
                {availableYears.map((year) => (
                  <option key={year} value={year.toString()}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto hidden lg:block">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Nama
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                No. Identitas
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Tempat Lahir
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Tanggal Lahir
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Jenis Kelamin
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Organisasi
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Cabang Olahraga
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                Status
              </th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center">
                  <Loader2 className="w-5 h-5 animate-spin mx-auto text-blue-600" />
                </td>
              </tr>
            ) : athletes.length > 0 ? (
              athletes.map((athlete, idx) => (
                <tr
                  key={athlete.id}
                  className={`border-b border-gray-200 hover:bg-blue-50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                    {athlete.fullName}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {athlete.nationalId}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {athlete.birthPlace || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {formatDate(athlete.birthDate)}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {athlete.gender || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {athlete.organization || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {athlete.sport?.nama || '-'}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        athlete.status === 'aktif'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {athlete.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600 font-medium text-xs"
                      title="Detail"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={9} className="px-6 py-8 text-center text-gray-500">
                  Tidak ada data atlet
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden divide-y divide-gray-200">
        {athletes.length > 0 ? (
          athletes.map((athlete) => (
            <div
              key={athlete.id}
              className="p-4 hover:bg-blue-50 transition-colors"
            >
              <div className="mb-3 flex items-start justify-between">
                <h4 className="font-bold text-gray-900">{athlete.fullName}</h4>
                <button className="p-1 hover:bg-blue-100 rounded text-blue-600">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                <div>
                  <span className="font-semibold">No. Identitas:</span>{' '}
                  {athlete.nationalId}
                </div>
                <div>
                  <span className="font-semibold">Organisasi:</span>{' '}
                  {athlete.organization || '-'}
                </div>
                <div>
                  <span className="font-semibold">Tempat Lahir:</span>{' '}
                  {athlete.birthPlace || '-'}
                </div>
                <div>
                  <span className="font-semibold">Cabang Olahraga:</span>{' '}
                  {athlete.sport?.nama || '-'}
                </div>
                <div>
                  <span className="font-semibold">Tanggal Lahir:</span>{' '}
                  {formatDate(athlete.birthDate)}
                </div>
                <div>
                  <span className="font-semibold">Status:</span>
                  <span
                    className={`ml-2 px-2 py-1 rounded text-xs font-medium ${
                      athlete.status === 'aktif'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}
                  >
                    {athlete.status}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-8 text-center text-gray-500">
            Tidak ada data atlet
          </div>
        )}
      </div>

      {/* Footer with Pagination */}
      {pagination && (
        <div className="px-6 py-4 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-4 bg-gray-50">
          <div className="text-sm text-gray-600">
            Menampilkan{' '}
            {pagination.total === 0
              ? '0'
              : (currentPage - 1) * ITEMS_PER_PAGE + 1}
            -
            {Math.min(
              currentPage * ITEMS_PER_PAGE,
              pagination.total
            )}{' '}
            dari {pagination.total} atlet
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>

            {Array.from(
              { length: Math.min(pagination.totalPages, 5) },
              (_, i) => {
                let page: number;
                if (pagination.totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  page = pagination.totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return page;
              }
            ).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.totalPages}
              className="p-2 hover:bg-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
