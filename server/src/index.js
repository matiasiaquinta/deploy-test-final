import app from "./app.js";
import { PORT } from "./config.js";

// Inicia el servidor
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server on port ${PORT}`);
});
/* import { PORT } from "./config.js";
import { connectDB } from "./db.js";

export default async function main() {
    try {
        // Conectar a la base de datos
        await connectDB();

        // Iniciar el servidor
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
        });
    } catch (error) {
        console.error("Error starting the server:", error);
    }
}

main(); */
