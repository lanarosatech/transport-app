"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculateRoute = void 0;
const axios_1 = __importDefault(require("axios"));
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
// Função para calcular a rota entre dois pontos
const calculateRoute = (origin, destination) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`https://maps.googleapis.com/maps/api/directions/json`, {
            params: {
                origin,
                destination,
                key: GOOGLE_API_KEY,
            },
        });
        const route = response.data.routes[0]; // Primeira rota retornada
        const distance = route.legs[0].distance.value / 1000; // Distância em km
        const duration = route.legs[0].duration.text; // Duração em texto
        return {
            distance,
            duration,
            route,
        };
    }
    catch (error) {
        console.error("Erro ao calcular rota:", error);
        throw new Error("Erro ao calcular rota com o Google Maps.");
    }
});
exports.calculateRoute = calculateRoute;
