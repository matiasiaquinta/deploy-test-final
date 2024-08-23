/*
    Aca estan todas las funciones relacionadas con obtener
    los datos de los usuarios del backend

*/

//import { createAlumnoSchema } from "../../../server/src/schemas/alumno.schema";
import axios from "./axios";

// Obtiene todos los alumnos
export const getAlumnosRequest = () => axios.get("alumnos");

// Obtiene las estadísticas de todos los alumnos (para mostrar en dashboard)
export const getAlumnosStatsRequest = async () => {
    try {
        const response = await axios.get("/alumnos/stats");
        return response.data;
    } catch (error) {
        console.error("Error al obtener los alumnos:", error);
        throw error;
    }
};

// Obtiene los pagos de todos los alumnos (para mostrar en reportes)
export const getAlumnosPagosRequest = async (mes, año) => {
    try {
        const response = await axios.get(`/alumnos/pagos`, {
            params: { mes, año },
        });
        return response.data;
    } catch (error) {
        console.error("Error al obtener los pagos:", error);
        throw error;
    }
};

// Obtiene un alumno especifico
export const getAlumnoRequest = (id) => axios.get(`/alumnos/${id}`);
/*
// Crear Alumno
export const createAlumnoRequest = async (alumno) => {
    try {
        // Validar los datos del alumno usando el esquema de Zod
        //createAlumnoSchema.parse(alumno);

        // Si pasa la validación, enviar la solicitud al servidor
        const response = await axios.post("/alumnos", alumno);
        return response.data;
    } catch (error) {
        console.error(
            "Error al crear el alumno:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
}; */

// Crear Alumno con validación
export const createAlumnoRequest = async (alumno) => {
    try {
        // Obtener el esquema del backend
        const schema = await getAlumnoSchemaRequest();

        // Validar los datos del alumno usando Zod
        schema.parse(alumno);

        // Si pasa la validación, enviar la solicitud al servidor
        const response = await axios.post("/alumnos", alumno);
        return response.data;
    } catch (error) {
        console.error(
            "Error al crear el alumno:",
            error.response ? error.response.data : error.message
        );
        throw error;
    }
};

// Actualizar Alumno
export const updateAlumnoRequest = (id, alumno) =>
    axios.put(`/alumnos/${id}`, alumno);

// Eliminar Alumno
export const deleteAlumnoRequest = (id) => axios.delete(`/alumnos/${id}`);
