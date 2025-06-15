import React, { FC } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Mail, Phone, Instagram, Github } from 'lucide-react';

const Footer: FC = () => {
  return (
    <footer className="backdrop-blur-xl bg-[#04131D]/80 border-t border-white/10 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div>
            <div className="flex items-center mb-6 group">
              <a className="flex items-center group" href="/">
                <div className="hover-glow">
                  <a href="/">
                    <img
                      src="/logoOnde.png"
                      alt="Ondeesta Logo"
                      style={{
                        height: 100,
                        width: 100,
                        border: 'white',
                        marginRight: 12,
                      }}
                    />
                  </a>
                </div>
              </a>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed">
              Pensando en la comunidad Gallega 🐙 Redidentes 🏡 y visitantes✈️
              <br />
              Construido por: Wilfredo Pino || Proyecto FCT DAM
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              Enlaces rápidos
            </h3>
            <ul className="space-y-3">
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                  href="/"
                >
                  <span className="hover:translate-x-1 transition-transform duration-300 inline-block">
                    Inicio
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                  href="/objetos"
                >
                  <span className="hover:translate-x-1 transition-transform duration-300 inline-block">
                    Objetos
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                  href="/publicar"
                >
                  <span className="hover:translate-x-1 transition-transform duration-300 inline-block">
                    Publicar objeto
                  </span>
                </a>
              </li>
              <li>
                <a
                  className="text-gray-300 hover:text-white transition-colors duration-300 flex items-center"
                  href="/sign-in"
                >
                  <span className="hover:translate-x-1 transition-transform duration-300 inline-block">
                    Iniciar sesión
                  </span>
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-6 text-blue-400">
              Contacto
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center group">
                {/* Mail icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-mail h-4 w-4 mr-3 text-[#6CACE4] group-hover:text-purple-300 transition-colors duration-300"
                >
                  <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                </svg>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  contacto@ondeesta.gal
                </span>
              </li>
              <li className="flex items-center group">
                {/* Phone icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-phone h-4 w-4 mr-3 text-[#6CACE4] group-hover:text-purple-300 transition-colors duration-300"
                >
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                </svg>
                <span className="text-gray-300 group-hover:text-white transition-colors duration-300">
                  +34 986 123 456
                </span>
              </li>
              <li className="flex items-center group">
                {/* Instagram icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-instagram h-4 w-4 mr-3 text-[#6CACE4] group-hover:text-purple-300 transition-colors duration-300"
                >
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line>
                </svg>
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
                {/* GitHub icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-github h-4 w-4 mr-3 text-[#6CACE4] group-hover:text-purple-300 transition-colors duration-300"
                >
                  <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"></path>
                  <path d="M9 18c-4.51 2-5-2-7-2"></path>
                </svg>
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
            ©️ 2025 Onde Está.
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 ml-1">
              Todos los derechos reservados.
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
