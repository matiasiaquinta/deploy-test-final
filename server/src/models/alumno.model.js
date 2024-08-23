import mongoose from "mongoose";

const alumnoSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true,
        },
        mail: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            match: /.+\@.+\..+/,
        },
        telefono: {
            type: String,
            trim: true,
        },
        deporte: {
            type: String,
            required: true,
        },
        plan: {
            type: String,
            required: true,
            trim: true,
        },
        fechaComienzo: {
            type: String,
            required: true,
            trim: true,
        },
        fechaPago: {
            type: String,
            required: true,
            trim: true,
            //enum: ["1-5", "1-10", "1-31"],
        },
        precioEfectivo: {
            type: String,
            required: true,
            trim: true,
        },
        precioTransferencia: {
            type: String,
            required: true,
            trim: true,
        },
        abono: {
            type: Boolean,
            default: false,
        },
        abonoEfectivo: {
            type: Boolean,
            default: false,
        },
        abonoTransferencia: {
            type: Boolean,
            default: false,
        },
        historicoPagos: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Pago", // Referencia al modelo Pago
            },
        ],
    },
    { timestamps: true }
);

export default mongoose.model("Alumno", alumnoSchema, "alumnos");
