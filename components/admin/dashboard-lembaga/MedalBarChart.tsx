'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuthh';

interface MedalSummary {
  emasCount: number;
  perakCount: number;
  perungguCount: number;
  totalMedals: number;
}

export default function MedalBarChart() {
  const { user } = useAuth();
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [medalSummary, setMedalSummary] = useState<MedalSummary>({
    emasCount: 0,
    perakCount: 0,
    perungguCount: 0,
    totalMedals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate available years (current year and 3 previous years)
  const availableYears = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - i);

  // Fetch medal data from API
  useEffect(() => {
    const fetchMedalSummary = async () => {
      try {
        setLoading(true);

        // Determine organization filter based on roleId
        let organization: string | null = null;
        if (user?.roleId === 4) {
          organization = 'KONI';
        } else if (user?.roleId === 5) {
          organization = 'NPCI';
        }

        // Build query params
        const params = new URLSearchParams();
        if (organization) {
          params.append('organization', organization);
        }
        params.append('year', selectedYear.toString());

        // Fetch data from API
        const response = await fetch(`/api/medal/summary?${params.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch medal summary: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setMedalSummary(data.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching medal summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setMedalSummary({
          emasCount: 0,
          perakCount: 0,
          perungguCount: 0,
          totalMedals: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchMedalSummary();
    } else {
      setLoading(false);
    }
  }, [user, user?.roleId, selectedYear]);

  const medalColors = {
    'Emas': {
      bg: 'bg-yellow-500',
      text: 'text-yellow-700',
    },
    'Perak': {
      bg: 'bg-gray-400',
      text: 'text-gray-700',
    },
    'Perunggu': {
      bg: 'bg-orange-600',
      text: 'text-orange-700',
    },
  };

  const medalTypes = [
    { key: 'Emas', value: medalSummary.emasCount },
    { key: 'Perak', value: medalSummary.perakCount },
    { key: 'Perunggu', value: medalSummary.perungguCount },
  ];

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header dan Filter */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-bold text-gray-900">Perolehan Medali</h3>
          <p className="text-sm text-gray-600 mt-1">Total medali berdasarkan jenis</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
          {/* Filter Tahun */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Tahun</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  Tahun {year}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 rounded-lg p-4 h-24"></div>
          ))}
        </div>
      ) : (
        <>
          {/* Medal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            {medalTypes.map((medal) => {
              const colors = medalColors[medal.key as keyof typeof medalColors];

              return (
                <div
                  key={medal.key}
                  className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={`w-4 h-4 rounded ${colors.bg}`}></div>
                    <span className="font-medium text-gray-700">{medal.key}</span>
                  </div>
                  <div className={`text-3xl font-bold ${colors.text}`}>{medal.value}</div>
                </div>
              );
            })}
          </div>

          {/* Total Summary */}
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-gray-900">Total Medali</span>
              <span className="text-3xl font-bold text-gray-900">{medalSummary.totalMedals}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
