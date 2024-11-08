// app/components/NavbarServer.tsx
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import Navbar from './Navbar';

const NavbarServer = async () => {
    const session = await getServerSession(authOptions);
    return <Navbar session={session} />;
};

export default NavbarServer;
