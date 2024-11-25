import express from "express";
import { estimateRide, confirmRide, getRides } from "../controllers/rideController";

const router = express.Router();

router.post("/estimate", estimateRide);
router.patch("/confirm", confirmRide);
router.get("/:customer_id", getRides);

export default router;
