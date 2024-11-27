import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Components.css";

const RideOptions: React.FC = () => {
  const [options, setOptions] = useState<any[]>([]); // Para armazenar as opções de motoristas
  const [error, setError] = useState<string | null>(null); // Para armazenar o erro
  const [loading, setLoading] = useState<boolean>(true); // Para controlar o estado de carregamento

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ride/options");
        setOptions(response.data.options);
      } catch (error) {
        console.error("Erro ao buscar opções", error);
        setError("Erro ao carregar opções de motoristas.");
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div className="container">
      <h2 className="heading">Motoristas</h2>

      {/* Exibindo mensagem de carregamento */}
      {loading && <p>Carregando motoristas...</p>}

      {/* Exibindo erro caso ocorra */}
      {error && <p className="error">{error}</p>}

      {/* Exibindo as opções se estiverem disponíveis */}
      {!loading && !error && options.length === 0 && <p>Sem motoristas disponíveis no momento.</p>}

      <div className="result">
        {!loading && !error && options.length > 0 && (
          <div>
            {options.map((option: any) => (
              <div key={option.id} className="option-card">
                <p><strong>Nome:</strong> {option.name}</p>
                <p><strong>Carro:</strong> {option.vehicle}</p>
                <p><strong>Avaliação:</strong> {option.review.rating}</p>
                <p><strong>Valor:</strong> R$ {option.value.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideOptions;
