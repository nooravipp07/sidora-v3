'use client';

import React, { FC } from 'react';
import { UserCheck } from 'lucide-react';

const DataAtlet: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Atlet</h1>
        <p className="text-gray-600 mt-1">Kelola data atlet</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <UserCheck className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Halaman Data Atlet sedang dalam pengembangan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataAtlet;
