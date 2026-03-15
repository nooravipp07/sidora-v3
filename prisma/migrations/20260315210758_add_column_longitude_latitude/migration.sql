-- AlterTable
ALTER TABLE `m_kecamatan` ADD COLUMN `latitude` VARCHAR(191) NULL,
    ADD COLUMN `longitude` VARCHAR(191) NULL,
    MODIFY `nama` VARCHAR(191) NOT NULL;
