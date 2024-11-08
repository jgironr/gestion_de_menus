"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Session } from "next-auth";
import { FaBox, FaListAlt, FaUserFriends, FaFileAlt } from "react-icons/fa"; // Importar los íconos

interface NavbarProps {
  session: Session | null;
}

const Navbar = ({ session }: NavbarProps) => {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 w-full bg-orange-500 text-white py-2 shadow-md z-50">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-wide flex items-center gap-2">
          <FaBox className="text-white" />
          Gestión de Menús
        </h1>

        <div className="flex space-x-6">
          {session?.user ? (
            <>
              <Link
                href="/"
                className={`flex items-center gap-2 ${
                  isActive("/")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white border-b-2 border-orange-500"
                } transition`}
              >
                <FaListAlt />
                <span className="font-semibold">Inicio</span>
              </Link>

              <Link
                href="/productos"
                className={`flex items-center gap-2 ${
                  isActive("/productos")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white border-b-2 border-orange-500"
                } transition`}
              >
                <FaBox />
                <span className="font-semibold">Ingredientes</span>
              </Link>

              <Link
                href="/menus"
                className={`flex items-center gap-2 ${
                  isActive("/menus")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white border-b-2 border-orange-500"
                } transition`}
              >
                <FaListAlt />
                <span className="font-semibold">Menús</span>
              </Link>

              <Link
                href="/clientes"
                className={`flex items-center gap-2 ${
                  isActive("/clientes")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white border-b-2 border-orange-500"
                } transition`}
              >
                <FaUserFriends />
                <span className="font-semibold">Escuelas</span>
              </Link>

              <Link
                href="/Historial"
                className={`flex items-center gap-2 ${
                  isActive("/Historial")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white border-b-2 border-orange-500"
                } transition`}
              >
                <FaFileAlt />
                <span className="font-semibold">Historial</span>
              </Link>

              <Link
                href="/facturacion"
                className={`flex items-center gap-2 ${
                  isActive("/facturacion")
                    ? "text-white border-b-2 border-white"
                    : "text-gray-300 hover:text-white border-b-2 border-orange-500"
                } transition`}
              >
                <FaFileAlt />
                <span className="font-semibold">Facturación</span>
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
