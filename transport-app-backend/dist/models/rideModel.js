"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllRides = exports.addRide = exports.getRidesByCustomerId = void 0;
let rides = [
    {
        id: 1,
        customer_id: "1",
        origin: "Av. Paulista, São Paulo",
        destination: "Praça da Sé, São Paulo",
        distance: 4.6,
        duration: "16 mins",
        driver: {
            id: 1,
            name: "Homer Simpson",
        },
        value: 11.5,
        date: "2024-11-26T10:00:00Z",
    },
    {
        id: 2,
        customer_id: "1",
        origin: "Praça da Sé, São Paulo",
        destination: "Av. Faria Lima, São Paulo",
        distance: 8.2,
        duration: "25 mins",
        driver: {
            id: 2,
            name: "Dominic Toretto",
        },
        value: 41.0,
        date: "2024-11-26T11:00:00Z",
    },
];
// Funções para manipular os dados
const getRidesByCustomerId = (customer_id, driver_id) => {
    if (driver_id) {
        return rides.filter((ride) => ride.customer_id === customer_id && ride.driver.id === driver_id);
    }
    return rides.filter((ride) => ride.customer_id === customer_id);
};
exports.getRidesByCustomerId = getRidesByCustomerId;
const addRide = (ride) => {
    rides.push(ride);
    return ride;
};
exports.addRide = addRide;
// Função para listar todas as viagens (opcional, para debug)
const getAllRides = () => {
    return [...rides]; // Retorna uma cópia para evitar alterações diretas
};
exports.getAllRides = getAllRides;
