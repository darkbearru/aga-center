/*
  Warnings:

  - Made the column `nameShort` on table `TypeOwnership` required. This step will fail if there are existing NULL values in that column.
  - Made the column `nameFull` on table `TypeOwnership` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `TypeOwnership` MODIFY `nameShort` VARCHAR(20) NOT NULL,
    MODIFY `nameFull` VARCHAR(100) NOT NULL;
