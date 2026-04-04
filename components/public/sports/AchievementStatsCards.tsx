'use client';

import React, { useEffect, useState } from 'react';
import { Medal, Trophy, Star, Users } from 'lucide-react';

interface AthleteStats {
  totalAthletes: number;
  totalAchievements: number;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
}

interface AchievementStatsCardsProps {
  sport?: string;
  medal?: string;
  year?: string;
  district?: string;
}

export default function AchievementStatsCards({
  sport,
  medal,
  year,
  district
}: AchievementStatsCardsProps) {
  const [stats, setStats] = useState<AthleteStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const params = new URLSearchParams();
        if (sport) params.append('category', sport);
        if (medal) params.append('medal', medal);
        if (year) params.append('year', year);
        if (district) params.append('kecamatanId', district);

        const response = await fetch(`/api/sports/athlete-stats?${params.toString()}`);
        if (!response.ok) throw new Error('Failed to fetch stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [sport, medal, year, district]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-4 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  const cards = [
    {
      label: 'Total Atlet Berprestasi',
      value: stats.totalAthletes,
      icon: Users,
      color: 'bg-blue-100',
      textColor: 'text-blue-700'
    },
    {
      label: 'Total Prestasi',
      value: stats.totalAchievements,
      icon: Trophy,
      color: 'bg-purple-100',
      textColor: 'text-purple-700'
    },
    {
      label: 'Medali Emas',
      value: stats.goldMedals,
      icon: Trophy,
      color: 'bg-yellow-100',
      textColor: 'text-yellow-700'
    },
    {
      label: 'Medali Perak',
      value: stats.silverMedals,
      icon: Medal,
      color: 'bg-gray-100',
      textColor: 'text-gray-700'
    },
    {
      label: 'Medali Perunggu',
      value: stats.bronzeMedals,
      icon: Star,
      color: 'bg-orange-100',
      textColor: 'text-orange-700'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
      {cards.map((card, idx) => {
        const IconComponent = card.icon;
        return (
          <div
            key={idx}
            className={`${card.color} rounded-lg p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium mb-1">{card.label}</p>
                <p className={`text-2xl sm:text-3xl font-bold ${card.textColor}`}>{card.value}</p>
              </div>
              <IconComponent className={`w-8 h-8 sm:w-10 sm:h-10 ${card.textColor} opacity-20`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
