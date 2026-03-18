-- CreateTable
CREATE TABLE `facility_record` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `desaKelurahanId` INTEGER NOT NULL,
    `prasaranaId` INTEGER NOT NULL,
    `year` INTEGER NOT NULL,
    `condition` VARCHAR(191) NULL,
    `ownershipStatus` VARCHAR(191) NULL,
    `address` VARCHAR(191) NULL,
    `notes` VARCHAR(191) NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,
    `createdBy` VARCHAR(191) NULL,
    `updatedBy` VARCHAR(191) NULL,

    INDEX `facility_record_year_idx`(`year`),
    INDEX `facility_record_prasaranaId_idx`(`prasaranaId`),
    UNIQUE INDEX `facility_record_prasaranaId_year_key`(`prasaranaId`, `year`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `facility_record_photo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `facilityRecordId` INTEGER NOT NULL,
    `fileUrl` VARCHAR(191) NOT NULL,
    `fileName` VARCHAR(191) NULL,
    `fileSize` INTEGER NULL,
    `mimeType` VARCHAR(191) NULL,
    `photoType` VARCHAR(191) NULL,
    `description` VARCHAR(191) NULL,
    `takenAt` DATETIME(3) NULL,
    `uploadedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `uploadedBy` VARCHAR(191) NULL,
    `isPrimary` BOOLEAN NOT NULL DEFAULT false,
    `latitude` DOUBLE NULL,
    `longitude` DOUBLE NULL,

    INDEX `facility_record_photo_facilityRecordId_idx`(`facilityRecordId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `facility_record` ADD CONSTRAINT `facility_record_prasaranaId_fkey` FOREIGN KEY (`prasaranaId`) REFERENCES `m_prasarana`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facility_record` ADD CONSTRAINT `facility_record_desaKelurahanId_fkey` FOREIGN KEY (`desaKelurahanId`) REFERENCES `m_desa_kelurahan`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `facility_record_photo` ADD CONSTRAINT `facility_record_photo_facilityRecordId_fkey` FOREIGN KEY (`facilityRecordId`) REFERENCES `facility_record`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
