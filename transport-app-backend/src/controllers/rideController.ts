import { Request, Response, NextFunction } from 'express';
import { calculateRoute } from '../services/googleMapsService';
import { addRide, getAllDrivers, getRidesByCustomerId, getRidesByDriverId } from '../models/rideModel';

// Definir a interface Driver
interface Driver {
  id: string; // Ajustado para string
  name: string;
  vehicle: string;
  price_per_km: number;
  description: string;
  review: {
    rating: number;
    comment: string;
  };
}

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

export const confirmRide = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customer_id, origin, destination, distance, duration, driver, value } = req.body;

    // Validar o tipo de driver
    const driverData: Driver = driver;  // Agora o TypeScript sabe que o driver é do tipo Driver

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

    // Salvar a corrida no banco de dados
    const ride = await addRide({
      id: Date.now(),
      customer_id,
      origin,
      destination,
      distance,
      duration,
      driver_id: driverData.id,  // driver_id é string
      value,
      date: new Date().toISOString(),
    });

    res.status(200).json({ success: true, ride });
  } catch (error) {
    next(error); // Delegar erros para o middleware de erro
  }
};

// Buscar todos os motoristas
export const getDrivers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const drivers = await getAllDrivers(); // Busca os motoristas no banco de dados
    res.json({ drivers });
  } catch (error) {
    console.error("Erro ao buscar motoristas:", error);
    res.status(500).json({
      error_code: "SERVER_ERROR",
      error_description: "Erro ao buscar motoristas.",
    });
  }
};

// Buscar histórico de viagens
export const getRideHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { customer_id, driver_id } = req.query;

    let rides;

    // Verifica se o cliente ou motorista foi fornecido
    if (customer_id) {
      rides = await getRidesByCustomerId(customer_id as string); // Busca corridas pelo ID do cliente
    } else if (driver_id) {
      rides = await getRidesByDriverId(driver_id as string); // Busca corridas pelo código do motorista
    } else {
      res.status(400).json({
        error_code: "INVALID_REQUEST",
        error_description: "É necessário fornecer o ID do cliente ou o código do motorista.",
      });
      return;
    }

    if (!rides || rides.length === 0) {
      res.status(404).json({
        error_code: "NO_RIDES_FOUND",
        error_description: "Nenhuma viagem encontrada.",
      });
      return;
    }

    res.status(200).json({ rides }); // Retorna as corridas encontradas
  } catch (error) {
    console.error("Erro ao buscar histórico de viagens:", error);
    next(error); // Delegar erros para o middleware de erro
  }
};
