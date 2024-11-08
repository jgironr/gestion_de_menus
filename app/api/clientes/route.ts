import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Obtener todos los clientes
export async function GET() {
  try {
    const clientes = await prisma.escuela.findMany();
    return NextResponse.json(clientes);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json({ error: 'Error al obtener clientes' }, { status: 500 });
  }
}

// POST: Crear un nuevo cliente
export async function POST(request: Request) {
  try {
    const data = await request.json(); // Esto debe ser un objeto con `nombre` y `direccion`
    
    // Asegúrate de que `data` tenga las propiedades que estás esperando
    if (!data.nombre || !data.direccion) {
      return NextResponse.json({ error: 'Nombre y dirección son requeridos' }, { status: 400 });
    }
    
    const nuevoCliente = await prisma.escuela.create({
      data: {
        nombre: data.nombre,
        direccion: data.direccion,
        userId: 1, // Asegúrate de establecer un valor para userId
        nameUser: 'Usuario Ejemplo', // También puedes ajustar esto según sea necesario
      },
    });

    return NextResponse.json(nuevoCliente, { status: 201 });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 });
  }
}
