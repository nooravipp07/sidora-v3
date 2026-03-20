import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';

// Equipment repository for managing equipment records
interface Equipment {
    id: number;
    desaKelurahanId: number;
    saranaId: number;
    quantity: number;
    unit?: string;
    isUsable: boolean;
    isGovernmentGrant: boolean;
    year?: number;
    createdAt: Date;
    updatedAt: Date;
    deletedAt?: Date | null;
    // Relations
    desaKelurahan?: any;
    sarana?: any;
}

class EquipmentRepository extends AbstractRepository<Equipment> {
    constructor() {
        super(prisma.equipment);
    }

    async findAll(where: any = {}, pagination: any = { page: 1, limit: 10 }) {
        try {
            const skip = (pagination.page - 1) * pagination.limit;

            const [data, total] = await Promise.all([
                prisma.equipment.findMany({
                    where,
                    include: {
                        desaKelurahan: {
                            include: {
                                kecamatan: true,
                            },
                        },
                        sarana: true,
                    },
                    skip,
                    take: pagination.limit,
                    orderBy: {
                        createdAt: 'desc',
                    },
                }),
                prisma.equipment.count({ where }),
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
            console.error('Error in EquipmentRepository.findAll:', error);
            throw error;
        }
    }

    async findById(id: number) {
        try {
            return await prisma.equipment.findUnique({
                where: { id },
                include: {
                    desaKelurahan: {
                        include: {
                            kecamatan: true,
                        },
                    },
                    sarana: true,
                },
            });
        } catch (error) {
            console.error('Error in EquipmentRepository.findById:', error);
            throw error;
        }
    }

    async create(data: any) {
        try {
            return await prisma.equipment.create({
                data,
                include: {
                    desaKelurahan: {
                        include: {
                            kecamatan: true,
                        },
                    },
                    sarana: true,
                },
            });
        } catch (error) {
            console.error('Error in EquipmentRepository.create:', error);
            throw error;
        }
    }

    async update(id: number, data: any) {
        try {
            return await prisma.equipment.update({
                where: { id },
                data,
                include: {
                    desaKelurahan: {
                        include: {
                            kecamatan: true,
                        },
                    },
                    sarana: true,
                },
            });
        } catch (error) {
            console.error('Error in EquipmentRepository.update:', error);
            throw error;
        }
    }

    async softDelete(id: number) {
        try {
            return await prisma.equipment.update({
                where: { id },
                data: {
                    deletedAt: new Date(),
                },
            });
        } catch (error) {
            console.error('Error in EquipmentRepository.softDelete:', error);
            throw error;
        }
    }

    async delete(id: number) {
        try {
            return await prisma.equipment.delete({
                where: { id },
            });
        } catch (error) {
            console.error('Error in EquipmentRepository.delete:', error);
            throw error;
        }
    }
}

export const EquipmentRepo = new EquipmentRepository();
