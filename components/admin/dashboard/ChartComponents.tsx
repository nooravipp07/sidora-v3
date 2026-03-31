/**
 * DASHBOARD CHART COMPONENTS - PRODUCTION READY
 * Refactored components for improved data visualization
 * 
 * Usage: Import these components into page.tsx and replace current chart sections
 */

import React, { FC } from 'react';
import dynamic from 'next/dynamic';
const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

// ============================================================================
// 1. ATHLETE & SPORTS GROUP - GROUPED BAR CHART
// ============================================================================

interface AthleteGroupChartProps {
  athleteData: {
    labels: string[];
    series: number[];
  };
  groupData: {
    labels: string[];
    series: number[];
  };
  totalAthletes: number;
  totalGroups: number;
  isLoading?: boolean;
}

export const AthleteGroupBarChart: FC<AthleteGroupChartProps> = ({
  athleteData,
  groupData,
  totalAthletes,
  totalGroups,
  isLoading = false,
}) => {
  // Ensure both datasets have same labels (same sports)
  const labels = athleteData.labels;

  const chartConfig = {
    chart: {
      type: 'bar' as const,
      stacked: false,
      toolbar: {
        show: true,
        tools: {
          download: true,
          selection: true,
          zoom: true,
          zoomin: true,
          zoomout: true,
          pan: true,
          reset: true,
        },
      },
      animations: { enabled: true, easing: 'easeinout' as const, speed: 800 },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: '65%',
        borderRadius: 4,
        dataLabels: { position: 'top' as const },
        borderRadiusApplication: 'around' as const,
      },
    },
    dataLabels: {
      enabled: true,
      offsetY: -20,
      style: { fontSize: '12px', fontWeight: 600 },
      formatter: (val: number) => `${val}`,
    },
    xaxis: {
      categories: labels,
      axisBorder: { show: false },
      axisTicks: { show: false },
      labels: {
        style: { fontSize: '12px', fontWeight: 500 },
        rotateAlways: false,
        maxHeight: 100,
      },
    },
    yaxis: {
      title: { text: 'Jumlah', style: { fontSize: '12px', fontWeight: 600 } },
      labels: { formatter: (val: number) => `${val}` },
    },
    series: [
      {
        name: 'Atlet',
        data: athleteData.series,
      },
      {
        name: 'Kelompok Olahraga',
        data: groupData.series,
      },
    ],
    colors: ['#3b82f6', '#10b981'],
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `${val} item`,
      },
      intersect: false,
      shared: true,
    },
    legend: {
      position: 'top' as const,
      fontSize: 12,
      fontWeight: 600,
    },
    grid: {
      show: true,
      borderColor: '#e5e7eb',
      strokeDashArray: 0,
      padding: {
        top: 10,
        right: 10,
        bottom: 0,
        left: 0,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-slate-50 rounded-lg">
        <span className="text-slate-500">Memuat chart...</span>
      </div>
    );
  }

  if (athleteData.series.length === 0 || groupData.series.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-slate-50 rounded-lg">
        <span className="text-slate-500">Tidak ada data</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-xs uppercase text-blue-600 font-semibold">Total Atlet</p>
          <p className="text-2xl font-bold text-blue-700">{totalAthletes.toLocaleString('id-ID')}</p>
        </div>
        <div className="p-3 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs uppercase text-green-600 font-semibold">Total Kelompok</p>
          <p className="text-2xl font-bold text-green-700">{totalGroups.toLocaleString('id-ID')}</p>
        </div>
      </div>
      <ReactApexChart
        type="bar"
        width="100%"
        height={350}
        series={chartConfig.series}
        options={chartConfig as any}
      />
    </div>
  );
};

// ============================================================================
// 2. PRESTASI ATLET (ACHIEVEMENT) - HORIZONTAL BAR RANKING
// ============================================================================

interface KecamatanAchievement {
  id: number;
  nama: string;
  totalAchievement: number;
}

interface AchievementRankingChartProps {
  kecamatanData: KecamatanAchievement[];
  maxItems?: number;
  isLoading?: boolean;
}

