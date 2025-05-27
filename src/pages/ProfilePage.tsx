import React, { useState } from 'react';
import { User, Package, Settings, LogOut, Camera, Save, Phone, Mail, Search, CheckCircle, Plus } from 'lucide-react';
import { useUser, useClerk } from '@clerk/clerk-react';
import { useUserObjects } from '../hooks/useUserObjects';
import ObjectCard from '../components/objects/ObjectCard';
import { Link } from 'react-router-dom';

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const { signOut } = useClerk();
  const { objects, loading } = useUserObjects();
  
  const [activeTab, setActiveTab] = useState<'objects' | 'settings'>('objects');
  const [objectsFilter, setObjectsFilter] = useState<'all' | 'found' | 'claimed'>('all');
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: user?.fullName || '',
    email: user?.primaryEmailAddress?.emailAddress || '',
    phone: user?.phoneNumbers?.[0]?.phoneNumber || '',
    profileImage: user?.imageUrl || '',
  });

  const filteredObjects = objects.filter(obj => {
    if (objectsFilter === 'found') return obj.status === 'encontrado';
    if (objectsFilter === 'claimed') return obj.status === 'reclamado';
    return true;
  });

  const stats = {
    total: objects.length,
    found: objects.filter(obj => obj.status === 'encontrado').length,
    claimed: objects.filter(obj => obj.status === 'reclamado').length,
    delivered: objects.filter(obj => obj.status === 'entregado').length,
  };
  
  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Simulating image upload - in a real app we would upload to a server/storage
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setProfileData({
          ...profileData,
          profileImage: e.target.result as string
        });
      }
    };
    reader.readAsDataURL(file);
  };
  
  const handleSaveProfile = async () => {
    try {
      if (user) {
        await user.update({
          firstName: profileData.name.split(' ')[0],
          lastName: profileData.name.split(' ').slice(1).join(' '),
        });
      }
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h1 className="page-title mb-4">
            No has iniciado sesión
          </h1>
          <p className="text-blue-200">
            Debes iniciar sesión para ver tu perfil.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        {/* Profile Header */}
        <div className="glass-card mb-8 hover-card">
          <div className="p-8">
            <div className="md:flex items-center">
              <div className="flex-shrink-0 mb-4 md:mb-0">
                <div className="relative">
                  <div className="h-24 w-24 rounded-full overflow-hidden border-4 border-white/30 shadow-lg hover:border-blue-400/50 transition-all duration-300">
                    {profileData.profileImage ? (
                      <img 
                        src={profileData.profileImage} 
                        alt="Profile" 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center bg-blue-900/50 text-blue-400">
                        <User className="h-12 w-12" />
                      </div>
                    )}
                  </div>
                  {isEditing && (
                    <label htmlFor="profileImage" className="absolute bottom-0 right-0 glass-card p-2 cursor-pointer hover:bg-white/20 transition-all duration-300">
                      <Camera className="h-4 w-4 text-blue-400" />
                      <input 
                        type="file" 
                        id="profileImage" 
                        className="sr-only" 
                        accept="image/*"
                        onChange={handleProfileImageChange}
                      />
                    </label>
                  )}
                </div>
              </div>
              
              <div className="md:ml-6 flex-1">
                {isEditing ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-blue-300 mb-1">
                        Nombre
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300"
                        value={profileData.name}
                        onChange={handleProfileChange}
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-blue-300 mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300 opacity-50"
                        value={profileData.email}
                        disabled
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-blue-300 mb-1">
                        Teléfono
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300 opacity-50"
                        value={profileData.phone}
                        disabled
                      />
                    </div>
                  </div>
                ) : (
                  <>
                    <h1 className="text-2xl font-bold gradient-text">{user.fullName}</h1>
                    <div className="mt-2 flex items-center text-blue-200">
                      <Mail className="h-4 w-4 mr-1 text-blue-400" />
                      <span>{user.primaryEmailAddress?.emailAddress}</span>
                    </div>
                    {user.phoneNumbers?.[0]?.phoneNumber && (
                      <div className="mt-1 flex items-center text-blue-200">
                        <Phone className="h-4 w-4 mr-1 text-blue-400" />
                        <span>{user.phoneNumbers[0].phoneNumber}</span>
                      </div>
                    )}
                  </>
                )}
                
                <div className="mt-6 flex space-x-3">
                  {isEditing ? (
                    <>
                      <button
                        onClick={handleSaveProfile}
                        className="gradient-button inline-flex items-center"
                      >
                        <Save className="h-4 w-4 mr-1" />
                        Guardar cambios
                      </button>
                      <button
                        onClick={() => setIsEditing(false)}
                        className="glass-card inline-flex items-center px-6 py-3 hover:bg-white/20 transition-all duration-300"
                      >
                        Cancelar
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setIsEditing(true)}
                        className="glass-card inline-flex items-center px-6 py-3 hover:bg-white/20 transition-all duration-300"
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
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="glass-card p-6 hover-card">
            <div className="text-sm font-medium text-blue-300">Total objetos</div>
            <div className="mt-2 text-3xl font-semibold gradient-text">{stats.total}</div>
          </div>
          <div className="glass-card p-6 hover-card">
            <div className="text-sm font-medium text-blue-300">Encontrados</div>
            <div className="mt-2 text-3xl font-semibold text-yellow-400">{stats.found}</div>
          </div>
          <div className="glass-card p-6 hover-card">
            <div className="text-sm font-medium text-blue-300">Reclamados</div>
            <div className="mt-2 text-3xl font-semibold text-orange-400">{stats.claimed}</div>
          </div>
          <div className="glass-card p-6 hover-card">
            <div className="text-sm font-medium text-blue-300">Entregados</div>
            <div className="mt-2 text-3xl font-semibold text-green-400">{stats.delivered}</div>
          </div>
        </div>

        {/* Objects Section */}
        <div className="glass-card overflow-hidden">
          <div className="p-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-semibold gradient-text">Mis objetos</h2>
              <div className="glass-card inline-flex rounded-lg" role="group">
                <button
                  onClick={() => setObjectsFilter('all')}
                  className={`px-4 py-2 text-sm font-medium rounded-l-lg transition-all duration-300 ${
                    objectsFilter === 'all'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'hover:bg-white/10 text-blue-200'
                  }`}
                >
                  Todos
                </button>
                <button
                  onClick={() => setObjectsFilter('found')}
                  className={`px-4 py-2 text-sm font-medium transition-all duration-300 ${
                    objectsFilter === 'found'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'hover:bg-white/10 text-blue-200'
                  }`}
                >
                  Encontrados
                </button>
                <button
                  onClick={() => setObjectsFilter('claimed')}
                  className={`px-4 py-2 text-sm font-medium rounded-r-lg transition-all duration-300 ${
                    objectsFilter === 'claimed'
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                      : 'hover:bg-white/10 text-blue-200'
                  }`}
                >
                  Reclamados
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
                    <ObjectCard object={object} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <Package className="mx-auto h-12 w-12 text-blue-400 mb-4" />
                <p className="text-blue-200 text-lg">No tienes objetos {objectsFilter !== 'all' ? `${objectsFilter === 'found' ? 'encontrados' : 'reclamados'}` : ''}</p>
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
    </div>
  );
};

export default ProfilePage;