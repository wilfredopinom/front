// src/hooks/useSocket.ts
import { useEffect, useState } from "react";
import { socketService } from "../services/socketService";


export function useSocket() {
  const [isConnected, setIsConnected] = useState(socketService.isConnected());

  useEffect(() => {

    // Comprobar la conexión periódicamente
    const interval = setInterval(() => {
      setIsConnected(socketService.isConnected());
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    isConnected,
    getInitialData: socketService.getInitialData.bind(socketService),
    updateEstado: socketService.updateEstado.bind(socketService),
    addListener: socketService.addListener.bind(socketService),
    removeListener: socketService.removeListener.bind(socketService)
  };
}