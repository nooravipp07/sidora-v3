import { PaginationParams } from "@/repositories/abstract.repository";
import { SportsGroupRepo } from "@/repositories/sports-group.repository";

export const SportsGroupService = {
    async getAll(
        filter: {
            desaKelurahanId?: string;
            year?: string;
            isVerified?: string;
        },
        pagination: PaginationParams
    ) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.desaKelurahanId) {
            where.desaKelurahanId = parseInt(filter.desaKelurahanId);
        }

        if (filter.year) {
            where.year = parseInt(filter.year);
        }

        if (filter.isVerified !== undefined && filter.isVerified !== '') {
            where.isVerified = filter.isVerified === 'true';
        }

        return SportsGroupRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return SportsGroupRepo.findById(id);
    },

    async create(data: any) {
        return SportsGroupRepo.create(data);
    },

    async update(id: number, data: any) {
        return SportsGroupRepo.update(id, data);
    },

    async delete(id: number) {
        return SportsGroupRepo.softDelete(id);
    },
};
