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

    async getEquipmentTrends(filters?: { kecamatanId?: number; lastYears?: number }) {
        try {
            const currentYear = new Date().getFullYear();
            const yearsBack = filters?.lastYears || 5;
            const minYear = currentYear - yearsBack + 1;
            
            let whereConditions = `WHERE deletedAt IS NULL 
                AND isGovernmentGrant = 1 
                AND year IS NOT NULL 
                AND year >= ${minYear}`;

            if (filters?.kecamatanId) {
                whereConditions += ` AND desaKelurahanId IN (
                    SELECT id FROM m_desa_kelurahan WHERE kecamatanId = ${filters.kecamatanId}
                )`;
            }

            const rawResult = await prisma.$queryRawUnsafe(`
                SELECT 
                    year,
                    SUM(quantity) as totalQuantity
                FROM equipments
                ${whereConditions}
                GROUP BY year
                ORDER BY year ASC
            `);

            // Generate all years in range, even if no data
            const allYears: number[] = [];
            for (let i = 0; i < yearsBack; i++) {
                allYears.push(minYear + i);
            }

            const grantData: number[] = allYears.map(year => {
                const record = (rawResult as any[]).find(r => r.year === year);
                return record?.totalQuantity || 0;
            });

            return {
                years: allYears,
                series: [
                    {
                        name: 'Hibah Pemerintah',
                        data: grantData,
                    },
                ],
            };
        } catch (error) {
            console.error('Error in EquipmentRepository.getEquipmentTrends:', error);
            return {
                years: [],
                series: [
                    { name: 'Hibah Pemerintah', data: [] },
                ],
            };
        }
    }

    async getEquipmentDistribution(filters?: { kecamatanId?: number; year?: number }) {
        try {
            let whereConditions = 'WHERE deletedAt IS NULL';

            if (filters?.year) {
                whereConditions += ` AND year = ${filters.year}`;
            }

            if (filters?.kecamatanId) {
                whereConditions += ` AND desaKelurahanId IN (
                    SELECT id FROM desa_kelurahans WHERE kecamatanId = ${filters.kecamatanId}
                )`;
            }

            const result = await prisma.$queryRawUnsafe(`
                SELECT
                    SUM(CASE WHEN isUsable = 1 THEN 1 ELSE 0 END) as usableCount,
                    SUM(CASE WHEN isUsable = 0 THEN 1 ELSE 0 END) as notUsableCount,
                    SUM(CASE WHEN isGovernmentGrant = 1 THEN 1 ELSE 0 END) as grantCount,
                    SUM(CASE WHEN isGovernmentGrant = 0 THEN 1 ELSE 0 END) as nonGrantCount,
                    COUNT(*) as totalRecords
                FROM equipments
                ${whereConditions}
            `);

            const data = (result as any[])[0] || {
                usableCount: 0,
                notUsableCount: 0,
                grantCount: 0,
                nonGrantCount: 0,
                totalRecords: 0,
            };

            return {
                usable: parseInt(data.usableCount || 0),
                notUsable: parseInt(data.notUsableCount || 0),
                grant: parseInt(data.grantCount || 0),
                nonGrant: parseInt(data.nonGrantCount || 0),
                totalRecords: parseInt(data.totalRecords || 0),
            };
        } catch (error) {
            console.error('Error in EquipmentRepository.getEquipmentDistribution:', error);
            return {
                usable: 0,
                notUsable: 0,
                grant: 0,
                nonGrant: 0,
                totalRecords: 0,
            };
        }
    }
}

export const EquipmentRepo = new EquipmentRepository();
