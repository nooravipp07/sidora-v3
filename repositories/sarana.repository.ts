import { prisma } from '@/lib/prisma';
import { AbstractRepository } from './abstract.repository';
import { Sarana } from '@/types/masterdata';

class SaranaRepository extends AbstractRepository<Sarana> {
    constructor() {
        super(prisma.sarana);
    }
}

export const SaranaRepo = new SaranaRepository();
