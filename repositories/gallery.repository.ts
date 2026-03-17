import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { Gallery } from '@/types/gallery';

class GalleryRepository extends AbstractRepository<Gallery> {
    constructor() {
        super(prisma.gallery);
    }

    async findWithItems(where: any = {}) {
        return prisma.gallery.findUnique({
            where,
            include: { items: { orderBy: { createdAt: 'desc' } } }
        });
    }

    async findWithRelations(
        where: any = {},
        pagination: any = { page: 1, limit: 10 }
    ) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;

        const whereClause = {
            ...where,
            deletedAt: null
        };

        const [data, total] = await Promise.all([
            prisma.gallery.findMany({
                where: whereClause,
                include: { items: true },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.gallery.count({ where: whereClause })
        ]);

        return {
            data,
            meta: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit),
                hasMore: page < Math.ceil(total / limit)
            }
        };
    }

    async deleteWithItems(id: number) {
        return prisma.gallery.update({
            where: { id },
            data: { deletedAt: new Date() },
            include: { items: true }
        });
    }
}

export const GalleryRepo = new GalleryRepository();
