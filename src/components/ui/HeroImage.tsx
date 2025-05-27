import React from 'react';

const HeroImage: React.FC = () => {
  return (
    <div className="relative">
      <img
        src="https://images.pexels.com/photos/7605944/pexels-photo-7605944.jpeg"
        alt="Personas ayudándose en Galicia"
        className="rounded-lg shadow-xl max-h-[500px] w-full object-cover"
      />
      <div className="absolute inset-0 bg-blue-900 rounded-lg opacity-10"></div>
    </div>
  );
};

export default HeroImage;