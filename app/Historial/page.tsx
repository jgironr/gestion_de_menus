"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";

function Historial () {
  const [priceHistory, setPriceHistory] = useState([
    {
      product: "Producto A",
      oldPrice: "$10.00",
      newPrice: "$12.00",
      date: "2024-10-25",
      modifiedBy: "usuario1"
    },
    {
      product: "Producto B",
      oldPrice: "$8.00",
      newPrice: "$9.50",
      date: "2024-10-20",
      modifiedBy: "usuario2"
    },
    {
      product: "Producto C",
      oldPrice: "$5.00",
      newPrice: "$5.50",
      date: "2024-10-18",
      modifiedBy: "usuario3"
    }
  ]);

  const handleClick = () => {
    alert("Hola");
  };

  return (
    <section className="h-screen flex flex-col bg-gray-200 text-gray-800 p-6">
      {/* Encabezado */}
      <header className="text-center py-4 border-b border-gray-300">
        <h1 className="text-4xl font-bold shadow-lg">Menús Escolares</h1>
      </header>

      {/* Contenedor principal */}
      <main className="flex-1 flex flex-col items-center p-4">
        {/* Sección de histórico de precios */}
        <section className="w-full max-w-5xl mb-8">
          <h2 className="text-2xl font-semibold mb-4">Histórico de Precios</h2>
          <div className="bg-white p-4 rounded-lg shadow-lg overflow-x-auto">
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b">Producto</th>
                  <th className="py-2 px-4 border-b">Precio Anterior</th>
                  <th className="py-2 px-4 border-b">Precio Actual</th>
                  <th className="py-2 px-4 border-b">Fecha de Cambio</th>
                  <th className="py-2 px-4 border-b">Modificado por</th>
                </tr>
              </thead>
              <tbody>
                {priceHistory.map((record, index) => (
                  <tr key={index}>
                    <td className="py-2 px-4 border-b">{record.product}</td>
                    <td className="py-2 px-4 border-b">{record.oldPrice}</td>
                    <td className="py-2 px-4 border-b">{record.newPrice}</td>
                    <td className="py-2 px-4 border-b">{record.date}</td>
                    <td className="py-2 px-4 border-b">{record.modifiedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Botones de acción */}
        <div className="flex flex-wrap justify-center gap-4">
          {["Menús", "Clientes", "Reportes", "Otros"].map((text, index) => (
            <button
              key={index}
              onClick={handleClick}
              className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition transform hover:scale-105"
            >
              {text}
            </button>
          ))}
        </div>
      </main>

      {/* Pie de página */}
      <footer className="text-center py-4 border-t border-gray-300">
        <p className="text-gray-600">© 2024 Mi Aplicación</p>
      </footer>
    </section>
  );
}

export default Historial;