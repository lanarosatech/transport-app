import express from "express";
import dotenv from "dotenv";
import rideRoutes from "./routes/rideRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());

// Usar as rotas definidas
app.use("/ride", rideRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
