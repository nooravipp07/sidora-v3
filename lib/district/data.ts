import { DistrictData, DistrictSummary } from './types';

// Base district data without random values - from provided data table
const baseDistrictData = [
  { id: 'dist-001', kecamatan: 'ARIASARI', latitude: -6.9993943, longitude: 107.6220834 },
  { id: 'dist-002', kecamatan: 'BALEENDAH', latitude: -7.0993943, longitude: 107.6220834 },
  { id: 'dist-003', kecamatan: 'BANJARAN', latitude: -7.0488167, longitude: 107.5891851 },
  { id: 'dist-004', kecamatan: 'BOJONGSOANG', latitude: -6.9814168, longitude: 107.6368493 },
  { id: 'dist-005', kecamatan: 'CANGKUANG', latitude: -7.0407533, longitude: 107.5532367 },
  { id: 'dist-006', kecamatan: 'CICALEUNGKE', latitude: -6.9813150, longitude: 107.8370829 },
  { id: 'dist-007', kecamatan: 'CIKANCUNG', latitude: -7.0129132, longitude: 107.8260646 },
  { id: 'dist-008', kecamatan: 'CILENGKRANG', latitude: -6.9048024, longitude: 107.6933239 },
  { id: 'dist-009', kecamatan: 'CILEUNYUT', latitude: -6.9482607, longitude: 107.6487534 },
  { id: 'dist-010', kecamatan: 'CIMAUNG', latitude: -7.0954195, longitude: 107.5619857 },
  { id: 'dist-011', kecamatan: 'CIMENYAN', latitude: -6.8784822, longitude: 107.6646371 },
  { id: 'dist-012', kecamatan: 'CIPARAY', latitude: -7.0366129, longitude: 107.7133683 },
  { id: 'dist-013', kecamatan: 'CIWIDED', latitude: -7.2083374, longitude: 107.8243332 },
  { id: 'dist-014', kecamatan: 'DAYEUHKOLOT', latitude: -6.9850116, longitude: 107.6252467 },
  { id: 'dist-015', kecamatan: 'IBUN', latitude: -7.1019800, longitude: 107.7549993 },
  { id: 'dist-016', kecamatan: 'JAJANGJALANG', latitude: -6.8474423, longitude: 107.6266327 },
  { id: 'dist-017', kecamatan: 'KERTASARI', latitude: -7.1915839, longitude: 107.6789633 },
  { id: 'dist-018', kecamatan: 'KUTAWARINGIN', latitude: -6.9812000, longitude: 107.5325333 },
  { id: 'dist-019', kecamatan: 'MAJALAYA', latitude: -6.9347593, longitude: 107.7531955 },
  { id: 'dist-020', kecamatan: 'MAROGERI', latitude: -7.1347593, longitude: 107.5676531 },
  { id: 'dist-021', kecamatan: 'MARGAHAYU', latitude: -6.9714729, longitude: 107.5847142 },
  { id: 'dist-022', kecamatan: 'NAGREG', latitude: -7.0146099, longitude: 107.8779791 },
  { id: 'dist-023', kecamatan: 'PACET', latitude: -7.0424213, longitude: 107.8791118 },
  { id: 'dist-024', kecamatan: 'PAMENGPEUK', latitude: -7.0206259, longitude: 107.5956878 },
  { id: 'dist-025', kecamatan: 'PANGALENGAN', latitude: -7.1761845, longitude: 107.5712129 },
  { id: 'dist-026', kecamatan: 'PASEH', latitude: -7.0312005, longitude: 107.7904484 },
  { id: 'dist-027', kecamatan: 'PASIRJAMBU', latitude: -7.0476571, longitude: 107.5751336 },
  { id: 'dist-028', kecamatan: 'RANCABALI', latitude: -7.1538025, longitude: 107.3709135 },
  { id: 'dist-029', kecamatan: 'RANCAEKEK', latitude: -6.9589344, longitude: 107.7698892 },
  { id: 'dist-030', kecamatan: 'SOLOKANJERUK', latitude: -7.0200437, longitude: 107.7492570 },
  { id: 'dist-031', kecamatan: 'SOREANG', latitude: -7.0273288, longitude: 107.5168240 },
  { id: 'dist-032', kecamatan: 'SUMEDANG SELATAN', latitude: -7.1500000, longitude: 107.9200000 },
] as const;

// Seeded random generator for consistent values across server and client
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

// Generate random stats using seed-based approach
function generateRandomStats(seed: number) {
  const random = (min: number, max: number) => {
    const rand = seededRandom(seed);
    return Math.floor(rand * (max - min + 1)) + min;
  };
  return {
    totalInfrastructure: random(2, 8),
    totalSportsGroups: random(3, 12),
    totalAchievements: random(5, 20),
    totalAthletes: random(20, 60),
    totalCoaches: random(2, 8),
  };
}

// Generate district data once and cache it
function initializeDistrictData(): DistrictData[] {
  return baseDistrictData.map((base, index) => ({
    ...base,
    ...generateRandomStats(index * 123.456),
  }));
}

// Cache the data to ensure consistency
let cachedDistrictData: DistrictData[] | null = null;

export const districtData: DistrictData[] = (() => {
  if (!cachedDistrictData) {
    cachedDistrictData = initializeDistrictData();
  }
  return cachedDistrictData;
})();

export function getDistrictSummary(): DistrictSummary {
  return {
    totalDistricts: districtData.length,
    totalInfrastructure: districtData.reduce((sum, d) => sum + d.totalInfrastructure, 0),
    totalSportsGroups: districtData.reduce((sum, d) => sum + d.totalSportsGroups, 0),
    totalAthletes: districtData.reduce((sum, d) => sum + d.totalAthletes, 0),
  };
}

export function getDistrictByKecamatan(kecamatan: string): DistrictData[] {
  if (!kecamatan) return districtData;
  return districtData.filter((d) => d.kecamatan.toUpperCase().includes(kecamatan.toUpperCase()));
}

export function getAvailableKecamatan(): string[] {
  return Array.from(new Set(districtData.map((d) => d.kecamatan))).sort();
}

export function getAvailableYears(): number[] {
  return [2024, 2025, 2026];
}
