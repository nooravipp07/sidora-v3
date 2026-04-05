import { PaginationParams } from "@/repositories/abstract.repository";
import { SaranaRepo } from "@/repositories/sarana.repository";
import { prisma } from "@/lib/prisma";

export const SaranaService = {
    async getAll(filter: { nama?: string; jenis?: string }, pagination: PaginationParams) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.nama) {
            where.nama = {
                contains: filter.nama,
                mode: "insensitive"
            };
        }

        if (filter.jenis) {
            where.jenis = {
                contains: filter.jenis,
                mode: "insensitive"
            };
        }

        return SaranaRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return SaranaRepo.findById(id);
    },

    async create(data: any) {
        return SaranaRepo.create(data);
    },

    async update(id: number, data: any) {
        return SaranaRepo.update(id, data);
    },

    async delete(id: number) {
        return SaranaRepo.softDelete(id);
    },

    /**
     * Export equipment data to Excel format
     */
    async exportToExcel(filter: { kecamatanId?: number; desaKelurahanId?: number } = {}) {
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

        // Get all equipment records with relations
        const records = await prisma.equipment.findMany({
            where,
            include: {
                sarana: {
                    select: { nama: true }
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
            orderBy: [{ year: 'desc' }, { sarana: { nama: 'asc' } }]
        });

        // Transform data for Excel export
        const excelData = records.map((record, index) => ({
            'No': index + 1,
            'Tahun': record.year || '-',
            'Sarana': record.sarana.nama,
            'Jumlah': record.quantity,
            'Satuan': record.unit || '-',
            'Dapat Digunakan': record.isUsable ? 'Ya' : 'Tidak',
            'Hibah Pemerintah': record.isGovernmentGrant ? 'Ya' : 'Tidak',
            'Desa/Kelurahan': record.desaKelurahan.nama,
            'Kecamatan': record.desaKelurahan.kecamatan.nama,
            'Tanggal Dibuat': new Date(record.createdAt).toLocaleDateString('id-ID'),
            'Tanggal Diperbarui': new Date(record.updatedAt).toLocaleDateString('id-ID')
        }));

        return excelData;
    }
};
