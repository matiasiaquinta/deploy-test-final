/*
    Explicación:

    #1: Actualizar estados sin necesidad de refrescar la pagina.
    En cada estado, cuando utilizo if res.status 204 o 200 -> lo que hago es actualizar
    los valores sin necesidad de refrescar la pagina, porque recorre y cambia el valor.
    Modificando setAlumnos.


*/

import { createContext, useContext, useState } from "react";
import {
    createAlumnoRequest,
    deleteAlumnoRequest,
    getAlumnoRequest,
    getAlumnosRequest,
    updateAlumnoRequest,
} from "../api/alumnos";

const AlumnosContext = createContext();

export const useAlumnos = () => {
    const context = useContext(AlumnosContext);
    if (!context)
        throw new Error("useAlumnos must be used within a UserProvider");
    return context;
};

export function AlumnoProvider({ children }) {
    const [alumnos, setAlumnos] = useState([]);
    const [pagos, setPagos] = useState([]);

    const getAlumnos = async (alumnos) => {
        try {
            const res = await getAlumnosRequest(alumnos);
            setAlumnos(res.data); // Actualiza el estado con los datos recibidos
        } catch (error) {
            console.error("Error al obtener alumnos:", error);
        }
    };

    const createAlumno = async (alumno) => {
        try {
            const res = await createAlumnoRequest(alumno);
            //console.log("create", res);
            setAlumnos([...alumnos, res]);
        } catch (error) {
            console.error("Error agregando el alumno:", error);
        }
    };

    const deleteAlumno = async (id) => {
        try {
            const res = await deleteAlumnoRequest(id);
            console.log("delete", res);
            if (res.status === 204)
                setAlumnos(alumnos.filter((alumno) => alumno._id != id));
        } catch (error) {
            console.error("Error eliminando el alumno:", error);
        }
    };

    const updateAlumno = async (id, alumno) => {
        try {
            console.log("El alumno a actualizar es:", alumno.nombre, id);
            console.log("Sus datos:", alumno);

            // Realizar la solicitud HTTP para actualizar el alumno
            const res = await updateAlumnoRequest(id, alumno);

            // Verificar si la actualización fue exitosa en el servidor
            if (res.status === 200) {
                // Actualizar el estado local de los alumnos
                setAlumnos(alumnos.map((a) => (a._id === id ? res.data : a)));

                console.log("Alumno actualizado exitosamente:", res.data);

                // Mostrar en consola los datos del historial de pagos si se registró un nuevo pago
                if (res.data.historicoPagos) {
                    console.log(
                        "Historial de pagos actualizado:",
                        res.data.historicoPagos
                    );

                    // Aquí puedes actualizar el estado del historial de pagos si es necesario
                    setPagos(res.data.historicoPagos);
                }
            } else {
                throw new Error("Error al actualizar el alumno");
            }
        } catch (error) {
            console.error("Error actualizando el alumno:", error);
            // Manejar el error aquí
            throw error;
        }
    };

    const getAlumno = async (id) => {
        try {
            const res = await getAlumnoRequest(id);
            return res.data;
            //console.log(res);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <AlumnosContext.Provider
            value={{
                alumnos,
                getAlumnos,
                createAlumno,
                deleteAlumno,
                getAlumno,
                updateAlumno,
            }}
        >
            {children}
        </AlumnosContext.Provider>
    );
}
