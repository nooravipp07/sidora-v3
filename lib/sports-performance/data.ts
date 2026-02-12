import { PerformancePerson, OrganizationStats, FilterOptions } from './types';

export const performanceData: PerformancePerson[] = [
  // KONI Athletes
  { id: '1', organization: 'KONI', name: 'Budi Santoso', role: 'athlete', sport: 'Badminton', district: 'Kecamatan Utara', status: 'active', joinDate: '2023-01-15', achievement: 'Juara Regional 2025' },
  { id: '2', organization: 'KONI', name: 'Siti Nurhaliza', role: 'athlete', sport: 'Tenis Meja', district: 'Kecamatan Selatan', status: 'active', joinDate: '2022-06-20', achievement: 'Medali Emas Nasional' },
  { id: '3', organization: 'KONI', name: 'Ahmad Wijaya', role: 'athlete', sport: 'Basket', district: 'Kecamatan Timur', status: 'active', joinDate: '2023-03-10', achievement: 'Finalis PON' },
  { id: '4', organization: 'KONI', name: 'Dewi Lestari', role: 'athlete', sport: 'Voli', district: 'Kecamatan Barat', status: 'inactive', joinDate: '2021-11-05', achievement: 'Juara Daerah' },
  { id: '5', organization: 'KONI', name: 'Roni Hermawan', role: 'athlete', sport: 'Atletik', district: 'Kecamatan Pusat', status: 'active', joinDate: '2023-08-01', achievement: 'Peserta Nasional' },
  { id: '6', organization: 'KONI', name: 'Nina Susanti', role: 'athlete', sport: 'Badminton', district: 'Kecamatan Utara', status: 'active', joinDate: '2023-02-15', achievement: 'Juara Regional' },
  { id: '7', organization: 'KONI', name: 'Hendra Kusuma', role: 'athlete', sport: 'Sepak Bola', district: 'Kecamatan Selatan', status: 'active', joinDate: '2022-09-12', achievement: 'Medali Perak' },
  { id: '8', organization: 'KONI', name: 'Eka Putri', role: 'athlete', sport: 'Tenis', district: 'Kecamatan Timur', status: 'active', joinDate: '2023-05-20', achievement: 'Ranking Nasional' },

  // KONI Coaches
  { id: '9', organization: 'KONI', name: 'Bambang Irawan', role: 'coach', sport: 'Badminton', district: 'Kecamatan Utara', status: 'active', joinDate: '2020-01-10', achievement: 'Bersertifikat Internasional' },
  { id: '10', organization: 'KONI', name: 'Yuli Rahmawati', role: 'coach', sport: 'Tenis Meja', district: 'Kecamatan Selatan', status: 'active', joinDate: '2019-06-15', achievement: 'Pelatih Level 2' },
  { id: '11', organization: 'KONI', name: 'Gunawan Setiawan', role: 'coach', sport: 'Basket', district: 'Kecamatan Timur', status: 'active', joinDate: '2021-03-05', achievement: 'Bersertifikat Nasional' },
  { id: '12', organization: 'KONI', name: 'Marta Siahaan', role: 'coach', sport: 'Voli', district: 'Kecamatan Barat', status: 'active', joinDate: '2020-09-20', achievement: 'Pelatih Berpengalaman' },
  { id: '13', organization: 'KONI', name: 'Doni Irawan', role: 'coach', sport: 'Atletik', district: 'Kecamatan Pusat', status: 'inactive', joinDate: '2018-11-12', achievement: 'Ex Atlet Nasional' },

  // KONI Referees
  { id: '14', organization: 'KONI', name: 'Lina Marlina', role: 'referee', sport: 'Badminton', district: 'Kecamatan Utara', status: 'active', joinDate: '2022-05-10', achievement: 'Wasit Internasional' },
  { id: '15', organization: 'KONI', name: 'Randi Setiawan', role: 'referee', sport: 'Tenis Meja', district: 'Kecamatan Selatan', status: 'active', joinDate: '2021-08-15', achievement: 'Wasit Nasional' },
  { id: '16', organization: 'KONI', name: 'Sholeh Mustafa', role: 'referee', sport: 'Basket', district: 'Kecamatan Timur', status: 'active', joinDate: '2022-02-20', achievement: 'Bersertifikat Wasit' },
  { id: '17', organization: 'KONI', name: 'Nur Azizah', role: 'referee', sport: 'Voli', district: 'Kecamatan Barat', status: 'active', joinDate: '2023-01-05', achievement: 'Wasit Regional' },

  // NPCI Athletes
  { id: '18', organization: 'NPCI', name: 'Adi Prakoso', role: 'athlete', sport: 'Sepeda', district: 'Kecamatan Utara', status: 'active', joinDate: '2023-04-10', achievement: 'Juara National Level' },
  { id: '19', organization: 'NPCI', name: 'Novi Kharina', role: 'athlete', sport: 'Skateboard', district: 'Kecamatan Selatan', status: 'active', joinDate: '2023-07-22', achievement: 'Peserta Internasional' },
  { id: '20', organization: 'NPCI', name: 'Rio Hermanto', role: 'athlete', sport: 'Parkour', district: 'Kecamatan Timur', status: 'active', joinDate: '2022-10-15', achievement: 'Atlet Profesional' },
  { id: '21', organization: 'NPCI', name: 'Tina Wijaya', role: 'athlete', sport: 'BMX', district: 'Kecamatan Pusat', status: 'inactive', joinDate: '2021-12-01', achievement: 'Mantan Juara' },
  { id: '22', organization: 'NPCI', name: 'Kris Santoso', role: 'athlete', sport: 'Sepeda', district: 'Kecamatan Barat', status: 'active', joinDate: '2023-03-18', achievement: 'Ranking National' },
  { id: '23', organization: 'NPCI', name: 'Maya Kusuma', role: 'athlete', sport: 'Skateboard', district: 'Kecamatan Utara', status: 'active', joinDate: '2023-06-01', achievement: 'Peserta Nasional' },
  { id: '24', organization: 'NPCI', name: 'Fandi Suryanto', role: 'athlete', sport: 'Parkour', district: 'Kecamatan Selatan', status: 'active', joinDate: '2022-08-20', achievement: 'Atlet Berprestasi' },

  // NPCI Coaches
  { id: '25', organization: 'NPCI', name: 'Agus Hartono', role: 'coach', sport: 'Sepeda', district: 'Kecamatan Utara', status: 'active', joinDate: '2019-05-10', achievement: 'Pelatih Senior' },
  { id: '26', organization: 'NPCI', name: 'Dina Puspita', role: 'coach', sport: 'Skateboard', district: 'Kecamatan Selatan', status: 'active', joinDate: '2020-09-15', achievement: 'Bersertifikat Internasional' },
  { id: '27', organization: 'NPCI', name: 'Budi Hartanto', role: 'coach', sport: 'Parkour', district: 'Kecamatan Timur', status: 'active', joinDate: '2021-03-22', achievement: 'Pelatih Bersertifikat' },
  { id: '28', organization: 'NPCI', name: 'Sari Wulandari', role: 'coach', sport: 'BMX', district: 'Kecamatan Pusat', status: 'inactive', joinDate: '2018-11-10', achievement: 'Ex Pelatih' },

  // NPCI Referees
  { id: '29', organization: 'NPCI', name: 'Wahyu Siswanto', role: 'referee', sport: 'Sepeda', district: 'Kecamatan Utara', status: 'active', joinDate: '2022-06-15', achievement: 'Juri Nasional' },
  { id: '30', organization: 'NPCI', name: 'Rizka Amelia', role: 'referee', sport: 'Skateboard', district: 'Kecamatan Selatan', status: 'active', joinDate: '2023-01-20', achievement: 'Juri Bersertifikat' },
  { id: '31', organization: 'NPCI', name: 'Teguh Prasetyo', role: 'referee', sport: 'Parkour', district: 'Kecamatan Timur', status: 'active', joinDate: '2022-03-10', achievement: 'Juri Regional' },
  { id: '32', organization: 'NPCI', name: 'Lisa Mulyani', role: 'referee', sport: 'BMX', district: 'Kecamatan Pusat', status: 'active', joinDate: '2023-02-05', achievement: 'Juri Profesional' },
];

