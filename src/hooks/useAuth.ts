import { useState } from 'react';

export const useAuth = () => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'));

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
  };

  const uploadImage = async (formData: FormData) => {
    try {
      if (!token) {
        throw new Error('No se encontró token de autenticación');
      }

      const baseUrl = import.meta.env.VITE_API_URL_BASE || 'http://localhost:3000/api';
      const response = await fetch(`${baseUrl}/objetos`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
        credentials: 'include'
      });

      if (response.status === 404) {
        throw new Error('Ruta no encontrada');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al subir la imagen');
      }

      return await response.json();
    } catch (error) {
      console.error('Error en la carga:', error);
      throw error;
    }
  };

  return {
    token,
    login,
    logout,
    isAuthenticated: !!token,
    uploadImage,
  };
};
