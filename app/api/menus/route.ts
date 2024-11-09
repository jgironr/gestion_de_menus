import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const menus = await prisma.menu.findMany({
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

    return NextResponse.json(menus);
  } catch (error) {
    console.error("Error al obtener menús:", error);
    return NextResponse.json(
      { error: "Error al obtener menús" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nuevoMenu = await prisma.menu.create({
      data: {
        nombre: data.nombre,
        costoTotal: data.costoTotal,
        gananciaTotal: data.gananciaTotal,
        productos: {
          create: data.productos.map((producto: any) => ({
            productoId: producto.id,
            cantidad: producto.cantidad,
          })),
        },

        complementos: {
          create: data.complementos.map((complemento: any) => ({
            nombre: complemento.nombre,
            productos: {
              create:
                complemento.productos?.map((producto: any) => ({
                  productoId: producto.id,
                  cantidad: producto.cantidad,
                })) || [],
            },
          })),
        },
      },
    });

    return NextResponse.json(nuevoMenu, { status: 201 });
  } catch (error) {
    console.error("Error al crear menú:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
