import { createContext, useContext, useState } from "react";
import {
    createPlanRequest,
    deletePlanRequest,
    getPlanRequest,
    getPlanesRequest,
    updatePlanRequest,
} from "../api/planes";

const PlanContext = createContext();

export const usePlan = () => {
    const context = useContext(PlanContext);
    if (!context)
        throw new Error("usePlanes must be used within a PlanProvider");
    return context;
};

export function PlanProvider({ children }) {
    const [planes, setPlanes] = useState([]);

    const getPlanes = async () => {
        try {
            const res = await getPlanesRequest();
            setPlanes(res.data);
        } catch (error) {
            console.error("Error al obtener planes:", error);
        }
    };

    const createPlan = async (plan) => {
        try {
            const res = await createPlanRequest(plan);
            setPlanes([...planes, res]);
        } catch (error) {
            console.error("Error agregando el plan:", error);
        }
    };

    const deletePlan = async (id) => {
        try {
            const res = await deletePlanRequest(id);
            if (res.status === 204)
                setPlanes(planes.filter((plan) => plan._id !== id));
        } catch (error) {
            console.error("Error eliminando el plan:", error);
        }
    };

    const updatePlan = async (id, plan) => {
        try {
            //console.log("El alumno a actualizar es:", plan.nombre, id);
            //console.log("Sus datos:", plan);

            const res = await updatePlanRequest(id, plan);
            if (res.status === 200) {
                setPlanes(planes.map((p) => (p._id === id ? res.data : p)));
            } else {
                throw new Error("Error al actualizar el plan");
            }
        } catch (error) {
            console.error("Error actualizando el plan:", error);
            throw error;
        }
    };

    const getPlan = async (id) => {
        try {
            const res = await getPlanRequest(id);
            return res.data;
        } catch (error) {
            console.error("Error al obtener el plan:", error);
        }
    };

    return (
        <PlanContext.Provider
            value={{
                planes,
                getPlanes,
                createPlan,
                deletePlan,
                getPlan,
                updatePlan,
            }}
        >
            {children}
        </PlanContext.Provider>
    );
}
