'use client';

import React from 'react';
import { DistrictInfrastructure } from '@/lib/infrastructure/types';
import { InfrastructureStats } from '@/lib/infrastructure/types';

interface InfrastructureChartsProps {
  districts: DistrictInfrastructure[];
  stats: InfrastructureStats;
}

export default function InfrastructureCharts({ districts, stats }: InfrastructureChartsProps) {
  // Calculate chart dimensions (responsive)
  const maxFacilities = Math.max(...districts.map(d => d.totalFacilities), 1);
  const chartHeight = 300;
  const chartWidth = typeof window !== 'undefined' && window.innerWidth < 768 ? 400 : 600;
  const barWidth = (chartWidth - 60) / districts.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 mb-12">
      {/* Bar Chart - Facilities per District */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Fasilitas per Kecamatan</h3>
        <div className="overflow-x-auto">
          <svg width={chartWidth} height={chartHeight} className="mx-auto">
            {/* Grid lines */}
            {[0, 25, 50, 75, 100].map((percent) => {
              const y = chartHeight - (chartHeight * percent / 100) - 50;
              const value = Math.round((maxFacilities * percent) / 100);
              return (
                <g key={`grid-${percent}`}>
                  <line x1="40" y1={y} x2={chartWidth} y2={y} stroke="#e5e7eb" strokeDasharray="5,5" />
                  <text x="35" y={y} textAnchor="end" dy="0.3em" className="text-xs fill-gray-500">
                    {value}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {districts.map((district, idx) => {
              const barHeight = (district.totalFacilities / maxFacilities) * (chartHeight - 60);
              const x = 40 + idx * barWidth + barWidth / 2;
              const y = chartHeight - barHeight - 30;

              return (
                <g key={`bar-${idx}`}>
                  <rect
                    x={x - barWidth / 2 + 10}
                    y={y}
                    width={barWidth - 20}
                    height={barHeight}
                    fill="#10b981"
                    rx="4"
                  />
                  <text
                    x={x}
                    y={y - 5}
                    textAnchor="middle"
                    className="text-xs font-bold fill-gray-900"
                  >
                    {district.totalFacilities}
                  </text>
                  <text
                    x={x}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className="text-xs fill-gray-600"
                    style={{ maxWidth: barWidth }}
                  >
                    {district.district.split(' ')[1]}
                  </text>
                </g>
              );
            })}

            {/* Y-axis */}
            <line x1="40" y1="30" x2="40" y2={chartHeight - 20} stroke="#374151" strokeWidth="2" />
            {/* X-axis */}
            <line x1="40" y1={chartHeight - 20} x2={chartWidth} y2={chartHeight - 20} stroke="#374151" strokeWidth="2" />
          </svg>
        </div>
      </div>

      {/* Condition Distribution - Donut Chart */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 border border-gray-200">
        <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 sm:mb-6">Distribusi Kondisi</h3>
        <div className="flex items-center justify-center">
          <div className="relative w-40 h-40 sm:w-48 sm:h-48">
            <svg viewBox="0 0 200 200" className="transform -rotate-90">
              {/* Background circle */}
              <circle cx="100" cy="100" r="80" fill="none" stroke="#e5e7eb" strokeWidth="30" />
              
              {/* Good circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#10b981"
                strokeWidth="30"
                strokeDasharray={`${(stats.goodCondition / stats.totalFacilities) * 502.65} 502.65`}
              />
              
              {/* Repair circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="#ef4444"
                strokeWidth="30"
                strokeDasharray={`${(stats.needsRepair / stats.totalFacilities) * 502.65} 502.65`}
                strokeDashoffset={-((stats.goodCondition / stats.totalFacilities) * 502.65)}
              />
            </svg>

            {/* Center text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="text-xl sm:text-2xl font-bold text-gray-900">{stats.overallHealth}%</p>
              <p className="text-xs text-gray-600">Kesehatan</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 sm:mt-8 space-y-2 sm:space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-green-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-gray-700">Baik: <span className="font-semibold">{stats.goodCondition}</span> ({Math.round((stats.goodCondition / stats.totalFacilities) * 100)}%)</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 sm:w-4 sm:h-4 bg-red-500 rounded-full flex-shrink-0"></div>
            <span className="text-xs sm:text-sm text-gray-700">Perlu Perbaikan: <span className="font-semibold">{stats.needsRepair}</span> ({Math.round((stats.needsRepair / stats.totalFacilities) * 100)}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
