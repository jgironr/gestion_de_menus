/*
  Warnings:

  - Added the required column `telefono` to the `Cliente` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `cliente` ADD COLUMN `telefono` VARCHAR(191) NOT NULL;

-- CreateTable
CREATE TABLE `Dia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `dia` VARCHAR(191) NOT NULL,
    `clienteId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_DiaMenu` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_DiaMenu_AB_unique`(`A`, `B`),
    INDEX `_DiaMenu_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Dia` ADD CONSTRAINT `Dia_clienteId_fkey` FOREIGN KEY (`clienteId`) REFERENCES `Cliente`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiaMenu` ADD CONSTRAINT `_DiaMenu_A_fkey` FOREIGN KEY (`A`) REFERENCES `Dia`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_DiaMenu` ADD CONSTRAINT `_DiaMenu_B_fkey` FOREIGN KEY (`B`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
