'use client';

import React from 'react';
import { Building2, Users, Award, Shield } from 'lucide-react';
import { InstitutionSummary } from '@/lib/institution/types';

interface LembagaSummaryCardsProps {
  summary: InstitutionSummary;
}

export default function LembagaSummaryCards({ summary }: LembagaSummaryCardsProps) {
  const cards = [
    {
      icon: Building2,
      label: 'Total Lembaga',
      value: summary.totalInstitutions,
      color: 'bg-blue-50',
      iconColor: 'text-blue-600',
      textColor: 'text-blue-600',
    },
    {
      icon: Users,
      label: 'Total Atlet',
      value: summary.totalAthletes,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
    },
    {
      icon: Award,
      label: 'Total Pelatih',
      value: summary.totalCoaches,
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-600',
    },
    {
      icon: Shield,
      label: 'Total Wasit/Juri',
      value: summary.totalReferees,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`${card.color} rounded-lg p-6 shadow-sm border border-gray-100`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                <p className={`${card.textColor} text-3xl font-bold mt-2`}>
                  {card.value.toLocaleString('id-ID')}
                </p>
              </div>
              <Icon className={`${card.iconColor} w-8 h-8`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
