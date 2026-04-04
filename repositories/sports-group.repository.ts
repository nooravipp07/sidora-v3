import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';

interface SportsGroup {
    id: number;
    desaKelurahanId: number;
    groupName: string;
    leaderName?: string | null;
    memberCount: number;
    isVerified: boolean;
    decreeNumber?: string | null;
    secretariatAddress?: string | null;
    year?: number | null;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    // Relations
    desaKelurahan?: any;
}

class SportsGroupRepository extends AbstractRepository<SportsGroup> {
    constructor() {
        super(prisma.sportsGroup);
    }

    async findAll(where: any = {}, pagination: any = { page: 1, limit: 10 }) {
        try {
            const skip = (pagination.page - 1) * pagination.limit;

            const [data, total] = await Promise.all([
                prisma.sportsGroup.findMany({
                    where,
                    include: {
                        desaKelurahan: {
                            include: {
                                kecamatan: true,
                            },
                        },
                        sport: true,
                    },
                    skip,
                    take: pagination.limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                prisma.sportsGroup.count({ where }),
            ]);

            const totalPages = Math.ceil(total / pagination.limit);

            return {
                data,
                meta: {
                    total,
                    page: pagination.page,
                    limit: pagination.limit,
                    totalPages,
                    hasMore: pagination.page < totalPages,
                },
            };
        } catch (error) {
            console.error('Error in SportsGroupRepository.findAll:', error);
            throw error;
        }
    }

    async findById(id: number) {
        try {
            return await prisma.sportsGroup.findUnique({
                where: { id },
                include: {
                    desaKelurahan: {
                        include: {
                            kecamatan: true,
                        },
                    },
                    sport: true,
                },
            });
        } catch (error) {
            console.error('Error in SportsGroupRepository.findById:', error);
            throw error;
        }
    }

    async create(data: any) {
        try {
            return await prisma.sportsGroup.create({
                data,
                include: {
                    desaKelurahan: {
                        include: {
                            kecamatan: true,
                        },
                    },
                },
            });
        } catch (error) {
            console.error('Error in SportsGroupRepository.create:', error);
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            return await prisma.sportsGroup.update({
                where: { id },
                data,
                include: {
                    desaKelurahan: {
                        include: {
                            kecamatan: true,
                        },
                    },
                },
            });
        } catch (error) {
            console.error('Error in SportsGroupRepository.update:', error);
            throw error;
        }
    }

    async softDelete(id: number) {
        try {
            return await prisma.sportsGroup.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            console.error('Error in SportsGroupRepository.softDelete:', error);
            throw error;
        }
    }

    async delete(id: number) {
        try {
            return await prisma.sportsGroup.delete({
                where: { id },
            });
        } catch (error) {
            console.error('Error in SportsGroupRepository.delete:', error);
            throw error;
        }
    }
}

export const SportsGroupRepo = new SportsGroupRepository();
