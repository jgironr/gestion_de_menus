import type { Metadata } from "next";
import localFont from "next/font/local";
import Navbar from "@/components/Navbar";
import { getServerSession } from "next-auth/next"; // Importar getServerSession
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // Ajusta la ruta según sea necesario
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Sistema de Gestión de Menús Escolares",
  description: "Sistema para gestionar productos y menús escolares",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions); 

  return (
    <html lang="es">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Navbar session={session} /> 
        <div className="container mx-auto mt-2">{children}</div>
      </body>
    </html>
  );
}
