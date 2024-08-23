/*
    Se crea un equema para especificarle a mongoDB
    que tipos de datos voy a tener.
*/

import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
        },
    },
    {
        //me guarda la fecha y hora actual
        timestamps: true,
    }
);

export default mongoose.model("User", userSchema);
