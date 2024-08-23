import { useEffect, useState } from "react";
import { useAlumnos } from "../../context/AlumnosContext";
import { InfoItem } from "./InfoItem";
import { formatFecha } from "../../utils/utils";
import { formatHistorialPagos } from "../../utils/utils";
import { Input } from "./Input";
import { deportes } from "../../utils/constants";

export function Popup({ onClose, alumno }) {
    const { deleteAlumno, updateAlumno } = useAlumnos();
    const [showEditModal, setShowEditModal] = useState(false);
    const [alumnoToDelete, setAlumnoToDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editedAlumno, setEditedAlumno] = useState(alumno);
    const [errors] = useState({});

    // Estado para almacenar los pagos
    const [pagos] = useState([]);

    // Inicializa isCustom solo si editedAlumno existe
    const [isCustom, setIsCustom] = useState(
        editedAlumno && editedAlumno.fechaPago === "personalizado"
    );

    useEffect(() => {
        // Actualiza isCustom cuando editedAlumno cambia
        if (editedAlumno) {
            setIsCustom(editedAlumno.fechaPago === "personalizado");
        }
    }, [editedAlumno]);

    const handleFechaPagoChange = (e) => {
        const value = e.target.value;
        if (value === "personalizado") {
            setIsCustom(true);
            setEditedAlumno({ ...editedAlumno, fechaPago: "" });
        } else {
            setIsCustom(false);
            setEditedAlumno({ ...editedAlumno, fechaPago: value });
        }
    };

    const handleCustomFechaPagoChange = (e) => {
        setEditedAlumno({ ...editedAlumno, fechaPago: e.target.value });
    };

    // Verifica si editedAlumno está disponible antes de hacer el cálculo
    const mostrarCampoPersonalizado = editedAlumno
        ? editedAlumno.pagoFrecuencia === "personalizado" ||
          (!["1-5", "1-10"].includes(editedAlumno.pagoFrecuencia) &&
              !isNaN(editedAlumno.fechaPago))
        : false;

    // Función para manejar cambios en los checkboxes de deportes
    const handleCheckboxChange = (e) => {
        const { value } = e.target;
        let updatedDeportes;

        //console.log(value);

        if (editedAlumno.deporte.includes(value)) {
            // Si el deporte ya está seleccionado, removerlo
            updatedDeportes = editedAlumno.deporte.filter((d) => d !== value);
        } else {
            // Si el deporte no está seleccionado, agregarlo
            updatedDeportes = [...editedAlumno.deporte, value];
        }

        setEditedAlumno({
            ...editedAlumno,
            deporte: updatedDeportes,
        });
    };
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setShowEditModal(false);
        setAlumnoToDelete(null);
        onClose();
    };

    // Guardar los datos actualizados
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("Alumno editado:", editedAlumno);

        // Convertir el array deportes a una cadena
        const deporteArray = editedAlumno.deporte;
        const deporteToString = deporteArray.join(", ");

        // Creo el objeto actualizado incluyendo variables
        const updatedAlumno = {
            ...editedAlumno,
            deporte: deporteToString,
            abonoEfectivo: editedAlumno.abonoEfectivo,
            abonoTransferencia: editedAlumno.abonoTransferencia,
        };

        await updateAlumno(editedAlumno._id, updatedAlumno);
        setShowEditModal(false);
        setEditedAlumno(null);
    };

    //Editar info de transferencia
    const handleChangePrecioTransferencia = (e) => {
        const { value } = e.target;

        // Formatear el valor con comas mientras el usuario escribe
        const formattedValue = value.replace(/\D/g, "");

        // Actualizar el estado
        setEditedAlumno({
            ...editedAlumno,
            precioTransferencia: formattedValue,
        });
    };

    // Función para manejar cambios en el selector de plan
    const handlePlanChange = (e) => {
        const { value } = e.target;
        setEditedAlumno({
            ...editedAlumno,
            plan: value,
        });
    };

    // Función para ajustar el input de precio
    const handleChangePrecioEfectivo = (e) => {
        const { value } = e.target;

        // Formatear el valor con comas mientras el usuario escribe
        const formattedValue = value.replace(/\D/g, "");

        // Actualizar el estado
        setEditedAlumno({
            ...editedAlumno,
            precioEfectivo: formattedValue,
        });
    };

    // -- ELIMINAR -- \\
    // Abrir modal confirmar eliminar alumno
    const handleOpenDeleteModal = (id) => {
        setAlumnoToDelete(id);
        setShowDeleteModal(true);
    };
    // Eliminar alumno confirmado
    const handleDelete = () => {
        deleteAlumno(alumnoToDelete);
        setShowDeleteModal(false);
        setAlumnoToDelete(null);
    };

    // -- EDITAR -- \\
    // Abrir modal editar alumno
    const handleOpenEditModal = (alumno) => {
        // Convertir el campo deporte a array si es una cadena (sin esto se bugea)
        const deporteArray =
            typeof alumno.deporte === "string"
                ? alumno.deporte.split(", ")
                : alumno.deporte;

        setEditedAlumno({
            ...alumno,
            deporte: deporteArray,
        });
        setShowEditModal(true);
    };

    // Mostrar mas prolija la información de Fecha Pago
    let textoFechaPago = "";
    if (alumno.fechaPago === "1-5") {
        textoFechaPago = "Del 1 al 5";
    } else if (alumno.fechaPago === "1-10") {
        textoFechaPago = "Del 1 al 10";
    } else if (!isNaN(alumno.fechaPago)) {
        // Verifica si fechaPago es un número
        textoFechaPago = `Todos los ${alumno.fechaPago}`;
    } else if (alumno.fechaPago === "personalizado") {
        // Maneja el caso personalizado si es necesario
        textoFechaPago = "Personalizado";
    } else {
        textoFechaPago = alumno.fechaPago; // Default a mostrar el valor directamente
    }

    return (
        <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="relative bg-white p-6 rounded-md w-4/5 h-[80vh] overflow-hidden custom-scrollbar overflow-y-scroll">
                <InfoItem label="Nombre" value={alumno.nombre} />
                <InfoItem label="Mail" value={alumno.mail} />
                <InfoItem label="Teléfono" value={alumno.telefono} />
                <InfoItem label="Deporte" value={alumno.deporte} />
                <InfoItem label="Plan" value={alumno.plan} />
                <InfoItem
                    label="Fecha de Comienzo"
                    value={formatFecha(alumno.fechaComienzo)}
                />
                <InfoItem label="Fecha de Pago" value={textoFechaPago} />
                <InfoItem
                    label="Precio Efectivo"
                    value={`$${alumno.precioEfectivo}`}
                />
                <InfoItem
                    label="Precio Transferencia"
                    value={`$${alumno.precioTransferencia}`}
                />
                <InfoItem
                    label="Abono Efectivo"
                    value={alumno.abonoEfectivo ? "Sí" : "No"}
                />
                <InfoItem
                    label="Abono Transferencia"
                    value={alumno.abonoTransferencia ? "Sí" : "No"}
                />
                <InfoItem
                    label="Meses Abonados"
                    value={formatHistorialPagos(pagos)}
                />

                <div className="flex justify-center mt-4 gap-4 w-full">
                    <button
                        className="bg-gray-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleOpenDeleteModal(alumno._id)}
                    >
                        Eliminar
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => handleOpenEditModal(alumno)}
                    >
                        Editar
                    </button>
                    <button
                        className="bg-blue-500 text-white px-4 py-2 rounded-md"
                        onClick={() => onClose()}
                    >
                        Cerrar
                    </button>
                </div>
            </div>

            {showDeleteModal && (
                <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md w-4/5 h-auto">
                        <h2 className="text-xl text-black text-center">
                            ¿Seguro que quieres eliminar a{" "}
                            <span className="font-bold">{alumno.nombre}</span>?
                        </h2>
                        <div className="flex justify-between items-center m-auto mt-10 w-1/2">
                            <button
                                className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                onClick={handleCloseModal}
                            >
                                No
                            </button>
                            <button
                                className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                onClick={handleDelete}
                            >
                                Sí
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showEditModal && (
                <div className="fixed inset-0 bg-black text-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="relative bg-white p-6 rounded-md w-4/5 h-[80vh] overflow-hidden custom-scrollbar overflow-y-scroll">
                        <button
                            type="button"
                            className="absolute top-4 right-4 font-bold rounded-full bg-paleta_3 px-4 py-2"
                            onClick={handleCloseModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-black text-center mr-6">
                            Editar alumno
                        </h2>
                        <form onSubmit={handleSubmit}>
                            {/* Nombre */}
                            <div className="mt-4 mb-4">
                                <label className="font-bold">Nombre:</label>
                                <input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    value={editedAlumno.nombre}
                                    onChange={(e) =>
                                        setEditedAlumno({
                                            ...editedAlumno,
                                            nombre: e.target.value,
                                        })
                                    }
                                    className="w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                                />
                            </div>

                            {/* Email */}
                            <div className="mb-2">
                                <label className="font-bold">Email:</label>
                                <Input
                                    type="email"
                                    name="mail"
                                    value={editedAlumno.mail}
                                    onChange={(e) =>
                                        setEditedAlumno({
                                            ...editedAlumno,
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

                            {/* Teléfono */}
                            <div className="mb-2">
                                <label className="font-bold">Teléfono:</label>
                                <Input
                                    type="tel"
                                    id="telefono"
                                    name="telefono"
                                    value={editedAlumno.telefono}
                                    onChange={(e) =>
                                        setEditedAlumno({
                                            ...editedAlumno,
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

                            {/* Deporte */}
                            <div className="mb-2">
                                <label className="font-bold">Deporte:</label>
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
                                                    checked={editedAlumno.deporte.includes(
                                                        deporte.value
                                                    )}
                                                    className="ml-2 w-4 h-4"
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

                            {/* Plan */}
                            <div className="mb-2">
                                <label className="font-bold">Plan:</label>
                                <select
                                    value={editedAlumno.plan}
                                    onChange={handlePlanChange}
                                    className="selectFocus w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                                >
                                    <option value="">Selecciona un plan</option>
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
                                    <option value="Plan Full">Plan Full</option>
                                </select>
                                {errors.plan && (
                                    <p className="text-red-500">
                                        {errors.plan.message}
                                    </p>
                                )}
                            </div>

                            {/* Fecha Comienzo */}
                            <div className="mb-2">
                                <label className="font-bold">
                                    Fecha de Comienzo:
                                </label>
                                <Input
                                    type="date"
                                    name="fechaComienzo"
                                    value={editedAlumno.fechaComienzo}
                                    onChange={(e) =>
                                        setEditedAlumno({
                                            ...editedAlumno,
                                            fechaComienzo: e.target.value,
                                        })
                                    }
                                />
                            </div>

                            {/* Selector Fecha Pago */}
                            <div className="mb-2">
                                <label className="font-bold">
                                    Fecha de Pago:
                                </label>
                                <select
                                    value={
                                        editedAlumno
                                            ? editedAlumno.fechaPago === ""
                                                ? "personalizado"
                                                : editedAlumno.fechaPago
                                            : ""
                                    }
                                    onChange={handleFechaPagoChange}
                                    className="selectFocus w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                                >
                                    <option value="">
                                        Selecciona una opción
                                    </option>
                                    <option value="1-5">1 al 5</option>
                                    <option value="1-10">1 al 10</option>
                                    <option value="personalizado">
                                        Personalizado
                                    </option>
                                </select>
                                {isCustom && (
                                    <input
                                        type="text"
                                        value={
                                            editedAlumno
                                                ? editedAlumno.fechaPago || ""
                                                : ""
                                        }
                                        onChange={handleCustomFechaPagoChange}
                                        className="mt-2 w-full bg-white text-black border-2 border-slate-800 px-4 py-2 rounded-md"
                                    />
                                )}
                                {errors.fechaPago && (
                                    <p className="text-red-500">
                                        {errors.fechaPago.message}
                                    </p>
                                )}
                            </div>

                            {/* Campo Extra: Fecha Personalizada */}
                            {mostrarCampoPersonalizado && (
                                <div className="mb-2">
                                    <label className="font-bold">
                                        Fecha Personalizada:
                                    </label>
                                    <Input
                                        type="number"
                                        value={editedAlumno.fechaPago || ""}
                                        onChange={(e) =>
                                            setEditedAlumno({
                                                ...editedAlumno,
                                                fechaPago: e.target.value,
                                            })
                                        }
                                        placeholder="Día del mes (1-31)"
                                        className="w-full bg-white text-black px-4 py-2 my-2 rounded-md"
                                        min="1"
                                        max="31"
                                    />
                                    {errors.fechaPersonalizada && (
                                        <p className="text-red-500">
                                            {errors.fechaPersonalizada.message}
                                        </p>
                                    )}
                                </div>
                            )}

                            {/* Precio */}
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
                                            value={editedAlumno.precioEfectivo}
                                            className="w-72 bg-white text-black px-4 py-2 my-2 rounded-md"
                                            onChange={
                                                handleChangePrecioEfectivo
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
                                            type="number"
                                            value={
                                                editedAlumno.precioTransferencia
                                            }
                                            className="w-72 bg-white text-black px-4 py-2 my-2 rounded-md"
                                            onChange={
                                                handleChangePrecioTransferencia
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Abono */}
                            <div className="mb-2">
                                <label className="font-bold ml-6">
                                    Abono con:
                                </label>
                                <div className="flex justify-center space-x-8 mt-2">
                                    <div className="flex flex-col items-center">
                                        <div
                                            onClick={() =>
                                                setEditedAlumno({
                                                    ...editedAlumno,
                                                    abonoEfectivo:
                                                        !editedAlumno.abonoEfectivo,
                                                    abonoTransferencia: false, // Desactivar transferencia si se selecciona efectivo
                                                })
                                            }
                                            className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                                                editedAlumno.abonoEfectivo
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {editedAlumno.abonoEfectivo ? (
                                                <span className="text-white font-bold">
                                                    Si
                                                </span>
                                            ) : (
                                                <span className="text-white">
                                                    No
                                                </span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-sm">Efectivo</p>
                                    </div>

                                    <div className="flex flex-col items-center">
                                        <div
                                            onClick={() =>
                                                setEditedAlumno({
                                                    ...editedAlumno,
                                                    abonoTransferencia:
                                                        !editedAlumno.abonoTransferencia,
                                                    abonoEfectivo: false, // Desactivar efectivo si se selecciona transferencia
                                                })
                                            }
                                            className={`w-12 h-12 flex items-center justify-center rounded-full cursor-pointer ${
                                                editedAlumno.abonoTransferencia
                                                    ? "bg-green-500"
                                                    : "bg-red-500"
                                            }`}
                                        >
                                            {editedAlumno.abonoTransferencia ? (
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

                            {/* Buttons */}
                            <div className="flex justify-center items-center gap-8 mt-6">
                                <button
                                    onClick={handleCloseModal}
                                    className="bg-gray-500 text-white px-4 py-2 rounded-md"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Guardar
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

/* Popup.propTypes = {
    onClose: PropTypes.func.isRequired,
    alumno: PropTypes.shape({
        nombre: PropTypes.string.isRequired,
        mail: PropTypes.string,
        telefono: PropTypes.string,
        deporte: PropTypes.string,
        plan: PropTypes.string,
        fechaComienzo: PropTypes.string,
        precioEfectivo: PropTypes.number,
        precioTransferencia: PropTypes.number,
        abono: PropTypes.bool,
        _id: PropTypes.string,
        fechaPago: PropTypes.string,
    }).isRequired,
};
 */
