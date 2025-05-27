import { ObjectType } from '../types/ObjectType';

export const mockObjects: ObjectType[] = [
  {
    id: '1',
    title: 'Llaves encontradas en Plaza de Galicia',
    description: 'Encontré un manojo de llaves con un llavero de la Torre de Hércules cerca del banco en la Plaza de Galicia. Tiene 3 llaves y una tarjeta de acceso.',
    category: 'accesorios',
    status: 'encontrado',
    date: '2025-04-10T14:30:00Z',
    createdAt: '2025-04-10T14:30:00Z',
    location: 'Plaza de Galicia, Santiago de Compostela',
    coordinates: { lat: 42.8777, lng: -8.5483 },
    images: [
      'https://images.pexels.com/photos/5462303/pexels-photo-5462303.jpeg',
      'https://images.pexels.com/photos/5462562/pexels-photo-5462562.jpeg'
    ],
    publisher: {
      id: '1',
      name: 'Ana García',
      email: 'ana@example.com',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      joinDate: '2024-01-01T00:00:00Z'
    },
    contactInfo: {
      phone: '678 123 456',
      email: 'ana@example.com'
    }
  },
  {
    id: '2',
    title: 'Móvil iPhone encontrado en la Alameda',
    description: 'Encontré un iPhone 13 Pro en la Alameda cerca del quiosco de música. Tiene funda azul con dibujos de olas. Está bloqueado pero funciona.',
    category: 'electrónica',
    status: 'reclamado',
    date: '2025-04-08T18:15:00Z',
    createdAt: '2025-04-08T18:15:00Z',
    location: 'Alameda, Santiago de Compostela',
    coordinates: { lat: 42.8808, lng: -8.5489 },
    images: [
      'https://images.pexels.com/photos/3221311/pexels-photo-3221311.jpeg'
    ],
    publisher: {
      id: '2',
      name: 'Carlos Rodríguez',
      email: 'carlos@example.com',
      joinDate: '2024-01-15T00:00:00Z'
    },
    isPoliceStation: true,
    claimer: {
      id: '3',
      name: 'María López',
      email: 'maria@example.com',
      claimDate: '2025-04-09T10:00:00Z',
      claimMessage: 'Es mi iPhone, puedo proporcionar el código de desbloqueo y mostrar fotos que confirman que es mío.'
    }
  },
  {
    id: '3',
    title: 'Cartera encontrada en bus urbano',
    description: 'He encontrado una cartera marrón en el bus urbano línea 5. Contiene DNI, varias tarjetas bancarias y algo de dinero en efectivo. La entregué en la comisaría central.',
    category: 'accesorios',
    status: 'entregado',
    date: '2025-04-05T09:45:00Z',
    createdAt: '2025-04-05T09:45:00Z',
    location: 'Comisaría de Policía, Rúa de Rodrigo de Padrón, Santiago',
    coordinates: { lat: 42.8756, lng: -8.5412 },
    images: [
      'https://images.pexels.com/photos/3643761/pexels-photo-3643761.jpeg',
      'https://images.pexels.com/photos/3643762/pexels-photo-3643762.jpeg'
    ],
    publisher: {
      id: '3',
      name: 'María López',
      email: 'maria@example.com',
      avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
      joinDate: '2024-02-01T00:00:00Z'
    },
    isPoliceStation: true
  },
  {
    id: '4',
    title: 'Gafas de sol Ray-Ban en Praza do Obradoiro',
    description: 'Encontré unas gafas de sol marca Ray-Ban modelo Wayfarer en la Praza do Obradoiro frente a la Catedral. Están en perfecto estado en su funda negra original.',
    category: 'accesorios',
    status: 'encontrado',
    date: '2025-04-12T16:20:00Z',
    createdAt: '2025-04-12T16:20:00Z',
    location: 'Praza do Obradoiro, Santiago de Compostela',
    coordinates: { lat: 42.8806, lng: -8.5458 },
    images: [
      'https://images.pexels.com/photos/701877/pexels-photo-701877.jpeg',
      'https://images.pexels.com/photos/46710/pexels-photo-46710.jpeg'
    ],
    publisher: {
      id: '1',
      name: 'Ana García',
      email: 'ana@example.com',
      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg',
      joinDate: '2024-01-01T00:00:00Z'
    },
    contactInfo: {
      phone: '678 123 456'
    }
  },
  {
    id: '5',
    title: 'Mochila encontrada en el parque',
    description: 'Encontré una mochila negra marca Quechua en el parque Bonaval. Contiene ropa, un libro y unos auriculares. La he llevado a la oficina de objetos perdidos del ayuntamiento.',
    category: 'accesorios',
    status: 'encontrado',
    date: '2025-04-11T13:10:00Z',
    createdAt: '2025-04-11T13:10:00Z',
    location: 'Parque de Bonaval, Santiago de Compostela',
    coordinates: { lat: 42.8834, lng: -8.5418 },
    images: [
      'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg'
    ],
    publisher: {
      id: '4',
      name: 'Pablo Fernández',
      email: 'pablo@example.com',
      joinDate: '2024-02-15T00:00:00Z'
    },
    contactInfo: {
      email: 'pablo@example.com'
    }
  },
  {
    id: '6',
    title: 'Peluche perdido en la zona vieja',
    description: 'Mi hijo perdió su peluche de oso favorito en la zona vieja el sábado por la tarde. Es un oso de color marrón claro con una cinta azul en el cuello. Tiene mucho valor sentimental.',
    category: 'otros',
    status: 'encontrado',
    date: '2025-04-09T20:00:00Z',
    createdAt: '2025-04-09T20:00:00Z',
    location: 'Rúa do Franco, Santiago de Compostela',
    coordinates: { lat: 42.8794, lng: -8.5449 },
    images: [
      'https://images.pexels.com/photos/39369/teddy-bear-cuddly-toy-toys-attachment-39369.jpeg'
    ],
    publisher: {
      id: '5',
      name: 'Lucía Martínez',
      email: 'lucia@example.com',
      avatar: 'https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg',
      joinDate: '2024-03-01T00:00:00Z'
    },
    contactInfo: {
      phone: '666 789 123'
    }
  }
];