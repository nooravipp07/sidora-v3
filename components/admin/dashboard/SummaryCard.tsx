'use client';

import React from 'react';

interface SummaryCardProps {
  icon: React.ReactNode;
  label: string;
  value: number;
  color: 'blue' | 'green' | 'orange' | 'purple';
}

const colorClasses = {
  blue: 'bg-blue-100',
  green: 'bg-green-100',
  orange: 'bg-orange-100',
  purple: 'bg-purple-100',
};

const iconColorClasses = {
  blue: 'text-blue-600',
  green: 'text-green-600',
  orange: 'text-orange-600',
  purple: 'text-purple-600',
};

export default function SummaryCard({ icon, label, value, color }: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${colorClasses[color]} p-3 rounded-lg`}>
          <div className={`w-6 h-6 ${iconColorClasses[color]}`}>
            {icon}
          </div>
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{label}</h3>
      <p className="text-3xl font-bold text-gray-900">{value.toLocaleString('id-ID')}</p>
    </div>
  );
}
