/*
  Warnings:

  - Added the required column `code` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Order` ADD COLUMN `code` VARCHAR(50) NOT NULL;
