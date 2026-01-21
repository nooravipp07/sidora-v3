'use client';

import React, { FC } from 'react';
import { Hammer } from 'lucide-react';

const DataPrasarana: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Data Prasarana</h1>
        <p className="text-gray-600 mt-1">Kelola data prasarana olahraga</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Hammer className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Halaman Data Prasarana sedang dalam pengembangan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataPrasarana;
