"use client";
import React, { useState, useEffect } from "react";
import { Cliente, Menu } from "@prisma/client";
import {
  FaCube,
  FaEdit,
  FaTrash,
  FaSearch,
  FaPlus,
  FaUser,
} from "react-icons/fa";

type ClienteWithDias = Cliente & {
  dias: { id: number; dia: string }[];
};

export default function Clientes() {
  const [clientes, setClientes] = useState<ClienteWithDias[]>([]);
  const [selectedCliente, setSelectedCliente] =
    useState<ClienteWithDias | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isOpenAgregarCliente, setIsOpenAgregarCliente] = useState(false);
  const [nuevoCliente, setNuevoCliente] = useState({
    nombre: "",
    direccion: "",
    telefono: "",
  });

  // Obtener clientes de la API
  useEffect(() => {
    const fetchClientes = async () => {
      const res = await fetch("/api/clientes");
      const data = await res.json();
      setClientes(data);
    };

    fetchClientes();
  }, []);

  const handleAddCliente = () => {
    setSelectedCliente(null);
    setNuevoCliente({ nombre: "", direccion: "", telefono: "" });
    setIsOpenAgregarCliente(true);
  };

  const handleEditCliente = (cliente: ClienteWithDias) => {
    setSelectedCliente(cliente);
    setNuevoCliente({
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      telefono: cliente.telefono,
    });
    setIsOpenAgregarCliente(true); // Mostrar el modal de edición
  };

  const handleSaveCliente = async () => {
    if (
      !nuevoCliente.nombre ||
      !nuevoCliente.direccion ||
      !nuevoCliente.telefono
    ) {
      alert("Todos los campos son obligatorios");
      return;
    }

    try {
      const clienteData = selectedCliente?.id
        ? { ...nuevoCliente, id: selectedCliente.id }
        : nuevoCliente;

      const response = await fetch(`/api/clientes`, {
        method: selectedCliente?.id ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(clienteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al guardar el cliente:", errorData);
        alert(`Error: ${errorData.error}`);
        return;
      }

      const updatedCliente = await response.json();

      if (selectedCliente?.id) {
        setClientes((prev) =>
          prev.map((c) => (c.id === updatedCliente.id ? updatedCliente : c))
        );
      } else {
        setClientes((prev) => [...prev, updatedCliente]);
      }

      setIsOpenAgregarCliente(false);
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al guardar el cliente");
    }
  };

  const handleDeleteCliente = async (id: number) => {
    try {
      const response = await fetch(`/api/clientes`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (response.ok) {
        setClientes(clientes.filter((cliente) => cliente.id !== id));
      } else {
        const errorData = await response.json();
        console.error("Error al eliminar el cliente:", errorData);
        alert("Error al eliminar el cliente");
      }
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al eliminar el cliente");
    }
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
      <div className="p-2 border-2 mb-4 border-orange-500 rounded-3xl shadow-lg text-center relative bg-white">
        <div className="absolute top-6 right-6">
          <button
            onClick={handleAddCliente}
            className="bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700"
          >
            <FaPlus className="inline-block mr-2" /> Añadir Cliente
          </button>
        </div>
        <h1 className="text-4xl font-extrabold text-black mb-4 flex items-center justify-center gap-3">
          <FaUser className="text-orange-500" /> Clientes
        </h1>
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute left-4 top-2 text-gray-700" />
          <input
            type="text"
            placeholder="Buscar clientes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 p-1 rounded-full border border-black bg-white text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          />
        </div>
      </div>

      {/* Modal Agregar Cliente */}
      {isOpenAgregarCliente && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg w-96 p-6 shadow-lg">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedCliente ? "Editar Cliente" : "Agregar Cliente"}
            </h2>
            <form
              className="mt-4"
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveCliente();
              }}
            >
              <div className="mb-4">
                <label htmlFor="nombre" className="block text-sm text-gray-700">
                  Nombre
                </label>
                <input
                  type="text"
                  id="nombre"
                  value={nuevoCliente.nombre}
                  onChange={(e) =>
                    setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })
                  }
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="direccion"
                  className="block text-sm text-gray-700"
                >
                  Dirección
                </label>
                <input
                  type="text"
                  id="direccion"
                  value={nuevoCliente.direccion}
                  onChange={(e) =>
                    setNuevoCliente({
                      ...nuevoCliente,
                      direccion: e.target.value,
                    })
                  }
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="telefono"
                  className="block text-sm text-gray-700"
                >
                  Teléfono
                </label>
                <input
                  type="text"
                  id="telefono"
                  value={nuevoCliente.telefono}
                  onChange={(e) =>
                    setNuevoCliente({
                      ...nuevoCliente,
                      telefono: e.target.value,
                    })
                  }
                  className="w-full p-2 mt-1 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsOpenAgregarCliente(false)}
                  className="bg-gray-400 text-white px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-md"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Tabla de clientes */}
      <table className="w-full bg-white rounded-xl shadow-lg border border-gray-200 mb-6">
        <thead className="bg-orange-500 text-white">
          <tr>
            <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
              Nombre
            </th>
            <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
              Dirección
            </th>
            <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
              Teléfono
            </th>
            <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
              Días
            </th>
            <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          {clientes
            .filter((cliente) =>
              cliente.nombre.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .map((cliente) => (
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
                  {cliente.dias &&
                  Array.isArray(cliente.dias) &&
                  cliente.dias.length > 0
                    ? cliente.dias.map((dia) => dia.dia).join(", ")
                    : "Sin días asignados"}
                </td>
                <td className="p-4 text-sm text-gray-800">
                  <button
                    onClick={() => handleEditCliente(cliente)}
                    className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700 mr-2"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteCliente(cliente.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
}
