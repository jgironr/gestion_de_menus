'use client';
import { useState, useRef, useEffect } from 'react';
import { FaCube, FaEdit, FaTrash, FaSearch, FaPlus, FaCheckCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

// Interfaz para tipar los productos
interface Producto {
  id: number;
  descripcion: string;
  presentacion: string;
  categoria: string;
  subcategoria: string;
  costo: number;
  unidad: number;
}

export default function Home() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false); // Nuevo modal para añadir
  const [selectedProduct, setSelectedProduct] = useState<Producto | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
const productsPerPage = 10; // Número de productos por página
const [errors, setErrors] = useState<Record<string, string>>({}); // Maneja errores


  const [productos, setProductos] = useState<Producto[]>([
    { id: 1, descripcion: 'ACEITE', presentacion: 'botella', categoria: 'ABARROTES', subcategoria: 'ABARROTES', costo: 15.0, unidad: 21.0 },
    { id: 2, descripcion: 'ACHIOTE', presentacion: 'bolsitas', categoria: 'AGRICULTURA', subcategoria: 'MENSURGES', costo: 4.0, unidad: 5.6 },
    { id: 3, descripcion: 'AGUACATE', presentacion: 'unidades', categoria: 'AGRICULTURA', subcategoria: 'VERDURAS', costo: 5.0, unidad: 7.0 },
    { id: 4, descripcion: 'AZUCAR', presentacion: 'libras', categoria: 'ABARROTES', subcategoria: 'ABARROTES', costo: 15.0, unidad: 21.0 },
    { id: 5, descripcion: 'ARROZ', presentacion: 'libras', categoria: 'AGRICULTURA', subcategoria: 'MENSURGES', costo: 4.0, unidad: 5.6 },
    { id: 6, descripcion: 'BANANO', presentacion: 'unidades', categoria: 'AGRICULTURA', subcategoria: 'FRUTAS', costo: 5.0, unidad: 7.0 },
    { id: 7, descripcion: 'CARNE MOLIDA', presentacion: 'libras', categoria: 'AGRICULTURA', subcategoria: 'POLLO Y CARNES', costo: 15.0, unidad: 21.0 },
    { id: 8, descripcion: 'ESPAGUETTI', presentacion: 'bolsas', categoria: 'ABARROTES', subcategoria: 'ABARROTES', costo: 4.0, unidad: 5.6 },
    { id: 9, descripcion: 'FRIJOL NEGRO', presentacion: 'libras', categoria: 'AGRICULTURA', subcategoria: 'GRANOS', costo: 5.0, unidad: 7.0 },
    { id: 10, descripcion: 'HUEVOS', presentacion: 'unidades', categoria: 'ABARROTES', subcategoria: 'ABARROTES', costo: 15.0, unidad: 21.0 },
    { id: 11, descripcion: 'PAN FRANCÉS', presentacion: 'quetzales', categoria: 'ABARROTES', subcategoria: 'OTROS', costo: 4.0, unidad: 5.6 },
    { id: 12, descripcion: 'MELON', presentacion: 'unidades', categoria: 'AGRICULTURA', subcategoria: 'VERDURAS', costo: 5.0, unidad: 7.0 },
  ]);

  const filteredProducts = productos.filter((producto) => {
  const searchTerms = searchTerm.toLowerCase().split(' ').filter(term => term); 

  return searchTerms.every(term =>
    [producto.descripcion, producto.presentacion, producto.categoria, producto.subcategoria]
      .some(field => field.toLowerCase().includes(term))
  );
});


  const indexOfLastProduct = currentPage * productsPerPage;
const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

