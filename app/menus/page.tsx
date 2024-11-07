'use client';
import { useState, useRef, useEffect } from 'react';
import Select from 'react-select';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css'; 

import { FaFolderOpen, FaEdit, FaTrash, FaSearch, FaPlus, FaCheckCircle, FaTimes, FaExclamationTriangle } from 'react-icons/fa';

interface Producto {
  id: number;
  descripcion: string;
  presentacion: string;
  costo: number;
  unidad: number; 
}

interface ProductoSeleccionado extends Producto {
  cantidad: number;
  producto?: Producto; 
}


interface Menu {
  id: number;
  nombre: string;
  productos: ProductoSeleccionado[];
  complementos: Complemento[];
  costoTotal: number;
  gananciaTotal: number;
}

interface Complemento {
  id: number;
  nombre: string;
  productos: ProductoSeleccionado[]; 
}



export default function Menus() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<Menu | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [menuToDelete, setMenuToDelete] = useState<number | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [menus, setMenus] = useState<Menu[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const menusPerPage = 5;
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedMenuDetails, setSelectedMenuDetails] = useState<Menu | null>(null);
  const [complementos, setComplementos] = useState<Complemento[]>([]);


  
  const viewDetails = (menu: Menu) => {
    console.log("MENU DETAIL");
    console.log(menu);
    setSelectedMenuDetails(menu); 
    setIsDetailsModalOpen(true); 
  };
  
  const closeDetailsModal = () => {
    setSelectedMenuDetails(null); 
    setIsDetailsModalOpen(false); 
  };
  
  const agregarProductoAComplemento = (complementoId: number, productoId: number) => {
    if (!selectedMenu) return;
  
    const producto = productos.find((p) => p.id === productoId);
    if (!producto) return;
  
    const complementosActualizados = selectedMenu.complementos.map((complemento) => {
      if (complemento.id === complementoId) {
        const productoExistente = complemento.productos.find((p) => p.id === productoId);
        if (productoExistente) {
          showNotificationMessage('Este producto ya ha sido añadido al complemento.');
          return complemento;
        }
        return {
          ...complemento,
          productos: [...complemento.productos, { ...producto, cantidad: 1 }],
        };
      }
      return complemento;
    });
  
    setSelectedMenu((prev) => ({
      ...prev!,
      complementos: complementosActualizados,
    }));
  };
  

  const actualizarCantidadProductoDeComplemento = (complementoId: number, productoId: number, nuevaCantidad: number) => {
    if (!selectedMenu) return;
  
    const complementosActualizados = selectedMenu.complementos.map((complemento) =>{
      if (complemento.id === complementoId) {
        const productosActualizados = complemento.productos.map((p)=>{
          if(p.id === productoId){
            return {...p, cantidad: nuevaCantidad};
          }
          return p;
        });
        return {...complemento, productos: productosActualizados}
      }
      return complemento;
    });
  
    setSelectedMenu({
      ...selectedMenu,
      complementos: complementosActualizados,
      costoTotal: calcularCostoTotal(),
      gananciaTotal: calcularGananciaTotal(),
    });
    
  };


  const eliminarProductoDeComplemento = (complementoId: number, productoId: number) => {
    if (!selectedMenu) return;
  
    const complementosActualizados = selectedMenu.complementos.map((complemento) => {
      if (complemento.id === complementoId) {
        const productosActualizados = complemento.productos.filter((p) => p.id !== productoId);
        return { ...complemento, productos: productosActualizados };
      }
      return complemento;
    });
  
    setSelectedMenu((prev) => ({
      ...prev!,
      complementos: complementosActualizados,
    }));
  };
  



useEffect(() => {
  const fetchProductos = async () => {
    try {
      const res = await fetch('/api/productos');
      if (!res.ok) throw new Error('Error al obtener productos');
      const data = await res.json();
      console.log('Productos desde API:', data); 
      setProductos(data); 
    } catch (error) {
      console.error('Error al obtener productos:', error);
    }
  };

  fetchProductos();
}, []);



