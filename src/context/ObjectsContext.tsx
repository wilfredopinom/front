import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { useUser } from '@clerk/clerk-react';
import { ObjectType, Report } from '../types/ObjectType';
import { mockObjects } from '../data/mockObjects';

interface ObjectsContextType {
  objects: ObjectType[];
  loading: boolean;
  error: string | null;
  getObjectById: (id: string) => ObjectType | undefined;
  createObject: (objectData: Partial<ObjectType>) => Promise<string>;
  updateObject: (id: string, objectData: Partial<ObjectType>) => Promise<void>;
  deleteObject: (id: string) => Promise<void>;
  claimObject: (id: string, message: string) => Promise<void>;
  reportObject: (id: string, reason: Report['reason'], description?: string) => Promise<void>;
  updateObjectStatus: (id: string, status: ObjectType['status']) => Promise<void>;
  getUserStats: (userId: string) => {
    published: number;
    claimed: number;
    delivered: number;
  };
  deleteClaim: (objectId: string, claimId: string) => Promise<void>;
}

const ObjectsContext = createContext<ObjectsContextType>({
  objects: [],
  loading: true,
  error: null,
  getObjectById: () => undefined,
  createObject: async () => '',
  updateObject: async () => {},
  deleteObject: async () => {},
  claimObject: async () => {},
  reportObject: async () => {},
  updateObjectStatus: async () => {},
  getUserStats: () => ({ published: 0, claimed: 0, delivered: 0 }),
  deleteClaim: async () => {},
});

interface ObjectsProviderProps {
  children: ReactNode;
}

export const ObjectsProvider: React.FC<ObjectsProviderProps> = ({ children }) => {
  const { user } = useUser();
  const [objects, setObjects] = useState<ObjectType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchObjects = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setObjects(mockObjects.map(obj => ({
          ...obj,
          claimsCount: 0,
          claims: [],
          reports: []
        })));
      } catch (err) {
        setError('Error al cargar los objetos');
        console.error('Error fetching objects:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchObjects();
  }, []);

  const getObjectById = (id: string) => {
    return objects.find(object => object.id === id);
  };

  const createObject = async (objectData: Partial<ObjectType>): Promise<string> => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newObject: ObjectType = {
        id: Date.now().toString(),
        title: objectData.title || '',
        description: objectData.description || '',
        category: objectData.category || '',
        status: 'encontrado',
        date: objectData.date || new Date().toISOString(),
        createdAt: new Date().toISOString(),
        location: objectData.location || '',
        coordinates: objectData.coordinates || { lat: 42.8806, lng: -8.5458 },
        images: objectData.images || [],
        publisher: {
          id: user.id,
          name: user.fullName || '',
          email: user.primaryEmailAddress?.emailAddress || '',
          avatar: user.imageUrl,
          stats: { published: 0, claimed: 0, delivered: 0 }
        },
        contactInfo: objectData.contactInfo,
        isPoliceStation: objectData.isPoliceStation || false,
        claimsCount: 0,
        claims: [],
        reports: []
      };
      
      setObjects(prevObjects => {
        const updatedObjects = [newObject, ...prevObjects];
        return updatedObjects;
      });
      
      return newObject.id;
    } catch (error) {
      console.error('Error creating object:', error);
      throw error;
    }
  };

  const updateObject = async (id: string, objectData: Partial<ObjectType>): Promise<void> => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setObjects(prevObjects => 
        prevObjects.map(obj => 
          obj.id === id ? { ...obj, ...objectData } : obj
        )
      );
    } catch (error) {
      console.error('Error updating object:', error);
      throw error;
    }
  };

  const deleteObject = async (id: string): Promise<void> => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const object = objects.find(obj => obj.id === id);
      if (!object || object.publisher.id !== user.id) {
        throw new Error('No tienes permiso para eliminar este objeto');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setObjects(prevObjects => prevObjects.filter(obj => obj.id !== id));
    } catch (error) {
      console.error('Error deleting object:', error);
      throw error;
    }
  };

  const claimObject = async (id: string, message: string): Promise<void> => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setObjects(prevObjects => 
        prevObjects.map(obj => 
          obj.id === id ? {
            ...obj,
            status: 'reclamado',
            claimsCount: obj.claimsCount + 1,
            claims: [...obj.claims, {
              id: Date.now().toString(),
              userId: user.id,
              message,
              date: new Date().toISOString()
            }],
            claimer: {
              id: user.id,
              name: user.fullName || '',
              email: user.primaryEmailAddress?.emailAddress || '',
              profileImage: user.imageUrl || '',
              claimDate: new Date().toISOString(),
              claimMessage: message
            }
          } : obj
        )
      );
    } catch (error) {
      console.error('Error claiming object:', error);
      throw error;
    }
  };

  const reportObject = async (id: string, reason: Report['reason'], description?: string): Promise<void> => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setObjects(prevObjects => 
        prevObjects.map(obj => 
          obj.id === id ? {
            ...obj,
            reports: [...obj.reports, {
              id: Date.now().toString(),
              userId: user.id,
              reason,
              description,
              createdAt: new Date().toISOString()
            }]
          } : obj
        )
      );
    } catch (error) {
      console.error('Error reporting object:', error);
      throw error;
    }
  };

  const updateObjectStatus = async (id: string, status: ObjectType['status']): Promise<void> => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const object = objects.find(obj => obj.id === id);
      if (!object || object.publisher.id !== user.id) {
        throw new Error('No tienes permiso para actualizar este objeto');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setObjects(prevObjects => 
        prevObjects.map(obj => 
          obj.id === id ? { ...obj, status } : obj
        )
      );
    } catch (error) {
      console.error('Error updating object status:', error);
      throw error;
    }
  };

  const getUserStats = (userId: string) => {
    const userObjects = objects.filter(obj => obj.publisher.id === userId);
    const claimedObjects = objects.filter(obj => obj.claimer?.id === userId);
    
    return {
      published: userObjects.length,
      claimed: claimedObjects.length,
      delivered: userObjects.filter(obj => obj.status === 'entregado').length
    };
  };

  const deleteClaim = async (objectId: string, claimId: string): Promise<void> => {
    try {
      if (!user) {
        throw new Error('Usuario no autenticado');
      }

      const object = objects.find(obj => obj.id === objectId);
      if (!object) {
        throw new Error('Objeto no encontrado');
      }

      const claim = object.claims.find(c => c.id === claimId);
      if (!claim || claim.userId !== user.id) {
        throw new Error('No tienes permiso para eliminar esta reclamación');
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setObjects(prevObjects => 
        prevObjects.map(obj => 
          obj.id === objectId ? {
            ...obj,
            claims: obj.claims.filter(c => c.id !== claimId),
            claimsCount: obj.claimsCount - 1,
            status: obj.claims.length === 1 ? 'encontrado' : obj.status,
            claimer: obj.claimer?.id === user.id ? undefined : obj.claimer
          } : obj
        )
      );
    } catch (error) {
      console.error('Error deleting claim:', error);
      throw error;
    }
  };

  return (
    <ObjectsContext.Provider 
      value={{ 
        objects, 
        loading, 
        error, 
        getObjectById,
        createObject,
        updateObject,
        deleteObject,
        claimObject,
        reportObject,
        updateObjectStatus,
        getUserStats,
        deleteClaim
      }}
    >
      {children}
    </ObjectsContext.Provider>
  );
};

export default ObjectsContext;