import React, { useState } from "react";
import { FaDollarSign } from "react-icons/fa";
import { usePlan } from "../../context/PlanContext";

const PlanCard = ({ plan }) => {
    const [editMode, setEditMode] = useState(false);
    const [localPlan, setLocalPlan] = useState({ ...plan });
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    // Estados para eliminar plan
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [planToDelete, setPlanToDelete] = useState(null);

    // Eliminar
    const { deletePlan, updatePlan } = usePlan();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setLocalPlan((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleCloseModal = () => {
        setShowDeleteModal(false);
        //setShowEditModal(false);
        setPlanToDelete(null);
    };

    // -- ELIMINAR -- \\
    // Abrir modal confirmar eliminar alumno
    const handleOpenDeleteModal = (id) => {
        setPlanToDelete(id);
        setShowDeleteModal(true);
    };
    // Eliminar alumno confirmado
    const handleDelete = () => {
        deletePlan(planToDelete);
        setShowDeleteModal(false);
        setPlanToDelete(null);
    };

    // -- EDITAR -- \\
    const handleCancelEdit = () => {
        setLocalPlan({ ...plan });
        setEditMode(false);
    };
    const handleEdit = () => {
        updatePlan(localPlan._id, localPlan);
        //console.log(localPlan._id, localPlan.precioEfectivo);
        setEditMode(false);
    };

    /*     const handleSave = () => {
        onUpdate(localPlan);
        setEditMode(false);
    }; */

    return (
        <div className="mt-5 mb-6 px-4">
            <h1 className="text-xl font-bold text-center my-4">
                {plan.nombre}
            </h1>
            <div className="flex items-center mb-2">
                <label className="w-1/3">Efectivo</label>
                <FaDollarSign />
                <input
                    type="text"
                    name="precioEfectivo"
                    value={localPlan.precioEfectivo}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className={`w-2/3 border border-gray-300 rounded px-2 py-1 ${
                        editMode ? "bg-white" : "bg-gray-300"
                    }`}
                />
            </div>

            <div className="flex items-center mb-2">
                <label className="w-1/3">Transferencia</label>
                <FaDollarSign />
                <input
                    type="text"
                    name="precioTransferencia"
                    value={localPlan.precioTransferencia}
                    onChange={handleInputChange}
                    readOnly={!editMode}
                    className={`w-2/3 border border-gray-300 rounded px-2 py-1 ${
                        editMode ? "bg-white" : "bg-gray-300"
                    }`}
                />
            </div>

            <div className="flex justify-center mt-4 gap-4 border-b-4 border-gray-600 pb-5">
                {editMode ? (
                    <>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            onClick={handleCancelEdit}
                        >
                            Cancelar
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            onClick={handleEdit}
                        >
                            Guardar
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            className="bg-gray-500 text-white px-4 py-2 rounded-md"
                            onClick={() => handleOpenDeleteModal(plan._id)}
                        >
                            Eliminar
                        </button>
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded-md"
                            onClick={() => setEditMode(true)}
                        >
                            Editar
                        </button>
                    </>
                )}
            </div>

            {/* Modal para confirmar eliminación */}
            {showDeleteModal && (
                <div className="fixed inset-0 text-black bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-5 rounded-md w-4/5 h-auto">
                        <h2 className="text-xl text-black text-center">
                            ¿Seguro que quieres eliminar a{" "}
                            <span className="font-bold">{plan.nombre}</span>?
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
        </div>
    );
};

export default PlanCard;
