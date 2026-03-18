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
    }
};
