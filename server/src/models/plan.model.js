import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true, // Campo obligatorio
            trim: true, // Elimina espacios en blanco
        },
        precioEfectivo: {
            type: String,
            required: true,
        },
        precioTransferencia: {
            type: String,
            required: true,
        },
    },
    { timestamps: true } // Agrega createdAt y updatedAt
);

export default mongoose.model("Plan", planSchema, "planes");
