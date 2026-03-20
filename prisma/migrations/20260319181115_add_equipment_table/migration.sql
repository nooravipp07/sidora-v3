-- CreateTable
CREATE TABLE `equipments` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaKelurahanId` INTEGER NOT NULL,
    `saranaId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `unit` VARCHAR(50) NULL,
    `isUsable` BOOLEAN NOT NULL DEFAULT true,
    `isGovernmentGrant` BOOLEAN NOT NULL DEFAULT false,
    `year` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `equipments_desaKelurahanId_idx`(`desaKelurahanId`),
    INDEX `equipments_saranaId_idx`(`saranaId`),
    INDEX `equipments_year_idx`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipments` ADD CONSTRAINT `equipments_desaKelurahanId_fkey` FOREIGN KEY (`desaKelurahanId`) REFERENCES `m_desa_kelurahan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipments` ADD CONSTRAINT `equipments_saranaId_fkey` FOREIGN KEY (`saranaId`) REFERENCES `m_sarana`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
