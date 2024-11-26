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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRides = exports.confirmRide = exports.estimateRide = void 0;
const googleMapsService_1 = require("../services/googleMapsService");
const rideModel_1 = require("../models/rideModel");
const estimateRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Requisição recebida:", req.body);
    try {
        const { customer_id, origin, destination } = req.body;
        // Validações
        if (!customer_id || !origin || !destination) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Todos os campos são obrigatórios.",
            });
            return;
        }
        if (origin === destination) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "A origem e o destino devem ser diferentes.",
            });
            return;
        }
        // Chamar o Google Maps API para calcular a rota
        const { distance, duration, route } = yield (0, googleMapsService_1.calculateRoute)(origin, destination).catch((err) => {
            console.error("Erro na API do Google Maps:", err);
            res.status(500).json({
                error_code: "MAPS_API_ERROR",
                error_description: "Erro ao calcular a rota. Tente novamente mais tarde.",
            });
            throw err;
        });
        // Tabela de motoristas e valores
        const drivers = [
            {
                id: 1,
                name: "Homer Simpson",
                description: "Relaxe e aproveite o passeio.",
                vehicle: "Plymouth Valiant 1973",
                review: { rating: 2, comment: "Carro cheira a donuts." },
                price_per_km: 2.5,
            },
            {
                id: 2,
                name: "Dominic Toretto",
                description: "Viagem rápida e segura.",
                vehicle: "Dodge Charger R/T 1970",
                review: { rating: 4, comment: "Carro é um show à parte." },
                price_per_km: 5.0,
            },
            {
                id: 3,
                name: "James Bond",
                description: "Viagem suave e discreta.",
                vehicle: "Aston Martin DB5",
                review: { rating: 5, comment: "Experiência digna de um agente secreto." },
                price_per_km: 10.0,
            },
        ];
        // Calcular o valor total para cada motorista
        const options = drivers.map((driver) => (Object.assign(Object.assign({}, driver), { value: (distance * driver.price_per_km).toFixed(2) })));
        res.status(200).json({
            origin: { latitude: route.legs[0].start_location.lat, longitude: route.legs[0].start_location.lng },
            destination: { latitude: route.legs[0].end_location.lat, longitude: route.legs[0].end_location.lng },
            distance,
            duration,
            options,
            routeResponse: route,
        });
    }
    catch (error) {
        next(error); // Delegar erros para o middleware de erro
    }
});
exports.estimateRide = estimateRide;
const confirmRide = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id, origin, destination, distance, duration, driver, value } = req.body;
        // Validações
        if (!customer_id || !origin || !destination || !driver || !value || !distance || !duration) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "Todos os campos são obrigatórios.",
            });
            return;
        }
        if (origin === destination) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "A origem e o destino devem ser diferentes.",
            });
            return;
        }
        // Salvar viagem usando o RideModel
        const ride = (0, rideModel_1.addRide)({
            id: Date.now(),
            customer_id,
            origin,
            destination,
            distance,
            duration,
            driver,
            value,
            date: new Date().toISOString(),
        });
        res.status(200).json({ success: true, ride });
    }
    catch (error) {
        next(error); // Delegar erros para o middleware de erro
    }
});
exports.confirmRide = confirmRide;
const getRides = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { customer_id } = req.params;
        const { driver_id } = req.query;
        // Validação
        if (!customer_id) {
            res.status(400).json({
                error_code: "INVALID_DATA",
                error_description: "O ID do cliente é obrigatório.",
            });
            return;
        }
        // Buscar viagens do cliente usando o RideModel
        const rides = (0, rideModel_1.getRidesByCustomerId)(customer_id, driver_id ? Number(driver_id) : undefined)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        if (!rides.length) {
            res.status(404).json({
                error_code: driver_id ? "NO_RIDES_WITH_DRIVER" : "NO_RIDES_FOUND",
                error_description: driver_id
                    ? "Nenhuma viagem encontrada para o motorista especificado."
                    : "Nenhuma viagem encontrada para este cliente.",
            });
            return;
        }
        res.status(200).json({ customer_id, rides });
    }
    catch (error) {
        next(error); // Delegar erros para o middleware de erro
    }
});
exports.getRides = getRides;