export const AchievementRankingChart: FC<AchievementRankingChartProps> = ({
  kecamatanData,
  maxItems = 12,
  isLoading = false,
}) => {
  // Sort descending and limit to maxItems
  const sortedData = [...kecamatanData]
    .sort((a, b) => b.totalAchievement - a.totalAchievement)
    .slice(0, maxItems);

  const chartConfig = {
    chart: {
      type: 'bar' as const,
      stacked: false,
      toolbar: { show: true },
      animations: { enabled: true, easing: 'easeinout' as const },
      fontFamily: 'inherit',
    },
    plotOptions: {
      bar: {
        horizontal: true,
        columnWidth: '75%',
        barHeight: '70%',
        borderRadius: 4,
        dataLabels: { position: 'right' as const, offsetX: 10 },
      },
    },
    dataLabels: {
      enabled: true,
      offsetX: 5,
      style: {
        fontSize: '12px',
        fontWeight: 600,
        colors: ['#1f2937'],
      },
      formatter: (val: number) => `${val}`,
    },
    xaxis: {
      categories: sortedData.map((k) => k.nama),
      title: { text: 'Total Prestasi', style: { fontSize: '12px' } },
      axisBorder: { show: false },
      labels: {
        style: { fontSize: '11px' },
      },
    },
    yaxis: {
      reversed: false,
      labels: { style: { fontSize: '11px' } },
    },
    series: [
      {
        name: 'Prestasi Atlet',
        data: sortedData.map((k) => k.totalAchievement),
      },
    ],
    colors: (value: number) => {
      // Color gradient based on value
      const max = Math.max(...sortedData.map((k) => k.totalAchievement), 1);
      const ratio = value / max;
      if (ratio > 0.7) return '#06b6d4'; // cyan (high)
      if (ratio > 0.4) return '#3b82f6'; // blue (medium)
      return '#f97316'; // orange (low)
    },
    tooltip: {
      theme: 'light',
      y: {
        formatter: (val: number) => `${val} prestasi`,
      },
    },
    legend: { show: false },
    grid: {
      show: true,
      borderColor: '#e5e7eb',
      strokeDashArray: 0,
      padding: {
        top: 10,
        right: 20,
        bottom: 0,
        left: 0,
      },
    },
  };

  if (isLoading) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-slate-50 rounded-lg">
        <span className="text-slate-500">Memuat chart...</span>
      </div>
    );
  }

  if (sortedData.length === 0) {
    return (
      <div className="w-full h-96 flex items-center justify-center bg-slate-50 rounded-lg">
        <span className="text-slate-500">Tidak ada data prestasi</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 p-3 bg-cyan-50 border border-cyan-200 rounded-lg">
        <p className="text-xs uppercase text-cyan-600 font-semibold">Top Performer</p>
        <p className="text-lg font-bold text-cyan-700">
          {sortedData[0].nama} - {sortedData[0].totalAchievement} prestasi
        </p>
      </div>
      <ReactApexChart
        type="bar"
        width="100%"
        height={400}
        series={chartConfig.series}
        options={chartConfig as any}
      />
    </div>
  );
};

// ============================================================================
// 3. EQUIPMENT (SARANA) - DUAL METRIC CARDS WITH MINI BREAKDOWN
// ============================================================================

interface EquipmentMetricsProps {
  totalRecords: number;
  totalQuantity: number;
  isLoading?: boolean;
}

export const EquipmentMetrics: FC<EquipmentMetricsProps> = ({
  totalRecords,
  totalQuantity,
  isLoading = false,
}) => {
  const avgQuantityPerRecord = totalRecords > 0 ? Math.round(totalQuantity / totalRecords * 10) / 10 : 0;
  const utilizationPercent = totalRecords > 0 ? Math.round((totalQuantity / (totalRecords * 5)) * 100) : 0; // assuming ideal is 5 per record

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
        <p className="text-xs uppercase text-blue-600 font-semibold mb-1">Total Records</p>
        <p className="text-3xl font-bold text-blue-700">{totalRecords.toLocaleString('id-ID')}</p>
        <p className="text-xs text-blue-600 mt-2">item sarana terdaftar</p>
      </div>

      <div className="p-4 bg-gradient-to-br from-cyan-50 to-cyan-100 rounded-lg border border-cyan-200">
        <p className="text-xs uppercase text-cyan-600 font-semibold mb-1">Rata-rata Kuantitas</p>
        <p className="text-3xl font-bold text-cyan-700">{avgQuantityPerRecord}</p>
        <p className="text-xs text-cyan-600 mt-2">per item sarana</p>
      </div>

      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
        <p className="text-xs uppercase text-orange-600 font-semibold mb-1">Total Kuantitas</p>
        <p className="text-3xl font-bold text-orange-700">{totalQuantity.toLocaleString('id-ID')}</p>
        <p className="text-xs text-orange-600 mt-2">unit fisik tersedia</p>
      </div>
    </div>
  );
};

// ============================================================================
// 4. INFRASTRUCTURE (PRASARANA) - DISTRIBUTION OVERVIEW
// ============================================================================

interface PrasaranaMetricsProps {
  totalCount: number;
  totalGroups?: number;
  totalAthletes?: number;
  isLoading?: boolean;
}

