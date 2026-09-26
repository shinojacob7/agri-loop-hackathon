'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Filter } from 'lucide-react'

// Dynamically import the map to prevent SSR errors with window/document
const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
})

// Demo Data
const DEMO_FARMER_LAT = 28.6139;
const DEMO_FARMER_LON = 77.2090;

const DEMO_MAP_RESOURCES = [
  {
    id: '1',
    resource_type: 'Vegetable Waste',
    quantity: 500,
    unit: 'kg',
    latitude: 28.6200, 
    longitude: 77.2100,
    status: 'AVAILABLE',
    distance_km: 1.2
  },
  {
    id: '2',
    resource_type: 'Vegetable Waste',
    quantity: 100,
    unit: 'kg',
    latitude: 28.7000, 
    longitude: 77.2500,
    status: 'AVAILABLE',
    distance_km: 10.5
  },
  {
    id: '3',
    resource_type: 'Cow Dung',
    quantity: 300,
    unit: 'kg',
    latitude: 28.6150, 
    longitude: 77.2110,
    status: 'RESERVED',
    distance_km: 0.5
  }
]

export default function MapPage() {
  const [filter, setFilter] = useState('ALL')
  
  const displayedResources = filter === 'ALL' 
    ? DEMO_MAP_RESOURCES 
    : DEMO_MAP_RESOURCES.filter(r => r.status === filter)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Map Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-emerald-600 w-6 h-6" />
            Resource Map
          </h1>
          <p className="text-sm text-gray-500">Explore available resources in your area.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            className="text-sm border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="RESERVED">Reserved / Confirmed</option>
          </select>
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-grow p-4 md:p-6 bg-gray-50">
        <div className="h-full w-full rounded-xl shadow-sm border border-gray-200 overflow-hidden relative z-10">
          <MapComponent 
            resources={displayedResources} 
            centerLat={DEMO_FARMER_LAT} 
            centerLon={DEMO_FARMER_LON} 
          />
        </div>
      </div>
    </div>
  )
}
