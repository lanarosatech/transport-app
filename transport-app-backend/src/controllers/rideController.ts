import { Request, Response, NextFunction } from 'express';
import { calculateRoute } from '../services/googleMapsService';
import { addRide, getRidesByCustomerId, getAllDrivers } from '../models/rideModel';

// Definir a interface Driver
interface Driver {
  id: number;
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
    const { distance, duration } = await calculateRoute(origin, destination).catch((err) => {
      console.error("Erro na API do Google Maps:", err);
      res.status(500).json({
        error_code: "MAPS_API_ERROR",
        error_description: "Erro ao calcular a rota. Tente novamente mais tarde.",
      });
      throw err;
    });

    // Buscar motoristas disponíveis
    const drivers: Driver[] = await getAllDrivers();  // Agora está explicitamente tipado como um array de Driver

    // Calcular o valor total para cada motorista
    const options = drivers.map((driver) => ({
      ...driver,
      value: (distance * driver.price_per_km).toFixed(2), // Valor total em reais
    }));

    res.status(200).json({
      origin,
      destination,
      distance,
      duration,
      options,
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
      driver: driverData, // Agora você está passando o driver corretamente
      value,
      date: new Date().toISOString(),
    });

    res.status(200).json({ success: true, ride });
  } catch (error) {
    next(error); // Delegar erros para o middleware de erro
  }
};

// Buscar corridas por cliente
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

    // Buscar corridas do cliente
    const rides = await getRidesByCustomerId(customer_id, driver_id ? Number(driver_id) : undefined);

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

// Buscar todos os motoristas
export const getDrivers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const drivers = await getAllDrivers(); // Busca todos os motoristas do banco
    res.status(200).json({ drivers });
  } catch (error) {
    next(error); // Delegar erros para o middleware de erro
  }
};
