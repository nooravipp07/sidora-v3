'use client';

import React from 'react';

interface ConditionBadgeProps {
  condition: 'good' | 'repair';
  size?: 'sm' | 'md' | 'lg';
}

export default function ConditionBadge({ condition, size = 'md' }: ConditionBadgeProps) {
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm',
    lg: 'px-4 py-2 text-base'
  };

  const baseStyles = `inline-flex items-center gap-1 rounded-full font-semibold ${sizeClasses[size]}`;

  if (condition === 'good') {
    return (
      <span className={`${baseStyles} bg-green-100 text-green-700`}>
        <span className="w-2 h-2 bg-green-600 rounded-full"></span>
        Baik
      </span>
    );
  }

  return (
    <span className={`${baseStyles} bg-red-100 text-red-700`}>
      <span className="w-2 h-2 bg-red-600 rounded-full"></span>
      Perlu Perbaikan
    </span>
  );
}
