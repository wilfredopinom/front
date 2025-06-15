import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight, Flag } from 'lucide-react';
import StatusBadge from '../ui/StatusBadge';

interface ObjectCardProps {
  object: {
    id: string;
    title: string;
    description: string;
    location: string;
    created_at: string;
    status: string;
    images: { url: string }[];
    categories?: { nombre: string };
    usuario?: { name: string };
    
  };
}



const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

// Helper para mostrar el estado inicial (perdido/encontrado) y el estado actual
function getInitialStatus(status: string): 'perdido' | 'encontrado' | null {
  if (
    status === 'perdido' ||
    status === 'pendiente_recuperacion' ||
    status === 'recuperado'
  ) {
    return 'perdido';
  }
  if (
    status === 'encontrado' ||
    status === 'pendiente_entrega' ||
    status === 'entregado' ||
    status === 'reclamado'
  ) {
    return 'encontrado';
  }
  return null;
}

function getStatusColor(status: string) {
  switch (status) {
    case 'perdido':
    case 'pendiente_recuperacion':
    case 'recuperado':
      return 'bg-pink-600 text-white';
    case 'encontrado':
    case 'pendiente_entrega':
    case 'entregado':
    case 'reclamado':
      return 'bg-blue-600 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

function getCurrentStatusColor(status: string) {
  switch (status) {
    case 'pendiente_recuperacion':
    case 'pendiente_entrega':
      return 'bg-yellow-500 text-white';
    case 'recuperado':
      return 'bg-green-600 text-white';
    case 'entregado':
      return 'bg-green-600 text-white';
    case 'reclamado':
      return 'bg-orange-500 text-white';
    default:
      return 'bg-gray-500 text-white';
  }
}

// Cambia la visualización del estado para que use el texto amigable
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

const ObjectCard: React.FC<{ object: any; showStatus?: boolean; isOwner?: boolean; isClaimed?: boolean }> = ({
  object,
  showStatus,
  isOwner,
  isClaimed,
}) => {
  
  const [imageError, setImageError] = React.useState(false);
  const defaultImage = '/placeholder-image.jpg';
  const imageUrl = (!imageError && object.images?.[0]?.url) || defaultImage;
console.log("Status del objeto:", object.status);

  return (
    <div className="glass-card p-4 rounded-xl flex flex-col h-full hover-glow">
      {/* Imagen principal con las etiquetas de estado en la esquina superior izquierda */}
      <div className="relative w-full h-48 mb-4">
        {object.images && object.images.length > 0 ? (
          <img
            src={object.images[0].url}
            alt={object.title}
            className="w-full h-full object-cover rounded-xl"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-700 rounded-xl flex items-center justify-center">
            <span className="text-gray-400">Sin imagen</span>
          </div>
        )}
        {/* Etiquetas de estado: inicial arriba, actualizada debajo, sin bandera */}
        <div className="absolute top-2 left-2 flex flex-col items-start space-y-1 z-10">
          {(() => {
            const initial = getInitialStatus(object.status);
            if (initial) {
              return (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold shadow ${getStatusColor(initial)}`}
                >
                  {initial.charAt(0).toUpperCase() + initial.slice(1)}
                </span>
              );
            }
            return null;
          })()}
          {(() => {
            const initial = getInitialStatus(object.status);
            if (initial && object.status !== initial) {
              return (
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold border border-white/20 shadow ${getCurrentStatusColor(object.status)}`}
                >
                  {getStatusText(object.status)}
                </span>
              );
            }
            return null;
          })()}
        </div>
      </div>
      
      <div className="p-6 relative">
        <h3 className="text-lg font-semibold text-blue-300 mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors duration-300">
          {object.title}
        </h3>
        
        <p className="text-blue-200 text-sm mb-3 line-clamp-2">
          {object.description}
        </p>
        
        <div className="flex items-center text-blue-200 text-sm mb-2">
          <MapPin className="h-4 w-4 mr-1 flex-shrink-0 text-purple-400" />
          <span className="truncate">{object.location}</span>
        </div>
        
        <div className="flex items-center text-blue-200 text-sm mb-4">
          <Calendar className="h-4 w-4 mr-1 flex-shrink-0 text-purple-400" />
          <span>{formatDate(object.created_at)}</span>
        </div>
        
        <div className="inline-flex items-center text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
          Ver detalles
          <ArrowRight className="ml-1 h-4 w-4 text-purple-400" />
        </div>
      </div>
    </div>
  );
};

export default ObjectCard;