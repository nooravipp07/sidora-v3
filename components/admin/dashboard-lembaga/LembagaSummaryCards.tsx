'use client';

import React, { useEffect, useState } from 'react';
import { Users, Award, Shield } from 'lucide-react';
import { useAuth } from '@/lib/auth/useAuthh';

interface AthleteSummary {
  totalAtlet: number;
  totalPelatih: number;
  totalWasit: number;
  total: number;
}

export default function LembagaSummaryCards() {
  const { user } = useAuth();
  const [summary, setSummary] = useState<AthleteSummary>({
    totalAtlet: 0,
    totalPelatih: 0,
    totalWasit: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
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

        // Fetch data from API
        const response = await fetch(`/api/athlete/summary?${params.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch summary: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && data.data) {
          setSummary(data.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching athlete summary:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setSummary({
          totalAtlet: 0,
          totalPelatih: 0,
          totalWasit: 0,
          total: 0,
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSummary();
    } else {
      setLoading(false);
    }
  }, [user, user?.roleId]);

  const cards = [
    {
      icon: Users,
      label: 'Total Atlet',
      value: summary.totalAtlet,
      color: 'bg-green-50',
      iconColor: 'text-green-600',
      textColor: 'text-green-600',
    },
    {
      icon: Award,
      label: 'Total Pelatih',
      value: summary.totalPelatih,
      color: 'bg-amber-50',
      iconColor: 'text-amber-600',
      textColor: 'text-amber-600',
    },
    {
      icon: Shield,
      label: 'Total Wasit/Juri',
      value: summary.totalWasit,
      color: 'bg-purple-50',
      iconColor: 'text-purple-600',
      textColor: 'text-purple-600',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {cards.map((_, idx) => (
          <div
            key={idx}
            className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-100 animate-pulse"
          >
            <div className="h-4 bg-gray-200 rounded w-20 mb-4"></div>
            <div className="h-8 bg-gray-200 rounded w-16"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 rounded-lg p-6 shadow-sm border border-red-200 text-red-700">
        <p className="text-sm font-medium">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
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
