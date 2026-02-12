'use client';

import React, { useMemo, useState } from 'react';
import type {
  MedalType,
  MedalSummary,
} from '@/lib/institution/types';
import { athletes, medals, getAvailableYears, institutions } from '@/lib/institution/data';

interface MedalsSummaryChartProps {
  data?: typeof medals;
}

const INSTITUTIONS: string[] = [
  'KONI',
  'KORMI',
  'NPCI',
  'BAPOPSI',
];

const MEDAL_CONFIG: ReadonlyArray<{
  key: MedalType;
  label: string;
  colorClass: string;
}> = [
  { key: 'Emas', label: 'Emas', colorClass: 'bg-yellow-500' },
  { key: 'Perak', label: 'Perak', colorClass: 'bg-gray-400' },
  { key: 'Perunggu', label: 'Perunggu', colorClass: 'bg-amber-700' },
] as const;

export default function MedalsSummaryChart({
  data = medals,
}: MedalsSummaryChartProps) {
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  const [selectedInstitutions, setSelectedInstitutions] =
    useState<string[]>([...INSTITUTIONS]);

  const availableYears: number[] = getAvailableYears();

  /**
   * Aggregate medal summary
   */
  const chartData: MedalSummary = useMemo(() => {
    const initial: MedalSummary = {
      Emas: 0,
      Perak: 0,
      Perunggu: 0,
    };

    return data.reduce<MedalSummary>((acc, medal) => {
      if (selectedYear !== medal.year) return acc;
      
      // Get athlete's institution type
      const athlete = athletes.find(a => a.id === medal.athleteId);
      if (!athlete) return acc;
      
      const institution = institutions.find(i => i.id === athlete.institutionId);
      if (!institution || !selectedInstitutions.includes(institution.name)) return acc;

      acc[medal.type]++;
      return acc;
    }, initial);
  }, [data, selectedYear, selectedInstitutions]);

  const maxValue: number = Math.max(
    chartData.Emas,
    chartData.Perak,
    chartData.Perunggu,
    1
  );

  const totalMedals: number =
    chartData.Emas + chartData.Perak + chartData.Perunggu;

  const handleInstitutionToggle = (institution: string): void => {
    setSelectedInstitutions((prev) =>
      prev.includes(institution)
        ? prev.filter((i) => i !== institution)
        : [...prev, institution]
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900">
            Summary Perolehan Medali
          </h3>

          <select
            value={selectedYear}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
              setSelectedYear(Number(e.target.value))
            }
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
          >
            {availableYears.map((year: number) => (
              <option key={year} value={year}>
                Tahun {year}
              </option>
            ))}
          </select>
        </div>

        {/* Institution Filter */}
        <div className="flex flex-wrap gap-2">
          {INSTITUTIONS.map((institution: string) => (
            <button
              key={institution}
              type="button"
              onClick={() => handleInstitutionToggle(institution)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                selectedInstitutions.includes(institution)
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {institution}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="space-y-4">
        {MEDAL_CONFIG.map(({ key, label, colorClass }) => {
          const value: number = chartData[key];
          const widthPercentage: number = (value / maxValue) * 100;

          return (
            <div key={key} className="flex items-center gap-4">
              <div className="w-32 text-sm font-medium text-gray-700">
                {label}
              </div>

              <div className="flex-1 bg-gray-100 rounded-full h-8 overflow-hidden">
                <div
                  className={`${colorClass} h-full flex items-center justify-end pr-3 transition-all duration-500`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  {value > 0 && (
                    <span className="text-white text-xs font-bold">
                      {value}
                    </span>
                  )}
                </div>
              </div>

              <div className="w-12 text-right text-sm font-semibold text-gray-900">
                {value}
              </div>
            </div>
          );
        })}
      </div>

      {/* Total */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-900">
            Total Medali
          </span>
          <span className="text-2xl font-bold text-gray-900">
            {totalMedals}
          </span>
        </div>
      </div>
    </div>
  );
}
