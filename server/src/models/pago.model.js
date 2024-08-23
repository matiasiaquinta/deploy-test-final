/*
    Esto es para llevar un seguimiento de que meses pago el cliente
    La logica es cuando se pone que abono, automaticamente detecta
    los datos y los guarda en esta tabla pagos
*/

import mongoose from "mongoose";

const pagoSchema = new mongoose.Schema(
    {
        alumnoId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: "Alumno", // Referencia al modelo Alumno
        },
        nombre: {
            type: String,
            required: true,
        },
        mes: {
            type: String,
            required: true,
        },
        año: {
            type: Number,
            required: true,
        },
        abonoEfectivo: {
            type: Boolean,
            default: false,
        },
        abonoTransferencia: {
            type: Boolean,
            default: false,
        },
        total: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default mongoose.model("Pago", pagoSchema, "historialPagos");
