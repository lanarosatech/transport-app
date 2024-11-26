"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const rideRoutes_1 = __importDefault(require("./routes/rideRoutes"));
const cors_1 = __importDefault(require("cors"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 8080;
// Configuração do CORS para permitir conexões do frontend
app.use((0, cors_1.default)({
    origin: "http://localhost:80", // URL do frontend
    methods: ["GET", "POST", "PATCH", "DELETE"], // Métodos permitidos
    allowedHeaders: ["Content-Type"], // Cabeçalhos permitidos
}));
// Configurar para interpretar JSON antes das rotas
app.use(express_1.default.json());
// Usar as rotas definidas
app.use("/ride", rideRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
