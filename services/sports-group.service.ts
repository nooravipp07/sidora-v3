import { PaginationParams } from "@/repositories/abstract.repository";
import { SportsGroupRepo } from "@/repositories/sports-group.repository";
import { prisma } from "@/lib/prisma";

export const SportsGroupService = {
    async getAll(
        filter: {
            kecamatanId?: string;
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
        } else if (filter.kecamatanId) {
            const kecamatanId = parseInt(filter.kecamatanId);
            const desaList = await prisma.desaKelurahan.findMany({
                where: { kecamatanId },
                select: { id: true },
            });
            const desaIds = desaList.map(d => d.id);
            if (desaIds.length > 0) {
                where.desaKelurahanId = { in: desaIds };
            } else {
                return {
                    data: [],
                    meta: {
                        total: 0,
                        page: pagination.page,
                        limit: pagination.limit,
                        totalPages: 0,
                        hasMore: false,
                    },
                };
            }
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
