import { Router } from "express";

import {
    login,
    logout,
    profile,
    register,
    verifyToken,
} from "../controllers/auth.controller.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { loginSchema, registerSchema } from "../schemas/auth.schema.js";
import { auth } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", auth, profile);
router.get("/verify", verifyToken);

export default router;
