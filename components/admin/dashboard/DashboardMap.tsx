'use client';

import React, { useEffect, useState } from 'react';

interface DesaSummary {
  id: number;
  nama: string;
  tipe: string;
  totalFacility: number;
  totalSportsGroups: number;
  totalAthlete: number;
  totalAchievement: number;
  latitude?: string;
  longitude?: string;
}

interface DashboardMapProps {
  districts: DesaSummary[];
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

    // Clean up previous map instance properly
    if (map) {
      try {
        map.eachLayer((layer: any) => {
          map.removeLayer(layer);
        });
        map.off();
      } catch (e) {
        // Ignore errors during cleanup
      }
    }

    // Check if Leaflet map is already attached to container
    if (container._leaflet_id) {
      delete container._leaflet_id;
    }

    // Prepare districts: use real coordinates if available, otherwise generate grid positions
    const centerLat = -6.9;
    const centerLng = 107.6;
    const gridSpacing = 0.01; // ~1km spacing in lat/lng degrees
    
    const preparedDistricts = districts.map((d, index) => {
      let lat = parseFloat(d.latitude || '');
      let lng = parseFloat(d.longitude || '');
      let hasRealCoords = !isNaN(lat) && !isNaN(lng);

      // If no coordinates, generate grid position
      if (!hasRealCoords) {
        const gridSize = Math.ceil(Math.sqrt(districts.length));
        const row = Math.floor(index / gridSize);
        const col = index % gridSize;
        lat = centerLat + (row - gridSize / 2) * gridSpacing;
        lng = centerLng + (col - gridSize / 2) * gridSpacing;
      }

      return {
        ...d,
        lat,
        lng,
        hasRealCoords,
      };
    });

    // Initialize map with proper options
    const newMap = L.map('map-container', {
      preferCanvas: false,
      attributionControl: true,
      zoomControl: true,
    }).setView([centerLat, centerLng], 11);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
      minZoom: 1,
      tileSize: 256,
    }).addTo(newMap);

    // Custom marker icon based on whether coordinates are real or estimated
    const createIcon = (hasRealCoords: boolean) => {
      const color = hasRealCoords ? '%232563eb' : '%9ca3af'; // blue for real, gray for estimated
      return L.icon({
        iconUrl: `data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 32" fill="${color}"><path d="M12 0C5.4 0 0 5.4 0 12c0 8 12 20 12 20s12-12 12-20c0-6.6-5.4-12-12-12zm0 16c-2.2 0-4-1.8-4-4s1.8-4 4-4 4 1.8 4 4-1.8 4-4 4z"/></svg>`,
        iconSize: [24, 32],
        iconAnchor: [12, 32],
        popupAnchor: [0, -32],
        className: 'custom-marker',
      });
    };

    // Add markers for each desa/kelurahan
    preparedDistricts.forEach((desa) => {
      const marker = L.marker([desa.lat, desa.lng], {
        icon: createIcon(desa.hasRealCoords),
      }).addTo(newMap);

      // Create detailed popup with desa info and styling
      const popupContent = `
        <div style="font-family: system-ui, -apple-system, sans-serif; width: 320px;">
          <div style="background: linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%); color: white; padding: 12px 14px; border-radius: 8px 8px 0 0; margin: -6px -6px 12px -6px;">
            <h4 style="margin: 0; font-weight: bold; font-size: 16px;">${desa.nama}</h4>
            <p style="margin: 4px 0 0 0; font-size: 12px; opacity: 0.9;">Tipe: ${desa.tipe.toUpperCase()}${!desa.hasRealCoords ? ' (Koordinat Estimasi)' : ''}</p>
          </div>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; padding: 12px;">
            <!-- Prasarana -->
            <div style="background: #f0f9ff; border: 2px solid #0284c7; border-radius: 6px; padding: 10px; text-align: center;">
              <div style="font-size: 11px; color: #0284c7; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Prasarana</div>
              <div style="font-size: 28px; font-weight: bold; color: #0284c7;">${desa.totalFacility}</div>
            </div>
            
            <!-- Kelompok Olahraga -->
            <div style="background: #f0fdf4; border: 2px solid #22c55e; border-radius: 6px; padding: 10px; text-align: center;">
              <div style="font-size: 11px; color: #22c55e; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Kelompok</div>
              <div style="font-size: 28px; font-weight: bold; color: #22c55e;">${desa.totalSportsGroups}</div>
            </div>
            
            <!-- Total Atlet -->
            <div style="background: #faf5ff; border: 2px solid #a855f7; border-radius: 6px; padding: 10px; text-align: center;">
              <div style="font-size: 11px; color: #a855f7; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Total Atlet</div>
              <div style="font-size: 28px; font-weight: bold; color: #a855f7;">${desa.totalAthlete}</div>
            </div>
            
            <!-- Prestasi Atlet -->
            <div style="background: #fef3c7; border: 2px solid #d97706; border-radius: 6px; padding: 10px; text-align: center;">
              <div style="font-size: 11px; color: #d97706; font-weight: 700; margin-bottom: 6px; text-transform: uppercase;">Prestasi</div>
              <div style="font-size: 28px; font-weight: bold; color: #d97706;">${desa.totalAchievement}</div>
            </div>
          </div>
        </div>
      `;

      marker.bindPopup(popupContent, {
        maxWidth: 360,
        className: 'custom-popup',
        closeButton: true,
      });

      // Open popup on click
      marker.on('click', function () {
        this.openPopup();
      });

      // Hover effect - change opacity
      marker.on('mouseover', function () {
        this.setOpacity(0.7);
      });
      marker.on('mouseout', function () {
        this.setOpacity(1);
      });
    });

    setMap(newMap);

    // Cleanup function
    return () => {
      if (newMap) {
        try {
          newMap.eachLayer((layer: any) => {
            newMap.removeLayer(layer);
          });
          newMap.off();
          newMap.remove();
        } catch (e) {
          // Ignore errors during cleanup
        }
      }
      // Reset map state
      setMap(null);
    };
  }, [isClient, L, districts]);

  if (!isClient) {
    return <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">Loading map...</div>;
  }

  if (!L) {
    return <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">Loading map library...</div>;
  }

  if (!districts.length) {
    return (
      <div className="w-full h-96 bg-gray-50 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 font-medium">Tidak ada data desa/kelurahan</p>
        </div>
      </div>
    );
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
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
          border: none;
          padding: 0;
          overflow: hidden;
        }
        
        .custom-popup .leaflet-popup-tip {
          background: white;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }
        
        .custom-popup .leaflet-popup-content {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, sans-serif;
        }
        
        .custom-marker {
          filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
          transition: all 0.3s ease;
        }
        
        .custom-marker:hover {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
        }
      `}</style>
    </div>
  );
}
