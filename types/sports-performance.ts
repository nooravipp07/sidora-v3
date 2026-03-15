export type Organization = 'KONI' | 'NPCI';
export type Role = 'athlete' | 'coach' | 'referee';
export type Status = 'active' | 'inactive';

export interface PerformancePerson {
  id: string;
  organization: Organization;
  name: string;
  role: Role;
  sport: string;
  district: string;
  status: Status;
  joinDate?: string;
  achievement?: string;
}

export interface OrganizationStats {
  organization: Organization;
  totalAthletes: number;
  totalCoaches: number;
  totalReferees: number;
  totalPersons: number;
  activeCount: number;
}

export interface FilterOptions {
  organization?: Organization;
  district?: string;
  sport?: string;
  role?: Role;
  status?: Status;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}
