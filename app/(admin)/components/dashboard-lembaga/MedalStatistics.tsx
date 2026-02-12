'use client';

import React, { useState, useMemo } from 'react';
import { medals, getAvailableYears } from '@/lib/institution/data';
import { Medal } from '@/lib/institution/types';

export default function MedalStatistics() {
  const [selectedYear, setSelectedYear] = useState(2026);
  const availableYears = getAvailableYears();

  const filteredMedals = useMemo(() => {
    return medals.filter((m) => m.year === selectedYear);
  }, [selectedYear]);

  const medalCounts = useMemo(() => {
    return {
      gold: filteredMedals.filter((m) => m.type === 'Emas').length,
      silver: filteredMedals.filter((m) => m.type === 'Perak').length,
      bronze: filteredMedals.filter((m) => m.type === 'Perunggu').length,
    };
  }, [filteredMedals]);

  const total = medalCounts.gold + medalCounts.silver + medalCounts.bronze;
  const goldPercent = total > 0 ? (medalCounts.gold / total) * 100 : 0;
  const silverPercent = total > 0 ? (medalCounts.silver / total) * 100 : 0;
  const bronzePercent = total > 0 ? (medalCounts.bronze / total) * 100 : 0;

  // Simple pie chart using SVG
  const radius = 60;
  const circumference = 2 * Math.PI * radius;

  const goldOffset = 0;
  const silverOffset = (goldPercent / 100) * circumference;
  const bronzeOffset = silverOffset + (silverPercent / 100) * circumference;

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Perolehan Medal</h3>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(parseInt(e.target.value))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              Tahun {year}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
        {/* Pie Chart */}
        <div className="flex-shrink-0">
          <svg width="200" height="200" className="mx-auto">
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#fbbf24"
              strokeWidth="20"
              strokeDasharray={`${(goldPercent / 100) * circumference} ${circumference}`}
              strokeDashoffset="0"
              transform="rotate(-90 100 100)"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#c0c0c0"
              strokeWidth="20"
              strokeDasharray={`${(silverPercent / 100) * circumference} ${circumference}`}
              strokeDashoffset={-silverOffset}
              transform="rotate(-90 100 100)"
            />
            <circle
              cx="100"
              cy="100"
              r={radius}
              fill="none"
              stroke="#cd7f32"
              strokeWidth="20"
              strokeDasharray={`${(bronzePercent / 100) * circumference} ${circumference}`}
              strokeDashoffset={-bronzeOffset}
              transform="rotate(-90 100 100)"
            />
            <text
              x="100"
              y="100"
              textAnchor="middle"
              dominantBaseline="middle"
              className="text-3xl font-bold"
              fill="#111827"
            >
              {total}
            </text>
          </svg>
        </div>

        {/* Medal Stats */}
        <div className="flex-1 space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-yellow-400 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">Emas</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{medalCounts.gold}</p>
              <p className="text-xs text-gray-500">{goldPercent.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">Perak</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{medalCounts.silver}</p>
              <p className="text-xs text-gray-500">{silverPercent.toFixed(1)}%</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-amber-700 rounded"></div>
              <span className="text-sm font-semibold text-gray-700">Perunggu</span>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-gray-900">{medalCounts.bronze}</p>
              <p className="text-xs text-gray-500">{bronzePercent.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
