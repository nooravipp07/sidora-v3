import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { Kecamatan } from '@/types/masterdata';

class KecamatanRepository extends AbstractRepository<Kecamatan> {
    constructor() {
        super(prisma.kecamatan);
    }
}

export const KecamatanRepo = new KecamatanRepository();