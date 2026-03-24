import { PaginationParams } from "@/repositories/abstract.repository";
import { FacilityRecordRepo } from "@/repositories/facility-record.repository";
import { FacilityRecordCreateInput, FacilityRecordUpdateInput, FacilityRecordFilter } from "@/types/masterdata";
import { prisma } from "@/lib/prisma";

export const FacilityRecordService = {
    async getAll(filter: FacilityRecordFilter = {}, pagination: PaginationParams) {
        const where: any = {};

        // Handle kecamatan filter by finding related desa/kelurahan
        if (filter.kecamatanId !== undefined) {
            const desaList = await prisma.desaKelurahan.findMany({
                where: { kecamatanId: filter.kecamatanId },
                select: { id: true }
            });
            const desaIds = desaList.map(d => d.id);
            if (desaIds.length > 0) {
                where.desaKelurahanId = { in: desaIds };
            } else {
                // If no desa/kelurahan found for this kecamatan, return empty result
                return {
                    data: [],
                    meta: {
                        total: 0,
                        page: pagination.page,
                        limit: pagination.limit,
                        totalPages: 0,
                        hasMore: false
                    }
                };
            }
        } else if (filter.desaKelurahanId !== undefined) {
            where.desaKelurahanId = filter.desaKelurahanId;
        }

        if (filter.prasaranaId !== undefined) {
            where.prasaranaId = filter.prasaranaId;
        }

        if (filter.year !== undefined) {
            where.year = filter.year;
        }

        if (filter.isActive !== undefined) {
            where.isActive = filter.isActive;
        }

        return FacilityRecordRepo.findWithRelations(where, pagination);
    },

    async getById(id: number) {
        return FacilityRecordRepo.findByIdWithRelations(id);
    },

    async create(data: FacilityRecordCreateInput & { createdBy?: string }) {
        const {
            desaKelurahanId,
            prasaranaId,
            year,
            condition,
            ownershipStatus,
            address,
            notes,
            isActive = true,
            createdBy
        } = data;

        // Check if facility record already exists for this prasarana and year
        const existing = await prisma.facilityRecord.findFirst({
            where: {
                prasaranaId,
                year
            }
        });

        if (existing) {
            throw new Error(`Facility record untuk prasarana dan tahun ini sudah ada`);
        }

        const facilityRecord = await prisma.facilityRecord.create({
            data: {
                desaKelurahanId,
                prasaranaId,
                year,
                condition: condition?.trim() || null,
                ownershipStatus: ownershipStatus?.trim() || null,
                address: address?.trim() || null,
                notes: notes?.trim() || null,
                isActive,
                createdBy: createdBy || null
            },
            include: {
                prasarana: true,
                desaKelurahan: {
                    include: {
                        kecamatan: true
                    }
                }
            }
        });

        return facilityRecord;
    },

    async update(id: number, data: FacilityRecordUpdateInput & { updatedBy?: string }) {
        const {
            desaKelurahanId,
            prasaranaId,
            year,
            condition,
            ownershipStatus,
            address,
            notes,
            isActive,
            updatedBy
        } = data;

        const updateData: any = {};

        if (desaKelurahanId !== undefined) updateData.desaKelurahanId = desaKelurahanId;
        if (prasaranaId !== undefined) updateData.prasaranaId = prasaranaId;
        if (year !== undefined) updateData.year = year;
        if (condition !== undefined) updateData.condition = condition?.trim() || null;
        if (ownershipStatus !== undefined) updateData.ownershipStatus = ownershipStatus?.trim() || null;
        if (address !== undefined) updateData.address = address?.trim() || null;
        if (notes !== undefined) updateData.notes = notes?.trim() || null;
        if (isActive !== undefined) updateData.isActive = isActive;
        if (updatedBy) updateData.updatedBy = updatedBy;

        const facilityRecord = await prisma.facilityRecord.update({
            where: { id },
            data: updateData,
            include: {
                prasarana: true,
                desaKelurahan: {
                    include: {
                        kecamatan: true
                    }
                }
            }
        });

        return facilityRecord;
    },

    async delete(id: number) {
        return prisma.facilityRecord.delete({
            where: { id }
        });
    },

    /**
     * Export facility records to Excel format
     * Filters by year and kecamatan
     */
    async exportToExcel(filter: { year?: number; kecamatanId?: number }) {
        const where: any = {};

        if (filter.kecamatanId !== undefined) {
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

        // Get all records without pagination
        const records = await prisma.facilityRecord.findMany({
            where,
            include: {
                prasarana: {
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
            orderBy: [{ year: 'desc' }, { prasarana: { nama: 'asc' } }]
        });

        // Transform data for Excel export
        const excelData = records.map(record => ({
            'No': record.id,
            'Tahun': record.year,
            'Prasarana': record.prasarana.nama,
            'Desa/Kelurahan': record.desaKelurahan.nama,
            'Kecamatan': record.desaKelurahan.kecamatan.nama,
            'Kondisi': record.condition || '-',
            'Status Kepemilikan': record.ownershipStatus || '-',
            'Alamat': record.address || '-',
            'Catatan': record.notes || '-',
            'Aktif': record.isActive ? 'Ya' : 'Tidak',
            'Dibuat Oleh': record.createdBy || '-',
            'Diperbarui Oleh': record.updatedBy || '-',
            'Tanggal Dibuat': new Date(record.createdAt).toLocaleDateString('id-ID'),
            'Tanggal Diperbarui': new Date(record.updatedAt).toLocaleDateString('id-ID')
        }));

        return excelData;
    },

    /**
     * Import facility records from Excel data
     */
    async importFromExcel(
        data: any[],
        createdBy?: string
    ): Promise<{
        success: number;
        failed: number;
        errors: Array<{ row: number; error: string }>;
        created: any[];
    }> {
        const errors: Array<{ row: number; error: string }> = [];
        const created: any[] = [];
        let successCount = 0;
        let failedCount = 0;

        for (let i = 0; i < data.length; i++) {
            const row = i + 2; // Excel row number (1-indexed, +1 for header)
            const item = data[i];

            try {
                // Validate required fields
                if (!item['Tahun'] || !item['Prasarana'] || !item['Desa/Kelurahan']) {
                    throw new Error('Tahun, Prasarana, dan Desa/Kelurahan harus diisi');
                }

                // Find prasarana by name
                const prasarana = await prisma.prasarana.findFirst({
                    where: { nama: item['Prasarana'].toString().trim() }
                });

                if (!prasarana) {
                    throw new Error(`Prasarana "${item['Prasarana']}" tidak ditemukan`);
                }

                // Find desa/kelurahan by name
                const desaKelurahan = await prisma.desaKelurahan.findFirst({
                    where: { nama: item['Desa/Kelurahan'].toString().trim() }
                });

                if (!desaKelurahan) {
                    throw new Error(`Desa/Kelurahan "${item['Desa/Kelurahan']}" tidak ditemukan`);
                }

                // Check if record already exists
                const existingRecord = await prisma.facilityRecord.findFirst({
                    where: {
                        prasaranaId: prasarana.id,
                        year: parseInt(item['Tahun'], 10),
                        desaKelurahanId: desaKelurahan.id
                    }
                });

                if (existingRecord) {
                    // Update existing record
                    const updated = await this.update(existingRecord.id, {
                        condition: item['Kondisi'] || undefined,
                        ownershipStatus: item['Status Kepemilikan'] || undefined,
                        address: item['Alamat'] || undefined,
                        notes: item['Catatan'] || undefined,
                        isActive: item['Aktif'] === 'Ya' || item['Aktif'] === true,
                        updatedBy: createdBy
                    });
                    created.push(updated);
                } else {
                    // Create new record
                    const newRecord = await this.create({
                        desaKelurahanId: desaKelurahan.id,
                        prasaranaId: prasarana.id,
                        year: parseInt(item['Tahun'], 10),
                        condition: item['Kondisi'] || undefined,
                        ownershipStatus: item['Status Kepemilikan'] || undefined,
                        address: item['Alamat'] || undefined,
                        notes: item['Catatan'] || undefined,
                        isActive: item['Aktif'] === 'Ya' || item['Aktif'] === true,
                        createdBy: createdBy
                    });
                    created.push(newRecord);
                }

                successCount++;
            } catch (error) {
                failedCount++;
                errors.push({
                    row,
                    error: error instanceof Error ? error.message : 'Unknown error'
                });
            }
        }

        return {
            success: successCount,
            failed: failedCount,
            errors,
            created
        };
    }
};
