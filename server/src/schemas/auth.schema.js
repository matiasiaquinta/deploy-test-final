import { z } from "zod";

//valido el registro
export const registerSchema = z.object({
    username: z.string({
        required_error: "Usuario es requerido",
    }),
    email: z
        .string({
            required_error: "Email es requerido",
        })
        .email({
            message: "Email no es valido",
        }),
    password: z
        .string({
            required_error: "Contraseña requerida",
        })
        .min(6, { message: "Contraseña tiene que tener 6 caracteres" }),
});

//valido el logeo
export const loginSchema = z.object({
    email: z
        .string({
            required_error: "Email es requerido",
        })
        .email({
            message: "Email no es valido",
        }),
    password: z
        .string({
            required_error: "Contraseña requerida",
        })
        .min(6, { message: "Contraseña tiene que tener 6 caracteres" }),
});
