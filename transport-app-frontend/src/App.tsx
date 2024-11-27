import React, { useState } from 'react';
import RideForm from './components/RideForm'; // Certifique-se de que o caminho está correto
import RideHistory from './components/RideHistory'; // Importe o RideHistory
import RideOptions from './components/RideOptions'; // Importe o novo componente RideOptions

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('home'); // Controle de exibição entre os componentes

  return (
    <div>
      <div className="navbar">
        <button onClick={() => setCurrentPage('home')}>Home</button>
        <button onClick={() => setCurrentPage('history')}>Viagens</button>
        <button onClick={() => setCurrentPage('drivers')}>Motoristas</button>
      </div>

      <div className="container">
        {currentPage === 'history' && <RideHistory />}
        {currentPage === 'drivers' && <RideOptions />}
        {currentPage === 'home' && <RideForm />}
      </div>

      <footer>
        <p>&copy; transport_app developed by Lana Rosa @ 2024.v1</p>
      </footer>
    </div>
  );
};

export default App;