export function getOrganizationStats(organization?: 'KONI' | 'NPCI'): OrganizationStats {
  const filtered = organization 
    ? performanceData.filter(p => p.organization === organization)
    : performanceData;

  const org = organization || 'KONI';

  return {
    organization: org,
    totalAthletes: filtered.filter(p => p.role === 'athlete').length,
    totalCoaches: filtered.filter(p => p.role === 'coach').length,
    totalReferees: filtered.filter(p => p.role === 'referee').length,
    totalPersons: filtered.length,
    activeCount: filtered.filter(p => p.status === 'active').length
  };
}

export function filterPerformanceData(
  filters: FilterOptions,
  page: number = 1,
  itemsPerPage: number = 10
): { data: PerformancePerson[]; totalPages: number; totalItems: number } {
  let result = [...performanceData];

  if (filters.organization) {
    result = result.filter(p => p.organization === filters.organization);
  }
  if (filters.district) {
    result = result.filter(p => p.district === filters.district);
  }
  if (filters.sport) {
    result = result.filter(p => p.sport === filters.sport);
  }
  if (filters.role) {
    result = result.filter(p => p.role === filters.role);
  }
  if (filters.status) {
    result = result.filter(p => p.status === filters.status);
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
  return Array.from(new Set(performanceData.map(p => p.district))).sort();
}

export function getSports(): string[] {
  return Array.from(new Set(performanceData.map(p => p.sport))).sort();
}

export function getSportsByOrganization(organization: 'KONI' | 'NPCI'): string[] {
  return Array.from(
    new Set(performanceData.filter(p => p.organization === organization).map(p => p.sport))
  ).sort();
}

export function getDataByOrganization(organization: 'KONI' | 'NPCI'): PerformancePerson[] {
  return performanceData.filter(p => p.organization === organization);
}
