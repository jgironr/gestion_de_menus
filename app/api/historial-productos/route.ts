import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const historial = await prisma.historialProducto.findMany({
      include: {
        producto: true,
      },
      orderBy: {
        fechaCambio: "desc",
      },
    });
    return NextResponse.json(historial);
  } catch (error) {
    console.error("Error al obtener el historial de productos:", error);
    return NextResponse.json(
      { error: "Error al obtener el historial de productos" },
      { status: 500 }
    );
  }
}
