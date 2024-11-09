import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clienteId = parseInt(params.id);

    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        dias: {
          include: {
            menus: {
              include: {
                productos: {
                  include: {
                    producto: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!cliente) {
      return NextResponse.json(
        { error: "Cliente no encontrado" },
        { status: 404 }
      );
    }

    let costoTotal = 0;
    let precioVentaTotal = 0;

    const diasConMenus = cliente.dias.filter((dia) => dia.menus.length > 0);

    diasConMenus.forEach((dia) => {
      dia.menus.forEach((menu) => {
        menu.productos.forEach((menuProducto) => {
          const costoProducto =
            menuProducto.producto.costo * menuProducto.cantidad;
          const precioVentaProducto =
            menuProducto.producto.unidad * menuProducto.cantidad;

          costoTotal += costoProducto;
          precioVentaTotal += precioVentaProducto;
        });
      });
    });

    const gananciaTotal = precioVentaTotal - costoTotal;

    return NextResponse.json({
      dias: diasConMenus,
      costoTotal,
      precioVentaTotal,
      gananciaTotal,
    });
  } catch (error) {
    console.error("Error al obtener detalle de factura:", error);
    return NextResponse.json(
      { error: "Error al obtener detalle de factura" },
      { status: 500 }
    );
  }
}
