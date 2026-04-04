/**
 * Member Count Distribution Chart Component
 * Histogram-like bar chart showing distribution of member counts
 * Production-ready with TypeScript and performance optimization
 */

'use client';

import React, { useMemo, FC } from 'react';
import dynamic from 'next/dynamic';
import { calculateMemberDistribution, identifyOutliers, SportsGroup } from './utils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface MemberDistributionChartProps {
  data: SportsGroup[];
  isLoading?: boolean;
  highlightOutliers?: boolean;
}

interface ChartState {
  series: Array<{ name: string; data: number[] }>;
  options: ApexCharts.ApexOptions;
  outliers: SportsGroup[];
}

/**
 * Chart component displaying member count distribution
 * - Histogram-like bar chart with predefined bins
 * - Optional outlier highlighting
 * - Shows bin ranges and group counts
 */
export const MemberDistributionChart: FC<MemberDistributionChartProps> = ({
  data,
  isLoading = false,
  highlightOutliers = true,
}) => {
  const chartData: ChartState = useMemo(() => {
    const distribution = calculateMemberDistribution(data);
    const outliers = highlightOutliers ? identifyOutliers(data) : [];

    if (distribution.every((bin) => bin.count === 0)) {
      return {
        series: [{ name: 'Kelompok', data: [] }],
        options: {
          chart: { type: 'bar' as const },
          xaxis: { categories: [] },
        } as ApexCharts.ApexOptions,
        outliers: [],
      };
    }

    // Create series data
    const seriesData = distribution.map((bin) => bin.count);
    const colors = distribution.map((bin) => {
      // Highlight bins with outliers
      const hasOutliers = outliers.some((o) =>
        bin.groupNames.includes(o.groupName)
      );
      return hasOutliers ? '#f59e0b' : '#6366f1';
    });

    return {
      series: [
        {
          name: 'Jumlah Kelompok',
          data: seriesData,
        },
      ],
      options: {
        chart: {
          type: 'bar' as const,
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
          animations: {
            enabled: true,
            easing: 'easeinout' as const,
            speed: 800,
            animateGradually: { enabled: true, delay: 150 },
            dynamicAnimation: { enabled: true, speed: 150 },
          },
          fontFamily: 'inherit',
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '70%',
            borderRadius: 4,
            dataLabels: { position: 'top' as const },
            borderRadiusApplication: 'around' as const,
            distributed: highlightOutliers,
            colors: {
              ranges: highlightOutliers
                ? distribution.map((_, idx) => ({
                    from: idx,
                    to: idx,
                    color: colors[idx],
                  }))
                : undefined,
            },
          },
        },
        dataLabels: {
          enabled: true,
          offsetY: -20,
          style: {
            fontSize: '12px',
            fontWeight: 600,
            colors: ['#000'],
          },
          formatter: (val: number) => `${val}`,
        },
        xaxis: {
          categories: distribution.map((bin) => bin.label),
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: { fontSize: '12px', fontWeight: 500 },
          },
          tooltip: {
            enabled: false,
          },
        },
        yaxis: {
          title: {
            text: 'Jumlah Kelompok',
            style: { fontSize: '12px', fontWeight: 600 },
          },
          labels: {
            formatter: (val: number) => `${val}`,
            style: { fontSize: '12px' },
          },
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          x: {
            show: true,
            formatter: (val: number) => {
              const bin = distribution[val];
              return `Range: ${bin.label} anggota`;
            },
          },
          y: {
            formatter: (value: number) => `${value} kelompok`,
            title: { formatter: () => 'Total' },
          },
          custom: ({ series, seriesIndex, dataPointIndex }: any) => {
            const bin = distribution[dataPointIndex];
            const count = series[seriesIndex][dataPointIndex];
            const isOutlier = outliers.some((o) =>
              bin.groupNames.includes(o.groupName)
            );

            return `
              <div class="px-3 py-2 bg-white border border-gray-300 rounded shadow-lg">
                <p class="text-sm font-semibold text-gray-900">${bin.label} anggota</p>
                <p class="text-sm text-gray-700">${count} kelompok</p>
                ${
                  isOutlier
                    ? '<p class="text-xs text-orange-600 font-medium mt-1">⚠️ Ada outlier</p>'
                    : ''
                }
              </div>
            `;
          },
        },
        colors: ['#6366f1'],
        grid: {
          show: true,
          borderColor: '#e5e7eb',
          strokeDashArray: 4,
          padding: { left: 10, right: 10, top: 10, bottom: 10 },
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: { height: 300 },
              plotOptions: { bar: { columnWidth: '75%' } },
              xaxis: { labels: { style: { fontSize: '10px' } } },
            },
          },
        ],
      } as ApexCharts.ApexOptions,
      outliers,
    };
  }, [data, highlightOutliers]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  if (chartData.series[0].data.length === 0 || chartData.series[0].data.every(d => d === 0)) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Tidak ada data untuk ditampilkan</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            Distribusi Jumlah Anggota
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Menunjukkan sebaran kelompok berdasarkan jumlah anggota
          </p>
        </div>
        {highlightOutliers && chartData.outliers.length > 0 && (
          <div className="inline-flex items-center gap-1 px-2.5 py-1 bg-orange-50 text-orange-700 text-xs font-medium rounded-full border border-orange-200">
            ⚠️ {chartData.outliers.length} Outlier
          </div>
        )}
      </div>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={350}
      />
      {highlightOutliers && chartData.outliers.length > 0 && (
        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
          <p className="text-xs font-semibold text-orange-900 mb-2">
            Kelompok dengan jumlah anggota luar biasa:
          </p>
          <ul className="text-xs text-orange-800 space-y-1">
            {chartData.outliers.slice(0, 5).map((group) => (
              <li key={group.id}>
                • {group.groupName} ({group.memberCount} anggota)
              </li>
            ))}
            {chartData.outliers.length > 5 && (
              <li className="text-orange-700">
                +{chartData.outliers.length - 5} lainnya...
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default MemberDistributionChart;
