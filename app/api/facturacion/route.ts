import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Obtener facturas
export async function GET() {
  try {
    const facturas = await prisma.factura.findMany({
      include: {
        escuela: true, // Incluye la relación con escuela
        menus: {
          include: {
            productos: {
              include: {
                producto: true, // Relación con productos del menú
              },
            },
            complementos: {
              include: {
                productos: {
                  include: {
                    producto: true, // Relación con productos de los complementos
                  },
                },
              },
            },
          },
        },
      },
    });

    const datosFacturacion = facturas.map((factura) => {
      let totalCompra = 0;
      let totalVenta = 0;

      factura.menus.forEach((menu) => {
        // Calcular el costo de los productos
        const costoProductos = menu.productos?.reduce((total, p) => total + (p.producto?.costo * p.cantidad), 0) || 0;
        // Calcular el costo de los complementos
        const costoComplementos = menu.complementos?.reduce((totalComp, complemento) => 
          totalComp + complemento.productos?.reduce((totalP, p) => totalP + (p.producto?.costo * p.cantidad), 0) || 0, 0) || 0;

        totalCompra += costoProductos + costoComplementos;

        // Calcular el total de la venta de los productos
        const ventaProductos = menu.productos?.reduce((total, p) => total + (p.producto?.unidad * p.cantidad), 0) || 0;
        // Calcular el total de la venta de los complementos
        const ventaComplementos = menu.complementos?.reduce((totalComp, complemento) => 
          totalComp + complemento.productos?.reduce((totalP, p) => totalP + (p.producto?.unidad * p.cantidad), 0) || 0, 0) || 0;

        totalVenta += ventaProductos + ventaComplementos;
      });

      const gananciaTotal = totalVenta - totalCompra;

      return {
        id: factura.id,
        nombreEscuela: factura.escuela.nombre,
        cantidadIngredientes: factura.menus.reduce((total, menu) => total + (menu.productos.length || 0) + (menu.complementos.length || 0), 0),
        costoTotal: { compra: totalCompra, venta: totalVenta },
        gananciaTotal,
      };
    });

    return NextResponse.json(datosFacturacion);
  } catch (error) {
    console.error('Error al obtener facturación:', error);
    return NextResponse.json({ error: 'Error al obtener facturación' }, { status: 500 });
  }
}