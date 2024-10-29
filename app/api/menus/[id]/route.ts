import { PrismaClient, MenuProducto, Complemento } from '@prisma/client';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

// DELETE: Eliminar un menú por ID
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuId = Number(params.id);
    if (isNaN(menuId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    await prisma.complementoProducto.deleteMany({
        where: {
            complemento: {
                menuId: menuId
            }
        }
    });

    await prisma.menuProducto.deleteMany({
        where: {menuId: menuId}
    });

    await prisma.complemento.deleteMany({
        where:{menuId: menuId}
    });

    await prisma.menu.delete({
      where: { id: menuId },
    });

    return NextResponse.json({ message: 'Menú eliminado con éxito' });
  } catch (error) {
    console.error('Error al eliminar menú:', error);
    return NextResponse.json({ error:  error}, { status: 500 });
  }
}

// GET: Obtener un menú por ID
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuId = Number(params.id);
    const menu = await prisma.menu.findUnique({
      where: { id: menuId },
    });

    if (!menu) {
      return NextResponse.json({ error: 'Menú no encontrado' }, { status: 404 });
    }

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error al obtener el menú:', error);
    return NextResponse.json({ error: 'Error al obtener el menú' }, { status: 500 });
  }
}

// PUT: Actualizar un menú por ID
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const menuId = Number(params.id);
    const data = await request.json();

    if (isNaN(menuId)) {
      return NextResponse.json({ error: 'ID inválido' }, { status: 400 });
    }

    console.log('Datos recibidos para actualización:', data); 

    const productos: Array<{ id: number; cantidad: number }> = Array.isArray(data.productos) 
      ? data.productos 
      : [];

    const complementos: Array<{ 
      nombre: string; 
      productos?: Array<{ id: number; cantidad: number }> 
    }> = Array.isArray(data.complementos) 
      ? data.complementos 
      : [];

    const productoIds = productos.map((p) => p.id);
    const complementoProductoIds = complementos.flatMap((c) => 
      c.productos?.map((p) => p.id) || []
    );
    const todosProductosIds = [...productoIds, ...complementoProductoIds];

    const productosExistentes = await prisma.producto.findMany({
      where: { id: { in: todosProductosIds } },
      select: { id: true },
    });

    const idsExistentes = productosExistentes.map((p) => p.id);
    const idsNoEncontrados = todosProductosIds.filter((id) => !idsExistentes.includes(id));

    if (idsNoEncontrados.length > 0) {
      return NextResponse.json(
        { error: `Los siguientes productos no existen: ${idsNoEncontrados.join(', ')}` },
        { status: 400 }
      );
    }

    const menuActualizado = await prisma.$transaction(async (prisma) => {
      await prisma.complementoProducto.deleteMany({
        where: {
          complemento: {
            menuId: menuId,
          },
        },
      });

      await prisma.menuProducto.deleteMany({
        where: { menuId: menuId },
      });

      await prisma.complemento.deleteMany({
        where: { menuId: menuId },
      });

      return await prisma.menu.update({
        where: { id: menuId },
        data: {
          nombre: data.nombre,
          productos: {
            create: productos.map((producto) => ({
              productoId: producto.id,
              cantidad: producto.cantidad,
            })),
          },
          complementos: {
            create: complementos.map((complemento) => ({
              nombre: complemento.nombre,
              productos: {
                create: complemento.productos?.map((producto) => ({
                  productoId: producto.id,
                  cantidad: producto.cantidad,
                })) || [],
              },
            })),
          },
        },
        include: {
          productos: { include: { producto: true } },
          complementos: { include: { productos: { include: { producto: true } } } },
        },
      });
    });

    console.log('Menú actualizado:', menuActualizado);
    return NextResponse.json(menuActualizado);
  } catch (error) {
    console.error('Error al actualizar menú:', error);
    return NextResponse.json({ error: 'Hubo un problema al actualizar el menú' }, { status: 500 });
  }
}
