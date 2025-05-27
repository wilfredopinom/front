import React from 'react';

interface StatusBadgeProps {
  status: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getStatusStyles = () => {
    switch (status) {
      case 'encontrado':
        return 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 border-green-500/30';
      case 'reclamado':
        return 'bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border-yellow-500/30';
      case 'entregado':
        return 'bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30';
      default:
        return 'bg-gradient-to-r from-gray-500/20 to-slate-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'encontrado':
        return 'Encontrado';
      case 'reclamado':
        return 'Reclamado';
      case 'entregado':
        return 'Entregado';
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