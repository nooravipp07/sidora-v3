/*
  Warnings:

  - You are about to alter the column `userId` on the `m_login_history` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - You are about to alter the column `userId` on the `m_refresh_tokens` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.
  - The primary key for the `m_users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `m_users` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Int`.

*/
-- DropForeignKey
ALTER TABLE `m_login_history` DROP FOREIGN KEY `m_login_history_userId_fkey`;

-- DropForeignKey
ALTER TABLE `m_refresh_tokens` DROP FOREIGN KEY `m_refresh_tokens_userId_fkey`;

-- AlterTable
ALTER TABLE `m_login_history` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `m_refresh_tokens` MODIFY `userId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `m_users` DROP PRIMARY KEY,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    ADD PRIMARY KEY (`id`);

-- AddForeignKey
ALTER TABLE `m_refresh_tokens` ADD CONSTRAINT `m_refresh_tokens_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `m_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `m_login_history` ADD CONSTRAINT `m_login_history_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `m_users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
