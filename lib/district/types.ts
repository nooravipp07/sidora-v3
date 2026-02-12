export interface DistrictData {
  id: string;
  kecamatan: string;
  totalInfrastructure: number;
  totalSportsGroups: number;
  totalAchievements: number;
  totalAthletes: number;
  totalCoaches: number;
  latitude: number;
  longitude: number;
}

export interface DistrictSummary {
  totalDistricts: number;
  totalInfrastructure: number;
  totalSportsGroups: number;
  totalAthletes: number;
}

export interface FilterOptions {
  selectedDistrict: string;
  selectedYear: string;
}
