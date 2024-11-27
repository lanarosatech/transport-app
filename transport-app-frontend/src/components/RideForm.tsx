import React, { useState } from "react";
import "./Components.css";

const RideForm: React.FC = () => {
  const [customerId, setCustomerId] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [result, setResult] = useState<any>(null); // Para exibir os resultados
  const [error, setError] = useState<string | null>(null);

  const estimateRide = async () => {
    const response = await fetch("http://transport-app-backend:8080/ride/estimate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customer_id: "1",
        origin: "Av. Paulista, São Paulo",
        destination: "Praça da Sé, São Paulo",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      setError(errorData.error_description || "Erro desconhecido no servidor.");
      setResult(null);
      return;
    }

    const data = await response.json();
    setResult(data);
    setError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Evitar o reload da página
    estimateRide();
  };

  return (
    <div className="container">
      <h2 className="heading">Calcular Viagem</h2>
      <form onSubmit={handleSubmit} className="form">
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
        <div className="inputGroup">
          <label htmlFor="origin" className="label">Origem:</label>
          <input
            type="text"
            id="origin"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            required
            className="input"
          />
        </div>
        <div className="inputGroup">
          <label htmlFor="destination" className="label">Destino:</label>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">calcular</button>
      </form>

      {error && <p className="error">Erro: {error}</p>}

      {result && (
        <div className="result">
          <h3>Resultado:</h3>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default RideForm;
