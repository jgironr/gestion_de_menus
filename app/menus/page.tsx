'use client';
import { useState, useRef, useEffect } from 'react';
import { FaFolderOpen, FaEdit, FaTrash, FaSearch, FaPlus, FaCheckCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface Menu {
    id: number;
    nombre: string;
    productos: string[];
    costoTotal: number;
  }
  

export default function Menus() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1); 
const menusPerPage = 5; 
const [errors, setErrors] = useState<Record<string, string>>({}); 

    const [menus, setMenus] = useState<Menu[]>([
        { id: 1, nombre: 'Desayuno', productos: ['Pan', 'Café', 'Huevos'], costoTotal: 25.0 },
        { id: 2, nombre: 'Almuerzo', productos: ['Pollo', 'Arroz', 'Ensalada'], costoTotal: 50.0 },
        { id: 3, nombre: 'Cena', productos: ['Sopa', 'Pan', 'Té'], costoTotal: 30.0 },
      ]);

      const filteredMenus = menus.filter((menu) =>
        menu.nombre.toLowerCase().includes(searchTerm.toLowerCase())
      );



      const indexOfLastMenu = currentPage * menusPerPage;
      const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
      const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);
    
      const totalPages = Math.ceil(filteredMenus.length / menusPerPage);
    
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
      const openEditModal = (menu: Menu) => {
        setSelectedMenu({ ...menu });
        setErrors({});
        setIsEditModalOpen(true);
      };
    
      const closeEditModal = () => {
        setSelectedMenu(null);
        setIsEditModalOpen(false);
      };

      const showNotificationMessage = (message: string) => {
        setNotificationMessage(message);
        setTimeout(() => setNotificationMessage(null), 3000);
      };
    
      const handleDelete = (id: number) => {
        setMenuToDelete(id);
        setIsConfirmModalOpen(true);
      };

      const confirmDelete = () => {
        if (menuToDelete !== null) {
          const updatedMenus = menus.filter((menu) => menu.id !== menuToDelete);
          setMenus(updatedMenus);
          setMenuToDelete(null);
          showNotificationMessage('Menú eliminado con éxito');
        }
        setIsConfirmModalOpen(false);
      };


  const validateEditFields = () => {
    const errors: Record<string, string> = {};
  
    if (!selectedMenu?.nombre) errors.nombre = 'El nombre es obligatorio';
    if (!selectedMenu?.productos) errors.productos = 'debe añadir productos';
    if (!selectedMenu?.costoTotal) errors.costototal = 'Costo total';
   
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!validateEditFields()) return; 
  
    if (selectedMenu) {
      const updatedProductos = menus.map((menu) =>
        menu.id === selectedMenu.id ? selectedMenu : menu
      );
  
      setMenus(updatedProductos);
      closeEditModal();
      showNotificationMessage('Menú actualizado con éxito');
      setErrors({});
    }
  };
  

  const openAddModal = () => {
    setSelectedMenu({ id: menus.length + 1, nombre: '', productos: [], costoTotal: 0 });
    setErrors({});
    setIsAddModalOpen(true);
  };


 

  const validateFields = () => {
    const errors: Record<string, string> = {};
  
    if (!selectedMenu?.nombre) errors.nombre = 'El nombre es obligatorio';
    if (!selectedMenu?.productos) errors.productos = 'debe añadir productos';
    if (!selectedMenu?.costoTotal) errors.costototal = 'Costo total';
   
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = () => {
    if (!validateFields()) return; 

    if (selectedMenu) {
      setMenus([...menus, selectedMenu]);
      setIsAddModalOpen(false);
      setSelectedMenu(null);
      showNotificationMessage('Menú añadido con éxito');
      setErrors({});
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSelectedMenu((prev) => (prev ? { ...prev, [name]: value } : null));
    if (errors[name]) {
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  
  

  
  
  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        closeEditModal();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  return (
    <div className="container mx-auto mt-10 p-8 min-h-screen">
      {notificationMessage && (
        <div
          className="fixed top-5 right-5 text-white p-4 rounded-lg shadow-lg flex items-center gap-2 z-50"
          style={{
            backgroundColor: notificationMessage.includes('eliminado')
              ? 'rgba(31, 41, 55, 0.8)' 
              : 'rgba(31, 41, 55, 0.8)',
            zIndex: 50,
          }}
        >
          <FaCheckCircle />
          <span>{notificationMessage}</span>
        </div>
      )}

{isAddModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div ref={modalRef} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-500">Añadir Nuevo Menú</h2>
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="bg-gray-200 hover:bg-gray-300 text-orange-500 rounded-full p-2 transition"
        >
          ✖
        </button>
      </div>

      {/* Asegúrate que el form abre y cierra correctamente */}
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del menú"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Productos</label>
            <input
              type="text"
              name="productos"
              placeholder="productos para el menú"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {errors.productos && (
              <p className="text-red-500 text-sm mt-1">{errors.productos}</p>
            )}
          </div>

          <div>
            <label className="block font-semibold">Costo Total</label>
            <input
              type="text"
              name="costoTotal"
              placeholder="Costo Total"
              onChange={handleInputChange}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            {errors.costoTotal && (
              <p className="text-red-500 text-sm mt-1">{errors.costoTotal}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleAddProduct}
          className="w-full mt-6 bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition-all duration-300"
        >
          Añadir Menú
        </button>
      </form> {/* Cierre correcto del form */}
    </div>
  </div>
)}



      {isConfirmModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
            <div className="flex items-center gap-3 mb-4">
              <FaExclamationTriangle className="text-orange-500 text-3xl" />
              <h2 className="text-xl font-bold">Confirmación de Eliminación</h2>
            </div>
            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar este Menú? 
            </p>
            <div className="flex justify-center gap-4">
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded"
                onClick={() => setIsConfirmModalOpen(false)}
              >
                <FaTimes className="inline-block mr-2" /> Cancelar
              </button>
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded"
                onClick={confirmDelete}
              >
                <FaTrash className="inline-block mr-2" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="p-8 border-2 border-orange-500 rounded-3xl shadow-lg text-center relative bg-white">
        <div className="absolute top-6 right-6">
        <button onClick={openAddModal} className="bg-orange-500 text-white px-6 py-3 rounded-full">
            <FaPlus className="inline-block mr-2" /> Crear Nuevo Menú
          </button>
        </div>
        <h1 className="text-5xl font-extrabold text-black mb-4 flex items-center justify-center gap-3">
          < FaFolderOpen className="text-orange-500" /> Gestión de Menús
        </h1>
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute left-4 top-4 text-gray-700" />
          <input
            type="text"
            placeholder="Buscar menús..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 p-3 rounded-full border border-black bg-white text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          />
        </div>
      </div>

      <div className="mt-12 overflow-hidden rounded-xl shadow-lg border border-gray-200">
        <table className="w-full bg-white rounded-xl">
          <thead className="bg-orange-500 text-white">
            <tr>
              {['Nombre del Menú', 'Productos', 'Costo Total', 
              'Acciones'].map(
                (header) => (
                  <th key={header} className="p-4 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
          {currentMenus.map((menu) => (
              <tr key={menu.id} className="border-b hover:shadow-md transition-all">
                <td className="p-4 text-sm">{menu.nombre}</td>
                <td className="p-4 text-sm">{menu.productos.join(', ')}</td>
                <td className="p-4 text-sm">Q {menu.costoTotal.toFixed(2)}</td>
                <td className="p-4 flex gap-2">
                  <button onClick={() => openEditModal(menu)} className="text-blue-600">
                    <FaEdit /> Editar
                  </button>
                  <button onClick={() => handleDelete(menu.id)} className="text-red-600">
                    <FaTrash /> Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
   
      <div className="flex justify-center mt-8 space-x-6">
  {/* Botón Anterior */}
  <button
    disabled={currentPage === 1}
    onClick={() => paginate(currentPage - 1)}
    className={`text-4xl font-semibold transition-colors duration-300 ${
      currentPage === 1
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-orange-500 hover:text-orange-600'
    }`}
  >
    &lt;
  </button>

  {/* Botones de Página */}
  {Array.from({ length: totalPages }, (_, index) => (
    <button
      key={index + 1}
      onClick={() => paginate(index + 1)}
      className={`text-2xl font-bold transition-colors duration-300 ${
        currentPage === index + 1
          ? 'text-orange-600 underline'
          : 'text-gray-600 hover:text-orange-500'
      }`}
    >
      {index + 1}
    </button>
  ))}

  {/* Botón Siguiente */}
  <button
    disabled={currentPage === totalPages}
    onClick={() => paginate(currentPage + 1)}
    className={`text-4xl font-semibold transition-colors duration-300 ${
      currentPage === totalPages
        ? 'text-gray-300 cursor-not-allowed'
        : 'text-orange-500 hover:text-orange-600'
    }`}
  >
    &gt;
  </button>
</div>




{/* Modal de Edición */}
{isEditModalOpen && selectedMenu && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div ref={modalRef} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-600">Editar Menú</h2>
        <button
          onClick={closeEditModal}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition"
        >
          ✖
        </button>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-2 gap-6">
          {/* Nombre */}
          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              value={selectedMenu.nombre}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.nombre ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Productos */}
          <div>
            <label className="block font-semibold">Productos</label>
            <input
              type="text"
              name="productos"
              value={selectedMenu.productos}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.productos ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.productos && (
              <p className="text-red-500 text-sm mt-1">{errors.productos}</p>
            )}
          </div>

          {/* Costo Total */}
          <div>
            <label className="block font-semibold">Costo Total</label>
            <input
              type="text"
              name="costo total"
              value={selectedMenu.costoTotal}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.costoTotal ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.costoTotal && (
              <p className="text-red-500 text-sm mt-1">{errors.costoTotal}</p>
            )}
          </div>

          </div>

        <button
          type="submit"
          className="w-full mt-6 bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 transition-all duration-300"
        >
          Actualizar Menú
        </button>
      </form>
    </div>
  </div>
)}
    </div>  
  ); 
} 