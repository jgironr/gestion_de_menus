-- CreateTable
CREATE TABLE `Factura` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cantidadIngredientes` INTEGER NOT NULL,
    `costoTotalCompra` DOUBLE NOT NULL,
    `costoTotalVenta` DOUBLE NOT NULL,
    `gananciaTotal` DOUBLE NOT NULL,
    `escuela` VARCHAR(191) NOT NULL,
    `escuelaId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
