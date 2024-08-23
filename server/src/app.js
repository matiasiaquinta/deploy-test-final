// Primero las importaciones necesarias
import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config"; // Cargar variables de entorno

import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";

// Luego importa las rutas
import authRoutes from "./routes/auth.routes.js";
import alumnosRoutes from "./routes/alumnos.routes.js";
import planRoutes from "./routes/plan.routes.js";
import { FRONTEND_URL, PORT, TOKEN_SECRET } from "./config.js";

// Connecting to MongoDB using Mongoose
mongoose
    .connect(process.env.MONGODB_URI, { dbName: "sinfronteras-api" })
    .then(() => {
        console.log("MongoDB is connected");

        // Listening to requests if DB connection is successful
        app.listen(PORT, "localhost", () =>
            console.log(`Server on port ${PORT}`)
        );
    })
    .catch((err) => console.log(err));

// Sin esto explotaba mi app. Porque no se asignaba el secret
console.log("TOKEN_SECRET:", TOKEN_SECRET);

// Resolving dirname for ES module
/* const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(__dirname); */

const app = express();

app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true, // si necesitas que las cookies sean enviadas entre el frontend y backend
    })
);
// Catch-all para rutas no manejadas, devuelve el index.html
/* app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "build", "index.html"));
}); */

//app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());

// TESTING

/* app.listen(PORT, () => {
    console.log("server started on port 3000");
}); */

app.use("/api/auth", authRoutes);
app.use("/api", alumnosRoutes);
app.use("/api", planRoutes);

/* // Use the client app
app.use(express.static(path.join(__dirname, "../../client/dist")));

// Render client for any path
app.get("*", (req, res) =>
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"))
); */

app.get("/test-db", async (req, res) => {
    try {
        // Realizar una consulta simple para verificar la conexión
        await mongoose.connection.db.command({ ping: 1 });
        res.json({ message: "MongoDB is connected and working" });
    } catch (err) {
        res.status(500).json({
            message: "Error connecting to MongoDB",
            error: err.message,
        });
    }
});

export default app;
