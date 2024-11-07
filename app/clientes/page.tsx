"use client";
import { useState } from 'react';
import { signOut } from 'next-auth/react';

function Clientes() {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <section className="h-[calc(100vh-7rem)] p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-gray-800 text-5xl font-bold mb-2">Gestión de Clientes</h1>
        <p className="text-gray-600 text-lg mb-6">Administrar escuelas y sus menús semanales</p>
        
        {/* Search Bar and Add Button */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar escuela"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md flex-1"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md">Añadir Cliente</button>
        </div>

        {/* Table */}
        <table className="w-full bg-white rounded-md shadow-md">
          <thead>
            <tr className="bg-gray-200">
              <th className="text-left p-4">Nombre</th>
              <th className="text-left p-4">Dirección</th>
              <th className="text-left p-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {/* Example Row - Replace with dynamic data */}
            <tr className="border-b border-gray-200">
              <td className="p-4">Escuela Ejemplo</td>
              <td className="p-4">123 Calle Falsa</td>
              <td className="p-4 flex gap-2">
                <button className="bg-yellow-500 text-white px-3 py-1 rounded-md">Editar</button>
                <button className="bg-green-500 text-white px-3 py-1 rounded-md">Configurar Menú</button>
                <button className="bg-red-500 text-white px-3 py-1 rounded-md">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>

        {/* Logout Button */}
        <button
          className="bg-gray-800 text-white px-4 py-2 rounded-md mt-8"
          onClick={() => signOut()}
        >
          Logout
        </button>
      </div>
    </section>
  );
}

export default Clientes;
