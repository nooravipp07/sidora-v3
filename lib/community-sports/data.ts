import { CommunitySportsPerson, CommunityStats, FilterOptions } from './types';

export const communitySportsData: CommunitySportsPerson[] = [
  // Athletes - Kecamatan Utara
  { id: '1', name: 'Raden Sutrisno', role: 'athlete', sport: 'Badminton', district: 'Kecamatan Utara', status: 'active', joinDate: '2023-01-15' },
  { id: '2', name: 'Ani Wijaya', role: 'athlete', sport: 'Tenis Meja', district: 'Kecamatan Utara', status: 'active', joinDate: '2023-04-20' },
  { id: '3', name: 'Budi Kusuma', role: 'athlete', sport: 'Voli', district: 'Kecamatan Utara', status: 'active', joinDate: '2023-06-10' },
  { id: '4', name: 'Sena Prabowo', role: 'athlete', sport: 'Sepak Bola', district: 'Kecamatan Utara', status: 'inactive', joinDate: '2022-05-01' },

  // Coaches - Kecamatan Utara
  { id: '5', name: 'Cahyo Wardoyo', role: 'coach', sport: 'Badminton', district: 'Kecamatan Utara', status: 'active', joinDate: '2020-11-10' },
  { id: '6', name: 'Tri Wahyuni', role: 'coach', sport: 'Tenis Meja', district: 'Kecamatan Utara', status: 'active', joinDate: '2021-03-15' },

  // Athletes - Kecamatan Selatan
  { id: '7', name: 'Doni Hartono', role: 'athlete', sport: 'Basket', district: 'Kecamatan Selatan', status: 'active', joinDate: '2023-02-12' },
  { id: '8', name: 'Lisa Mariana', role: 'athlete', sport: 'Badminton', district: 'Kecamatan Selatan', status: 'active', joinDate: '2023-08-05' },
  { id: '9', name: 'Riyan Pratama', role: 'athlete', sport: 'Futsal', district: 'Kecamatan Selatan', status: 'active', joinDate: '2023-07-20' },
  { id: '10', name: 'Nila Handayani', role: 'athlete', sport: 'Voli', district: 'Kecamatan Selatan', status: 'active', joinDate: '2023-05-10' },
  { id: '11', name: 'Yanto Suryanto', role: 'athlete', sport: 'Renang', district: 'Kecamatan Selatan', status: 'inactive', joinDate: '2022-09-15' },

  // Coaches - Kecamatan Selatan
  { id: '12', name: 'Agus Sunarto', role: 'coach', sport: 'Basket', district: 'Kecamatan Selatan', status: 'active', joinDate: '2020-06-20' },
  { id: '13', name: 'Endang Kurniami', role: 'coach', sport: 'Voli', district: 'Kecamatan Selatan', status: 'active', joinDate: '2021-08-10' },

  // Athletes - Kecamatan Timur
  { id: '14', name: 'Wayan Subrata', role: 'athlete', sport: 'Atletik', district: 'Kecamatan Timur', status: 'active', joinDate: '2023-03-18' },
  { id: '15', name: 'Putri Rahmawati', role: 'athlete', sport: 'Badminton', district: 'Kecamatan Timur', status: 'active', joinDate: '2023-09-01' },
  { id: '16', name: 'Hasan Muhidin', role: 'athlete', sport: 'Karate', district: 'Kecamatan Timur', status: 'active', joinDate: '2023-04-25' },
  { id: '17', name: 'Mega Kusuma', role: 'athlete', sport: 'Tarian Modern', district: 'Kecamatan Timur', status: 'active', joinDate: '2023-10-12' },
  { id: '18', name: 'Rinto Susetyo', role: 'athlete', sport: 'Tenis', district: 'Kecamatan Timur', status: 'active', joinDate: '2023-11-05' },

  // Coaches - Kecamatan Timur
  { id: '19', name: 'Bambang Ismanto', role: 'coach', sport: 'Atletik', district: 'Kecamatan Timur', status: 'active', joinDate: '2019-12-01' },
  { id: '20', name: 'Sri Mardiyanti', role: 'coach', sport: 'Karate', district: 'Kecamatan Timur', status: 'active', joinDate: '2020-09-15' },

  // Athletes - Kecamatan Barat
  { id: '21', name: 'Subandi Santoso', role: 'athlete', sport: 'Judo', district: 'Kecamatan Barat', status: 'active', joinDate: '2023-02-28' },
  { id: '22', name: 'Rina Marlina', role: 'athlete', sport: 'Badminton', district: 'Kecamatan Barat', status: 'active', joinDate: '2023-07-08' },
  { id: '23', name: 'Taufik Rahman', role: 'athlete', sport: 'Angkat Besi', district: 'Kecamatan Barat', status: 'active', joinDate: '2023-05-12' },
  { id: '24', name: 'Dela Kusuma', role: 'athlete', sport: 'Senam', district: 'Kecamatan Barat', status: 'inactive', joinDate: '2022-10-20' },

  // Coaches - Kecamatan Barat
  { id: '25', name: 'Sumitro Hartono', role: 'coach', sport: 'Judo', district: 'Kecamatan Barat', status: 'active', joinDate: '2018-05-10' },
  { id: '26', name: 'Yuni Sartika', role: 'coach', sport: 'Senam', district: 'Kecamatan Barat', status: 'active', joinDate: '2020-03-20' },

  // Athletes - Kecamatan Pusat
  { id: '27', name: 'Evan Kusuma', role: 'athlete', sport: 'Catur', district: 'Kecamatan Pusat', status: 'active', joinDate: '2023-01-30' },
  { id: '28', name: 'Intan Rahmadani', role: 'athlete', sport: 'Badminton', district: 'Kecamatan Pusat', status: 'active', joinDate: '2023-08-22' },
  { id: '29', name: 'Mokh Rizal', role: 'athlete', sport: 'Pencak Silat', district: 'Kecamatan Pusat', status: 'active', joinDate: '2023-03-05' },
  { id: '30', name: 'Sinta Wijaya', role: 'athlete', sport: 'Bulu Tangkis', district: 'Kecamatan Pusat', status: 'active', joinDate: '2023-09-10' },
  { id: '31', name: 'Dadang Sutrisno', role: 'athlete', sport: 'Panahan', district: 'Kecamatan Pusat', status: 'active', joinDate: '2023-06-15' },
  { id: '32', name: 'Wini Lestari', role: 'athlete', sport: 'Senam Aerobik', district: 'Kecamatan Pusat', status: 'inactive', joinDate: '2022-11-01' },

  // Coaches - Kecamatan Pusat
  { id: '33', name: 'Ketut Suwandi', role: 'coach', sport: 'Catur', district: 'Kecamatan Pusat', status: 'active', joinDate: '2019-04-18' },
  { id: '34', name: 'Dewi Saputri', role: 'coach', sport: 'Pencak Silat', district: 'Kecamatan Pusat', status: 'active', joinDate: '2020-07-25' },
];

export function getCommunityStats(): CommunityStats {
  return {
    totalAthletes: communitySportsData.filter(p => p.role === 'athlete').length,
    totalCoaches: communitySportsData.filter(p => p.role === 'coach').length,
    totalPersons: communitySportsData.length,
    activeCount: communitySportsData.filter(p => p.status === 'active').length
  };
}

export function filterCommunitySportsData(
  filters: FilterOptions,
  page: number = 1,
  itemsPerPage: number = 10
): { data: CommunitySportsPerson[]; totalPages: number; totalItems: number } {
  let result = [...communitySportsData];

  if (filters.district) {
    result = result.filter(p => p.district === filters.district);
  }

  const totalItems = result.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const paginatedData = result.slice(startIndex, startIndex + itemsPerPage);

  return {
    data: paginatedData,
    totalPages,
    totalItems
  };
}

export function getDistricts(): string[] {
  return Array.from(new Set(communitySportsData.map(p => p.district))).sort();
}
