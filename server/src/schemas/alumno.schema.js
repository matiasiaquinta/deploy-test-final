/*

    Aca se valida cada una de las variables.
    Si no la defino, no la guarda en la base de datos.

*/

import { z } from "zod";

export const createAlumnoSchema = z.object({
    nombre: z.string({
        required_error: "Nombre es requerido",
    }),
    mail: z
        .string({
            required_error: "Mail es requerido",
            invalid_error: "Mail no es válido",
        })
        .email(),
    telefono: z.string({
        required_error: "Teléfono es requerido",
    }),
    deporte: z.string({
        required_error: "Deporte es requerido",
    }),
    plan: z.string({
        required_error: "Plan es requerido",
    }),
    fechaComienzo: z.string({
        required_error: "Fecha de comienzo es requerida",
    }),
    fechaPago: z.string({ required_error: "Fecha de pago es requerida" }),
    precioEfectivo: z.string().optional(),
    precioTransferencia: z.string().optional(),
    abono: z.boolean(),
    abonoEfectivo: z.boolean(),
    abonoTransferencia: z.boolean(),
});

export const editAlumnoSchema = z.object({
    nombre: z.string().optional(),
    mail: z.string().optional(),
    telefono: z.string().optional(),
    deporte: z.string().optional(),
    plan: z.string().optional(),
    fechaComienzo: z.string().optional(),
    fechaPago: z.string().optional(),
    precioEfectivo: z.string().optional(),
    precioTransferencia: z.string().optional(),
    abono: z.boolean().optional(),
    abonoEfectivo: z.boolean().optional(),
    abonoTransferencia: z.boolean().optional(),
});
