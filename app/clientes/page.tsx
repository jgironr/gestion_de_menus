"use client";
import { useState, useEffect } from "react";
import { signOut } from "next-auth/react";
import { FaCube } from "react-icons/fa";

function Clientes() {
  const [searchTerm, setSearchTerm] = useState("");
  const [clientes, setClientes] = useState<any[]>([]);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [selectedCliente, setSelectedCliente] = useState<any>(null);

  // Fetch clients from the server
  useEffect(() => {
    const fetchClientes = async () => {
      const response = await fetch('/api/clientes');
      const data = await response.json();
      setClientes(data);
    };

    fetchClientes();
  }, []);

  // Handle Add Client
  const handleAddClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch('/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, direccion }),
    });
    const newClient = await response.json();
    setClientes([...clientes, newClient]);
    setNombre('');
    setDireccion('');
  };

  // Handle Edit Client
  const handleEditClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCliente) return;

    const response = await fetch(`/api/clientes/${selectedCliente.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ nombre, direccion }),
    });
    const updatedClient = await response.json();
    setClientes(clientes.map(client => client.id === updatedClient.id ? updatedClient : client));
    setSelectedCliente(null);
    setNombre('');
    setDireccion('');
  };

  // Handle Delete Client
  const handleDeleteClient = async (id: number) => {
    await fetch(`/api/clientes/${id}`, {
      method: 'DELETE',
    });
    setClientes(clientes.filter(client => client.id !== id));
  };

  // Prepare edit
  const prepareEdit = (client: any) => {
    setSelectedCliente(client);
    setNombre(client.nombre);
    setDireccion(client.direccion);
  };

  return (
    <section className="h-[calc(100vh-7rem)] p-6 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-orange-500 rounded-3xl shadow-lg text-center relative bg-white">
          <h1 className="text-3xl p-2 font-extrabold text-black flex items-center justify-center gap-3">
            <FaCube className="text-orange-500 mr-2" /> Gestión de Escuelas
          </h1>
        </div>
        <p className="text-gray-600 text-lg mb-6">
          Administrar escuelas y sus menús semanales
        </p>

        {/* Search Bar and Add Button */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Buscar escuela"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md flex-1"
          />
          <button className="bg-blue-500 text-white px-4 py-2 rounded-md" onClick={() => {}}>
            Buscar escuela 
          </button>
        </div>

        {/* Add/Edit Form */}
        <form onSubmit={selectedCliente ? handleEditClient : handleAddClient} className="mb-6">
          <input
            type="text"
            placeholder="Nombre de la escuela"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md mr-4"
          />
          <input
            type="text"
            placeholder="Dirección"
            value={direccion}
            onChange={(e) => setDireccion(e.target.value)}
            required
            className="px-4 py-2 border border-gray-300 rounded-md mr-4"
          />
          <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded-md">
            {selectedCliente ? 'Actualizar Cliente' : 'Añadir Cliente'}
          </button>
        </form>

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
            {clientes.filter(cliente => cliente.nombre.includes(searchTerm)).map((cliente) => (
              <tr key={cliente.id} className="border-b border-gray-200">
                <td className="p-4">{cliente.nombre}</td>
                <td className="p-4">{cliente.direccion}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => prepareEdit(cliente)} className="bg-yellow-500 text-white px-3 py-1 rounded-md">
                    Editar
                  </button>
                  <button onClick={() => handleDeleteClient(cliente.id)} className="bg-blue-500 text-white px-3 py-1 rounded-md">
                    Configurar menú semanal
                  </button>
                  <button onClick={() => handleDeleteClient(cliente.id)} className="bg-red-500 text-white px-3 py-1 rounded-md">
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
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