import { PaginationParams } from "@/repositories/abstract.repository";
import { NewsRepo } from "@/repositories/news.repository";
import { prisma } from "@/lib/prisma";

export const NewsService = {
    async getAll(filter: { title?: string; isPublished?: boolean }, pagination: PaginationParams) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.title) {
            where.title = {
                contains: filter.title,
                mode: "insensitive"
            };
        }

        if (filter.isPublished !== undefined) {
            where.isPublished = filter.isPublished;
        }

        return NewsRepo.findWithRelations(where, pagination);
    },

    async getById(id: number) {
        return prisma.news.findUnique({
            where: { id },
            include: { category: true, tags: { include: { tag: true } } }
        });
    },

    async create(data: any) {
        const { title, content, slug, thumbnail, author, isPublished, publishedAt, categoryId, tags } = data;
        
        const news = await prisma.news.create({
            data: {
                title,
                content,
                slug: slug || title.toLowerCase().replace(/\s+/g, '-'),
                thumbnail,
                author,
                isPublished,
                publishedAt,
                categoryId
            },
            include: { category: true, tags: { include: { tag: true } } }
        });

        // Add tags if provided
        if (tags && Array.isArray(tags)) {
            for (const tagId of tags) {
                await prisma.newsTag.create({
                    data: {
                        newsId: news.id,
                        tagId
                    }
                });
            }
        }

        return news;
    },

    async update(id: number, data: any) {
        const { title, content, slug, thumbnail, author, isPublished, publishedAt, categoryId, tags } = data;
        
        const news = await prisma.news.update({
            where: { id },
            data: {
                title,
                content,
                slug: slug || title?.toLowerCase().replace(/\s+/g, '-') || undefined,
                thumbnail,
                author,
                isPublished,
                publishedAt,
                categoryId
            },
            include: { category: true, tags: { include: { tag: true } } }
        });

        // Update tags if provided
        if (tags && Array.isArray(tags)) {
            // Delete existing tags
            await prisma.newsTag.deleteMany({
                where: { newsId: id }
            });
            // Add new tags
            for (const tagId of tags) {
                await prisma.newsTag.create({
                    data: {
                        newsId: id,
                        tagId
                    }
                });
            }
        }

        return news;
    },

    async delete(id: number) {
        return NewsRepo.softDelete(id);
    },

    async publish(id: number) {
        return prisma.news.update({
            where: { id },
            data: {
                isPublished: true,
                publishedAt: new Date()
            }
        });
    },

    async unpublish(id: number) {
        return prisma.news.update({
            where: { id },
            data: {
                isPublished: false,
                publishedAt: null
            }
        });
    },

    async getBySlug(slug: string) {
        return prisma.news.findUnique({
            where: { slug },
            include: { category: true, tags: { include: { tag: true } } }
        });
    },

    async incrementViews(id: number) {
        return prisma.news.update({
            where: { id },
            data: {
                views: {
                    increment: 1
                }
            }
        });
    }
};
