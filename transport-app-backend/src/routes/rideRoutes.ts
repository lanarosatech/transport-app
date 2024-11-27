import { Router } from "express";
import { estimateRide, confirmRide, getRides, getDrivers } from "../controllers/rideController";

// Criação do roteador
const router = Router();

// Definir as rotas para o recurso "ride"
router.post("/estimate", estimateRide);  // Função de estimativa da viagem
router.post("/confirm", confirmRide);    // Função de confirmação da corrida
router.get("/:customer_id", getRides);   // Função para buscar corridas
router.get("/drivers", getDrivers);      // Função para buscar motoristas

export default router;
