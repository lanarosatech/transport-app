import React, { useState } from "react";
import "./Components.css";

const RideHistory: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>("");
  const [driverId, setDriverId] = useState<string>(""); // Novo estado para o código do motorista
  const [rides, setRides] = useState<any[]>([]); // Para armazenar as viagens
  const [error, setError] = useState<string | null>(null);

  const fetchHistory = async () => {
    let url = "http://localhost:8080/ride/history"; // Endpoint padrão
    const params: any = {}; // Inicializamos um objeto de parâmetros

    if (customerId) {
      params.customer_id = customerId;
    }
    if (driverId) {
      params.driver_id = driverId;
    }

    // Construindo a URL com parâmetros dinâmicos
    const queryString = new URLSearchParams(params).toString();
    if (queryString) {
      url = `http://localhost:8080/ride/history?${queryString}`;
    }

    try {
      const response = await fetch(url);

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

      {/* Campo para ID do Cliente */}
      <div className="inputGroup">
        <label htmlFor="customerId" className="label">ID do Cliente:</label>
        <input
          type="text"
          id="customerId"
          value={customerId}
          onChange={(e) => setCustomerId(e.target.value)}
          className="input"
        />
      </div>

      {/* Campo para código do Motorista */}
      <div className="inputGroup">
        <label htmlFor="driverId" className="label">Código do Motorista:</label>
        <input
          type="text"
          id="driverId"
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          className="input"
        />
      </div>

      <button type="button" className="button" onClick={fetchHistory}>Buscar</button>

      {error && <p className="error">{error}</p>}

      <div className="result">
        {rides.length > 0 ? (
          <ul>
            {rides.map((ride) => (
              <li key={ride.id}>
                <p><strong>Data:</strong> {ride.date}</p>
                <p><strong>Origem:</strong> {ride.origin}</p>
                <p><strong>Destino:</strong> {ride.destination}</p>

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
