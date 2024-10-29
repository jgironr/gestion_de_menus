/*
  Warnings:

  - Added the required column `cantidad` to the `ComplementoProducto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `complementoproducto` ADD COLUMN `cantidad` INTEGER NOT NULL;
