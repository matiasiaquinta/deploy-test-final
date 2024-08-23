/*
    Aca estan todas las funciones relacionadas con obtener
    los datos de los planes del backend
*/

//import { createPlanSchema } from "../../../server/src/schemas/plan.schema";
import axios from "./axios";

// Obtiene todos los planes
export const getPlanesRequest = () => axios.get("/planes");

// Obtiene un plan específico
export const getPlanRequest = (id) => axios.get(`/planes/${id}`);

// Crear Plan
export const createPlanRequest = async (plan) => {
    try {
        // Validar los datos del plan usando el esquema de Zod
        //createPlanSchema.parse(plan);

        // Si pasa la validación, enviar la solicitud al servidor
        const response = await axios.post("/planes", plan);
        return response.data;
    } catch (error) {
        console.error(
            "Error al crear el plan:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};

// Actualizar Plan
export const updatePlanRequest = (id, plan) => axios.put(`/planes/${id}`, plan);

// Eliminar Plan
export const deletePlanRequest = (id) => axios.delete(`/planes/${id}`);
