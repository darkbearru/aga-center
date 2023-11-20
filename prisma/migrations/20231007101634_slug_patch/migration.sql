/*
  Warnings:

  - You are about to alter the column `slug` on the `News` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(50)`.
  - A unique constraint covering the columns `[slug]` on the table `News` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[slug]` on the table `Regions` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE `News` MODIFY `title` VARCHAR(255) NOT NULL,
    MODIFY `slug` VARCHAR(50) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `News_slug_key` ON `News`(`slug`);

-- CreateIndex
CREATE UNIQUE INDEX `Regions_slug_key` ON `Regions`(`slug`);
