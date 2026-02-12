'use client';

import React from 'react';
import { AgendaEvent } from '@/lib/agenda/types';
import { Calendar, MapPin, Clock, Badge } from 'lucide-react';

interface AgendaTableProps {
  events: AgendaEvent[];
}

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'Kompetisi':
      return 'bg-blue-100 text-blue-700';
    case 'Pelatihan':
      return 'bg-purple-100 text-purple-700';
    case 'Event Komunitas':
      return 'bg-orange-100 text-orange-700';
    case 'Acara':
      return 'bg-pink-100 text-pink-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getLevelColor = (level: string) => {
  switch (level) {
    case 'Internasional':
      return 'bg-red-100 text-red-700';
    case 'Nasional':
      return 'bg-blue-100 text-blue-700';
    case 'Regional':
      return 'bg-green-100 text-green-700';
    case 'Lokal':
      return 'bg-yellow-100 text-yellow-700';
    case 'Daerah':
      return 'bg-indigo-100 text-indigo-700';
    default:
      return 'bg-gray-100 text-gray-700';
  }
};

const getStatusColor = (status: string) => {
  return status === 'Active'
    ? 'bg-green-100 text-green-700'
    : 'bg-red-100 text-red-700';
};

export default function AgendaTable({ events }: AgendaTableProps) {
  if (events.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500 text-lg font-medium">Tidak ada agenda yang ditemukan</p>
        <p className="text-gray-400 text-sm mt-2">Coba ubah filter Anda untuk melihat hasil yang berbeda</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Tanggal & Waktu</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Nama Kegiatan</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Lokasi</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Kategori</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Level</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event, idx) => (
              <tr
                key={event.id}
                className={`border-b border-gray-200 hover:bg-green-50 transition-colors ${
                  idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold">
                      <Calendar className="w-4 h-4 text-green-600" />
                      {event.date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4 text-gray-500" />
                      {event.time}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm font-semibold text-gray-900 max-w-xs">{event.name}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="max-w-xs">{event.location}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getCategoryColor(event.category)}`}>
                    {event.category}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(event.level)}`}>
                    {event.level}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(event.status)}`}>
                    {event.status === 'Active' ? '✓ Aktif' : '✗ Tidak Aktif'}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden">
        <div className="divide-y divide-gray-200">
          {events.map((event) => (
            <div key={event.id} className="p-4 hover:bg-green-50 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 mb-2">{event.name}</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4 text-green-600 flex-shrink-0" />
                      <span>{event.date.toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-3 border-t border-gray-200">
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getCategoryColor(event.category)}`}>
                  {event.category}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getLevelColor(event.level)}`}>
                  {event.level}
                </span>
                <span className={`text-xs font-semibold px-2 py-1 rounded-full ${getStatusColor(event.status)}`}>
                  {event.status === 'Active' ? '✓ Aktif' : '✗ Tidak Aktif'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary */}
      <div className="bg-gray-50 border-t border-gray-200 px-6 py-4">
        <p className="text-sm text-gray-600">
          Menampilkan <span className="font-semibold text-gray-900">{events.length}</span> dari <span className="font-semibold text-gray-900">10</span> agenda kegiatan
        </p>
      </div>
    </div>
  );
}
