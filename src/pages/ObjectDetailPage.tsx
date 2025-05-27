import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useObjects } from '../hooks/useObjects';
import { useUser } from '@clerk/clerk-react';
import { MapPin, Calendar, User, MessageSquare, Flag, Shield, Mail, Phone, ExternalLink, ArrowLeft } from 'lucide-react';
import ShareMenu from '../components/objects/ShareMenu';
import MessageSystem from '../components/messages/MessageSystem';
import FeedbackForm from '../components/feedback/FeedbackForm';

const ObjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { objects, claimObject, deleteObject, deleteClaim } = useObjects();
  const { user } = useUser();
  const [showMessages, setShowMessages] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showClaimForm, setShowClaimForm] = useState(false);
  const [claimMessage, setClaimMessage] = useState('');
  const [claimError, setClaimError] = useState<string | null>(null);

  const object = objects.find(obj => obj.id === id);

  const handleClaimSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimMessage.trim() || !user || !object) return;

    try {
      await claimObject(object.id, claimMessage);
      setShowClaimForm(false);
      setClaimMessage('');
      setClaimError(null);
    } catch (error) {
      setClaimError('Error al reclamar el objeto. Por favor, inténtalo de nuevo.');
      console.error('Error claiming object:', error);
    }
  };

  const handleDeleteObject = async () => {
    if (!object || !window.confirm('¿Estás seguro de que deseas eliminar este objeto?')) return;

    try {
      await deleteObject(object.id);
      navigate('/objetos');
    } catch (error) {
      console.error('Error deleting object:', error);
      alert('Error al eliminar el objeto');
    }
  };

  const handleDeleteClaim = async (claimId: string) => {
    if (!object || !window.confirm('¿Estás seguro de que deseas eliminar esta reclamación?')) return;

    try {
      await deleteClaim(object.id, claimId);
    } catch (error) {
      console.error('Error deleting claim:', error);
      alert('Error al eliminar la reclamación');
    }
  };

  if (!object) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center glass-card p-8">
          <h1 className="text-2xl font-bold text-blue-300">Objeto no encontrado</h1>
          <p className="mt-2 text-blue-200">
            El objeto que buscas no existe o ha sido eliminado.
          </p>
          <button
            onClick={() => navigate('/objetos')}
            className="mt-4 gradient-button"
          >
            Volver a la lista
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 glass-card inline-flex items-center px-4 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300"
      >
        <ArrowLeft className="h-5 w-5 mr-2" />
        Volver
      </button>

      <div className="glass-card overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-white/20">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-blue-300">{object.title}</h1>
              <div className="mt-2 flex items-center text-sm text-blue-200">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Publicado el {new Date(object.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex space-x-2">
              <ShareMenu url={window.location.href} title={object.title} />
              {user && (
                <button
                  onClick={() => setShowMessages(true)}
                  className="glass-card px-3 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Mensajes
                </button>
              )}
              {object.status === 'encontrado' && (
                <button
                  onClick={() => setShowClaimForm(true)}
                  className="gradient-button inline-flex items-center"
                >
                  <Shield className="h-4 w-4 mr-2" />
                  Reclamar objeto
                </button>
              )}
              <button
                onClick={() => setShowFeedback(true)}
                className="glass-card px-3 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300 inline-flex items-center"
              >
                <Flag className="h-4 w-4 mr-2" />
                Reportar
              </button>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Images */}
            <div className="space-y-4">
              <img
                src={object.images[0]}
                alt={object.title}
                className="w-full h-64 object-cover rounded-xl"
              />
              {object.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {object.images.slice(1).map((image, index) => (
                    <img
                      key={index}
                      src={image}
                      alt={`${object.title} ${index + 2}`}
                      className="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity duration-300"
                    />
                  ))}
                </div>
              )}
              
              {/* Delete Object Button (only visible to the publisher) */}
              {user && object.publisher.id === user.id && (
                <div className="mt-4">
                  <button
                    onClick={handleDeleteObject}
                    className="w-full inline-flex justify-center items-center px-4 py-2 glass-card border border-red-500/20 text-red-400 hover:text-red-300 transition-colors duration-300 rounded-xl"
                  >
                    <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Eliminar objeto
                  </button>
                </div>
              )}
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
                    <dd className="ml-2 text-sm text-blue-300">{object.category}</dd>
                  </div>
                  <div className="flex items-center">
                    <Flag className="h-5 w-5 text-purple-400 mr-2" />
                    <dt className="text-sm font-medium text-blue-200">Estado:</dt>
                    <dd className="ml-2 text-sm text-blue-300">{object.status}</dd>
                  </div>
                </dl>
              </div>

              {/* Publisher Information */}
              <div className="glass-card p-4 rounded-xl">
                <h2 className="text-lg font-medium text-blue-300 mb-4">Información del publicador</h2>
                <div className="flex items-center space-x-4">
                  <img
                    src={object.publisher.avatar || 'https://via.placeholder.com/48'}
                    alt={object.publisher.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <Link
                      to={`/perfil/${object.publisher.id}`}
                      className="text-blue-400 hover:text-blue-300 font-medium flex items-center transition-colors duration-300"
                    >
                      {object.publisher.name}
                      <ExternalLink className="h-4 w-4 ml-1" />
                    </Link>
                    {object.publisher.joinDate && (
                      <p className="text-sm text-blue-200">
                        Miembro desde {new Date(object.publisher.joinDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
                {object.status === 'encontrado' && object.contactInfo && (
                  <div className="mt-4 space-y-2">
                    {object.contactInfo.email && (
                      <a
                        href={`mailto:${object.contactInfo.email}`}
                        className="flex items-center text-sm text-blue-200 hover:text-blue-300 transition-colors duration-300"
                      >
                        <Mail className="h-4 w-4 mr-2 text-purple-400" />
                        {object.contactInfo.email}
                      </a>
                    )}
                    {object.contactInfo.phone && (
                      <a
                        href={`tel:${object.contactInfo.phone}`}
                        className="flex items-center text-sm text-blue-200 hover:text-blue-300 transition-colors duration-300"
                      >
                        <Phone className="h-4 w-4 mr-2 text-purple-400" />
                        {object.contactInfo.phone}
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Claimer Information (if claimed) */}
              {object.status === 'reclamado' && object.claimer && (
                <div className="glass-card bg-blue-500/10 p-4 rounded-xl">
                  <h2 className="text-lg font-medium text-blue-300 mb-4">Información del reclamante</h2>
                  <div className="flex items-center space-x-4">
                    <img
                      src={object.claimer.profileImage || 'https://via.placeholder.com/48'}
                      alt={object.claimer.name}
                      className="w-12 h-12 rounded-full"
                    />
                    <div>
                      <p className="font-medium text-blue-300">{object.claimer.name}</p>
                      {object.claimer.claimDate && (
                        <p className="text-sm text-blue-200">
                          Reclamado el {new Date(object.claimer.claimDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                  {object.claimer.claimMessage && (
                    <div className="mt-4">
                      <p className="text-sm text-blue-200 italic">"{object.claimer.claimMessage}"</p>
                    </div>
                  )}
                </div>
              )}

              {/* Claims Section */}
              {object.claims.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-lg font-medium text-blue-300 mb-4">Reclamaciones ({object.claims.length})</h3>
                  <div className="space-y-4">
                    {object.claims.map((claim) => (
                      <div key={claim.id} className="glass-card p-4 rounded-xl">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="text-sm text-blue-200">{claim.message}</p>
                            <p className="text-xs text-blue-200/70 mt-1">
                              {new Date(claim.date).toLocaleDateString()}
                            </p>
                          </div>
                          {user && claim.userId === user.id && (
                            <button
                              onClick={() => handleDeleteClaim(claim.id)}
                              className="text-red-400 hover:text-red-300 transition-colors duration-300"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            </button>
                          )}
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
          ownerId={object.publisher.id}
          onClose={() => setShowMessages(false)}
        />
      )}

      {showFeedback && (
        <FeedbackForm onClose={() => setShowFeedback(false)} />
      )}

      {/* Claim Form Modal */}
      {showClaimForm && (
        <div className="fixed inset-0 bg-gray-900/75 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="glass-card max-w-md w-full mx-4">
            <div className="p-6 border-b border-white/20">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-blue-300">
                  Reclamar objeto
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
                    Mensaje de reclamación <span className="text-pink-400">*</span>
                  </label>
                  <textarea
                    id="claimMessage"
                    rows={4}
                    value={claimMessage}
                    onChange={(e) => setClaimMessage(e.target.value)}
                    className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300"
                    placeholder="Describe por qué crees que este objeto es tuyo..."
                    required
                  />
                  <p className="mt-1 text-sm text-blue-200">
                    Proporciona detalles específicos que solo el propietario real conocería.
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
                  className="glass-card px-4 py-2 text-blue-300 hover:text-blue-400 transition-colors duration-300"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="gradient-button"
                >
                  Enviar reclamación
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObjectDetailPage;