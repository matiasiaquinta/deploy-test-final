import { Router } from "express";
import {
    createPlan,
    deletePlan,
    getPlan,
    getPlans,
    updatePlan,
} from "../controllers/plan.controller.js";
import { auth } from "../middlewares/auth.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { createPlanSchema, editPlanSchema } from "../schemas/plan.schema.js";

const router = Router();

router.get("/planes", auth, getPlans);

router.post("/planes", auth, validateSchema(createPlanSchema), createPlan);

router.get("/planes/:id", auth, getPlan);

router.put("/planes/:id", auth, validateSchema(editPlanSchema), updatePlan);

router.delete("/planes/:id", auth, deletePlan);

export default router;
