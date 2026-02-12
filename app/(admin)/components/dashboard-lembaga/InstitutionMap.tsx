
'use client';

import React, { useEffect, useState } from 'react';
import { institutions } from '@/lib/institution/data';
import { InstitutionType } from '@/lib/institution/types';

interface InstitutionMapProps {
  selectedTypes?: InstitutionType[];
  onTypeChange?: (types: InstitutionType[]) => void;
}

export default function InstitutionMap({ selectedTypes = ['KONI', 'NPCI', 'KORMI'], onTypeChange }: InstitutionMapProps) {
  const [map, setMap] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  // Load Leaflet CSS
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    setIsClient(true);
    import('leaflet').then((leafletModule) => {
      setL(leafletModule.default);
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (!isClient || !L || !institutions.length) return;

    const container = document.getElementById('institution-map-container');
    if (!container) return;

    if (map) {
      map.off();
      map.remove();
    }

    const newMap = L.map('institution-map-container', {
      preferCanvas: false,
      attributionControl: true,
      zoomControl: true,
    }).setView([-6.2088, 106.8456], 8);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 1,
      tileSize: 256,
    }).addTo(newMap);

    // Color mapping for institution types
    const typeColors: Record<InstitutionType, string> = {
      KONI: '#3b82f6',
      NPCI: '#10b981',
      KORMI: '#ef4444',
      BAPOPSI: '#a855f7',
    };

    // Add markers
    institutions.forEach((institution) => {
      if (!selectedTypes.includes(institution.type)) return;

      const customIcon = L.icon({
        iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" fill="${encodeURIComponent(typeColors[institution.type])}"><path d="M12 0C5.4 0 0 5.4 0 12c0 8 12 20 12 20s12-12 12-20c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>`,
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        popupAnchor: [0, -32],
        className: 'custom-marker',
      });

      const marker = L.marker([institution.latitude, institution.longitude], {
        icon: customIcon,
      }).addTo(newMap);

      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 13px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #111827;">${institution.name}</h4>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Tipe:</span> ${institution.type}</p>
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Alamat:</span> ${institution.address}</p>
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Atlet:</span> ${institution.totalAthletes}</p>
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Pelatih:</span> ${institution.totalCoaches}</p>
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Wasit/Juri:</span> ${institution.totalReferees}</p>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
      });

      marker.on('mouseover', function () {
        this.openPopup();
      });
      marker.on('mouseout', function () {
        this.closePopup();
      });
    });

    setMap(newMap);

    return () => {
      if (newMap) {
        newMap.off();
        newMap.remove();
      }
    };
  }, [isClient, L, institutions, selectedTypes]);

  const institutionTypes: InstitutionType[] = ['KONI', 'NPCI', 'KORMI', 'BAPOPSI'];
  const typeColors: Record<InstitutionType, string> = {
    KONI: 'bg-blue-500',
    NPCI: 'bg-green-500',
    KORMI: 'bg-red-500',
    BAPOPSI: 'bg-purple-500',
  };

  const handleTypeToggle = (type: InstitutionType) => {
    const newTypes = selectedTypes.includes(type)
      ? selectedTypes.filter((t) => t !== type)
      : [...selectedTypes, type];
    onTypeChange?.(newTypes);
  };

  if (!isClient || !L) {
    return <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">Loading map...</div>;
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        {/* Map */}
        <div className="flex-1 relative">
          <div id="institution-map-container" className="w-full h-96 lg:h-auto lg:min-h-96 bg-gray-100" />
        </div>

        {/* Filter Legend Panel */}
        <div className="w-full lg:w-56 bg-gray-50 border-t lg:border-t-0 lg:border-l border-gray-200 p-4">
          <h3 className="text-sm font-bold text-gray-900 mb-4">Filter Lembaga</h3>
          <div className="space-y-3">
            {institutionTypes.map((type) => (
              <label key={type} className="flex items-center gap-3 cursor-pointer hover:bg-gray-100 p-2 rounded">
                <input
                  type="checkbox"
                  checked={selectedTypes.includes(type)}
                  onChange={() => handleTypeToggle(type)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${typeColors[type]}`}></div>
                  <span className="text-sm text-gray-700">{type}</span>
                </div>
              </label>
            ))}
          </div>

          {/* Legend */}
          <div className="mt-6 pt-4 border-t border-gray-200">
            <h4 className="text-xs font-bold text-gray-900 mb-3">Keterangan</h4>
            <div className="space-y-2 text-xs text-gray-600">
              <p>• Klik marker untuk melihat detail lembaga</p>
              <p>• Arahkan kursor ke marker untuk preview</p>
              <p>• Zoom untuk melihat detail lebih baik</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        #institution-map-container {
          position: relative;
        }
        
        .leaflet-container {
          background-color: #f3f4f6;
          z-index: 1;
        }
        
        .leaflet-tile-pane {
          z-index: 2;
        }
        
        .leaflet-marker-pane {
          z-index: 3;
        }
        
        .custom-popup .leaflet-popup-content-wrapper {
          background: white;
          border-radius: 8px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border: none;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
        }
      `}</style>
    </div>
  );
}
