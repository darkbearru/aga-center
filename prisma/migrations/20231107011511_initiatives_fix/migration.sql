/*
  Warnings:

  - Made the column `name` on table `Initiative` required. This step will fail if there are existing NULL values in that column.
  - Made the column `text` on table `Initiative` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Initiative` MODIFY `name` VARCHAR(255) NOT NULL,
    MODIFY `text` TEXT NOT NULL;
