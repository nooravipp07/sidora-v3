/**
 * Verification Status Chart Component
 * Donut chart showing verified vs unverified groups
 * Production-ready with TypeScript and performance optimization
 */

'use client';

import React, { useMemo, FC } from 'react';
import dynamic from 'next/dynamic';
import { calculateVerificationStats, SportsGroup } from './utils';

const ReactApexChart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface VerificationChartProps {
  data: SportsGroup[];
  isLoading?: boolean;
}

interface ChartState {
  series: number[];
  options: ApexCharts.ApexOptions;
}

/**
 * Chart component displaying verification status distribution
 * - Donut chart with percentage and count
 * - Color coded: green (verified) vs red (unverified)
 * - Includes interactive legend
 */
export const VerificationStatusChart: FC<VerificationChartProps> = ({
  data,
  isLoading = false,
}) => {
  const chartData: ChartState = useMemo(() => {
    const stats = calculateVerificationStats(data);

    if (data.length === 0) {
      return {
        series: [],
        options: {
          chart: { type: 'donut' as const },
          labels: [],
        } as ApexCharts.ApexOptions,
      };
    }

    return {
      series: [stats.verified, stats.unverified],
      options: {
        chart: {
          type: 'donut' as const,
          toolbar: {
            show: true,
            tools: {
              download: true,
              selection: false,
              zoom: false,
              zoomin: false,
              zoomout: false,
              pan: false,
              reset: true,
            },
          },
          animations: {
            enabled: true,
            easing: 'easeinout' as const,
            speed: 800,
          },
          fontFamily: 'inherit',
        },
        labels: ['Terverifikasi', 'Belum Terverifikasi'],
        colors: ['#10b981', '#ef4444'],
        plotOptions: {
          pie: {
            donut: {
              size: '75%',
              labels: {
                show: true,
                name: {
                  show: true,
                  fontSize: '14px',
                  fontWeight: 600,
                  color: '#1f2937',
                  offsetY: -10,
                },
                value: {
                  show: true,
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#111827',
                  offsetY: 8,
                  formatter: (val: string) => `${val}`,
                },
                total: {
                  show: true,
                  label: 'Total Kelompok',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#6b7280',
                  formatter: () => `${data.length}`,
                },
              },
            },
          },
        },
        dataLabels: {
          enabled: true,
          formatter: (val: string | number) => {
            const percentage = parseFloat(val.toString());
            return `${percentage.toFixed(1)}%`;
          },
          style: {
            fontSize: '12px',
            fontWeight: 600,
            colors: ['#fff'],
          },
          dropShadow: { enabled: true },
        },
        legend: {
          position: 'bottom' as const,
          horizontalAlign: 'center' as const,
          floating: false,
          fontSize: '13px',
          fontFamily: 'inherit',
          onItemClick: { toggleDataSeries: false },
          labels: {
            colors: '#374151',
            useSeriesColors: false,
          },
          markers: {
            width: 12,
            height: 12,
            radius: 3,
            offsetX: -8,
            offsetY: 0,
          },
        },
        tooltip: {
          enabled: true,
          theme: 'light',
          y: {
            formatter: (value: number) => {
              const percent = ((value / data.length) * 100).toFixed(1);
              return `${value} kelompok (${percent}%)`;
            },
            title: { formatter: (seriesName: string) => seriesName },
          },
          x: { show: true },
        },
        responsive: [
          {
            breakpoint: 768,
            options: {
              plotOptions: {
                pie: {
                  donut: {
                    labels: {
                      value: { fontSize: '16px' },
                      name: { fontSize: '12px' },
                    },
                  },
                },
              },
            },
          },
        ],
      } as ApexCharts.ApexOptions,
    };
  }, [data]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Memuat data...</div>
      </div>
    );
  }

  if (chartData.series.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 bg-gray-50 rounded-lg">
        <div className="text-gray-500">Tidak ada data untuk ditampilkan</div>
      </div>
    );
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Status Verifikasi Kelompok
      </h3>
      <ReactApexChart
        options={chartData.options}
        series={chartData.series}
        type="donut"
        height={380}
      />
    </div>
  );
};

export default VerificationStatusChart;
