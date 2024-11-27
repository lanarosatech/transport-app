import axios from 'axios';
import { Request, Response, NextFunction } from 'express';

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

export const calculateRoute = async (origin: string, destination: string) => {
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/directions/json`,
      {
        params: {
          origin,
          destination,
          key: GOOGLE_API_KEY,
        },
      }
    );

    // Verifica se há rotas na resposta
    if (response.data.routes.length === 0) {
      throw new Error('Nenhuma rota encontrada.');
    }

    const route = response.data.routes[0]; // Primeira rota retornada
    const distance = route.legs[0].distance.value / 1000; // Distância em km
    const duration = route.legs[0].duration.text; // Duração em texto

    return {
      distance,
      duration,
      route,
    };
  } catch (error) {
    console.error('Erro ao calcular rota:', error);
    throw new Error('Erro ao calcular rota com o Google Maps.');
  }
};

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

    // Chamar a API do Google Maps para calcular a rota
    const { distance, duration, route } = await calculateRoute(origin, destination).catch((err: any) => {
      console.error("Erro na API do Google Maps:", err);
      res.status(500).json({
        error_code: "MAPS_API_ERROR",
        error_description: "Erro ao calcular a rota. Tente novamente mais tarde.",
      });
      throw err;
    });

    res.status(200).json({
      origin,
      destination,
      distance,
      duration,
      route,
    });
  } catch (error) {
    next(error); // Delegar erros para o middleware de erro
  }
};
