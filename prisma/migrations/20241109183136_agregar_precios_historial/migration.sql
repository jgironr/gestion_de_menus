/*
  Warnings:

  - You are about to drop the column `precioAnterior` on the `historialproducto` table. All the data in the column will be lost.
  - You are about to drop the column `precioNuevo` on the `historialproducto` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `historialproducto` DROP COLUMN `precioAnterior`,
    DROP COLUMN `precioNuevo`,
    ADD COLUMN `precioCostoAnterior` DOUBLE NULL,
    ADD COLUMN `precioCostoNuevo` DOUBLE NULL,
    ADD COLUMN `precioPublicoAnterior` DOUBLE NULL,
    ADD COLUMN `precioPublicoNuevo` DOUBLE NULL;
