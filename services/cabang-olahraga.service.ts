import { PaginationParams } from "@/repositories/abstract.repository";
import { CabangOlahragaRepo } from "@/repositories/cabang-olahraga.repository";

export const CabangOlahragaService = {
    async getAll(filter: { nama?: string }, pagination: PaginationParams) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.nama) {
            where.nama = {
                contains: filter.nama,
                mode: "insensitive"
            };
        }

        return CabangOlahragaRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return CabangOlahragaRepo.findById(id);
    },

    async create(data: any) {
        return CabangOlahragaRepo.create(data);
    },

    async update(id: number, data: any) {
        return CabangOlahragaRepo.update(id, data);
    },

    async delete(id: number) {
        return CabangOlahragaRepo.softDelete(id);
    }
};
