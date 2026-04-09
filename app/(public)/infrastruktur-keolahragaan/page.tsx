'use client';

import React, { useState, useMemo } from 'react';
import { ChevronRight, Download } from 'lucide-react';
import Link from 'next/link';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';
import { SummaryCards, InfrastructureTable, InfrastructureFilters, InfrastructureCharts, KecamatanSummaryTable } from '@/components/public/infrastructure';
import { AthleteStatsCards, AchievementStatistics, ClubSummaryCards, ClubTable } from '@/components/ui/sports';
import AchievementStatsCards from '@/components/public/sports/AchievementStatsCards';
import AchievementFilters from '@/components/public/sports/AchievementFilters';
import AchievementTable from '@/components/public/sports/AchievementTable';
import {
  getInfrastructureStats,
  getDistrictInfrastructure,
  filterFacilities
} from '@/lib/infrastructure/data';
import {
  achievementData,
  clubData
} from '@/lib/sports/data';

export default function InfrastructureKeolahraganPage() {
  useTrackPageView('/infrastruktur-keolahragaan');
  const [selectedKecamatanId, setSelectedKecamatanId] = useState<string>('');
  const [selectedKecamatanName, setSelectedKecamatanName] = useState<string>('');
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>('');
  const [districtTablePage, setDistrictTablePage] = useState(1);
  const [facilityListPage, setFacilityListPage] = useState(1);
  const [summaryTablePage, setSummaryTablePage] = useState(1);
  const [achievementSport, setAchievementSport] = useState<string>('');
  const [achievementMedal, setAchievementMedal] = useState<string>('');
  const [achievementYear, setAchievementYear] = useState<string>('');
  const [achievementDistrict, setAchievementDistrict] = useState<string>('');
  const [achievementPage, setAchievementPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  const stats = getInfrastructureStats();
  const districtData = getDistrictInfrastructure();
  const filteredFacilities = filterFacilities(selectedKecamatanName, selectedCondition);

  // Filter district table data based on selected district
  const filteredDistricts = useMemo(() => {
    if (!selectedKecamatanName) return districtData;
    return districtData.filter(d => d.district === selectedKecamatanName);
  }, [selectedKecamatanName, districtData]);

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
    setSelectedKecamatanId('');
    setSelectedKecamatanName('');
    setSelectedCondition('');
    setSelectedYear('');
    setDistrictTablePage(1);
    setFacilityListPage(1);
    setSummaryTablePage(1);
    setAchievementSport('');
    setAchievementMedal('');
    setAchievementYear('');
    setAchievementDistrict('');
    setAchievementPage(1);
  };

  const handleViewDetail = (district: string) => {
    setSelectedKecamatanName(district);
    setDistrictTablePage(1);
    setFacilityListPage(1);
    setSummaryTablePage(1);
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
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
                {/* Filters Section */}
        <div id="filters-section">
          <InfrastructureFilters
            onDistrictChange={(val) => {
              setSelectedKecamatanId(val);
              // Fetch kecamatan name for display
              if (val) {
                fetch('/api/masterdata/kecamatan-list')
                  .then(res => res.json())
                  .then(data => {
                    const kec = data.data?.find((k: any) => k.id.toString() === val);
                    if (kec) setSelectedKecamatanName(kec.nama);
                  })
                  .catch(err => console.error('Error fetching kecamatan:', err));
              } else {
                setSelectedKecamatanName('');
              }
            }}
            onConditionChange={setSelectedCondition}
            onYearChange={setSelectedYear}
            onReset={handleReset}
            selectedDistrict={selectedKecamatanId}
            selectedCondition={selectedCondition}
            selectedYear={selectedYear}
          />
        </div>
        {/* Summary Statistics Cards */}
        <SummaryCards 
          year={selectedYear} 
          condition={selectedCondition}
          kecamatanId={selectedKecamatanId}
        />

        {/* Data Visualization Section */}
        <InfrastructureCharts 
          year={selectedYear}
          condition={selectedCondition}
          kecamatanId={selectedKecamatanId}
        />

        {/* Kecamatan Summary Table Section */}
        <div className="mb-12">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Statistik Ringkas Kecamatan</h2>
            <p className="text-gray-600">Ringkasan total fasilitas, fasilitas berkondisi baik, dan rusak berat untuk setiap kecamatan</p>
          </div>
          <KecamatanSummaryTable
            year={selectedYear}
            kecamatanId={selectedKecamatanId}
            condition={selectedCondition}
            page={summaryTablePage}
            onPageChange={setSummaryTablePage}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        </div>

        {/* Sports Ecosystem Dashboard Sections */}
        <div className="mt-16 space-y-12">

          {/* Divider */}
          <div className="border-t-2 border-gray-300 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Prestasi Atlet</h2>
            <p className="text-gray-600">Prestasi atlet dan perolehan medali dalam berbagai kejuaraan</p>
          </div>

          {/* Achievement Statistics Cards */}
          <AchievementStatsCards 
            sport={achievementSport}
            medal={achievementMedal}
            year={achievementYear}
            district={achievementDistrict}
          />

          {/* Achievement Filters */}
          <AchievementFilters
            onSportChange={setAchievementSport}
            onMedalChange={setAchievementMedal}
            onYearChange={setAchievementYear}
            onDistrictChange={setAchievementDistrict}
            onReset={() => {
              setAchievementSport('');
              setAchievementMedal('');
              setAchievementYear('');
              setAchievementDistrict('');
              setAchievementPage(1);
            }}
            selectedSport={achievementSport}
            selectedMedal={achievementMedal}
            selectedYear={achievementYear}
            selectedDistrict={achievementDistrict}
          />

          {/* Achievement Table */}
          <AchievementTable
            sport={achievementSport}
            medal={achievementMedal}
            year={achievementYear}
            district={achievementDistrict}
            page={achievementPage}
            onPageChange={setAchievementPage}
            itemsPerPage={ITEMS_PER_PAGE}
          />

          {/* Divider */}
          <div className="border-t-2 border-gray-300 pt-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Kelompok Olahraga</h2>
            <p className="text-gray-600">Informasi klub olahraga, atlet, dan prestasi mereka</p>
          </div>

          {/* Club Statistics */}
          <ClubSummaryCards 
            kecamatanId={selectedKecamatanId ? parseInt(selectedKecamatanId) : null}
            year={selectedYear ? parseInt(selectedYear) : undefined}
          />

          {/* Club Table */}
          <ClubTable clubs={clubData} />
        </div>
      </div>
    </main>
  );
}