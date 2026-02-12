export type InstitutionType = 'KONI' | 'NPCI' | 'KORMI' | 'BAPOPSI';
export type SportCategory = 'Olahraga Tradisional' | 'Olahraga Modern' | 'Olahraga Adaptif' | 'Olahraga Pantai';
export type AthleteStatus = 'Aktif' | 'Pensiun' | 'Cuti' | 'Cadangan';
export type Gender = 'Laki-laki' | 'Perempuan';
export type MedalType = 'Emas' | 'Perak' | 'Perunggu';

export interface Institution {
  id: string;
  name: string;
  type: InstitutionType;
  address: string;
  latitude: number;
  longitude: number;
  totalAthletes: number;
  totalCoaches: number;
  totalReferees: number;
  phone: string;
  email: string;
}

export interface Athlete {
  id: string;
  name: string;
  birthPlace: string;
  dateOfBirth: string;
  gender: Gender;
  address: string;
  institution: string;
  institutionId: string;
  sport: string;
  category: SportCategory;
  position: string;
  status: AthleteStatus;
  year: number;
}

export interface Medal {
  id: string;
  athleteId: string;
  athleteName: string;
  type: MedalType;
  category: SportCategory;
  year: number;
  competition: string;
}

export interface InstitutionSummary {
  totalInstitutions: number;
  totalAthletes: number;
  totalCoaches: number;
  totalReferees: number;
}

export interface MedalSummary {
  Emas: number;
  Perak: number;
  Perunggu: number;
}
