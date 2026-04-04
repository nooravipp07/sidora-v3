'use client';

import React, { useEffect, useState } from 'react';
import { Building2, Wrench, Users, Award } from 'lucide-react';
import { InfrastructureStats } from '@/types/infrastructure';

interface SummaryCard {
  icon: React.ComponentType<any>;
  label: string;
  value: number;
  color: string;
  lightColor: string;
}

interface SummaryCardsProps {
  year?: string;
  kecamatanId?: string;
  condition?: string;
}

export default function SummaryCards({ year, kecamatanId, condition }: SummaryCardsProps) {
  const [stats, setStats] = useState<InfrastructureStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const params = new URLSearchParams();
        if (year) params.append('year', year);
        if (kecamatanId) params.append('kecamatanId', kecamatanId);
        if (condition) params.append('condition', condition);

        const url = `/api/dashboard/infrastructure-summary?${params.toString()}`;
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch data');
        
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.error('Error fetching infrastructure summary:', err);
        setError('Gagal memuat data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [year, kecamatanId, condition]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-12">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-200 rounded-lg p-4 h-24 animate-pulse" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-12">
        <p className="text-red-700">{error || 'Gagal memuat data'}</p>
      </div>
    );
  }

  const cards: SummaryCard[] = [
    {
      icon: Wrench,
      label: 'Sarana (Equipment)',
      value: stats.totalEquipment,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100'
    },
    {
      icon: Building2,
      label: 'Prasarana (Facility Record)',
      value: stats.totalPrasarana,
      color: 'bg-green-500',
      lightColor: 'bg-green-100'
    },
    {
      icon: Users,
      label: 'Kelompok Olahraga',
      value: stats.totalSportsGroups,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100'
    },
    {
      icon: Award,
      label: 'Atlet',
      value: stats.totalAthletes,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-12">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`${card.lightColor} rounded-lg sm:rounded-xl p-3 sm:p-4 md:p-5 lg:p-6 shadow-md hover:shadow-lg transition-all duration-300 border border-opacity-20 border-gray-300`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs sm:text-sm md:text-sm font-medium text-gray-600 mb-1 sm:mb-2 line-clamp-2">{card.label}</p>
                <p className={`text-2xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-900 line-clamp-1`}>
                  {card.value}
                </p>
              </div>
              <div className={`${card.color} rounded-md sm:rounded-lg p-2 sm:p-3 text-white flex-shrink-0`}>
                <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
