'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ChevronRight, Download } from 'lucide-react';
import PerformanceStatsCards from '@/lib/components/sports-performance/PerformanceStatsCards';
import PerformanceFilters from '@/lib/components/sports-performance/PerformanceFilters';
import PerformanceTable from '@/lib/components/sports-performance/PerformanceTable';
import { FilterOptions } from '@/lib/sports-performance/types';
import {
  getOrganizationStats,
  filterPerformanceData,
  performanceData
} from '@/lib/sports-performance/data';

const ITEMS_PER_PAGE = 10;

export default function OlahragaPrestasi() {
  const [filters, setFilters] = useState<FilterOptions>({});
  const [currentPage, setCurrentPage] = useState(1);

  const koniStats = getOrganizationStats('KONI');
  const npciStats = getOrganizationStats('NPCI');

  const { data: filteredData, totalPages, totalItems } = useMemo(() => {
    return filterPerformanceData(filters, currentPage, ITEMS_PER_PAGE);
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setFilters({});
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-green-600 transition-colors">
              Beranda
            </Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900 font-semibold">Olahraga Prestasi</span>
          </div>

          {/* Title */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Olahraga Prestasi
              </h1>
              <p className="text-lg text-gray-600">
                Data atlet, pelatih, dan wasit dari organisasi KONI dan NPCI
              </p>
            </div>
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Summary Statistics Cards */}
        <PerformanceStatsCards koniStats={koniStats} npciStats={npciStats} />

        {/* Filters Section */}
        <div className="mt-8">
          <PerformanceFilters
            onFilterChange={handleFilterChange}
            filters={filters}
            onReset={handleReset}
          />
        </div>

        {/* Data Table Section */}
        <div className="mt-8 bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
            <h2 className="text-xl font-bold text-gray-900">Data Personel Olahraga Prestasi</h2>
            <p className="text-sm text-gray-600 mt-1">
              Total: {totalItems} personel (Diperbarui: {new Date().toLocaleDateString('id-ID')})
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <PerformanceTable
              data={filteredData}
              totalPages={totalPages}
              totalItems={totalItems}
              currentPage={currentPage}
              onPageChange={handlePageChange}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tentang KONI</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              Komite Olahraga Nasional Indonesia (KONI) adalah organisasi induk yang mengelola olahraga prestasi di Indonesia dengan fokus pada pengembangan atlet berkualitas tinggi.
            </p>
          </div>

          <div className="p-6 rounded-lg border border-gray-200 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Tentang NPCI</h3>
            <p className="text-sm text-gray-600 leading-relaxed">
              National Paralympic Committee Indonesia (NPCI) adalah organisasi yang mengelola atlet paralimpik dan olahraga adaptif dengan standar internasional.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
