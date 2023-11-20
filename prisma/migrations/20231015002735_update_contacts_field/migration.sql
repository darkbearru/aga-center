/*
  Warnings:

  - Made the column `nameFull` on table `Company` required. This step will fail if there are existing NULL values in that column.
  - Made the column `requsites` on table `Company` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Company` MODIFY `nameFull` VARCHAR(255) NOT NULL,
    MODIFY `requsites` TEXT NOT NULL;

-- AlterTable
ALTER TABLE `Contacts` MODIFY `type` VARCHAR(191) NOT NULL;
