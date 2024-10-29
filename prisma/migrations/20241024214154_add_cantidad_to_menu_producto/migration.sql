/*
  Warnings:

  - Added the required column `cantidad` to the `MenuProducto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `menuproducto` ADD COLUMN `cantidad` INTEGER NOT NULL;
