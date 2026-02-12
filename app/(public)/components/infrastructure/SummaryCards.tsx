'use client';

import React from 'react';
import { Building2, Activity, AlertCircle, BarChart3, Home, Gauge } from 'lucide-react';
import { InfrastructureStats } from '@/lib/infrastructure/types';

interface SummaryCardsProps {
  stats: InfrastructureStats;
}

export default function SummaryCards({ stats }: SummaryCardsProps) {
  const cards = [
    {
      icon: Building2,
      label: 'Total Fasilitas',
      value: stats.totalFacilities,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-100'
    },
    {
      icon: Activity,
      label: 'Kondisi Baik',
      value: stats.goodCondition,
      color: 'bg-green-500',
      lightColor: 'bg-green-100'
    },
    {
      icon: AlertCircle,
      label: 'Perlu Perbaikan',
      value: stats.needsRepair,
      color: 'bg-red-500',
      lightColor: 'bg-red-100'
    },
    {
      icon: BarChart3,
      label: 'Lapangan',
      value: stats.totalLapangan,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-100'
    },
    {
      icon: Home,
      label: 'Gedung',
      value: stats.totalGedung,
      color: 'bg-purple-500',
      lightColor: 'bg-purple-100'
    },
    {
      icon: Gauge,
      label: 'Kesehatan Infrastruktur',
      value: `${stats.overallHealth}%`,
      color: 'bg-teal-500',
      lightColor: 'bg-teal-100',
      isPercentage: true
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3 md:gap-4 lg:gap-6 mb-12">
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
