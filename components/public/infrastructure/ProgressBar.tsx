'use client';

import React from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  showLabel?: boolean;
  color?: 'green' | 'blue' | 'red' | 'yellow';
  height?: 'sm' | 'md' | 'lg';
}

export default function ProgressBar({
  value,
  max = 100,
  showLabel = true,
  color = 'green',
  height = 'md'
}: ProgressBarProps) {
  const percentage = (value / max) * 100;
  
  const heightClasses = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3'
  };

  const colorClasses = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    red: 'bg-red-500',
    yellow: 'bg-yellow-500'
  };

  return (
    <div className="w-full">
      <div className={`w-full bg-gray-200 rounded-full overflow-hidden ${heightClasses[height]}`}>
        <div
          className={`${colorClasses[color]} transition-all duration-300 ease-out rounded-full h-full`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      {showLabel && (
        <p className="text-sm text-gray-700 font-semibold mt-1">{Math.round(percentage)}%</p>
      )}
    </div>
  );
}
