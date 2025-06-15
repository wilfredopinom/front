import React, { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {  Plus, User, Shield, Settings, SquarePen, Logout,user, LogOut } from 'lucide-react';
import { useClerk, useUser } from '@clerk/clerk-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const { signOut } = useClerk();
  const { isSignedIn, user } = useUser();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Cierra el menú al hacer click fuera
  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(e.target as Node)
      ) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [profileMenuOpen]);

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
      <nav className="glass-card border-b border-white/20 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center group" onClick={closeMenu}>
                
                <div className=" hover-glow">
                <Link to="/">
                    <img src="/logoOnde.png" alt="Ondeesta Logo" style={{ height: '100px', width: '100px', border:'white', marginRight: '12px' }} />
                </Link>
            </div>
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

                  {/* Avatar dropdown */}
                  <div className="relative" ref={profileMenuRef}>
                    <button
                      className="focus:outline-none"
                      onClick={() => setProfileMenuOpen((open) => !open)}
                      aria-label="Abrir menú de usuario"
                      tabIndex={0}
                      type="button"
                    >
                      <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-blue-400 shadow-lg hover:shadow-xl transition-all duration-200 bg-blue-900/50 flex items-center justify-center">
                        {userImageUrl ? (
                          <img
                            src={userImageUrl}
                            alt={userName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-5 h-5 text-blue-400" />
                        )}
                      </div>
                    </button>
                    {/* Usa un portal para asegurar el z-index y que no quede oculto */}
                    {profileMenuOpen && (
                      <div
                        className="absolute right-0 mt-3 w-56 bg-[#04131D]/95 border border-white/10 rounded-xl shadow-xl z-[9999] py-2"
                        style={{ minWidth: 220 }}
                      >
                        <div className="px-4 py-3 border-b border-white/10">
                          <div className="flex items-center">
                            <div className="h-9 w-12 rounded-full overflow-hidden border border-blue-400 mr-3 bg-blue-900/50">
                              {userImageUrl ? (
                                <img
                                  src={userImageUrl}
                                  alt={userName}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center text-blue-400">
                                  <User className="h-6 w-6" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="font-semibold text-blue-200 truncate">{userName}</div>
                              <div className="text-xs text-blue-300 truncate">{user?.primaryEmailAddress?.emailAddress}</div>
                            </div>
                          </div>
                        </div>
                        <Link
                          to="/perfil"
                          className="block px-4 py-3 text-blue-200 hover:bg-blue-900/40 transition-colors duration-200 flex items-center"
                          onClick={() => setProfileMenuOpen(false)}
                        >
                          <User className="h-4 w-4 mr-2 text-blue-600" />
                          Ver perfil
                        </Link>
                        <button
                          className="w-full text-left px-4 py-3 text-blue-200 hover:bg-blue-900/40 transition-colors duration-200 flex items-center"
                          onClick={() => {
                            setProfileMenuOpen(false);
                            navigate('/perfil', { state: { edit: true } });
                          }}
                          type="button"
                        >
                          <SquarePen className="h-4 w-4 mr-2 text-blue-400" />
                          Editar perfil
                        </button>
                        <button
                           className="w-full text-left px-4 py-3 text-red-300 hover:bg-red-900/40 transition-colors duration-200 flex items-center"
                          onClick={handleSignOut}
                          type="button"
                        >
                           <LogOut className="h-4 w-4 mr-2 text-red-600" />
                          Salir
                        </button>
                      </div>
                    )}
                  </div>
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
                className="glass-card p-2 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors duration-300 hover-glow"
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
          <div className="md:hidden glass-card border-t border-white/20 hover-glow">
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
                  iar Sesión
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