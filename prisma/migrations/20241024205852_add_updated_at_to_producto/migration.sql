/*
  Warnings:

  - You are about to drop the `productocomplemento` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `productomenu` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Complemento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Producto` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `productocomplemento` DROP FOREIGN KEY `ProductoComplemento_complementoId_fkey`;

-- DropForeignKey
ALTER TABLE `productocomplemento` DROP FOREIGN KEY `ProductoComplemento_productoId_fkey`;

-- DropForeignKey
ALTER TABLE `productomenu` DROP FOREIGN KEY `ProductoMenu_menuId_fkey`;

-- DropForeignKey
ALTER TABLE `productomenu` DROP FOREIGN KEY `ProductoMenu_productoId_fkey`;

-- AlterTable
ALTER TABLE `complemento` ADD COLUMN `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `producto` ADD COLUMN `updatedAt` DATETIME(3) NOT NULL;

-- DropTable
DROP TABLE `productocomplemento`;

-- DropTable
DROP TABLE `productomenu`;

-- CreateTable
CREATE TABLE `MenuProducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `menuId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ComplementoProducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `complementoId` INTEGER NOT NULL,
    `productoId` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MenuProducto` ADD CONSTRAINT `MenuProducto_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `MenuProducto` ADD CONSTRAINT `MenuProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComplementoProducto` ADD CONSTRAINT `ComplementoProducto_complementoId_fkey` FOREIGN KEY (`complementoId`) REFERENCES `Complemento`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `ComplementoProducto` ADD CONSTRAINT `ComplementoProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
