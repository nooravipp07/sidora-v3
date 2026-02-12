import { Institution, Athlete, Medal, InstitutionSummary, InstitutionType, SportCategory } from './types';

// Seeded random generator for consistent values
function seededRandom(seed: number): number {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function randomInt(min: number, max: number, seed: number): number {
  const rand = seededRandom(seed);
  return Math.floor(rand * (max - min + 1)) + min;
}

// Kecamatan coordinates and medal data (matching district dashboard)
export const kecamatanMedalData = [
  { kecamatan: 'ARIASARI', latitude: -6.9993943, longitude: 107.6220834, emasCount: randomInt(2, 8, 1), perakCount: randomInt(1, 6, 2), perungguCount: randomInt(1, 5, 3) },
  { kecamatan: 'BALEENDAH', latitude: -7.0993943, longitude: 107.6220834, emasCount: randomInt(3, 10, 4), perakCount: randomInt(2, 7, 5), perungguCount: randomInt(2, 6, 6) },
  { kecamatan: 'BANJARAN', latitude: -7.0488167, longitude: 107.5891851, emasCount: randomInt(1, 7, 7), perakCount: randomInt(1, 5, 8), perungguCount: randomInt(1, 4, 9) },
  { kecamatan: 'BOJONGSOANG', latitude: -6.9814168, longitude: 107.6368493, emasCount: randomInt(2, 9, 10), perakCount: randomInt(2, 6, 11), perungguCount: randomInt(1, 5, 12) },
  { kecamatan: 'CANGKUANG', latitude: -7.0407533, longitude: 107.5532367, emasCount: randomInt(3, 11, 13), perakCount: randomInt(2, 8, 14), perungguCount: randomInt(2, 6, 15) },
  { kecamatan: 'CICALEUNGKE', latitude: -6.9813150, longitude: 107.8370829, emasCount: randomInt(1, 6, 16), perakCount: randomInt(1, 5, 17), perungguCount: randomInt(1, 4, 18) },
  { kecamatan: 'CIKANCUNG', latitude: -7.0129132, longitude: 107.8260646, emasCount: randomInt(2, 8, 19), perakCount: randomInt(2, 6, 20), perungguCount: randomInt(1, 5, 21) },
  { kecamatan: 'CILENGKRANG', latitude: -6.9048024, longitude: 107.6933239, emasCount: randomInt(3, 10, 22), perakCount: randomInt(2, 7, 23), perungguCount: randomInt(2, 6, 24) },
  { kecamatan: 'CILEUNYUT', latitude: -6.9482607, longitude: 107.6487534, emasCount: randomInt(1, 7, 25), perakCount: randomInt(1, 5, 26), perungguCount: randomInt(1, 4, 27) },
  { kecamatan: 'CIMAUNG', latitude: -7.0954195, longitude: 107.5619857, emasCount: randomInt(2, 9, 28), perakCount: randomInt(2, 6, 29), perungguCount: randomInt(1, 5, 30) },
  { kecamatan: 'CIMENYAN', latitude: -6.8784822, longitude: 107.6646371, emasCount: randomInt(3, 11, 31), perakCount: randomInt(2, 8, 32), perungguCount: randomInt(2, 6, 33) },
  { kecamatan: 'CIPARAY', latitude: -7.0366129, longitude: 107.7133683, emasCount: randomInt(2, 8, 34), perakCount: randomInt(1, 6, 35), perungguCount: randomInt(1, 5, 36) },
  { kecamatan: 'CIWIDED', latitude: -7.2083374, longitude: 107.8243332, emasCount: randomInt(1, 6, 37), perakCount: randomInt(1, 5, 38), perungguCount: randomInt(1, 4, 39) },
  { kecamatan: 'DAYEUHKOLOT', latitude: -6.9850116, longitude: 107.6252467, emasCount: randomInt(3, 10, 40), perakCount: randomInt(2, 7, 41), perungguCount: randomInt(2, 6, 42) },
  { kecamatan: 'IBUN', latitude: -7.1019800, longitude: 107.7549993, emasCount: randomInt(2, 9, 43), perakCount: randomInt(2, 6, 44), perungguCount: randomInt(1, 5, 45) },
  { kecamatan: 'JAJANGJALANG', latitude: -6.8474423, longitude: 107.6266327, emasCount: randomInt(1, 7, 46), perakCount: randomInt(1, 5, 47), perungguCount: randomInt(1, 4, 48) },
  { kecamatan: 'KERTASARI', latitude: -7.1915839, longitude: 107.6789633, emasCount: randomInt(3, 11, 49), perakCount: randomInt(2, 8, 50), perungguCount: randomInt(2, 6, 51) },
  { kecamatan: 'KUTAWARINGIN', latitude: -6.9812000, longitude: 107.5325333, emasCount: randomInt(2, 8, 52), perakCount: randomInt(1, 6, 53), perungguCount: randomInt(1, 5, 54) },
  { kecamatan: 'MAJALAYA', latitude: -6.9347593, longitude: 107.7531955, emasCount: randomInt(1, 7, 55), perakCount: randomInt(1, 5, 56), perungguCount: randomInt(1, 4, 57) },
  { kecamatan: 'MAROGERI', latitude: -7.1347593, longitude: 107.5676531, emasCount: randomInt(3, 10, 58), perakCount: randomInt(2, 7, 59), perungguCount: randomInt(2, 6, 60) },
  { kecamatan: 'MARGAHAYU', latitude: -6.9714729, longitude: 107.5847142, emasCount: randomInt(2, 9, 61), perakCount: randomInt(2, 6, 62), perungguCount: randomInt(1, 5, 63) },
  { kecamatan: 'NAGREG', latitude: -7.0146099, longitude: 107.8779791, emasCount: randomInt(1, 6, 64), perakCount: randomInt(1, 5, 65), perungguCount: randomInt(1, 4, 66) },
  { kecamatan: 'PACET', latitude: -7.0424213, longitude: 107.8791118, emasCount: randomInt(2, 8, 67), perakCount: randomInt(2, 6, 68), perungguCount: randomInt(1, 5, 69) },
  { kecamatan: 'PAMENGPEUK', latitude: -7.0206259, longitude: 107.5956878, emasCount: randomInt(3, 10, 70), perakCount: randomInt(2, 7, 71), perungguCount: randomInt(2, 6, 72) },
  { kecamatan: 'PANGALENGAN', latitude: -7.1761845, longitude: 107.5712129, emasCount: randomInt(2, 8, 73), perakCount: randomInt(1, 6, 74), perungguCount: randomInt(1, 5, 75) },
  { kecamatan: 'PASEH', latitude: -7.0312005, longitude: 107.7904484, emasCount: randomInt(1, 7, 76), perakCount: randomInt(1, 5, 77), perungguCount: randomInt(1, 4, 78) },
  { kecamatan: 'PASIRJAMBU', latitude: -7.0476571, longitude: 107.5751336, emasCount: randomInt(3, 11, 79), perakCount: randomInt(2, 8, 80), perungguCount: randomInt(2, 6, 81) },
  { kecamatan: 'RANCABALI', latitude: -7.1538025, longitude: 107.3709135, emasCount: randomInt(2, 9, 82), perakCount: randomInt(2, 6, 83), perungguCount: randomInt(1, 5, 84) },
  { kecamatan: 'RANCAEKEK', latitude: -6.9589344, longitude: 107.7698892, emasCount: randomInt(1, 7, 85), perakCount: randomInt(1, 5, 86), perungguCount: randomInt(1, 4, 87) },
  { kecamatan: 'SOLOKANJERUK', latitude: -7.0200437, longitude: 107.7492570, emasCount: randomInt(3, 10, 88), perakCount: randomInt(2, 7, 89), perungguCount: randomInt(2, 6, 90) },
  { kecamatan: 'SOREANG', latitude: -7.0273288, longitude: 107.5168240, emasCount: randomInt(2, 8, 91), perakCount: randomInt(1, 6, 92), perungguCount: randomInt(1, 5, 93) },
  { kecamatan: 'SUMEDANG SELATAN', latitude: -7.1500000, longitude: 107.9200000, emasCount: randomInt(3, 11, 94), perakCount: randomInt(2, 8, 95), perungguCount: randomInt(2, 6, 96) },
] as const;

export const institutions: Institution[] = [
  {
    id: 'inst-001',
    name: 'KONI',
    type: 'KONI',
    address: 'Jl. Sudirman No. 45, Bandung',
    latitude: -6.9047,
    longitude: 107.6141,
    totalAthletes: randomInt(50, 150, 1),
    totalCoaches: randomInt(10, 30, 2),
    totalReferees: randomInt(15, 40, 3),
    phone: '(022) 2207644',
    email: 'info@koni.org',
  },
  {
    id: 'inst-002',
    name: 'NPCI',
    type: 'NPCI',
    address: 'Jl. Asia Afrika No. 89, Bandung',
    latitude: -6.8839,
    longitude: 107.6144,
    totalAthletes: randomInt(40, 120, 4),
    totalCoaches: randomInt(8, 25, 5),
    totalReferees: randomInt(12, 35, 6),
    phone: '(022) 4234567',
    email: 'info@npci.org',
  },
  {
    id: 'inst-003',
    name: 'KORMI',
    type: 'KORMI',
    address: 'Jl. Diponegoro No. 234, Bandung',
    latitude: -6.8947,
    longitude: 107.5841,
    totalAthletes: randomInt(45, 140, 7),
    totalCoaches: randomInt(9, 28, 8),
    totalReferees: randomInt(14, 38, 9),
    phone: '(022) 6789012',
    email: 'info@kormi.org',
  },
  {
    id: 'inst-004',
    name: 'BAPOPSI',
    type: 'BAPOPSI',
    address: 'Jl. Raya Setiabudi No. 120, Bandung',
    latitude: -6.8847,
    longitude: 107.5941,
    totalAthletes: randomInt(35, 100, 10),
    totalCoaches: randomInt(7, 22, 11),
    totalReferees: randomInt(10, 30, 12),
    phone: '(022) 2515010',
    email: 'info@bapopsi.org',
  },
];

// Sports with detailed branches - mapping to SportCategory
const sportBranches = [
  'Badminton', 'Tenis Meja', 'Basket', 'Voli', 'Atletik', 
  'Sepak Bola', 'Tenis', 'Renang', 'Pencak Silat', 'Karate',
  'Taekwondo', 'Judo', 'Tinju', 'Bulutangkis', 'Catur',
  'Go', 'Bridge', 'Panahan', 'Panjat Tebing', 'Selancar'
];

const athleteNames = [
  'Ade Suryanto', 'Budi Hartono', 'Citra Dewi', 'Diana Kusuma', 'Eka Putri',
  'Fajar Hidayat', 'Gita Sastro', 'Heru Wibowo', 'Intan Marliana', 'Jaka Permana',
  'Kamil Rizki', 'Linda Sari', 'Muhammad Ali', 'Nina Sugesti', 'Oscar Wijaya',
  'Putri Handoko', 'Qurniawan Satya', 'Rini Setiawan', 'Sandi Kuncoro', 'Tito Huseno',
  'Udin Purwanto', 'Vina Marlini', 'Wawan Setiawan', 'Xia Ling', 'Yuli Hendriati',
  'Zainudin Rahman', 'Andini Sari', 'Bambang Sutrisno', 'Cecilia Martina', 'Dani Irawan',
  'Erica Wijaya', 'Fauzi Rahman', 'Gina Puspita', 'Hendra Gunawan', 'Ira Kusumawati',
  'Jolanta Winata', 'Kusuma Wardana', 'Lia Permata', 'Marta Sideran', 'Novita Sari',
];

const birthPlaces = ['Jakarta', 'Bandung', 'Surabaya', 'Medan', 'Semarang', 'Yogyakarta', 'Makassar', 'Palembang', 'Tangerang', 'Bekasi'];
const positions = ['Atlet', 'Kapten', 'Pemain Utama', 'Pemain Cadangan', 'Pelatih Asisten'];
const sportCategories: SportCategory[] = ['Olahraga Tradisional', 'Olahraga Modern', 'Olahraga Adaptif', 'Olahraga Pantai'];

// Mapping sport branches to categories for demo purposes
const sportToCategoryMap: Record<string, SportCategory> = {
  'Pencak Silat': 'Olahraga Tradisional',
  'Judo': 'Olahraga Tradisional',
  'Tinju': 'Olahraga Tradisional',
  'Catur': 'Olahraga Tradisional',
  'Go': 'Olahraga Tradisional',
  'Badminton': 'Olahraga Modern',
  'Tenis Meja': 'Olahraga Modern',
  'Basket': 'Olahraga Modern',
  'Voli': 'Olahraga Modern',
  'Atletik': 'Olahraga Modern',
  'Sepak Bola': 'Olahraga Modern',
  'Tenis': 'Olahraga Modern',
  'Renang': 'Olahraga Modern',
  'Karate': 'Olahraga Modern',
  'Taekwondo': 'Olahraga Modern',
  'Bridge': 'Olahraga Adaptif',
  'Panahan': 'Olahraga Adaptif',
  'Panjat Tebing': 'Olahraga Pantai',
  'Selancar': 'Olahraga Pantai',
};

export const athletes: Athlete[] = Array.from({ length: 50 }, (_, idx) => {
  const seed = idx + 100;
  const institutionIdx = idx % institutions.length;
  const institution = institutions[institutionIdx];
  const year = randomInt(2024, 2026, seed + 10);
  const sportBranch = sportBranches[idx % sportBranches.length];
  
  return {
    id: `athlete-${String(idx + 1).padStart(3, '0')}`,
    name: athleteNames[idx % athleteNames.length],
    birthPlace: birthPlaces[randomInt(0, birthPlaces.length - 1, seed + 1)],
    dateOfBirth: `${randomInt(1990, 2010, seed + 2)}-${String(randomInt(1, 12, seed + 3)).padStart(2, '0')}-${String(randomInt(1, 28, seed + 4)).padStart(2, '0')}`,
    gender: randomInt(0, 1, seed + 5) === 0 ? 'Laki-laki' : 'Perempuan',
    address: `Jl. ${['Sudirman', 'Ahmad Yani', 'Gajah Mada', 'Diponegoro', 'Siliwangi'][randomInt(0, 4, seed + 6)]} No. ${randomInt(1, 200, seed + 7)}`,
    institution: institution.name,
    institutionId: institution.id,
    sport: sportBranch,
    category: sportToCategoryMap[sportBranch] || sportCategories[randomInt(0, sportCategories.length - 1, seed + 8)],
    position: positions[randomInt(0, positions.length - 1, seed + 9)],
    status: ['Aktif', 'Pensiun', 'Cuti', 'Cadangan'][randomInt(0, 3, seed + 10)] as any,
    year: year,
  };
});

// Generate 100+ medals for multiple years
export const medals: Medal[] = Array.from({ length: 80 }, (_, idx) => {
  const seed = idx + 200;
  const medalTypes = ['Emas', 'Perak', 'Perunggu'] as const;
  const years = [2024, 2025, 2026];
  const athleteIdx = randomInt(0, athletes.length - 1, seed);
  const athlete = athletes[athleteIdx];
  
  return {
    id: `medal-${String(idx + 1).padStart(3, '0')}`,
    athleteId: athlete.id,
    athleteName: athlete.name,
    type: medalTypes[randomInt(0, 2, seed + 1)],
    category: sportCategories[randomInt(0, sportCategories.length - 1, seed + 2)],
    year: years[randomInt(0, years.length - 1, seed + 3)],
    competition: ['SEA Games', 'Asiad', 'Piala Nasional', 'Kejuaraan Regional'][randomInt(0, 3, seed + 4)],
  };
});

// Helper functions
export function getInstitutionSummary(types?: InstitutionType[]): InstitutionSummary {
  const filtered = types && types.length > 0
    ? institutions.filter((i) => types.includes(i.type))
    : institutions;

  const filteredAthletes = types && types.length > 0
    ? athletes.filter((a) => institutions.find((i) => i.id === a.institutionId && types.includes(i.type)))
    : athletes;

  return {
    totalInstitutions: filtered.length,
    totalAthletes: filteredAthletes.length,
    totalCoaches: filtered.reduce((sum, i) => sum + i.totalCoaches, 0),
    totalReferees: filtered.reduce((sum, i) => sum + i.totalReferees, 0),
  };
}

export function getCategoryStats(): Record<InstitutionType, { atlet: number; pelatih: number; wasitJuri: number }> {
  const categories: InstitutionType[] = ['KONI', 'NPCI', 'KORMI', 'BAPOPSI'];
  const result: Record<InstitutionType, { atlet: number; pelatih: number; wasitJuri: number }> = {
    KONI: { atlet: 0, pelatih: 0, wasitJuri: 0 },
    NPCI: { atlet: 0, pelatih: 0, wasitJuri: 0 },
    KORMI: { atlet: 0, pelatih: 0, wasitJuri: 0 },
    BAPOPSI: { atlet: 0, pelatih: 0, wasitJuri: 0 },
  };

  institutions.forEach((inst) => {
    if (result[inst.type]) {
      result[inst.type].atlet += inst.totalAthletes;
      result[inst.type].pelatih += inst.totalCoaches;
      result[inst.type].wasitJuri += inst.totalReferees;
    }
  });

  return result;
}

export function getAthletesByCategory(category?: SportCategory, year?: number): Athlete[] {
  return athletes.filter((a) => {
    if (category && a.category !== category) return false;
    if (year && a.year !== year) return false;
    return true;
  });
}

export function getMedalsByYear(year?: number): Medal[] {
  return medals.filter((m) => !year || m.year === year);
}

export function getInstitutionsByType(type?: InstitutionType): Institution[] {
  return institutions.filter((i) => !type || i.type === type);
}

export function getAvailableYears(): number[] {
  return [2024, 2025, 2026];
}

export function getAvailableSportCategories(): SportCategory[] {
  return ['Olahraga Tradisional', 'Olahraga Modern', 'Olahraga Adaptif', 'Olahraga Pantai'];
}
