import { PaginationParams } from "@/repositories/abstract.repository";
import { AgendaRepo } from "@/repositories/agenda.repository";
import { prisma } from "@/lib/prisma";

export const AgendaService = {
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

        return AgendaRepo.findWithRelations(where, pagination);
    },

    async getById(id: number) {
        return prisma.agenda.findUnique({
            where: { id }
        });
    },

    async create(data: any) {
        const { title, description, location, category, level, status, startDate, endDate, isAllDay } = data;
        
        const agenda = await prisma.agenda.create({
            data: {
                title: title.trim(),
                description: description?.trim() || null,
                location: location?.trim() || null,
                category: category?.trim() || null,
                level: level?.trim() || null,
                status: status || 'Active',
                startDate: new Date(startDate),
                endDate: endDate ? new Date(endDate) : null,
                isAllDay: isAllDay || false
            }
        });

        return agenda;
    },

    async update(id: number, data: any) {
        const { title, description, location, category, level, status, startDate, endDate, isAllDay } = data;
        
        const agenda = await prisma.agenda.update({
            where: { id },
            data: {
                title: title?.trim(),
                description: description?.trim() || null,
                location: location?.trim() || null,
                category: category?.trim() || null,
                level: level?.trim() || null,
                status: status || undefined,
                startDate: startDate ? new Date(startDate) : undefined,
                endDate: endDate ? new Date(endDate) : null,
                isAllDay: isAllDay !== undefined ? isAllDay : undefined
            }
        });

        return agenda;
    },

    async delete(id: number) {
        return AgendaRepo.deleteWithSoftDelete(id);
    }
};
