import { Building2, CheckCircle, Users, Trophy } from 'lucide-react';
import { ClubStats } from '@/lib/sports/types';

interface ClubSummaryCardsProps {
  stats: ClubStats;
}

export default function ClubSummaryCards({ stats }: ClubSummaryCardsProps) {
  const cards = [
    {
      label: 'Total Klub',
      value: stats.totalClubs,
      icon: Building2,
      color: 'bg-blue-50 text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Klub Terverifikasi',
      value: stats.verifiedClubs,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
      iconColor: 'text-green-500'
    },
    {
      label: 'Klub Aktif',
      value: stats.clubsWithActiveAthletes,
      icon: Users,
      color: 'bg-purple-50 text-purple-600',
      iconColor: 'text-purple-500'
    },
    {
      label: 'Klub Berprestasi',
      value: stats.clubsWithMedals,
      icon: Trophy,
      color: 'bg-amber-50 text-amber-600',
      iconColor: 'text-amber-500'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className={`p-4 sm:p-6 rounded-lg border border-gray-200 ${card.color} transition-shadow hover:shadow-md`}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600 font-medium">{card.label}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-2">{card.value}</p>
              </div>
              <Icon className={`w-8 h-8 sm:w-10 sm:h-10 ${card.iconColor} opacity-20`} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
