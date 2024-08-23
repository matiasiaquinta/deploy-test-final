import Plan from "../models/plan.model.js";
import { createPlanSchema, editPlanSchema } from "../schemas/plan.schema.js";

// Obtener planes
export const getPlans = async (req, res) => {
    try {
        const plans = await Plan.find();
        res.json(plans);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Crear plan
export const createPlan = async (req, res) => {
    try {
        const validatedData = createPlanSchema.parse(req.body);
        const newPlan = new Plan({
            nombre: validatedData.nombre,
            precioEfectivo: validatedData.precioEfectivo,
            precioTransferencia: validatedData.precioTransferencia,
        });
        await newPlan.save();
        res.json(newPlan);
    } catch (error) {
        return res.status(400).json({ message: error.errors ?? error.message });
    }
};

// Actualizar plan
export const updatePlan = async (req, res) => {
    try {
        const validatedData = editPlanSchema.parse(req.body);
        const planUpdated = await Plan.findByIdAndUpdate(
            req.params.id,
            { $set: validatedData },
            { new: true } // Devolver el plan actualizado
        );

        if (!planUpdated) {
            return res.status(404).json({ message: "Plan no encontrado" });
        }

        return res.json(planUpdated);
    } catch (error) {
        console.error("Error al actualizar el plan:", error);
        return res.status(500).json({ message: error.message });
    }
};

// Eliminar plan
export const deletePlan = async (req, res) => {
    try {
        const deletedPlan = await Plan.findByIdAndDelete(req.params.id);
        if (!deletedPlan)
            return res.status(404).json({ message: "Plan no encontrado" });

        return res.sendStatus(204); // No Content
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Obtener plan por ID
export const getPlan = async (req, res) => {
    try {
        const plan = await Plan.findById(req.params.id);
        if (!plan)
            return res.status(404).json({ message: "Plan no encontrado" });
        return res.json(plan);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
