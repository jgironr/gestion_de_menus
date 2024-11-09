"use client";
import { useState, useEffect, useRef } from "react";
import { FaFileInvoiceDollar, FaPrint } from "react-icons/fa";
import { useReactToPrint } from "react-to-print";

interface ClienteFacturacion {
  id: number;
  nombre: string;
  direccion: string;
  telefono: string;
  costoTotal: number;
  precioVentaTotal: number;
  gananciaTotal: number;
}

interface DetalleFactura {
  dias: Dia[];
  costoTotal: number;
  precioVentaTotal: number;
  gananciaTotal: number;
}

interface Dia {
  id: number;
  dia: string;
  menus: Menu[];
}

interface Menu {
  id: number;
  nombre: string;
  productos: MenuProducto[];
}

interface MenuProducto {
  id: number;
  cantidad: number;
  producto: Producto;
}

interface Producto {
  id: number;
  descripcion: string;
  costo: number;
  unidad: number;
}

export default function Facturacion() {
  const [clientes, setClientes] = useState<ClienteFacturacion[]>([]);
  const [selectedCliente, setSelectedCliente] =
    useState<ClienteFacturacion | null>(null);
  const [detalleFactura, setDetalleFactura] = useState<DetalleFactura | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const res = await fetch("/api/facturacion/clientes");
        const data = await res.json();
        setClientes(data);
      } catch (error) {
        console.error("Error al obtener clientes:", error);
      }
    };

    fetchClientes();
  }, []);

  const handleFacturaClick = async (cliente: ClienteFacturacion) => {
    try {
      const res = await fetch(`/api/facturacion/clientes/${cliente.id}`);
      const data = await res.json();
      setSelectedCliente(cliente);
      setDetalleFactura(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error al obtener detalle de factura:", error);
    }
  };

  const handlePrint = async (cliente: ClienteFacturacion) => {
    try {
      const res = await fetch(`/api/facturacion/clientes/${cliente.id}`);
      const data = await res.json();
      setSelectedCliente(cliente);
      setTimeout(() => {
        if (componentRef.current) {
          printInvoice();
        }
      }, 500);
    } catch (error) {
      console.error("Error al obtener detalle de factura:", error);
    }
  };

  const printInvoice = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `Factura_${selectedCliente?.nombre}`,
  } as any);

  return (
    <div className="container mx-auto p-6">
      <div className="border-2 border-orange-500 rounded-3xl shadow-lg text-center relative bg-white">
        <h1 className="text-4xl font-extrabold text-black mb-4 flex items-center justify-center gap-3 p-4">
          <FaFileInvoiceDollar className="text-orange-500" /> Facturación
        </h1>
      </div>

      <div className="mt-6 overflow-hidden rounded-xl shadow-lg border border-gray-200">
        <table className="w-full bg-white rounded-xl">
          <thead className="bg-orange-500 text-white">
            <tr>
              {[
                "Nombre de Escuela",
                "Dirección",
                "Teléfono",
                "Costo",
                "Precio Venta",
                "Ganancia",
                "Acciones",
              ].map((header) => (
                <th
                  key={header}
                  className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map((cliente) => (
              <tr
                key={cliente.id}
                className="border-b hover:shadow-md transition-all duration-300 ease-in-out"
              >
                <td className="p-4 text-sm text-gray-800 font-medium">
                  {cliente.nombre}
                </td>
                <td className="p-4 text-sm text-gray-800">
                  {cliente.direccion}
                </td>
                <td className="p-4 text-sm text-gray-800">
                  {cliente.telefono}
                </td>
                <td className="p-4 text-sm text-gray-800">
                  Q {cliente.costoTotal.toFixed(2)}
                </td>
                <td className="p-4 text-sm text-gray-800">
                  Q {cliente.precioVentaTotal.toFixed(2)}
                </td>
                <td className="p-4 text-sm text-gray-800">
                  Q {cliente.gananciaTotal.toFixed(2)}
                </td>
                <td className="p-4 flex items-center gap-4">
                  <button
                    onClick={() => handleFacturaClick(cliente)}
                    className="flex items-center gap-2 text-blue-600"
                  >
                    <FaFileInvoiceDollar /> Factura
                  </button>
                  <button
                    onClick={() => handlePrint(cliente)}
                    className="flex items-center gap-2 text-green-600"
                  >
                    <FaPrint /> Imprimir
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && detalleFactura && selectedCliente && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div
            className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl overflow-y-auto max-h-screen"
            ref={componentRef}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-600">
                Factura para {selectedCliente.nombre}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition"
              >
                ✖
              </button>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-4">
                Detalle de Días y Menús
              </h3>
              {detalleFactura.dias.map((dia) => (
                <div key={dia.id} className="mb-4">
                  <h4 className="text-lg font-medium">Día: {dia.dia}</h4>
                  {dia.menus.map((menu) => (
                    <div key={menu.id} className="ml-4 mb-2">
                      <p className="font-semibold">Menú: {menu.nombre}</p>
                      <table className="w-full text-left text-gray-800 mt-2">
                        <thead>
                          <tr>
                            <th className="py-2 px-4 border-b">Producto</th>
                            <th className="py-2 px-4 border-b">Cantidad</th>
                            <th className="py-2 px-4 border-b">
                              Precio Unidad
                            </th>
                            <th className="py-2 px-4 border-b">Subtotal</th>
                          </tr>
                        </thead>
                        <tbody>
                          {menu.productos.map((menuProducto) => (
                            <tr key={menuProducto.id}>
                              <td className="py-2 px-4 border-b">
                                {menuProducto.producto.descripcion}
                              </td>
                              <td className="py-2 px-4 border-b">
                                {menuProducto.cantidad}
                              </td>
                              <td className="py-2 px-4 border-b">
                                Q {menuProducto.producto.unidad.toFixed(2)}
                              </td>
                              <td className="py-2 px-4 border-b">
                                Q{" "}
                                {(
                                  menuProducto.producto.unidad *
                                  menuProducto.cantidad
                                ).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ))}
                </div>
              ))}
            </div>

            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-2">Totales</h3>
              <p>
                <strong>Costo Total:</strong> Q{" "}
                {detalleFactura.costoTotal.toFixed(2)}
              </p>
              <p>
                <strong>Precio Venta Total:</strong> Q{" "}
                {detalleFactura.precioVentaTotal.toFixed(2)}
              </p>
              <p>
                <strong>Ganancia Total:</strong> Q{" "}
                {detalleFactura.gananciaTotal.toFixed(2)}
              </p>
              <p>
                <strong>Total de Días con Menús:</strong>{" "}
                {detalleFactura.dias.length}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
