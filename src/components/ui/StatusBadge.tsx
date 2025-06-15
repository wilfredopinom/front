import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
 switch (status) {
    case 'perdido':
      return 'bg-red-400/100 to-red-600/20 text-red-900 border-red-500/30';
    case 'encontrado':
      return 'bg-orange-400 text-orange-900 border-orange-400/30';
    case 'entregado':
      return 'bg-green-500 text-green-900 border-green-500/30';
    case 'reclamado':
      return 'bg-white text-gray-900 border-gray-300'; // fondo blanco con texto oscuro y borde gris
    default:
      return 'bg-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30';
  }
};

  const getStatusText = () => {
  switch (status) {
    case 'perdido':
      return 'Perdido';
    case 'encontrado':
      return 'Encontrado';
    case 'entregado':
      return 'Entregado';
    case 'reclamado':
      return 'Reclamado';
    default:
      return status;
  }
};

  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 
        rounded-full text-xs font-medium 
        backdrop-blur-xl border 
        shadow-lg hover:shadow-xl
        transition-all duration-300
        ${getStatusStyles()}
      `}
    >
      {getStatusText()}
    </span>
  );
};

export default StatusBadge;