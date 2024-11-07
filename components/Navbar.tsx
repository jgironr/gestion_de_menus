'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Session } from "next-auth";
import { FaBox, FaListAlt, FaUserFriends, FaFileAlt } from 'react-icons/fa'; // Importar los íconos

interface NavbarProps {
  session: Session | null; 
}

const Navbar = ({ session }: NavbarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="bg-orange-500 text-white py-2 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
        <FaBox className="text-white" />
          Gestión de Menús
        </h1>

        <div className="flex space-x-6">
          {session?.user ? (
            <>
            <Link
                href="/menus"
                className={`flex items-center gap-2 ${isActive('/menus')
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-300 hover:text-white border-b-2 border-orange-500'
                } transition`}
              >
                <FaListAlt />
                <span className="font-semibold">Menús</span>
            </Link>
                          
              <Link
                href="/productos"
                className={`flex items-center gap-2 ${isActive('/productos')
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-300 hover:text-white border-b-2 border-orange-500'
                } transition`}
              >
                <FaBox />
                <span className="font-semibold">Productos</span>
              </Link>            

              <Link
                href="/clientes"
                className={`flex items-center gap-2 ${isActive('/clientes')
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-300 hover:text-white border-b-2 border-orange-500'
                } transition`}
              >
                <FaUserFriends />
                <span className="font-semibold">Clientes</span>
              </Link>

              <Link
                href="/reportes"
                className={`flex items-center gap-2 ${isActive('/reportes')
                  ? 'text-white border-b-2 border-white'
                  : 'text-gray-300 hover:text-white border-b-2 border-orange-500'
                } transition`}
              >
                <FaFileAlt />
                <span className="font-semibold">Reportes</span>
              </Link>

              <Link
                href="/api/auth/signout"
                className="text-gray-300 hover:text-white transition"
              >
                Salir
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="text-gray-300 hover:text-white transition"
              >
                Ingresar
              </Link>
              <Link
                href="/auth/register"
                className="text-gray-300 hover:text-white transition"
              >
                Registrate
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
