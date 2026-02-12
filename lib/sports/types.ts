export type MedalType = 'gold' | 'silver' | 'bronze';

export interface Athlete {
  id: string;
  name: string;
  district: string;
  sport: string;
  clubId: string;
  clubName: string;
  isActive: boolean;
}

export interface Achievement {
  id: string;
  athleteId: string;
  athleteName: string;
  sport: string;
  clubName: string;
  medal: MedalType;
  event: string;
  year: number;
  district: string;
}

export interface Club {
  id: string;
  name: string;
  district: string;
  sportCategory: string;
  verified: boolean;
  totalAthletes: number;
  activeAthletes: number;
  totalMedals: number;
}

export interface AthleteStats {
  totalAthletes: number;
  activeAthletes: number;
  athletesWithAchievements: number;
  totalMedals: number;
  goldMedals: number;
  silverMedals: number;
  bronzeMedals: number;
}

export interface ClubStats {
  totalClubs: number;
  verifiedClubs: number;
  clubsWithActiveAthletes: number;
  clubsWithMedals: number;
}
