'use client';

import React, { useMemo } from 'react';
import KecamatanMap from '@/app/(admin)/components/dashboard-lembaga/KecamatanMap';
import LembagaSummaryCards from '@/app/(admin)/components/dashboard-lembaga/LembagaSummaryCards';
import LembagaCategoryStats from '@/app/(admin)/components/dashboard-lembaga/LembagaCategoryStats';
import MedalBarChart from '@/app/(admin)/components/dashboard-lembaga/MedalBarChart';
import AthletesTable from '@/app/(admin)/components/dashboard-lembaga/AthletesTable';
import { getInstitutionSummary } from '@/lib/institution/data';

export default function DashboardLembagaPage() {
  const institutionSummary = useMemo(() => {
    return getInstitutionSummary();
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Lembaga</h1>
        <p className="text-gray-600 mt-2">Informasi lengkap tentang lembaga olahraga dan data atlet</p>
      </div>

      {/* Summary Cards */}
      <LembagaSummaryCards summary={institutionSummary} />

      {/* Top Section: Map and Category Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kecamatan Map */}
        <div className="lg:col-span-2">
          <KecamatanMap />
        </div>

        {/* Lembaga Category Stats */}
        <div className="lg:col-span-1">
          <LembagaCategoryStats />
        </div>
      </div>

      {/* Bar Chart */}
      <MedalBarChart />

      {/* Athletes Table */}
      <AthletesTable />
    </div>
  );
}
