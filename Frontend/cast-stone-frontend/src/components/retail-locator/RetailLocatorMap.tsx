/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in Leaflet with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface WholesaleBuyerLocation {
  id: number;
  companyName: string;
  businessType: string;
  city: string;
  state: string;
  country: string;
  latitude: number;
  longitude: number;
  businessAddress: string;
  phone: string;
  email: string;
}

interface NearestStore {
  store: WholesaleBuyerLocation;
  distance: number;
}

interface RetailLocatorMapProps {
  locations: WholesaleBuyerLocation[];
  userLocation: { lat: number; lng: number } | null;
  nearestStores: NearestStore[];
}

const RetailLocatorMap: React.FC<RetailLocatorMapProps> = ({
  locations,
  userLocation,
  nearestStores
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.Marker[]>([]);
  const userMarkerRef = useRef<L.Marker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map centered on the US
    const map = L.map(mapRef.current).setView([39.8283, -98.5795], 4);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update store markers
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => {
      mapInstanceRef.current?.removeLayer(marker);
    });
    markersRef.current = [];

    // Create custom icons
    const storeIcon = L.divIcon({
      html: `
        <div style="
          background-color: #dc2626;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background-color: white;
            width: 8px;
            height: 8px;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    const nearestStoreIcon = L.divIcon({
      html: `
        <div style="
          background-color: #16a34a;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          border: 3px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <div style="
            background-color: white;
            width: 10px;
            height: 10px;
            border-radius: 50%;
          "></div>
        </div>
      `,
      className: 'custom-div-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    // Add store markers
    locations.forEach(location => {
      if (location.latitude && location.longitude) {
        const isNearest = nearestStores.some(ns => ns.store.id === location.id);
        const icon = isNearest ? nearestStoreIcon : storeIcon;
        
        const marker = L.marker([location.latitude, location.longitude], { icon })
          .addTo(mapInstanceRef.current!)
          .bindPopup(`
            <div style="min-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold; color: #1f2937;">
                ${location.companyName}
              </h3>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #6b7280;">
                ${location.businessType}
              </p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151;">
                📍 ${location.businessAddress}
              </p>
              <p style="margin: 0 0 4px 0; font-size: 14px; color: #374151;">
                📞 ${location.phone}
              </p>
              <p style="margin: 0; font-size: 14px; color: #374151;">
                ✉️ ${location.email}
              </p>
              ${isNearest ? `
                <div style="
                  margin-top: 8px;
                  padding: 4px 8px;
                  background-color: #dcfce7;
                  border: 1px solid #16a34a;
                  border-radius: 4px;
                  font-size: 12px;
                  color: #16a34a;
                  font-weight: bold;
                ">
                  Nearest Location
                </div>
              ` : ''}
            </div>
          `);

        markersRef.current.push(marker);
      }
    });
  }, [locations, nearestStores]);

  // Update user location marker
  useEffect(() => {
    if (!mapInstanceRef.current) return;

    // Remove existing user marker
    if (userMarkerRef.current) {
      mapInstanceRef.current.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }

    if (userLocation) {
      // Create user location icon
      const userIcon = L.divIcon({
        html: `
          <div style="
            background-color: #2563eb;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            border: 3px solid white;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            position: relative;
          ">
            <div style="
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              background-color: white;
              width: 6px;
              height: 6px;
              border-radius: 50%;
            "></div>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      userMarkerRef.current = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon })
        .addTo(mapInstanceRef.current)
        .bindPopup(`
          <div style="text-align: center;">
            <h3 style="margin: 0 0 4px 0; font-size: 14px; font-weight: bold; color: #2563eb;">
              Your Location
            </h3>
            <p style="margin: 0; font-size: 12px; color: #6b7280;">
              ${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}
            </p>
          </div>
        `);

      // Center map on user location if there are nearby stores
     if (nearestStores.length > 0) {
  const bounds = L.latLngBounds([
    [userLocation.lat, userLocation.lng] as [number, number],
    ...nearestStores.map(
      ns => [ns.store.latitude!, ns.store.longitude!] as [number, number]
    )
  ]);
  mapInstanceRef.current.fitBounds(bounds, { padding: [20, 20] });
} else {
  mapInstanceRef.current.setView(
    [userLocation.lat, userLocation.lng] as [number, number],
    10
  );
}
    }
  }, [userLocation, nearestStores]);

  return (
    <div className="relative">
      <div 
        ref={mapRef} 
        className="w-full h-96 lg:h-[600px] rounded-lg"
        style={{ minHeight: '400px' }}
      />
      
      {/* Map Legend */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 z-[1000]">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Legend</h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-xs text-gray-600">Store Locations</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 bg-green-600 rounded-full border-2 border-white shadow-sm"></div>
            <span className="text-xs text-gray-600">Nearest Stores</span>
          </div>
          {userLocation && (
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-600 rounded-full border-2 border-white shadow-sm"></div>
              <span className="text-xs text-gray-600">Your Location</span>
            </div>
          )}
        </div>
      </div>

      {/* Instructions */}
      {locations.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-gray-400 mb-2">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No store locations available</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RetailLocatorMap;
