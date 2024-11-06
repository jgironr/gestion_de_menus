/*
  Warnings:

  - You are about to drop the column `clienteId` on the `escuela` table. All the data in the column will be lost.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `nameUser` to the `Escuela` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Escuela` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `escuela` DROP FOREIGN KEY `Escuela_clienteId_fkey`;

-- AlterTable
ALTER TABLE `escuela` DROP COLUMN `clienteId`,
    ADD COLUMN `nameUser` VARCHAR(191) NOT NULL,
    ADD COLUMN `userId` INTEGER NOT NULL;

-- DropTable
DROP TABLE `cliente`;
