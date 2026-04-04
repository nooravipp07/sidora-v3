/**
 * Growth Trend Chart Component
 * Line chart showing group creation trend over time
 * Production-ready with TypeScript and performance optimization
 */

'use client';

import React, { useMemo, FC } from 'react';
import dynamic from 'next/dynamic';
import { calculateGrowthTrend, SportsGroup } from './utils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

type GroupingPeriod = 'year' | 'month';

interface GrowthTrendChartProps {
  data: SportsGroup[];
  period?: GroupingPeriod;
  isLoading?: boolean;
}

interface ChartState {
  series: Array<{ name: string; data: number[] }>;
  options: ApexCharts.ApexOptions;
}

/**
 * Chart component displaying group growth trend
 * - Line chart with smooth curve
 * - Auto-selects period (year/month) based on data density
 * - Shows trend with interactive legend and tooltip
 */
export const GrowthTrendChart: FC<GrowthTrendChartProps> = ({
  data,
  period,
  isLoading = false,
}) => {
  const chartData: ChartState = useMemo(() => {
    const trends = calculateGrowthTrend(data, period);

    if (trends.length === 0) {
      return {
        series: [{ name: 'Kelompok', data: [] }],
        options: {
          chart: { type: 'line' as const },
          xaxis: { categories: [] },
        } as ApexCharts.ApexOptions,
      };
    }

    // Determine period type for label
    const isPeriodMonth = trends[0].month !== undefined;

    return {
      series: [
        {
          name: 'Total Kelompok',
          data: trends.map((t) => t.count),
        },
      ],
      options: {
        chart: {
          type: 'line' as const,
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
          animations: {
            enabled: true,
            easing: 'easeinout' as const,
            speed: 800,
            animateGradually: { enabled: true, delay: 150 },
            dynamicAnimation: { enabled: true, speed: 150 },
          },
          fontFamily: 'inherit',
          zoom: {
            enabled: true,
            type: 'x' as const,
          },
        },
        dataLabels: { enabled: false },
        stroke: {
          show: true,
          curve: 'smooth' as const,
          lineCap: 'round' as const,
          colors: ['#8b5cf6'],
          width: 3,
          dashArray: 0,
        },
        plotOptions: {
          bar: {
            horizontal: false,
            columnWidth: '55%',
            borderRadius: 4,
          },
        },
        xaxis: {
          categories: trends.map((t) =>
            isPeriodMonth ? formatMonthLabel(t.period) : t.period
          ),
          axisBorder: { show: false },
          axisTicks: { show: false },
          labels: {
            style: { fontSize: '12px', fontWeight: 500 },
            rotateAlways: trends.length > 10,
            rotate: trends.length > 10 ? -45 : 0,
            maxHeight: 100,
          },
          tooltip: {
            enabled: true,
            theme: 'light',
            offsetY: 0,
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
          shared: true,
          intersect: false,
          x: {
            show: true,
            format: 'string',
            formatter: (value: string) =>
              isPeriodMonth ? formatMonthLabel(value) : value,
          },
          y: {
            formatter: (value: number) => `${value} kelompok`,
            title: { formatter: () => 'Total' },
          },
        },
        colors: ['#8b5cf6'],
        grid: {
          show: true,
          borderColor: '#e5e7eb',
          strokeDashArray: 4,
          padding: { left: 10, right: 10, top: 10, bottom: 10 },
        },
        fill: {
          type: 'gradient',
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.24,
            opacityTo: 0.09,
            stops: [0, 100],
          },
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              chart: { height: 300 },
              xaxis: {
                labels: {
                  style: { fontSize: '10px' },
                  rotate: -45,
                },
              },
            },
          },
        ],
      } as ApexCharts.ApexOptions,
    };
  }, [data, period]);

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
        Tren Pertumbuhan Kelompok
      </h3>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="line"
        height={350}
      />
    </div>
  );
};

/**
 * Format month period string (YYYY-MM) to readable format
 */
function formatMonthLabel(period: string): string {
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'Mei',
    'Jun',
    'Jul',
    'Agu',
    'Sep',
    'Okt',
    'Nov',
    'Des',
  ];

  const parts = period.split('-');
  if (parts.length === 2) {
    const year = parts[0];
    const month = parseInt(parts[1], 10);
    return `${monthNames[month - 1]} ${year}`;
  }
  return period;
}

export default GrowthTrendChart;
