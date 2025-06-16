import { useContext, useEffect, useState, useRef } from 'react';
import { useAuth } from '@clerk/clerk-react';
import ObjectsContext from '../context/ObjectsContext';
import { ObjectType } from '../types/ObjectType';

export const useObjects = () => {
  const context = useContext(ObjectsContext);
  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos`)
      .then(res => res.json())
      .then(data => {
        setObjects(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // WebSocket connection
    const wsUrl = import.meta.env.VITE_WS_URL || 'ws://localhost:3000';
    wsRef.current = new WebSocket(wsUrl);

    wsRef.current.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === 'object_created') {
          setObjects(prev => [msg.data, ...prev]);
        }
        if (msg.type === 'object_updated') {
          setObjects(prev => prev.map(obj => obj.id === msg.data.id ? msg.data : obj));
        }
      } catch { /* empty */ }
    };

    return () => {
      wsRef.current?.close();
    };
  }, []);

  const claimObject = async (objectId: string, message: string) => {
    const token = await getToken?.();
    const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${objectId}/claims`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ message }),
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || 'Error al reclamar el objeto');
    }
    // Opcional: puedes actualizar el estado local aquí si lo necesitas
  };

  if (!context) {
    throw new Error('useObjects must be used within an ObjectsProvider');
  }

  return { ...context, objects, loading, claimObject };
};