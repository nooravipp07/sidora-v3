/*
  Warnings:

  - Added the required column `docUrl` to the `registrations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `registrations` ADD COLUMN `docUrl` VARCHAR(191) NOT NULL;
