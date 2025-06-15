import React, { useState } from 'react';
import { Filter, ShoppingCart, Heart, MapPin, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUser } from '@clerk/clerk-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  address?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

const StorePage: React.FC = () => {
  const { user } = useUser();
  const [selectedCategory, setSelectedCategory] = useState<string>('todos');
  const [sortBy, setSortBy] = useState<string>('destacados');

  // Check if user is admin (you would typically have a more robust check)
  const isAdmin = user?.publicMetadata?.role === 'admin';

  const categories = [
    { id: 'todos', name: 'Todos' },
    { id: 'gorras', name: 'Gorras' },
    { id: 'camisetas', name: 'Camisetas' },
    { id: 'accesorios', name: 'Accesorios' }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Camiseta Infantil 3ª Equipación 24/25',
      description: 'La nueva camiseta se trata de una prenda color naranja con un elegante diseño en los hombros que, al igual que en la segunda equipación, representa alguno de los lugares más emblemáticos de la ciudad de Vigo',
      price: 39.95,
      image: '/celtaNaranja.png',
      category: 'camisetas',
      address: 'Calle Príncipe, 36202 Vigo',
      isNew: true
    },
    {
      id: '2',
      name: 'Camiseta Infantil 2ª Equipación 24/25',
      description: 'Camiseta Infantil 2ª Equipación 24/25',
      price: 22.99,
      image: '/celtaAzul.png',
      category: 'camisetas',
      address: 'Plaza de Compostela, 36201 Vigo'
    },
    {
      id: '3',
      name: 'KOMBAT 2025 DEPORTIVO',
      description: 'Camiseta deportiva de fútbol reciclada azul para hombre con protección Hydro-Way',
      price: 55.30,
      image: '/DeportivoAzul.webp',
      category: 'camisetas',
      isPopular: true
    },
    {
      id: '4',
      name: 'KOMBAT 2025 DEPORTIVO',
      description: 'Camiseta de fútbol reciclada para hombre, color gris azur, con protección Hydro-Way',
      price: 55.30,
      image: '/DeportivoGal.webp',
      category: 'camisetas',
      isPopular: true
    },
 {
      id: '5',
      name: 'TAZA ONDEESTA',
      description: 'Taza con el logo de OndeEsta, ideal para disfrutar de tu bebida favorita',
      price: 2.00,
      image: '/tazaOndeEsta.png',
      category: 'accesorios',
      isPopular: true
    },
     {
      id: '6',
      name: 'Franela OndeEsta',
      description: 'Franela con el logo de OndeEsta, ideal para lucir con estilo',
      price: 8.00,
      image: '/camisa.png',
      category: 'camisetas',
      isPopular: true
    },
     {
      id: '7',
      name: 'Sueter OndeEsta',
      description: 'Su  ter con el logo de OndeEsta, perfecto para los días fríos',
      price: 12.00,
      image: '/sueter.png',
      category: 'camisetas',
      isPopular: true
    },

  ];

  const filteredProducts = products.filter(product => 
    selectedCategory === 'todos' || product.category === selectedCategory
  );

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'precio-bajo':
        return a.price - b.price;
      case 'precio-alto':
        return b.price - a.price;
      case 'destacados':
        return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0);
      default:
        return 0;
    }
  });

  return (
    <>
      <div className="  ">
        {/* Animated background elements */}
       

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
          <div className="text-center mb-8">
            <h1 className="page-title mb-4">Tienda Oficial de Vigo</h1>
            <p className="text-blue-200 max-w-3xl mx-auto">
              Descubre nuestra colección exclusiva de productos de Vigo
            </p>
          </div>

          {/* Filters */}
          <div className="glass-card p-6 mb-8 hover-glow">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="flex flex-wrap gap-4">
                {categories.map(category => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                      selectedCategory === category.id
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'glass-card hover:bg-white/10 hover-glow'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-blue-400" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="block w-full py-2 px-3 bg-white/10 border border-white/20 rounded-xl text-white backdrop-blur-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="destacados" className="bg-gray-900">Destacados</option>
                  <option value="precio-bajo" className="bg-gray-900">Precio: Menor a Mayor</option>
                  <option value="precio-alto" className="bg-gray-900">Precio: Mayor a Menor</option>
                </select>
              </div>
            </div>
          </div>

          {/* Add New Product Button - Only visible to admin */}
          {isAdmin && (
            <div className="mb-8 flex justify-end">
              <Link
                to="/tienda/nuevo"
                className="gradient-button inline-flex items-center"
              >
                <Plus className="h-5 w-5 mr-2" />
                Añadir nuevo producto
              </Link>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map(product => (
              <div key={product.id} className="glass-card overflow-hidden hover-card hover-glow">
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-300"
                  />
                  {product.isNew && (
                    <span className="absolute top-2 right-2 glass-card bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full hover-glow">
                      Nuevo
                    </span>
                  )}
                  {product.isPopular && (
                    <span className="absolute top-2 left-2 glass-card bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full hover-glow">
                      Popular
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-blue-300 mb-2 hover:text-blue-400 transition-colors duration-300 hover-glow">
                    {product.name}
                  </h3>
                  <p className="text-sm text-blue-200 mb-3 line-clamp-2">
                    {product.description}
                  </p>
                  {product.address && (
                    <div className="flex items-center text-blue-200 text-sm mb-4">
                      <MapPin className="h-4 w-4 mr-1 text-purple-400" />
                      <span className="truncate">{product.address}</span>
                    </div>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold gradient-text">
                      {product.price.toFixed(2)} €
                    </span>
                    <div className="flex gap-2">
                      <button 
                        className="glass-card p-2 text-blue-300 hover:text-pink-400 transition-colors duration-300 rounded-lg hover-glow"
                        title="Añadir a favoritos"
                      >
                        <Heart className="h-5 w-5" />
                      </button>
                      <button 
                        className="glass-card p-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 rounded-lg hover-glow"
                        title="Añadir al carrito"
                      >
                        <ShoppingCart className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

    </>
  );
};

export default StorePage;