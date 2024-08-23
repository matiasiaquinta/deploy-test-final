import Alumno from "../models/alumno.model.js";
import Pago from "../models/pago.model.js";
import {
    createAlumnoSchema,
    editAlumnoSchema,
} from "../schemas/alumno.schema.js";

/* 
export const getAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.find({ user: req.user.id }).populate(
            "user"
        );
        res.json(alumnos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}; 
*/

/* export const getAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.find();
        res.json(alumnos);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
}; */

export const getAlumnos = async (req, res) => {
    try {
        // Población de los pagos
        const alumnos = await Alumno.find().populate({
            path: "historicoPagos", // El campo en el esquema de Alumno que se refiere a Pago
            select: "mes año abono", // Campos que quieres seleccionar del modelo Pago
        });

        res.status(200).json(alumnos); // Devuelve la lista de alumnos con los detalles completos de los pagos
    } catch (error) {
        console.error("Error al obtener alumnos:", error);
        res.status(500).json({ message: error.message });
    }
};

/* Esto me devuelve la información de mi DASHBOARD */
export const getAlumnosStats = async (req, res) => {
    try {
        const alumnos = await Alumno.find();

        // Calcular estadísticas
        const totalAlumnos = alumnos.length;
        const abonaron = alumnos.filter((alumno) => alumno.abono).length;
        const noAbonaron = totalAlumnos - abonaron;

        // Obtener usuarios que no abonaron
        const alumnosNoAbonaron = alumnos.filter((alumno) => !alumno.abono);

        res.status(200).json({
            totalAlumnos,
            abonaron,
            noAbonaron,
            alumnosNoAbonaron, // Agregar esto a la respuesta
        });
    } catch (error) {
        console.error("Error al obtener alumnos y estadísticas:", error);
        res.status(500).json({ message: error.message });
    }
};

/*
export const createAlumno = async (req, res) => {
    try {
        //const { title, description, date } = req.body;
        const { nombre } = req.body;
        const newAlumno = new Alumno({
            nombre,
            user: req.user.id,
        });
        await newAlumno.save();
        res.json(newAlumno);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
*/

export const createAlumno = async (req, res) => {
    try {
        // Validar los datos del cuerpo de la solicitud (req.body)
        const validatedData = createAlumnoSchema.parse(req.body);

        // Crear un nuevo objeto Alumno con los datos validados
        const newAlumno = new Alumno({
            nombre: validatedData.nombre,
            mail: validatedData.mail,
            telefono: validatedData.telefono,
            deporte: validatedData.deporte,
            plan: validatedData.plan,
            fechaComienzo: validatedData.fechaComienzo,
            fechaPago: validatedData.fechaPago,
            precioEfectivo: validatedData.precioEfectivo,
            precioTransferencia: validatedData.precioTransferencia,
            abono: validatedData.abono,
            abonoEfectivo: validatedData.abonoEfectivo,
            abonoTransferencia: validatedData.abonoTransferencia,
        });

        // Guardar el nuevo alumno en la base de datos
        await newAlumno.save();

        // Responder con el nuevo alumno creado
        res.json(newAlumno);
    } catch (error) {
        // Manejar errores de validación de Zod o errores de base de datos
        return res.status(400).json({ message: error.errors ?? error.message });
    }
};

export const updateAlumno = async (req, res) => {
    try {
        // Validar los datos recibidos en la solicitud
        const validatedData = editAlumnoSchema.parse(req.body);

        // Buscar el alumno antes de actualizar
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            return res.status(404).json({ message: "Alumno no encontrado" });
        }

        let nuevoPagoId = null;

        // Verificar si 'abonoEfectivo' o 'abonoTransferencia' ha cambiado
        const hoy = new Date();
        const mes = hoy.toLocaleString("es-ES", { month: "long" });
        const año = hoy.getFullYear();

        // Total de la cuota basado en el plan
        const totalCuota = validatedData.abonoEfectivo
            ? parseFloat(alumno.precioEfectivo.replace(/\./g, "")) // Elimina los puntos antes de parsear
            : validatedData.abonoTransferencia
            ? parseFloat(alumno.precioTransferencia.replace(/\./g, "")) // Elimina los puntos antes de parsear
            : 0;

        if (
            (validatedData.abonoEfectivo && !alumno.abonoEfectivo) ||
            (validatedData.abonoTransferencia && !alumno.abonoTransferencia)
        ) {
            // Verificar si el pago ya existe en el historial del alumno
            const pagoExistente = await Pago.findOne({
                alumnoId: alumno._id,
                mes,
                año,
            });

            if (!pagoExistente) {
                // Crear el nuevo registro de pago
                const nuevoPago = new Pago({
                    alumnoId: alumno._id,
                    nombre: alumno.nombre,
                    mes,
                    año,
                    abonoEfectivo: validatedData.abonoEfectivo,
                    abonoTransferencia: validatedData.abonoTransferencia,
                    total: totalCuota, // Asegúrate de que total es un número
                });

                // Guardar el nuevo pago en la base de datos
                const pagoGuardado = await nuevoPago.save();

                // Agregar el ID del nuevo pago al historial de pagos del alumno
                alumno.historicoPagos.push(pagoGuardado._id);

                nuevoPagoId = pagoGuardado._id;

                console.log("Nuevo abono registrado:", pagoGuardado);
            }
        }

        // Actualizar los datos del alumno
        for (const key in validatedData) {
            alumno[key] = validatedData[key];
        }

        // Guardar el alumno actualizado
        const alumnoUpdated = await alumno.save();

        // Obtener el historial de pagos completo
        const alumnoConPagos = await Alumno.findById(
            alumnoUpdated._id
        ).populate("historicoPagos"); // Poblamos el campo 'historicoPagos'

        // Enviar la respuesta al cliente
        res.json({
            ...alumnoConPagos.toObject(),
            nuevoPagoId, // Incluye el ID del nuevo pago en la respuesta si hay
        });
    } catch (error) {
        console.error("Error al actualizar el alumno:", error);
        return res.status(500).json({ message: error.message });
    }
};

