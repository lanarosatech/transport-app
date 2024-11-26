import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Monta o React no elemento com ID "root" no DOM
const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
