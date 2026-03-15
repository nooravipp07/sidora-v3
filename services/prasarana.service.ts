import { PaginationParams } from "@/repositories/abstract.repository";
import { PrasaranaRepo } from "@/repositories/prasarana.repository";

export const PrasaranaService = {
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

        return PrasaranaRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return PrasaranaRepo.findById(id);
    },

    async create(data: any) {
        return PrasaranaRepo.create(data);
    },

    async update(id: number, data: any) {
        return PrasaranaRepo.update(id, data);
    },

    async delete(id: number) {
        return PrasaranaRepo.softDelete(id);
    }
};
