import React from 'react';
import { Link } from 'react-router-dom';

const ObjetosRecientes: React.FC = () => {
  const meses = [
    { id: '2025-04', label: 'Objetos correspondientes a abril 2025' },
    { id: '2025-02-03', label: 'Objetos correspondientes a febrero y marzo 2025' },
    { id: '2025-01', label: 'Objetos correspondientes a enero 2025' },

  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Objetos Perdidos</h1>
        <p className="text-gray-600 mb-6">
          Con el fin de dar cumplimiento al establecido en el Código Civil, artículos 615 y 616 que regulan el procedimiento, 
          se publica el listado de objetos y/o dinero en efectivo. De este modo se pretende poner en conocimiento del público 
          en general la relación de objetos y/o dinero en efectivo depositados recién en la Oficina de Objetos Perdidos.
        </p>
        <p className="text-gray-600 mb-8">
          Relación de objetos perdidos publicados en el tablón de edictos:
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
        <ul className="space-y-4">
          {meses.map((mes) => (
            <li key={mes.id}>
              <Link 
                to={`/objetos-perdidos/${mes.id}`}
                className="text-blue-600 hover:text-blue-800 hover:underline flex items-center"
              >
                <svg 
                  className="w-4 h-4 mr-2" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  />
                </svg>
                {mes.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ObjetosRecientes; 