//OLD
/* export const updateAlumno = async (req, res) => {
    try {
        // Validar los datos recibidos en la solicitud
        const validatedData = editAlumnoSchema.parse(req.body);

        // Buscar el alumno antes de actualizar
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            return res.status(404).json({ message: "Alumno no encontrado" });
        }

        let nuevoPagoId = null;

        // Verificar si 'abono' ha cambiado de 'false' a 'true'
        if (validatedData.abono && !alumno.abono) {
            const today = new Date();
            const mes = today.toLocaleString("es-ES", { month: "long" });
            const año = today.getFullYear();

            // Verificar si el pago ya existe en el historial del alumno
            const pagoExistente = await Pago.findOne({
                alumnoId: alumno._id,
                mes,
                año,
            });

            if (!pagoExistente) {
                // Crear el nuevo registro de pago
                const nuevoPago = new Pago({
                    alumnoId: alumno._id,
                    nombre: alumno.nombre,
                    mes,
                    año,
                    abono: "Pagado",
                });

                // Guardar el nuevo pago en la base de datos
                const pagoGuardado = await nuevoPago.save();

                // Agregar el ID del nuevo pago al historial de pagos del alumno
                alumno.historicoPagos.push(pagoGuardado._id);

                nuevoPagoId = pagoGuardado._id;

                console.log("Nuevo abono registrado:", pagoGuardado);
            }
        }

        // Actualizar los datos del alumno
        for (const key in validatedData) {
            alumno[key] = validatedData[key];
        }

        // Guardar el alumno actualizado
        const alumnoUpdated = await alumno.save();

        // Obtener el historial de pagos completo
        const alumnoConPagos = await Alumno.findById(
            alumnoUpdated._id
        ).populate("historicoPagos"); // Poblamos el campo 'historicoPagos'

        // Enviar la respuesta al cliente
        res.json({
            ...alumnoConPagos.toObject(),
            nuevoPagoId, // Incluye el ID del nuevo pago en la respuesta si hay
        });
    } catch (error) {
        console.error("Error al actualizar el alumno:", error);
        return res.status(500).json({ message: error.message });
    }
}; */

export const deleteAlumno = async (req, res) => {
    try {
        const deletedAlumno = await Alumno.findByIdAndDelete(req.params.id);
        if (!deletedAlumno)
            return res.status(404).json({ message: "Alumno no encontrado" });

        return res.sendStatus(204);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

export const getAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno)
            return res.status(404).json({ message: "Alumno no encontrado" });
        return res.json(alumno);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Para manejar quién abonó y quién no, y obtener el historial de pagos
/* export const getAlumnosStats = async (req, res) => {
    try {
        const alumnos = await Alumno.find().populate("historialPagos");
        console.log(alumnos)

        const totalAlumnos = alumnos.length;

        // Alumnos que abonaron
        const abonaron = alumnos.filter((alumno) => alumno.abono).length;

        // Alumnos que no abonaron
        const noAbonaron = totalAlumnos - abonaron;

        // Historial de pagos por alumno
        const historialPagos = alumnos.map((alumno) => ({
            nombre: alumno.nombre,
            historialPagos: alumno.historicoPagos.map((pago) => ({
                mes: pago.mes,
                año: pago.año,
                abono: pago.abono,
            })),
        }));

        res.status(200).json({
            totalAlumnos,
            abonaron,
            noAbonaron,
            historialPagos,
        });
    } catch (error) {
        console.error("Error al obtener estadísticas:", error);
        res.status(500).json({ message: error.message });
    }
};
 */
