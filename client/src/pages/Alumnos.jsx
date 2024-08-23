/*

    Aca se maneja la pagina /alumnos y estan todos los alumnos y se pueden agregar mas. 
    
    ARREGLAR:
    #1: DEPORTE 
    -> revisar si elige deporte y no plan que pasa?
    -> si no selecciona ningun no da error (esta comentado porque se bugea)

*/

import { useEffect, useState } from "react";
import { useAlumnos } from "../context/AlumnosContext";
import { AlumnoCard } from "../components/alumnos/AlumnoCard";
import { ImFileEmpty } from "react-icons/im";
import { Input, Label } from "../components/ui";
import { useForm, useWatch } from "react-hook-form";
import { Link, useLocation } from "react-router-dom";
import {
    FaUser,
    FaTasks,
    FaGraduationCap,
    FaCog,
    FaPlus,
} from "react-icons/fa";
import Navigation from "../components/ui/Navigation";
import Layout from "../components/ui/Layout";

export function Alumnos() {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();

    const { alumnos, getAlumnos, createAlumno } = useAlumnos();

    // Estado para crear alumno
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [precioEfectivo, setPrecioEfectivo] = useState(0);
    const [precioTransferencia, setPrecioTransferencia] = useState(0);
    const [alumnoToCreate, setAlumnoToCreate] = useState({
        nombre: "",
        mail: "",
        telefono: "",
        deporte: "",
        plan: "",
        fechaComienzo: new Date().toISOString().slice(0, 10),
        fechaPago: "",
        precioEfectivo: 0,
        precioTransferencia: 0,
        abono: false,
        abonoEfectivo: false,
        abonoTransferencia: false,
    });

    // Estados para manejar el Search...
    const [searchTerm, setSearchTerm] = useState("");

    // Muestro todos los alumnos
    useEffect(() => {
        getAlumnos();
    }, []);

    // Definición de opciones de deportes
    const deportes = [
        { value: "Funcional", label: "Funcional" },
        { value: "Running", label: "Running" },
        { value: "TrailRunning", label: "Trail Running" },
        { value: "Ciclismo", label: "Ciclismo" },
        { value: "Natacion", label: "Natación" },
        { value: "Futbol", label: "Fútbol" },
        { value: "FutbolMixto", label: "Fútbol Mixto" },
    ];

    // Función para manejar cambios en los checkboxes de deporte
    const handleCheckboxChange = (e) => {
        const { value } = e.target;
        let updatedDeportes = [...alumnoToCreate.deporte];

        if (e.target.checked) {
            updatedDeportes.push(value);
        } else {
            updatedDeportes = updatedDeportes.filter((d) => d !== value);
        }

        setAlumnoToCreate({ ...alumnoToCreate, deporte: updatedDeportes });
    };

    // Para manejar el precio
    useEffect(() => {
        const calcularPrecio = () => {
            // aca va toda la lógica de precios segun plan
            let precioCalculadoEfectivo = 0;
            let precioCalculadoTransferencia = 0;
            //if (alumnoToCreate.deporte.length = 1) {
            //    precioCalculadoEfectivo = "7.000";
            //    precioCalculadoTransferencia = "8.000";
            //}
            if (alumnoToCreate.plan === "Plan Natación") {
                precioCalculadoEfectivo = "13.000";
                precioCalculadoTransferencia = "14.000";
            }
            if (alumnoToCreate.plan === "Plan Distancia + Full + Natación") {
                precioCalculadoEfectivo = "21.000";
                precioCalculadoTransferencia = "22.000";
            }
            if (alumnoToCreate.plan === "Plan Entrenamiento a Distancia") {
                precioCalculadoEfectivo = "12.000";
                precioCalculadoTransferencia = "13.000";
            }
            if (alumnoToCreate.plan === "Plan Personalizado Club") {
                precioCalculadoEfectivo = "16.000";
                precioCalculadoTransferencia = "17.000";
            }
            if (alumnoToCreate.plan === "Plan Full + Natación") {
                precioCalculadoEfectivo = "19.000";
                precioCalculadoTransferencia = "20.000";
            }
            if (alumnoToCreate.plan === "Plan Full") {
                precioCalculadoEfectivo = "12.000";
                precioCalculadoTransferencia = "13.000";
            }

            setPrecioEfectivo(precioCalculadoEfectivo);
            setPrecioTransferencia(precioCalculadoTransferencia);

            setAlumnoToCreate((prevState) => ({
                ...prevState,
                precioEfectivo: precioCalculadoEfectivo,
                precioTransferencia: precioCalculadoTransferencia,
            }));
        };
        calcularPrecio();
    }, [alumnoToCreate.plan]);

    // Ejemplo de cómo manejar cambios en los checkboxes de deporte
    //const handleDeporteChange = (selectedDeportes) => {
    //    setAlumnoToCreate({
    //        ...alumnoToCreate,
    //        deporte: selectedDeportes, // `selectedDeportes` debería ser un array de strings
    //    });
    //};

    // Ejemplo de cómo capturar la fecha de comienzo en el formulario
    //const handleFechaComienzoChange = (e) => {
    //    setAlumnoToCreate({
    //        ...alumnoToCreate,
    //        fechaComienzo: e.target.value, // Asegúrate de que `e.target.value` tenga el formato correcto de fecha
    //    });
    //};

    // Función para manejar el envío del formulario de creación de alumno
    const onSubmit = async (data) => {
        try {
            // Lógica para determinar la fecha de pago
            let fechaPago = "";
            if (data.pagoFrecuencia === "personalizado") {
                fechaPago = data.fechaPersonalizada;
            } else {
                fechaPago = data.pagoFrecuencia;
            }

            const deporteArray = alumnoToCreate.deporte;
            const deporteToString = deporteArray.join(", ");
            //console.log(deporteToString);

            // Crear el objeto de datos a enviar
            const alumnoData = {
                nombre: alumnoToCreate.nombre,
                mail: alumnoToCreate.mail,
                telefono: alumnoToCreate.telefono,
                deporte: deporteToString,
                plan: alumnoToCreate.plan,
                fechaComienzo: alumnoToCreate.fechaComienzo,
                fechaPago: fechaPago,
                precioEfectivo: parseFloat(
                    alumnoToCreate.precioEfectivo
                ).toFixed(3),
                precioTransferencia: parseFloat(
                    alumnoToCreate.precioTransferencia
                ).toFixed(3),
                abono: alumnoToCreate.abono,
                abonoEfectivo: alumnoToCreate.abonoEfectivo,
                abonoTransferencia: alumnoToCreate.abonoTransferencia,
            };
            // AJUSTO CADA VALOR DE LA TABLA:
            // nombre - mail - telefono - deporte - plan - fecha comienzo - fecha pago

            /*
            No funciona esto
            // Verificar si se ha seleccionado al menos un deporte
            if (alumnoToCreate.deporte.length === 0) {
                setValidationErrors({
                    deporte: {
                        message: "Selecciona al menos un deporte",
                    },
                });
                return;
            } */

            // ajusto yo -> fecha comienzo - fecha pago

            // plan

            console.log("Alumno a crear:", alumnoData);
            //console.log("deporte: ", deporteString);
            // Del formulario traigo -> nombre - mail - telefono - deporte - plan

            // TESTING -----
            console.log("Alumno to create:", alumnoToCreate);
            console.log("--- datos por separado ---");
            console.log("nombre -", alumnoToCreate.nombre);
            console.log("mail -", alumnoToCreate.mail);
            console.log("telefono -", alumnoToCreate.telefono);
            console.log("deporte -", alumnoToCreate.deporte);
            console.log("plan -", alumnoToCreate.plan);
            console.log("fechaComienzo -", alumnoToCreate.fechaComienzo);
            console.log("fechaPago -", fechaPago);
            console.log("precioEfectivo -", alumnoToCreate.precioEfectivo);
            console.log(
                "precioTransferencia -",
                alumnoToCreate.precioTransferencia
            );
            console.log("abono", alumnoToCreate.abono);
            console.log("abonoEfectivo", alumnoToCreate.abonoEfectivo);
            console.log(
                "abonoTransferencia",
                alumnoToCreate.abonoTransferencia
            );
            // TESTING -----

            await createAlumno(alumnoData); // Llama a la función createAlumno que se pasa como prop
            setShowCreateModal(false); // Cierra el modal después de crear el alumno
            resetForm(); // Limpia el formulario después de la creación exitosa
        } catch (error) {
            console.error("Error al crear el alumno:", error);
        }
    };

    /*     // Función para manejar cambios en los checkboxes de deporte
    const handleCheckboxChange = (e) => {
        const deporteSeleccionado = e.target.value;
        const isChecked = e.target.checked;

        // Actualizar el estado de alumnoToCreate para incluir o excluir el deporte seleccionado
        if (isChecked) {
            setAlumnoToCreate((prevState) => ({
                ...prevState,
                deporte: [...prevState.deporte, deporteSeleccionado],
            }));
        } else {
            setAlumnoToCreate((prevState) => ({
                ...prevState,
                deporte: prevState.deporte.filter(
                    (d) => d !== deporteSeleccionado
                ),
            }));
        }
    }; */

    // Función para manejar cambio en los planes
    const handlePlanChange = (e) => {
        setAlumnoToCreate((prevState) => ({
            ...prevState,
            plan: e.target.value,
        }));
    };

    // Función para limpiar el formulario después de la creación exitosa
    const resetForm = () => {
        setAlumnoToCreate({
            nombre: "",
            mail: "",
            telefono: "",
            deporte: [],
            plan: "",
            fechaComienzo: "",
            fechaPago: "",
            abono: false,
            abonoEfectivo: false,
            abonoTransferencia: false,
        });
    };

    // Abrir y cerrar el modal de creación de alumno
    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    // Cerrar modales
    const handleCloseModal = () => {
        setShowCreateModal(false);
        //setValidationErrors({}); // Limpiar errores al cerrar el modal
    };

    // Observa el valor del selector de rango de fechas
    const pagoFrecuencia = watch("pagoFrecuencia", "");

    // Para la navegación
    const location = useLocation();
    const currentPath = location.pathname;

    /* Dashboard - maneja si -> abono:true / abono:false / todos los alumnos */
    const { abono } = location.state || { abono: null }; // null por defecto

    // Función para normalizar y eliminar tildes
    const normalizeText = (text) => {
        return text
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase();
    };

    // Filtrado del Search Input -> busca dependiendo si abonaron o no o son todos los alumnos
    const filteredAlumnos = alumnos.filter((user) => {
        const matchesAbono = abono === null || user.abono === abono;
        const matchesSearchTerm = normalizeText(user.nombre).includes(
            normalizeText(searchTerm)
        );

        return matchesAbono && matchesSearchTerm;
    });

    return (
        <Layout>
            <div>
                <div className="container mx-auto text-center">
                    <h1 className="text-2xl uppercase font-bold">Alumnos</h1>
                    <hr className="w-52 m-auto border-2 border-paleta_3 mb-4 mt-2" />

                    <div className="flex justify-center">
                        <button
                            className="flex items-center text-lg rounded bg-paleta_2 text-white py-2 px-4"
                            onClick={handleOpenCreateModal}
                        >
                            <FaPlus className="mr-4" />
                            Crear Alumno
                        </button>
                    </div>

                    <div className="container mx-auto">
                        <input
                            type="search"
                            placeholder="Buscar Alumno..."
                            className="block p-2 my-4 w-5/6 m-auto rounded-md text-black border-2 border-gray-500"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <span className="block mt-2 mb-1 text-center text-2xl font-bold">
                            {abono === true
                                ? "Alumnos que abonaron:"
                                : abono === false
                                ? "Alumnos que no abonaron:"
                                : "Alumnos:"}
                        </span>
                    </div>

                    <div className="custom-scrollbar h-[calc(100vh-450px)] overflow-y-scroll overflow-hidden border-2 border-slate-800 rounded-lg">
                        {filteredAlumnos.length === 0 ? (
                            <div className="text-center text-gray-500 p-4">
                                <p>No hay alumnos en esta categoría.</p>
                            </div>
                        ) : (
                            filteredAlumnos.map((alumno) => (
                                <AlumnoCard key={alumno._id} alumno={alumno} />
                            ))
                        )}
                    </div>
                </div>

                {/* Modal para crear alumno */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="relative bg-white p-6 rounded-md w-4/5 h-[80vh] overflow-hidden custom-scrollbar overflow-y-scroll">
                            <button
                                type="button"
                                className="absolute top-4 right-4 font-bold rounded-full bg-paleta_3 px-4 py-2"
                                onClick={handleCloseModal}
                            >
                                ✕
                            </button>
                            <h2 className="text-xl font-bold text-black text-center mr-6">
                                Crear alumno
                            </h2>
                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* NOMBRE */}
                                <div className="mt-4 mb-2">
                                    <label className="font-bold">Nombre:</label>
                                    <Input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        placeholder="Escribe el nombre"
                                        {...register("nombre", {
                                            required: "Nombre es requerido",
                                        })}
                                        value={alumnoToCreate.nombre}
                                        onChange={(e) =>
                                            setAlumnoToCreate({
                                                ...alumnoToCreate,
                                                nombre: e.target.value,
                                            })
                                        }
                                    />
                                    {errors.nombre && (
                                        <p className="text-red-500">
                                            {errors.nombre.message}
                                        </p>
                                    )}
                                </div>

                                {/* EMAIL */}
                                <div className="mb-2">
                                    <label className="font-bold">Email:</label>
                                    <Input
                                        type="email"
                                        name="mail"
                                        placeholder="Escribe el email"
                                        {...register("mail", {
                                            required: "Email es requerido",
                                            pattern: {
                                                value: /\S+@\S+\.\S+/,
                                                message: "Email no es válido",
                                            },
                                        })}
                                        value={alumnoToCreate.mail}
                                        onChange={(e) =>
                                            setAlumnoToCreate({
                                                ...alumnoToCreate,
                                                mail: e.target.value,
                                            })
                                        }
                                    />
                                    {errors.mail && (
                                        <p className="text-red-500">
                                            {errors.mail.message}
                                        </p>
                                    )}
                                </div>

                                {/* TELEFONO */}
                                <div className="mb-2">
                                    <label className="font-bold">
                                        Teléfono:
                                    </label>
                                    <Input
                                        type="tel"
                                        id="telefono"
                                        name="telefono"
                                        placeholder="Escribe el teléfono"
                                        {...register("telefono", {
                                            required: "Teléfono es requerido",
                                        })}
                                        value={alumnoToCreate.telefono}
                                        onChange={(e) =>
                                            setAlumnoToCreate({
                                                ...alumnoToCreate,
                                                telefono: e.target.value,
                                            })
                                        }
                                    />
                                    {errors.telefono && (
                                        <p className="text-red-500">
                                            {errors.telefono.message}
                                        </p>
                                    )}
                                </div>

                                {/* DEPORTE */}
                                <div className="mb-2">
                                    <label className="font-bold">
                                        Deporte:
                                    </label>
                                    <div className="flex justify-center">
                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 mt-2 text-black">
                                            {deportes.map((deporte) => (
                                                <div key={deporte.value}>
                                                    <input
                                                        type="checkbox"
                                                        id={deporte.value}
                                                        name="deporte"
                                                        value={deporte.value}
                                                        onChange={
                                                            handleCheckboxChange
                                                        }
                                                        checked={alumnoToCreate.deporte.includes(
                                                            deporte.value
                                                        )}
                                                        className="ml-2 w-4 h-4"
                                                        /*                                               {...register("deporte", {
                                                    required:
                                                        "Selecciona al menos un deporte",
                                                })} */
                                                    />
                                                    <label className="ml-1">
                                                        {deporte.label}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    {errors.deporte && (
                                        <p className="text-red-500">
                                            {errors.deporte.message}
                                        </p>
                                    )}
                                </div>

                                {/* PLAN */}
                                <div className="mb-2">
                                    <label className="font-bold">Plan:</label>
                                    <select
                                        {...register("plan", {
                                            required:
                                                "Selecciona una opción de plan",
                                        })}
                                        value={alumnoToCreate.plan}
                                        onChange={handlePlanChange}
                                        className="selectFocus w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                                    >
                                        <option value="">
                                            Selecciona un plan
                                        </option>
                                        <option value="Plan Natación">
                                            Plan Natación
                                        </option>
                                        <option value="Plan Distancia + Full + Natación">
                                            Plan Distancia + Full + Natación
                                        </option>
                                        <option value="Plan Entrenamiento a Distancia">
                                            Plan Entrenamiento a Distancia
                                        </option>
                                        <option value="Plan Personalizado Club">
                                            Plan Personalizado Club
                                        </option>
                                        <option value="Plan Full + Natación">
                                            Plan Full + Natación
                                        </option>
                                        <option value="Plan Full">
                                            Plan Full
                                        </option>
                                    </select>
                                    {errors.plan && (
                                        <p className="text-red-500">
                                            {errors.plan.message}
                                        </p>
                                    )}
                                </div>

                                {/* FECHA COMIENZO */}
                                <div className="mb-2">
                                    <label className="font-bold">
                                        Fecha de Comienzo:
                                    </label>
                                    <Input
                                        type="date"
                                        name="fechaComienzo"
                                        value={alumnoToCreate.fechaComienzo}
                                        onChange={(e) =>
                                            setAlumnoToCreate({
                                                ...alumnoToCreate,
                                                fechaComienzo: e.target.value,
                                            })
                                        }
                                    />
                                </div>

                                {/* SELECTOR FECHA PAGO */}
                                <div className="mb-2">
                                    <label className="font-bold">
                                        Fecha de Pago:
                                    </label>
                                    <select
                                        {...register("pagoFrecuencia", {
                                            required:
                                                "Selecciona una opción de fecha de pago",
                                        })}
                                        className="selectFocus w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                                    >
                                        <option value="">
                                            Seleccione una opción
                                        </option>
                                        <option value="1-5">1 al 5</option>
                                        <option value="1-10">1 al 10</option>
                                        <option value="personalizado">
                                            Personalizado
                                        </option>
                                    </select>
                                    {errors.pagoFrecuencia && (
                                        <p className="text-red-500">
                                            {errors.pagoFrecuencia.message}
                                        </p>
                                    )}
                                </div>

                                {/* CAMPO EXTRA: fecha personalizada */}
                                {pagoFrecuencia === "personalizado" && (
                                    <div className="mb-2">
                                        <label className="font-bold">
                                            Fecha Personalizada:
                                        </label>
                                        <Input
                                            type="number"
                                            {...register("fechaPersonalizada", {
                                                required:
                                                    "Especifica una fecha de pago personalizada",
                                                min: {
                                                    value: 1,
                                                    message:
                                                        "Debe ser entre 1 y 31",
                                                },
                                                max: {
                                                    value: 31,
                                                    message:
                                                        "Debe ser entre 1 y 31",
                                                },
                                            })}
                                            placeholder="Día del mes (1-31)"
                                            className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                        />
                                        {errors.fechaPersonalizada && (
                                            <p className="text-red-500">
                                                {
                                                    errors.fechaPersonalizada
                                                        .message
                                                }
                                            </p>
                                        )}
                                    </div>
                                )}

                                {/* PRECIO */}
                                <div className="mb-2 mt-2">
                                    <div className="mb-2">
                                        <label className="font-bold ml-6">
                                            Precio Efectivo:
                                        </label>
                                        <div className="flex items-center">
                                            <span className="text-xl text-black ml-2 mr-1 font-bold">
                                                $
                                            </span>
                                            <Input
                                                type="text"
                                                value={
                                                    alumnoToCreate.precioEfectivo
                                                }
                                                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                                onChange={(e) =>
                                                    setAlumnoToCreate({
                                                        ...alumnoToCreate,
                                                        precioEfectivo: Number(
                                                            e.target.value
                                                        ),
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="mb-2">
                                        <label className="font-bold ml-6">
                                            Precio Transferencia:
                                        </label>
                                        <div className="flex items-center">
                                            <span className="text-xl text-black ml-2 mr-1 font-bold">
                                                $
                                            </span>
                                            <Input
                                                type="text"
                                                value={
                                                    alumnoToCreate.precioTransferencia
                                                }
                                                className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                                onChange={(e) =>
                                                    setAlumnoToCreate({
                                                        ...alumnoToCreate,
                                                        precioTransferencia:
                                                            Number(
                                                                e.target.value
                                                            ),
                                                    })
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* ABONO */}
                                <div className="mb-2">
                                    <label className="font-bold ml-6">
                                        Abono con:
                                    </label>
                                    <div className="flex justify-center space-x-8 mt-2">
                                        <div className="flex flex-col items-center">
                                            <div
                                                onClick={() =>
                                                    setAlumnoToCreate({
                                                        ...alumnoToCreate,
                                                        abonoEfectivo:
                                                            !alumnoToCreate.abonoEfectivo,
                                                        abonoTransferencia: false,
                                                    })
                                                }
                                                className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                                                    alumnoToCreate.abonoEfectivo
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            >
                                                {alumnoToCreate.abonoEfectivo ? (
                                                    <span className="text-white font-bold">
                                                        Si
                                                    </span>
                                                ) : (
                                                    <span className="text-white">
                                                        No
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-2 text-sm">
                                                Efectivo
                                            </p>
                                        </div>

                                        <div className="flex flex-col items-center">
                                            <div
                                                onClick={() =>
                                                    setAlumnoToCreate({
                                                        ...alumnoToCreate,
                                                        abonoTransferencia:
                                                            !alumnoToCreate.abonoTransferencia,
                                                        abonoEfectivo: false, // Desactivar efectivo si se selecciona transferencia
                                                    })
                                                }
                                                className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                                                    alumnoToCreate.abonoTransferencia
                                                        ? "bg-green-500"
                                                        : "bg-red-500"
                                                }`}
                                            >
                                                {alumnoToCreate.abonoTransferencia ? (
                                                    <span className="text-white font-bold">
                                                        Si
                                                    </span>
                                                ) : (
                                                    <span className="text-white">
                                                        No
                                                    </span>
                                                )}
                                            </div>
                                            <p className="mt-2 text-sm">
                                                Transferencia
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/*  */}
                                <div className="flex justify-center items-center gap-8 mt-8">
                                    <button
                                        type="button"
                                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                        onClick={handleCloseModal}
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                    >
                                        Crear
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
}