export const PrasaranaMetrics: FC<PrasaranaMetricsProps> = ({
  totalCount,
  totalGroups = 0,
  totalAthletes = 0,
  isLoading = false,
}) => {
  const groupsPerFacility = totalCount > 0 ? Math.round((totalGroups / totalCount) * 10) / 10 : 0;
  const athletesPerFacility = totalCount > 0 ? Math.round((totalAthletes / totalCount) * 10) / 10 : 0;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200">
        <p className="text-xs uppercase text-orange-600 font-semibold mb-1">Total Prasarana</p>
        <p className="text-3xl font-bold text-orange-700">{totalCount.toLocaleString('id-ID')}</p>
        <p className="text-xs text-orange-600 mt-2">fasilitas infrastruktur</p>
      </div>

      <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
        <p className="text-xs uppercase text-green-600 font-semibold mb-1">Kelompok per Prasarana</p>
        <p className="text-3xl font-bold text-green-700">{groupsPerFacility}</p>
        <p className="text-xs text-green-600 mt-2">rata-rata penggunaan</p>
      </div>

      <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-lg border border-indigo-200">
        <p className="text-xs uppercase text-indigo-600 font-semibold mb-1">Atlet per Prasarana</p>
        <p className="text-3xl font-bold text-indigo-700">{athletesPerFacility}</p>
        <p className="text-xs text-indigo-600 mt-2">rata-rata kapasitas</p>
      </div>
    </div>
  );
};

// ============================================================================
// 5. ADVANCED: ATHLETE PERFORMANCE CORRELATION (SCATTER PLOT)
// ============================================================================

interface KecamatanPerformance {
  id: number;
  nama: string;
  totalSportsGroups: number;
  totalAchievement: number;
  totalAthletes: number;
}

interface PerformanceCorrelationProps {
  kecamatanData: KecamatanPerformance[];
  isLoading?: boolean;
}

export const PerformanceCorrelationChart: FC<PerformanceCorrelationProps> = ({
  kecamatanData,
  isLoading = false,
}) => {
  const scatterData = kecamatanData.map((k) => ({
    x: k.totalSportsGroups,
    y: k.totalAchievement,
    size: Math.sqrt(k.totalAthletes) * 8, // bubble size based on athletes
  }));

  const chartConfig = {
    chart: {
      type: 'scatter' as const,
      toolbar: { show: true },
      zoom: { enabled: true },
      animations: { enabled: true },
      fontFamily: 'inherit',
    },
    plotOptions: {
      scatter: {
        size: 6,
        dataLabels: { enabled: false },
      },
    },
    xaxis: {
      title: {
        text: 'Jumlah Kelompok Olahraga',
        style: { fontSize: '12px', fontWeight: 600 },
      },
      type: 'numeric' as const,
      axisBorder: { show: false },
      labels: { style: { fontSize: '11px' } },
    },
    yaxis: {
      title: {
        text: 'Total Prestasi Atlet',
        style: { fontSize: '12px', fontWeight: 600 },
      },
      labels: { style: { fontSize: '11px' } },
    },
    series: [
      {
        name: 'Kecamatan',
        data: scatterData.map((d) => ({ x: d.x, y: d.y })),
      },
    ],
    colors: ['#8b5cf6'],
    tooltip: {
      theme: 'light',
      intersect: false,
      shared: true,
      followCursor: true,
      custom: ({ series, seriesIndex, dataPointIndex }: any) => {
        const punto = scatterData[dataPointIndex];
        const kec = kecamatanData[dataPointIndex];
        return `<div class="px-3 py-2 rounded bg-white border border-slate-200">
          <p class="font-semibold text-sm">${kec?.nama}</p>
          <p class="text-xs text-slate-600">Kelompok: ${punto?.x}</p>
          <p class="text-xs text-slate-600">Prestasi: ${punto?.y}</p>
          <p class="text-xs text-slate-600">Atlet: ${kec?.totalAthletes}</p>
        </div>`;
      },
    },
    grid: {
      show: true,
      borderColor: '#e5e7eb',
      strokeDashArray: 0,
    },
  };

  if (isLoading) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-slate-50 rounded-lg">
        <span className="text-slate-500">Memuat chart...</span>
      </div>
    );
  }

  if (scatterData.length === 0) {
    return (
      <div className="w-full h-80 flex items-center justify-center bg-slate-50 rounded-lg">
        <span className="text-slate-500">Tidak ada data</span>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-3 text-xs text-slate-600 px-2">
        📊 Bubble size = jumlah atlet per kecamatan
      </div>
      <ReactApexChart
        type="scatter"
        width="100%"
        height={350}
        series={chartConfig.series}
        options={chartConfig as any}
      />
      <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-lg text-xs text-purple-800">
        <p className="font-semibold mb-1">💡 Insight:</p>
        <p>Korelasi positif menunjukkan area dengan lebih banyak kelompok menghasilkan lebih banyak prestasi atlet.</p>
      </div>
    </div>
  );
};

// ============================================================================
// 6. UTILITY: COLOR GRADIENT BY VALUE
// ============================================================================

export const getPerformanceColor = (value: number, max: number): string => {
  const ratio = value / max;
  if (ratio > 0.7) return '#06b6d4'; // cyan
  if (ratio > 0.4) return '#3b82f6'; // blue
  return '#f97316'; // orange
};

export const getGradientStyle = (
  value: number,
  max: number,
  colorStart = '#3b82f6',
  colorEnd = '#06b6d4'
) => {
  const ratio = (value / max) * 100;
  return {
    background: `linear-gradient(90deg, ${colorStart} 0%, ${colorEnd} ${ratio}%)`,
    width: `${Math.min(ratio, 100)}%`,
  };
};
