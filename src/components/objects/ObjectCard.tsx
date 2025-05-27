import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, ArrowRight } from 'lucide-react';
import { ObjectType } from '../../types/ObjectType';
import StatusBadge from '../ui/StatusBadge';

interface ObjectCardProps {
  object: ObjectType;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

const ObjectCard: React.FC<ObjectCardProps> = ({ object }) => {
  return (
    <Link 
      to={`/objetos/${object.id}`}
      className="block glass-card overflow-hidden hover-card transition-all duration-300"
    >
      <div className="relative">
        <img
          src={object.images[0]}
          alt={object.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <StatusBadge status={object.status} />
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
          <span>{formatDate(object.date)}</span>
        </div>
        
        <div className="inline-flex items-center text-sm font-medium bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
          Ver detalles
          <ArrowRight className="ml-1 h-4 w-4 text-purple-400" />
        </div>
      </div>
    </Link>
  );
};

export default ObjectCard;