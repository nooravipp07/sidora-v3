import { prisma } from '@/lib/prisma';
import { AbstractRepository, PaginationParams, PaginatedResponse } from './abstract.repository';
import { DesaKelurahan } from '@/types/masterdata';

class DesaKelurahanRepository extends AbstractRepository<DesaKelurahan> {
    constructor() {
        super(prisma.desaKelurahan);
    }

    async findAll(
        where: any = {},
        pagination: PaginationParams = { page: 1, limit: 10 }
    ): Promise<PaginatedResponse<any>> {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.desaKelurahan.findMany({
                where,
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
                include: { kecamatan: true }
            }),
            prisma.desaKelurahan.count({ where })
        ]);

        const totalPages = Math.ceil(total / limit);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages,
                hasMore: page < totalPages
            }
        };
    }

    async findById(id: number): Promise<any> {
        return prisma.desaKelurahan.findUnique({
            where: { id },
            include: { kecamatan: true }
        });
    }
}

export const DesaKelurahanRepo = new DesaKelurahanRepository();
