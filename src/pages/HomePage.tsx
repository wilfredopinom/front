import React from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Clock, Shield, Users } from 'lucide-react';
import HeroImage from '../components/ui/HeroImage';
import StatCard from '../components/ui/StatCard';
import FeatureCard from '../components/ui/FeatureCard';
import { useObjects } from '../hooks/useObjects';


const HomePage: React.FC = () => {
  const { objects } = useObjects();
  const ObjetosRecientes = objects
    .filter(obj => obj.status === 'encontrado' || obj.status === 'entregado' || obj.status === 'reclamado' || obj.status === 'perdido')
    .slice(0, 6);


  return (
    <div className="min-h-screen  text-white relative overflow-hidden">
      {/* Animated background elements */}
     

      {/* Hero Section */}
      <section className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 relative">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight gradient-text animate-float">
                Ayudando a reunir personas con sus objetos perdidos en Galicia
              </h1>
              <p className="text-xl text-blue-200">
                Publica objetos encontrados o busca los que has perdido. 
                Conectamos a toda la comunidad gallega para ayudarnos mutuamente.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/objetos"
                  className="gradient-button inline-flex justify-center items-center"
                >
                  <Search className="w-5 h-5 mr-2" />
                  Buscar objetos
                </Link>
                <Link
                  to="/publicar"
                  className="glass-card inline-flex justify-center items-center px-6 py-3 hover:bg-white/20 transition-all duration-300 hover-glow"
                >
                  <MapPin className="w-5 h-5 mr-2" />
                  Publicar objeto
                </Link>
              </div>
            </div>
            <div className="hidden md:block hover-card">
              <HeroImage />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 " >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 ">
            <div className="glass-card p-8 hover-card hover-glow ">
              <StatCard
                icon={<MapPin className="w-12 h-12 text-blue-400" />}
                number="2,500+"
                label="Objetos encontrados"
              />
            </div>
            <div className="glass-card p-8 hover-card hover-glow">
              <StatCard
                icon={<Users className="w-12 h-12 text-green-400" />}
                number="5,000+"
                label="Usuarios registrados"
              />
            </div>
            <div className="glass-card p-8 hover-card hover-glow">
              <StatCard
                icon={<Clock className="w-12 h-12 text-pink-400" />}
                number="75%"
                label="Tasa de devolución"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Police Objects Section */}
      {ObjetosRecientes.length > 0 && (
        <section className="py-16 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="section-title">Recientes</h2>
              <p className="mt-4 text-lg text-blue-200 max-w-3xl mx-auto">
                Últimos objetos encontrados y publicados en nuestra Web
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {ObjetosRecientes.map((object) => (
                <div
                  key={object.id}
                  className="glass-card overflow-hidden hover-card hover-glow"
                >
                  {object.images && object.images.length > 0 && (
                    <div className="aspect-w-16 aspect-h-9">
                      <img
                        src={object.images[0]}
                        alt={object.title}
                        className="w-full h-48 object-cover"
                      />
          
      </div>
                    
                  )}
                  
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-blue-300 mb-1">
                      {object.title}
                    </h3>
                    
                    <p className="text-sm text-blue-200 mb-2">
                      {object.location}
                    </p>
                    
                    <div className="flex items-center justify-between">
                      <span className="glass-card px-2.5 py-0.5 rounded-full text-xs font-medium text-blue-300 hover-glow">
                        {object.categories || 'Sin categoría'}
                      </span>
                      
                      <span className={`glass-card px-2.5 py-0.5 rounded-full text-xs font-medium hover-glow ${
                        object.status === 'encontrado' ? 'text-green-400' :
                        object.status === 'reclamado' ? 'text-yellow-400' :
                        'text-purple-400'
                      }`}>
                        {object.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link
                to="/comisarias"
                className="gradient-button inline-flex items-center"
              >
                <Shield className="w-5 h-5 mr-2" />
                Ver todos los objetos en comisarías
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title">¿Cómo funciona?</h2>
            <p className="mt-4 text-lg text-blue-200 max-w-3xl mx-auto">
              Onde Está es la plataforma más completa para publicar y buscar objetos perdidos en toda Galicia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="glass-card p-8 hover-card hover-glow">
              <FeatureCard
                icon={<MapPin className="w-10 h-10 text-blue-400" />}
                title="Publica objetos encontrados"
                description="Sube fotos, indica la ubicación y describe los objetos encontrados para ayudar a sus dueños."
              />
            </div>
            <div className="glass-card p-8 hover-card hover-glow">
              <FeatureCard
                icon={<Search className="w-10 h-10 text-purple-400" />}
                title="Busca objetos perdidos"
                description="Utiliza filtros y el mapa para localizar tus objetos perdidos rápidamente."
              />
            </div>
            <div className="glass-card p-8 hover-card hover-glow">
              <FeatureCard
                icon={<Shield className="w-10 h-10 text-pink-400" />}
                title="Colaboración con autoridades"
                description="Trabajamos con policía local y establecimientos para una red de búsqueda más efectiva."
              />
            </div>
            <div className="glass-card p-8 hover-card hover-glow">
              <FeatureCard
                icon={<Clock className="w-10 h-10 text-blue-400" />}
                title="Actualizaciones en tiempo real"
                description="Recibe notificaciones instantáneas cuando haya novedades sobre tus objetos."
              />
            </div>
            <div className="glass-card p-8 hover-card hover-glow">
              <FeatureCard
                icon={<Users className="w-10 h-10 text-purple-400" />}
                title="Comunidad de ayuda"
                description="Conecta con personas cerca de ti dispuestas a ayudar a encontrar tus pertenencias."
              />
            </div>
            <div className="glass-card p-8 hover-card hover-glow">
              <FeatureCard
                icon={<MapPin className="w-10 h-10 text-pink-400" />}
                title="Mapa interactivo"
                description="Visualiza en un mapa donde se encontraron o perdieron los objetos."
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="glass-card p-12 hover-glow hover-glow">
            <h2 className="text-3xl font-bold mb-6 gradient-text">
              ¿Has perdido o encontrado algo?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-3xl mx-auto">
              Únete a nuestra comunidad y ayuda a devolver los objetos perdidos a sus dueños.
              O encuentra lo que has perdido con la ayuda de todos.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                to="/sign-up"
                className="gradient-button inline-flex justify-center items-center"
              >
                Crear una cuenta
              </Link>
              <Link
                to="/objetos"
                className="glass-card inline-flex justify-center items-center px-6 py-3 hover:bg-white/20 transition-all duration-300 hover-glow"
              >
                Ver objetos
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;