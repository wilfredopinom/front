import React, { useState } from 'react';
import { Search, Filter, MapPin, Clock } from 'lucide-react';
import ObjectCard from '../components/objects/ObjectCard';
import Map from '../components/map/Map';
import { useObjects } from '../hooks/useObjects';

const ObjectsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    location: '',
    dateRange: '',
  });
  
  const { objects, loading } = useObjects();
  
  // Filter objects based on search term and filters
  const filteredObjects = objects.filter(object => {
    const matchesSearch = 
      object.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      object.description.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = !filters.status || object.status === filters.status;
    const matchesCategory = !filters.category || object.category === filters.category;
    const matchesLocation = !filters.location || object.location.includes(filters.location);
    
    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="mb-8">
          <h1 className="page-title mb-4">Objetos perdidos y encontrados</h1>
          <p className="text-blue-200 text-center mb-8">
            Busca entre todos los objetos publicados o filtra por categoría, ubicación o estado.
          </p>
          
          {/* Search and Filters */}
          <div className="glass-card p-6 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 bg-white/10 border border-white/20 rounded-md leading-5 text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl"
                  placeholder="Buscar objetos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex space-x-3">
                <select
                  className="block w-full py-2 px-3 bg-white/10 border border-white/20 rounded-md text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="">Todos los estados</option>
                  <option value="encontrado">Encontrado</option>
                  <option value="reclamado">Reclamado</option>
                  <option value="entregado">Entregado</option>
                </select>
                
                <select
                  className="block w-full py-2 px-3 bg-white/10 border border-white/20 rounded-md text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={filters.category}
                  onChange={(e) => setFilters({...filters, category: e.target.value})}
                >
                  <option value="">Todas las categorías</option>
                  <option value="electrónica">Electrónica</option>
                  <option value="documentos">Documentos</option>
                  <option value="ropa">Ropa</option>
                  <option value="accesorios">Accesorios</option>
                  <option value="mascotas">Mascotas</option>
                  <option value="otros">Otros</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* View Toggle */}
          <div className="flex justify-between items-center mb-6">
            <p className="text-sm text-blue-200">
              Mostrando {filteredObjects.length} objetos
            </p>
            <div className="glass-card inline-flex rounded-lg" role="group">
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-all duration-300 ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'hover:bg-white/10 text-blue-200'
                }`}
                onClick={() => setViewMode('list')}
              >
                Lista
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-all duration-300 ${
                  viewMode === 'map'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                    : 'hover:bg-white/10 text-blue-200'
                }`}
                onClick={() => setViewMode('map')}
              >
                Mapa
              </button>
            </div>
          </div>
        </div>
        
        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
          </div>
        )}
        
        {/* Results - List View */}
        {viewMode === 'list' && !loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredObjects.length > 0 ? (
              filteredObjects.map(object => (
                <div key={object.id} className="hover-card">
                  <ObjectCard object={object} />
                </div>
              ))
            ) : (
              <div className="col-span-3 py-20 text-center glass-card">
                <p className="text-blue-200 text-lg">No se encontraron objetos que coincidan con tu búsqueda.</p>
                <p className="text-blue-300">Intenta con otros filtros o términos de búsqueda.</p>
              </div>
            )}
          </div>
        )}
        
        {/* Results - Map View */}
        {viewMode === 'map' && !loading && (
          <div className="glass-card h-[600px] rounded-lg overflow-hidden">
            <Map objects={filteredObjects} />
          </div>
        )}
      </div>
    </div>
  );
};

export default ObjectsPage;