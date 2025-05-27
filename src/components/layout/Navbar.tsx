import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { MapPin, Plus, User, Shield } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const userImageUrl = user?.imageUrl || '';
  const userName = user?.fullName || 'Profile';

  return (
    <header className="relative z-50">
      <nav className="glass-card border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group" onClick={closeMenu}>
                <MapPin className="h-8 w-8 text-blue-400 group-hover:text-blue-300 transition-colors duration-300" />
                <span className="ml-2 text-xl font-bold gradient-text">
                  Onde Está
                </span>
              </Link>
            </div>

            <nav className="hidden md:flex items-center space-x-4">
              <NavLink 
                to="/objetos" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                  }`
                }
              >
                Objetos
              </NavLink>

              <NavLink 
                to="/comisarias" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                  }`
                }
              >
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Comisarías
                </span>
              </NavLink>

              <NavLink 
                to="/tienda" 
                className={({ isActive }) => 
                  `px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                  }`
                }
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Tienda
                </span>
              </NavLink>

              {isSignedIn ? (
                <>
                  <NavLink 
                    to="/publicar" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-xl text-sm font-medium ${
                        isActive 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                      }`
                    }
                  >
                    <span className="flex items-center">
                      <Plus className="w-4 h-4 mr-1" />
                      Publicar
                    </span>
                  </NavLink>

                  <NavLink 
                    to="/perfil" 
                    className={({ isActive }) => 
                      `px-3 py-2 rounded-xl text-sm font-medium ${
                        isActive 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                      }`
                    }
                  >
                    <span className="flex items-center">
                      {userImageUrl ? (
                        <img 
                          src={userImageUrl} 
                          alt={userName} 
                          className="w-6 h-6 rounded-full mr-2 border border-white/20"
                        />
                      ) : (
                        <User className="w-4 h-4 mr-1" />
                      )}
                      Perfil
                    </span>
                  </NavLink>

                  <button
                    onClick={handleSignOut}
                    className="px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-300"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <NavLink 
                  to="/sign-in" 
                  className="gradient-button"
                >
                  Iniciar Sesión
                </NavLink>
              )}
            </nav>

            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="glass-card p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300"
              >
                <span className="sr-only">Abrir menú</span>
                {isMenuOpen ? (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden glass-card border-t border-white/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <NavLink
                to="/objetos"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                  }`
                }
                onClick={closeMenu}
              >
                Objetos
              </NavLink>

              <NavLink
                to="/comisarias"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                  }`
                }
                onClick={closeMenu}
              >
                <span className="flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  Comisarías
                </span>
              </NavLink>

              <NavLink
                to="/tienda"
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-xl text-sm font-medium ${
                    isActive 
                      ? 'bg-blue-600/20 text-blue-400' 
                      : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                  }`
                }
                onClick={closeMenu}
              >
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                  Tienda
                </span>
              </NavLink>

              {isSignedIn ? (
                <>
                  <NavLink
                    to="/publicar"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-xl text-sm font-medium ${
                        isActive 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    <span className="flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Publicar
                    </span>
                  </NavLink>

                  <NavLink
                    to="/perfil"
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-xl text-sm font-medium ${
                        isActive 
                          ? 'bg-blue-600/20 text-blue-400' 
                          : 'text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    <span className="flex items-center">
                      {userImageUrl ? (
                        <img 
                          src={userImageUrl} 
                          alt={userName} 
                          className="w-6 h-6 rounded-full mr-2 border border-white/20"
                        />
                      ) : (
                        <User className="w-4 h-4 mr-2" />
                      )}
                      Perfil
                    </span>
                  </NavLink>

                  <button
                    onClick={() => {
                      handleSignOut();
                      closeMenu();
                    }}
                    className="block w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors duration-300"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <NavLink
                  to="/sign-in"
                  className="block w-full text-center gradient-button"
                  onClick={closeMenu}
                >
                  Iniciar Sesión
                </NavLink>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;