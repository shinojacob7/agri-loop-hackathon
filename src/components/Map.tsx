'use client'

import { useEffect, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

// Fix Leaflet's default icon path issues with webpack/Next.js
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// A green icon for the farmer's own location
const farmerIcon = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  resources: any[];
  centerLat: number;
  centerLon: number;
}

// Component to dynamically set map center
function MapUpdater({ centerLat, centerLon }: { centerLat: number, centerLon: number }) {
  const map = useMap()
  useEffect(() => {
    map.setView([centerLat, centerLon], map.getZoom())
  }, [centerLat, centerLon, map])
  return null
}

export default function Map({ resources, centerLat, centerLon }: MapProps) {
  // Prevent SSR rendering issues with Leaflet
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>

  return (
    <MapContainer 
      center={[centerLat, centerLon]} 
      zoom={12} 
      style={{ height: '100%', width: '100%', borderRadius: '0.75rem', zIndex: 10 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      <MapUpdater centerLat={centerLat} centerLon={centerLon} />

      {/* Farmer Location */}
      <Marker position={[centerLat, centerLon]} icon={farmerIcon}>
        <Popup>
          <div className="text-center">
            <strong>Your Location</strong>
          </div>
        </Popup>
      </Marker>

      {/* Resource Locations */}
      {resources.map((res) => (
        <Marker key={res.id} position={[res.latitude, res.longitude]} icon={icon}>
          <Popup>
            <div className="p-1">
              <h3 className="font-bold text-gray-900">{res.quantity} {res.unit} {res.resource_type}</h3>
              <p className="text-sm text-gray-600 mb-2">Provider: {res.provider_name || 'Green Valley Canteen'}</p>
              
              <div className="flex gap-2">
                <span className={`px-2 py-1 text-xs font-bold rounded ${
                  res.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                }`}>
                  {res.status || 'AVAILABLE'}
                </span>
                <span className="text-xs text-gray-500 flex items-center">
                  ~{res.distance_km || 4.2} km away
                </span>
              </div>
              
              <div className="mt-3">
                <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white text-sm py-1.5 rounded transition-colors">
                  View Resource
                </button>
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}
