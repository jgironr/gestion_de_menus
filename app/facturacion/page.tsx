"use client"; // Marca este archivo como Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Factura {
  id: number;
  nombreEscuela: string;
  cantidadIngredientes: number;
  costoTotal: { compra: number; venta: number };
  gananciaTotal: number;
}

export default function FacturacionPage() {
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [search, setSearch] = useState('');
  const [filteredFacturas, setFilteredFacturas] = useState<Factura[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchFacturas = async () => {
      const response = await fetch('/api/facturacion');
      const data = await response.json();

      if (Array.isArray(data)) {
        setFacturas(data);
        setFilteredFacturas(data);
      } else {
        console.error('La respuesta no es un array:', data);
      }
    };
    fetchFacturas();
  }, []);

  useEffect(() => {
    if (Array.isArray(facturas)) {
      const resultadosFiltrados = facturas.filter((factura) =>
        factura.nombreEscuela.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredFacturas(resultadosFiltrados);
    } else {
      console.error('facturas no es un array:', facturas);
    }
  }, [search, facturas]);

  const handleDetalles = (facturaId: number) => {
    router.push(`/facturacion/${facturaId}`);
  };

  return (
    <div className="facturacion-container">
      <h1 className="title">Facturación</h1>
      <div className="search-container">
        <input
          type="text"
          placeholder="Buscar escuela"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      <table className="facturacion-table">
        <thead>
          <tr>
            <th>Nombre Escuela</th>
            <th>Cantidad Ingredientes</th>
            <th>Costo Total (Compra/Venta)</th>
            <th>Ganancia Total</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(filteredFacturas) && filteredFacturas.length > 0 ? (
            filteredFacturas.map((factura) => (
              <tr key={factura.id}>
                <td>{factura.nombreEscuela}</td>
                <td>{factura.cantidadIngredientes}</td>
                <td>
                  Compra: {factura.costoTotal.compra} / Venta: {factura.costoTotal.venta}
                </td>
                <td>{factura.gananciaTotal}</td>
                <td>
                  <button className="details-button" onClick={() => handleDetalles(factura.id)}>Detalles</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5}>No hay facturas disponibles</td>
            </tr>
          )}
        </tbody>
      </table>

      <style jsx>{`
        .facturacion-container {
          max-width: 800px;
          margin: auto;
          padding: 20px;
          font-family: Arial, sans-serif;
        }

        .title {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          text-align: center;
          margin-bottom: 20px;
        }

        .search-container {
          display: flex;
          justify-content: center;
          margin-bottom: 20px;
        }

        .search-input {
          padding: 10px;
          font-size: 16px;
          width: 100%;
          max-width: 300px;
          border: 1px solid #ddd;
          border-radius: 5px;
        }

        .facturacion-table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 20px;
        }

        .facturacion-table th,
        .facturacion-table td {
          padding: 12px 15px;
          text-align: left;
          border: 1px solid #ddd;
        }

        .facturacion-table th {
          background-color: #f4f4f4;
          font-weight: bold;
        }

        .facturacion-table tbody tr:nth-child(even) {
          background-color: #f9f9f9;
        }

        .details-button {
          background-color: #007bff;
          color: white;
          padding: 8px 12px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
          font-size: 14px;
        }

        .details-button:hover {
          background-color: #0056b3;
        }
      `}</style>
    </div>
  );
}