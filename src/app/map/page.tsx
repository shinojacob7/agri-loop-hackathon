'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { MapPin, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

// Dynamically import the map to prevent SSR errors with window/document
const MapComponent = dynamic(() => import('@/components/Map'), { 
  ssr: false,
  loading: () => <div className="h-full w-full bg-gray-100 animate-pulse rounded-xl flex items-center justify-center text-gray-400">Loading Map...</div>
})

const DEMO_FARMER_LAT = 9.8497;
const DEMO_FARMER_LON = 76.9408;

export default function MapPage() {
  const [filter, setFilter] = useState('ALL')
  const [resources, setResources] = useState<any[]>([])
  const supabase = createClient()
  
  useEffect(() => {
    async function loadResources() {
      const { data, error } = await supabase.from('resources').select('*')
      if (data) {
        setResources(data)
      }
    }
    loadResources()
  }, [])

  const displayedResources = filter === 'ALL' 
    ? resources 
    : resources.filter(r => r.status && r.status.toUpperCase() === filter)

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Map Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-20">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="text-emerald-600 w-6 h-6" />
            Live Resource Map
          </h1>
          <p className="text-sm text-gray-500">Explore available resources in your area.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-400" />
          <select 
            className="text-sm bg-white text-gray-900 border-gray-300 rounded-md shadow-sm focus:border-emerald-500 focus:ring-emerald-500"
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
