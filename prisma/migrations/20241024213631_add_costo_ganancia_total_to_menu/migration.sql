/*
  Warnings:

  - Added the required column `costoTotal` to the `Menu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gananciaTotal` to the `Menu` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menu` ADD COLUMN `costoTotal` DOUBLE NOT NULL,
    ADD COLUMN `gananciaTotal` DOUBLE NOT NULL;
