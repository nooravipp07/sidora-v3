import {
  KecamatanRepository,
  DesaKelurahanRepository,
  CabangOlahragaRepository,
  SaranaRepository,
  PrasaranaRepository,
} from '@/repositories/masterdata';
import {
  KecamatanCreateInput,
  KecamatanUpdateInput,
  KecamatanFilter,
  DesaKelurahanCreateInput,
  DesaKelurahanUpdateInput,
  DesaKelurahanFilter,
  CabangOlahragaCreateInput,
  CabangOlahragaUpdateInput,
  CabangOlahragaFilter,
  SaranaCreateInput,
  SaranaUpdateInput,
  SaranaFilter,
  PrasaranaCreateInput,
  PrasaranaUpdateInput,
  PrasaranaFilter,
  PaginationParams,
} from '@/types/masterdata';

const kecamatanRepo = new KecamatanRepository();
const desaKelurahanRepo = new DesaKelurahanRepository();
const cabangOlahragaRepo = new CabangOlahragaRepository();
const saranaRepo = new SaranaRepository();
const prasaranaRepo = new PrasaranaRepository();

export class KecamatanService {
  async create(data: KecamatanCreateInput) {
    return await kecamatanRepo.create(data);
  }

  async getById(id: number) {
    return await kecamatanRepo.findById(id);
  }

  async getAll(filter: KecamatanFilter = {}, pagination: PaginationParams = { page: 1, limit: 10 }) {
    return await kecamatanRepo.findAll(filter, pagination);
  }

  async update(id: number, data: KecamatanUpdateInput) {
    return await kecamatanRepo.update(id, data);
  }

  async delete(id: number) {
    return await kecamatanRepo.softDelete(id);
  }

  async restore(id: number) {
    return await kecamatanRepo.restore(id);
  }
}

export class DesaKelurahanService {
  async create(data: DesaKelurahanCreateInput) {
    return await desaKelurahanRepo.create(data);
  }

  async getById(id: number) {
    return await desaKelurahanRepo.findById(id);
  }

  async getAll(filter: DesaKelurahanFilter = {}, pagination: PaginationParams = { page: 1, limit: 10 }) {
    return await desaKelurahanRepo.findAll(filter, pagination);
  }

  async update(id: number, data: DesaKelurahanUpdateInput) {
    return await desaKelurahanRepo.update(id, data);
  }

  async delete(id: number) {
    return await desaKelurahanRepo.softDelete(id);
  }

  async restore(id: number) {
    return await desaKelurahanRepo.restore(id);
  }
}

export class CabangOlahragaService {
  async create(data: CabangOlahragaCreateInput) {
    return await cabangOlahragaRepo.create(data);
  }

  async getById(id: number) {
    return await cabangOlahragaRepo.findById(id);
  }

  async getAll(filter: CabangOlahragaFilter = {}, pagination: PaginationParams = { page: 1, limit: 10 }) {
    return await cabangOlahragaRepo.findAll(filter, pagination);
  }

  async update(id: number, data: CabangOlahragaUpdateInput) {
    return await cabangOlahragaRepo.update(id, data);
  }

  async delete(id: number) {
    return await cabangOlahragaRepo.softDelete(id);
  }

  async restore(id: number) {
    return await cabangOlahragaRepo.restore(id);
  }
}

export class SaranaService {
  async create(data: SaranaCreateInput) {
    return await saranaRepo.create(data);
  }

  async getById(id: number) {
    return await saranaRepo.findById(id);
  }

  async getAll(filter: SaranaFilter = {}, pagination: PaginationParams = { page: 1, limit: 10 }) {
    return await saranaRepo.findAll(filter, pagination);
  }

  async update(id: number, data: SaranaUpdateInput) {
    return await saranaRepo.update(id, data);
  }

  async delete(id: number) {
    return await saranaRepo.softDelete(id);
  }

  async restore(id: number) {
    return await saranaRepo.restore(id);
  }
}

export class PrasaranaService {
  async create(data: PrasaranaCreateInput) {
    return await prasaranaRepo.create(data);
  }

  async getById(id: number) {
    return await prasaranaRepo.findById(id);
  }

  async getAll(filter: PrasaranaFilter = {}, pagination: PaginationParams = { page: 1, limit: 10 }) {
    return await prasaranaRepo.findAll(filter, pagination);
  }

  async update(id: number, data: PrasaranaUpdateInput) {
    return await prasaranaRepo.update(id, data);
  }

  async delete(id: number) {
    return await prasaranaRepo.softDelete(id);
  }

  async restore(id: number) {
    return await prasaranaRepo.restore(id);
  }
}
