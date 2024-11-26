import { Router } from "express";
import { estimateRide, confirmRide, getRides } from "../controllers/rideController";

const router = Router();

// Definir as rotas para o recurso "ride"
router.post("/estimate", estimateRide);
router.post("/confirm", confirmRide);
router.get("/:customer_id", getRides);

export default router;
