'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, MapPin as Location, X } from 'lucide-react';

interface AgendaEvent {
  id: number;
  date: Date;
  name: string;
  category: string;
  location: string;
  level: string;
  status: string;
  time: string;
}

interface AgendaSectionProps {
  eventCalendarData?: AgendaEvent[];
}

const defaultEventCalendarData: AgendaEvent[] = [
  {
    id: 1,
    date: new Date(2026, 0, 5),
    name: "Kejuaraan Tenis Meja Regional",
    category: "Kompetisi",
    location: "GOR Tenis Meja Utama",
    level: "Regional",
    status: "Active",
    time: "08:00 - 17:00"
  },
  {
    id: 2,
    date: new Date(2026, 0, 5),
    name: "Pelatihan Wasit Badminton",
    category: "Pelatihan",
    location: "Stadion Utama",
    level: "Daerah",
    status: "Active",
    time: "09:00 - 16:00"
  },
  {
    id: 3,
    date: new Date(2026, 0, 12),
    name: "Pelatihan Wasit Sepak Bola",
    category: "Pelatihan",
    location: "Stadion Utama",
    level: "Nasional",
    status: "Active",
    time: "09:00 - 16:00"
  },
  {
    id: 4,
    date: new Date(2026, 0, 15),
    name: "Lomba Lari Marathon",
    category: "Event Komunitas",
    location: "Alun-alun Kota",
    level: "Lokal",
    status: "Active",
    time: "06:00 - 12:00"
  },
  {
    id: 5,
    date: new Date(2026, 0, 20),
    name: "Turnamen Basket Antar Klub",
    category: "Kompetisi",
    location: "GOR Basket",
    level: "Regional",
    status: "Active",
    time: "15:00 - 21:00"
  },
  {
    id: 6,
    date: new Date(2026, 0, 25),
    name: "Kejuaraan Renang Daerah",
    category: "Kompetisi",
    location: "Kolam Renang Olimpik",
    level: "Daerah",
    status: "Inactive",
    time: "08:00 - 15:00"
  },
  {
    id: 7,
    date: new Date(2026, 1, 8),
    name: "Pembukaan Musim Olahraga 2026",
    category: "Acara",
    location: "Stadion Utama",
    level: "Nasional",
    status: "Active",
    time: "10:00 - 12:00"
  },
  {
    id: 8,
    date: new Date(2026, 1, 14),
    name: "Workshop Pelatih Muda",
    category: "Pelatihan",
    location: "Gedung Olahraga",
    level: "Regional",
    status: "Active",
    time: "09:00 - 17:00"
  },
  {
    id: 9,
    date: new Date(2026, 2, 8),
    name: "Piala Walikota Sepak Bola",
    category: "Kompetisi",
    location: "Stadion Kota",
    level: "Lokal",
    status: "Active",
    time: "14:00 - 21:00"
  },
  {
    id: 10,
    date: new Date(2026, 2, 15),
    name: "Kejuaraan Voli Putri",
    category: "Kompetisi",
    location: "GOR Voli",
    level: "Daerah",
    status: "Active",
    time: "08:00 - 18:00"
  }
];

