import { PaginationParams } from "@/repositories/abstract.repository";
import { EquipmentRepo } from "@/repositories/equipment.repository";

export const EquipmentService = {
    async getAll(
        filter: {
            desaKelurahanId?: string;
            saranaId?: string;
            year?: string;
            isUsable?: string;
        },
        pagination: PaginationParams
    ) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.desaKelurahanId) {
            where.desaKelurahanId = parseInt(filter.desaKelurahanId);
        }

        if (filter.saranaId) {
            where.saranaId = parseInt(filter.saranaId);
        }

        if (filter.year) {
            where.year = parseInt(filter.year);
        }

        if (filter.isUsable !== undefined && filter.isUsable !== '') {
            where.isUsable = filter.isUsable === 'true';
        }

        return EquipmentRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return EquipmentRepo.findById(id);
    },

    async create(data: any) {
        return EquipmentRepo.create(data);
    },

    async update(id: number, data: any) {
        return EquipmentRepo.update(id, data);
    },

    async delete(id: number) {
        return EquipmentRepo.softDelete(id);
    },

    async getByDesaKelurahan(desaKelurahanId: number) {
        return EquipmentRepo.findAll(
            {
                desaKelurahanId,
                deletedAt: null,
            },
            { page: 1, limit: 1000 }
        );
    },

    async getByYear(year: number) {
        return EquipmentRepo.findAll(
            {
                year,
                deletedAt: null,
            },
            { page: 1, limit: 1000 }
        );
    },
};
