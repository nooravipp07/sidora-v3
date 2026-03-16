import { PaginationParams } from "@/repositories/abstract.repository";
import { UserRepo } from "@/repositories/user.repository";
import { prisma } from "@/lib/prisma";

export const UserService = {
    async getAll(filter: { nama?: string; email?: string; roleId?: number; status?: number }, pagination: PaginationParams) {
        const where: any = {};

        if (filter.nama) {
            where.OR = [
                {
                    name: {
                        contains: filter.nama,
                        mode: "insensitive"
                    }
                },
                {
                    namaLengkap: {
                        contains: filter.nama,
                        mode: "insensitive"
                    }
                }
            ];
        }

        if (filter.email) {
            where.email = {
                contains: filter.email,
                mode: "insensitive"
            };
        }

        if (typeof filter.roleId === 'number') {
            where.roleId = filter.roleId;
        }

        if (typeof filter.status === 'number') {
            where.status = filter.status;
        }

        return UserRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return UserRepo.findById(id);
    },

    async create(data: any) {
        // Convert string values to numbers for integer fields
        const processedData = { ...data };
        
        if (processedData.roleId && typeof processedData.roleId === 'string') {
            processedData.roleId = parseInt(processedData.roleId, 10);
        }
        
        if (processedData.kecamatanId && typeof processedData.kecamatanId === 'string') {
            processedData.kecamatanId = parseInt(processedData.kecamatanId, 10);
        }
        
        if (processedData.jenisAkun && typeof processedData.jenisAkun === 'string') {
            processedData.jenisAkun = parseInt(processedData.jenisAkun, 10);
        }
        
        if (processedData.status !== undefined && typeof processedData.status === 'string') {
            processedData.status = parseInt(processedData.status, 10);
        }
        
        return UserRepo.create(processedData);
    },

    async update(id: number, data: any) {
        // Convert string values to numbers for integer fields
        const processedData = { ...data };
        
        if (processedData.roleId && typeof processedData.roleId === 'string') {
            processedData.roleId = parseInt(processedData.roleId, 10);
        }
        
        if (processedData.kecamatanId && typeof processedData.kecamatanId === 'string') {
            processedData.kecamatanId = parseInt(processedData.kecamatanId, 10);
        }
        
        if (processedData.jenisAkun && typeof processedData.jenisAkun === 'string') {
            processedData.jenisAkun = parseInt(processedData.jenisAkun, 10);
        }
        
        if (processedData.status !== undefined && typeof processedData.status === 'string') {
            processedData.status = parseInt(processedData.status, 10);
        }
        
        return UserRepo.update(id, processedData);
    },

    async delete(id: number) {
        // Soft delete or hard delete based on your requirement
        return prisma.user.delete({
            where: { id }
        });
    },

    async getRoles() {
        return prisma.role.findMany({
            orderBy: { name: 'asc' }
        });
    },

    async getStats() {
        return UserRepo.getStats();
    },

    async updateStatus(id: number, status: number) {
        return UserRepo.updateStatus(id, status);
    },

    async resetPassword(id: number, newPassword: string) {
        return UserRepo.resetPassword(id, newPassword);
    }
};