const AgendaSection: React.FC<AgendaSectionProps> = ({ eventCalendarData = defaultEventCalendarData }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [selectedCalendarDate, setSelectedCalendarDate] = useState<Date | null>(null);
  const [selectedDateEvents, setSelectedDateEvents] = useState<AgendaEvent[]>([]);

  const getEventsForDate = (date: Date) => {
    return eventCalendarData.filter(event => {
      return (
        event.date.getDate() === date.getDate() &&
        event.date.getMonth() === date.getMonth() &&
        event.date.getFullYear() === date.getFullYear()
      );
    });
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentYear, currentMonth, day);
    const eventsOnDate = getEventsForDate(clickedDate);
    if (eventsOnDate.length > 0) {
      setSelectedCalendarDate(clickedDate);
      setSelectedDateEvents(eventsOnDate);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const daysInMonth = getDaysInMonth(currentMonth, currentYear);
  const firstDay = getFirstDayOfMonth(currentMonth, currentYear);
  const monthName = new Date(currentYear, currentMonth).toLocaleString('id-ID', { month: 'long', year: 'numeric' });

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push(i);
  }

  return (
    <section id="agenda" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Agenda Kegiatan
          </h2>
          <p className="text-xl text-gray-600">
            Lihat jadwal lengkap event dan kompetisi olahraga daerah
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-8">
                <button
                  onClick={() => {
                    setCurrentMonth(currentMonth === 0 ? 11 : currentMonth - 1);
                    if (currentMonth === 0) setCurrentYear(currentYear - 1);
                    setSelectedCalendarDate(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Previous month"
                >
                  <ChevronLeft className="w-6 h-6 text-gray-700" />
                </button>
                <h3 className="text-2xl font-bold text-gray-900">{monthName}</h3>
                <button
                  onClick={() => {
                    setCurrentMonth(currentMonth === 11 ? 0 : currentMonth + 1);
                    if (currentMonth === 11) setCurrentYear(currentYear + 1);
                    setSelectedCalendarDate(null);
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Next month"
                >
                  <ChevronRight className="w-6 h-6 text-gray-700" />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((day) => (
                  <div key={day} className="text-center font-semibold text-gray-700 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  const hasEvents = day && getEventsForDate(new Date(currentYear, currentMonth, day)).length > 0;
                  const isSelected = selectedCalendarDate && day === selectedCalendarDate.getDate();
                  
                  return (
                    <div key={index}>
                      {day ? (
                        <button
                          onClick={() => handleDateClick(day)}
                          className={`w-full aspect-square flex items-center justify-center rounded-lg font-semibold transition-all duration-200 text-sm sm:text-base ${
                            hasEvents
                              ? isSelected
                                ? 'bg-green-600 text-white shadow-lg scale-105'
                                : 'bg-green-100 text-green-700 hover:bg-green-200 border-2 border-green-400'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          <div className="flex flex-col items-center gap-1">
                            <span>{day}</span>
                            {hasEvents && (
                              <div className="flex gap-1">
                                {[...Array(Math.min(getEventsForDate(new Date(currentYear, currentMonth, day)).length, 3))].map((_, i) => (
                                  <div key={i} className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-white' : 'bg-green-600'}`} />
                                ))}
                              </div>
                            )}
                          </div>
                        </button>
                      ) : (
                        <div className="aspect-square" />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm font-semibold text-gray-700 mb-3">Keterangan:</p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded" />
                    <span className="text-sm text-gray-600">Ada Event</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-gray-50 rounded" />
                    <span className="text-sm text-gray-600">Tidak Ada Event</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Details Panel */}
          <div className="lg:col-span-1">
            {selectedCalendarDate && selectedDateEvents.length > 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 sticky top-24 max-h-[calc(100vh-150px)] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-gray-500 font-semibold uppercase">Event pada tanggal</p>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {selectedCalendarDate.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </h3>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedCalendarDate(null);
                      setSelectedDateEvents([]);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-gray-600" />
                  </button>
                </div>

                <div className="space-y-4">
                  {selectedDateEvents.map((event, idx) => (
                    <div key={event.id} className="border-l-4 border-green-500 bg-green-50 p-4 rounded-r-lg">
                      {selectedDateEvents.length > 1 && (
                        <div className="text-xs font-semibold text-green-700 mb-2 uppercase">Event {idx + 1}</div>
                      )}
                      
                      <h4 className="font-bold text-gray-900 mb-3">{event.name}</h4>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex items-start gap-2">
                          <Calendar className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-600">{event.time}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Location className="w-4 h-4 text-gray-500 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-gray-600">{event.location}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            event.category === 'Kompetisi' ? 'bg-blue-100 text-blue-700' :
                            event.category === 'Pelatihan' ? 'bg-purple-100 text-purple-700' :
                            event.category === 'Event Komunitas' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {event.category}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2 pt-2">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            event.level === 'Internasional' ? 'bg-red-100 text-red-700' :
                            event.level === 'Nasional' ? 'bg-blue-100 text-blue-700' :
                            event.level === 'Regional' ? 'bg-green-100 text-green-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {event.level}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            event.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                            {event.status === 'Active' ? '✓ Aktif' : '✗ Tidak Aktif'}
                          </span>
                        </div>
                      </div>

                      {idx < selectedDateEvents.length - 1 && (
                        <div className="mt-4 pt-4 border-t border-green-200" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center sticky top-24">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">
                  Pilih tanggal dengan event untuk melihat detail
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AgendaSection;
