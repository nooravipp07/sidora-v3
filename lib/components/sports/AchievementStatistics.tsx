'use client';

import { useState, useMemo } from 'react';
import { Achievement } from '@/lib/sports/types';
import { filterAchievements, getSports, getDistricts, getYears } from '@/lib/sports/data';
import { Medal, Filter, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface AchievementStatisticsProps {
  achievements: Achievement[];
}

const ITEMS_PER_PAGE = 10;

export default function AchievementStatistics({ achievements }: AchievementStatisticsProps) {
  const [selectedMedal, setSelectedMedal] = useState<string>('');
  const [selectedSport, setSelectedSport] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);

  const filteredAchievements = filterAchievements(
    selectedMedal || undefined,
    selectedSport || undefined,
    selectedYear || undefined,
    selectedDistrict || undefined
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredAchievements.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedAchievements = useMemo(() => {
    return filteredAchievements.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredAchievements, startIndex]);

  const goldCount = filteredAchievements.filter(a => a.medal === 'gold').length;
  const silverCount = filteredAchievements.filter(a => a.medal === 'silver').length;
  const bronzeCount = filteredAchievements.filter(a => a.medal === 'bronze').length;

  const hasActiveFilters = selectedMedal || selectedSport || selectedYear || selectedDistrict;

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getMedalLabel = (medal: string): string => {
    switch(medal) {
      case 'gold':
        return 'Emas';
      case 'silver':
        return 'Perak';
      case 'bronze':
        return 'Perunggu';
      default:
        return medal;
    }
  };

  const getMedalColor = (medal: string): string => {
    switch(medal) {
      case 'gold':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'silver':
        return 'bg-gray-50 border-gray-300 text-gray-700';
      case 'bronze':
        return 'bg-orange-50 border-orange-200 text-orange-700';
      default:
        return 'bg-gray-50 border-gray-300 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="p-4 sm:p-6 rounded-lg bg-amber-50 border border-amber-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Medali Emas</p>
              <p className="text-2xl sm:text-3xl font-bold text-amber-700 mt-2">{goldCount}</p>
            </div>
            <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-amber-400 opacity-20" />
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-lg bg-slate-50 border border-slate-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Medali Perak</p>
              <p className="text-2xl sm:text-3xl font-bold text-slate-700 mt-2">{silverCount}</p>
            </div>
            <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-slate-400 opacity-20" />
          </div>
        </div>

        <div className="p-4 sm:p-6 rounded-lg bg-orange-50 border border-orange-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs sm:text-sm text-gray-600 font-medium">Medali Perunggu</p>
              <p className="text-2xl sm:text-3xl font-bold text-orange-700 mt-2">{bronzeCount}</p>
            </div>
            <Medal className="w-8 h-8 sm:w-10 sm:h-10 text-orange-400 opacity-20" />
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="p-4 sm:p-6 rounded-lg border border-gray-200 bg-white">
        <div className="flex items-center gap-2 mb-4">
          <Filter className="w-4 h-4 text-gray-600" />
          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Filter Pencapaian</h3>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Jenis Medali
            </label>
            <select
              value={selectedMedal}
              onChange={(e) => { setSelectedMedal(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Medali</option>
              <option value="gold">Emas</option>
              <option value="silver">Perak</option>
              <option value="bronze">Perunggu</option>
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Cabang Olahraga
            </label>
            <select
              value={selectedSport}
              onChange={(e) => { setSelectedSport(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Cabang</option>
              {getSports().map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Tahun
            </label>
            <select
              value={selectedYear}
              onChange={(e) => { setSelectedYear(e.target.value); setCurrentPage(1); }}
              className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Semua Tahun</option>
              {getYears().map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
              Kecamatan
            </label>
            <select
              value={selectedDistrict}
              onChange={(e) => { setSelectedDistrict(e.target.value); setCurrentPage(1); }}
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
        </div>

        {hasActiveFilters && (
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
            <p className="text-xs sm:text-sm text-gray-600">Filter aktif:</p>
            <div className="flex flex-wrap gap-2">
              {selectedMedal && (
                <button
                  onClick={() => { setSelectedMedal(''); setCurrentPage(1); }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {getMedalLabel(selectedMedal)}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedSport && (
                <button
                  onClick={() => { setSelectedSport(''); setCurrentPage(1); }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {selectedSport}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedYear && (
                <button
                  onClick={() => { setSelectedYear(''); setCurrentPage(1); }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {selectedYear}
                  <X className="w-3 h-3" />
                </button>
              )}
              {selectedDistrict && (
                <button
                  onClick={() => { setSelectedDistrict(''); setCurrentPage(1); }}
                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
                >
                  {selectedDistrict}
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Achievements Table */}
      <div className="rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Atlet
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Cabang
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Medali
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Kejuaraan
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs sm:text-sm font-semibold text-gray-900">
                  Tahun
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedAchievements.length > 0 ? (
                paginatedAchievements.map((achievement) => (
                  <tr
                    key={achievement.id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-3 sm:px-6 py-3">
                      <p className="text-xs sm:text-sm font-medium text-gray-900">
                        {achievement.athleteName}
                      </p>
                      <p className="text-xs text-gray-500">{achievement.clubName}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-3">
                      <p className="text-xs sm:text-sm text-gray-700">{achievement.sport}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-3">
                      <span
                        className={`inline-block px-2 py-1 text-xs font-semibold rounded-full border ${getMedalColor(
                          achievement.medal
                        )}`}
                      >
                        {getMedalLabel(achievement.medal)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-6 py-3">
                      <p className="text-xs sm:text-sm text-gray-700">{achievement.event}</p>
                    </td>
                    <td className="px-3 sm:px-6 py-3">
                      <p className="text-xs sm:text-sm text-gray-700">{achievement.year}</p>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-3 sm:px-6 py-8 text-center">
                    <p className="text-sm text-gray-500">Tidak ada pencapaian ditemukan</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {filteredAchievements.length > 0 && (
          <div className="px-3 sm:px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs sm:text-sm text-gray-600">
                Menampilkan {startIndex + 1}-{Math.min(startIndex + ITEMS_PER_PAGE, filteredAchievements.length)} dari {filteredAchievements.length} pencapaian
              </p>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="p-1 border border-gray-300 rounded-lg hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft className="w-4 h-4 text-gray-600" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
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
                  onClick={() => handlePageChange(currentPage + 1)}
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
    </div>
  );
}
