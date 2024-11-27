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
        // URL corrigida para o backend
        const response = await axios.get("http://localhost:8080/ride/drivers");
        setOptions(response.data.drivers); // Usando a chave correta 'drivers'
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
      <h2 className="heading">Motoristas Parceiros</h2>

      {/* Exibindo mensagem de carregamento */}
      {loading && <p>Carregando motoristas...</p>}

      {/* Exibindo erro caso ocorra */}
      {error && <p className="error">{error}</p>}

      {/* Exibindo as opções se estiverem disponíveis */}
      {!loading && !error && options.length === 0 && <p>Sem motoristas disponíveis no momento.</p>}

      {/* Exibindo os motoristas */}
      <div className="result">
        {!loading && !error && options.length > 0 && (
          <div className="drivers-list">
            {options.map((option: any) => (
              <div key={option.driver_id} className="option-card">
                <div className="card-header">
                  <h3>{option.name}</h3>
                  <p className="vehicle">{option.vehicle}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RideOptions;
