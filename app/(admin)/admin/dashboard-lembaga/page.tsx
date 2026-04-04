'use client';

import React from 'react';
import KecamatanMap from '@/components/admin/dashboard-lembaga/KecamatanMap';
import LembagaSummaryCards from '@/components/admin/dashboard-lembaga/LembagaSummaryCards';
import LembagaCategoryStats from '@/components/admin/dashboard-lembaga/LembagaCategoryStats';
import MedalBarChart from '@/components/admin/dashboard-lembaga/MedalBarChart';
import AthletesTable from '@/components/admin/dashboard-lembaga/AthletesTable';

export default function DashboardLembagaPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard Lembaga</h1>
        <p className="text-gray-600 mt-2">Informasi lengkap tentang lembaga olahraga dan data atlet</p>
      </div>

      {/* Summary Cards */}
      <LembagaSummaryCards />

      {/* Top Section: Map and Category Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kecamatan Map */}
        <div className="lg:col-span-2">
          <KecamatanMap />
        </div>
      </div>

      {/* Bar Chart */}
      <MedalBarChart />

      {/* Athletes Table */}
      <AthletesTable />
    </div>
  );
}
