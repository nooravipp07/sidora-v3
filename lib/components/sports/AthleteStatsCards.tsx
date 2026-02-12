import { Users, UserCheck, Award, Medal } from 'lucide-react';
import { AthleteStats } from '@/lib/sports/types';

interface AthleteStatsCardsProps {
  stats: AthleteStats;
}

export default function AthleteStatsCards({ stats }: AthleteStatsCardsProps) {
  const cards = [
    {
      label: 'Total Atlet',
      value: stats.totalAthletes,
      icon: Users,
      color: 'bg-blue-50 text-blue-600',
      iconColor: 'text-blue-500'
    },
    {
      label: 'Atlet Aktif',
      value: stats.activeAthletes,
      icon: UserCheck,
      color: 'bg-green-50 text-green-600',
      iconColor: 'text-green-500'
    },
    {
      label: 'Atlet Berprestasi',
      value: stats.athletesWithAchievements,
      icon: Award,
      color: 'bg-purple-50 text-purple-600',
      iconColor: 'text-purple-500'
    },
    {
      label: 'Total Medali',
      value: stats.totalMedals,
      icon: Medal,
      color: 'bg-yellow-50 text-yellow-600',
      iconColor: 'text-yellow-500'
    },
    {
      label: 'Emas',
      value: stats.goldMedals,
      icon: Medal,
      color: 'bg-amber-50 text-amber-600',
      iconColor: 'text-amber-500'
    },
    {
      label: 'Perak',
      value: stats.silverMedals,
      icon: Medal,
      color: 'bg-slate-50 text-slate-600',
      iconColor: 'text-slate-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
