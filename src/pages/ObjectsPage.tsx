import React, { useState } from 'react';
import { Search } from 'lucide-react';
import ObjectCard from '../components/objects/ObjectCard';
import { useObjects } from '../hooks/useObjects';
import { ObjectType } from '../types/ObjectType';
import { useNavigate } from 'react-router-dom';


// Fondo gris suave y elegante con imagen de fondo tipo mosaico (repetida)
const backgroundStyle: React.CSSProperties = {
 // background: `
   // linear-gradient(351deg, #0a2236 0%, #1e3350 60%, #6CACE4 100%),
   // url('/bg-galego-palabras.png')
  //`,
  backgroundRepeat: 'repeat',
  backgroundSize: '180px auto', // Ajusta el tamaño para que se vea varias veces (mosaico)
  position: 'absolute',
  inset: 0,
  zIndex: 0,
  //transition: 'background 0.6s cubic-bezier(0.4,0,0.2,1)'
};

type Filters = {
  status: string;
  categories: string;
  location: string;
  dateRange: string;
};

const ObjectsPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<Filters>({
    status: '',
    categories: '',
    location: '',
    dateRange: '',
  });
const { objects, loading }: { objects: ObjectType[]; loading: boolean } = useObjects();
const navigate = useNavigate();

// Maneja el cambio de filtros
const handleFilterChange = (
  e: React.ChangeEvent<HTMLSelectElement>,
  filterKey: keyof Filters
) => {
  setFilters((prev) => ({
    ...prev,
    [filterKey]: e.target.value,
  }));
};


  const filteredObjects = objects.filter((object) => {
    const matchesSearch =
      (object.title?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (object.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());

    const matchesStatus = !filters.status || object.status === filters.status;
    // Extrae el nombre de la categoría correctamente
    const categoriaNombre =
      typeof object.categories === 'string'
        ? object.categories
        : (object.categories &&
            typeof object.categories === 'object' &&
            ('nombre' in object.categories
              ? (object.categories as { nombre: string }).nombre
              : 'name' in object.categories
                ? (object.categories as { name: string }).name
                : '')
          ) || '';

    const matchesCategory = !filters.categories || categoriaNombre === filters.categories;
    const matchesLocation = !filters.location || (object.location || '').includes(filters.location);

    return matchesSearch && matchesStatus && matchesCategory && matchesLocation;
  });

  // Nueva función para mostrar el estado con formato amigable
  function getStatusText(status: string) {
    switch (status) {
      case 'perdido':
        return 'Perdido';
      case 'pendiente_recuperacion':
        return 'Pendiente de Recuperacion';
      case 'pendiente_entrega':
        return 'Pendiente de Entrega';
      case 'recuperado':
        return 'Recuperado';
      case 'entregado':
        return 'Entregado';
      case 'encontrado':
        return 'Encontrado';
      case 'reclamado':
        return 'Reclamado';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
    }
  }

  // Devuelve un array de etiquetas de estado (inicial y final si aplica)
  function getStatusLabels(status: string) {
    // Ajuste: "Encontrado" naranja, pendientes amarillos
    const labels: { text: string; className: string }[] = [];
    switch (status) {
      case 'perdido':
        labels.push({
          text: 'Perdido',
          className: 'px-3 py-1 rounded-full text-xs font-semibold shadow bg-red-600 text-white'
        });
        break;
      case 'encontrado':
        labels.push({
          text: 'Encontrado',
          className: 'px-3 py-1 rounded-full text-xs font-semibold shadow bg-orange-500 text-white'
        });
        break;
      case 'reclamado':
        labels.push({
          text: 'Reclamado',
          className: 'px-3 py-1 rounded-full text-xs font-semibold shadow bg-orange-600 text-white'
        });
        break;
      case 'pendiente_recuperacion':
        labels.push({
          text: 'Pendiente de Recuperación',
          className: 'px-3 py-1 rounded-full text-xs font-semibold shadow bg-yellow-400 text-black'
        });
        break;
      case 'pendiente_entrega':
        labels.push({
          text: 'Pendiente de Entrega',
          className: 'px-3 py-1 rounded-full text-xs font-semibold shadow bg-yellow-400 text-black'
        });
        break;
      case 'recuperado':
        labels.push({
          text: 'Encontrado',
          className: 'px-3 py-1 rounded-full text-xs font-semibold shadow bg-orange-500 text-white'
        });
        labels.push({
          text: 'Recuperado',
          className: 'px-3 py-1 rounded-full text-xs font-semibold border border-white/20 shadow bg-green-600 text-white'
        });
        break;
      case 'entregado':
        labels.push({
          text: 'Perdido',
          className: 'px-3 py-1 rounded-full text-xs font-semibold shadow bg-red-600 text-white'
        });
        labels.push({
          text: 'Entregado',
          className: 'px-3 py-1 rounded-full text-xs font-semibold border border-white/20 shadow bg-green-600 text-white'
        });
        break;
      default:
        labels.push({
          text: status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' '),
          className: 'px-3 py-1 rounded-full text-xs font-semibold shadow bg-gray-400 text-white'
        });
    }
    return labels;
  }

  return (
    <div className="min-h-screen w-full flex flex-col relative">
      {/* Imagen de fondo: asegúrate de que el archivo esté en public/bg-galego-palabras.png */}
      <div style={backgroundStyle} aria-hidden="true"></div>
      <div className="flex flex-col flex-grow relative z-10">
        {/* Main content */}
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="page-title mb-4">Objetos perdidos y encontrados</h1>
              <p className="text-blue-200 text-center mb-8">
                Busca entre todos los objetos publicados o filtra por categoría, ubicación o estado.
              </p>

              {/* Search & Filters */}
              <div className="glass-card p-6 mb-6 hover-glow">
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
                      className="block w-full py-2 px-3 bg-white/10 border border-white/20 rounded-md text-black backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.status}
                      onChange={(e) => handleFilterChange(e, 'status')}
                    >
                      <option value="">Todos los estados</option>
                      <option value="encontrado">Encontrado</option>
                      <option value="perdido">Perdido</option>
                      <option value="reclamado">Reclamado</option>
                      <option value="entregado">Entregado</option>
                    </select>

                    <select
                      className="block w-full py-2 px-3 bg-white/10 border border-white/20 rounded-md text-black backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={filters.categories}
                      onChange={(e) => handleFilterChange(e, 'categories')}
                    >
                      <option value="">Todas las categorías</option>
                      <option value="Documentos" >Documentos</option>
                      <option value="Ropa y Accesorios" >Ropa y Accesorios</option>
                      <option value="Llaves">Llaves</option>
                      <option value="Mascotas" >Mascotas</option>
                      <option value="Otros" >Otros</option>
                      <option value="Electrónicos" >Electrónicos</option>
                      <option value="Vehículos" >Vehículos</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* View Toggle */}
              <div className="flex justify-between items-center mb-6">
                <p className="text-sm text-blue-200">
                  Mostrando {filteredObjects.length} objetos
                </p>
                <div className="glass-card inline-flex rounded-lg hover-glow" role="group">
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

            {/* Loading */}
            {loading && (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
              </div>
            )}

            {/* List View */}
            {viewMode === 'list' && !loading && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredObjects.length > 0 ? (
                  filteredObjects.map((object) => (
                    <div
                      key={object.id}
                      className="hover-card cursor-pointer relative"
                      onClick={() => navigate(`/objetos/${object.id}`)}
                    >
                      {/* Contenedor relativo para superponer las etiquetas sobre la imagen de ObjectCard */}
                      <div className="relative">
                        {/* Etiquetas de estado sobre la imagen */}
                        <div className="absolute top-6 left-6 flex flex-col items-start space-y-1 z-10 pointer-events-none">
                          {getStatusLabels(object.status).map((label, idx) => (
                            <span key={idx} className={label.className}>{label.text}</span>
                          ))}
                        </div>
                        <ObjectCard
                          object={{
                            id: object.id,
                            title: object.title,
                            description: object.description,
                            location: object.location || object.location || '',
                            created_at: object.created_at,
                            images: Array.isArray(object.images)
                              ? object.images
                              : [],
                            status: getStatusText(object.status),
                            categoria: object.categories
                              ? { nombre: typeof object.categories === 'string'
                                  ? object.categories
                                  : (object.categories && 'nombre' in object.categories
                                      ? (object.categories as { nombre: string }).nombre
                                      : '') }
                              : undefined,
                          }}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-3 py-20 text-center glass-card">
                    <p className="text-blue-200 text-lg">
                      No se encontraron objetos que coincidan con tu búsqueda.
                    </p>
                    <p className="text-blue-300">
                      Intenta con otros filtros o términos de búsqueda.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Map View */}
            {viewMode === 'map' && !loading && (
              <div className="glass-card h-[600px] rounded-lg overflow-y-auto flex flex-col gap-6 p-4 hover-glow">
                {filteredObjects.filter(obj => obj.location && obj.location.trim().length > 0).length > 0 ? (
                  
                  filteredObjects
                    .filter(obj => obj.location && obj.location.trim().length > 0)
                    .map(obj => (
                      <div key={obj.id} className="mb-4">
                        <div className="font-bold text-blue-300 mb-2">{obj.title}</div>
                        <iframe
                          width="100%"
                          height="220"
                          loading="lazy"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(obj.location)}&output=embed`}
                          style={{ border: 0, borderRadius: '12px' }}
                          allowFullScreen
                          title={`Ubicación de ${obj.title}`}
                        ></iframe>
                      </div>
                    ))
                ) : (
                  <div className="text-center text-blue-200 py-10">
                    No hay objetos con ubicación disponible para mostrar en el mapa.
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ObjectsPage;
