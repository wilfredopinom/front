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
    { id: 'merchandising', name: 'Merchandising' },
    { id: 'cafes', name: 'Cafés' }
  ];

  const products: Product[] = [
    {
      id: '1',
      name: 'Gorra Vigo City',
      description: 'Gorra ajustable con el logo de Vigo City',
      price: 19.99,
      image: 'https://placehold.co/400x300?text=Gorra+Vigo+City',
      category: 'gorras',
      address: 'Calle Príncipe, 36202 Vigo',
      isNew: true
    },
    {
      id: '2',
      name: 'Gorra Vintage Vigo',
      description: 'Gorra estilo vintage con el escudo de Vigo',
      price: 22.99,
      image: 'https://placehold.co/400x300?text=Gorra+Vintage+Vigo',
      category: 'gorras',
      address: 'Plaza de Compostela, 36201 Vigo'
    },
    {
      id: '3',
      name: 'Gorra Deportiva Vigo',
      description: 'Gorra deportiva transpirable con diseño moderno',
      price: 24.99,
      image: 'https://placehold.co/400x300?text=Gorra+Deportiva+Vigo',
      category: 'gorras',
      isPopular: true
    },
    {
      id: '4',
      name: 'Taza Vigo',
      description: 'Taza de cerámica con vistas de Vigo',
      price: 12.99,
      image: 'https://placehold.co/400x300?text=Taza+Vigo',
      category: 'merchandising',
      isPopular: true
    },
    {
      id: '5',
      name: 'Camiseta Vigo',
      description: 'Camiseta 100% algodón con diseño exclusivo de Vigo',
      price: 29.99,
      image: 'https://placehold.co/400x300?text=Camiseta+Vigo',
      category: 'merchandising'
    },
    {
      id: '6',
      name: 'Sudadera Vigo',
      description: 'Sudadera con capucha y diseño urbano de Vigo',
      price: 49.99,
      image: 'https://placehold.co/400x300?text=Sudadera+Vigo',
      category: 'merchandising',
      isNew: true
    },
    {
      id: '7',
      name: 'Café Vigo Blend',
      description: 'Mezcla especial de café tostado en Vigo',
      price: 14.99,
      image: 'https://placehold.co/400x300?text=Cafe+Vigo+Blend',
      category: 'cafes',
      isPopular: true
    },
    {
      id: '8',
      name: 'Café Especial Vigo',
      description: 'Café de especialidad 100% arábica',
      price: 18.99,
      image: 'https://placehold.co/400x300?text=Cafe+Especial+Vigo',
      category: 'cafes',
      isNew: true
    },
    {
      id: '9',
      name: 'Pack Degustación Café',
      description: 'Pack con 3 variedades de café de Vigo',
      price: 39.99,
      image: 'https://placehold.co/400x300?text=Pack+Degustacion+Cafe',
      category: 'cafes'
    }
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
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="text-center mb-8">
          <h1 className="page-title mb-4">Tienda Oficial de Vigo</h1>
          <p className="text-blue-200 max-w-3xl mx-auto">
            Descubre nuestra colección exclusiva de productos de Vigo
          </p>
        </div>

        {/* Filters */}
        <div className="glass-card p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-wrap gap-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === category.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'glass-card hover:bg-white/10'
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
            <div key={product.id} className="glass-card overflow-hidden hover-card">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover hover:opacity-90 transition-opacity duration-300"
                />
                {product.isNew && (
                  <span className="absolute top-2 right-2 glass-card bg-blue-500/20 text-blue-400 text-xs font-bold px-3 py-1 rounded-full">
                    Nuevo
                  </span>
                )}
                {product.isPopular && (
                  <span className="absolute top-2 left-2 glass-card bg-yellow-500/20 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-blue-300 mb-2 hover:text-blue-400 transition-colors duration-300">
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
                      className="glass-card p-2 text-blue-300 hover:text-pink-400 transition-colors duration-300 rounded-lg"
                      title="Añadir a favoritos"
                    >
                      <Heart className="h-5 w-5" />
                    </button>
                    <button 
                      className="glass-card p-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 rounded-lg"
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
  );
};

export default StorePage; 