import { Users, UserCheck, BadgeCheck } from 'lucide-react';
import { OrganizationStats } from '@/lib/sports-performance/types';

interface PerformanceStatsCardsProps {
  koniStats: OrganizationStats;
  npciStats: OrganizationStats;
}

export default function PerformanceStatsCards({ koniStats, npciStats }: PerformanceStatsCardsProps) {
  const StatCard = ({ stats }: { stats: OrganizationStats }) => {
    const metrics = [
      {
        label: 'Total Atlet',
        value: stats.totalAthletes,
        icon: Users,
        color: 'bg-blue-50 text-blue-600',
        iconColor: 'text-blue-500'
      },
      {
        label: 'Total Pelatih',
        value: stats.totalCoaches,
        icon: UserCheck,
        color: 'bg-green-50 text-green-600',
        iconColor: 'text-green-500'
      },
      {
        label: 'Total Wasit/Juri',
        value: stats.totalReferees,
        icon: BadgeCheck,
        color: 'bg-purple-50 text-purple-600',
        iconColor: 'text-purple-500'
      }
    ];

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900">{stats.organization}</h3>
          <span className="px-3 py-1 rounded-full text-xs sm:text-sm font-semibold bg-blue-50 text-blue-700 border border-blue-200">
            Total: {stats.totalPersons}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {metrics.map((metric, idx) => {
            const Icon = metric.icon;
            return (
              <div
                key={idx}
                className={`p-4 rounded-lg border border-gray-200 ${metric.color} transition-shadow hover:shadow-md`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs sm:text-sm text-gray-600 font-medium">{metric.label}</p>
                    <p className="text-xl sm:text-2xl font-bold mt-2">{metric.value}</p>
                  </div>
                  <Icon className={`w-8 h-8 ${metric.iconColor} opacity-20`} />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
      <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <StatCard stats={koniStats} />
      </div>
      <div className="p-6 sm:p-8 rounded-xl border border-gray-200 bg-white shadow-sm hover:shadow-md transition-shadow">
        <StatCard stats={npciStats} />
      </div>
    </div>
  );
}
