-- AlterTable
ALTER TABLE `facility_record_staging` ADD COLUMN `kapasitasPenonton` INTEGER NULL,
    ADD COLUMN `luasBangunan` VARCHAR(100) NULL,
    ADD COLUMN `luasTanah` VARCHAR(100) NULL;

-- AlterTable
ALTER TABLE `sports_group_staging` MODIFY `isVerified` TINYINT NOT NULL DEFAULT 0;
