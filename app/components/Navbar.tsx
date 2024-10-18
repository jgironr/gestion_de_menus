'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaBox, FaListAlt, FaUserFriends, FaFileAlt } from 'react-icons/fa';

const Navbar = () => {
  const pathname = usePathname(); 

  const isActive = (path: string) => pathname === path; 

  return (
    <nav className="bg-gray-800 text-white py-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-extrabold tracking-wide flex items-center gap-2">
          <FaBox className="text-blue-400" /> Gestión de Menús
        </h1>

        <div className="flex space-x-6">
          <Link
            href="/productos"
            className={`flex items-center gap-2 ${
              isActive('/productos')
                ? 'text-white border-b-2 border-orange-500'
                : 'text-gray-300 hover:text-white'
            } transition`}
          >
            <FaBox />
            <span className="font-semibold">Productos</span>
          </Link>

          <Link
            href="/menus"
            className={`flex items-center gap-2 ${
              isActive('/menus')
                ? 'text-white border-b-2 border-orange-500'
                : 'text-gray-300 hover:text-white'
            } transition`}
          >
            <FaListAlt />
            <span className="font-semibold">Menús</span>
          </Link>

          <Link
            href="/clientes"
            className={`flex items-center gap-2 ${
              isActive('/clientes')
                ? 'text-white border-b-2 border-orange-500'
                : 'text-gray-300 hover:text-white'
            } transition`}
          >
            <FaUserFriends />
            <span className="font-semibold">Clientes</span>
          </Link>

          <Link
            href="/reportes"
            className={`flex items-center gap-2 ${
              isActive('/reportes')
                ? 'text-white border-b-2 border-orange-500'
                : 'text-gray-300 hover:text-white'
            } transition`}
          >
            <FaFileAlt />
            <span className="font-semibold">Reportes</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
