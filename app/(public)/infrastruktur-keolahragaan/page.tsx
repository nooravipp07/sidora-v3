'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import SummaryCards from '../components/infrastructure/SummaryCards';
import InfrastructureTable from '../components/infrastructure/InfrastructureTable';
import InfrastructureFilters from '../components/infrastructure/InfrastructureFilters';
import InfrastructureCharts from '../components/infrastructure/InfrastructureCharts';
import AthleteStatsCards from '@/lib/components/sports/AthleteStatsCards';
import AchievementStatistics from '@/lib/components/sports/AchievementStatistics';
import ClubSummaryCards from '@/lib/components/sports/ClubSummaryCards';
import ClubTable from '@/lib/components/sports/ClubTable';
import {
  getInfrastructureStats,
  getDistrictInfrastructure,
  filterFacilities
} from '@/lib/infrastructure/data';
import {
  getAthleteStats,
  getClubStats,
  achievementData,
  clubData
} from '@/lib/sports/data';

export default function InfrastructureKeolahraganPage() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [districtTablePage, setDistrictTablePage] = useState(1);
  const [facilityListPage, setFacilityListPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const stats = getInfrastructureStats();
  const districtData = getDistrictInfrastructure();
  const filteredFacilities = filterFacilities(selectedDistrict, selectedCondition, selectedType);

  // Filter district table data based on selected district
  const filteredDistricts = useMemo(() => {
    if (!selectedDistrict) return districtData;
    return districtData.filter(d => d.district === selectedDistrict);
  }, [selectedDistrict, districtData]);

  // Pagination for district table
  const districtTableTotalPages = Math.ceil(filteredDistricts.length / ITEMS_PER_PAGE);
  const districtTableStartIndex = (districtTablePage - 1) * ITEMS_PER_PAGE;
  const paginatedDistricts = useMemo(() => {
    return filteredDistricts.slice(districtTableStartIndex, districtTableStartIndex + ITEMS_PER_PAGE);
  }, [filteredDistricts, districtTableStartIndex]);

  // Pagination for facility list
  const facilityListTotalPages = Math.ceil(filteredFacilities.length / ITEMS_PER_PAGE);
  const facilityListStartIndex = (facilityListPage - 1) * ITEMS_PER_PAGE;
  const paginatedFacilities = useMemo(() => {
    return filteredFacilities.slice(facilityListStartIndex, facilityListStartIndex + ITEMS_PER_PAGE);
  }, [filteredFacilities, facilityListStartIndex]);

  const handleReset = () => {
    setSelectedDistrict('');
    setSelectedCondition('');
    setSelectedType('');
    setDistrictTablePage(1);
    setFacilityListPage(1);
  };

  const handleViewDetail = (district: string) => {
    setSelectedDistrict(district);
    setDistrictTablePage(1);
    setFacilityListPage(1);
    // Scroll to filter section
    const filtersElement = document.getElementById('filters-section');
    filtersElement?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
          {/* Title */}
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
                Infrastruktur Keolahragaan
              </h1>
              <p className="text-lg text-gray-600">
                Dashboard komprehensif infrastruktur, atlet, prestasi, dan klub olahraga di seluruh kecamatan
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
        <SummaryCards stats={stats} />

        {/* Data Visualization Section */}
        <InfrastructureCharts districts={districtData} stats={stats} />

        {/* Filters Section */}
        <div id="filters-section">
          <InfrastructureFilters
            onDistrictChange={setSelectedDistrict}
            onConditionChange={setSelectedCondition}
            onTypeChange={setSelectedType}
            onReset={handleReset}
            selectedDistrict={selectedDistrict}
            selectedCondition={selectedCondition}
            selectedType={selectedType}
          />
        </div>

        {/* District Breakdown Table */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Rincian per Kecamatan</h2>
              <p className="text-gray-600 mt-1">
                {selectedDistrict ? `Data untuk ${selectedDistrict}` : 'Lihat data fasilitas olahraga untuk setiap kecamatan'}
              </p>
            </div>
            {selectedDistrict && (
              <button
                onClick={() => setSelectedDistrict('')}
                className="text-sm text-gray-600 hover:text-green-600 transition-colors font-semibold"
              >
                Lihat Semua Kecamatan
              </button>
            )}
          </div>
          <InfrastructureTable
            districts={paginatedDistricts}
            onViewDetail={handleViewDetail}
          />

          {/* Pagination for District Table */}
          <div className="mt-6 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              Menampilkan {districtTableStartIndex + 1}-{Math.min(districtTableStartIndex + ITEMS_PER_PAGE, filteredDistricts.length)} dari {filteredDistricts.length} kecamatan
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setDistrictTablePage(prev => Math.max(1, prev - 1))}
                disabled={districtTablePage === 1}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Sebelumnya
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: districtTableTotalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setDistrictTablePage(page)}
                    className={`w-8 h-8 rounded text-sm font-semibold transition-colors ${
                      districtTablePage === page
                        ? 'bg-blue-600 text-white'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setDistrictTablePage(prev => Math.min(districtTableTotalPages, prev + 1))}
                disabled={districtTablePage === districtTableTotalPages}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Selanjutnya
              </button>
            </div>
          </div>
        </div>

        {/* Facility List if District Selected */}
        {selectedDistrict && filteredFacilities.length > 0 && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">
              Daftar Fasilitas - {selectedDistrict}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginatedFacilities.map((facility) => (
                <div
                  key={facility.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{facility.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{facility.address}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      facility.type === 'lapangan'
                        ? 'bg-orange-100 text-orange-700'
                        : 'bg-purple-100 text-purple-700'
                    }`}>
                      {facility.type === 'lapangan' ? 'Lapangan' : 'Gedung'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      facility.condition === 'good'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {facility.condition === 'good' ? 'Baik' : 'Perlu Perbaikan'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(facility.lastMaintenance).toLocaleDateString('id-ID')}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination for Facility List */}
            <div className="mt-6 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Menampilkan {facilityListStartIndex + 1}-{Math.min(facilityListStartIndex + ITEMS_PER_PAGE, filteredFacilities.length)} dari {filteredFacilities.length} fasilitas
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setFacilityListPage(prev => Math.max(1, prev - 1))}
                  disabled={facilityListPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sebelumnya
                </button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: facilityListTotalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setFacilityListPage(page)}
                      className={`w-8 h-8 rounded text-sm font-semibold transition-colors ${
                        facilityListPage === page
                          ? 'bg-blue-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setFacilityListPage(prev => Math.min(facilityListTotalPages, prev + 1))}
                  disabled={facilityListPage === facilityListTotalPages}
                  className="px-3 py-1 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Selanjutnya
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sports Ecosystem Dashboard Sections */}
        <div className="mt-16 space-y-12">
          {/* Divider */}
          <div className="border-t-2 border-gray-300 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Ekosistem Atlet</h2>
            <p className="text-gray-600">Statistik dan data atlet olahraga di berbagai cabang</p>
          </div>

          {/* Athlete Statistics */}
          <AthleteStatsCards stats={getAthleteStats()} />

          {/* Divider */}
          <div className="border-t-2 border-gray-300 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Pencapaian & Medali</h2>
            <p className="text-gray-600">Prestasi atlet dan perolehan medali dalam berbagai kejuaraan</p>
          </div>

          {/* Achievement Statistics */}
          <AchievementStatistics achievements={achievementData} />

          {/* Divider */}
          <div className="border-t-2 border-gray-300 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Manajemen Klub</h2>
            <p className="text-gray-600">Informasi klub olahraga, atlet, dan prestasi mereka</p>
          </div>

          {/* Club Statistics */}
          <ClubSummaryCards stats={getClubStats()} />

          {/* Club Table */}
          <ClubTable clubs={clubData} />
        </div>
      </div>
    </main>
  );
}