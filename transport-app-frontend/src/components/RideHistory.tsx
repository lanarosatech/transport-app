import React, { useState } from "react";
import axios from "axios";

const RideHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState("");
  const [rides, setRides] = useState([]);

  const fetchHistory = async () => {
    try {
      const response = await axios.get(`http://localhost:8080/ride/${customerId}`);
      setRides(response.data.rides);
    } catch (error) {
      console.error("Erro ao buscar histórico", error);
    }
  };

  return (
    <div>
      <input
        value={customerId}
        onChange={(e) => setCustomerId(e.target.value)}
        placeholder="ID do Usuário"
      />
      <button onClick={fetchHistory}>Buscar Histórico</button>
      <ul>
        {rides.map((ride: any) => (
          <li key={ride.id}>
            <p>Origem: {ride.origin}</p>
            <p>Destino: {ride.destination}</p>
            <p>Data: {ride.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RideHistory;
