import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, direccion, telefono } = await request.json();

    if (!nombre || !direccion || !telefono) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const daysOfWeek = [
      "Lunes",
      "Martes",
      "Miércoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ];

    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        direccion,
        telefono,
        userEmail: session.user.email || "",
        nameUser: session.user.name || "",
        dias: {
          create: daysOfWeek.map((dia) => ({ dia })),
        },
      },
      include: {
        dias: {
          include: {
            menus: true,
          },
        },
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Error al crear el cliente:", error);
    return NextResponse.json(
      { error: "Error al crear el cliente" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const clientes = await prisma.cliente.findMany({
      include: {
        dias: {
          include: {
            menus: true,
          },
        },
      },
    });
    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Error al obtener los clientes:", error);
    return NextResponse.json(
      { error: "Error al obtener los clientes" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { id, nombre, direccion, telefono } = await request.json();

    if (!id || !nombre || !direccion || !telefono) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nombre,
        direccion,
        telefono,
        userEmail: session.user.email || "",
        nameUser: session.user.name || "",
      },
      include: {
        dias: {
          include: {
            menus: true,
          },
        },
      },
    });

    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    return NextResponse.json(
      { error: "Error al actualizar el cliente" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "El id es obligatorio" },
        { status: 400 }
      );
    }

    await prisma.cliente.delete({
      where: { id },
    });
    return NextResponse.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error al eliminar el cliente:", error);
    return NextResponse.json(
      { error: "Error al eliminar el cliente" },
      { status: 500 }
    );
  }
}
