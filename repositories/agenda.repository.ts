import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { Agenda } from '@/types/agenda';

class AgendaRepository extends AbstractRepository<Agenda> {
    constructor() {
        super(prisma.agenda);
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
            prisma.agenda.findMany({
                where: whereClause,
                skip,
                take: limit,
                orderBy: { startDate: 'asc' }
            }),
            prisma.agenda.count({ where: whereClause })
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

    async deleteWithSoftDelete(id: number) {
        return prisma.agenda.update({
            where: { id },
            data: { deletedAt: new Date() }
        });
    }
}

export const AgendaRepo = new AgendaRepository();
