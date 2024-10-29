-- DropForeignKey
ALTER TABLE `complemento` DROP FOREIGN KEY `Complemento_menuId_fkey`;

-- DropForeignKey
ALTER TABLE `menuproducto` DROP FOREIGN KEY `MenuProducto_menuId_fkey`;

-- AddForeignKey
ALTER TABLE `MenuProducto` ADD CONSTRAINT `MenuProducto_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Complemento` ADD CONSTRAINT `Complemento_menuId_fkey` FOREIGN KEY (`menuId`) REFERENCES `Menu`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
