import { Router } from "express";

import {
    createAlumno,
    deleteAlumno,
    getAlumno,
    getAlumnos,
    updateAlumno,
    getAlumnosStats,
} from "../controllers/alumnos.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import {
    createAlumnoSchema,
    editAlumnoSchema,
} from "../schemas/alumno.schema.js";
import { getAlumnosPagos } from "../controllers/pago.controller.js";

const router = Router();

// Ruta para mostrar todos los alumnos
router.get("/alumnos", auth, getAlumnos);

// Ruta para mostrar información de todos los alumnos
router.get("/alumnos/stats", auth, getAlumnosStats);

// Ruta para mostrar pagos en Reportes
router.get("/alumnos/pagos", auth, getAlumnosPagos);

// Ruta para obtener el esquema de Alumno
/* router.get("/schema/alumno", auth, (req, res) => {
    res.json(createAlumnoSchema);
}); */

// validateSchema -> es para detectar errores.
router.post("/alumnos", auth, validateSchema(createAlumnoSchema), createAlumno);

// Obtener un alumno por ID
router.get("/alumnos/:id", auth, getAlumno);

// Actualizar un alumno existente con validación de esquema
router.put(
    "/alumnos/:id",
    auth,
    validateSchema(editAlumnoSchema),
    updateAlumno
);

// Eliminar un alumno por ID
router.delete("/alumnos/:id", auth, deleteAlumno);

export default router;
