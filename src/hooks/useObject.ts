import { useState, useEffect } from 'react';
import { useObjects } from './useObjects';
import { ObjectType } from '../types/ObjectType';

export const useObject = (id: string) => {
  const { getObjectById, updateObject, claimObject: claimObjectContext } = useObjects();
  const [object, setObject] = useState<ObjectType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchObject = async () => {
      try {
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const foundObject = getObjectById(id);
        
        if (foundObject) {
          setObject(foundObject);
        } else {
          setError('Objeto no encontrado');
        }
      } catch (err) {
        setError('Error al cargar el objeto');
        console.error('Error fetching object:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchObject();
  }, [id, getObjectById]);
  
  const claimObject = async (message: string) => {
    if (!object) return;
    
    try {
      await claimObjectContext(object.id, message);
      
      // Update local state
      setObject(prev => prev ? { ...prev, status: 'reclamado' } : null);
    } catch (error) {
      console.error('Error claiming object:', error);
      throw error;
    }
  };
  
  return { object, loading, error, claimObject };
};