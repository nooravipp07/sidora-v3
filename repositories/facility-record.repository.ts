import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { FacilityRecord } from '@/types/masterdata';

class FacilityRecordRepository extends AbstractRepository<FacilityRecord> {
    constructor() {
        super(prisma.facilityRecord);
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
        };

        const [data, total] = await Promise.all([
            prisma.facilityRecord.findMany({
                where: whereClause,
                skip,
                take: limit,
                include: {
                    prasarana: true,
                    desaKelurahan: {
                        include: {
                            kecamatan: true
                        }
                    },
                    photos: true
                },
                orderBy: { year: 'desc' }
            }),
            prisma.facilityRecord.count({ where: whereClause })
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

    async findByIdWithRelations(id: number) {
        return prisma.facilityRecord.findUnique({
            where: { id },
            include: {
                prasarana: true,
                desaKelurahan: {
                    include: {
                        kecamatan: true
                    }
                },
                photos: true
            }
        });
    }
}

export const FacilityRecordRepo = new FacilityRecordRepository();
