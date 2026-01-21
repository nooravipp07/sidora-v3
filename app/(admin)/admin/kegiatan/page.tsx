'use client';

import React, { FC } from 'react';
import { Calendar } from 'lucide-react';

const Kegiatan: FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Olahraga Masyarakat</h1>
        <p className="text-gray-600 mt-1">Kelola kegiatan olahraga masyarakat</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Halaman Olahraga Masyarakat sedang dalam pengembangan</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kegiatan;
