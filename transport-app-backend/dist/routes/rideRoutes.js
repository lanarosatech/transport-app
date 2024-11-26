"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// routes/rideRoutes.js ou rideRoutes.ts
const express_1 = require("express");
const rideController_1 = require("../controllers/rideController");
const router = (0, express_1.Router)();
router.post("/estimate", rideController_1.estimateRide);
router.post("/confirm", rideController_1.confirmRide);
router.get("/:customer_id", rideController_1.getRides);
exports.default = router;
// index.js ou index.ts
const express_2 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const rideRoutes_1 = __importDefault(require("./routes/rideRoutes"));
const app = (0, express_2.default)();
const PORT = process.env.PORT || 8080;
app.use((0, cors_1.default)());
app.use(express_2.default.json());
app.use("/ride", rideRoutes_1.default);
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
