import app from "./app.js";

app.listen(4000, () => {
    console.log("Listening on port 4000");
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
