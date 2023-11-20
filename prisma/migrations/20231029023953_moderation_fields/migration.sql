-- AlterTable
ALTER TABLE `Company` ADD COLUMN `declineReason` VARCHAR(255) NULL,
    ADD COLUMN `isDeclined` BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE `Initiative` ADD COLUMN `declineReason` VARCHAR(255) NULL,
    ADD COLUMN `isDeclined` BOOLEAN NOT NULL DEFAULT false;
