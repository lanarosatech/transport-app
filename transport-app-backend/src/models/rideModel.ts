import { Client } from 'pg';

// Conectar ao banco de dados
const client = new Client({
  host: 'localhost',
  database: 'transport_app',
  user: 'postgres',
  password: 'sua-senha', // Substitua pela sua senha do PostgreSQL
  port: 5432,
});

// Conectar ao banco de dados
client.connect();

// Definindo o tipo Driver
interface Driver {
  id: string;
  name: string;
}

// Definindo o tipo Ride
interface Ride {
  id: number;
  customer_id: string;
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  driver_id: number; // O campo driver_id agora é do tipo string, pois é uma chave estrangeira
  value: number;
  date: string;
}

// Função para adicionar uma corrida
export const addRide = async (ride: Ride) => {
  const { customer_id, origin, destination, distance, duration, driver_id, value } = ride;

  try {
    const res = await client.query(
      'INSERT INTO ride_history (customer_id, origin, destination, distance, duration, driver_id, value) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
      [customer_id, origin, destination, distance, duration, driver_id, value]
    );
    return res.rows[0]; // Retorna o registro da corrida inserida
  } catch (err) {
    console.error("Erro ao adicionar a corrida:", err);
    throw err;
  }
};

// Função para buscar corridas de um cliente
export const getRidesByCustomerId = async (customer_id: string, driver_id?: string) => {
  try {
    const query = driver_id
      ? 'SELECT * FROM ride_history WHERE customer_id = $1 AND driver_id = $2'
      : 'SELECT * FROM ride_history WHERE customer_id = $1';

    const res = await client.query(query, driver_id ? [customer_id, driver_id] : [customer_id]);
    return res.rows; // Retorna todas as corridas encontradas
  } catch (err) {
    console.error("Erro ao buscar corridas:", err);
    throw err;
  }
};

// Função para listar todos os motoristas
export const getAllDrivers = async () => {
  try {
    const res = await client.query('SELECT * FROM drivers');
    return res.rows; // Retorna todos os motoristas
  } catch (err) {
    console.error("Erro ao buscar motoristas:", err);
    throw err;
  }
};
