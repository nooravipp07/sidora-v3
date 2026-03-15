'use client';

import React, { useState } from 'react';
import SummaryCard from '@/components/admin/dashboard/SummaryCard';
import DashboardMap from '@/components/admin/dashboard/DashboardMap';
import DistrictTable from '@/components/admin/dashboard/DistrictTable';
import { getAvailableKecamatan, getAvailableYears, getDistrictSummary, getDistrictByKecamatan } from '@/lib/district/data';

export default function DashboardKecamatanPage() {
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Get districts and years from data
  const summary = getDistrictSummary();
  const allDistricts = getDistrictByKecamatan(''); // Get all districts

  return (
    <div className="w-full space-y-6">
        {/* Header */}
        <div className="mb-6 pb-4 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Kecamatan
          </h1>
          <p className="text-gray-600 mt-2">Ringkasan data kecamatan</p>
        </div>

        {/* Filter Section */}
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <SummaryCard
            label="Kecamatan"
            value={summary.totalDistricts}
            icon="📍"
            color="blue"
          />
          <SummaryCard
            label="Infrastruktur Olahraga"
            value={summary.totalInfrastructure}
            icon="🏟️"
            color="green"
          />
          <SummaryCard
            label="Kelompok Olahraga"
            value={summary.totalSportsGroups}
            icon="🏢"
            color="orange"
          />
          <SummaryCard
            label="Total Atlet"
            value={summary.totalAthletes}
            icon="⚡"
            color="purple"
          />
        </div>

        {/* Map Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Peta Distribusi
          </h2>
          <DashboardMap districts={allDistricts} />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Data Infrastruktur Olahraga
          </h2>
          <DistrictTable 
            districts={allDistricts}
            currentPage={currentPage}
            onPageChange={setCurrentPage}
          />
        </div>
      </div>
  );
}
