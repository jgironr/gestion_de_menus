"use client";
import { signOut } from 'next-auth/react';

function HomePage() {
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
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8 w-full max-w-5xl">
          {["Estadística 1", "Estadística 2", "Estadística 3"].map((title, index) => (
            <div key={index} className="bg-white p-6 rounded-lg text-center shadow-lg transition-transform transform hover:scale-105">
              <h2 className="text-xl font-semibold mb-2">{title}</h2>
              <p className="text-3xl">45%</p>
            </div>
          ))}
        </div>

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

export default HomePage;
