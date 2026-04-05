'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth/useAuthh';
import 'leaflet/dist/leaflet.css';

interface KecamatanData {
  kecamatan: string;
  latitude: string;
  longitude: string;
  totalAthletes: number;
  totalCoaches: number;
  totalReferees: number;
  emasCount: number;
  perakCount: number;
  perungguCount: number;
  totalAtlet: number;
  totalPelatih: number;
  totalWasit: number;
}

export default function KecamatanMap() {
  const { user } = useAuth();
  const [mapReady, setMapReady] = useState(false);
  const [L, setL] = useState<any>(null);
  const [kecamatanData, setKecamatanData] = useState<KecamatanData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch kecamatan data from API
  useEffect(() => {
    const fetchKecamatanData = async () => {
      try {
        setLoading(true);
        
        // Determine organization filter based on roleId
        let organization: string | null = null;
        if (user?.roleId === 4) {
          organization = 'KONI';
        } else if (user?.roleId === 5) {
          organization = 'NPCI';
        }

        // Build query params
        const params = new URLSearchParams();
        if (organization) {
          params.append('organization', organization);
        }

        // Fetch data from API
        const response = await fetch(`/api/kecamatan/summary?${params.toString()}`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch kecamatan data: ${response.status}`);
        }

        const data = await response.json();
        if (data.success && Array.isArray(data.data)) {
          setKecamatanData(data.data);
          setError(null);
        } else {
          throw new Error('Invalid response format');
        }
      } catch (err) {
        console.error('Error fetching kecamatan data:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        setKecamatanData([]);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchKecamatanData();
    }
  }, [user, user?.roleId]);

  // Initialize map once data is loaded
  useEffect(() => {
    const initMap = async () => {
      try {
        // Only init if we have data
        if (kecamatanData.length === 0 || loading) {
          return;
        }

        // Load Leaflet
        const leafletModule = await import('leaflet');
        const Leaflet = leafletModule.default;
        setL(Leaflet);

        // Wait for DOM to be ready
        if (typeof window !== 'undefined') {
          const timer = setTimeout(() => {
            const container = document.getElementById('kecamatan-map-container');
            if (!container) {
              console.error('Map container not found');
              return;
            }

            try {
              // Check if map already exists
              if ((window as any).leafletMapInstance) {
                (window as any).leafletMapInstance.remove();
              }

              // Create map
              const map = Leaflet.map('kecamatan-map-container', {
                center: [-6.97, 107.63],
                zoom: 9,
                scrollWheelZoom: window.innerWidth > 768,
                zoomControl: true,
                attributionControl: true,
              });

              (window as any).leafletMapInstance = map;

              // Add tile layer
              Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                maxZoom: 19,
                minZoom: 1,
              }).addTo(map);

              // Add markers for each kecamatan
              kecamatanData.forEach((data) => {
                // Use default coordinates if not available
                const lat = data.latitude !== '0' ? parseFloat(data.latitude) : -6.97;
                const lng = data.longitude !== '0' ? parseFloat(data.longitude) : 107.63;

                const marker = Leaflet.circleMarker([lat, lng], {
                  radius: 12,
                  fillColor: '#3b82f6',
                  color: '#1e40af',
                  weight: 2,
                  opacity: 0.8,
                  fillOpacity: 0.7,
                });

                const popupContent = `
                  <div style="width: 280px; padding: 12px; font-family: system-ui, -apple-system, sans-serif;">
                    <h4 style="font-weight: bold; margin: 0 0 12px 0; color: #1f2937; font-size: 14px;">${data.kecamatan}</h4>
                    <hr style="margin: 0 0 12px 0; border: none; border-top: 1px solid #e5e7eb;">
                    
                    <div style="margin-bottom: 12px;">
                      <p style="margin: 6px 0; font-size: 13px; color: #374151;"><strong>Atlet:</strong> <span style="float: right;">${data.totalAtlet}</span></p>
                      <p style="margin: 6px 0; font-size: 13px; color: #374151;"><strong>Pelatih:</strong> <span style="float: right;">${data.totalPelatih}</span></p>
                      <p style="margin: 6px 0; font-size: 13px; color: #374151;"><strong>Wasit/Juri:</strong> <span style="float: right;">${data.totalWasit}</span></p>
                    </div>
                    
                    <hr style="margin: 12px 0; border: none; border-top: 1px solid #e5e7eb;">
                    
                    <div style="margin-top: 12px;">
                      <p style="font-weight: bold; margin: 0 0 10px 0; font-size: 13px; color: #1f2937;">Medali:</p>
                      <div style="display: flex; gap: 12px; justify-content: space-between;">
                        <div style="text-align: center; flex: 1;">
                          <div style="width: 28px; height: 28px; background: #fbbf24; border-radius: 4px; margin: 0 auto 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"></div>
                          <span style="font-size: 13px; font-weight: bold; color: #1f2937;">${data.emasCount}</span>
                          <p style="font-size: 11px; margin: 4px 0 0 0; color: #6b7280;">Emas</p>
                        </div>
                        <div style="text-align: center; flex: 1;">
                          <div style="width: 28px; height: 28px; background: #d1d5db; border-radius: 4px; margin: 0 auto 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"></div>
                          <span style="font-size: 13px; font-weight: bold; color: #1f2937;">${data.perakCount}</span>
                          <p style="font-size: 11px; margin: 4px 0 0 0; color: #6b7280;">Perak</p>
                        </div>
                        <div style="text-align: center; flex: 1;">
                          <div style="width: 28px; height: 28px; background: #cd7f32; border-radius: 4px; margin: 0 auto 6px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);"></div>
                          <span style="font-size: 13px; font-weight: bold; color: #1f2937;">${data.perungguCount}</span>
                          <p style="font-size: 11px; margin: 4px 0 0 0; color: #6b7280;">Perunggu</p>
                        </div>
                      </div>
                    </div>
                  </div>
                `;

                marker.bindPopup(popupContent, {
                  maxWidth: 300,
                  minWidth: 280,
                });

                marker.on('mouseover', function () {
                  this.openPopup();
                });
                marker.on('mouseout', function () {
                  this.closePopup();
                });

                marker.addTo(map);
              });

              setMapReady(true);
            } catch (error) {
              console.error('Error initializing map:', error);
            }
          }, 100);

          return () => clearTimeout(timer);
        }
      } catch (error) {
        console.error('Error loading Leaflet:', error);
      }
    };

    initMap();
  }, [kecamatanData, loading]);

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="w-full p-6 text-center text-red-600">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div id="kecamatan-map-container" className="w-full" style={{ height: '665px' }} />
    </div>
  );
}
