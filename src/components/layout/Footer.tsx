import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Github } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="backdrop-blur-xl bg-slate-900/60 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center mb-6 group">
              <MapPin className="h-6 w-6 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
              <span className="ml-2 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600">
                Onde Está
              </span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Ayudando a las personas de Galicia a encontrar sus objetos perdidos y a devolver los objetos encontrados.
            </p>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Enlaces rápidos</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="hover:translate-x-1 transition-transform duration-300 inline-block">
                    Inicio
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/objetos" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="hover:translate-x-1 transition-transform duration-300 inline-block">
                    Objetos
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/publicar" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="hover:translate-x-1 transition-transform duration-300 inline-block">
                    Publicar objeto
                  </span>
                </Link>
              </li>
              <li>
                <Link to="/iniciar-sesion" className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center">
                  <span className="hover:translate-x-1 transition-transform duration-300 inline-block">
                    Iniciar sesión
                  </span>
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">Contacto</h3>
            <ul className="space-y-3">
              <li className="flex items-center group">
                <Mail className="h-4 w-4 mr-3 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  contacto@ondeesta.gal
                </span>
              </li>
              <li className="flex items-center group">
                <Phone className="h-4 w-4 mr-3 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  +34 986 123 456
                </span>
              </li>
              <li className="flex items-center group">
                <Instagram className="h-4 w-4 mr-3 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <a 
                  href="https://instagram.com/ondeesta.gal" 
                  className="text-gray-300 group-hover:text-white transition-colors duration-300"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  @ondeesta.gal
                </a>
              </li>
              <li className="flex items-center group">
                <Github className="h-4 w-4 mr-3 text-purple-400 group-hover:text-purple-300 transition-colors duration-300" />
                <a 
                  href="https://github.com/ondeesta" 
                  className="text-gray-300 group-hover:text-white transition-colors duration-300"
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} Onde Está. 
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 ml-1">
              Todos los derechos reservados.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}