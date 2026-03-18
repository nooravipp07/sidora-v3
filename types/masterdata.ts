// Kecamatan Types
export interface Kecamatan {
  id: number;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface KecamatanCreateInput {
  nama: string;
}

export interface KecamatanUpdateInput {
  nama?: string;
}

// Desa Kelurahan Types
export interface DesaKelurahan {
  id: number;
  kecamatanId: number;
  nama: string;
  tipe: 'desa' | 'kelurahan';
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface DesaKelurahanCreateInput {
  kecamatanId: number;
  nama: string;
  tipe: 'desa' | 'kelurahan';
}

export interface DesaKelurahanUpdateInput {
  kecamatanId?: number;
  nama?: string;
  tipe?: 'desa' | 'kelurahan';
}

// Cabang Olahraga Types
export interface CabangOlahraga {
  id: number;
  nama: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface CabangOlahragaCreateInput {
  nama: string;
}

export interface CabangOlahragaUpdateInput {
  nama?: string;
}

// Sarana Types
export interface Sarana {
  id: number;
  nama: string;
  jenis?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface SaranaCreateInput {
  nama: string;
  jenis?: string;
}

export interface SaranaUpdateInput {
  nama?: string;
  jenis?: string;
}

// Prasarana Types
export interface Prasarana {
  id: number;
  nama: string;
  jenis?: string | null;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export interface PrasaranaCreateInput {
  nama: string;
  jenis?: string;
}

export interface PrasaranaUpdateInput {
  nama?: string;
  jenis?: string;
}

// Pagination Types
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasMore: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// Filter Types
export interface KecamatanFilter {
  nama?: string;
}

export interface DesaKelurahanFilter {
  kecamatanId?: number;
  nama?: string;
  tipe?: 'desa' | 'kelurahan';
}

export interface CabangOlahragaFilter {
  nama?: string;
}

export interface SaranaFilter {
  nama?: string;
  jenis?: string;
}

export interface PrasaranaFilter {
  nama?: string;
  jenis?: string;
}

// FacilityRecord Types
export interface FacilityRecord {
  id: number;
  desaKelurahanId: number;
  prasaranaId: number;
  year: number;
  condition?: string | null;
  ownershipStatus?: string | null; // OWNED, RENTED, SHARED
  address?: string | null;
  notes?: string | null;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: string | null;
  updatedBy?: string | null;
  // Relations
  prasarana?: Prasarana;
  desaKelurahan?: DesaKelurahan;
}

export interface FacilityRecordCreateInput {
  desaKelurahanId: number;
  prasaranaId: number;
  year: number;
  condition?: string;
  ownershipStatus?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
}

export interface FacilityRecordUpdateInput {
  desaKelurahanId?: number;
  prasaranaId?: number;
  year?: number;
  condition?: string;
  ownershipStatus?: string;
  address?: string;
  notes?: string;
  isActive?: boolean;
}

export interface FacilityRecordFilter {
  kecamatanId?: number;
  desaKelurahanId?: number;
  prasaranaId?: number;
  year?: number;
  isActive?: boolean;
}