const openEditModal = (producto: Producto) => {
  setSelectedProduct({ ...producto });
  setErrors({}); 
  setIsEditModalOpen(true);
};


  const closeEditModal = () => {
    setSelectedProduct(null);
    setIsEditModalOpen(false);
  };

  const showNotificationMessage = (message: string) => {
    setNotificationMessage(message);
    setTimeout(() => setNotificationMessage(null), 3000);
  };

  const handleDelete = (id: number) => {
    setProductToDelete(id);
    setIsConfirmModalOpen(true);
  };

  const confirmDelete = () => {
    if (productToDelete !== null) {
      const updatedProductos = productos.filter((producto) => producto.id !== productToDelete);
      setProductos(updatedProductos);
      setProductToDelete(null);
      showNotificationMessage('Producto eliminado con éxito');
    }
    setIsConfirmModalOpen(false);
  };


  const validateEditFields = () => {
    const errors: Record<string, string> = {};
  
    if (!selectedProduct?.descripcion) errors.descripcion = 'Descripción es obligatoria';
    if (!selectedProduct?.presentacion) errors.presentacion = 'Presentación es obligatoria';
    if (!selectedProduct?.categoria) errors.categoria = 'Categoría es obligatoria';
    if (!selectedProduct?.subcategoria) errors.subcategoria = 'Subcategoría es obligatoria';
    if (!selectedProduct || selectedProduct.costo <= 0) errors.costo = 'Costo debe ser mayor a 0';
    if (!selectedProduct || selectedProduct.unidad <= 0) errors.unidad = 'Unidad debe ser mayor a 0';
  
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!validateEditFields()) return; 
  
    if (selectedProduct) {
      const updatedProductos = productos.map((producto) =>
        producto.id === selectedProduct.id ? selectedProduct : producto
      );
  
      setProductos(updatedProductos);
      closeEditModal();
      showNotificationMessage('Producto actualizado con éxito');
      setErrors({});
    }
  };
  

  const openAddModal = () => {
    setSelectedProduct({
      id: productos.length + 1,
      descripcion: '',
      presentacion: '',
      categoria: '',
      subcategoria: '',
      costo: 0,
      unidad: 0,
    });
    setErrors({}); 
    setIsAddModalOpen(true);
  };


 

  const validateFields = () => {
    const errors: Record<string, string> = {};

    if (!selectedProduct?.descripcion) errors.descripcion = 'Descripción es obligatoria';
    if (!selectedProduct?.presentacion) errors.presentacion = 'Presentación es obligatoria';
    if (!selectedProduct?.categoria) errors.categoria = 'Categoría es obligatoria';
    if (!selectedProduct?.subcategoria) errors.subcategoria = 'Subcategoría es obligatoria';
    if (!selectedProduct || selectedProduct.costo <= 0) errors.costo = 'Costo debe ser mayor a 0';
    if (!selectedProduct || selectedProduct.unidad <= 0) errors.unidad = 'Unidad debe ser mayor a 0';

    setErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleAddProduct = () => {
    if (!validateFields()) return; 

    if (selectedProduct) {
      setProductos([...productos, selectedProduct]);
      setIsAddModalOpen(false);
      setSelectedProduct(null);
      showNotificationMessage('Producto añadido con éxito');
      setErrors({});
    }
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
  
    setSelectedProduct((prev) =>
      prev ? { ...prev, [name]: name === 'costo' || name === 'unidad' ? parseFloat(value) : value } : null
    );
  
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
              <h2 className="text-2xl font-bold text-orange-500">Añadir Nuevo Producto</h2>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-orange-500 rounded-full p-2 transition"
              >
                ✖
              </button>
            </div>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block font-semibold">Descripción</label>
                  <input
                    type="text"
                    name="descripcion"
                    placeholder="Nombre del producto"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.descripcion && (
                    <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold">Presentación</label>
                  <input
                    type="text"
                    name="presentacion"
                    placeholder="Forma de presentación"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.presentacion && (
                    <p className="text-red-500 text-sm mt-1">{errors.presentacion}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold">Categoría</label>
                  <input
                    type="text"
                    name="categoria"
                    placeholder="Categoría general"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.categoria && (
                    <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold">Subcategoría</label>
                  <input
                    type="text"
                    name="subcategoria"
                    placeholder="Categoría específica"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.subcategoria && (
                    <p className="text-red-500 text-sm mt-1">{errors.subcategoria}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold">Precio Costo</label>
                  <input
                    type="number"
                    name="costo"
                    placeholder="Costo del producto"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.costo && (
                    <p className="text-red-500 text-sm mt-1">{errors.costo}</p>
                  )}
                </div>

                <div>
                  <label className="block font-semibold">Precio Unidad</label>
                  <input
                    type="number"
                    name="unidad"
                    placeholder="Precio por unidad"
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
                  />
                  {errors.unidad && (
                    <p className="text-red-500 text-sm mt-1">{errors.unidad}</p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={handleAddProduct}
                className="w-full mt-6 bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition-all duration-300"
              >
                Añadir Producto
              </button>
            </form>
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
              ¿Estás seguro de que deseas eliminar este producto? 
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
            <FaPlus className="inline-block mr-2" /> Añadir Producto
          </button>
        </div>
        <h1 className="text-5xl font-extrabold text-black mb-4 flex items-center justify-center gap-3">
          <FaCube className="text-orange-500" /> Gestión de Productos
        </h1>
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute left-4 top-4 text-gray-700" />
          <input
            type="text"
            placeholder="Buscar productos..."
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
              {['Descripción', 'Presentación', 'Categoría', 'Subcategoría', 'Precio Costo', 'Precio Unidad', 'Acciones'].map(
                (header) => (
                  <th key={header} className="p-4 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((producto) => (
              <tr key={producto.id} className="border-b hover:shadow-md transition-all duration-300 ease-in-out">
                <td className="p-4 text-sm text-gray-800 font-medium">{producto.descripcion}</td>
                <td className="p-4 text-sm text-gray-800">{producto.presentacion}</td>
                <td className="p-4 text-sm text-gray-800">{producto.categoria}</td>
                <td className="p-4 text-sm text-gray-800">{producto.subcategoria}</td>
                <td className="p-4 text-sm text-gray-800">Q {producto.costo.toFixed(2)}</td>
                <td className="p-4 text-sm text-gray-800">Q {producto.unidad.toFixed(2)}</td>
                <td className="p-4 flex items-center gap-4">
                  <button onClick={() => openEditModal(producto)} className="flex items-center gap-2 text-blue-600">
                    <FaEdit /> Editar
                  </button>
                  <button onClick={() => handleDelete(producto.id)} className="flex items-center gap-2 text-red-600">
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
{isEditModalOpen && selectedProduct && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div ref={modalRef} className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-600">Editar Producto</h2>
        <button
          onClick={closeEditModal}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition"
        >
          ✖
        </button>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="grid grid-cols-2 gap-6">
          {/* Descripción */}
          <div>
            <label className="block font-semibold">Descripción</label>
            <input
              type="text"
              name="descripcion"
              value={selectedProduct.descripcion}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.descripcion ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.descripcion && (
              <p className="text-red-500 text-sm mt-1">{errors.descripcion}</p>
            )}
          </div>

          {/* Presentación */}
          <div>
            <label className="block font-semibold">Presentación</label>
            <input
              type="text"
              name="presentacion"
              value={selectedProduct.presentacion}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.presentacion ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.presentacion && (
              <p className="text-red-500 text-sm mt-1">{errors.presentacion}</p>
            )}
          </div>

          {/* Categoría */}
          <div>
            <label className="block font-semibold">Categoría</label>
            <input
              type="text"
              name="categoria"
              value={selectedProduct.categoria}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.categoria ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.categoria && (
              <p className="text-red-500 text-sm mt-1">{errors.categoria}</p>
            )}
          </div>

          {/* Subcategoría */}
          <div>
            <label className="block font-semibold">Subcategoría</label>
            <input
              type="text"
              name="subcategoria"
              value={selectedProduct.subcategoria}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.subcategoria ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.subcategoria && (
              <p className="text-red-500 text-sm mt-1">{errors.subcategoria}</p>
            )}
          </div>

          {/* Precio Costo */}
          <div>
            <label className="block font-semibold">Precio Costo</label>
            <input
              type="number"
              name="costo"
              value={selectedProduct.costo}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.costo ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.costo && (
              <p className="text-red-500 text-sm mt-1">{errors.costo}</p>
            )}
          </div>

          {/* Precio Unidad */}
          <div>
            <label className="block font-semibold">Precio Unidad</label>
            <input
              type="number"
              name="unidad"
              value={selectedProduct.unidad}
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.unidad ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
              }`}
            />
            {errors.unidad && (
              <p className="text-red-500 text-sm mt-1">{errors.unidad}</p>
            )}
          </div>
        </div>

        <button
          type="submit"
          className="w-full mt-6 bg-gray-800 text-white p-3 rounded-md hover:bg-gray-900 transition-all duration-300"
        >
          Actualizar Producto
        </button>
      </form>
    </div>
  </div>
)}
    </div>  
  ); 
} 