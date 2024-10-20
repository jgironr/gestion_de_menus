import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

async function Navbar() {
    const session = await getServerSession(authOptions);
    console.log(session);

    return (
        <nav className="flex justify-between items-center bg-gray-950 text-white px-10 py-3">
            <Link className="text-xl font-bold file: px-4 pb-1 rounded hover:bg-gray-200 hover:text-gray-800 transition-colors duration-300 ease-in-out" href="/">Home</Link>

            <ul className="flex gap-x-2">
                {!session?.user ? (
                    <>
                        <li>
                            <Link href="/auth/login" className="mr-2 px-4 py-2 rounded hover:bg-gray-200 hover:text-gray-800 transition-colors duration-300 ease-in-out">
                                Ingresar
                            </Link>
                        </li>
                        <li>
                            <Link href="/auth/register" className="px-4 py-2 rounded hover:bg-gray-200 hover:text-gray-800 transition-colors duration-300 ease-in-out">
                                Registrate
                            </Link>
                        </li>
                    </>

                ) : (
                    <>
                        <li>
                            <Link href="/productos" className="mr-2 px-4 py-2 rounded hover:bg-gray-200 hover:text-gray-800 transition-colors duration-300 ease-in-out">
                                Productos
                            </Link>
                        </li>
                        <li>
                            <Link href="/api/auth/signout" className="px-4 py-2 rounded hover:bg-gray-200 hover:text-gray-800 transition-colors duration-300 ease-in-out">Salir</Link>
                        </li>
                    </>
                )}
            </ul>
        </nav>
    );
}

export default Navbar;