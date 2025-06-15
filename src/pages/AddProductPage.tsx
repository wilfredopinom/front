import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, X } from 'lucide-react';

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    address: '',
    isNew: false,
    isPopular: false
  });
  
  const [images, setImages] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
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
    
    Array.from(files).forEach(file => {
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
  
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.price.trim()) {
      newErrors.price = 'El precio es obligatorio';
    } else if (isNaN(parseFloat(formData.price))) {
      newErrors.price = 'El precio debe ser un número válido';
    }
    
    if (!formData.category) {
      newErrors.category = 'La categoría es obligatoria';
    }
    
    if (!formData.address.trim()) {
      newErrors.address = 'La dirección es obligatoria';
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
    
    const productData = {
      ...formData,
      price: parseFloat(formData.price),
      images,
      id: Date.now().toString() // Temporary ID generation
    };
    
    try {
      // Here you would typically make an API call to save the product
      console.log('Product data:', productData);
      navigate('/tienda');
    } catch (error) {
      console.error('Error creating product:', error);
      setErrors({
        submit: 'Ha ocurrido un error al crear el producto. Por favor, inténtalo de nuevo.'
      });
    }
  };

  return (
    <div
      className="min-h-screen w-full flex flex-col relative"
      style={{
        background:
          'linear-gradient(351deg, rgba(4,19,29,0.97) 0%, rgba(108,172,228,0.10) 49%, rgba(255,255,255,0.97) 100%)',
        position: 'absolute',
        inset: 0,
        zIndex: 0,
        transition: 'background 0.6s cubic-bezier(0.4,0,0.2,1)'
      }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
        <div className="glass-card overflow-hidden">
          <div className="p-8">
            <h1 className="page-title mb-8">Añadir nuevo producto</h1>
            
            {errors.submit && (
              <div className="mb-6 glass-card bg-red-500/10 border-red-500/30 text-red-400 p-4 rounded-xl hover-glow">
                {errors.submit}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="space-y-8">
                {/* Basic Info */}
                <div>
                  <h2 className="text-xl font-semibold gradient-text mb-6">Información del producto</h2>
                  <div className="grid grid-cols-1 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-blue-300 mb-1">
                        Nombre <span className="text-pink-400">*</span>
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        className={`block w-full px-4 py-3 bg-white/10 border ${
                          errors.name ? 'border-red-500/50' : 'border-white/20'
                        } rounded-xl shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300`}
                        placeholder="Ej: Gorra Vigo City"
                        value={formData.name}
                        onChange={handleChange}
                      />
                      {errors.name && (
                        <p className="mt-2 text-sm text-red-400">{errors.name}</p>
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
                        placeholder="Describe el producto con detalle..."
                        value={formData.description}
                        onChange={handleChange}
                      />
                      {errors.description && (
                        <p className="mt-2 text-sm text-red-400">{errors.description}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-blue-300 mb-1">
                        Precio <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          id="price"
                          name="price"
                          className={`block w-full px-4 py-3 bg-white/10 border ${
                            errors.price ? 'border-red-500/50' : 'border-white/20'
                          } rounded-xl shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300`}
                          placeholder="19.99"
                          value={formData.price}
                          onChange={handleChange}
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-blue-300">€</span>
                        </div>
                      </div>
                      {errors.price && (
                        <p className="mt-2 text-sm text-red-400">{errors.price}</p>
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
                        <option value="gorras" className="bg-gray-900">Gorras</option>
                        <option value="merchandising" className="bg-gray-900">Merchandising</option>
                        <option value="cafes" className="bg-gray-900">Cafés</option>
                      </select>
                      {errors.category && (
                        <p className="mt-2 text-sm text-red-400">{errors.category}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-blue-300 mb-1">
                        Dirección <span className="text-pink-400">*</span>
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-blue-400" />
                        </div>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          className={`block w-full pl-10 pr-3 py-3 bg-white/10 border ${
                            errors.address ? 'border-red-500/50' : 'border-white/20'
                          } rounded-xl shadow-sm placeholder-blue-200 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-xl transition-all duration-300`}
                          placeholder="Ej: Calle Príncipe, 36202 Vigo"
                          value={formData.address}
                          onChange={handleChange}
                        />
                      </div>
                      {errors.address && (
                        <p className="mt-2 text-sm text-red-400">{errors.address}</p>
                      )}
                    </div>

                    <div className="flex gap-6">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isNew"
                          name="isNew"
                          checked={formData.isNew}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/20 rounded bg-white/10"
                        />
                        <label htmlFor="isNew" className="ml-2 block text-sm text-blue-300">
                          Marcar como nuevo
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="isPopular"
                          name="isPopular"
                          checked={formData.isPopular}
                          onChange={handleCheckboxChange}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-white/20 rounded bg-white/10"
                        />
                        <label htmlFor="isPopular" className="ml-2 block text-sm text-blue-300">
                          Marcar como popular
                        </label>
                      </div>
                    </div>
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
                    className="gradient-button inline-flex items-center px-8 py-3 text-base font-medium"
                  >
                    Crear producto
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

export default AddProductPage;