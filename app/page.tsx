"use client"
import {signOut} from 'next-auth/react'

function HomePage() {
  const handleClick = () => {
    alert("Hola");
  };

  return (
    <section className="h-screen flex flex-col bg-gray-900 text-white p-6">
      {/* Encabezado */}
      <header className="text-center py-4 border-b border-gray-700">
        <h1 className="text-4xl font-bold">Dashboard</h1>
      </header>

      {/* Contenedor principal */}
      <main className="flex-1 flex flex-col items-center p-4">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8 w-full max-w-5xl">
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Estadística 1</h2>
            <p className="text-3xl">45%</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Estadística 2</h2>
            <p className="text-3xl">120</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg text-center">
            <h2 className="text-xl font-semibold mb-2">Estadística 3</h2>
            <p className="text-3xl">75</p>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex flex-wrap justify-center gap-4">
          <button
            onClick={handleClick}
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 transition"
          >
            Acción 1
          </button>
          <button
            onClick={handleClick}
            className="bg-green-500 text-white px-6 py-3 rounded-md hover:bg-green-600 transition"
          >
            Acción 2
          </button>
          <button
            onClick={handleClick}
            className="bg-red-500 text-white px-6 py-3 rounded-md hover:bg-red-600 transition"
          >
            Acción 3
          </button>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="text-center py-4 border-t border-gray-700">
        <p className="text-gray-400">© 2024 Mi Aplicación</p>
      </footer>
    </section>
  );
}
export default HomePage