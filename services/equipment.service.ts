import { PaginationParams } from "@/repositories/abstract.repository";
import { EquipmentRepo } from "@/repositories/equipment.repository";
import { prisma } from "@/lib/prisma";

export const EquipmentService = {
    async getAll(
        filter: {
            kecamatanId?: string;
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
        } else if (filter.kecamatanId) {
            const kecId = parseInt(filter.kecamatanId);
            const desaList = await prisma.desaKelurahan.findMany({
                where: { kecamatanId: kecId },
                select: { id: true }
            });
            const desaIds = desaList.map((d: any) => d.id);
            if (desaIds.length > 0) {
                where.desaKelurahanId = { in: desaIds };
            } else {
                // no desa found in kecamatan: return empty page
                return {
                    data: [],
                    meta: {
                        total: 0,
                        page: pagination.page,
                        limit: pagination.limit,
                        totalPages: 0,
                        hasMore: false,
                    },
                };
            }
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

    async exportToExcel(filter: { kecamatanId?: number; desaKelurahanId?: number; year?: number } = {}) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.desaKelurahanId !== undefined) {
            where.desaKelurahanId = filter.desaKelurahanId;
        } else if (filter.kecamatanId !== undefined) {
            const desaList = await prisma.desaKelurahan.findMany({
                where: { kecamatanId: filter.kecamatanId },
                select: { id: true }
            });
            const desaIds = desaList.map(d => d.id);
            if (desaIds.length > 0) {
                where.desaKelurahanId = { in: desaIds };
            } else {
                return [];
            }
        }

        if (filter.year !== undefined) {
            where.year = filter.year;
        }

        // Get all equipment records with relations
        const records = await prisma.equipment.findMany({
            where,
            include: {
                sarana: {
                    select: { nama: true, jenis: true }
                },
                desaKelurahan: {
                    select: {
                        nama: true,
                        kecamatan: {
                            select: { nama: true }
                        }
                    }
                }
            },
            orderBy: [{ createdAt: 'desc' }]
        });

        // Transform data for Excel export
        const excelData = records.map((record, index) => ({
            'No': index + 1,
            'Sarana': record.sarana?.nama || '-',
            'Jenis Sarana': record.sarana?.jenis || '-',
            'Jumlah': record.quantity,
            'Satuan': record.unit || '-',
            'Layak Pakai': record.isUsable ? 'Ya' : 'Tidak',
            'Bantuan Pemerintah': record.isGovernmentGrant ? 'Ya' : 'Tidak',
            'Tahun': record.year || '-',
            'Desa/Kelurahan': record.desaKelurahan.nama,
            'Kecamatan': record.desaKelurahan.kecamatan.nama,
            'Tanggal Dibuat': new Date(record.createdAt).toLocaleDateString('id-ID'),
            'Tanggal Diperbarui': new Date(record.updatedAt).toLocaleDateString('id-ID')
        }));

        return excelData;
    },
};
