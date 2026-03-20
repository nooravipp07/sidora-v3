-- CreateTable
CREATE TABLE `athletes` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nationalId` VARCHAR(20) NOT NULL,
    `fullName` VARCHAR(150) NOT NULL,
    `birthPlace` VARCHAR(100) NULL,
    `birthDate` DATETIME(3) NULL,
    `gender` VARCHAR(10) NULL,
    `desaKelurahanId` INTEGER NOT NULL,
    `fullAddress` VARCHAR(191) NULL,
    `organization` VARCHAR(150) NULL,
    `category` VARCHAR(100) NULL,
    `sportId` INTEGER NULL,
    `photoUrl` VARCHAR(255) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `deletedAt` DATETIME(3) NULL,

    UNIQUE INDEX `athletes_nationalId_key`(`nationalId`),
    INDEX `athletes_desaKelurahanId_idx`(`desaKelurahanId`),
    INDEX `athletes_sportId_idx`(`sportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `athlete_achievements` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `athleteId` INTEGER NOT NULL,
    `achievementName` VARCHAR(150) NOT NULL,
    `category` VARCHAR(100) NULL,
    `medal` VARCHAR(20) NULL,
    `year` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `athlete_achievements_athleteId_idx`(`athleteId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `athletes` ADD CONSTRAINT `athletes_desaKelurahanId_fkey` FOREIGN KEY (`desaKelurahanId`) REFERENCES `m_desa_kelurahan`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athletes` ADD CONSTRAINT `athletes_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `m_cabang_olahraga`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athlete_achievements` ADD CONSTRAINT `athlete_achievements_athleteId_fkey` FOREIGN KEY (`athleteId`) REFERENCES `athletes`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
