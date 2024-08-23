import { useEffect, useState } from "react";
import { Card } from "../ui";
import PropTypes from "prop-types"; // Import PropTypes

export function AlumnoCard({ alumno }) {
    // Estados para manejar el modal eliminar
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [alumnoToDelete, setAlumnoToDelete] = useState(null);

    // Estados para manejar el modal editar
    const [showEditModal, setShowEditModal] = useState(false);
    const [errors, setErrors] = useState({});

    const [pagos, setPagos] = useState(false);

    /* Historico Pagos */

    // Efecto para actualizar los pagos cuando el alumno cambie
    useEffect(() => {
        setPagos(alumno.historicoPagos || []);
    }, [alumno]);

    /* Fin Historico Pagos */

    const [editedAlumno, setEditedAlumno] = useState({
        ...alumno,
        deporte: alumno.deporte || [],
    });

    // Función para manejar cambios en los checkboxes de deportes
    const handleCheckboxChange = (e) => {
        const { value } = e.target;
        let updatedDeportes;

        console.log(value);

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

    // Función para manejar cambios en el selector de plan
    const handlePlanChange = (e) => {
        const { value } = e.target;
        setEditedAlumno({
            ...editedAlumno,
            plan: value,
        });
    };
    // Función para manejar cambios en el selector de fecha de pago
    const handlePagoFrecuenciaChange = (e) => {
        const { value } = e.target;
        setEditedAlumno({
            ...editedAlumno,
            fechaPago: value,
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
    // Y transferencia
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

    // Función para manejar el toggle de abono
    const handleToggleAbono = () => {
        setEditedAlumno({
            ...editedAlumno,
            abono: !editedAlumno.abono,
        });
    };

    // Cerrar modales
    const handleCloseModal = () => {
        setShowDeleteModal(false);
        setShowEditModal(false);
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

    return <Card alumno={alumno}></Card>;
}

AlumnoCard.propTypes = {
    alumno: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        nombre: PropTypes.string.isRequired,
        historicoPagos: PropTypes.arrayOf(
            PropTypes.shape({
                mes: PropTypes.string.isRequired,
            })
        ),
        deporte: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(PropTypes.string),
        ]),
        estado: PropTypes.string,
        plan: PropTypes.string.isRequired,
        fechaPago: PropTypes.string.isRequired,
        precioEfectivo: PropTypes.string,
        precioTransferencia: PropTypes.string,
        abono: PropTypes.bool,
    }).isRequired,
};
