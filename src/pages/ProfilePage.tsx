import React, { useState, useEffect } from 'react';
import { User, Package, Settings, Camera, Save, Mail, Plus, Phone, Shield } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useUserObjects } from '../hooks/useUserObjects';
import { useObjects } from '../hooks/useObjects'; // Añade esto si no está
import ObjectCard from '../components/objects/ObjectCard';
import { Link, useNavigate, useLocation } from 'react-router-dom';


const ProfilePage: React.FC = () => {
  const { user, isLoaded } = useUser();
  const { signOut } = useClerk();
  // const { objects, loading, error } = useUserObjects();
  // Usa el hook global para probar si aparecen objetos
  const { objects, loading, error } = useObjects();
  const location = useLocation();

  const [isEditing, setIsEditing] = useState(false);
  const [objectsFilter, setObjectsFilter] = useState<'all' | 'published' | 'claimed' | 'delivered' | 'recovered'>('all');
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    profileImage: '',
    phone: user?.phoneNumbers?.[0]?.phoneNumber || ''
  });
  const [showEditModal, setShowEditModal] = useState(false);

  // Actualizar profileData cuando el usuario se carga
  useEffect(() => {
    if (user && isLoaded) {
      setProfileData({
        name: user.fullName || '',
        email: user.primaryEmailAddress?.emailAddress || '',
        profileImage: user.imageUrl || '',
        phone: user.phoneNumbers?.[0]?.phoneNumber || ''
      });
    }
  }, [user, isLoaded]);

  // Debug logs
  useEffect(() => {
    console.log('ProfilePage - User loaded:', !!user);
    console.log('ProfilePage - Objects:', objects);
    console.log('ProfilePage - Loading:', loading);
    console.log('ProfilePage - Error:', error);
  }, [user, objects, loading, error]);

  // Debug: muestra los objetos en consola
  useEffect(() => {
    console.log('Objetos recibidos en ProfilePage:', objects);
  }, [objects]);

  // Debug: muestra todas las opciones posibles para asociar objetos al usuario Clerk
  useEffect(() => {
    if (objects && objects.length > 0 && user) {
      console.log('--- Ejemplo de objeto recibido ---');
      console.log(objects[0]);
      console.log('user.id (Clerk):', user.id);

      objects.forEach((obj, idx) => {
        console.log(`Objeto[${idx}]: id=${obj.id}`);
        // Opciones de asociación según tu esquema Prisma
        console.log('  publisher_id:', obj.publisher_id, '(debe ser igual a users.clerk_id)');
        console.log('  claimer_id:', obj.claimer_id, '(debe ser igual a users.clerk_id)');
        console.log('  publisher?.clerk_id:', obj.publisher?.clerk_id);
        console.log('  claimer?.clerk_id:', obj.claimer?.clerk_id);
        console.log('  publisher?.id:', obj.publisher?.id, '(id interno de users)');
        console.log('  claimer?.id:', obj.claimer?.id, '(id interno de users)');
        // Asociación real con el usuario Clerk
        console.log('  ¿Publicado por este usuario Clerk?', obj.publisher_id === user.id || obj.publisher?.clerk_id === user.id);
        console.log('  ¿Reclamado por este usuario Clerk?', obj.claimer_id === user.id || obj.claimer?.clerk_id === user.id);
      });
    }
  }, [objects, user]);

  // Cambia el modo edición si viene del Navbar
  useEffect(() => {
    if (location.state && (location.state as any).edit) {
      setShowEditModal(true);
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // Evita renderizar hasta que Clerk esté completamente cargado
  if (!isLoaded) {
    console.log('ProfilePage - User not loaded yet');
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  // Mostrar mensaje si no hay usuario (no logueado)
  if (!user) {
    console.log('ProfilePage - No user found');
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div>
          <h1 className="text-2xl font-bold mb-4">No has iniciado sesión</h1>
          <p className="text-blue-200">Debes iniciar sesión para ver tu perfil.</p>
        </div>
      </div>
    );
  }

  // Manejo seguro de objects basado en tu esquema de Prisma
  const safeObjects = React.useMemo(() => {
    try {
      if (!objects || !Array.isArray(objects)) {
        console.log('Objects is not an array or is null:', objects);
        return [];
      }
      return objects;
    } catch (err) {
      console.error('Error processing objects:', err);
      return [];
    }
  }, [objects]);

  // Filtrar objetos publicados y reclamados por el usuario Clerk actual
  // publisher.clerk_id y claimer.clerk_id ya están incluidos en la respuesta del backend
  const publishedObjects = Array.isArray(objects)
    ? objects.filter(obj =>
        obj.publisher?.clerk_id === user.id
      )
    : [];

  const claimedObjects = Array.isArray(objects)
    ? objects.filter(obj =>
        obj.claimer?.clerk_id === user.id
      )
    : [];

  // Si no tienes esos campos, NO podrás asociar correctamente los objetos al usuario Clerk solo desde el frontend.
  // SOLUCIÓN: Modifica tu endpoint de objetos para incluir publisher_clerk_id y claimer_clerk_id en cada objeto.

  // Ejemplo de cómo hacerlo en el backend (Prisma):
  // include: {
  //   publisher: { select: { clerk_id: true } },
  //   claimer: { select: { clerk_id: true } },
  //   ...
  // }
  // y luego en el mapeo de la respuesta:
  // objetos.map(obj => ({
  //   ...obj,
  //   publisher_clerk_id: obj.publisher?.clerk_id,
  //   claimer_clerk_id: obj.claimer?.clerk_id,
  // }))

  const filteredObjects = React.useMemo(() => {
    switch (objectsFilter) {
      case 'published':
        return publishedObjects;
      case 'claimed':
        return claimedObjects;
      case 'delivered':
        return publishedObjects.filter(obj => obj.entregado_recuperado === true);
      case 'recovered':
        return claimedObjects.filter(obj => obj.entregado_recuperado === true);
      case 'all':
      default:
        // Combinar objetos publicados y reclamados, evitando duplicados
        const allObjects = [...publishedObjects];
        claimedObjects.forEach(claimed => {
          if (!allObjects.find(pub => pub.id === claimed.id)) {
            allObjects.push(claimed);
          }
        });
        return allObjects;
    }
  }, [objectsFilter, publishedObjects, claimedObjects]);

  // Estadísticas corregidas para los nuevos status finales
  const stats = React.useMemo(() => {
    if (loading || !publishedObjects || !claimedObjects) {
      return {
        total: 0,
        published: 0,
        claimed: 0,
        delivered: 0,
        recovered: 0,
      };
    }
    const allUserObjects = [...publishedObjects];
    claimedObjects.forEach(claimed => {
      if (!allUserObjects.find(pub => pub.id === claimed.id)) {
        allUserObjects.push(claimed);
      }
    });

    // Entregados: 
    // - Si publisher y objeto.status === 'entregado'
    // - O si claimer y objeto.status === 'recuperado'
    const delivered =
      publishedObjects.filter(
        obj => obj.status === 'entregado'
      ).length +
      claimedObjects.filter(
        obj => obj.status === 'recuperado'
      ).length;

    // Recuperados:
    // - Si publisher y objeto.status === 'recuperado'
    // - O si claimer y objeto.status === 'entregado'
    const recovered =
      publishedObjects.filter(
        obj => obj.status === 'recuperado'
      ).length +
      claimedObjects.filter(
        obj => obj.status === 'entregado'
      ).length;

    return {
      total: allUserObjects.length,
      published: publishedObjects.length,
      claimed: claimedObjects.length,
      delivered,
      recovered,
    };
  }, [publishedObjects, claimedObjects, loading]);

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const { name, value } = e.target;
      setProfileData(prev => ({
        ...prev,
        [name]: value
      }));
    } catch (err) {
      console.error('Error handling profile change:', err);
    }
  };

  const handleSaveProfile = async () => {
    try {
      if (user) {
        const nameParts = profileData.name.split(' ');
        await user.update({
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0];
      if (!file) return;
      
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setProfileData(prev => ({
            ...prev,
            profileImage: event.target.result as string
          }));
        }
      };
      reader.onerror = (err) => {
        console.error('Error reading file:', err);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error('Error handling image upload:', err);
    }
  };

  // NUEVO: función para marcar como entregado/recuperado desde el perfil
  const handleMarkDelivered = async (objectId: string) => {
    try {
      const token = (window as any).Clerk?.session?.token || localStorage.getItem('__session');
      if (!token) {
        alert('No hay sesión activa. Por favor, inicia sesión.');
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${objectId}/entregar`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ entregado_recuperado: true })
      });
      if (!response.ok) {
        let errorMsg = 'Error al marcar como entregado/recuperado';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch (e) {
          errorMsg = response.statusText || errorMsg;
        }
        alert(errorMsg);
        return;
      }
      window.location.reload();
    } catch (error) {
      alert('Error al actualizar el estado');
      console.error(error);
    }
  };

  // Error boundary
  if (error) {
    // Solo muestra el error si loading ya terminó
    if (!loading) {
      console.error('ProfilePage - Hook error:', error);
      return (
        <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-400">Error al cargar los datos</h1>
            <p className="text-blue-200 mb-4">Error: {error.message || 'Error desconocido'}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      );
    }
    // Si loading, no muestres nada (deja que el loading UI se muestre)
    return null;
  }

  // Fondo gris suave y elegante
  const backgroundStyle: React.CSSProperties = {
    //background: 'linear-gradient(351deg, rgba(4,19,29,0.97) 0%, rgba(108,172,228,0.10) 49%, rgba(255,255,255,0.97) 100%)',
    position: 'absolute',
    inset: 0,
    zIndex: 0,
    transition: 'background 0.6s cubic-bezier(0.4,0,0.2,1)'
  };

  try {
    return (
      <div className="min-h-screen w-full flex flex-col relative">
        <div style={backgroundStyle} aria-hidden="true"></div>
        <div className="flex flex-col flex-grow relative z-10">
          <main className="flex-grow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Profile Header */}
              <div className="glass-card mb-8 hover-card hover-glow">
                <div className="p-8 flex items-center">
                  <div className="flex-shrink-0 mb-4 md:mb-0">
                    <div className="relative">
                      <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/20 shadow-lg">
                        {profileData.profileImage ? (
                          <img
                            src={profileData.profileImage}
                            alt="Profile"
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              console.error('Error loading profile image');
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-blue-900/50 text-blue-400">
                            <User className="h-12 w-12" />
                          </div>
                        )}
                      </div>
                      {isEditing && (
                        <label htmlFor="profileImage" className="absolute bottom-0 right-0 glass-card p-2 cursor-pointer hover:bg-white/20 hover-glow" >
                          <Camera className="h-4 w-4 text-blue-400" />
                          <input
                            type="file"
                            id="profileImage"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      )}
                    </div>
                  </div>
                  <div className="md:ml-6 flex-1">
                    {/* Botón Editar perfil ahora abre el modal */}
                    <h1 className="text-2xl font-bold gradient-text">{user.fullName || 'Usuario'}</h1>
                    <div className="mt-2 flex items-center text-blue-200">
                      <Mail className="h-4 w-4 mr-1 text-blue-400" />
                      <span>{user.primaryEmailAddress?.emailAddress || 'Sin email'}</span>
                    </div>
                    {user.phoneNumbers?.[0]?.phoneNumber && (
                      <div className="mt-1 flex items-center text-blue-200">
                        <Phone className="h-4 w-4 mr-1 text-blue-400" />
                        <span>{user.phoneNumbers[0].phoneNumber}</span>
                      </div>
                    )}
                    <div className="mt-6 flex space-x-3">
                      <button
                        onClick={() => setShowEditModal(true)}
                        className="glass-card inline-flex items-center px-6 py-3 hover:bg-white/20 transition-all duration-300 hover-glow"
                      >
                        <Settings className="h-4 w-4 mr-1 text-blue-400" />
                        Editar perfil
                      </button>
                      <Link
                        to="/publicar"
                        className="gradient-button inline-flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Publicar objeto
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats - Adaptadas a tu esquema */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                {loading ? (
                  // Mientras carga, muestra un skeleton o spinner en vez de 0
                  <>
                    <div className="glass-card p-6 hover-card animate-pulse bg-blue-900/20 hover-glow" />
                    <div className="glass-card p-6 hover-card animate-pulse bg-blue-900/20 hover-glow" />
                    <div className="glass-card p-6 hover-card animate-pulse bg-blue-900/20 hover-glow" />
                    <div className="glass-card p-6 hover-card animate-pulse bg-blue-900/20 hover-glow" />
                    <div className="glass-card p-6 hover-card animate-pulse bg-blue-900/20 hover-glow" />
                  </>
                ) : (
                  <>
                    <div
                      className={`glass-card p-6 hover-card cursor-pointer transition-all duration-200 hover-glow hover:bg-blue-600/30 
 ${
                      objectsFilter === 'all' ? 'ring-2 ring-blue-400' : ''
                    }`}
                      onClick={() => setObjectsFilter('all')}
                      title="Ver todos los objetos"
                    >
                      <div className="text-sm font-medium text-blue-300 ">Total objetos</div>
                      <div className="mt-2 text-3xl font-semibold gradient-text">{stats.total}</div>
                    </div>
                    <div
                      className={`glass-card p-6 hover-card cursor-pointer transition-all duration-200 hover-glow hover:bg-blue-600/30 hover-glow ${
                      objectsFilter === 'published' ? 'ring-2 ring-blue-400' : ''
                    }`}
                      onClick={() => setObjectsFilter('published')}
                      title="Ver solo publicados"
                    >
                      <div className="text-sm font-medium text-blue-300">Publicados</div>
                      <div className="mt-2 text-3xl font-semibold text-blue-400">{stats.published}</div>
                    </div>
                    <div
                      className={`glass-card p-6 hover-card cursor-pointer transition-all duration-200 hover-glow hover:bg-blue-600/30 ${
                      objectsFilter === 'claimed' ? 'ring-2 ring-blue-400' : ''
                    }`}
                      onClick={() => setObjectsFilter('claimed')}
                      title="Ver solo reclamados"
                    >
                      <div className="text-sm font-medium text-blue-300">Reclamados</div>
                      <div className="mt-2 text-3xl font-semibold text-orange-400">{stats.claimed}</div>
                    </div>
                    <div
                      className={`glass-card p-6 hover-card cursor-pointer transition-all duration-200 hover-glow hover:bg-blue-600/30 ${
                      objectsFilter === 'delivered' ? 'ring-2 ring-blue-400' : ''
                    }`}
                      onClick={() => setObjectsFilter('delivered')}
                      title="Entregados (publicados por ti y entregados)"
                    >
                      <div className="text-sm font-medium text-blue-300">Entregados</div>
                      <div className="mt-2 text-3xl font-semibold text-green-400">{stats.delivered}</div>
                    </div>
                    <div
                      className={`glass-card p-6 hover-card cursor-pointer transition-all duration-200 hover-glow hover:bg-blue-600/30 ${
                      objectsFilter === 'recovered' ? 'ring-2 ring-blue-400' : ''
                    }`}
                      onClick={() => setObjectsFilter('recovered')}
                      title="Recuperados (reclamados por ti y entregados)"
                    >
                      <div className="text-sm font-medium text-blue-300">Recuperados</div>
                      <div className="mt-2 text-3xl font-semibold text-pink-400">{stats.recovered}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Objects Section */}
              <div className="glass-card overflow-hidden hover-glow">
                <div className="p-8">
                  <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold gradient-text">Mis objetos</h2>
                    <div className="glass-card inline-flex rounded-lg hover-glow" role="group">
                      <button
                        onClick={() => setObjectsFilter('all')}
                        className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-all duration-300 ${
                      objectsFilter === 'all'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'hover:bg-white/10 text-blue-200'
                    }`}
                      >
                        Todos ({stats.total})
                      </button>
                      <button
                        onClick={() => setObjectsFilter('published')}
                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      objectsFilter === 'published'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'hover:bg-white/10 text-blue-200'
                    }`}
                      >
                        Publicados ({stats.published})
                      </button>
                      <button
                        onClick={() => setObjectsFilter('claimed')}
                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      objectsFilter === 'claimed'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'hover:bg-white/10 text-blue-200'
                    }`}
                      >
                        Reclamados ({stats.claimed})
                      </button>
                      <button
                        onClick={() => setObjectsFilter('delivered')}
                        className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                      objectsFilter === 'delivered'
                        ? 'bg-gradient-to-r from-green-600 to-blue-600 text-white'
                        : 'hover:bg-white/10 text-green-400'
                    }`}
                      >
                        Entregados ({stats.delivered})
                      </button>
                      <button
                        onClick={() => setObjectsFilter('recovered')}
                        className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-all duration-300 ${
                      objectsFilter === 'recovered'
                        ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                        : 'hover:bg-white/10 text-pink-400'
                    }`}
                      >
                        Recuperados ({stats.recovered})
                      </button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="flex justify-center items-center py-20">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400"></div>
                    </div>
                  ) : filteredObjects.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredObjects.map(object => (
                        <div key={object.id} className="hover-card">
                          <Link
                            to={`/objetos/${object.id}`}
                            state={{ fromProfile: true }}
                            className="block"
                            onClick={() => {
                              sessionStorage.setItem('fromProfile', 'true');
                            }}
                          >
                            <ObjectCard 
                              object={object}
                              showStatus={true}
                              isOwner={object.publisher?.clerk_id === user.id}
                              isClaimed={object.claimer?.clerk_id === user.id}
                            />
                          </Link>
                          {/* Botón SIEMPRE visible para el publicador si no está entregado/recuperado */}
                          {object.publisher?.clerk_id === user.id && !object.entregado_recuperado && (
                            <button
                              onClick={() => handleMarkDelivered(object.id)}
                              className="mt-2 w-full gradient-button inline-flex items-center justify-center"
                            >
                              <Shield className="h-4 w-4 mr-2" />
                              {object.status === 'perdido' || object.status === 'pendiente_recuperacion'
                                ? 'Recuperado'
                                : 'Entregado'}
                            </button>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-20">
                      <Package className="mx-auto h-12 w-12 text-blue-400 mb-4" />
                      <p className="text-blue-200 text-lg">
                        {objectsFilter === 'published' 
                          ? 'No tienes objetos publicados'
                          : objectsFilter === 'claimed' 
                          ? 'No has reclamado ningún objeto'
                          : 'No tienes objetos asociados'
                        }
                      </p>
                      <Link
                        to="/publicar"
                        className="mt-4 gradient-button inline-flex items-center"
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Publicar objeto
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </main>
        </div>
        
        {/* Modal de edición de perfil */}
        {showEditModal && (
          <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
            <div className="bg-gradient-to-br from-[#0a2236]/90 via-[#1e3350]/80 to-[#6CACE4]/30 border border-blue-400/30 shadow-2xl rounded-2xl p-8 max-w-md w-full relative">
              <button
                className="absolute top-3 right-3 text-blue-200 hover:text-white text-2xl font-bold"
                onClick={() => setShowEditModal(false)}
                aria-label="Cerrar"
              >
                ×
              </button>
              <h2 className="text-2xl font-bold mb-6 text-blue-200 text-center tracking-tight">Editar perfil</h2>
              <div className="space-y-5">
                <div>
                  <label htmlFor="name" className="block text-sm font-semibold text-blue-300 mb-1">
                    Nombre
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="block w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-xl transition-all duration-300"
                    value={profileData.name}
                    onChange={handleProfileChange}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-blue-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="block w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-xl transition-all duration-300 opacity-60"
                    value={profileData.email}
                    disabled
                  />
                </div>
                <div>
                  <label htmlFor="phone" className="block text-sm font-semibold text-blue-300 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="block w-full px-4 py-3 bg-white/10 border border-blue-400/30 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent backdrop-blur-xl transition-all duration-300 opacity-60"
                    value={profileData.phone}
                    disabled
                  />
                </div>
                <div className="flex space-x-3 mt-8 justify-center">
                  <button
                    onClick={async () => {
                      await handleSaveProfile();
                      setShowEditModal(false);
                    }}
                    className="gradient-button inline-flex items-center px-6 py-3 rounded-lg font-semibold shadow hover:scale-105 transition-transform"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Guardar
                  </button>
                  <button
                    onClick={() => setShowEditModal(false)}
                    className="glass-card inline-flex items-center px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-all duration-300 hover-glow"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      
    );
  } catch (renderError) {
    console.error('Error rendering ProfilePage:', renderError);
    return (
      <div style={backgroundStyle} className="min-h-screen w-full flex flex-col">
        <div className="flex-grow flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4 text-red-400">Error al cargar el perfil</h1>
            <p className="text-blue-200 mb-4">Error de renderizado: {renderError?.message}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-6 py-3 bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Recargar página
            </button>
          </div>
        </div>

      </div>
    );
  }
};

export default ProfilePage;