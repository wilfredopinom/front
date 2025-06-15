import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link, useLocation } from 'react-router-dom';
import { useObjects } from '../hooks/useObjects';
import { useUser } from '@clerk/clerk-react';
import { useAuth } from '@clerk/clerk-react';
import { MapPin, Calendar, User,Flag, Shield, Mail, Phone, ExternalLink, ArrowLeft } from 'lucide-react';
import ShareMenu from '../components/objects/ShareMenu';
import MessageSystem from '../components/messages/MessageSystem';
import FeedbackForm from '../components/feedback/FeedbackForm';
import toast from 'react-hot-toast';


interface ObjectImage {
  url: string;
}

interface Claim {
  id: string;
  message: string;
  date: string;
  userId: string;
  claimantId?: string; // <-- Añade claimantId opcional
  status?: string; // <-- Añadir status opcional
}

interface Publisher {
  clerk_id: string | null | undefined;
  id: string;
  name: string;
  avatar?: string;
  joinDate?: string;
  created_at?: string;
  email?: string;
  phone?: string;
  

}

interface Categories {
  
  id: string;
  name: string; 
}

interface ContactInfo {
  email?: string;
  phone?: string;
}

interface Claimer {
  id: string;
  name: string;
  avatar?: string;
  created_at?: string;
  claimMessage?: string;
}

interface ObjectDetail {
  id: string;
  title: string;
  description: string;
  created_at: string;
  images: ObjectImage[];
  location: string;
  categories?: Categories;
  status: string;
  publisher: Publisher;
  contactInfo?: ContactInfo;
  claimer?: Claimer;
  claims: Claim[];
  entregado_recuperado?: boolean; // <-- Added property
}

const ObjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { claimObject } = useObjects();
  const { user } = useUser();
  const { getToken } = useAuth();
  const [showMessages, setShowMessages] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimError, setClaimError] = useState<string | null>(null);
  const [object, setObject] = useState<ObjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [zoomedImageUrl, setZoomedImageUrl] = useState<string | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    if (!id) {
      setError('ID de objeto no válido');
      setLoading(false);
      return;
    }

    const fetchObject = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Corregido: eliminar la coma y object?.id que causaba problemas
        const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        setObject(data);
      } catch (err) {
        console.error('Error fetching object:', err);
        setError(err instanceof Error ? err.message : 'Error al cargar el objeto');
      } finally {
        setLoading(false);
      }
    };

    fetchObject();
  }, [id]); // Dependencia simplificada solo con id

  // Asegura que ambos IDs existen y son string
  const isOwner = user && object && user.id && object.publisher?.clerk_id && String(user.id) === String(object.publisher.clerk_id);

  // Encuentra la reclamación del usuario actual (si existe)
  const myClaim = object?.claims?.find(
    claim =>
      claim.userId === user?.id || // clerk_id
      claim.claimantId === user?.id // UUID interno (legacy)
  );

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimMessage.trim() || !user || !object) return;

    try {
      await claimObject(object.id, claimMessage);
      setShowClaimForm(false);
      setClaimMessage('');
      setClaimError(null);

      // Recargar el objeto actualizado y usarlo tal cual, sin forzar status manualmente
      const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${object.id}`);
      if (response.ok) {
        const updatedObject = await response.json();
        setObject(updatedObject); // No forzar status aquí, dejar el backend decidir
        toast.success(
          object.status === 'perdido'
            ? '¡Notificación enviada! Ahora eres el atopador de este objeto.'
            : '¡Reclamación enviada! El objeto ahora está marcado como reclamado.'
        );
      } else {
        const errorData = await response.json();
        setClaimError(errorData.message || 'Error al actualizar el objeto tras reclamar');
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        setClaimError(error.message || 'Error al reclamar el objeto. Por favor, inténtalo de nuevo.');
        console.error('Error claiming object:', error);
      } else {
        setClaimError('Error al reclamar el objeto. Por favor, inténtalo de nuevo.');
        console.error('Error claiming object:', error);
      }
    }
  };

  // Eliminar objeto usando petición real al backend
  const handleDeleteObject = async () => {
    if (!object) return;
    setShowDeleteModal(false);
    try {
      const token = await getToken();
      if (!token) {
        alert('No hay sesión activa. Por favor, inicia sesión.');
        return;
      }
      // Debug log
      console.log('Intentando eliminar objeto:', object.id, 'con token:', token);
      const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${object.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        let errorMsg = 'Error al eliminar el objeto';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          // Si no es JSON, usa el statusText
          errorMsg = response.statusText || errorMsg;
        }
        alert(errorMsg);
        throw new Error(errorMsg);
      }
      navigate('/objetos');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Error al eliminar el objeto');
      console.error('Error deleting object:', error);
    }
  };

  const handleDeleteClaim = async (claimId: string) => {
    if (!object) return;

    try {
      const token = await getToken?.();
      if (!token) {
        toast.error('No hay sesión activa. Por favor, inicia sesión.');
        return;
      }
      // Llama directamente al endpoint correcto
      const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/claims/${claimId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!response.ok) {
        let errorMsg = 'Error al eliminar la reclamación';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          errorMsg = response.statusText || errorMsg;
        }
        toast.error(errorMsg);
        return;
      }
      // Actualizar el objeto sin refrescar la página
      const updatedObject = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${object.id}`).then(r => r.json());
      setObject(updatedObject);
      toast.success('Reclamación eliminada correctamente.');
    } catch (error) {
      toast.error('Error al eliminar la reclamación');
      console.error('Error deleting claim:', error);
    }
  };

  // Nueva función para actualizar el estado de una reclamación
  const handleUpdateClaimStatus = async (claimId: string, newStatus: 'aprobada' | 'rechazada') => {
    if (!object) return;
    try {
      const token = await getToken();
      if (!token) {
        toast.error('No hay sesión activa. Por favor, inicia sesión.');
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${object.id}/claims/${claimId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      if (!response.ok) {
        let errorMsg = 'Error al actualizar el estado de la reclamación';
        try {
          const errorData = await response.json();
          errorMsg = errorData.message || errorMsg;
        } catch {
          // Si no es JSON, usa el statusText
          errorMsg = response.statusText || errorMsg;
        }
        toast.error(errorMsg); // <-- Mostrar mensaje real
        return;
      }
      // Recargar objeto actualizado
      const updatedObject = await response.json();
      setObject(updatedObject);
      toast.success(`Reclamación ${newStatus === 'aprobada' ? 'aprobada' : 'rechazada'} correctamente.`);
    } catch (error) {
      toast.error('Error al actualizar el estado de la reclamación');
      console.error(error);
    }
  };

  // NUEVO: función para marcar como entregado/recuperado
  const handleMarkDelivered = async () => {
    if (!object) return;
    try {
      const token = await getToken();
      if (!token) {
        toast.error('No hay sesión activa. Por favor, inicia sesión.');
        return;
      }
      const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${object.id}/entregar`, {
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
        } catch {
          errorMsg = response.statusText || errorMsg;
        }
        toast.error(errorMsg);
        return;
      }
      const updatedObject = await response.json();
      setObject(updatedObject);
      toast.success(
        object.status === 'perdido'
          ? '¡Objeto marcado como recuperado!'
          : '¡Objeto marcado como entregado!'
      );
    } catch (error) {
      toast.error('Error al actualizar el estado');
      console.error(error);
    }
  };

  // Mostrar estados de carga y error
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="glass-card p-8 text-center hover-glow">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-blue-200">Cargando objeto...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="glass-card p-8 text-center hover-glow">
          <div className="text-red-400 mb-4">
            <Flag className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Error al cargar el objeto</p>
          </div>
          <p className="text-blue-200 mb-4">{error}</p>
          <button
            onClick={() => navigate('/objetos')}
            className="gradient-button "
          >
            Volver a objetos
          </button>
        </div>
      </div>
    );
  }

  if (!object) {
 
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
        <div className="glass-card p-8 text-center hover-glow">
          <div className="text-blue-300 mb-4">
            <Flag className="h-12 w-12 mx-auto mb-2" />
            <p className="text-lg font-medium">Objeto no encontrado</p>
          </div>
          <p className="text-blue-200 mb-4">El objeto que buscas no existe o ha sido eliminado.</p>
          <button
            onClick={() => navigate('/objetos')}
            className="gradient-button"
          >
            Volver a objetos
          </button>
        </div>
      </div>
    );
  }

  const handleImageNavigation = (direction: 'prev' | 'next', e: React.MouseEvent) => {
    e.stopPropagation();
    if (!object?.images) return;
    
    if (direction === 'prev') {
      setCurrentImageIndex((prev) => 
        prev === 0 ? object.images.length - 1 : prev - 1
      );
    } else {
      setCurrentImageIndex((prev) => 
        prev === object.images.length - 1 ? 0 : prev + 1
      );
    }
  };

  const handleImageClick = (index: number) => {
    setCurrentImageIndex(index);
    setZoomedImageUrl(object?.images[index].url);
  };

  // Al hacer click en "Reclamar objeto"
  const handleShowClaimForm = () => {
    if (myClaim) {
      toast.error(
        object?.status === 'perdido'
          ? 'Ya le has enviado una notificación al usuario.'
          : 'Ya has reclamado este objeto.'
      );
      return;
    }
    setShowClaimForm(true);
  };

  // Determina si vienes del perfil
  const fromProfile =
    (location.state && (location.state as { fromProfile?: boolean }).fromProfile) ||
    sessionStorage.getItem('fromProfile') === 'true';

  // NUEVO: Determina si el objeto es "perdido" o "encontrado"
  const canClaim =
    user &&
    !isOwner &&
    (object.status === 'encontrado' || object.status === 'perdido');

  // NUEVO: Texto dinámico para el botón y modal
  const claimButtonText =
    object.status === 'encontrado'
      ? 'Reclamar objeto'
      : object.status === 'perdido'
      ? 'He encontrado este objeto'
      : 'Reclamar';

  const claimModalTitle =
    object.status === 'encontrado'
      ? 'Reclamar objeto'
      : object.status === 'perdido'
      ? 'Notificar que has encontrado este objeto'
      : 'Reclamar';

  const claimModalPlaceholder =
    object.status === 'encontrado'
      ? 'Describe por qué crees que este objeto es tuyo...'
      : object.status === 'perdido'
      ? 'Describe dónde y cómo encontraste este objeto...'
      : '';

  // Helper para mostrar el estado inicial (perdido/encontrado) y el estado actual
  function getInitialStatus(status: string): 'perdido' | 'encontrado' | null {
    if (
      status === 'perdido' ||
      status === 'pendiente_recuperacion' ||
      status === 'recuperado'
    ) {
      return 'perdido';
    }
    if (
      status === 'encontrado' ||
      status === 'pendiente_entrega' ||
      status === 'entregado' ||
      status === 'reclamado'
    ) {
      return 'encontrado';
    }
    return null;
  }

  // Color para el estado inicial (solo color de fondo, sin borde)
  function getInitialStatusColor(status: string) {
    switch (status) {
      case 'perdido':
        return 'bg-pink-600 text-white';
      case 'encontrado':
        return 'bg-blue-600 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }


  function getCurrentStatusColor(status: string) {
    switch (status) {
      case 'pendiente_recuperacion':
      case 'pendiente_entrega':
        return 'bg-yellow-500 text-white';
      case 'recuperado':
        return 'bg-green-600 text-white';
      case 'entregado':
        return 'bg-green-600 text-white';
      case 'reclamado':
        return 'bg-orange-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  }

  // Cambia la visualización del estado para que use el texto amigable
  function getStatusText(status: string) {
    switch (status) {
      case 'perdido':
        return 'Perdido';
      case 'pendiente_recuperacion':
        return 'Pendiente de Recuperacion';
      case 'pendiente_entrega':
        return 'Pendiente de Entrega';
      case 'recuperado':
        return 'Recuperado';
      case 'entregado':
        return 'Entregado';
      case 'encontrado':
        return 'Encontrado';
      case 'reclamado':
        return 'Reclamado';
      default:
        return status.charAt(0).toUpperCase() + status.slice(1).replace(/_/g, ' ');
    }
  }

  // Fondo gris suave y elegante
  const backgroundStyle: React.CSSProperties = {
    //background: 'linear-gradient(351deg, rgba(4,19,29,0.97) 0%, rgba(108,172,228,0.10) 49%, rgba(255,255,255,0.97) 100%)',
    minHeight: '100vh',
    minWidth: '100vw',
    width: '100vw',
    height: '100vh',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 0,
    transition: 'background 0.6s cubic-bezier(0.4,0,0.2,1)'
  };

  return (
    <div style={backgroundStyle} className="min-h-screen w-full flex flex-col">
      <div className="flex flex-col flex-grow relative z-10">
        <main className="flex-grow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
            {/* Back Button */}
            <button
              onClick={() => {
                if (fromProfile) {
                  sessionStorage.removeItem('fromProfile');
                  navigate('/perfil');
                } else {
                  navigate('/objetos');
                }
              }}
              className="mb-6 glass-card inline-flex items-center px-4 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 hover-glow"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Volver
            </button>

            <div className="glass-card overflow-hidden hover-glow">
              {/* Header */}
              <div className="p-6 border-b border-white/20">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-bold text-blue-300">{object.title}</h1>
                    <div className="mt-2 flex items-center text-sm text-blue-200">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Publicado el {new Date(object.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <ShareMenu url={window.location.href} title={object.title} />
                    {/* CAMBIO: Mostrar botón si objeto es "encontrado" o "perdido" */}
                    {canClaim && (
                      <button
                        onClick={handleShowClaimForm}
                        className="gradient-button inline-flex items-center"
                      >
                        <Shield className="h-4 w-4 mr-2" />
                        {claimButtonText}
                      </button>
                    )}
                    <button
                      onClick={() => setShowFeedback(true)}
                      className="glass-card px-3 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center hover-glow"
                    >
                      <Flag className="h-4 w-4 mr-2" />
                      Reportar
                    </button>
                    {/* NUEVO BOTÓN: Solo para el publicador, si no está entregado/recuperado */}
                    {user?.id === object.publisher?.clerk_id &&
                      !object.entregado_recuperado && (
                      <button
                        onClick={handleMarkDelivered}
                        className="gradient-button inline-flex items-center"
                      >
                        {object.status === 'perdido' || object.status === 'pendiente_recuperacion' ? (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Recuperado
                          </>
                        ) : (
                          <>
                            <Shield className="h-4 w-4 mr-2" />
                            Entregado
                          </>
                        )}
                      </button>
                    )}
                    {user?.id === object.publisher?.clerk_id && (
                      <>
                        {/* Botón Editar funcional */}
                        <button
                          onClick={() => navigate(`/objetos/editar/${object.id}`)}
                          className="glass-card px-3 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center hover-glow"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2v-5m-4-4l4 4m0 0L13 20H7a2 2 0 01-2-2V7a2 2 0 012-2h5z" />
                          </svg>
                          Editar
                        </button>
                        {/* Botón Eliminar con modal de confirmación */}
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="glass-card px-3 py-2 text-red-400 hover:text-red-300 transition-colors duration-300 inline-flex items-center hover-glow"
                        >
                          <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </>
                    )}

                  </div>
                  
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Images */}
                  <div className="space-y-4">
                    {object.images && object.images.length > 0 ? (
                      <>
                        <img
                          src={object.images[0].url}
                          alt={object.title}
                          className="w-full h-80 object-cover rounded-xl cursor-zoom-in transform transition-transform duration-300 hover:scale-[1.02]"
                          onClick={() => handleImageClick(0)}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Imagen+no+disponible';
                          }}
                        />
                        {object.images.length > 1 && (
                          <div className="grid grid-cols-4 gap-2 mt-2">
                            {object.images.slice(1).map((image: ObjectImage, index: number) => (
                              <img
                                key={index}
                                src={image.url}
                                alt={`${object.title} ${index + 2}`}
                                className="w-full h-20 object-cover rounded-lg cursor-zoom-in transform transition-transform duration-300 hover:scale-[1.05]"
                                onClick={() => handleImageClick(index + 1)}
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/100x80?text=N/A';
                                }}
                              />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="w-full h-64 bg-gray-700 rounded-xl flex items-center justify-center">
                        <p className="text-gray-400">Sin imagen disponible</p>
                      </div>
                    )}

                    {/* Mapa de localización */}
                    <div>
                      <h2 className="text-lg font-medium text-blue-300 mb-2">Localización</h2>
                      <iframe
                        width="100%"
                        height="300"
                        loading="lazy"
                        src={`https://www.google.com/maps?q=${encodeURIComponent(object.location)}&output=embed`}
                        style={{ border: 0, borderRadius: '12px' }}
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                    
                   

                  {/* Details */}
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-lg font-medium text-blue-300">Descripción</h2>
                      <p className="mt-2 text-blue-200">{object.description}</p>
                    </div>

                    <div>
                      <h2 className="text-lg font-medium text-blue-300">Detalles</h2>
                      <dl className="mt-2 space-y-2">
                        <div className="flex items-center">
                          <MapPin className="h-5 w-5 text-purple-400 mr-2" />
                          <dt className="text-sm font-medium text-blue-200">Ubicación:</dt>
                          <dd className="ml-2 text-sm text-blue-300">{object.location}</dd>
                        </div>
                        <div className="flex items-center">
                          <User className="h-5 w-5 text-purple-400 mr-2" />
                          <dt className="text-sm font-medium text-blue-200">Categoría:</dt>
                          <dd className="ml-2 text-sm text-blue-300">{object.categories?.name.toUpperCase() || 'Sin categoría'}</dd>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Flag className="h-5 w-5 text-purple-400" />
                          <dt className="text-sm font-medium text-blue-200">Estado inicial:</dt>
                          {/* Etiqueta de color para el estado inicial */}
                          {(() => {
                            const initial = getInitialStatus(object.status);
                            if (initial) {
                              return (
                                <span
                                  className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getInitialStatusColor(initial)}`}
                                >
                                  {getStatusText(initial)}
                                </span>
                              );
                            }
                            return null;
                          })()}
                          {/* Etiqueta de color para el estado actual si es diferente al inicial */}
                          <dt className="text-sm font-medium text-blue-200">Estado Final:</dt>
                          {(() => {
                            const initial = getInitialStatus(object.status);
                            if (initial && object.status == initial){
                              return (
                                <span
                                  className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold ${getInitialStatusColor(initial)}`}
                                >
                                  {getStatusText(initial)}
                                </span>
                              );
                            }
                            if (initial && object.status !== initial) {
                              return (
                                <span
                                  className={`ml-2 px-3 py-1 rounded-full text-xs font-semibold border border-white/20 ${getCurrentStatusColor(object.status)}`}
                                >
                                  {getStatusText(object.status)}
                                </span>
                              );
                            }
                            return null;
                          })()}
                        </div>
                      </dl>
                    </div>

                    {/* Publisher Information */}
                    {object.publisher && (
                      <div className="glass-card p-4 rounded-xl hover-glow">
                        <h2 className="text-lg font-medium text-blue-300 mb-4">Información del publicador</h2>
                        <div className="flex items-center space-x-4">
                          <img
                            src={object.publisher.avatar ||  'https://placehold.co/48x48?text=User&font=roboto'}
                            alt={object.publisher.name}
                            className="w-12 h-12 rounded-full"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =  'https://placehold.co/48x48?text=User&font=roboto';
                            }}
                          />
                          <div>
                            <Link
                              to={`/perfil/${object.publisher.id}`}
                              className="text-blue-400 hover:text-blue-300 font-medium flex items-center transition-colors duration-300"
                            >
                              {object.publisher.name}
                              <ExternalLink className="h-4 w-4 ml-1" />
                            </Link>
                            {object.publisher.created_at && (
                              <p className="text-sm text-blue-200">
                                Miembro desde {new Date(object.publisher.created_at).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        </div>
                        {(object.status === 'encontrado' || object.status === 'perdido') && object.publisher && (
                          <div className="mt-4 space-y-2">
                            {object.publisher.email && (
                              <a
                                href={`mailto:${object.publisher.email}`}
                                className="flex items-center text-sm text-blue-200 hover:text-blue-300 transition-colors duration-300"
                              >
                                <Mail className="h-4 w-4 mr-2 text-purple-400" />
                                {object.publisher.email}
                              </a>
                            )}
                            {object.publisher.phone && (
                              <a
                                href={`tel:${object.publisher.phone}`}
                                className="flex items-center text-sm text-blue-200 hover:text-blue-300 transition-colors duration-300"
                              >
                                <Phone className="h-4 w-4 mr-2 text-purple-400" />
                                {object.publisher.phone}
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Información del reclamante/atopador (siempre visible, usa claimer para ambos casos) */}
                    <div className="glass-card bg-blue-500/10 p-4 rounded-xl hover-glow">
                      <h2 className="text-lg font-medium text-blue-300 mb-4">
                        {object.status === 'perdido'
                          ? 'Información del atopador'
                          : 'Información del reclamante'}
                      </h2>
                      <div className="flex items-center space-x-4">
                        {object.claimer && (object.claimer.id || object.claimer.name) ? (
                          object.claimer.avatar ? (
                            <img
                              src={object.claimer.avatar}
                              alt={object.claimer.name || (object.status === 'perdido' ? 'Atopador' : 'Reclamante')}
                              className="w-12 h-12 rounded-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = 'https://placehold.co/48x48?text=User&font=roboto';
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-200 font-bold text-xl">
                              {object.claimer.name
                                ?.split(' ')
                                .map((n: string) => n[0])
                                .join('')
                                .slice(0, 2)
                              }
                            </div>
                          )
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center text-blue-200">
                            <User className="h-6 w-6" />
                          </div>
                        )}
                        <div>
                          {object.claimer && (object.claimer.id || object.claimer.name) ? (
                            <>
                              <Link
                                to={`/perfil/${object.claimer.id}`}
                                className="text-blue-400 hover:text-blue-300 font-medium flex items-center transition-colors duration-300"
                              >
                                {object.claimer.name}
                                <ExternalLink className="h-4 w-4 ml-1" />
                              </Link>
                              {object.claimer.created_at && (
                                <p className="text-sm text-blue-200">
                                  Miembro desde {new Date(object.claimer.created_at).toLocaleDateString()}
                                </p>
                              )}
                            </>
                          ) : (
                            <span className="text-blue-200">
                              {object.status === 'perdido'
                                ? 'Aún no lo han encontrado'
                                : 'Aún no lo han reclamado'}
                            </span>
                          )}
                        </div>
                      </div>
                      {object.claimer && object.claimer.claimMessage && (
                        <div className="mt-4">
                          <h3 className="text-md font-medium text-blue-300 mb-2">
                            {object.status === 'perdido'
                              ? 'Mensaje del atopador'
                              : 'Mensaje de reclamación'}
                          </h3>
                          <p className="text-blue-200">{object.claimer.claimMessage}</p>
                        </div>
                      )}
                    </div>

                    {/* Claims list */}
                    {object.claims && object.claims.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-lg font-medium text-blue-300 mb-4">
                          {object.status === 'perdido'
                            ? `Atopadores (${object.claims.length})`
                            : `Reclamaciones (${object.claims.length})`}
                        </h3>
                        <div className="space-y-4">
                          {object.claims.map((claim: Claim) => (
                            <div key={claim.id} className="glass-card p-4 rounded-xl hover-glow">
                              <div className="flex justify-between items-start">
                                <div>
                                  <p className="text-sm text-blue-200">{claim.message}</p>
                                  <p className="text-xs text-blue-200/70 mt-1">
                                    {new Date(claim.date).toLocaleDateString()}
                                  </p>
                                  {/* Mostrar estado de la reclamación */}
                                  <p className={`text-xs mt-1 font-semibold ${
                                    claim.status === 'aprobada'
                                      ? 'text-green-400'
                                      : claim.status === 'rechazada'
                                      ? 'text-red-400'
                                      : 'text-yellow-300'
                                  }`}>
                                    Estado: {claim.status ? claim.status.charAt(0).toUpperCase() + claim.status.slice(1) : 'Pendiente'}
                                  </p>
                                </div>
                                <div className="flex flex-col items-end space-y-2">
                                  {/* Botón eliminar para el usuario que hizo la reclamación */}
                                  {user && (claim.userId === user.id || claim.claimantId === user.id) && (
                                    <button
                                      onClick={() => handleDeleteClaim(claim.id)}
                                      className="text-red-400 hover:text-red-300 transition-colors duration-300"
                                    >
                                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                    </button>
                                  )}
                                  {/* Botones aprobar/rechazar solo para el publicador y si está pendiente */}
                                  {user?.id === object.publisher?.clerk_id && claim.status === 'pendiente' && (
                                    <div className="flex space-x-2 mt-2">
                                      <button
                                        onClick={() => handleUpdateClaimStatus(claim.id, 'aprobada')}
                                        className="px-3 py-1 rounded bg-green-600 text-white text-xs hover:bg-green-700 transition"
                                      >
                                        Aprobar
                                      </button>
                                      <button
                                        onClick={() => handleUpdateClaimStatus(claim.id, 'rechazada')}
                                        className="px-3 py-1 rounded bg-red-600 text-white text-xs hover:bg-red-700 transition"
                                      >
                                        Rechazar
                                      </button>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Modals */}
            {showMessages && (
              <MessageSystem
                objectId={object.id}
                objectTitle={object.title}
                ownerId={object.publisher?.id}
                onClose={() => setShowMessages(false)}
              />
            )}

            {showFeedback && (
              <FeedbackForm onClose={() => setShowFeedback(false)} />
            )}

            {/* Claim Form Modal */}
            {showClaimForm && (
              <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-50">
                <div className="glass-card max-w-md w-full mx-4 hover-glow">
                  <div className="p-6 border-b border-white/20">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-blue-300">
                        {claimModalTitle}
                      </h3>
                      <button
                        onClick={() => setShowClaimForm(false)}
                        className="text-blue-300 hover:text-blue-400"
                      >
                        <span className="sr-only">Cerrar</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <form onSubmit={handleClaimSubmit} className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="claimMessage" className="block text-sm font-medium text-blue-300 mb-1">
                          {object.status === 'encontrado'
                            ? 'Mensaje de reclamación'
                            : object.status === 'perdido'
                            ? 'Mensaje para el dueño'
                            : 'Mensaje'}
                          <span className="text-pink-400">*</span>
                        </label>
                        <textarea
                          id="claimMessage"
                          rows={4}
                          value={claimMessage}
                          onChange={(e) => setClaimMessage(e.target.value)}
                          className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300"
                          placeholder={claimModalPlaceholder}
                          required
                        />
                        <p className="mt-1 text-sm text-blue-200">
                          {object.status === 'encontrado'
                            ? 'Proporciona detalles específicos que solo el propietario real conocería.'
                            : object.status === 'perdido'
                            ? 'Describe cómo y dónde encontraste el objeto. El dueño podrá contactarte.'
                            : ''}
                        </p>
                      </div>
                      {claimError && (
                        <div className="text-sm text-red-400">
                          {claimError}
                        </div>
                      )}
                    </div>

                    <div className="mt-6 flex justify-end space-x-3">
                      <button
                        type="button"
                        onClick={() => setShowClaimForm(false)}
                        className="glass-card px-4 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 hover-glow"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="gradient-button"
                      >
                        {claimButtonText}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Zoomed Image Modal */}
            {zoomedImageUrl && (
              <div 
                className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-8"
                onClick={() => setZoomedImageUrl(null)}
              >
                <div 
                  className="relative max-w-4xl w-full bg-white/5 rounded-2xl p-2 backdrop-blur-sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  {object.images.length > 1 && (
                    <>
                      <button
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm z-50"
                        onClick={(e) => handleImageNavigation('prev', e)}
                        type="button"
                      >
                        <span className="sr-only">Anterior</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <button
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/10 p-2 rounded-full text-white/80 hover:text-white hover:bg-white/20 transition-all duration-300 backdrop-blur-sm z-50"
                        onClick={(e) => handleImageNavigation('next', e)}
                        type="button"
                      >
                        <span className="sr-only">Siguiente</span>
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </>
                  )}
                  <button
                    className="absolute -top-2 -right-2 bg-white/10 p-2 rounded-full text-white/80 hover:text-white transition-colors duration-300 backdrop-blur-sm z-50"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setZoomedImageUrl(null);
                    }}
                    type="button"
                  >
                    <span className="sr-only">Cerrar</span>
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <img
                    src={object.images[currentImageIndex].url}
                    alt={`${object.title} - Imagen ${currentImageIndex + 1}`}
                    className="w-full h-auto max-h-[80vh] object-contain rounded-xl 
                      transform transition-all duration-300
                      border-2 border-white/10"
                    onClick={(e) => e.stopPropagation()}
                  />
                  {object.images.length > 1 && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/80 bg-black/50 px-3 py-1 rounded-full backdrop-blur-sm">
                      {currentImageIndex + 1} / {object.images.length}
                    </div>
                  )}
                </div>
              </div>
            )}
            {/* Modal de confirmación para eliminar */}
            {showDeleteModal && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
                <div className="glass-card max-w-md w-full mx-4 p-6 hover-glow">
                  <h3 className="text-lg font-medium text-red-400 mb-4">¿Eliminar objeto?</h3>
                  <p className="text-blue-200 mb-6">¿Estás seguro de que deseas eliminar este objeto? Esta acción no se puede deshacer.</p>
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      className="glass-card px-4 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 hover-glow"
                    >
                      Cancelar
                    </button>
                    <button
                      onClick={handleDeleteObject}
                      className="gradient-button bg-red-500 hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
      
    </div>
    
  );
 
};

export default ObjectDetailPage;