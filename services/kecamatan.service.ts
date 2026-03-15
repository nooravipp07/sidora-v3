import { PaginationParams } from "@/repositories/abstract.repository";
import { KecamatanRepo } from "@/repositories/kecamatan.repository";

export const KecamatanService = {
    async getAll(filter: { nama: any; }, pagination: PaginationParams) {

        const where = {
        deletedAt: null,
        ...(filter.nama && {
            nama: {
            contains: filter.nama,
            mode: "insensitive"
            }
        })
        }

        return KecamatanRepo.findAll(where, pagination)
    },

    async getById(id: number) {
        return KecamatanRepo.findById(id)
    },

    async create(data: any) {
        return KecamatanRepo.create(data)
    },

    async update(id: number, data: any) {
        return KecamatanRepo.update(id, data)
    },

    async delete(id: number) {
        return KecamatanRepo.softDelete(id)
    }
};