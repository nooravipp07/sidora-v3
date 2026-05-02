'use client';

import { Users, CheckCircle, XCircle } from 'lucide-react';
import { useState, useEffect } from 'react';

interface ClubSummaryCardsProps {
  kecamatanId?: number | null;
  year?: number;
}

export default function ClubSummaryCards({ 
  kecamatanId,
  year
}: ClubSummaryCardsProps) {
  const [stats, setStats] = useState({
    total: 0,
    verified: 0,
    unverified: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSportsGroupStats = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (typeof year === 'number') {
          params.set('year', year.toString());
        }
        if (kecamatanId) {
          params.set('kecamatanId', kecamatanId.toString());
        }

        const response = await fetch(`/api/sports-groups/stats?${params.toString()}`);
        const data = await response.json();

        if (data?.success && data?.data) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch sports groups stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSportsGroupStats();
  }, [kecamatanId, year]);

  const cards = [
    {
      label: 'Total Kelompok Olahraga',
      value: stats.total,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Kelompok Terverifikasi',
      value: stats.verified,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      iconColor: 'text-green-500'
    },
    {
      label: 'Kelompok Belum Terverifikasi',
      value: stats.unverified,
      icon: XCircle,
      color: 'bg-amber-50 text-amber-600',
      iconColor: 'text-amber-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`p-4 sm:p-6 rounded-lg border border-gray-200 ${card.color} transition-shadow hover:shadow-md ${
              loading ? 'opacity-60' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{card.label}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">
                  {loading ? '...' : card.value}
                </p>
              </div>
              <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${card.iconColor} opacity-20`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
