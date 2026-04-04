/**
 * Regional Distribution Chart Component
 * Horizontal bar chart showing total groups per region (Kecamatan)
 * Production-ready with TypeScript and performance optimization
 */

'use client';

import React, { useMemo, FC } from 'react';
import dynamic from 'next/dynamic';
import { aggregateGroupsByRegion, SportsGroup } from './utils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface RegionalGroupChartProps {
  data: SportsGroup[];
  regionMap?: Map<number, string>;
  limit?: number;
  isLoading?: boolean;
}

interface ChartState {
  series: Array<{ name: string; data: number[] }>;
  options: ApexCharts.ApexOptions;
}

/**
 * Chart component displaying distribution of groups across regions
 * - Sorted by total groups (descending)
 * - Shows top N regions (default 10)
 * - Responsive horizontal bar layout
 */
export const RegionalGroupChart: FC<RegionalGroupChartProps> = ({
  data,
  regionMap,
  limit = 10,
  isLoading = false,
}) => {
  const chartData: ChartState = useMemo(() => {
    const aggregated = aggregateGroupsByRegion(data, regionMap, limit);

    if (aggregated.length === 0) {
      return {
        series: [{ name: 'Kelompok', data: [] }],
        options: {
          chart: { type: 'bar' as const },
          xaxis: { categories: [] },
        } as ApexCharts.ApexOptions,
      };
    }

    return {
      series: [
        {
          name: 'Jumlah Kelompok',
          data: aggregated.map((r) => r.totalGroups),
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
            horizontal: true,
            columnWidth: '75%',
            borderRadius: 4,
            dataLabels: { position: 'top' as const },
            borderRadiusApplication: 'around' as const,
          },
        },
        dataLabels: {
          enabled: true,
          offsetX: 0,
          style: {
            fontSize: '12px',
            fontWeight: 600,
            colors: ['#000'],
          },
        },
        xaxis: {
          categories: aggregated.map((r) => r.regionName),
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: { fontSize: '12px', fontWeight: 500 },
          },
        },
        yaxis: {
          title: {
            text: 'Wilayah',
            style: { fontSize: '12px', fontWeight: 600 },
          },
          labels: { formatter: (val: number) => String(val) },
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          x: { show: true, format: 'string' },
          y: {
            formatter: (value: number) => `${value} kelompok`,
            title: { formatter: () => 'Total' },
          },
        },
        colors: ['#3b82f6'],
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
              chart: { height: 400 },
              plotOptions: { bar: { columnWidth: '80%' } },
              xaxis: { labels: { style: { fontSize: '10px' } } },
            },
          },
        ],
      } as ApexCharts.ApexOptions,
    };
  }, [data, regionMap, limit]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  if (chartData.series[0].data.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Tidak ada data untuk ditampilkan</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Distribusi Kelompok per Wilayah
      </h3>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="bar"
        height={Math.max(300, chartData.series[0].data.length * 40)}
      />
    </div>
  );
};

export default RegionalGroupChart;
