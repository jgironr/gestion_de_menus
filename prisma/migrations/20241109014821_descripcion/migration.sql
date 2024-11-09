/*
  Warnings:

  - You are about to drop the column `userId` on the `cliente` table. All the data in the column will be lost.
  - Added the required column `userEmail` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cliente` DROP COLUMN `userId`,
    ADD COLUMN `userEmail` VARCHAR(191) NOT NULL;
