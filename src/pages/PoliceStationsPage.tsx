import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, FileText, Phone, Clock } from 'lucide-react';
import { useObjects } from '../hooks/useObjects';

interface Month {
  id: string;
  label: string;
  monthlyReport: string;
}

const PoliceStationsPage: React.FC = () => {
  const { objects } = useObjects();
  const months: Month[] = [
    { 
      id: '2025-04', 
      label: 'Abril 2025',
      monthlyReport: '/obxPerdidosAbr2025.pdf'
    },
    { 
      id: '2025-03', 
      label: 'Marzo 2025',
      monthlyReport: '/reports/2025-03-police-report.pdf'
    },
    { 
      id: '2025-02', 
      label: 'Febrero 2025',
      monthlyReport: '/reports/2025-02-police-report.pdf'
    },
    { 
      id: '2025-01', 
      label: 'Enero 2025',
      monthlyReport: '/reports/2025-01-police-report.pdf'
    }
    
  ];

  const policeStations = [
    {
      name: 'Comisaría de Vigo',
      address: 'Rúa López Mora, 39',
      phone: '986 820 200',
      schedule: 'Lunes a Domingo 24h',
      coordinates: { lat: 42.237543, lng: -8.714830 }
    },
    {
      name: 'Comisaría Local de Policía',
      address: 'Praza da Independencia, 1',
      phone: '986 810 600',
      schedule: 'Lunes a Viernes 8:00-20:00',
      coordinates: { lat: 42.238128, lng: -8.725991 }
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header Section with modern design */}
      <div className="text-center mb-16 relative">
        <div className="absolute inset-0 blur-[100px] bg-blue-500/20 rounded-full"></div>
        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600 relative">
          Objetos Perdidos en Comisarías
        </h1>
        <p className="mt-4 text-lg text-blue-200 relative">
          Consulta los objetos perdidos depositados en las comisarías de Vigo
        </p>
      </div>

      {/* Legal Notice with glassmorphism effect */}
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl p-8 mb-16 border border-white/20 shadow-xl">
        <h2 className="text-2xl font-semibold text-blue-400 mb-4">
          Aviso Legal
        </h2>
        <p className="text-gray-300 mb-4 leading-relaxed">
          Con el fin de dar cumplimiento al establecido en el Código Civil, artículos 615 y 616 que regulan el procedimiento, 
          se publica el listado de objetos y/o dinero en efectivo. De este modo se pretende poner en conocimiento del público 
          en general la relación de objetos y/o dinero en efectivo depositados recién en la Oficina de Objetos Perdidos.
        </p>
        <p className="text-blue-300 font-medium">
          Relación de objetos perdidos publicados en el tablón de edictos del Ayuntamiento de Vigo
        </p>
      </div>

      {/* Police Stations Section with modern cards */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">Comisarías en Vigo</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {policeStations.map((station, index) => (
            <div key={index} className="backdrop-blur-xl bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl hover:transform hover:scale-105 transition-all duration-300">
              <h3 className="text-xl font-semibold text-blue-400">{station.name}</h3>
              <div className="mt-6 space-y-4">
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-purple-400" />
                  <p className="text-gray-300">{station.address}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-purple-400" />
                  <p className="text-gray-300">{station.phone}</p>
                </div>
                <div className="flex items-center space-x-3">
                  <Clock className="h-5 w-5 text-purple-400" />
                  <p className="text-gray-300">{station.schedule}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Reports with modern design */}
      <div>
        <h2 className="text-3xl font-bold text-blue-400 mb-8 text-center">Informes Mensuales de Objetos Perdidos</h2>
        <div className="space-y-6">
          {months.map((month) => (
            <div key={month.id} className="backdrop-blur-xl bg-white/10 rounded-2xl overflow-hidden border border-white/20 shadow-xl hover:bg-white/20 transition-colors duration-300">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-6 w-6 text-purple-400" />
                    <h3 className="text-xl font-medium text-blue-300">
                      Objetos correspondientes a {month.label}
                    </h3>
                  </div>
                  {month.monthlyReport && (
                    <a
                      href={month.monthlyReport}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center px-6 py-3 rounded-xl text-sm font-medium bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      <FileText className="w-4 h-4 mr-2" />
                      Descargar informe
                    </a>
                  )}
                </div>
                
                {/* Objects list with modern styling */}
                <div className="space-y-4">
                  {objects
                    .filter(obj => 
                      obj.isPoliceStation && 
                      new Date(obj.date).toISOString().startsWith(month.id)
                    )
                    .map(obj => (
                      <div key={obj.id} className="border-t border-white/10 pt-4">
                        <Link 
                          to={`/objetos/${obj.id}`}
                          className="block hover:bg-white/5 -m-4 p-4 transition-all duration-300 rounded-xl"
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="text-lg font-medium text-blue-300">{obj.title}</h4>
                              <p className="mt-1 text-sm text-gray-400">{obj.description}</p>
                              <div className="mt-2 flex items-center text-sm text-gray-400">
                                <MapPin className="h-4 w-4 mr-2 text-purple-400" />
                                {obj.location}
                              </div>
                            </div>
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              obj.status === 'encontrado' ? 'bg-green-900/50 text-green-400' :
                              obj.status === 'reclamado' ? 'bg-yellow-900/50 text-yellow-400' :
                              'bg-gray-900/50 text-gray-400'
                            }`}>
                              {obj.status}
                            </span>
                          </div>
                        </Link>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoliceStationsPage; 