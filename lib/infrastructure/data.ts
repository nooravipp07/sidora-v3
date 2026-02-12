import { Facility, DistrictInfrastructure, InfrastructureStats } from './types';

export const facilitiesData: Facility[] = [
  // Kecamatan Utara
  {
    id: '1',
    name: 'Stadion Utama',
    district: 'Kecamatan Utara',
    type: 'lapangan',
    condition: 'good',
    lastMaintenance: '2026-01-20',
    address: 'Jl. Raya Utara No. 1, Kecamatan Utara'
  },
  {
    id: '2',
    name: 'GOR Tenis Meja',
    district: 'Kecamatan Utara',
    type: 'gedung',
    condition: 'good',
    lastMaintenance: '2026-01-10',
    address: 'Jl. Raya Utara No. 15, Kecamatan Utara'
  },
  {
    id: '3',
    name: 'Lapangan Badminton Utara',
    district: 'Kecamatan Utara',
    type: 'lapangan',
    condition: 'repair',
    lastMaintenance: '2025-12-15',
    address: 'Jl. Gatot Subroto, Kecamatan Utara'
  },
  {
    id: '4',
    name: 'Kolam Renang Olimpik',
    district: 'Kecamatan Utara',
    type: 'gedung',
    condition: 'good',
    lastMaintenance: '2026-01-05',
    address: 'Jl. Sudirman No. 42, Kecamatan Utara'
  },
  {
    id: '5',
    name: 'Lapangan Voli Utara',
    district: 'Kecamatan Utara',
    type: 'lapangan',
    condition: 'good',
    lastMaintenance: '2026-01-15',
    address: 'Jl. Merdeka, Kecamatan Utara'
  },
  // Kecamatan Selatan
  {
    id: '6',
    name: 'GOR Basket Selatan',
    district: 'Kecamatan Selatan',
    type: 'gedung',
    condition: 'good',
    lastMaintenance: '2026-01-12',
    address: 'Jl. Ahmad Yani No. 88, Kecamatan Selatan'
  },
  {
    id: '7',
    name: 'Lapangan Sepak Bola Selatan',
    district: 'Kecamatan Selatan',
    type: 'lapangan',
    condition: 'repair',
    lastMaintenance: '2025-11-30',
    address: 'Jl. Diponegoro, Kecamatan Selatan'
  },
  {
    id: '8',
    name: 'GOR Badminton Selatan',
    district: 'Kecamatan Selatan',
    type: 'gedung',
    condition: 'repair',
    lastMaintenance: '2025-10-20',
    address: 'Jl. Imam Bonjol No. 12, Kecamatan Selatan'
  },
  {
    id: '9',
    name: 'Lapangan Atletik Selatan',
    district: 'Kecamatan Selatan',
    type: 'lapangan',
    condition: 'good',
    lastMaintenance: '2026-01-08',
    address: 'Jl. Teuku Umar, Kecamatan Selatan'
  },
  // Kecamatan Timur
  {
    id: '10',
    name: 'Stadion Timur',
    district: 'Kecamatan Timur',
    type: 'lapangan',
    condition: 'good',
    lastMaintenance: '2026-01-18',
    address: 'Jl. Pendidikan No. 50, Kecamatan Timur'
  },
  {
    id: '11',
    name: 'GOR Tenis Timur',
    district: 'Kecamatan Timur',
    type: 'gedung',
    condition: 'good',
    lastMaintenance: '2026-01-02',
    address: 'Jl. Petitenget, Kecamatan Timur'
  },
  {
    id: '12',
    name: 'Lapangan Tenis Timur',
    district: 'Kecamatan Timur',
    type: 'lapangan',
    condition: 'repair',
    lastMaintenance: '2025-12-01',
    address: 'Jl. Sunset Road, Kecamatan Timur'
  },
  {
    id: '13',
    name: 'Kolam Renang Timur',
    district: 'Kecamatan Timur',
    type: 'gedung',
    condition: 'repair',
    lastMaintenance: '2025-11-10',
    address: 'Jl. Dewi Sri, Kecamatan Timur'
  },
  // Kecamatan Barat
  {
    id: '14',
    name: 'GOR Voli Barat',
    district: 'Kecamatan Barat',
    type: 'gedung',
    condition: 'good',
    lastMaintenance: '2026-01-16',
    address: 'Jl. Patimura No. 25, Kecamatan Barat'
  },
  {
    id: '15',
    name: 'Lapangan Basket Barat',
    district: 'Kecamatan Barat',
    type: 'lapangan',
    condition: 'good',
    lastMaintenance: '2026-01-09',
    address: 'Jl. Dipenogoro No. 5, Kecamatan Barat'
  },
  {
    id: '16',
    name: 'Stadion Olahraga Barat',
    district: 'Kecamatan Barat',
    type: 'lapangan',
    condition: 'good',
    lastMaintenance: '2026-01-14',
    address: 'Jl. Setia Budi, Kecamatan Barat'
  },
  // Kecamatan Pusat
  {
    id: '17',
    name: 'Gedung Olahraga Pusat',
    district: 'Kecamatan Pusat',
    type: 'gedung',
    condition: 'good',
    lastMaintenance: '2026-01-10',
    address: 'Jl. Kota Raja No. 1, Kecamatan Pusat'
  },
  {
    id: '18',
    name: 'Alun-alun Pusat',
    district: 'Kecamatan Pusat',
    type: 'lapangan',
    condition: 'good',
    lastMaintenance: '2026-01-20',
    address: 'Alun-alun, Kecamatan Pusat'
  },
];

