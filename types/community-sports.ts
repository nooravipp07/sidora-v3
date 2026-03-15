export type Role = 'athlete' | 'coach';
export type Status = 'active' | 'inactive';

export interface CommunitySportsPerson {
  id: string;
  name: string;
  role: Role;
  sport: string;
  district: string;
  status: Status;
  joinDate?: string;
  achievement?: string;
}

export interface CommunityStats {
  totalAthletes: number;
  totalCoaches: number;
  totalPersons: number;
  activeCount: number;
}

export interface FilterOptions {
  district?: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
