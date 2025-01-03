import express from "express";
import dotenv from "dotenv";
import rideRoutes from "./routes/rideRoutes";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Configuração do CORS permitindo o front-end rodando na porta 3000
app.use(cors({
  origin: "http://localhost:3000",  // Permitir apenas o front-end rodando na porta 3000
}));

// Configurar para interpretar JSON antes das rotas
app.use(express.json());

// Usar as rotas definidas
app.use("/ride", rideRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
