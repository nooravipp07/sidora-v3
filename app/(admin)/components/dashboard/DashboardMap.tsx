'use client';

import React, { useEffect, useState } from 'react';
import { DistrictData } from '@/lib/district/types';

interface DashboardMapProps {
  districts: DistrictData[];
}

export default function DashboardMap({ districts }: DashboardMapProps) {
  const [map, setMap] = useState<any>(null);
  const [isClient, setIsClient] = useState(false);
  const [L, setL] = useState<any>(null);

  // Initialize Leaflet only on client side
  useEffect(() => {
    // Load Leaflet CSS
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.min.css';
    document.head.appendChild(link);

    setIsClient(true);
    // Dynamically import Leaflet to avoid SSR issues
    import('leaflet').then((leafletModule) => {
      setL(leafletModule.default);
    });

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  useEffect(() => {
    if (!isClient || !L || !districts.length) return;

    // Create map container
    const container = document.getElementById('map-container');
    if (!container) return;

    // Clean up previous map
    if (map) {
      map.off();
      map.remove();
    }

    // Initialize map with proper options
    const newMap = L.map('map-container', {
      preferCanvas: false,
      attributionControl: true,
      zoomControl: true,
    }).setView([-6.9, 107.6], 11);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 1,
      tileSize: 256,
    }).addTo(newMap);

    // Custom marker icon (pin shape)
    const customIcon = L.icon({
      iconUrl: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" fill="%232563eb"><path d="M12 0C5.4 0 0 5.4 0 12c0 8 12 20 12 20s12-12 12-20c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>',
      iconSize: [24, 32],
      iconAnchor: [12, 32],
      popupAnchor: [0, -32],
      className: 'custom-marker',
    });

    // Add markers
    districts.forEach((district) => {
      const marker = L.marker([district.latitude, district.longitude], {
        icon: customIcon,
      }).addTo(newMap);

      // Create popup with district info
      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; font-size: 14px;">
          <h4 style="margin: 0 0 8px 0; font-weight: bold; color: #111827;">${district.kecamatan}</h4>
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Infrastruktur:</span> ${district.totalInfrastructure}</p>
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Atlet:</span> ${district.totalAthletes}</p>
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Pelatih:</span> ${district.totalCoaches}</p>
            <p style="margin: 0; color: #374151;"><span style="font-weight: 600;">Kelompok Olahraga:</span> ${district.totalSportsGroups}</p>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 300,
        className: 'custom-popup',
      });

      // Show popup on hover
      marker.on('mouseover', function () {
        this.openPopup();
      });
      marker.on('mouseout', function () {
        this.closePopup();
      });
    });

    setMap(newMap);

    // Cleanup function
    return () => {
      if (newMap) {
        newMap.off();
        newMap.remove();
      }
    };
  }, [isClient, L, districts]);

  if (!isClient) {
    return <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">Loading map...</div>;
  }

  if (!L) {
    return <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">Loading map library...</div>;
  }

  return (
    <div className="w-full h-96 rounded-lg overflow-hidden">
      <div id="map-container" className="w-full h-full bg-gray-100" />
      <style>{`
        #map-container {
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
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          font-family: system-ui, -apple-system, sans-serif;
        }
      `}</style>
    </div>
  );
}
