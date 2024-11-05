import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.cliente.findMany();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
  }
}

// POST: Crear un nuevo cliente
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nuevoCliente = await prisma.cliente.create({
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
      },
    });

    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 });
  }
}