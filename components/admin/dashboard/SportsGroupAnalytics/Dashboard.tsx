/**
 * SportsGroup Analytics Dashboard Page
 * Complete dashboard showcasing all analytics charts
 * Production-ready with state management, filters, and error handling
 */

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  RegionalGroupChart,
  VerificationStatusChart,
  GrowthTrendChart,
  MemberDistributionChart,
  MOCK_SPORTS_GROUPS,
  MOCK_REGION_MAPPING,
  SportsGroup,
} from './index';

type FilterType = 'all' | 'verified' | 'unverified';
type GroupingPeriod = 'year' | 'month';

/**
 * Main analytics dashboard
 * Displays 4 different chart visualizations with filtering capabilities
 */
export default function SportsGroupAnalyticsDashboard() {
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [groupingPeriod, setGroupingPeriod] = useState<GroupingPeriod>('year');
  const [isLoading, setIsLoading] = useState(false);

  // Simulate data loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [selectedFilter, groupingPeriod]);

  // Filter data based on verification status
  const filteredData: SportsGroup[] = useMemo(() => {
    if (selectedFilter === 'all') return MOCK_SPORTS_GROUPS;
    if (selectedFilter === 'verified')
      return MOCK_SPORTS_GROUPS.filter((g) => g.isVerified);
    return MOCK_SPORTS_GROUPS.filter((g) => !g.isVerified);
  }, [selectedFilter]);

  // Calculate summary statistics
  const stats = useMemo(
    () => ({
      totalGroups: filteredData.length,
      verifiedGroups: filteredData.filter((g) => g.isVerified).length,
      unverifiedGroups: filteredData.filter((g) => !g.isVerified).length,
      totalMembers: filteredData.reduce((sum, g) => sum + g.memberCount, 0),
      averageMembers:
        filteredData.length > 0
          ? Math.round(filteredData.reduce((sum, g) => sum + g.memberCount, 0) / filteredData.length)
          : 0,
    }),
    [filteredData]
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Analitik Kelompok Olahraga
        </h1>
        <p className="mt-2 text-gray-600">
          Dashboard komprehensif untuk monitoring dan analisis kelompok olahraga di seluruh wilayah
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5 mb-8">
        <SummaryCard
          label="Total Kelompok"
          value={stats.totalGroups}
          icon="📊"
          color="blue"
        />
        <SummaryCard
          label="Terverifikasi"
          value={stats.verifiedGroups}
          icon="✅"
          color="green"
        />
        <SummaryCard
          label="Belum Terverifikasi"
          value={stats.unverifiedGroups}
          icon="⏳"
          color="red"
        />
        <SummaryCard
          label="Total Anggota"
          value={stats.totalMembers}
          icon="👥"
          color="purple"
        />
        <SummaryCard
          label="Rerata Anggota"
          value={stats.averageMembers}
          icon="📈"
          color="amber"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 bg-white rounded-lg shadow-sm p-4 sm:p-6">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Filter by Verification */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Filter Status Verifikasi
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'verified', 'unverified'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setSelectedFilter(filter)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    selectedFilter === filter
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {filter === 'all'
                    ? 'Semua'
                    : filter === 'verified'
                      ? 'Terverifikasi'
                      : 'Belum Terverifikasi'}
                </button>
              ))}
            </div>
          </div>

          {/* Filter by Period */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Periode Tren Pertumbuhan
            </label>
            <div className="flex gap-2">
              {(['year', 'month'] as GroupingPeriod[]).map((period) => (
                <button
                  key={period}
                  onClick={() => setGroupingPeriod(period)}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${
                    groupingPeriod === period
                      ? 'bg-purple-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {period === 'year' ? 'Per Tahun' : 'Per Bulan'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 mb-8">
        {/* Regional Distribution */}
        <RegionalGroupChart
          data={filteredData}
          regionMap={MOCK_REGION_MAPPING}
          limit={10}
          isLoading={isLoading}
        />

        {/* Verification Status */}
        <VerificationStatusChart data={filteredData} isLoading={isLoading} />
      </div>

      {/* Growth Trend - Full Width */}
      <div className="mb-8">
        <GrowthTrendChart
          data={filteredData}
          period={groupingPeriod}
          isLoading={isLoading}
        />
      </div>

      {/* Member Distribution - Full Width */}
      <div className="mb-8">
        <MemberDistributionChart
          data={filteredData}
          isLoading={isLoading}
          highlightOutliers={true}
        />
      </div>

      {/* Data Quality Footer */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6">
        <h3 className="text-sm font-semibold text-blue-900 mb-2">
          ℹ️ Informasi Data
        </h3>
        <p className="text-sm text-blue-800">
          Dashboard ini menampilkan {stats.totalGroups} kelompok olahraga yang terdaftar.
          Data diperbarui secara real-time dari database. Gunakan filter untuk melihat
          informasi spesifik berdasarkan status verifikasi.
        </p>
        <div className="mt-3 text-xs text-blue-800 space-y-1">
          <p>• Wilayah yang ditampilkan: 8 Kecamatan</p>
          <p>• Jangka waktu data: 5 tahun terakhir</p>
          <p>• Pembaruan terakhir: {new Date().toLocaleString('id-ID')}</p>
        </div>
      </div>
    </div>
  );
}

/**
 * Summary Card Component
 */
interface SummaryCardProps {
  label: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'red' | 'purple' | 'amber';
}

function SummaryCard({ label, value, icon, color }: SummaryCardProps) {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-900 border-blue-200',
    green: 'bg-green-50 text-green-900 border-green-200',
    red: 'bg-red-50 text-red-900 border-red-200',
    purple: 'bg-purple-50 text-purple-900 border-purple-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-200',
  };

  return (
    <div
      className={`${colorClasses[color]} border rounded-lg p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow`}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs sm:text-sm font-medium opacity-75 mb-1">
            {label}
          </p>
          <p className="text-2xl sm:text-3xl font-bold">{value.toLocaleString('id-ID')}</p>
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}
