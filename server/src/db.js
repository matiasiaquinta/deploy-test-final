/* import mongoose from "mongoose";
import { MONGODB_URI } from "./config.js";

export const connectDB = async (onConnected) => {
    try {
        await mongoose.connect(MONGODB_URI, { dbName: "sinfronteras-api" });
        console.log("MongoDB is connected");

        // Llama al callback después de la conexión exitosa
        if (onConnected) onConnected();
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }
};
 */
