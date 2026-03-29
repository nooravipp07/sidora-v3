-- CreateTable
CREATE TABLE `equipment_staging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaKelurahanId` INTEGER NOT NULL,
    `saranaId` INTEGER NOT NULL,
    `quantity` INTEGER NOT NULL DEFAULT 0,
    `unit` VARCHAR(50) NULL,
    `isUsable` BOOLEAN NOT NULL DEFAULT true,
    `isGovernmentGrant` BOOLEAN NOT NULL DEFAULT false,
    `year` INTEGER NULL,
    `actionType` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `referenceId` INTEGER NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `submittedBy` VARCHAR(191) NOT NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `equipment_staging_status_idx`(`status`),
    INDEX `equipment_staging_desaKelurahanId_idx`(`desaKelurahanId`),
    INDEX `equipment_staging_year_idx`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facility_record_staging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaKelurahanId` INTEGER NOT NULL,
    `prasaranaId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `condition` VARCHAR(191) NULL,
    `ownershipStatus` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `actionType` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `referenceId` INTEGER NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `submittedBy` VARCHAR(191) NOT NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `facility_record_staging_status_idx`(`status`),
    INDEX `facility_record_staging_desaKelurahanId_idx`(`desaKelurahanId`),
    INDEX `facility_record_staging_year_idx`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facility_record_photo_staging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facilityRecordStagingId` INTEGER NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NULL,
    `fileSize` INTEGER NULL,
    `mimeType` VARCHAR(191) NULL,
    `photoType` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `takenAt` DATETIME(3) NULL,
    `uploadedBy` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `facility_record_photo_staging_facilityRecordStagingId_idx`(`facilityRecordStagingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `athlete_staging` (
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
    `statusAthlete` VARCHAR(191) NOT NULL DEFAULT 'aktif',
    `sportId` INTEGER NULL,
    `photoUrl` VARCHAR(191) NULL,
    `actionType` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `referenceId` INTEGER NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `submittedBy` VARCHAR(191) NOT NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `athlete_staging_status_idx`(`status`),
    INDEX `athlete_staging_desaKelurahanId_idx`(`desaKelurahanId`),
    INDEX `athlete_staging_sportId_idx`(`sportId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `athlete_achievement_staging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `athleteStagingId` INTEGER NOT NULL,
    `achievementName` VARCHAR(191) NOT NULL,
    `category` VARCHAR(191) NULL,
    `medal` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `athlete_achievement_staging_athleteStagingId_idx`(`athleteStagingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `sports_group_staging` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaKelurahanId` INTEGER NOT NULL,
    `groupName` VARCHAR(191) NOT NULL,
    `leaderName` VARCHAR(191) NULL,
    `memberCount` INTEGER NOT NULL DEFAULT 0,
    `isVerified` BOOLEAN NOT NULL DEFAULT false,
    `decreeNumber` VARCHAR(191) NULL,
    `secretariatAddress` VARCHAR(191) NULL,
    `year` INTEGER NULL,
    `actionType` ENUM('CREATE', 'UPDATE', 'DELETE') NOT NULL,
    `referenceId` INTEGER NULL,
    `status` ENUM('PENDING', 'APPROVED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
    `submittedBy` VARCHAR(191) NOT NULL,
    `reviewedBy` VARCHAR(191) NULL,
    `reviewedAt` DATETIME(3) NULL,
    `rejectionReason` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    INDEX `sports_group_staging_status_idx`(`status`),
    INDEX `sports_group_staging_desaKelurahanId_idx`(`desaKelurahanId`),
    INDEX `sports_group_staging_year_idx`(`year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `staging_logs` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `entityType` VARCHAR(191) NOT NULL,
    `stagingId` INTEGER NOT NULL,
    `action` VARCHAR(191) NOT NULL,
    `actor` VARCHAR(191) NOT NULL,
    `note` VARCHAR(191) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `staging_logs_entityType_stagingId_idx`(`entityType`, `stagingId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `equipment_staging` ADD CONSTRAINT `equipment_staging_desaKelurahanId_fkey` FOREIGN KEY (`desaKelurahanId`) REFERENCES `m_desa_kelurahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `equipment_staging` ADD CONSTRAINT `equipment_staging_saranaId_fkey` FOREIGN KEY (`saranaId`) REFERENCES `m_sarana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facility_record_staging` ADD CONSTRAINT `facility_record_staging_desaKelurahanId_fkey` FOREIGN KEY (`desaKelurahanId`) REFERENCES `m_desa_kelurahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facility_record_staging` ADD CONSTRAINT `facility_record_staging_prasaranaId_fkey` FOREIGN KEY (`prasaranaId`) REFERENCES `m_prasarana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facility_record_photo_staging` ADD CONSTRAINT `facility_record_photo_staging_facilityRecordStagingId_fkey` FOREIGN KEY (`facilityRecordStagingId`) REFERENCES `facility_record_staging`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athlete_staging` ADD CONSTRAINT `athlete_staging_desaKelurahanId_fkey` FOREIGN KEY (`desaKelurahanId`) REFERENCES `m_desa_kelurahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athlete_staging` ADD CONSTRAINT `athlete_staging_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `m_cabang_olahraga`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `athlete_achievement_staging` ADD CONSTRAINT `athlete_achievement_staging_athleteStagingId_fkey` FOREIGN KEY (`athleteStagingId`) REFERENCES `athlete_staging`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sports_group_staging` ADD CONSTRAINT `sports_group_staging_desaKelurahanId_fkey` FOREIGN KEY (`desaKelurahanId`) REFERENCES `m_desa_kelurahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