export function getInfrastructureStats(): InfrastructureStats {
  const goodCondition = facilitiesData.filter(f => f.condition === 'good').length;
  const needsRepair = facilitiesData.filter(f => f.condition === 'repair').length;
  const lapangan = facilitiesData.filter(f => f.type === 'lapangan').length;
  const gedung = facilitiesData.filter(f => f.type === 'gedung').length;

  return {
    totalFacilities: facilitiesData.length,
    goodCondition,
    needsRepair,
    totalLapangan: lapangan,
    totalGedung: gedung,
    overallHealth: Math.round((goodCondition / facilitiesData.length) * 100)
  };
}

export function getDistrictInfrastructure(): DistrictInfrastructure[] {
  const districts = Array.from(new Set(facilitiesData.map(f => f.district)));
  
  return districts.map(district => {
    const districtFacilities = facilitiesData.filter(f => f.district === district);
    const good = districtFacilities.filter(f => f.condition === 'good').length;
    const repair = districtFacilities.filter(f => f.condition === 'repair').length;
    
    return {
      district,
      totalFacilities: districtFacilities.length,
      lapangan: districtFacilities.filter(f => f.type === 'lapangan').length,
      gedung: districtFacilities.filter(f => f.type === 'gedung').length,
      goodCondition: good,
      needsRepair: repair,
      conditionPercentage: Math.round((good / districtFacilities.length) * 100)
    };
  }).sort((a, b) => a.district.localeCompare(b.district));
}

export function getDistrictFacilities(district: string): Facility[] {
  return facilitiesData.filter(f => f.district === district);
}

export function filterFacilities(
  districtFilter?: string,
  conditionFilter?: string,
  typeFilter?: string
): Facility[] {
  return facilitiesData.filter(facility => {
    let matches = true;
    
    if (districtFilter) {
      matches = matches && facility.district === districtFilter;
    }
    
    if (conditionFilter) {
      matches = matches && facility.condition === conditionFilter;
    }
    
    if (typeFilter) {
      matches = matches && facility.type === typeFilter;
    }
    
    return matches;
  });
}

export function getAllDistricts(): string[] {
  return Array.from(new Set(facilitiesData.map(f => f.district))).sort();
}
