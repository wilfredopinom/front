import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth, useUser } from '@clerk/clerk-react';

interface ObjectImage {
  url: string;
}
interface Categories {
  id: string;
  name: string;
}
interface Publisher {
  id: string;
  name: string;
  avatar?: string;
  email?: string;
  phone?: string;
}
interface ObjectDetail {
  id: string;
  title: string;
  description: string;
  location: string;
  categories?: Categories;
  status: string;
  images: ObjectImage[];
  publisher: Publisher;
}

const ObjectEditPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getToken } = useAuth();
  const { user } = useUser();

  const [object, setObject] = useState<ObjectDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    const fetchObject = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${id}`);
        if (!response.ok) throw new Error('No se pudo cargar el objeto');
        const data = await response.json();
        setObject(data);
        setTitle(data.title);
        setDescription(data.description);
        setLocation(data.location);
        setCategory(data.categories?.id || '');
        setStatus(data.status);
      } catch (err) {
        setError('Error al cargar el objeto');
      } finally {
        setLoading(false);
      }
    };
    fetchObject();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!object) return;
    setSaving(true);
    try {
      const token = await getToken();
      const response = await fetch(`${import.meta.env.VITE_API_URL_BASE}/objetos/${object.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          location,
          category_id: category,
          status
        })
      });
      if (!response.ok) throw new Error('Error al actualizar el objeto');
      navigate(`/objetos/${object.id}`);
    } catch (err) {
      setError('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-blue-200">Cargando...</div>;
  if (error) return <div className="p-8 text-red-400">{error}</div>;
  if (!object) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-blue-900 to-purple-900 text-white flex items-center justify-center">
      <form onSubmit={handleSubmit} className="glass-card max-w-lg w-full p-8 space-y-6 hover-glow">
        <h2 className="text-2xl font-bold text-blue-300 mb-4">Editar publicación</h2>
        <div>
          <label className="block text-blue-200 mb-1">Título</label>
          <input
            className="w-full px-3 py-2 rounded bg-white/10 text-white"
            value={title}
            onChange={e => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-blue-200 mb-1">Descripción</label>
          <textarea
            className="w-full px-3 py-2 rounded bg-white/10 text-white"
            value={description}
            onChange={e => setDescription(e.target.value)}
            rows={4}
            required
          />
        </div>
        <div>
          <label className="block text-blue-200 mb-1">Ubicación</label>
          <input
            className="w-full px-3 py-2 rounded bg-white/10 text-white"
            value={location}
            onChange={e => setLocation(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-blue-200 mb-1">Estado</label>
          <select
            className="w-full px-3 py-2 rounded bg-white/10 text-white"
            value={status}
            onChange={e => setStatus(e.target.value)}
            required
          >
            <option value="encontrado">Encontrado</option>
            <option value="perdido">Perdido</option>
            <option value="reclamado">Reclamado</option>
          </select>
        </div>
        {/* Puedes agregar aquí un selector de categorías si tienes la lista */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            className="glass-card px-4 py-2 text-blue-300 hover-glow"
            onClick={() => navigate(`/objetos/${object.id}`)}
            disabled={saving}
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="gradient-button"
            disabled={saving}
          >
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
        {error && <div className="text-red-400">{error}</div>}
      </form>
    </div>
  );
};

export default ObjectEditPage;
