import React, { useState } from "react";
import "./Components.css";

// Tipagem para os dados de erro e resultado
interface ErrorResponse {
  error_code: string;
  error_description: string;
}

interface RideResult {
  origin: string;
  destination: string;
  distance: number;
  duration: string;
  options: any[];
}

const RideForm: React.FC = () => {
  // Estados
  const [customerId, setCustomerId] = useState<string>("");
  const [origin, setOrigin] = useState<string>("");
  const [destination, setDestination] = useState<string>("");
  const [result, setResult] = useState<RideResult | null>(null); // Tipagem para o resultado
  const [error, setError] = useState<string | null>(null);

  // Função para estimar a viagem
  const estimateRide = async () => {
    try {
      const response = await fetch("http://localhost:8080/ride/estimate", {  // Verifique a URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          customer_id: customerId, // Usar o ID de cliente do estado
          origin,
          destination,
        }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json();
        setError(errorData.error_description || "Erro desconhecido no servidor.");
        setResult(null);
        return;
      }

      const data: RideResult = await response.json();
      setResult(data);
      setError(null);
    } catch (err) {
      console.error("Erro na requisição:", err);
      setError("Erro na comunicação com o servidor.");
    }
  };

  // Manipulador de envio do formulário
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customerId && origin && destination) {
      estimateRide();
    } else {
      setError("Preencha todos os campos.");
    }
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
        <button type="submit" className="button">Calcular</button>
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
