'use client';

import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface Sport {
  id: number;
  name: string;
}

interface Kecamatan {
  id: number;
  nama: string;
}

interface AchievementFiltersProps {
  onSportChange: (sportId: string) => void;
  onMedalChange: (medal: string) => void;
  onYearChange: (year: string) => void;
  onDistrictChange: (district: string) => void;
  onReset: () => void;
  selectedSport?: string;
  selectedMedal?: string;
  selectedYear?: string;
  selectedDistrict?: string;
}

export default function AchievementFilters({
  onSportChange,
  onMedalChange,
  onYearChange,
  onDistrictChange,
  onReset,
  selectedSport,
  selectedMedal,
  selectedYear,
  selectedDistrict
}: AchievementFiltersProps) {
  const [sports, setSports] = useState<Sport[]>([]);
  const [districts, setDistricts] = useState<Kecamatan[]>([]);
  const [years, setYears] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      try {
        setLoading(true);
        const [sportsRes, yearsRes, kecamatanRes] = await Promise.all([
          fetch('/api/sports/achievements-metadata?type=sports'),
          fetch('/api/sports/achievements-metadata?type=years'),
          fetch('/api/sports/achievements-metadata?type=kecamatan')
        ]);

        const sportsData = await sportsRes.json();
        const yearsData = await yearsRes.json();
        const kecamatanData = await kecamatanRes.json();

        if (sportsData.success) setSports(sportsData.data);
        if (yearsData.success) setYears(yearsData.data);
        if (kecamatanData.success) setDistricts(kecamatanData.data);
      } catch (error) {
        console.error('Error fetching filter metadata:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, []);

  const hasActiveFilters = selectedSport || selectedMedal || selectedYear || selectedDistrict;

  const medalOptions = [
    { value: 'Emas', label: 'Emas', color: 'bg-yellow-100 text-yellow-700' },
    { value: 'Perak', label: 'Perak', color: 'bg-gray-100 text-gray-700' },
    { value: 'Perunggu', label: 'Perunggu', color: 'bg-orange-100 text-orange-700' }
  ];

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Sport Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Filter Cabang
          </label>
          <select
            value={selectedSport || ''}
            onChange={(e) => onSportChange(e.target.value)}
            disabled={loading}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100"
          >
            <option value="">Semua Cabang</option>
            {sports.map((sport) => (
              <option key={sport.id} value={sport.id.toString()}>
                {sport.name}
              </option>
            ))}
          </select>
        </div>

        {/* Medal Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Filter Medali
          </label>
          <select
            value={selectedMedal || ''}
            onChange={(e) => onMedalChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Semua Medali</option>
            {medalOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Filter Tahun
          </label>
          <select
            value={selectedYear || ''}
            onChange={(e) => onYearChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Semua Tahun</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* District Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Filter Wilayah
          </label>
          <select
            value={selectedDistrict || ''}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Semua Wilayah</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id.toString()}>
                {district.nama}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`w-full px-3 sm:px-4 py-2 text-sm rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              hasActiveFilters
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <X className="w-3 h-3 sm:w-4 sm:h-4" />
            Reset
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-3 sm:mt-4 pt-3 sm:pt-4 border-t border-gray-200 flex flex-wrap gap-2">
          <span className="text-xs sm:text-sm text-gray-600 font-semibold">Filter Aktif:</span>
          {selectedSport && (
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {sports.find(s => s.id.toString() === selectedSport)?.name || selectedSport}
              <button
                onClick={() => onSportChange('')}
                className="hover:bg-blue-200 rounded-full p-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedMedal && (
            <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {selectedMedal === 'gold' ? 'Emas' : selectedMedal === 'silver' ? 'Perak' : 'Perunggu'}
              <button
                onClick={() => onMedalChange('')}
                className="hover:bg-yellow-200 rounded-full p-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedYear && (
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              Tahun {selectedYear}
              <button
                onClick={() => onYearChange('')}
                className="hover:bg-green-200 rounded-full p-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedDistrict && (
            <span className="inline-flex items-center gap-2 bg-purple-100 text-purple-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {districts.find(d => d.id.toString() === selectedDistrict)?.nama || selectedDistrict}
              <button
                onClick={() => onDistrictChange('')}
                className="hover:bg-purple-200 rounded-full p-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </div>
      )}
    </div>
  );
}
