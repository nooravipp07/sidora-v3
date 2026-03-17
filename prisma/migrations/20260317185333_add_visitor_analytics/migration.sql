-- CreateTable
CREATE TABLE `visitors` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `sessionId` VARCHAR(100) NOT NULL,
    `ipAddress` VARCHAR(50) NULL,
    `userAgent` TEXT NULL,
    `page` VARCHAR(255) NOT NULL,
    `referrer` VARCHAR(255) NULL,
    `visitedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `country` VARCHAR(100) NULL,
    `city` VARCHAR(100) NULL,
    `deviceType` VARCHAR(50) NULL,

    INDEX `visitors_sessionId_idx`(`sessionId`),
    INDEX `visitors_visitedAt_idx`(`visitedAt`),
    INDEX `visitors_page_idx`(`page`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
