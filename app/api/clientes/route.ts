import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse, NextRequest } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Crear un cliente
export async function POST(request: NextRequest) {
  try {
    // Obtener la sesión y validar autenticación
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { nombre, direccion, telefono } = await request.json();

    // Validación de datos de entrada
    if (!nombre || !direccion || !telefono) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Crear el cliente en la base de datos
    const cliente = await prisma.cliente.create({
      data: {
        nombre,
        direccion,
        telefono,
        userEmail: session.user.email ? session.user.email : "",
        nameUser: session.user.name ? session.user.name : "",
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

// Obtener todos los clientes
export async function GET() {
  try {
    // Obtener lista de todos los clientes
    const clientes = await prisma.cliente.findMany({
      include: {
        dias: true, // Incluye días relacionados si existen en la base de datos
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

// Actualizar un cliente
// Actualizar un cliente
export async function PATCH(request: NextRequest) {
  try {
    // Obtener la sesión y validar autenticación
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    // Obtener los datos del cliente a partir del cuerpo de la solicitud
    const { id, nombre, direccion, telefono } = await request.json();

    // Validación de datos de entrada
    if (!id || !nombre || !direccion || !telefono) {
      return NextResponse.json(
        { error: "Todos los campos son obligatorios" },
        { status: 400 }
      );
    }

    // Actualizar el cliente en la base de datos
    const cliente = await prisma.cliente.update({
      where: { id },
      data: {
        nombre,
        direccion,
        telefono,
        userEmail: session.user.email || "",
        nameUser: session.user.name || "",
      },
    });

    // Retornar la respuesta con el cliente actualizado
    return NextResponse.json(cliente);
  } catch (error) {
    console.error("Error al actualizar el cliente:", error);
    return NextResponse.json(
      { error: "Error al actualizar el cliente" },
      { status: 500 }
    );
  }
}

// Eliminar un cliente
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();

    // Validación de datos de entrada
    if (!id) {
      return NextResponse.json(
        { error: "El id es obligatorio" },
        { status: 400 }
      );
    }

    // Eliminar el cliente de la base de datos
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
