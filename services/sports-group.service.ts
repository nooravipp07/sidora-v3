import { PaginationParams } from "@/repositories/abstract.repository";
import { SportsGroupRepo } from "@/repositories/sports-group.repository";
import { prisma } from "@/lib/prisma";

export const SportsGroupService = {
    async getAll(
        filter: {
            kecamatanId?: string;
            desaKelurahanId?: string;
            year?: string;
            isVerified?: string;
            sportId?: string;
        },
        pagination: PaginationParams
    ) {
        const where: any = {
            deletedAt: null,
        };

        if (filter.desaKelurahanId) {
            where.desaKelurahanId = parseInt(filter.desaKelurahanId);
        } else if (filter.kecamatanId) {
            const kecamatanId = parseInt(filter.kecamatanId);
            const desaList = await prisma.desaKelurahan.findMany({
                where: { kecamatanId },
                select: { id: true },
            });
            const desaIds = desaList.map(d => d.id);
            if (desaIds.length > 0) {
                where.desaKelurahanId = { in: desaIds };
            } else {
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

        if (filter.year) {
            where.year = parseInt(filter.year);
        }

        if (filter.isVerified !== undefined && filter.isVerified !== '') {
            where.isVerified = filter.isVerified === 'true';
        }

        if (filter.sportId) {
            where.sportId = parseInt(filter.sportId);
        }

        return SportsGroupRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return SportsGroupRepo.findById(id);
    },

    async create(data: any) {
        return SportsGroupRepo.create(data);
    },

    async update(id: number, data: any) {
        return SportsGroupRepo.update(id, data);
    },

    async delete(id: number) {
        return SportsGroupRepo.softDelete(id);
    },

    /**
     * Export sports group data to Excel format
     */
    async exportToExcel(filter: { kecamatanId?: number; desaKelurahanId?: number; year?: number; isVerified?: boolean } = {}) {
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

        if (filter.isVerified !== undefined) {
            where.isVerified = filter.isVerified;
        }

        // Get all sports group records with relations
        const records = await prisma.sportsGroup.findMany({
            where,
            include: {
                sport: {
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
            orderBy: [{ year: 'desc' }, { groupName: 'asc' }]
        });

        // Transform data for Excel export
        const excelData = records.map((record, index) => ({
            'No': index + 1,
            'Tahun': record.year || '-',
            'Cabang Olahraga': record.sport?.nama || '-',
            'Nama Klub/Kelompok': record.groupName,
            'Nama Ketua': record.leaderName || '-',
            'Jumlah Anggota': record.memberCount,
            'Verifikasi': record.isVerified ? 'Ya' : 'Tidak',
            'Nomor SK': record.decreeNumber || '-',
            'Alamat Sekretariat': record.secretariatAddress || '-',
            'Desa/Kelurahan': record.desaKelurahan.nama,
            'Kecamatan': record.desaKelurahan.kecamatan.nama,
            'Tanggal Dibuat': new Date(record.createdAt).toLocaleDateString('id-ID'),
            'Tanggal Diperbarui': new Date(record.updatedAt).toLocaleDateString('id-ID')
        }));

        return excelData;
    }
};
