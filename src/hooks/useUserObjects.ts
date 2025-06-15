import { useState, useEffect } from 'react';
import { useObjects } from './useObjects';
import { useUser } from '@clerk/clerk-react';
import { ObjectType } from '../types/ObjectType';

export const useUserObjects = () => {
  const { objects, loading: objectsLoading } = useObjects();
  const { user } = useUser();
  
  const [userObjects, setUserObjects] = useState<ObjectType[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Log para depuración
    // console.log('objectsLoading:', objectsLoading);
    // console.log('objects:', objects);

    if (!objectsLoading) {
      if (user) {
        // Debug logs para verificar los ids
        // console.log('User ID:', user.id);
        // console.log('Objects:', objects);
console.log('Ejemplo de objeto:', objects[0]);
        // Asegura que los ids existen y son strings antes de comparar
        const filteredObjects = objects.filter(object => {
          const publisherId = object.publisher?.id?.toString();
          const claimerId = object.claimer?.id?.toString();
          const userId = user.id?.toString();
          return publisherId === userId || claimerId === userId;
        });
        setUserObjects(filteredObjects);
      } else {
        setUserObjects([]);
      }
      setLoading(false);
    }
  }, [objects, objectsLoading, user]);
  
  return { 
    objects: userObjects,
    loading
  };
};