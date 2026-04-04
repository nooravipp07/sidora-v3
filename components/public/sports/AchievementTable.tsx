'use client';

import React, { useEffect, useState } from 'react';
import { Trophy, Medal } from 'lucide-react';

interface AchievementData {
  id: number;
  athleteId: number;
  athleteName: string;
  sportId: number;
  sportName: string;
  category: string;
  medal: string;
  achievementName: string;
  year: number;
  district: string;
}

interface AchievementTableProps {
  sport?: string;
  medal?: string;
  year?: string;
  district?: string;
  page: number;
  onPageChange: (page: number) => void;
  itemsPerPage: number;
}

export default function AchievementTable({
  sport,
  medal,
  year,
  district,
  page,
  onPageChange,
  itemsPerPage = 10
}: AchievementTableProps) {
  const [achievements, setAchievements] = useState<AchievementData[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (sport) params.append('sportId', sport);
        if (medal) params.append('medal', medal);
        if (year) params.append('year', year);
        if (district) params.append('kecamatanId', district);
        params.append('page', page.toString());
        params.append('limit', itemsPerPage.toString());

        const response = await fetch(`/api/sports/achievements?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch data');

        const result = await response.json();
        if (result.success) {
          setAchievements(result.data);
          setTotalPages(result.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error('Error fetching achievements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [sport, medal, year, district, page, itemsPerPage]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
        <div className="h-96 animate-pulse bg-gray-100 rounded-lg" />
      </div>
    );
  }

  if (achievements.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md border border-gray-200 p-12 text-center">
        <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">Tidak ada prestasi ditemukan</p>
        <p className="text-gray-400 text-sm mt-2">Coba ubah filter untuk melihat hasil berbeda</p>
      </div>
    );
  }

  const getMedalIcon = (medalValue: string) => {
    switch (medalValue) {
      case 'gold':
        return <Trophy className="w-4 h-4 text-yellow-500" />;
      case 'silver':
        return <Medal className="w-4 h-4 text-gray-400" />;
      case 'bronze':
        return <Medal className="w-4 h-4 text-orange-600" />;
      default:
        return null;
    }
  };

  const getMedalLabel = (medalValue: string) => {
    switch (medalValue) {
      case 'gold':
        return { label: 'Emas', bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' };
      case 'silver':
        return { label: 'Perak', bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' };
      case 'bronze':
        return { label: 'Perunggu', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' };
      default:
        return { label: '', bg: '', text: '', border: '' };
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Atlet</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Cabang Olahraga</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Prestasi</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Medali</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Wilayah</th>
              <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Tahun</th>
            </tr>
          </thead>
          <tbody>
            {achievements.map((achievement, idx) => {
              const medalStyle = getMedalLabel(achievement.medal);
              return (
                <tr
                  key={achievement.id}
                  className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${
                    idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  }`}
                >
                  <td className="px-6 py-4 font-semibold text-gray-900">{achievement.athleteName}</td>
                  <td className="px-6 py-4 text-gray-700">{achievement.sportName}</td>
                  <td className="px-6 py-4 text-gray-700 text-sm">{achievement.achievementName}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${medalStyle.bg} ${medalStyle.text} border ${medalStyle.border}`}>
                      {getMedalIcon(achievement.medal)}
                      {medalStyle.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center text-gray-700 text-sm">
                    {achievement.district}
                  </td>
                  <td className="px-6 py-4 text-center text-gray-900 font-semibold">
                    {achievement.year}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden divide-y divide-gray-200">
        {achievements.map((achievement) => {
          const medalStyle = getMedalLabel(achievement.medal);
          return (
            <div key={achievement.id} className="p-4 hover:bg-green-50 transition-colors">
              <div className="mb-3">
                <h3 className="font-bold text-lg text-gray-900">{achievement.athleteName}</h3>
                <p className="text-sm text-gray-600 mt-1">{achievement.sportName}</p>
              </div>
              <div className="space-y-2 text-sm mb-3">
                <p><span className="font-medium text-gray-700">Prestasi:</span> {achievement.achievementName}</p>
                <p><span className="font-medium text-gray-700">Wilayah:</span> {achievement.district}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${medalStyle.bg} ${medalStyle.text} border ${medalStyle.border}`}>
                  {getMedalIcon(achievement.medal)}
                  {medalStyle.label}
                </span>
                <span className="text-sm font-semibold text-gray-700">{achievement.year}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="bg-gray-50 border-t border-gray-200 px-6 py-4 flex items-center justify-between flex-wrap gap-4">
          <p className="text-sm text-gray-600">
            Halaman {page} dari {totalPages}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Sebelumnya
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter(p => Math.abs(p - page) <= 1 || p === 1 || p === totalPages)
                .map((p, idx, arr) => (
                  <React.Fragment key={p}>
                    {idx > 0 && arr[idx - 1] !== p - 1 && <span className="text-gray-400">...</span>}
                    <button
                      onClick={() => onPageChange(p)}
                      className={`w-8 h-8 rounded text-sm font-semibold transition-colors ${
                        page === p
                          ? 'bg-green-600 text-white'
                          : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {p}
                    </button>
                  </React.Fragment>
                ))}
            </div>
            <button
              onClick={() => onPageChange(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Selanjutnya
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
