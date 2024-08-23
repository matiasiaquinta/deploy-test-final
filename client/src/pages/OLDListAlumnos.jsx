import React, { useEffect, useState } from "react";
import { useUsers } from "../context/AlumnosContext";
import { deleteUserRequest } from "../api/users";

const ListUsers = () => {
    const { users, getUsers, deleteUser, editUser } = useUsers();
    const [searchTerm, setSearchTerm] = useState("");
    const [userToView, setUserToView] = useState(null);
    const [userToDelete, setUserToDelete] = useState(null);
    const [user, setUser] = useState();
    const [editedName, setEditedName] = useState(
        userToView ? userToView.nombre : ""
    );

    // Apenas carga el componente, muestra todos los alumnos
    useEffect(() => {
        getUsers();
    }, []);

    // Esto es para que funciona el editar
    //useEffect(() => {
    //    if (userToView) {
    //        setEditedName(userToView.nombre);
    //    }
    //}, [userToView]);

    // Actualiza la lista de usuarios cuando cambia el estado de eliminación
    useEffect(() => {
        getUsers();
    }, [userToDelete]);

    // Función para normalizar y eliminar tildes
    const normalizeText = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    // Filtra los usuarios según el término de búsqueda
    const filteredUsers = users.filter((user) =>
        normalizeText(user.nombre).includes(normalizeText(searchTerm))
    );
    //console.log(searchTerm);

    // Editar Alumno
    const handleEdit = async (e) => {
        e.preventDefault();

        //console.log(userToView, editedName);
        //try {
        //    await editUser(userToView._id, editedName);
        //    console.log("Edición completa!");
        //    setUserToView(null);
        //} catch (error) {
        //    console.error("Error editando alumno:", error);
        //}

        //editUser(user);
        //setUserToView(null);
        //setUserToView(user);
        //setEditedName(user.nombre);
    };

    // Eliminar Alumno
    const handleDelete = async (userId) => {
        try {
            deleteUser(userId);
            setUserToDelete(null);
            console.log("Usuario eliminado:", userId);
        } catch (error) {
            console.error("Error eliminando usuario:", error);
        }
    };

    // Evita que el clic se propague al fondo (?)
    const handleModalClick = (e) => {
        e.stopPropagation();
    };

    return (
        <div className="bg-gray-500 w-screen h-screen md:w-4/5 md:m-auto md:py-5 ">
            <h1 className="text-center py-10 text-2xl font-bold">
                Alumnos Registrados
            </h1>

            <input
                type="search"
                placeholder="Buscar Alumno..."
                className="block p-2 w-4/5 md:w-3/5 m-auto rounded-md text-black"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="custom-scrollbar h-[600px] overflow-y-scroll overflow-hidden my-10 pr-6 pl-2 w-4/5 m-auto ">
                {filteredUsers.map((user) => (
                    <div
                        key={user._id}
                        className="md:flex md:justify-between bg-gray-800 md:w-4/5 m-auto py-5 px-10 my-5 rounded-md"
                    >
                        <div className="flex flex-col justify-center gap-2 pb-5">
                            <span className="font-bold">{user.nombre}</span>
                            <span>Fecha último pago: 01/01/2024</span>
                            <span>Monto: $15.000</span>
                        </div>
                        <div className="flex flex-col gap-2">
                            <button
                                className="bg-blue-500 p-2 rounded-md mb-2 hover:bg-blue-700"
                                onClick={() => {
                                    setUserToView(user);
                                    console.log(user._id);
                                }}
                            >
                                Editar
                            </button>
                            <button
                                className="bg-red-500 p-2 rounded-md hover:bg-red-700"
                                onClick={() => setUserToDelete(user)}
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}

                {userToView && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-5 rounded-md text-black">
                            <h2 className="text-xl font-bold">
                                Información del Alumno
                            </h2>
                            <form onSubmit={handleEdit}>
                                <label>Nombre:</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="border border-gray-300 p-2 rounded-md w-full mb-2"
                                    value={editedName}
                                    onChange={(e) =>
                                        setEditedName(e.target.value)
                                    }
                                />
                                {/* aca falta el input para estos: */}
                                <p>Fecha último pago:</p>
                                <p>Monto: $15.000</p>
                                <div className="flex justify-center mt-4">
                                    <button
                                        type="button"
                                        className="bg-blue-500 p-2 rounded-md hover:bg-blue-700 mr-2"
                                        onClick={() => setUserToView(null)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 p-2 rounded-md hover:bg-blue-700"
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/*
                {userToView && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-5 rounded-md text-black">
                            <h2 className="text-xl font-bold">
                                Información del Alumno
                            </h2>
                            <form onSubmit={handleSaveChanges}>
                                <p>Nombre:</p>
                                <input
                                    type="text"
                                    value={userToView.nombre}
                                    onChange={(e) =>
                                        setEditedName(e.target.value)
                                    }
                                    className="border border-gray-300 p-2 rounded-md w-full mb-2"
                                />
                                <p>Fecha último pago:</p>{" "}
                                <p>Monto: $15.000</p>
                                <div className="flex justify-center mt-4">
                                    <button
                                        type="button"
                                        className="bg-blue-500 p-2 rounded-md hover:bg-blue-700 mr-2"
                                        onClick={() => setUserToView(null)}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 p-2 rounded-md hover:bg-blue-700"
                                    >
                                        Aceptar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
*/}
                {userToDelete && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div
                            className="bg-white p-5 rounded-md w-4/5 h-auto"
                            onClick={handleModalClick}
                        >
                            <h2 className="text-xl text-black text-center">
                                ¿Seguro que quieres eliminar a{" "}
                                <span className="font-bold">
                                    {userToDelete.nombre}
                                </span>
                                ?
                            </h2>
                            <div className="flex justify-between items-center m-auto mt-10 w-1/2">
                                <button
                                    className="bg-gray-500 p-4 rounded-md hover:bg-gray-700 hover:font-bold"
                                    onClick={() => setUserToDelete(null)}
                                >
                                    No
                                </button>
                                <button
                                    className="bg-red-500 p-4 rounded-md hover:bg-red-700 hover:font-bold"
                                    onClick={() =>
                                        handleDelete(userToDelete._id)
                                    }
                                >
                                    Sí
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ListUsers;
