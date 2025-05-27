import { useState } from 'react';
import { useObjects } from './useObjects';
import { ObjectType } from '../types/ObjectType';
import { useUser } from '@clerk/clerk-react';

export const useCreateObject = () => {
  const { createObject: createObjectContext } = useObjects();
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const createObject = async (objectData: Partial<ObjectType>): Promise<string> => {
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    setLoading(true);
    setError(null);
    
    try {
      const objectId = await createObjectContext(objectData);
      return objectId;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear el objeto';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  return { createObject, loading, error };
};