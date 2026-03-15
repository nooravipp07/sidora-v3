'use client';

import React from 'react';
import { Search, X } from 'lucide-react';
import { getAllLocations, getAllCategories } from '@/lib/agenda/data';

interface AgendaFiltersProps {
  onDateChange: (date: string) => void;
  onLocationChange: (location: string) => void;
  onReset: () => void;
  selectedDate?: string;
  selectedLocation?: string;
}

export default function AgendaFilters({
  onDateChange,
  onLocationChange,
  onReset,
  selectedDate,
  selectedLocation
}: AgendaFiltersProps) {
  const locations = getAllLocations();
  const categories = getAllCategories();
  const hasActiveFilters = selectedDate || selectedLocation;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Date Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-4 h-4 inline mr-2" />
            Filter Tanggal
          </label>
          <input
            type="date"
            value={selectedDate || ''}
            onChange={(e) => onDateChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            placeholder="Pilih tanggal"
          />
        </div>

        {/* Location Filter */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            <Search className="w-4 h-4 inline mr-2" />
            Filter Lokasi
          </label>
          <select
            value={selectedLocation || ''}
            onChange={(e) => onLocationChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          >
            <option value="">Semua Lokasi</option>
            {locations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        {/* Reset Button */}
        <div className="flex items-end">
          <button
            onClick={onReset}
            disabled={!hasActiveFilters}
            className={`w-full px-4 py-2 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 ${
              hasActiveFilters
                ? 'bg-red-600 text-white hover:bg-red-700'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
          >
            <X className="w-4 h-4" />
            Reset Filter
          </button>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200 flex flex-wrap gap-2">
          <span className="text-sm text-gray-600 font-semibold">Filter Aktif:</span>
          {selectedDate && (
            <span className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
              Tanggal: {new Date(selectedDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
              <button
                onClick={() => onDateChange('')}
                className="hover:bg-blue-200 rounded-full p-0.5"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {selectedLocation && (
            <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
              Lokasi: {selectedLocation}
              <button
                onClick={() => onLocationChange('')}
                className="hover:bg-green-200 rounded-full p-0.5"
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
