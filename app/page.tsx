"use client";
import { signOut } from 'next-auth/react';
import { useState, useRef, useEffect } from 'react';
import { FaCube, FaEdit, FaTrash, FaSearch, FaPlus, FaCheckCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

function HomePage() {
  const handleClick = () => {
    alert("Hola");
  };

  return (
    <section className="h-screen flex flex-col bg-gray-200 text-gray-50 p-6">
       <div className="border-2 border-orange-500 rounded-3xl shadow-lg text-center relative bg-white">
        <h1 className="text-5xl p-4 font-extrabold text-black flex items-center justify-center gap-3">
          <FaCube className="text-orange-500 mr-2" /> Gestión de Menús
        </h1>
      </div>
      <main className="flex-1 flex flex-col items-center p-1">
        {/* Tarjetas de estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 my-8 w-full max-w-5xl">
          {["Estadística 1", "Estadística 2", "Estadística 3"].map((title, index) => (
            <div key={index} className="bg-slate-400 p-6 rounded-lg text-center shadow-lg transition-transform transform hover:scale-105">
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
    </section>
  );
}

export default HomePage;
