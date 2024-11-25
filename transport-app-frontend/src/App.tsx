import React from 'react';
import RideForm from './components/RideForm'; // Certifique-se de que o caminho está correto

const App: React.FC = () => {
  console.log("App está sendo renderizado");
  return (
    <div>
      <h1>Bem-vindo ao Ride App</h1>
      <RideForm />
    </div>
  );
};

export default App;
