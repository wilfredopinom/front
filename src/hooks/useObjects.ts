import { useContext } from 'react';
import ObjectsContext from '../context/ObjectsContext';

export const useObjects = () => {
  const context = useContext(ObjectsContext);
  
  if (!context) {
    throw new Error('useObjects must be used within an ObjectsProvider');
  }
  
  return context;
};