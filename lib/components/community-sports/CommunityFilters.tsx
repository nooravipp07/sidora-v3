'use client';

import { FilterOptions } from '@/lib/community-sports/types';
import { getDistricts } from '@/lib/community-sports/data';
import { Filter, X } from 'lucide-react';

interface CommunityFiltersProps {
  onFilterChange: (filters: FilterOptions) => void;
  filters: FilterOptions;
  onReset: () => void;
}

export default function CommunityFilters({
  onFilterChange,
  filters,
  onReset
}: CommunityFiltersProps) {
  const handleDistrictChange = (district: string) => {
    onFilterChange({ district: district || undefined });
  };

  const hasActiveFilters = filters.district;

  return (
    <div className="p-4 sm:p-6 rounded-lg border border-gray-200 bg-white">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-4 h-4 text-gray-600" />
        <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Filter Data</h3>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="flex-1">
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

        {hasActiveFilters && (
          <div className="flex items-center gap-2">
            <button
              onClick={onReset}
              className="text-xs sm:text-sm text-gray-600 hover:text-blue-600 transition-colors font-semibold"
            >
              Reset
            </button>
          </div>
        )}
      </div>

      {hasActiveFilters && (
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-200">
          <p className="text-xs sm:text-sm text-gray-600">Filter aktif:</p>
          <button
            onClick={() => handleDistrictChange('')}
            className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full hover:bg-blue-200"
          >
            {filters.district}
            <X className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
