/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// src/contexts/SocketContext.tsx
import { createContext, useContext, ReactNode } from "react";
import { useSocket } from "../hooks/useSocket";


interface SocketContextType {
  isConnected: boolean;
  getInitialData: (tipo: string) => void;
  updateEstado: (data: { tipo: string; id: string; estado: string; usuarioCompras?: string }) => void;
  addListener: (event: string, callback: Function) => void;
  removeListener: (event: string, callback: Function) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export function SocketProvider({ children }: { children: ReactNode }) {
  const socket = useSocket();

  return (
    <SocketContext.Provider value={socket}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocketContext() {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocketContext debe ser usado dentro de un SocketProvider");
  }
  return context;
}