import xlsx from "xlsx";
import mongoose from "mongoose";

// Conecta a la base de datos de MongoDB
mongoose.connect("mongodb://localhost:27017/sinfronteras-prueba", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Me conecto a la base de datos
//connectDB();

// Define el esquema para los alumnos
const alumnoSchema = new mongoose.Schema({
    nombre: String,
});
const Alumno = mongoose.model("alumno", alumnoSchema);

// Lee el archivo Excel
const workbook = xlsx.readFile("src/assets/sinFronteras_data.xlsx");
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];

// Convierte los datos del Excel a JSON
const data = xlsx.utils.sheet_to_json(sheet);

// Extrae los nombres de los alumnos y guárdalos en la base de datos
async function guardarAlumnos() {
    for (let row of data) {
        let nombre = row["ALUMNO"]; // Asegúrate de que esta columna exista en tu archivo Excel
        try {
            let alumno = new Alumno({ nombre });
            await alumno.save();
            console.log("Alumno guardado exitosamente:", nombre);
        } catch (error) {
            console.error("Error guardando el alumno:", error);
        }
    }
}

guardarAlumnos()
    .then(() => {
        console.log("Todos los alumnos han sido guardados.");
    })
    .catch((error) => {
        console.error("Error al procesar los alumnos:", error);
    });

module.exports = { Alumnos };
