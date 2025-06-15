/* eslint-disable @typescript-eslint/no-unsafe-function-type */
// src/services/socketService.ts
import { io, Socket } from "socket.io-client";

class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;
  private listeners: Map<string, Set<Function>> = new Map();

  private constructor() {
    this.connect();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private connect() {
    this.socket = io(import.meta.env.VITE_API_URL_SOCKET, {
      withCredentials: false,
    });

    this.socket.on("connect", () => {
      console.log("Conectado al servidor WebSocket");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Error de conexión WebSocket:", error);
    });

    // Configurar listeners por defecto
    this.setupDefaultListeners();
  }

  private setupDefaultListeners() {
    // Listener para actualizaciones de estado
    this.socket?.on("estadoActualizado", (data) => {
      const listeners = this.listeners.get("estadoActualizado");
      if (listeners) {
        listeners.forEach(callback => callback(data));
      }
    });

    // Listener para datos iniciales
    this.socket?.on("initialData", (data) => {
      const listeners = this.listeners.get("initialData");
      if (listeners) {
        listeners.forEach(callback => callback(data));
      }
    });

    // Listener para errores
    this.socket?.on("error", (data) => {
      const listeners = this.listeners.get("error");
      if (listeners) {
        listeners.forEach(callback => callback(data));
      }
      console.error("Error de socket:", data);
    });
  }

  public addListener(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)?.add(callback);
  }

  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  public removeListener(event: string, callback: Function) {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.delete(callback);
    }
  }

  public getInitialData(tipo: string) {
    this.socket?.emit("getInitialData", tipo);
  }

  public updateEstado(data: { tipo: string; id: string; estado: string; usuarioCompras?: string }) {
    this.socket?.emit("updateEstado", data);
  }

  public close() {
    this.socket?.close();
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }
}

// Exportar una instancia única
export const socketService = SocketService.getInstance();