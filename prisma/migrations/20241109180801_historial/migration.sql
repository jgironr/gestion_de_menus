-- CreateTable
CREATE TABLE `HistorialProducto` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `productoId` INTEGER NOT NULL,
    `precioAnterior` DOUBLE NULL,
    `precioNuevo` DOUBLE NULL,
    `cambio` VARCHAR(191) NOT NULL,
    `usuario` VARCHAR(191) NOT NULL,
    `fechaCambio` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `HistorialProducto` ADD CONSTRAINT `HistorialProducto_productoId_fkey` FOREIGN KEY (`productoId`) REFERENCES `Producto`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
