'use client';

import React, { FC } from 'react';
import { Building2 } from 'lucide-react';

const DataSarana: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Sarana</h1>
        <p className="text-gray-600 mt-1">Kelola data sarana olahraga</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Building2 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Halaman Data Sarana sedang dalam pengembangan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSarana;
