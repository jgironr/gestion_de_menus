import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// GET: Obtener productos
export async function GET() {
  try {
    const productos = await prisma.producto.findMany();
    return NextResponse.json(productos);
  } catch (error) {
    return NextResponse.json({ error: 'Error al obtener productos' }, { status: 500 });
  }
}

// POST: Crear un producto
export async function POST(request: Request) {
  try {
    const data = await request.json();
    const nuevoProducto = await prisma.producto.create({ data });
    return NextResponse.json(nuevoProducto, { status: 201 });
  } catch (error) {
    console.error('Error al crear producto:', error);
    return NextResponse.json({ error: 'Error al crear producto' }, { status: 500 });
  }
}

// PUT: Actualizar un producto
export async function PUT(request: Request) {
  try {
    const { id, ...data } = await request.json();
    const productoActualizado = await prisma.producto.update({
      where: { id },
      data,
    });
    return NextResponse.json(productoActualizado);
  } catch (error) {
    console.error('Error al actualizar producto:', error);
    return NextResponse.json({ error: 'Error al actualizar producto' }, { status: 500 });
  }
}

// DELETE: Eliminar un producto
export async function DELETE(request: Request) {
  try {
    const { id } = await request.json();
    await prisma.producto.delete({ where: { id } });
    return NextResponse.json({ message: 'Producto eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar producto:', error);
    return NextResponse.json({ error: 'Error al eliminar producto' }, { status: 500 });
  }
}
