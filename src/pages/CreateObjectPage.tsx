import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, X } from 'lucide-react';
import Map from '../components/map/Map';
import { useCreateObject } from '../hooks/useCreateObject';

const CreateObjectPage: React.FC = () => {
  const navigate = useNavigate();
  const { createObject, loading } = useCreateObject();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    contactPhone: '',
    contactEmail: '',
    isPoliceStation: false
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
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData({
      ...formData,
      [name]: checked
    });
  };
  
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    
    // Simulating image upload - in a real app we would upload to a server/storage
    Array.from(files).forEach(file => {
      // Create object URL for preview (in production, you would upload to server)
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          setImages(prev => [...prev, e.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };
  
  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };
  
  const handleMapClick = (lat: number, lng: number) => {
    setCoordinates({ lat, lng });
    // You would typically use a reverse geocoding service here
    setFormData(prev => ({
      ...prev,
      location: `Lat: ${lat.toFixed(6)}, Lng: ${lng.toFixed(6)}`
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
    
    if (!validateForm()) {
      return;
    }
    
    const objectData = {
      ...formData,
      images,
      coordinates,
      status: 'encontrado' as const,
      date: new Date().toISOString()
    };
    
    try {
      const newObjectId = await createObject(objectData);
      navigate(`/objetos/${newObjectId}`);
    } catch (error) {
      console.error('Error creating object:', error);
      setErrors({
        submit: 'Ha ocurrido un error al publicar el objeto. Por favor, inténtalo de nuevo.'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="glass-card overflow-hidden">
          <div className="p-8">
            <h1 className="page-title mb-8">Publicar objeto encontrado</h1>
            
            {errors.submit && (
              <div className="mb-6 glass-card bg-red-500/10 border-red-500/30 text-red-400 p-4 rounded-xl">
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
                        <option value="electrónica" className="bg-gray-900">Electrónica</option>
                        <option value="documentos" className="bg-gray-900">Documentos</option>
                        <option value="ropa" className="bg-gray-900">Ropa</option>
                        <option value="accesorios" className="bg-gray-900">Accesorios</option>
                        <option value="mascotas" className="bg-gray-900">Mascotas</option>
                        <option value="otros" className="bg-gray-900">Otros</option>
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-400">{errors.category}</p>
                      )}
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
                    
                    <div className="glass-card h-[300px] rounded-xl overflow-hidden">
                      <Map
                        objects={[]}
                        initialLocation={coordinates}
                        zoom={15}
                        height="300px"
                        onMarkerClick={handleMapClick}
                      />
                    </div>
                    <p className="text-sm text-blue-200">
                      Haz clic en el mapa para marcar la ubicación exacta
                    </p>
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
                <div className="flex justify-end pt-6">
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