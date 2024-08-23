/*
    Esto es el molde de cada página para que se respete siempre el mismo tamaño
    Home - Alumnos - etc
*/

import Navigation from "./Navigation";
import logo from "../../assets/sfLogo.png";
import { useState } from "react";
import { FaBell } from "react-icons/fa";

const Layout = ({ children }) => {
    /* Notificaciones Hacer */
    const [showNotifications, setShowNotifications] = useState(false);

    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    return (
        <div className="flex flex-col h-screen text-black">
            {/* Encabezado o barra superior (si la necesitas) */}
            <header className="bg-white w-full h-20 flex items-center justify-between px-6">
                <img
                    src={logo}
                    alt="Logo Sin Fronteras"
                    width={50}
                    className="rounded-md"
                />
                <h1 className="uppercase font-bold text-xl mx-auto">
                    Sin Fronteras
                </h1>
                <div className="relative">
                    <FaBell
                        className="text-2xl cursor-pointer"
                        //onClick={toggleNotifications}
                    />
                    {showNotifications && (
                        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded-md shadow-lg">
                            <ul className="list-none p-2">
                                <li className="p-2 border-b border-gray-200">
                                    Notificación 1
                                </li>
                                <li className="p-2 border-b border-gray-200">
                                    Notificación 2
                                </li>
                                <li className="p-2 border-b border-gray-200">
                                    Notificación 3
                                </li>
                            </ul>
                        </div>
                    )}
                </div>
            </header>

            {/* Contenedor principal con altura fija */}
            <main className="flex-grow bg-white w-full mx-auto p-4">
                {children}
            </main>

            {/* Barra de navegación */}
            <Navigation />
        </div>
    );
};

export default Layout;
