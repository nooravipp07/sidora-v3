'use client';

import React, { useState, useEffect } from 'react';
import { useTrackPageView } from '@/lib/analytics/useTrackPageView';
import { AgendaFilters, AgendaTable } from '@/components/public/agenda';
import { AgendaEvent } from '@/lib/agenda/types';

const ITEMS_PER_PAGE = 10;

interface AgendaResponse {
  data: any[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export default function AgendaPage() {
  useTrackPageView('/agenda');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [agendas, setAgendas] = useState<AgendaEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch agendas from API
  useEffect(() => {
    const fetchAgendas = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Build query parameters
        const params = new URLSearchParams();
        params.append('page', '1');
        params.append('limit', '1000'); // Fetch all for client-side filtering
        if (selectedDate) params.append('startDate', selectedDate);
        if (selectedLocation) params.append('location', selectedLocation);

        const response = await fetch(`/api/agenda?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch agendas');
        }

        const data: AgendaResponse = await response.json();

        // Transform API data to AgendaEvent format
        const transformedAgendas = data.data.map((agenda: any) => {
          const startDate = new Date(agenda.startDate);
          const time = formatTime(startDate);

          return {
            id: agenda.id,
            date: startDate,
            name: agenda.title,
            category: agenda.category || 'General',
            location: agenda.location || 'TBD',
            level: agenda.level || 'Lokal',
            status: agenda.status || 'Active',
            time: time,
          } as AgendaEvent;
        });

        setAgendas(transformedAgendas);
        setCurrentPage(1);
      } catch (err) {
        console.error('Error fetching agendas:', err);
        setError('Gagal memuat agenda. Silahkan coba lagi nanti.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchAgendas();
  }, [selectedDate, selectedLocation]);

  const handleReset = () => {
    setSelectedDate('');
    setSelectedLocation('');
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    const totalPages = Math.ceil(agendas.length / ITEMS_PER_PAGE);
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Helper function to format time
  const formatTime = (date: Date): string => {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  };

  return (
    <main className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Page Header */}
        <div className="mb-12">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2">
            Agenda Kegiatan
          </h1>
          <p className="text-lg text-gray-600">
            Daftar lengkap jadwal kegiatan olahraga dan event daerah
          </p>
        </div>

        {/* Filters */}
        <AgendaFilters
          onDateChange={setSelectedDate}
          onLocationChange={setSelectedLocation}
          onReset={handleReset}
          selectedDate={selectedDate}
          selectedLocation={selectedLocation}
        />

        {/* Loading State */}
        {isLoading ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center border border-gray-200">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <p className="text-gray-600 mt-4">Memuat agenda...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 rounded-xl shadow-md p-8 text-center border border-red-200">
            <p className="text-red-600 text-lg">{error}</p>
          </div>
        ) : (
          // Table
          <AgendaTable 
            events={agendas}
            currentPage={currentPage}
            onPageChange={handlePageChange}
            itemsPerPage={ITEMS_PER_PAGE}
          />
        )}
      </div>
    </main>
  );
}
