import React, { useEffect, useState } from "react";
import axios from "axios";

const RideOptions: React.FC = () => {
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const response = await axios.get("http://localhost:8080/ride/options"); // Atualize com a lógica correta
        setOptions(response.data.options);
      } catch (error) {
        console.error("Erro ao buscar opções", error);
      }
    };

    fetchOptions();
  }, []);

  return (
    <div>
      <h1>Opções de Motoristas</h1>
      {options.map((option: any) => (
        <div key={option.id}>
          <p>Nome: {option.name}</p>
          <p>Carro: {option.vehicle}</p>
          <p>Avaliação: {option.review.rating}</p>
          <p>Valor: R$ {option.value.toFixed(2)}</p>
        </div>
      ))}
    </div>
  );
};

export default RideOptions;
