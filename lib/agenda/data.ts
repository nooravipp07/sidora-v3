import { AgendaEvent } from './types';

export const agendaData: AgendaEvent[] = [
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

export function getAllLocations(): string[] {
  const locations = Array.from(new Set(agendaData.map(event => event.location)));
  return locations.sort();
}

export function getAllCategories(): string[] {
  const categories = Array.from(new Set(agendaData.map(event => event.category)));
  return categories.sort();
}

export function filterAgendaEvents(
  dateFilter?: string,
  locationFilter?: string
): AgendaEvent[] {
  return agendaData.filter(event => {
    let matches = true;

    if (dateFilter) {
      const filterDate = new Date(dateFilter);
      matches = matches && (
        event.date.getDate() === filterDate.getDate() &&
        event.date.getMonth() === filterDate.getMonth() &&
        event.date.getFullYear() === filterDate.getFullYear()
      );
    }

    if (locationFilter) {
      matches = matches && event.location === locationFilter;
    }

    return matches;
  });
}
