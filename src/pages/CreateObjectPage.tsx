import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, X } from 'lucide-react';
import Map from '../components/map/Map';
import { useAuth } from "@clerk/clerk-react";

const CreateObjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const [ loading, setLoading ] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    isPoliceStation: false,
    status: '', // Nuevo campo status, valor por defecto
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [coordinates, setCoordinates] = useState({ lat: 42.8806, lng: -8.5458 }); // Santiago de Compostela
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is being edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  
  const [files, setFiles] = useState<File[]>([]);
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;
    setFiles(prev => [...prev, ...Array.from(selectedFiles)]);
    Array.from(selectedFiles).forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  }

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    // En vez de poner "Lat: ...", pon una URL de Google Maps o las coordenadas en formato "lat,lng"
    setFormData(prev => ({
      ...prev,
      location: `${lat},${lng}`
    }));
  };
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }
    
    if (images.length === 0) {
      newErrors.images = 'Al menos una imagen es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (!validateForm()) return;

  setLoading(true);

  const token = await getToken();
  if (!token) {
    setErrors({ submit: 'No hay sesión activa. Por favor, inicia sesión.' });
    setLoading(false);
    return;
  }

  const formDataToSend = new FormData();
  formDataToSend.append('title', formData.title);
  formDataToSend.append('description', formData.description);
  formDataToSend.append('categories', formData.category);
  formDataToSend.append('location', formData.location);
  formDataToSend.append('status', formData.status); // Enviar status

  files.forEach((file) => {
    formDataToSend.append('images', file);
  });

  try {
    const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formDataToSend,
    });

    if (!response.ok) {
      let errorMsg = 'Error al publicar el objeto';
      try {
        const errorData = await response.json();
        errorMsg = errorData.message || errorMsg;
      } catch {
        // Intentionally ignored: response is not JSON or has no message
      }
      throw new Error(errorMsg);
    }

    // Redirige al listado tras publicar
    navigate('/objetos');
  } catch (error: unknown) {
    let errorMessage = 'Ha ocurrido un error al publicar el objeto.';
    if (error instanceof Error) {
      errorMessage = error.message || errorMessage;
    }
    setErrors({ submit: errorMessage });
  } finally {
    setLoading(false);
  }
};

  return (
    <div >
      {/* Fondo animado */}
      
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="glass-card overflow-hidden hover-glow">
          <div className="p-8">
            <h1 className="page-title mb-8">Publicar un objeto</h1>
            
            {errors.submit && (
              <div className="mb-6 glass-card bg-red-500/10 border-red-500/30 text-red-400 p-4 rounded-xl hover-glow">
                {errors.submit}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Basic Info */}
                <div>
                  <h2 className="text-xl font-semibold gradient-text mb-6">Información básica</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-blue-300 mb-1">
                        Título <span className="text-pink-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="title"
                        name="title"
                        className={`block w-full px-4 py-3 bg-white/10 border ${
                          errors.title ? 'border-red-500/50' : 'border-white/20'
                        } rounded-xl shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300`}
                        placeholder="Ej: Llaves encontradas en Alameda"
                        value={formData.title}
                        onChange={handleChange}
                      />
                      {errors.title && (
                        <p className="mt-2 text-sm text-red-400">{errors.title}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="description" className="block text-sm font-medium text-blue-300 mb-1">
                        Descripción <span className="text-pink-400">*</span>
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        rows={4}
                        className={`block w-full px-4 py-3 bg-white/10 border ${
                          errors.description ? 'border-red-500/50' : 'border-white/20'
                        } rounded-xl shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300`}
                        placeholder="Describe el objeto con detalle para que sea más fácil identificarlo..."
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-400">{errors.description}</p>
                      )}
                    </div>
                    
                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-blue-300 mb-1">
                        Categoría <span className="text-pink-400">*</span>
                      </label>
                      <select
                        id="category"
                        name="category"
                        className={`block w-full px-4 py-3 bg-white/10 border ${
                          errors.category ? 'border-red-500/50' : 'border-white/20'
                        } rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300`}
                        value={formData.category}
                        onChange={handleChange}
                      >
                        <option value="" className="bg-gray-900">Seleccionar categoría</option>
                        <option value="Documentos" className="bg-gray-900">Documentos</option>
                        <option value="Ropa y Accesorios" className="bg-gray-900">Ropa y Accesorios</option>
                        <option value="Llaves" className="bg-gray-900">Llaves</option>
                        <option value="Mascotas" className="bg-gray-900">Mascotas</option>
                        <option value="Otros" className="bg-gray-900">Otros</option>
                        <option value="Electrónicos" className="bg-gray-900">Electrónicos</option>
                        <option value="Vehículos" className="bg-gray-900">Vehículos</option>
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-400">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="status" className="block text-sm font-medium text-blue-300 mb-1">
                        Estado del objeto <span className="text-pink-400">*</span>
                      </label>
                      <select
                        id="status"
                        name="status"
                        className="block w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300"
                        value={formData.status}
                        onChange={handleChange}
                      >
                         <option value="" disabled hidden className="bg-gray-900">Selecciona un estado("Perdido" o "Encontrado")</option>
                        <option value="perdido" className="bg-gray-900">Perdido</option>
                        <option value="encontrado" className="bg-gray-900">Encontrado</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                {/* Location Section */}
                <div>
                  <h3 className="text-lg font-medium text-blue-300 mb-4">Ubicación</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="location" className="block text-sm font-medium text-blue-300 mb-1">
                        Dirección <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-blue-400" />
                        </div>
                        <input
                          type="text"
                          id="location"
                          name="location"
                          className={`block w-full pl-10 pr-3 py-3 bg-white/10 border ${
                            errors.location ? 'border-red-500/50' : 'border-white/20'
                          } rounded-xl shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300`}
                          placeholder="Ej: Calle Príncipe, 36202 Vigo"
                          value={formData.location}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.location && (
                        <p className="mt-2 text-sm text-red-400">{errors.location}</p>
                      )}
                    </div>
                    
                    {/* Previsualización del mapa si hay location */}
                    {formData.location && (
                      <div className="mt-4">
                        <h4 className="text-blue-300 text-sm mb-2">Previsualización en el mapa:</h4>
                        <iframe
                          width="100%"
                          height="300"
                          loading="lazy"
                          src={`https://www.google.com/maps?q=${encodeURIComponent(formData.location)}&output=embed`}
                          style={{ border: 0, borderRadius: '12px' }}
                          allowFullScreen
                        ></iframe>
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Images */}
                <div className="border-t border-white/10 pt-8">
                  <h2 className="text-xl font-semibold gradient-text mb-6">Imágenes</h2>
                  <div>
                    <label className="block text-sm font-medium text-blue-300 mb-1">
                      Subir imágenes <span className="text-pink-400">*</span>
                    </label>
                    
                    <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-white/20 border-dashed rounded-xl hover:border-blue-500/50 transition-colors duration-300">
                      <div className="space-y-2 text-center">
                        <Camera className="mx-auto h-12 w-12 text-blue-400" />
                        <div className="flex text-sm text-blue-200">
                          <label htmlFor="file-upload" className="relative cursor-pointer rounded-md font-medium text-blue-400 hover:text-blue-300 transition-colors duration-300">
                            <span>Subir imágenes</span>
                            <input 
                              id="file-upload" 
                              name="file-upload" 
                              type="file" 
                              className="sr-only" 
                              accept="image/*"
                              multiple
                              onChange={handleImageUpload}
                            />
                          </label>
                          <p className="pl-1">o arrastra y suelta</p>
                        </div>
                        <p className="text-xs text-blue-200">
                          PNG, JPG, GIF hasta 10MB
                        </p>
                      </div>
                    </div>
                    
                    {errors.images && (
                      <p className="mt-2 text-sm text-red-400">{errors.images}</p>
                    )}
                    
                    {/* Image Previews */}
                    {images.length > 0 && (
                      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                          <div key={index} className="relative group">
                            <img 
                              src={image}
                              alt={`Preview ${index + 1}`}
                              className="h-24 w-full object-cover rounded-lg"
                            />
                            <button
                              type="button"
                              onClick={() => removeImage(index)}
                              className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Submit Button */}
              <div className="border-t border-gray-200 pt-6 flex justify-end">
                  <button
                    type="submit"
                    disabled={loading}
                    className="gradient-button inline-flex items-center px-8 py-3 text-base font-medium disabled:opacity-50"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Publicando...
                      </>
                    ) : (
                      'Publicar objeto'
                    )}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateObjectPage;