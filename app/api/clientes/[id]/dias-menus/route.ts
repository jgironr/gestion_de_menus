import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const clienteId = parseInt(params.id);

    const { diasConMenus } = await request.json();

    for (const diaMenu of diasConMenus) {
      const diaId = diaMenu.diaId;
      const menuId = diaMenu.menuId;

      if (menuId) {
        // Conectar el menú al día
        await prisma.dia.update({
          where: { id: diaId },
          data: {
            menus: {
              set: [{ id: menuId }],
            },
          },
        });
      } else {
        await prisma.dia.update({
          where: { id: diaId },
          data: {
            menus: {
              set: [],
            },
          },
        });
      }
    }

    const updatedCliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
      include: {
        dias: {
          include: {
            menus: true,
          },
        },
      },
    });

    return NextResponse.json(updatedCliente);
  } catch (error) {
    console.error("Error al asignar los menús:", error);
    return NextResponse.json(
      { error: "Error al asignar los menús" },
      { status: 500 }
    );
  }
}
