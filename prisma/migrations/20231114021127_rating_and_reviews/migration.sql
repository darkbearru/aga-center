/*
  Warnings:

  - You are about to drop the column `changedAt` on the `Reviews` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Reviews` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Company` ADD COLUMN `rating` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Initiative` ADD COLUMN `rating` INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE `Reviews` DROP COLUMN `changedAt`,
    DROP COLUMN `title`;
