import { z } from "zod";

export const createPlanSchema = z.object({
    nombre: z.string({
        required_error: "Nombre es requerido",
    }),
    precioEfectivo: z.string({
        required_error: "Precio efectivo es requerido",
    }),
    precioTransferencia: z.string({
        required_error: "Precio transferencia es requerido",
    }),
});

export const editPlanSchema = z.object({
    nombre: z.string().optional(),
    precioEfectivo: z.string().optional(),
    precioTransferencia: z.string().optional(),
});
