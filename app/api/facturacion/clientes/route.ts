import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const clientes = await prisma.cliente.findMany({
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

    const clientesConCalculos = clientes.map((cliente) => {
      let costoTotal = 0;
      let precioVentaTotal = 0;

      cliente.dias.forEach((dia) => {
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

      return {
        id: cliente.id,
        nombre: cliente.nombre,
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        costoTotal,
        precioVentaTotal,
        gananciaTotal,
      };
    });

    return NextResponse.json(clientesConCalculos);
  } catch (error) {
    console.error("Error al obtener datos de facturación:", error);
    return NextResponse.json(
      { error: "Error al obtener datos de facturación" },
      { status: 500 }
    );
  }
}
