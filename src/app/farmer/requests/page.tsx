'use client'

import { useState, useEffect } from 'react'
import { MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

export default function FarmerRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRequests() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        // Assuming we join with resources table and users table to get provider name
        const { data } = await supabase
          .from('requests')
          .select(`
            id,
            status,
            requested_quantity,
            message,
            created_at,
            resources(resource_type, unit, longitude, latitude),
            provider:provider_id(full_name)
          `)
          .eq('farmer_id', user.id)
          .order('created_at', { ascending: false })
          
        if (data) {
          setRequests(data)
        }
      }
      setLoading(false)
    }
    fetchRequests()
  }, [])

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading requests...</div>
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8 flex flex-col md:flex-row justify-between md:items-end">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Requests</h1>
          <p className="text-gray-600 mt-1">Track the status of organic resources you've requested.</p>
        </div>
        <Link 
          href="/farmer/search" 
          className="mt-4 md:mt-0 text-emerald-600 font-medium hover:text-emerald-700 underline"
        >
          Find more resources
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {requests.map(req => {
          const status = req.status.toUpperCase()
          return (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 flex flex-col overflow-hidden transition-all hover:shadow-md">
              
              {/* Header Banner Based on Status */}
              <div className={`px-5 py-3 border-b flex justify-between items-center ${
                status === 'PENDING' ? 'bg-amber-50 border-amber-100' :
                status === 'ACCEPTED' ? 'bg-emerald-50 border-emerald-100' :
                'bg-red-50 border-red-100'
              }`}>
                <div className="flex items-center gap-2">
                  {status === 'PENDING' && <Clock className="w-5 h-5 text-amber-600" />}
                  {status === 'ACCEPTED' && <CheckCircle className="w-5 h-5 text-emerald-600" />}
                  {status === 'REJECTED' && <XCircle className="w-5 h-5 text-red-600" />}
                  <span className={`font-bold text-sm ${
                    status === 'PENDING' ? 'text-amber-800' :
                    status === 'ACCEPTED' ? 'text-emerald-800' :
                    'text-red-800'
                  }`}>
                    {status === 'ACCEPTED' ? 'MATCH CONFIRMED' : status}
                  </span>
                </div>
                <span className="text-xs text-gray-500 font-medium">
                  {new Date(req.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Body */}
              <div className="p-5 flex-grow">
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  {req.requested_quantity} {req.resources?.unit} {req.resources?.resource_type}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Provider: <span className="font-medium text-gray-900">{req.provider?.full_name || 'AgriLoop Provider'}</span>
                </p>

                <div className="space-y-2 mb-4">
                  {req.message && (
                    <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-md italic border border-gray-100 mt-2">
                      "{req.message}"
                    </div>
                  )}
                </div>
              </div>

              {/* Footer Action */}
              <div className="p-5 pt-0 mt-auto">
                {status === 'ACCEPTED' && (
                  <button className="w-full py-2.5 bg-emerald-600 text-white rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm">
                    View Pickup Details
                  </button>
                )}
                {status === 'PENDING' && (
                  <button className="w-full py-2.5 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors">
                    Cancel Request
                  </button>
                )}
                {status === 'REJECTED' && (
                  <button className="w-full py-2.5 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors">
                    Remove
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>
      {requests.length === 0 && !loading && (
        <div className="text-center p-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">You haven't made any requests yet.</p>
        </div>
      )}
    </div>
  )
}
