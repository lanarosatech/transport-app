import React, { useState } from "react";
import "./Components.css"; // Certifique-se de importar o arquivo CSS com a fonte

const RideHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>("");
  const [rides, setRides] = useState<any[]>([]); // Para armazenar as viagens
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const response = await fetch(`http://transport-app-backend:8080/ride/${customerId}`);

      if (!response.ok) {
        const errorData = await response.json();
        setError(errorData.error_description || "Erro desconhecido ao buscar histórico.");
        setRides([]);
        return;
      }

      const data = await response.json();
      setRides(data.rides);
      setError(null);
    } catch (err) {
      setError("Erro ao se conectar ao servidor.");
    }
  };

  return (
    <div className="container">
      <h2 className="heading">Histórico de Viagens</h2>
      <div className="inputGroup">
        <label htmlFor="customerId" className="label">ID do Cliente:</label>
        <input
          type="text"
          id="customerId"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          required
          className="input"
        />
      </div>
      <button type="submit" className="button">buscar</button>

      {error && <p className="error">{error}</p>}

      <div className="result">
        {rides.length > 0 ? (
          <ul>
            {rides.map((ride) => (
              <li key={ride.id}>
                <p><strong>Origem:</strong> {ride.origin}</p>
                <p><strong>Destino:</strong> {ride.destination}</p>
                <p><strong>Data:</strong> {ride.date}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Sem viagens ainda.</p> // Aqui está a mensagem quando não há viagens
        )}
      </div>
    </div>
  );
};

export default RideHistory;
