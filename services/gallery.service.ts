import { PaginationParams } from "@/repositories/abstract.repository";
import { GalleryRepo } from "@/repositories/gallery.repository";
import { prisma } from "@/lib/prisma";

export const GalleryService = {
    async getAll(filter: { title?: string }, pagination: PaginationParams) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.title) {
            where.title = {
                contains: filter.title,
                mode: "insensitive"
            };
        }

        return GalleryRepo.findWithRelations(where, pagination);
    },

    async getById(id: number) {
        return prisma.gallery.findUnique({
            where: { id },
            include: { items: { orderBy: { createdAt: 'desc' } } }
        });
    },

    async create(data: any) {
        const { title, description } = data;
        
        const gallery = await prisma.gallery.create({
            data: {
                title,
                description
            },
            include: { items: true }
        });

        return gallery;
    },

    async update(id: number, data: any) {
        const { title, description } = data;
        
        const gallery = await prisma.gallery.update({
            where: { id },
            data: {
                title,
                description
            },
            include: { items: { orderBy: { createdAt: 'desc' } } }
        });

        return gallery;
    },

    async delete(id: number) {
        return GalleryRepo.deleteWithItems(id);
    },

    async addItem(galleryId: number, itemData: any) {
        const { imageUrl, caption } = itemData;

        return prisma.galleryItem.create({
            data: {
                galleryId,
                imageUrl,
                caption
            }
        });
    },

    async removeItem(itemId: number) {
        return prisma.galleryItem.delete({
            where: { id: itemId }
        });
    },

    async updateItem(itemId: number, data: any) {
        const { caption } = data;

        return prisma.galleryItem.update({
            where: { id: itemId },
            data: { caption }
        });
    }
};
