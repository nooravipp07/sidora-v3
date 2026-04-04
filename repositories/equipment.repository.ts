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

    async getEquipmentTrends(filters?: { kecamatanId?: number; year?: number }) {
        try {
            // Build where clause
            const whereClause: any = {
                deletedAt: null,
            };

            if (filters?.year) {
                whereClause.year = filters.year;
            }

            if (filters?.kecamatanId) {
                whereClause.desaKelurahan = {
                    kecamatanId: filters.kecamatanId,
                };
            }

            // Group by year and isGovernmentGrant using raw query
            // Build WHERE clause conditions
            let whereConditions = 'WHERE deletedAt IS NULL';
            if (filters?.year) {
                whereConditions += ` AND year = ${filters.year}`;
            }
            if (filters?.kecamatanId) {
                whereConditions += ` AND desaKelurahanId IN (
                    SELECT id FROM desa_kelurahans WHERE kecamatanId = ${filters.kecamatanId}
                )`;
            }

            const rawResult = await prisma.$queryRawUnsafe(`
                SELECT 
                    COALESCE(year, YEAR(CURDATE())) as year,
                    isGovernmentGrant,
                    SUM(quantity) as totalQuantity
                FROM equipments
                ${whereConditions}
                GROUP BY year, isGovernmentGrant
                ORDER BY year ASC
            `);

            // Transform result
            const years: number[] = [];
            const grantData: number[] = [];
            const nonGrantData: number[] = [];

            // Get all unique years first
            const uniqueYears = [...new Set((rawResult as any[]).map(r => r.year))].sort((a, b) => a - b);

            // Build data arrays
            uniqueYears.forEach(year => {
                years.push(year);
                
                const grantRecord = (rawResult as any[]).find(r => r.year === year && r.isGovernmentGrant === 1);
                const nonGrantRecord = (rawResult as any[]).find(r => r.year === year && r.isGovernmentGrant === 0);
                
                grantData.push(grantRecord?.totalQuantity || 0);
                nonGrantData.push(nonGrantRecord?.totalQuantity || 0);
            });

            return {
                years,
                series: [
                    {
                        name: 'Hibah Pemerintah',
                        data: grantData,
                    },
                    {
                        name: 'Non Hibah',
                        data: nonGrantData,
                    },
                ],
            };
        } catch (error) {
            console.error('Error in EquipmentRepository.getEquipmentTrends:', error);
            // Return empty result on error
            return {
                years: [],
                series: [
                    { name: 'Hibah Pemerintah', data: [] },
                    { name: 'Non Hibah', data: [] },
                ],
            };
        }
    }
}

export const EquipmentRepo = new EquipmentRepository();
