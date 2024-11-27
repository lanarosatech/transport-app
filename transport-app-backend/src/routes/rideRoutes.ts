import { Router } from "express";
import { estimateRide, confirmRide, getDrivers, getRideHistory } from "../controllers/rideController";

// Criação do roteador
const router = Router();

// Definir as rotas para o recurso "ride"
router.post("/estimate", estimateRide);  // Função de estimativa da viagem
router.post("/confirm", confirmRide);    // Função de confirmação da corrida
router.get("/drivers", getDrivers);      // Função para buscar motoristas
router.get("/history", getRideHistory);  // Nova rota para buscar histórico de viagens

export default router;
