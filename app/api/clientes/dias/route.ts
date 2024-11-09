import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";

const prisma = new PrismaClient();
export async function POST(request: NextRequest) {
  const { diaId, menuId } = await request.json();
  const dia = await prisma.dia.update({
    where: { id: diaId },
    data: {
      menus: {
        connect: { id: menuId },
      },
    },
  });
  return NextResponse.json(dia);
}

// Eliminar un menú de un día
export async function DELETE(request: NextRequest) {
  const { diaId, menuId } = await request.json();
  const dia = await prisma.dia.update({
    where: { id: diaId },
    data: {
      menus: {
        disconnect: { id: menuId },
      },
    },
  });
  return NextResponse.json(dia);
}
