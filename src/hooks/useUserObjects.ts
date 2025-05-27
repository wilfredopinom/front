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
    if (!objectsLoading) {
      if (user) {
        // Filter objects that belong to the current user or were claimed by the user
        const filteredObjects = objects.filter(object => 
          object.publisher.id === user.id || 
          (object.claimer && object.claimer.id === user.id)
        );
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