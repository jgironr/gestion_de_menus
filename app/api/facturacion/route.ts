import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Obtener facturas con datos relacionados
export async function GET() {
  try {
    // Primero, obtenemos todas las facturas
    const facturas = await prisma.factura.findMany();

    // Para cada factura, obtenemos los menús y productos asociados
    const datosFacturacion = await Promise.all(
      facturas.map(async (factura) => {
        const menus = await prisma.menu.findMany({
          where: { id: factura.id }, // Ajusta si tienes un campo específico que conecta `Factura` con `Menu`
          include: {
            productos: {
              include: {
                producto: true,
              },
            },
            complementos: {
              include: {
                productos: {
                  include: {
                    producto: true,
                  },
                },
              },
            },
          },
        });

        const totalCompra = menus.reduce((total, menu) => {
          const costoProductos = menu.productos.reduce((total, p) => total + p.producto.costo * p.cantidad, 0);
          const costoComplementos = menu.complementos.reduce((totalComp, complemento) =>
            totalComp + complemento.productos.reduce((totalP, p) => totalP + p.producto.costo * p.cantidad, 0), 0);
          return total + costoProductos + costoComplementos;
        }, 0);

        const totalVenta = menus.reduce((total, menu) => {
          const ventaProductos = menu.productos.reduce((total, p) => total + p.producto.unidad * p.cantidad, 0);
          const ventaComplementos = menu.complementos.reduce((totalComp, complemento) =>
            totalComp + complemento.productos.reduce((totalP, p) => totalP + p.producto.unidad * p.cantidad, 0), 0);
          return total + ventaProductos + ventaComplementos;
        }, 0);

        const gananciaTotal = totalVenta - totalCompra;

        return {
          id: factura.id,
          nombreEscuela: factura.escuela,
          cantidadIngredientes: menus.reduce((total, menu) => total + menu.productos.length + menu.complementos.length, 0),
          costoTotal: { compra: totalCompra, venta: totalVenta },
          gananciaTotal,
        };
      })
    );

    return NextResponse.json(datosFacturacion);
  } catch (error) {
    console.error('Error al obtener facturación:', error);
    return NextResponse.json({ error: 'Error al obtener facturación' }, { status: 500 });
  }
}
