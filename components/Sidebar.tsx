'use client'

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { FaUsers, FaFileAlt, FaBullhorn, FaCog, FaEllipsisV } from 'react-icons/fa';
import { useUser } from '../app/context/UserContext';
import Image from "next/image";

const Sidebar: FC = () => {
  const pathname = usePathname();
  const router = useRouter();

  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const { user } = useUser();

 
  const initials = user?.fullName
    .split(' ')
    .map((name) => name[0])
    .join('')
    .toUpperCase();

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  const handleLogout = () => {
    router.push('/');
  };

  return (
    <div className="h-screen w-64 bg-black text-white flex flex-col justify-between">
      {/* Logo */}
      <div className="flex items-center px-4 py-6">
        <Image
          src="/dTalentLogo.png"
          alt="Logo"
          width={200}
          height={200}
          className="mb-4"
        />
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4">
        <ul className="space-y-4">
          <li>
            <Link href="/dashboard/users" className={`flex items-center px-3 py-2 rounded ${pathname === '/dashboard/users' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <FaUsers className="mr-3" />
              Empleados
            </Link>
          </li>
          <li>
            <Link href="/dashboard/receipts" className={`flex items-center px-3 py-2 rounded ${pathname === '/dashboard/receipts' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <FaFileAlt className="mr-3" />
              Recibos
            </Link>
          </li>
          <li>
            <Link href="#" className={`flex items-center px-3 py-2 rounded ${pathname === '/dashboard/communications' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <FaBullhorn className="mr-3" />
              Comunicados
            </Link>
          </li>
          <li>
            <Link href="#" className={`flex items-center px-3 py-2 rounded ${pathname === '/dashboard/settings' ? 'bg-blue-600' : 'hover:bg-gray-700'}`}>
              <FaCog className="mr-3" />
              Configuración
            </Link>
          </li>
        </ul>
      </nav>

      {/* Profile Section */}
      <div className="relative flex flex-col items-start p-4 border-t border-gray-700">
        <div className="flex items-center justify-between w-full">
            <div className="flex items-center">
              {/* Profile icon with initials */}
              <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-semibold">
                {initials}
              </div>
              <div className="ml-3">
                <p className="font-semibold">Bienvenido</p>
                <p className="text-sm">{user?.firstName}</p>
              </div>
            </div>
            {/* Three dots icon to toggle menu */}
            <FaEllipsisV
              onClick={toggleProfileMenu}
              className="ml-4 cursor-pointer hover:text-gray-400"
            />
        </div>

        {/* Dropdown menu for logout */}
        {isProfileMenuOpen && (
          <div className="absolute bottom-16 left-4 bg-white text-black rounded shadow-md w-full">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-2 hover:bg-gray-200"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;