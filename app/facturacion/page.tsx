"use client"; // Marca este archivo como Client Component

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Cambié la importación aquí

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
    // Función para obtener los datos de facturación
    const fetchFacturas = async () => {
      const response = await fetch('/api/facturacion');
      const data = await response.json();
      
      // Asegúrate de que data es un array antes de setearlo en el estado
      if (Array.isArray(data)) {
        setFacturas(data);
        setFilteredFacturas(data);  // Asume que la respuesta es un array
      } else {
        console.error('La respuesta no es un array:', data);
      }
    };
    fetchFacturas();
  }, []);

  useEffect(() => {
    // Verifica que facturas sea un array antes de intentar filtrarlo
    if (Array.isArray(facturas)) {
      const resultadosFiltrados = facturas.filter((factura) =>
        factura.nombreEscuela.toLowerCase().includes(search.toLowerCase())
      );
      setFilteredFacturas(resultadosFiltrados);
    } else {
      console.error('facturas no es un array:', facturas);
    }
  }, [search, facturas]);

  // Función para manejar la navegación a la pantalla de detalles
  const handleDetalles = (facturaId: number) => {
    router.push(`/facturacion/${facturaId}`);
  };

  return (
    <div className="facturacion-container">
      <h1>Facturación</h1>
      <input
        type="text"
        placeholder="Buscar escuela"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="search-input"
      />

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
          {/* Verificar que filteredFacturas sea un array antes de usar map */}
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
                  <button onClick={() => handleDetalles(factura.id)}>Detalles</button>
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
    </div>
  );
}
