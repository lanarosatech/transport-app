import { Request, Response, NextFunction } from "express";
import { calculateRoute } from "../services/googleMapsService";
import { addRide, getRidesByCustomerId } from "../models/rideModel";

export const estimateRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const { distance, duration, route } = await calculateRoute(origin, destination).catch((err) => {
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
    const options = drivers.map((driver) => ({
      ...driver,
      value: (distance * driver.price_per_km).toFixed(2), // Valor total em reais
    }));

    res.status(200).json({
      origin: { latitude: route.legs[0].start_location.lat, longitude: route.legs[0].start_location.lng },
      destination: { latitude: route.legs[0].end_location.lat, longitude: route.legs[0].end_location.lng },
      distance,
      duration,
      options,
      routeResponse: route,
    });
  } catch (error) {
    next(error); // Delegar erros para o middleware de erro
  }
};

export const confirmRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const ride = addRide({
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
  } catch (error) {
    next(error); // Delegar erros para o middleware de erro
  }
};

export const getRides = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
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
    const rides = getRidesByCustomerId(customer_id, driver_id ? Number(driver_id) : undefined)
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
  } catch (error) {
    next(error); // Delegar erros para o middleware de erro
  }
};
