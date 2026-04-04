'use client';

import React, { useEffect, useState } from 'react';
import { Search, X } from 'lucide-react';

interface Kecamatan {
  id: number;
  nama: string;
}

interface InfrastructureFiltersProps {
  onDistrictChange: (district: string) => void;
  onConditionChange: (condition: string) => void;
  onYearChange: (year: string) => void;
  onReset: () => void;
  selectedDistrict?: string;
  selectedCondition?: string;
  selectedYear?: string;
}

export default function InfrastructureFilters({
  onDistrictChange,
  onConditionChange,
  onYearChange,
  onReset,
  selectedDistrict,
  selectedCondition,
  selectedYear
}: InfrastructureFiltersProps) {
  const [kecamatanList, setKecamatanList] = useState<Kecamatan[]>([]);
  const [loadingKecamatan, setLoadingKecamatan] = useState(true);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
  const hasActiveFilters = selectedDistrict || selectedCondition || selectedYear;

  useEffect(() => {
    const fetchKecamatan = async () => {
      try {
        setLoadingKecamatan(true);
        const response = await fetch('/api/masterdata/kecamatan-list');
        if (!response.ok) throw new Error('Failed to fetch kecamatan');
        
        const data = await response.json();
        if (data.success) {
          setKecamatanList(data.data);
        }
      } catch (error) {
        console.error('Error fetching kecamatan:', error);
      } finally {
        setLoadingKecamatan(false);
      }
    };

    fetchKecamatan();
  }, []);

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
            disabled={loadingKecamatan}
            className="w-full px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all disabled:bg-gray-100"
          >
            <option value="">Semua Kecamatan</option>
            {kecamatanList.map((kec) => (
              <option key={kec.id} value={kec.id.toString()}>
                {kec.nama}
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
            <option value="1">Baik</option>
            <option value="2">Cukup</option>
            <option value="3">Rusak Ringan</option>
            <option value="4">Rusak Berat</option>
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
              {kecamatanList.find(k => k.id.toString() === selectedDistrict)?.nama || selectedDistrict}
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
              {selectedCondition === '1' ? 'Baik' : selectedCondition === '2' ? 'Cukup' : selectedCondition === '3' ? 'Rusak Ringan' : 'Rusak Berat'}
              <button
                onClick={() => onConditionChange('')}
                className="hover:bg-green-200 rounded-full p-0.5 flex-shrink-0"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedYear && (
            <span className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium">
              Tahun {selectedYear}
              <button
                onClick={() => onYearChange('')}
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
