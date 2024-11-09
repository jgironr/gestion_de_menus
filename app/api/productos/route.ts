import { PrismaClient } from "@prisma/client";
import { NextResponse, NextRequest } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: NextRequest) {
  try {
    const productos = await prisma.producto.findMany();
    return NextResponse.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    return NextResponse.json(
      { error: "Error al obtener productos" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const data = await request.json();
    const nuevoProducto = await prisma.producto.create({ data });

    await prisma.historialProducto.create({
      data: {
        productoId: nuevoProducto.id,
        precioCostoNuevo: nuevoProducto.costo,
        precioPublicoNuevo: nuevoProducto.unidad,
        cambio: "Creación de producto",
        usuario: session.user.email || "Usuario desconocido",
        fechaCambio: new Date(),
      },
    });

    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error("Error al crear producto:", error);
    return NextResponse.json(
      { error: "Error al crear producto" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, ...data } = await request.json();

    const productoActual = await prisma.producto.findUnique({ where: { id } });
    if (!productoActual) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    const productoActualizado = await prisma.producto.update({
      where: { id },
      data,
    });

    await prisma.historialProducto.create({
      data: {
        productoId: id,
        precioCostoAnterior: productoActual.costo,
        precioCostoNuevo: productoActualizado.costo,
        precioPublicoAnterior: productoActual.unidad,
        precioPublicoNuevo: productoActualizado.unidad,
        cambio: "Actualización de producto",
        usuario: session.user.email || "Usuario desconocido",
        fechaCambio: new Date(),
      },
    });

    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    return NextResponse.json(
      { error: "Error al actualizar producto" },
      { status: 500 }
    );
  }
}

// DELETE: Eliminar un producto
export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id } = await request.json();

    const productoActual = await prisma.producto.findUnique({ where: { id } });
    if (!productoActual) {
      return NextResponse.json(
        { error: "Producto no encontrado" },
        { status: 404 }
      );
    }

    await prisma.producto.delete({ where: { id } });

    await prisma.historialProducto.create({
      data: {
        productoId: id,
        precioCostoAnterior: productoActual.costo,
        precioPublicoAnterior: productoActual.unidad,
        cambio: "Eliminación de producto",
        usuario: session.user.email || "Usuario desconocido",
        fechaCambio: new Date(),
      },
    });

    return NextResponse.json({ message: "Producto eliminado con éxito" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    return NextResponse.json(
      { error: "Error al eliminar producto" },
      { status: 500 }
    );
  }
}
