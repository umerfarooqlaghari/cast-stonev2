/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Search, MapPin, Phone, Mail, Navigation } from 'lucide-react';
import { wholesaleBuyerLocationService, wholesaleBuyerService } from '@/services';
import { WholesaleBuyerLocation as WBLocation, WholesaleBuyer } from '@/services/types/entities';

// Dynamically import the map component to avoid SSR issues
const RetailLocatorMap = dynamic(() => import('../../components/retail-locator/RetailLocatorMap'), {
  ssr: false,
  loading: () => <div className="h-96 bg-gray-100 animate-pulse rounded-lg flex items-center justify-center">Loading map...</div>
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

export default function RetailLocatorPage() {
  const [locations, setLocations] = useState<WholesaleBuyerLocation[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchLocation, setSearchLocation] = useState('');
  const [nearestStores, setNearestStores] = useState<NearestStore[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // Fetch wholesale buyer locations
  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);

      // Fetch all wholesale buyer locations
      const locationsResponse = await wholesaleBuyerLocationService.get.getAll();

      if (!locationsResponse.success || !locationsResponse.data) {
        throw new Error('Failed to fetch locations');
      }

      // Fetch all wholesale buyers to get their details
      const buyersResponse = await wholesaleBuyerService.get.getAll();

      if (!buyersResponse.success || !buyersResponse.data) {
        throw new Error('Failed to fetch wholesale buyers');
      }

      // Create a map of buyer ID to buyer details
      const buyersMap = new Map<number, WholesaleBuyer>();
      buyersResponse.data.forEach((buyer: WholesaleBuyer) => {
        buyersMap.set(buyer.id, buyer);
      });

      // Combine location data with buyer details
      const combinedLocations: WholesaleBuyerLocation[] = locationsResponse.data
        .map((location: WBLocation) => {
          const buyer = buyersMap.get(location.wholesaleBuyerId);
          if (!buyer) return null;

          return {
            id: location.id,
            companyName: buyer.companyName || 'N/A',
            businessType: buyer.businessType || 'N/A',
            city: buyer.city || 'N/A',
            state: buyer.state || 'N/A',
            country: buyer.country || 'N/A',
            latitude: location.latitude,
            longitude: location.longitude,
            businessAddress: location.address || buyer.businessAddress || 'N/A',
            phone: buyer.phone || 'N/A',
            email: buyer.email || 'N/A',
          };
        })
        .filter((loc): loc is WholesaleBuyerLocation => loc !== null);

      setLocations(combinedLocations);
      setError(null);
    } catch (err) {
      setError('Failed to load store locations');
      console.error('Error fetching locations:', err);
    } finally {
      setLoading(false);
    }
  };

  // Get user's current location
  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    setError(null);

    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      setIsGettingLocation(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        setUserLocation({ lat: userLat, lng: userLng });
        findNearestStores(userLat, userLng);
        setIsGettingLocation(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        setError('Unable to get your location. Please enter your coordinates manually.');
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  };

  // Calculate distance between two points using Haversine formula
  const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  // Find nearest stores to user location
  const findNearestStores = (userLat: number, userLng: number) => {
    const storesWithDistance = locations
      .filter(store => store.latitude && store.longitude)
      .map(store => ({
        store,
        distance: getDistance(userLat, userLng, store.latitude!, store.longitude!)
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 5); // Get top 5 nearest stores

    setNearestStores(storesWithDistance);
  };

  // Handle manual location search
  const handleLocationSearch = () => {
    const coords = searchLocation.trim();
    const coordsRegex = /^(-?\d+\.?\d*),\s*(-?\d+\.?\d*)$/;
    const match = coords.match(coordsRegex);

    if (match) {
      const lat = parseFloat(match[1]);
      const lng = parseFloat(match[2]);
      
      if (lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180) {
        setUserLocation({ lat, lng });
        findNearestStores(lat, lng);
        setError(null);
      } else {
        setError('Please enter valid coordinates (latitude: -90 to 90, longitude: -180 to 180)');
      }
    } else {
      setError('Please enter coordinates in the format: latitude, longitude (e.g., 40.7128, -74.0060)');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading store locations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2 mt-16"> </h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Locate our approved wholesale buyers near you. Enter your location to find the closest stores.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Sidebar - Search and Results */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Search className="h-5 w-5 mr-2" />
                Find a location near you
              </h2>
              
              {/* Location Input */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                    Enter your coordinates
                  </label>
                  <input
                    type="text"
                    id="location"
                    value={searchLocation}
                    onChange={(e) => setSearchLocation(e.target.value)}
                    placeholder="40.7128, -74.0060"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyDown={(e) => e.key === 'Enter' && handleLocationSearch()}
                  />
                </div>
                
                <div className="flex space-x-2">
                  <button
                    onClick={handleLocationSearch}
                    className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </button>
                  
                  <button
                    onClick={getCurrentLocation}
                    disabled={isGettingLocation}
                    className="flex-1 bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors flex items-center justify-center disabled:opacity-50"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    {isGettingLocation ? 'Getting...' : 'Use My Location'}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Nearest Stores List */}
            {nearestStores.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Nearest Locations ({nearestStores.length})
                </h3>
                <div className="space-y-4">
                  {nearestStores.map(({ store, distance }, index) => (
                    <div key={store.id} className="border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h4 className="font-medium text-gray-900">{store.companyName}</h4>
                          <p className="text-sm text-gray-600">{store.businessType}</p>
                          <div className="mt-2 space-y-1">
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              {store.businessAddress}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Phone className="h-4 w-4 mr-1" />
                              {store.phone}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Mail className="h-4 w-4 mr-1" />
                              {store.email}
                            </div>
                          </div>
                        </div>
                        <div className="ml-4 text-right">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {distance.toFixed(1)} km
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Locations Count */}
            <div className="bg-white rounded-lg shadow-sm border p-6 mt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">All locations</h3>
              <p className="text-gray-600">
                {locations.length} {locations.length === 1 ? 'location' : 'locations'} available
              </p>
            </div>
          </div>

          {/* Right Side - Map */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
              <RetailLocatorMap
                locations={locations}
                userLocation={userLocation}
                nearestStores={nearestStores}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
