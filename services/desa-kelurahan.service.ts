import { PaginationParams } from "@/repositories/abstract.repository";
import { DesaKelurahanRepo } from "@/repositories/desa-kelurahan.repository";

export const DesaKelurahanService = {
    async getAll(filter: { nama?: string; kecamatanId?: number; tipe?: string }, pagination: PaginationParams) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.nama) {
            where.nama = {
                contains: filter.nama,
                mode: "insensitive"
            };
        }

        if (filter.kecamatanId) {
            where.kecamatanId = filter.kecamatanId;
        }

        if (filter.tipe) {
            where.tipe = filter.tipe;
        }

        return DesaKelurahanRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return DesaKelurahanRepo.findById(id);
    },

    async create(data: any) {
        return DesaKelurahanRepo.create(data);
    },

    async update(id: number, data: any) {
        return DesaKelurahanRepo.update(id, data);
    },

    async delete(id: number) {
        return DesaKelurahanRepo.softDelete(id);
    }
};
