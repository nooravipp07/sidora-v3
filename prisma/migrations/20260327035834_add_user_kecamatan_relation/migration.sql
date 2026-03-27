-- AddForeignKey
ALTER TABLE `m_users` ADD CONSTRAINT `m_users_kecamatanId_fkey` FOREIGN KEY (`kecamatanId`) REFERENCES `m_kecamatan`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
