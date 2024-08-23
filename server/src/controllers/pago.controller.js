import Pago from "../models/pago.model.js";

export const getAlumnosPagos = async (req, res) => {
    try {
        const { mes, año } = req.query;

        // Mapear el número del mes a su nombre en español
        const meses = [
            "enero",
            "febrero",
            "marzo",
            "abril",
            "mayo",
            "junio",
            "julio",
            "agosto",
            "septiembre",
            "octubre",
            "noviembre",
            "diciembre",
        ];
        const nombreMes = meses[parseInt(mes, 10) - 1]; // Convertir número a nombre del mes

        //console.log("Nombre del mes:", nombreMes);
        //console.log("Recibido año:", año);

        const pagos = await Pago.find({
            mes: nombreMes, // Buscar por el nombre del mes
            año: parseInt(año, 10),
        });

        console.log("Pagos encontrados:", pagos);

        const totalRecaudado = pagos.reduce(
            (total, pago) => total + pago.total,
            0
        );

        //console.log("totalRecaudado", totalRecaudado);

        res.status(200).json({
            totalRecaudado,
        });
    } catch (error) {
        console.error("Error al obtener pagos y estadísticas:", error);
        res.status(500).json({ message: error.message });
    }
};
