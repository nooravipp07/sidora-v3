'use client';

import { FilterOptions } from '@/lib/sports-performance/types';
import { getDistricts, getSports } from '@/lib/sports-performance/data';
import { Filter, X } from 'lucide-react';

interface PerformanceFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  filters: FilterOptions;
  onReset: () => void;
}

export default function PerformanceFilters({
  onFilterChange,
  filters,
  onReset
}: PerformanceFiltersProps) {
  const handleDistrictChange = (district: string) => {
    onFilterChange({ ...filters, district: district || undefined });
  };

  const handleSportChange = (sport: string) => {
    onFilterChange({ ...filters, sport: sport || undefined });
  };

  const handleRoleChange = (role: string) => {
    onFilterChange({ ...filters, role: (role as any) || undefined });
  };

  const hasActiveFilters = filters.district || filters.sport || filters.role;

  const roleOptions = [
    { value: 'athlete', label: 'Atlet' },
    { value: 'coach', label: 'Pelatih' },
    { value: 'referee', label: 'Wasit/Juri' }
  ];

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-600" />
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Filter Data</h3>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
            Kecamatan
          </label>
          <select
            value={filters.district || ''}
            onChange={(e) => handleDistrictChange(e.target.value)}
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
            value={filters.sport || ''}
            onChange={(e) => handleSportChange(e.target.value)}
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
            Posisi/Peran
          </label>
          <select
            value={filters.role || ''}
            onChange={(e) => handleRoleChange(e.target.value)}
            className="w-full px-3 py-2 text-xs sm:text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Semua Posisi</option>
            {roleOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">Filter aktif:</p>
          <div className="flex flex-wrap gap-2">
            {filters.district && (
              <button
                onClick={() => handleDistrictChange('')}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
              >
                {filters.district}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.sport && (
              <button
                onClick={() => handleSportChange('')}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
              >
                {filters.sport}
                <X className="w-3 h-3" />
              </button>
            )}
            {filters.role && (
              <button
                onClick={() => handleRoleChange('')}
                className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
              >
                {roleOptions.find(o => o.value === filters.role)?.label}
                <X className="w-3 h-3" />
              </button>
            )}
            <button
              onClick={onReset}
              className="ml-auto text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors font-semibold"
            >
              Reset Semua
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
