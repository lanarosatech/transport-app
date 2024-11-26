import express from "express";
import dotenv from "dotenv";
import rideRoutes from "./routes/rideRoutes";
import cors from "cors";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

// Permitir todas as origens (apenas para testes locais)
app.use(cors({
  origin: "http://localhost:80" // ou o endereço correto do seu frontend
}));


// Configurar para interpretar JSON antes das rotas
app.use(express.json());

// Usar as rotas definidas
app.use("/ride", rideRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
