'use client'

import { useState, useEffect } from 'react'
import { Check, X, User } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

export default function ProviderRequestsPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [pageLoading, setPageLoading] = useState(true)
  const supabase = createClient()

  useEffect(() => {
    async function fetchRequests() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('requests')
          .select(`
            id,
            status,
            requested_quantity,
            created_at,
            resource_id,
            resources(resource_type, unit),
            farmer:farmer_id(full_name)
          `)
          .eq('provider_id', user.id)
          .order('created_at', { ascending: false })
          
        if (data) setRequests(data)
      }
      setPageLoading(false)
    }
    fetchRequests()
  }, [])

  const handleAccept = async (reqId: string, resourceId: string) => {
    setLoadingId(reqId)
    await supabase.from('requests').update({ status: 'accepted' }).eq('id', reqId)
    await supabase.from('resources').update({ status: 'reserved' }).eq('id', resourceId)
    
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'accepted' } : r))
    setLoadingId(null)
  }

  const handleReject = async (reqId: string, resourceId: string) => {
    setLoadingId(reqId)
    await supabase.from('requests').update({ status: 'rejected' }).eq('id', reqId)
    await supabase.from('resources').update({ status: 'available' }).eq('id', resourceId)
    
    setRequests(prev => prev.map(r => r.id === reqId ? { ...r, status: 'rejected' } : r))
    setLoadingId(null)
  }

  if (pageLoading) return <div className="p-8 text-center text-gray-500">Loading incoming requests...</div>

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Incoming Requests</h1>
        <p className="text-gray-600 mt-1">Review and manage requests from farmers for your resources.</p>
      </div>

      <div className="space-y-6">
        {requests.length === 0 && (
          <div className="p-8 text-center bg-gray-50 border border-dashed rounded-xl">
            <p className="text-gray-500">No incoming requests right now.</p>
          </div>
        )}
        
        {requests.map(req => {
          const status = req.status.toUpperCase()
          return (
            <div key={req.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col md:flex-row justify-between md:items-center gap-6 transition-all hover:shadow-md">
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                    status === 'PENDING' ? 'bg-amber-100 text-amber-800' :
                    status === 'ACCEPTED' ? 'bg-emerald-100 text-emerald-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {status}
                  </span>
                  <span className="text-sm text-gray-500">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-bold text-gray-900">
                  {req.requested_quantity} {req.resources?.unit} of {req.resources?.resource_type}
                </h3>
                
                <div className="flex items-center gap-2 mt-3 text-gray-600">
                  <div className="bg-gray-100 p-1.5 rounded-full">
                    <User className="w-4 h-4 text-gray-500" />
                  </div>
                  <span className="font-medium text-gray-900">{req.farmer?.full_name || 'AgriLoop Farmer'}</span>
                </div>
              </div>

              {status === 'PENDING' && (
                <div className="flex gap-3 w-full md:w-auto">
                  <button 
                    onClick={() => handleReject(req.id, req.resource_id)}
                    disabled={loadingId === req.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border-2 border-red-100 text-red-700 bg-red-50 hover:bg-red-100 rounded-lg font-semibold transition-colors disabled:opacity-50"
                  >
                    <X className="w-4 h-4" />
                    Reject
                  </button>
                  <button 
                    onClick={() => handleAccept(req.id, req.resource_id)}
                    disabled={loadingId === req.id}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-emerald-600 text-white hover:bg-emerald-700 rounded-lg font-semibold shadow-sm transition-colors disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    {loadingId === req.id ? 'Processing...' : 'Accept'}
                  </button>
                </div>
              )}
              
              {status === 'ACCEPTED' && (
                <div className="w-full md:w-auto text-center md:text-right">
                  <p className="text-emerald-700 font-semibold mb-1">Match Confirmed!</p>
                  <button className="text-sm text-emerald-600 hover:underline">View Contact Details</button>
                </div>
              )}
              
              {status === 'REJECTED' && (
                <div className="w-full md:w-auto text-center md:text-right text-gray-500 font-medium">
                  Request Declined
                </div>
              )}
              
            </div>
          )
        })}
      </div>
    </div>
  )
}