const fetchMenus = async () => {
  try {
    const res = await fetch('/api/menus');
    if (!res.ok) throw new Error('Error al obtener menús');
    const data = await res.json();

    console.log('Menús recibidos:', data); 

    const formattedData = data.map((menu: Menu) => ({
  ...menu,
  productos: (menu.productos || []).map((p) => ({
    ...p,
    id: p.id || 0, 
  })),
  complementos: (menu.complementos || []).map((complemento) => ({
    ...complemento,
    productos: complemento.productos.map((p) => ({
      ...p,
      id: p.id || 0,
    })),
  })),
}));


    setMenus(formattedData);
  } catch (error) {
    console.error('Error al obtener menús:', error);
  }
};

useEffect(() => {
  fetchMenus();
}, []);




  const agregarProductoAlMenu = (productoId: number) => {
    const producto = productos.find((p) => p.id === productoId);
    if (!producto || !selectedMenu) return;
  
    const productoExistente = selectedMenu.productos.find((p) => p.id === productoId);
    if (productoExistente) {
      showNotificationMessage('Este producto ya ha sido añadido.');
      return; 
    }
  
    const productoSeleccionado: ProductoSeleccionado = {
      ...producto,
      cantidad: 1,
    };
  
    const productosActualizados = [...selectedMenu.productos, productoSeleccionado];
  
    setSelectedMenu((prevMenu) => 
      prevMenu ? {
        ...prevMenu,
        productos: [...prevMenu.productos, productoSeleccionado],
        costoTotal: calcularCostoTotal(),
        gananciaTotal: calcularGananciaTotal(),
      } : null
    );
    
    
  
    if (errors.productos) {
      setErrors((prevErrors) => {
        const { productos, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  


const actualizarCantidadProducto = (productoId: number, nuevaCantidad: number) => {
  if (!selectedMenu) return;

  const productosActualizados = selectedMenu.productos.map((p) =>
    p.id === productoId ? { ...p, cantidad: nuevaCantidad } : p
  );

  setSelectedMenu({
    ...selectedMenu,
    productos: productosActualizados,
    costoTotal: calcularCostoTotal(),
    gananciaTotal: calcularGananciaTotal(),
  });
  
};



const obtenerCosto = (p: any) => p.producto?.costo ?? p.costo ?? 0;
const obtenerUnidad = (p: any) => p.producto?.unidad ?? p.unidad ?? 0;

const calcularCostoTotal = (): number => {
  const costoProductos = selectedMenu?.productos?.reduce((total, p) => {
    const costo = obtenerCosto(p);
    return total + costo * (p.cantidad ?? 1);
  }, 0) || 0;

  const costoComplementos = selectedMenu?.complementos?.reduce(
    (totalComplemento, complemento) =>
      totalComplemento +
      complemento.productos.reduce((total, p) => {
        const costo = obtenerCosto(p);
        return total + costo * (p.cantidad ?? 1);
      }, 0),
    0
  ) || 0;

  console.log('Costo Total Calculado:', costoProductos + costoComplementos);
  return costoProductos + costoComplementos;
};

const calcularVentaTotal = (): number => {
  const ventaProductos = selectedMenu?.productos?.reduce((total, p) => {
    const unidad = obtenerUnidad(p);
    return total + unidad * (p.cantidad ?? 1);
  }, 0) || 0;

  const ventaComplementos = selectedMenu?.complementos?.reduce(
    (totalComplemento, complemento) =>
      totalComplemento +
      complemento.productos.reduce((total, p) => {
        const unidad = obtenerUnidad(p);
        return total + unidad * (p.cantidad ?? 1);
      }, 0),
    0
  ) || 0;

  console.log('Venta Total Calculada:', ventaProductos + ventaComplementos);
  return ventaProductos + ventaComplementos;
};

const calcularGananciaTotal = (): number => {
  const ganancia = calcularVentaTotal() - calcularCostoTotal();
  console.log('Ganancia Total Calculada:', ganancia);
  return ganancia;
};





const filteredMenus = menus.filter((menu: Menu) =>
  menu.nombre.toLowerCase().includes(searchTerm.toLowerCase())
);




      const indexOfLastMenu = currentPage * menusPerPage;
      const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
      const currentMenus = filteredMenus.slice(indexOfFirstMenu, indexOfLastMenu);
    
      const totalPages = Math.ceil(filteredMenus.length / menusPerPage);
    
      const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
      const openEditModal = (menu: Menu) => {
        console.log("EDITAR");
        console.log(menu);
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

      const confirmDelete = async () => {
        if (menuToDelete === null) return;
      
        try {
          const res = await fetch(`/api/menus/${menuToDelete}`, {
            method: 'DELETE',
          });
      
          if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || 'Error al eliminar el menú');
          }
      
          const updatedMenus = menus.filter((menu) => menu.id !== menuToDelete);
          setMenus(updatedMenus); 
          setMenuToDelete(null);
          showNotificationMessage('Menú eliminado con éxito');
        } catch (error) {
          console.error('Error al eliminar menú:', error);
          showNotificationMessage('Error al eliminar menú');
        } finally {
          setIsConfirmModalOpen(false);
        }
      };
      



  const validateEditFields = () => {
    const errors: Record<string, string> = {};
  
    if (!selectedMenu?.nombre) errors.nombre = 'El nombre es obligatorio';
    if (!selectedMenu?.productos) errors.productos = 'debe añadir productos';
   
    setErrors(errors);
    return Object.keys(errors).length === 0;
  };
  

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
  
    if (!validateFields()) return;
  
    const menuData = {
      nombre: selectedMenu?.nombre,
      productos: selectedMenu?.productos.map((p) => ({
        id: p.producto?.id || p.id,
        cantidad: p.cantidad,
      })),
      complementos: selectedMenu?.complementos.map((c) => ({
        id: c.id,
        nombre: c.nombre || 'Sin nombre', 
        productos: c.productos.map((p) => ({
          id: p.producto?.id || p.id,
          cantidad: p.cantidad,
        })),
      })),
    };
    
  
    console.log('Datos enviados al backend:', JSON.stringify(menuData, null, 2));
  
    try {
      const res = await fetch(`/api/menus/${selectedMenu?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(menuData),
      });
  
      if (!res.ok) {
        const errorMessage = await res.text();
        throw new Error(`Error al actualizar menú: ${errorMessage}`);
      }
  
      const updatedMenu = await res.json();
      setMenus((prevMenus) =>
        prevMenus.map((menu) => (menu.id === updatedMenu.id ? updatedMenu : menu))
      );
      closeEditModal();
      showNotificationMessage('Menú actualizado con éxito');
    } catch (error) {
      console.error('Error al actualizar menú:', error);
      showNotificationMessage('Hubo un problema al actualizar el menú.');
    }
  };
  
  

  const openAddModal = () => {
    setSelectedMenu({
      id: menus.length + 1,
      nombre: '',
      productos: [],
      complementos: [{ id: 1, nombre: 'Complemento 1', productos: [] }], 
      costoTotal: 0,
      gananciaTotal: 0,
    });
    setErrors({});
    setIsAddModalOpen(true);
  };
  

  const validateFields = () => {
    const errors: Record<string, string> = {};
  
    if (!selectedMenu?.nombre?.trim()) {
      errors.nombre = 'El nombre es obligatorio';
    }
  
    if (!selectedMenu || selectedMenu.productos.length === 0) {
      errors.productos = 'Debe añadir al menos un producto';
    }
  
    setErrors(errors);
  
    return Object.keys(errors).length === 0;
  };
  
const handleAddMenu = async () => {
  if (!selectedMenu) return;

  if (!validateFields()) return;

  try {
    console.log("MENU");
    console.log(selectedMenu);
    const res = await fetch('/api/menus', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(selectedMenu),
    });

    console.log("RES");
    console.log(res);

    if (!res.ok) throw new Error('Error al añadir el menú');

    const newMenu = await res.json();
    console.log("NEW MENU");
    console.log(newMenu);
    fetchMenus();
    setMenus([...menus, newMenu]); 
    setIsAddModalOpen(false);
    setSelectedMenu(null);
    showNotificationMessage('Menú añadido con éxito');
  } catch (error) {
    console.error('Error al añadir menú:', error);
  }
};

  
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setSelectedMenu((prev) => (prev ? { ...prev, [name]: value } : null));
    
    if (value.trim() && errors[name]) {
      setErrors((prevErrors) => {
        const { [name]: _, ...rest } = prevErrors;
        return rest;
      });
    }
  };
  
  
  
  const eliminarProductoDelMenu = (productoId: number) => {
    if (!selectedMenu) return;
  
    const productosActualizados = selectedMenu.productos.filter(
      (p) => p.id !== productoId
    );
  
    setSelectedMenu({
      ...selectedMenu,
      productos: productosActualizados,
      costoTotal: calcularCostoTotal(),
      gananciaTotal: calcularGananciaTotal(),
    });
    
  
    if (productosActualizados.length > 0 && errors.productos) {
      setErrors((prevErrors) => {
        const { productos, ...rest } = prevErrors;
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
    <div className="container mx-auto p-4 min-h-screen">
      {notificationMessage && (
        <div
          className="fixed top-5 right-5 text-white p-4 rounded-lg shadow-lg flex items-center gap-2 z-50"
          style={{
            backgroundColor: notificationMessage.includes('eliminado')
              ? 'rgba(31, 41, 55, 0.8)' 
              : 'rgba(31, 41, 55, 0.8)',
            zIndex: 9999,
          }}
        >
          <FaCheckCircle />
          <span>{notificationMessage}</span>
        </div>
      )}

{isAddModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div
      ref={modalRef}
      className="bg-white py-4 px-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
    >    <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-orange-500">Añadir Nuevo Menú</h2>
        <button
          onClick={() => setIsAddModalOpen(false)}
          className="bg-gray-200 hover:bg-gray-300 text-orange-500 rounded-full p-2 transition"
        >
          ✖
        </button>
      </div>

      <form onSubmit={(e) => e.preventDefault()}>
        <div className="grid grid-cols-2 gap-6">
          {/* Nombre del Menú */}
          <div>
            <label className="block font-semibold">Nombre</label>
            <input
              type="text"
              name="nombre"
              placeholder="Nombre del menú"
              onChange={handleInputChange}
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
                errors.nombre ? 'border-red-500 focus:ring-red-500' : 'focus:ring-orange-500'
              }`}
            />
            {errors.nombre && (
              <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
            )}
          </div>

          {/* Selección de Producto */}
          <div>
            <label className="block font-semibold">Seleccionar Producto</label>
            <Select
            options={productos.map((producto) => ({
              value: producto.id,
              label: `${producto.descripcion} (Compra: Q${producto.costo} - Reventa: Q${producto.unidad})`,
            }))}
            onChange={(option) => option && agregarProductoAlMenu(option.value)}
            placeholder="Buscar producto..."
            isSearchable
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
            />
            <Tooltip id="selectTooltip" />
            {errors.productos && (
              <p className="text-red-500 text-sm mt-1">{errors.productos}</p>
            )}
          </div>
        </div>

        {/* Lista de Productos Seleccionados */}
        <div className="mt-4">
  <h3 className="text-lg font-semibold">Productos Seleccionados</h3>
  {selectedMenu?.productos.map((producto) => (
    <div
      key={producto.id}
      className="flex items-center justify-between mt-2 gap-4 border-b pb-2"
    >
      {/* Descripción del producto */}
      <span className="flex-1">
        {producto.descripcion} (Compra: Q{producto.costo} - Reventa: Q{producto.unidad}) (x{producto.cantidad})
      </span>

      {/* entrada de cantidad */}
      <input
        type="number"
        value={producto.cantidad}
        min="1"
        onChange={(e) =>
          actualizarCantidadProducto(producto.id, parseInt(e.target.value))
        }
        className="w-16 p-1 border rounded-md text-center"
      />

      {/* Botón eliminar */}
      <button
        onClick={() => eliminarProductoDelMenu(producto.id)}
        className="text-red-500 hover:text-red-700 transition"
      >
        ✖
      </button>
    </div>
  ))}
</div>


        {/* Selección de Complementos */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">Añadir Menú Complemento</h3>
          {selectedMenu?.complementos.map((complemento) => (
            <div key={complemento.id} className="mt-4 p-4 border rounded-md">
              <h5 className="font-bold">{complemento.nombre}</h5>

              {/* Mostrar productos del complemento */}
              <ul>
                {complemento.productos.map((producto) => (
                  <li key={producto.id} className="flex justify-between items-center mt-2">
                    <span>
                    {producto.descripcion} (Compra: Q{producto.costo} - Reventa: Q{producto.unidad}) (x{producto.cantidad})
                    </span>
                    {/* entrada de cantidad */}
                    <input
                      type="number"
                      value={producto.cantidad}
                      min="1"
                      onChange={(e) =>
                        actualizarCantidadProductoDeComplemento(complemento.id, producto.id, parseInt(e.target.value))
                      }
                      className="w-16 p-1 border rounded-md text-center"
                    />
                    <button
                      onClick={() => eliminarProductoDeComplemento(complemento.id, producto.id)}
                      className="text-red-500 hover:text-red-700 transition"
                    >
                      ✖
                    </button>
                  </li>
                ))}
              </ul>

              {/* Agregar un producto al complemento */}
              <Select
              options={productos.map((producto) => ({
                value: producto.id,
                label: `${producto.descripcion} (Compra: Q${producto.costo} - Reventa: Q${producto.unidad})`,
              }))}
              onChange={(option) =>
                option ? agregarProductoAComplemento(complemento.id, option.value) : null
              }
              placeholder="Agregar producto al complemento..."
              isSearchable
              className="w-full mt-2"
            />


            </div>
          ))}
        </div>

        {/* Resumen del Menú */}
        <div className="mt-4">
          <h3 className="text-lg font-semibold">Resumen del Menú</h3>
          <p><strong>Costo Total (Compra):</strong> Q{calcularCostoTotal().toFixed(2)}</p>
          <p><strong>Costo Total (Venta):</strong> Q{calcularVentaTotal().toFixed(2)}</p>
          <p><strong>Ganancia Total:</strong> Q{calcularGananciaTotal().toFixed(2)}</p>
        </div>


        {/* Botón para Añadir Menú */}
        <button
          type="button"
          onClick={handleAddMenu}
          className="w-full mt-6 bg-orange-500 text-white p-3 rounded-md hover:bg-orange-600 transition-all duration-300"
        >
          Añadir Menú
        </button>
      </form>
    </div>
  </div>
)}





{isDetailsModalOpen && selectedMenuDetails && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div 
      ref={modalRef} 
      className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">
          Detalles del Menú: {selectedMenuDetails.nombre}
        </h2>
        <button
          onClick={closeDetailsModal}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition"
        >
          ✖
        </button>
      </div>

     {/* Lista de Productos */}
<div className="mt-4">
  <h3 className="text-lg font-semibold">Productos Seleccionados</h3>
  <ul className="mt-2 space-y-2">
    {selectedMenuDetails.productos.map((prod) => (
      <li key={prod.id} className="flex justify-between">
        <span>
          {prod.producto?.descripcion || 'Producto desconocido'} 
          (Compra: Q{prod.producto?.costo || 0} - 
          Reventa: Q{prod.producto?.unidad || 0}) (x{prod.cantidad})
        </span>
        <span>Total: Q{((prod.producto?.unidad || 0) * prod.cantidad).toFixed(2)}</span>
      </li>
    ))}
  </ul>
</div>

{/* Lista de Complementos */}
<div className="mt-6">
  <h3 className="text-lg font-semibold">Complementos</h3>
  {selectedMenuDetails.complementos.length > 0 ? (
    selectedMenuDetails.complementos.map((complemento) => (
      <div key={complemento.id} className="mt-4 p-4 border rounded-md">
        <h5 className="font-bold mb-2">{complemento.nombre}</h5>
        <ul className="space-y-2">
          {complemento.productos.map((p) => (
            <li key={p.id} className="flex justify-between">
              <span>
                {p.producto?.descripcion || 'Producto desconocido'} 
                (Compra: Q{p.producto?.costo || 0} - 
                Reventa: Q{p.producto?.unidad || 0}) (x{p.cantidad})
              </span>
              <span>Total: Q{((p.producto?.unidad || 0) * p.cantidad).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>
    ))
  ) : (
    <p className="text-gray-500 italic">No se han agregado complementos.</p>
  )}
</div>


    {/* Resumen del Menú */}
<div className="mt-6">
  <h3 className="text-lg font-semibold">Resumen del Menú</h3>

  <p>
    <strong>Costo Total (Compra):</strong> Q
    {(
      selectedMenuDetails.productos.reduce(
        (total, p) => total + (p.producto?.costo ?? 0) * p.cantidad,
        0
      ) +
      selectedMenuDetails.complementos.reduce(
        (totalComplemento, complemento) =>
          totalComplemento +
          complemento.productos.reduce(
            (total, p) => total + (p.producto?.costo ?? 0) * p.cantidad,
            0
          ),
        0
      )
    ).toFixed(2)}
  </p>

  <p>
    <strong>Costo Total (Venta):</strong> Q
    {(
      selectedMenuDetails.productos.reduce(
        (total, p) => total + (p.producto?.unidad ?? 0) * p.cantidad,
        0
      ) +
      selectedMenuDetails.complementos.reduce(
        (totalComplemento, complemento) =>
          totalComplemento +
          complemento.productos.reduce(
            (total, p) => total + (p.producto?.unidad ?? 0) * p.cantidad,
            0
          ),
        0
      )
    ).toFixed(2)}
  </p>

  <p>
    <strong>Ganancia Total:</strong> Q
    {(
      selectedMenuDetails.productos.reduce(
        (total, p) =>
          total + ((p.producto?.unidad ?? 0) - (p.producto?.costo ?? 0)) * p.cantidad,
        0
      ) +
      selectedMenuDetails.complementos.reduce(
        (totalComplemento, complemento) =>
          totalComplemento +
          complemento.productos.reduce(
            (total, p) =>
              total + ((p.producto?.unidad ?? 0) - (p.producto?.costo ?? 0)) * p.cantidad,
            0
          ),
        0
      )
    ).toFixed(2)}
  </p>
</div>


      {/* Botón para cerrar */}
      <div className="mt-6 flex justify-end">
        <button
          onClick={closeDetailsModal}
          className="bg-orange-500 text-white px-6 py-3 rounded-md hover:bg-orange-600 transition-all duration-300"
        >
          Cerrar
        </button>
      </div>
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

      <div className="p-2 border-2 border-orange-500 rounded-3xl shadow-lg text-center relative bg-white">
        <div className="absolute top-6 right-6">
        <button onClick={openAddModal} className="bg-orange-500 text-white px-6 py-2 rounded-full">
            <FaPlus className="inline-block mr-2" /> Crear Nuevo Menú
          </button>
        </div>
        <h1 className="text-5xl font-extrabold text-black mb-4 flex items-center justify-center gap-3">
          < FaFolderOpen className="text-orange-500" /> Gestión de Menús
        </h1>
        <div className="relative max-w-md mx-auto">
          <FaSearch className="absolute left-4 top-2 text-gray-700" />
          <input
            type="text"
            placeholder="Buscar menús..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 p-1 rounded-full border border-black bg-white text-black placeholder-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 transition"
          />
        </div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl shadow-lg border border-gray-200">
  <table className="w-full bg-white rounded-xl">
    <thead className="bg-orange-500 text-white">
      <tr>
        <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
          Nombre del Menú
        </th>
        <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
          Productos y Complementos
        </th>
        <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
          Costo Total (Compra / Venta)
        </th>
        <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
          Ganancia Total
        </th>
        <th className="p-2 text-left text-sm font-bold uppercase tracking-wide border-b border-orange-600">
          Acciones
        </th>
      </tr>
    </thead>
    <tbody>
      {currentMenus.map((menu) => (
        <tr key={menu.id} className="border-b hover:shadow-md transition-all">
          <td className="p-4 text-sm">{menu.nombre}</td>

   {/* Columna de Productos y Complementos */}
<td className="p-4 text-sm">
  <ul className="list-disc list-inside space-y-2">
 {/* Renderizado de productos */}
{menu.productos && menu.productos.length > 0 ? (
  <>
    <li className="font-semibold">Productos:</li>
    {menu.productos.map((p) => {
      const producto = p.producto || p; 
      return (
        <li key={producto.id} className="ml-4">
          {producto.descripcion} (x{p.cantidad}) - Compra: Q{producto.costo} / Reventa: Q{producto.unidad}
        </li>
      );
    })}
  </>
) : (
  <li className="text-gray-500 italic">Sin productos</li>
)}

{/* Renderizado de complementos */}
{menu.complementos && menu.complementos.length > 0 ? (
  <>
    <li className="mt-4 font-semibold">Complementos:</li>
    {menu.complementos.map((complemento) => (
      <ul key={complemento.id} className="list-circle list-inside ml-6 space-y-1">
        {complemento.productos.map((p) => {
          const producto = p.producto || p;
          return (
            <li key={producto.id}>
              {producto.descripcion} (x{p.cantidad || 1}) - Compra: Q{producto.costo} / Reventa: Q{producto.unidad}
            </li>
          );
        })}
      </ul>
    ))}
  </>
) : (
  <li className="text-gray-500 italic mt-4">Sin complementos</li>
)}

  </ul>
</td>



      {/* Costo Total (Compra / Venta) */}
<td className="p-4 text-sm">
  Q {(
    (menu.productos || []).reduce((total, p) => {
      const producto = p.producto || p; 
      const cantidad = p.cantidad || 1;
      const costo = producto.costo || 0;
      return total + costo * cantidad;
    }, 0) +
    (menu.complementos || []).reduce((totalComp, complemento) => {
      return (
        totalComp +
        (complemento.productos || []).reduce((total, p) => {
          const producto = p.producto || p;
          const cantidad = p.cantidad || 1;
          const costo = producto.costo || 0;
          return total + costo * cantidad;
        }, 0)
      );
    }, 0)
  ).toFixed(2)} / Q{" "}
  {(
    (menu.productos || []).reduce((total, p) => {
      const producto = p.producto || p;
      const cantidad = p.cantidad || 1;
      const unidad = producto.unidad || 0;
      return total + unidad * cantidad;
    }, 0) +
    (menu.complementos || []).reduce((totalComp, complemento) => {
      return (
        totalComp +
        (complemento.productos || []).reduce((total, p) => {
          const producto = p.producto || p;
          const cantidad = p.cantidad || 1;
          const unidad = producto.unidad || 0;
          return total + unidad * cantidad;
        }, 0)
      );
    }, 0)
  ).toFixed(2)}
</td>



{/* Ganancia Total */}
<td className="p-4 text-sm">
  Q {(
    (menu.productos || []).reduce((total, p) => {
      const producto = p.producto || p; 
      const cantidad = p.cantidad || 1;
      const unidad = producto.unidad || 0;
      const costo = producto.costo || 0;
      return total + (unidad - costo) * cantidad;
    }, 0) +
    (menu.complementos || []).reduce((totalComp, complemento) => {
      return (
        totalComp +
        (complemento.productos || []).reduce((total, p) => {
          const producto = p.producto || p;
          const cantidad = p.cantidad || 1;
          const unidad = producto.unidad || 0;
          const costo = producto.costo || 0;
          return total + (unidad - costo) * cantidad;
        }, 0)
      );
    }, 0)
  ).toFixed(2)}
</td>


          {/* Acciones */}
          <td className="p-4 flex gap-2">
            <button onClick={() => openEditModal(menu)} className="text-blue-600">
              <FaEdit /> Editar
            </button>
            <button onClick={() => handleDelete(menu.id)} className="text-red-600">
              <FaTrash /> Eliminar
            </button>
            <button onClick={() => viewDetails(menu)} className="text-gray-800">
              <FaFolderOpen /> Detalles
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

  {/* Botones de Paginación */}
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
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div 
      ref={modalRef} 
      className="bg-white p-10 rounded-lg shadow-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Editar Menú</h2>
        <button
          onClick={closeEditModal}
          className="bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-full p-2 transition"
        >
          ✖
        </button>
      </div>

      <form onSubmit={handleFormSubmit}>
  <div className="grid grid-cols-2 gap-6">
    {/* Campo para el Nombre del Menú */}
    <div>
      <label className="block font-semibold">Nombre</label>
      <input
        type="text"
        name="nombre"
        value={selectedMenu?.nombre || ''} 
        onChange={handleInputChange}
        className={`w-full p-2 border rounded-md focus:outline-none focus:ring-1 ${
          errors.nombre ? 'border-red-500 focus:ring-red-500' : 'focus:ring-gray-600'
        }`}
      />
      {errors.nombre && (
        <p className="text-red-500 text-sm mt-1">{errors.nombre}</p>
      )}
    </div>

    {/* Selección de Productos */}
    <div>
      <label className="block font-semibold">Productos</label>
      <Select
        options={productos.map((producto) => ({
          value: producto.id,
          label: `${producto.descripcion} (Compra: Q${producto.costo} - Reventa: Q${producto.unidad})`,
        }))}
        onChange={(option) =>
          option ? agregarProductoAlMenu(option.value) : null
        }
        placeholder="Selecciona un producto..."
        isSearchable
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-orange-500"
      />
      {errors.productos && (
        <p className="text-red-500 text-sm mt-1">{errors.productos}</p>
      )}
    </div>
  </div>

  {/* Lista de Productos Seleccionados */}
  <div className="mt-4">
    <h3 className="text-lg font-semibold">Productos Seleccionados</h3>
    {selectedMenu?.productos?.length > 0 ? (
      selectedMenu.productos.map((p) => (
        <div
          key={p.id}
          className="flex justify-between items-center mt-2 gap-2"
        >
        <span>
        {p.producto?.descripcion || p.descripcion || 'Producto sin descripción'} 
        (Compra: Q{p.producto?.costo || p.costo} - 
        Reventa: Q{p.producto?.unidad || p.unidad}) (x{p.cantidad})
      </span>
<input
  type="number"
  value={p.cantidad}
  min="1"
  onChange={(e) => actualizarCantidadProducto(p.id, parseInt(e.target.value))}
  className="w-16 p-1 border rounded-md"
/>

          <button
            onClick={() => eliminarProductoDelMenu(p.id)}
            className="text-red-500 hover:text-red-700 transition"
          >
            ✖
          </button>
        </div>
      ))
    ) : (
      <p className="text-gray-500 italic">No hay productos seleccionados</p>
    )}
  </div>

  {/* Selección de Complementos */}
  <div className="mt-6">
    <h3 className="text-lg font-semibold">Complementos</h3>
    {selectedMenu?.complementos?.map((complemento) => (
      <div key={complemento.id} className="mt-4 p-4 border rounded-md">
        <h5 className="font-bold">{complemento.nombre}</h5>
        <ul>
  {complemento.productos.map((p) => {
    const descripcion = p.producto?.descripcion || p.descripcion || 'Producto no disponible';
    const costo = p.producto?.costo ?? p.costo ?? 0;
    const unidad = p.producto?.unidad ?? p.unidad ?? 0;

    return (
      <li key={p.id} className="flex justify-between items-center mt-2">
        <span>
          {descripcion} (Compra: Q{costo} - Reventa: Q{unidad}) (x{p.cantidad})
        </span>
        <input
          type="number"
          value={p.cantidad}
          min="1"
          onChange={(e) =>
            actualizarCantidadProductoDeComplemento(complemento.id, p.id, parseInt(e.target.value))
          }
          className="w-16 p-1 border rounded-md text-center"
        />
         <button
                onClick={() =>
                  eliminarProductoDeComplemento(complemento.id, p.id)
                }
                className="text-red-500 hover:text-red-700 transition"
              >
                ✖
              </button>
      </li>
    );
  })}
</ul>

        <Select
          options={productos.map((producto) => ({
            value: producto.id,
            label: `${producto.descripcion} (Compra: Q${producto.costo} - Reventa: Q${producto.unidad})`,
          }))}
          onChange={(option) =>
            option ? agregarProductoAComplemento(complemento.id, option.value) : null
          }
          placeholder="Agregar producto al complemento..."
          isSearchable
          className="w-full mt-2"
        />
      </div>
    ))}
  </div>

  {/* Resumen del Menú */}
  <div className="mt-4">
    <h3 className="text-lg font-semibold">Resumen del Menú</h3>
    <p>
      <strong>Costo Total (Compra):</strong> Q
      {calcularCostoTotal().toFixed(2)}
    </p>
    <p>
      <strong>Costo Total (Venta):</strong> Q
      {calcularVentaTotal().toFixed(2)}
    </p>
    <p>
      <strong>Ganancia Total:</strong> Q
      {calcularGananciaTotal().toFixed(2)}
    </p>
  </div>

  {/* Botón para Actualizar */}
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