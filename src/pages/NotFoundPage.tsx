import React from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <Search className="mx-auto h-16 w-16 text-gray-400" />
        <h1 className="mt-6 text-3xl font-bold text-gray-900">Página no encontrada</h1>
        <p className="mt-2 text-base text-gray-600">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>
        <div className="mt-8">
          <Link 
            to="/" 
            className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-700 hover:bg-blue-800"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;