"use client";
interface Menu {
  id: number;
  nombre: string;
  productos: ProductoSeleccionado[];
  complementos: Complemento[];
  costoTotal: number;
  gananciaTotal: number;
}
interface Complemento {
  id: number;
  nombre: string;
  productos: ProductoSeleccionado[];
}
interface Producto {
  id: number;
  descripcion: string;
  presentacion: string;
  costo: number;
  unidad: number;
}

interface ProductoSeleccionado extends Producto {
  cantidad: number;
  producto?: Producto;
}

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaCube,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaCheckCircle,
  FaTimes,
  FaExclamationTriangle,
} from "react-icons/fa";

function HomePage() {
  const [productos, setProductos] = useState<[]>([]);
  const [clientes, setClientes] = useState<[]>([]);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchProductos = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/productos");
      if (response.ok) {
        const data: [] = await response.json();
        setProductos(data);
      } else {
        alert("Error al obtener los productos.");
      }
    } catch (error) {
      alert("Error de red.");
    } finally {
      setLoading(false);
    }
  };

  const fetchClientes = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/clientes");
      if (response.ok) {
        const data: [] = await response.json();
        setClientes(data);
      } else {
        alert("Error al obtener los clientes.");
      }
    } catch (error) {
      alert("Error de red.");
    } finally {
      setLoading(false);
    }
  };

  const fetchMenus = async () => {
    try {
      const res = await fetch("/api/menus");
      if (!res.ok) throw new Error("Error al obtener menús");
      const data = await res.json();

      console.log("Menús recibidos:", data);

      const formattedData = data.map((menu: Menu) => ({
        ...menu,
        productos: (menu.productos || []).map((p) => ({
          ...p,
          id: p.id || 0,
        })),
        complementos: (menu.complementos || []).map((complemento) => ({
          ...complemento,
          productos: complemento.productos.map((p) => ({
            ...p,
            id: p.id || 0,
          })),
        })),
      }));

      setMenus(formattedData);
    } catch (error) {
      console.error("Error al obtener menús:", error);
    }
  };

  useEffect(() => {
    fetchProductos();
    fetchMenus();
    fetchClientes();
  }, []);

  return (
    <section className="h-screen flex flex-col bg-gray-200 text-gray-50 p-6">
      <div className="border-2 border-orange-500 rounded-3xl shadow-lg text-center relative bg-white">
        <h1 className="text-4xl p-2 font-extrabold text-black flex items-center justify-center gap-3">
          <FaCube className="text-orange-500 mr-2" /> Bienvenido a Control de
          Escuelas
        </h1>
      </div>
      <main className="flex-1 flex flex-col items-center p-1">
        {/* Tarjetas de estadísticas */}
        <div className="flex flex-wrap justify-center gap-8 my-8 w-full max-w-5xl mx-auto">
          <div className="bg-slate-400 p-6 rounded-lg text-center shadow-lg transition-transform transform hover:scale-105 w-64">
            <h2 className="text-xl font-semibold mb-2">
              Total de ingredientes
            </h2>
            <p className="text-3xl">{productos.length}</p>{" "}
          </div>

          <div className="bg-slate-400 p-6 rounded-lg text-center shadow-lg transition-transform transform hover:scale-105 w-64">
            <h2 className="text-xl font-semibold mb-2">Total de Escuelas</h2>
            <p className="text-3xl">{clientes.length}</p>
          </div>

          <div className="bg-slate-400 p-6 rounded-lg text-center shadow-lg transition-transform transform hover:scale-105 w-64">
            <h2 className="text-xl font-semibold mb-2">Menús Creados</h2>
            <p className="text-3xl">{menus.length}</p>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          <Link
            href="/productos"
            className="bg-white shadow-md rounded-lg p-6 w-48 h-60 block"
          >
            <Image
              src="/img/verdura.png"
              alt="Verdura"
              layout="responsive"
              width={256}
              height={128}
              objectFit="cover"
              className="rounded-md pb-2"
            />
            <button className="bg-orange-500 text-white w-full py-3 rounded-md hover:bg-orange-600 transition transform hover:scale-105">
              Productos
            </button>
          </Link>

          <Link
            href="/menus"
            className="bg-white shadow-md rounded-lg p-6 w-44 h-60 block"
          >
            <Image
              src="/img/menu.png"
              alt="Menú"
              layout="responsive"
              width={256}
              height={128}
              objectFit="cover"
              className="rounded-md pb-2"
            />
            <button className="bg-orange-500 text-white w-full py-3 rounded-md hover:bg-orange-600 transition transform hover:scale-105 mt-4">
              Menú
            </button>
          </Link>

          <Link
            href="/clientes"
            className="bg-white shadow-md rounded-lg p-6 w-48 h-60 block"
          >
            <Image
              src="/img/escuela.png"
              alt="Escuelas"
              layout="responsive"
              width={256}
              height={128}
              objectFit="cover"
              className="rounded-md pb-2"
            />
            <button className="bg-orange-500 text-white w-full py-3 rounded-md hover:bg-orange-600 transition transform hover:scale-105">
              Escuelas
            </button>
          </Link>

          <Link
            href="/facturas"
            className="bg-white shadow-md rounded-lg p-6 w-48 h-60 block"
          >
            <Image
              src="/img/factura.png"
              alt="Facturas"
              layout="responsive"
              width={256}
              height={128}
              objectFit="cover"
              className="rounded-md pb-2"
            />
            <button className="bg-orange-500 text-white w-full py-3 rounded-md hover:bg-orange-600 transition transform hover:scale-105">
              Facturas
            </button>
          </Link>
        </div>
      </main>
    </section>
  );
}

export default HomePage;
