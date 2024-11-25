interface Ride {
  id: number;
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver: {
    id: number;
    name: string;
  };
  value: number;
  date: Date;
}

let rides: Ride[] = []; // Simulando um banco de dados em memória

// Função para adicionar uma nova viagem
export const addRide = (ride: Ride): Ride => {
  rides.push(ride);
  return ride;
};

// Função para buscar viagens por usuário
export const getRidesByCustomerId = (customerId: string, driverId?: number): Ride[] => {
  let result = rides.filter(ride => ride.customer_id === customerId);
  if (driverId) {
    result = result.filter(ride => ride.driver.id === driverId);
  }
  return result;
};

// Função para listar todas as viagens (opcional, para debug)
export const getAllRides = (): Ride[] => {
  return rides;
};
