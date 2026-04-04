-- AlterTable
ALTER TABLE `sports_group_staging` ADD COLUMN `sportId` INTEGER NULL;

-- AlterTable
ALTER TABLE `sports_groups` ADD COLUMN `sportId` INTEGER NULL;

-- CreateIndex
CREATE INDEX `sports_group_staging_sportId_idx` ON `sports_group_staging`(`sportId`);

-- CreateIndex
CREATE INDEX `sports_groups_sportId_idx` ON `sports_groups`(`sportId`);

-- AddForeignKey
ALTER TABLE `sports_groups` ADD CONSTRAINT `sports_groups_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `m_cabang_olahraga`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `sports_group_staging` ADD CONSTRAINT `sports_group_staging_sportId_fkey` FOREIGN KEY (`sportId`) REFERENCES `m_cabang_olahraga`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
