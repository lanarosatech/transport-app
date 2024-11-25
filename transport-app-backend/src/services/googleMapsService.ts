import axios from "axios";

const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

// Função para calcular a rota entre dois pontos
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

    const route = response.data.routes[0]; // Primeira rota retornada
    const distance = route.legs[0].distance.value / 1000; // Distância em km
    const duration = route.legs[0].duration.text; // Duração em texto

    return {
      distance,
      duration,
      route,
    };
  } catch (error) {
    console.error("Erro ao calcular rota:", error);
    throw new Error("Erro ao calcular rota com o Google Maps.");
  }
};
