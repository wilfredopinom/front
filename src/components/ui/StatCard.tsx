import React, { ReactNode } from 'react';

interface StatCardProps {
  icon: ReactNode;
  number: string;
  label: string;
}

const StatCard: React.FC<StatCardProps> = ({ icon, number, label }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 text-center transition-transform hover:transform hover:scale-105">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-3xl font-bold text-gray-900 mb-2">{number}</h3>
      <p className="text-gray-600">{label}</p>
    </div>
  );
};

export default StatCard;