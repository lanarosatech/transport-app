import React, { useState } from "react";
import api from "../services/apiService";

const RideForm: React.FC = () => {
  const [formData, setFormData] = useState({
    customer_id: "",
    origin: "",
    destination: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false); // Estado para carregamento

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fetchRideEstimate = async (data: { customer_id: string; origin: string; destination: string }) => {
    try {
      const response = await api.post("/ride/estimate", data);
      console.log("Estimativa de viagem:", response.data);
      localStorage.setItem("rideEstimate", JSON.stringify(response.data));
      window.location.href = "/options"; // Redireciona após sucesso
    } catch (error: any) {
      console.error("Erro ao buscar estimativa de viagem:", error);
      setMessage(error.response?.data?.error_description || "Erro ao conectar com o servidor.");
    }
  };


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validações de formulário
    if (!formData.customer_id.trim() || !formData.origin.trim() || !formData.destination.trim()) {
      setMessage("Todos os campos são obrigatórios.");
      return;
    }

    setMessage(null); // Limpar mensagens de erro antes da nova tentativa
    fetchRideEstimate(formData);
  };

  return (
    <div>
      <h1>Solicitação de Viagem</h1>
      <form onSubmit={handleSubmit}>
        <input
          name="customer_id"
          placeholder="ID do Usuário"
          value={formData.customer_id} // Mantém o valor no campo
          onChange={handleChange}
          required
        />
        <input
          name="origin"
          placeholder="Origem"
          value={formData.origin} // Mantém o valor no campo
          onChange={handleChange}
          required
        />
        <input
          name="destination"
          placeholder="Destino"
          value={formData.destination} // Mantém o valor no campo
          onChange={handleChange}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Calculando..." : "Calcular Estimativa"}
        </button>
      </form>
      {message && <p>{message}</p>} {/* Exibe mensagens de erro ou sucesso */}
    </div>
  );
};

export default RideForm;
