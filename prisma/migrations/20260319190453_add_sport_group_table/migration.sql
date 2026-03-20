-- CreateTable
CREATE TABLE `sports_groups` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaKelurahanId` INTEGER NOT NULL,
    `groupName` VARCHAR(150) NOT NULL,
    `leaderName` VARCHAR(150) NULL,
    `memberCount` INTEGER NOT NULL DEFAULT 0,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `decreeNumber` VARCHAR(100) NULL,
    `secretariatAddress` VARCHAR(255) NULL,
    `year` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    INDEX `sports_groups_desaKelurahanId_idx`(`desaKelurahanId`),
    INDEX `sports_groups_year_idx`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `sports_groups` ADD CONSTRAINT `sports_groups_desaKelurahanId_fkey` FOREIGN KEY (`desaKelurahanId`) REFERENCES `m_desa_kelurahan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
