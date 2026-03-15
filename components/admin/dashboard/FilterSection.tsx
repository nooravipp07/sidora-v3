'use client';

import React from 'react';
import { Filter, X } from 'lucide-react';

interface FilterSectionProps {
  selectedDistrict: string;
  selectedYear: string;
  onDistrictChange: (value: string) => void;
  onYearChange: (value: string) => void;
  onReset: () => void;
  districts: string[];
  years: number[];
}

export default function FilterSection({
  selectedDistrict,
  selectedYear,
  onDistrictChange,
  onYearChange,
  onReset,
  districts,
  years,
}: FilterSectionProps) {
  const hasActiveFilters = selectedDistrict || selectedYear;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-gray-600" />
        <h3 className="font-semibold text-gray-900">Filter Data</h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
        {/* District Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Kecamatan</label>
          <select
            value={selectedDistrict}
            onChange={(e) => {
              onDistrictChange(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Semua Kecamatan</option>
            {districts.map((district) => (
              <option key={district} value={district}>
                {district}
              </option>
            ))}
          </select>
        </div>

        {/* Year Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tahun</label>
          <select
            value={selectedYear}
            onChange={(e) => {
              onYearChange(e.target.value);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            <option value="">Pilih Tahun</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        {hasActiveFilters && (
          <div className="flex items-end">
            <button
              onClick={onReset}
              className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          </div>
        )}
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
          <p className="text-sm text-gray-600">Filter aktif:</p>
          {selectedDistrict && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {selectedDistrict}
              <button
                onClick={() => onDistrictChange('')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedYear && (
            <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
              {selectedYear}
              <button
                onClick={() => onYearChange('')}
                className="hover:bg-blue-200 rounded-full p-0.5"
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
