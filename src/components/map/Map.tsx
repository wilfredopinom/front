import React, { useEffect, useRef, useState } from 'react';
import { ObjectType } from '../../types/ObjectType';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapPin } from 'lucide-react';

// Fix for default marker icons in Leaflet
const iconUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png';
const iconShadowUrl = 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom user location icon
const UserLocationIcon = L.divIcon({
  className: 'user-location-marker',
  html: `<div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white shadow-lg flex items-center justify-center">
    <div class="w-2 h-2 rounded-full bg-white"></div>
    <div class="absolute w-12 h-12 rounded-full bg-blue-500 opacity-20 animate-ping"></div>
  </div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapProps {
  objects: ObjectType[];
  initialLocation?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  onMarkerClick?: (lat: number, lng: number) => void;
}

const Map: React.FC<MapProps> = ({ 
  objects, 
  initialLocation = { lat: 42.2406, lng: -8.7207 }, // Vigo coordinates
  zoom = 13,
  height = '600px',
  onMarkerClick
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string>('');

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setUserLocation({ lat, lng });
          setLocationError('');
        },
        (error) => {
          console.error('Error getting user location:', error);
          setLocationError('No se pudo obtener tu ubicación');
        }
      );
    } else {
      setLocationError('Tu navegador no soporta geolocalización');
    }
  };

  useEffect(() => {
    if (!mapRef.current) return;

    // Initialize map
    if (!mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current).setView(
        [initialLocation.lat, initialLocation.lng],
        zoom
      );

      // Add tile layer (OpenStreetMap)
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors'
      }).addTo(mapInstanceRef.current);

      // Add location control
      const locationButton = L.control({ position: 'bottomright' });
      locationButton.onAdd = () => {
        const div = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
        div.innerHTML = `
          <button
            class="glass-card p-2 rounded-lg text-blue-300 hover:text-blue-400 transition-colors duration-300"
            title="Mostrar mi ubicación"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <circle cx="12" cy="12" r="1"/>
              <line x1="12" y1="2" x2="12" y2="22"/>
              <line x1="2" y1="12" x2="22" y2="12"/>
            </svg>
          </button>
        `;
        div.onclick = getUserLocation;
        return div;
      };
      locationButton.addTo(mapInstanceRef.current);
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add markers for each object
    objects.forEach(object => {
      if (object.coordinates) {
        try {
          const marker = L.marker([object.coordinates.lat, object.coordinates.lng])
            .addTo(mapInstanceRef.current!);

          // Add popup with object info
          marker.bindPopup(`
            <div class="p-2">
              <h3 class="font-semibold text-gray-900">${object.title}</h3>
              <p class="text-sm text-gray-600">${object.location}</p>
              <p class="text-xs text-gray-500">${object.category}</p>
              <a href="/objetos/${object.id}" class="text-blue-600 hover:text-blue-800 text-sm mt-2 inline-block">
                Ver detalles
              </a>
            </div>
          `);

          // Add click handler if provided
          if (onMarkerClick) {
            marker.on('click', () => onMarkerClick(object.coordinates!.lat, object.coordinates!.lng));
          }

          markersRef.current.push(marker);
        } catch (error) {
          console.error(`Error adding marker for object ${object.id}:`, error);
        }
      }
    });

    // Update user location marker
    if (userLocation) {
      if (userMarkerRef.current) {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      } else {
        userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], {
          icon: UserLocationIcon
        }).addTo(mapInstanceRef.current);
      }
      mapInstanceRef.current.setView([userLocation.lat, userLocation.lng], zoom);
    }

    // Fit bounds to show all markers if there are any
    const allMarkers = [...markersRef.current];
    if (userMarkerRef.current) allMarkers.push(userMarkerRef.current);
    
    if (allMarkers.length > 0) {
      const group = new L.featureGroup(allMarkers);
      mapInstanceRef.current.fitBounds(group.getBounds().pad(0.1));
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [objects, initialLocation, zoom, onMarkerClick, userLocation]);

  if (!objects.some(obj => obj.coordinates)) {
    return (
      <div className="w-full h-full flex items-center justify-center glass-card">
        <div className="text-center p-4">
          <p className="text-blue-200">No hay objetos con ubicación disponible para mostrar en el mapa.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div 
        ref={mapRef} 
        className="w-full rounded-xl overflow-hidden shadow-lg border border-white/20" 
        style={{ height }}
        data-testid="map-container"
      />
      {locationError && (
        <div className="mt-2 text-sm text-red-400">
          {locationError}
        </div>
      )}
    </>
  );
};

export default Map;