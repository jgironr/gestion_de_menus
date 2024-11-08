"use client";
import Link from "next/link";
import { FaBox, FaListAlt, FaUserFriends, FaFileAlt } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-orange-500 text-white py-2 shadow-md z-10">
      <div className="container mx-auto text-center">
        <p className="text-white">© 2024 derechos reservados</p>
      </div>
    </footer>
  );
};

export default Footer;
