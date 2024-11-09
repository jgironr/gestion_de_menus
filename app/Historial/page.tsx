"use client";
import { useState, useEffect } from "react";
import { FaCube } from "react-icons/fa";
import { HistorialProducto, Producto } from "@prisma/client";

type HistorialProductoConProducto = HistorialProducto & {
  producto: Producto;
};

function Historial() {
  const [priceHistory, setPriceHistory] = useState<
    HistorialProductoConProducto[]
  >([]);

  useEffect(() => {
    const fetchHistorial = async () => {
      try {
        const res = await fetch("/api/historial-productos");
        const data: HistorialProductoConProducto[] = await res.json();
        setPriceHistory(data);
      } catch (error) {
        console.error("Error al obtener el historial:", error);
      }
    };

    fetchHistorial();
  }, []);

  return (
    <section className="min-h-screen flex flex-col bg-gray-200 text-gray-800 p-6">
      <div className="border-2 border-orange-500 rounded-3xl shadow-lg text-center relative bg-white">
        <h1 className="text-3xl p-2 font-extrabold text-black flex items-center justify-center gap-3">
          <FaCube className="text-orange-500 mr-2" /> Historial
        </h1>
      </div>

      {/* Contenedor principal */}
      <main className="flex-1 flex flex-col items-center p-4">
        <section className="w-full max-w-7xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            Histórico de Productos
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Producto</th>
                  <th className="py-2 px-4 border-b">Precio Costo Anterior</th>
                  <th className="py-2 px-4 border-b">Precio Costo Nuevo</th>
                  <th className="py-2 px-4 border-b">
                    Precio Público Anterior
                  </th>
                  <th className="py-2 px-4 border-b">Precio Público Nuevo</th>
                  <th className="py-2 px-4 border-b">Fecha de Cambio</th>
                  <th className="py-2 px-4 border-b">Modificado por</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(priceHistory) && priceHistory.length > 0 ? (
                  priceHistory.map((record) => (
                    <tr key={record.id}>
                      <td className="py-2 px-4 border-b">
                        {record.producto.descripcion}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {record.precioCostoAnterior !== null
                          ? `Q ${record.precioCostoAnterior.toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {record.precioCostoNuevo !== null
                          ? `Q ${record.precioCostoNuevo.toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {record.precioPublicoAnterior !== null
                          ? `Q ${record.precioPublicoAnterior.toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {record.precioPublicoNuevo !== null
                          ? `Q ${record.precioPublicoNuevo.toFixed(2)}`
                          : "N/A"}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(record.fechaCambio).toLocaleString()}
                      </td>
                      <td className="py-2 px-4 border-b">{record.usuario}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="py-2 px-4 border-b text-center">
                      No hay registros disponibles.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </section>
  );
}

export default Historial;
