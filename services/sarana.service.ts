import { PaginationParams } from "@/repositories/abstract.repository";
import { SaranaRepo } from "@/repositories/sarana.repository";

export const SaranaService = {
    async getAll(filter: { nama?: string; jenis?: string }, pagination: PaginationParams) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.nama) {
            where.nama = {
                contains: filter.nama,
                mode: "insensitive"
            };
        }

        if (filter.jenis) {
            where.jenis = {
                contains: filter.jenis,
                mode: "insensitive"
            };
        }

        return SaranaRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return SaranaRepo.findById(id);
    },

    async create(data: any) {
        return SaranaRepo.create(data);
    },

    async update(id: number, data: any) {
        return SaranaRepo.update(id, data);
    },

    async delete(id: number) {
        return SaranaRepo.softDelete(id);
    }
};
