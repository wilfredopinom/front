import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

// Debug: log la URL del WebSocket
const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
console.log('Intentando conectar WebSocket a:', wsUrl);

let ws: WebSocket | null = null;
try {
  ws = new WebSocket(wsUrl);

  ws.onopen = () => {
    console.log('WebSocket conectado');
  };

  ws.onmessage = (event) => {
    console.log('Mensaje WebSocket recibido:', event.data);
  };

  ws.onerror = (err) => {
    console.error('WebSocket error:', err);
  };

  ws.onclose = () => {
    console.log('WebSocket cerrado');
  };
} catch (e) {
  console.error('Error creando WebSocket:', e);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
