'use client';

import React, { useMemo } from 'react';
import { Building2, Users, Award } from 'lucide-react';
import { getCategoryStats } from '@/lib/institution/data';
import { InstitutionType } from '@/lib/institution/types';

export default function LembagaCategoryStats() {
  const categoryStats = useMemo(() => {
    return getCategoryStats();
  }, []);

  const categories: InstitutionType[] = ['KONI', 'NPCI', 'KORMI', 'BAPOPSI'];
  const categoryColors: Record<InstitutionType, { bg: string; text: string; icon: string }> = {
    KONI: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-600' },
    NPCI: { bg: 'bg-green-50', text: 'text-green-600', icon: 'text-green-600' },
    KORMI: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-600' },
    BAPOPSI: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-600' },
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-900 mb-6">Jumlah Atlet Prestasi berdasarkan kategori</h3>

      <div className="space-y-4">
        {categories.map((category) => {
          const stats = categoryStats[category];
          const colors = categoryColors[category];

          return (
            <div
              key={category}
              className={`${colors.bg} rounded-lg p-5 border-l-4 ${
                category === 'KONI'
                  ? 'border-l-blue-600'
                  : category === 'NPCI'
                  ? 'border-l-green-600'
                  : 'border-l-red-600'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <h4 className={`text-lg font-bold ${colors.text}`}>{category}</h4>
              </div>

              <div className="grid grid-cols-3 gap-4">
                {/* Atlet */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Users className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Atlet</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>{stats.atlet}</p>
                  </div>
                </div>

                {/* Pelatih */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Award className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Pelatih</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>{stats.pelatih}</p>
                  </div>
                </div>

                {/* Wasit/Juri */}
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colors.bg}`}>
                    <Building2 className={`w-5 h-5 ${colors.icon}`} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-600 font-medium">Wasit/Juri</p>
                    <p className={`text-2xl font-bold ${colors.text}`}>{stats.wasitJuri}</p>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
