import { RegistrationRepo } from '@/repositories/registration.repository';
import { hashPassword } from '@/lib/auth/bcrypt';
import { prisma } from '@/lib/prisma';
import { writeFile } from 'fs/promises';
import path from 'path';

export const RegistrationService = {
    async register(formData: FormData) {
        const data: any = {};
        let docUrl = '';

        for (const [key, value] of formData.entries()) {
            if (key === 'dokumenSK' && value instanceof File) {
                const buffer = Buffer.from(await value.arrayBuffer());
                const fileName = `sk_${Date.now()}.pdf`;

                const filePath = path.join(
                    process.cwd(),
                    'public/uploads/docs',
                    fileName
                );

                await writeFile(filePath, buffer);

                docUrl = `/uploads/docs/${fileName}`;
            } else {
                data[key] = value;
            }
        }

        // VALIDATION (minimal)
        if (!data.email || !data.password) {
        throw new Error('Email dan password wajib');
        }

        // HASH PASSWORD
        const hashedPassword = await hashPassword(data.password);

        return RegistrationRepo.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
            nip: data.nip,
            namaLengkap: data.namaLengkap,
            noTelepon: data.noTelepon,
            jenisAkun: 1,
            kecamatanId: Number(data.kecamatanId),
            status: Number(1), // PENDING
            verifiedBy: 0,
            docUrl,
        });
    },

    async getAll(filter: { status?: number; search?: string } = {}, pagination: { page?: number; limit?: number } = {}) {
        const where: any = {};

        if (filter.status) {
            where.status = filter.status;
        }

        if (filter.search) {
            where.OR = [
                { name: { contains: filter.search } },
                { email: { contains: filter.search } },
                { namaLengkap: { contains: filter.search } },
                { nip: { contains: filter.search } },
            ];
        }

        return RegistrationRepo.findAll(where, pagination);
    },

    async getById(id: number) {
        return RegistrationRepo.findById(id);
    },

    async approve(id: number, verifiedBy: number) {
        return RegistrationRepo.update(id, {
            status: 2, // APPROVE
            verifiedBy,
            verifiedAt: new Date(),
        });
    },

    async approveAndCreateUser(id: number, verifiedBy: number) {
        // Get registration data
        const registration = await RegistrationRepo.findById(id);
        if (!registration) {
            throw new Error('Pendaftaran tidak ditemukan');
        }

        // Create user from registration data
        const user = await prisma.user.create({
            data: {
                name: registration.name,
                email: registration.email,
                password: registration.password,
                namaLengkap: registration.namaLengkap,
                noTelepon: registration.noTelepon,
                kecamatanId: registration.kecamatanId,
                status: 1, // Active
                jenisAkun: registration.jenisAkun,
            },
        });

        // Update registration status
        const updated = await RegistrationRepo.update(id, {
            status: 2, // APPROVE
            verifiedBy,
            verifiedAt: new Date(),
        });

        return updated;
    },

    async reject(id: number, verifiedBy: number, rejectReason: string) {
        return RegistrationRepo.update(id, {
            status: 3, // REJECT
            verifiedBy,
            verifiedAt: new Date(),
            rejectReason,
        });
    },
};
