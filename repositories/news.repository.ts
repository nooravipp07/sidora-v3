import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { News } from '@/types/news';

class NewsRepository extends AbstractRepository<News> {
    constructor() {
        super(prisma.news);
    }

    async findBySlug(slug: string): Promise<News | null> {
        return prisma.news.findUnique({
            where: { slug },
            include: { category: true, tags: { include: { tag: true } } }
        });
    }

    async findWithRelations(
        where: any = {},
        pagination: any = { page: 1, limit: 10 }
    ) {
        const page = pagination.page || 1;
        const limit = pagination.limit || 10;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            prisma.news.findMany({
                where,
                include: { category: true, tags: { include: { tag: true } } },
                skip,
                take: limit,
                orderBy: { createdAt: 'desc' }
            }),
            prisma.news.count({ where })
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
}

export const NewsRepo = new NewsRepository();
