'use client';

import React, { useState, useMemo } from 'react';
import AgendaFilters from '../components/agenda/AgendaFilters';
import AgendaTable from '../components/agenda/AgendaTable';
import { filterAgendaEvents } from '@/lib/agenda/data';

export default function AgendaPage() {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const filteredEvents = useMemo(() => {
    return filterAgendaEvents(selectedDate, selectedLocation);
  }, [selectedDate, selectedLocation]);

  const handleReset = () => {
    setSelectedDate('');
    setSelectedLocation('');
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

        {/* Table */}
        <AgendaTable events={filteredEvents} />
      </div>
    </main>
  );
}
