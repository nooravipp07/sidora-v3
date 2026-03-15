'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { getAllDistricts } from '@/lib/infrastructure/data';

interface InfrastructureFiltersProps {
  onDistrictChange: (district: string) => void;
  onConditionChange: (condition: string) => void;
  onTypeChange: (type: string) => void;
  onReset: () => void;
  selectedDistrict?: string;
  selectedCondition?: string;
  selectedType?: string;
}

export default function InfrastructureFilters({
  onDistrictChange,
  onConditionChange,
  onTypeChange,
  onReset,
  selectedDistrict,
  selectedCondition,
  selectedType
}: InfrastructureFiltersProps) {
  const districts = getAllDistricts();
  const hasActiveFilters = selectedDistrict || selectedCondition || selectedType;

  return (
    <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8 border border-gray-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* District Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Filter Kecamatan
          </label>
          <select
            value={selectedDistrict || ''}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Semua Kecamatan</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Condition Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Filter Kondisi
          </label>
          <select
            value={selectedCondition || ''}
            onChange={(e) => onConditionChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Semua Kondisi</option>
            <option value="good">Baik</option>
            <option value="repair">Perlu Perbaikan</option>
          </select>
        </div>

        {/* Type Filter */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-3 h-3 sm:w-4 sm:h-4 inline mr-2" />
            Filter Tipe
          </label>
          <select
            value={selectedType || ''}
            onChange={(e) => onTypeChange(e.target.value)}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Semua Tipe</option>
            <option value="lapangan">Lapangan</option>
            <option value="gedung">Gedung</option>
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
          {selectedDistrict && (
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {selectedDistrict}
              <button
                onClick={() => onDistrictChange('')}
                className="hover:bg-blue-200 rounded-full p-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedCondition && (
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {selectedCondition === 'good' ? 'Baik' : 'Perlu Perbaikan'}
              <button
                onClick={() => onConditionChange('')}
                className="hover:bg-green-200 rounded-full p-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedType && (
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              {selectedType === 'lapangan' ? 'Lapangan' : 'Gedung'}
              <button
                onClick={() => onTypeChange('')}
                className="hover:bg-orange-200 rounded-full p-0.5 flex-shrink-0"
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
