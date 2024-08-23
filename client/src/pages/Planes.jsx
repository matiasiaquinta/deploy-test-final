import {
    FaDollarSign,
    FaMoneyBill,
    FaNotesMedical,
    FaPlus,
} from "react-icons/fa";
import Layout from "../components/ui/Layout";
import { usePlan } from "../context/PlanContext";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import PlanCard from "../components/planes/PlanCard";
import { Input } from "../components/ui";

// Función para formatear números con separadores de miles
const formatNumberWithCommas = (value) => {
    return value
        .replace(/\D/g, "") // Eliminar todo lo que no sea dígito
        .replace(/\B(?=(\d{3})+(?!\d))/g, "."); // Agregar puntos como separadores de miles
};

const Planes = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
    } = useForm();
    const { planes, getPlanes, createPlan } = usePlan();

    // Mostrar planes
    useEffect(() => {
        getPlanes();
    }, []);

    // Estados para crear planes
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [planToCreate, setPlanToCreate] = useState({
        nombre: "",
        precioEfectivo: "",
        precioTransferencia: "",
    });

    // Abrir modal
    const handleOpenCreateModal = () => {
        setShowCreateModal(true);
    };

    // Cerrar modal
    const handleCloseModal = () => {
        setShowCreateModal(false);
    };

    // Manejar el cambio de input
    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Limpiar el valor y formatear con puntos
        const cleanedValue = value.replace(/\./g, "");
        const formattedValue = formatNumberWithCommas(cleanedValue);

        // Actualizar el estado con el valor formateado
        setPlanToCreate({
            ...planToCreate,
            [name]: formattedValue,
        });
    };

    // Función para crear plan
    const onSubmit = async (data) => {
        try {
            // Crear el objeto con los datos correctos
            const planData = {
                nombre: planToCreate.nombre,
                precioEfectivo: planToCreate.precioEfectivo,
                precioTransferencia: planToCreate.precioTransferencia,
            };
            console.log("Plan a crear", planData);
            await createPlan(planData);
            setShowCreateModal(false);
            //resetForm();
        } catch (error) {
            console.error("Error al crear el plan:", error);
        }
    };

    return (
        <Layout>
            <h1 className="text-3xl uppercase text-center font-bold mt-4">
                Planes
            </h1>

            <hr className="w-52 m-auto border-2 border-paleta_3 mt-2 mb-6" />

            <div className="flex justify-center mb-4">
                <button
                    className="flex items-center text-xl rounded bg-paleta_2 text-white py-3 px-6"
                    onClick={handleOpenCreateModal}
                >
                    <FaPlus className="mr-4" />
                    Crear Plan
                </button>
            </div>

            {/* Modal para crear plan */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="relative bg-white p-6 rounded-md w-4/5 max-h-[90vh] overflow-auto">
                        <button
                            type="button"
                            className="absolute top-4 right-4 font-bold rounded-full bg-paleta_3 px-4 py-2"
                            onClick={handleCloseModal}
                        >
                            ✕
                        </button>
                        <h2 className="text-xl font-bold text-black text-center mr-6">
                            Crear Plan
                        </h2>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            {/* NOMBRE */}
                            <div className="mt-4 mb-2">
                                <label className="font-bold">Nombre:</label>
                                <Input
                                    type="text"
                                    id="nombre"
                                    name="nombre"
                                    placeholder="Escribe el nombre del plan"
                                    {...register("nombre", {
                                        required: "Nombre es requerido",
                                    })}
                                    value={planToCreate.nombre}
                                    onChange={(e) =>
                                        setPlanToCreate({
                                            ...planToCreate,
                                            nombre: e.target.value,
                                        })
                                    }
                                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                />
                                {errors.nombre && (
                                    <p className="text-red-500">
                                        {errors.nombre.message}
                                    </p>
                                )}
                            </div>
                            {/* PRECIO EN EFECTIVO */}
                            <div className="mb-2">
                                <label className="font-bold">
                                    Precio en Efectivo:
                                </label>
                                <Input
                                    type="text"
                                    id="precioEfectivo"
                                    name="precioEfectivo"
                                    placeholder="Escribe el precio en efectivo"
                                    {...register("precioEfectivo", {
                                        required:
                                            "Precio en efectivo es requerido",
                                        min: {
                                            value: 0,
                                            message:
                                                "El precio debe ser mayor o igual a 0",
                                        },
                                    })}
                                    value={planToCreate.precioEfectivo}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                />
                                {errors.precioEfectivo && (
                                    <p className="text-red-500">
                                        {errors.precioEfectivo.message}
                                    </p>
                                )}
                            </div>

                            {/* PRECIO TRANSFERENCIA */}
                            <div className="mb-2">
                                <label className="font-bold">
                                    Precio Transferencia:
                                </label>
                                <Input
                                    type="text"
                                    id="precioTransferencia"
                                    name="precioTransferencia"
                                    placeholder="Escribe el precio de transferencia"
                                    {...register("precioTransferencia", {
                                        required:
                                            "Precio de transferencia es requerido",
                                        min: {
                                            value: 0,
                                            message:
                                                "El precio debe ser mayor o igual a 0",
                                        },
                                    })}
                                    value={planToCreate.precioTransferencia}
                                    onChange={handleInputChange}
                                    className="w-full bg-zinc-700 text-white px-4 py-2 rounded-md"
                                />
                                {errors.precioTransferencia && (
                                    <p className="text-red-500">
                                        {errors.precioTransferencia.message}
                                    </p>
                                )}
                            </div>

                            <div className="flex justify-center mt-8">
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                                >
                                    Crear Plan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="container mx-auto">
                <span className="block text-center mb-4 text-2xl font-bold">
                    Planes Actuales:
                </span>

                <div className="custom-scrollbar h-[calc(100vh-450px)] overflow-y-scroll overflow-hidden border-2 border-slate-800 rounded-lg">
                    {planes.length === 0 ? (
                        <div className="text-center text-gray-500 p-4">
                            <p>No hay planes, agrega uno nuevo.</p>
                        </div>
                    ) : (
                        planes.map((plan) => (
                            <PlanCard key={plan._id} plan={plan} />
                        ))
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Planes;
