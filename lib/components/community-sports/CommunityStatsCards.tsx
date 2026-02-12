import { Users, UserCheck } from 'lucide-react';
import { CommunityStats } from '@/lib/community-sports/types';

interface CommunityStatsCardsProps {
  stats: CommunityStats;
}

export default function CommunityStatsCards({ stats }: CommunityStatsCardsProps) {
  const cards = [
    {
      label: 'Total Atlet',
      value: stats.totalAthletes,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      iconColor: 'text-blue-500',
      percentage: ((stats.totalAthletes / stats.totalPersons) * 100).toFixed(0)
    },
    {
      label: 'Total Pelatih',
      value: stats.totalCoaches,
      icon: UserCheck,
      color: 'bg-green-50 text-green-600',
      iconColor: 'text-green-500',
      percentage: ((stats.totalCoaches / stats.totalPersons) * 100).toFixed(0)
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {cards.map((card, idx) => {
        const Icon = card.icon;
        return (
          <div
            key={idx}
            className={`p-6 sm:p-8 rounded-xl border border-gray-200 ${card.color} transition-shadow hover:shadow-md bg-white`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <p className="text-sm text-gray-600 font-medium">{card.label}</p>
                <p className="text-3xl sm:text-4xl font-bold mt-3">{card.value}</p>
              </div>
              <Icon className={`w-10 h-10 sm:w-12 sm:h-12 ${card.iconColor} opacity-20`} />
            </div>
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs sm:text-sm text-gray-600">
                <span className="font-semibold text-gray-900">{card.percentage}%</span> dari total {stats.totalPersons} orang
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
