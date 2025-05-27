import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useObjects } from '../hooks/useObjects';
import { ObjectType } from '../types/ObjectType';

const LostObjectsByMonthPage: React.FC = () => {
  const { monthId } = useParams<{ monthId: string }>();
  const { objects, loading, error } = useObjects();
  const [monthObjects, setMonthObjects] = useState<ObjectType[]>([]);

  useEffect(() => {
    if (objects && monthId) {
      // Filtrar objetos por el mes seleccionado y que sean de comisarías
      const filtered = objects.filter(obj => {
        const objectDate = new Date(obj.createdAt);
        const [year, month] = monthId.split('-');
        
        const isInMonth = monthId.includes('-') ?
          // Para casos como "2025-02-03" (febrero y marzo)
          (() => {
            const [startMonth, endMonth] = month.split('-');
            return objectDate.getFullYear() === parseInt(year) &&
                   objectDate.getMonth() + 1 >= parseInt(startMonth) &&
                   objectDate.getMonth() + 1 <= parseInt(endMonth);
          })() :
          objectDate.getFullYear() === parseInt(year) &&
          objectDate.getMonth() + 1 === parseInt(month);

        // Solo mostrar objetos de comisarías
        return isInMonth && obj.isPoliceStation === true;
      });
      
      setMonthObjects(filtered);
    }
  }, [objects, monthId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Objetos en Comisarías</h1>
        <p className="text-gray-600">
          Lista de objetos perdidos registrados en comisarías durante el período seleccionado
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        {monthObjects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {monthObjects.map((object) => (
              <div
                key={object.id}
                className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200 hover:shadow-md transition-shadow"
              >
                {object.images && object.images.length > 0 && (
                  <div className="aspect-w-16 aspect-h-9">
                    <img
                      src={object.images[0]}
                      alt={object.title}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {object.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    {object.description}
                  </p>
                  
                  <p className="text-sm text-gray-600 mb-2">
                    Ubicación: {object.location}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {object.category}
                    </span>
                    
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      object.status === 'encontrado' ? 'bg-yellow-100 text-yellow-800' :
                      object.status === 'reclamado' ? 'bg-orange-100 text-orange-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {object.status}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No se encontraron objetos para el período seleccionado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LostObjectsByMonthPage; 