import { RegistrationRepo } from '@/repositories/registration.repository';
import { hashPassword } from '@/lib/auth/bcrypt';
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
};
