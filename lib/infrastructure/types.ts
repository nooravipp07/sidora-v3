export type FacilityCondition = 'good' | 'repair';
export type FacilityType = 'lapangan' | 'gedung';

export interface Facility {
  id: string;
  name: string;
  district: string;
  type: FacilityType;
  condition: FacilityCondition;
  lastMaintenance: string;
  address: string;
  photo?: string;
}

export interface DistrictInfrastructure {
  district: string;
  totalFacilities: number;
  lapangan: number;
  gedung: number;
  goodCondition: number;
  needsRepair: number;
  conditionPercentage: number;
}

export interface InfrastructureStats {
  totalFacilities: number;
  goodCondition: number;
  needsRepair: number;
  totalLapangan: number;
  totalGedung: number;
  overallHealth: number;
}
