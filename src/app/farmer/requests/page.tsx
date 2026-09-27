import { MapPin, Clock, CheckCircle, XCircle } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'

export default async function FarmerRequestsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: requests } = await supabase
    .from('requests')
    .select(`
      id,
      status,
      requested_quantity,
      message,
      created_at,
      resources(resource_type, unit, longitude, latitude, title),
      provider:provider_id(full_name)
    `)
    .eq('farmer_id', user?.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Requests</h1>
        <p className="text-gray-600 mt-1">Track the status of your resource requests.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-100">
          {requests && requests.length > 0 ? requests.map((req: any) => (
            <div key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col md:flex-row gap-6 justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-900">
                      {req.resources?.title || req.resources?.resource_type}
                    </h3>
                    <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${
                      req.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                      req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                      'bg-red-50 text-red-700 border-red-200'
                    }`}>
                      {req.status === 'pending' && <Clock className="w-3.5 h-3.5 mr-1" />}
                      {req.status === 'accepted' && <CheckCircle className="w-3.5 h-3.5 mr-1" />}
                      {req.status === 'rejected' && <XCircle className="w-3.5 h-3.5 mr-1" />}
                      {req.status.toUpperCase()}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 mb-4">Provider: <span className="font-medium text-gray-900">{req.provider?.full_name || 'AgriLoop Provider'}</span></p>
                  
                  <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                    <p className="text-sm text-gray-700 italic">"{req.message}"</p>
                  </div>
                </div>

                <div className="flex flex-col justify-between items-start md:items-end min-w-[200px]">
                  <div className="text-sm text-gray-500 mb-4 md:mb-0">
                    Requested on {new Date(req.created_at).toLocaleDateString()}
                  </div>
                  
                  {req.status === 'accepted' && (
                    <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100 w-full md:w-auto">
                      <p className="text-sm font-medium text-emerald-800 mb-2">Pick-up Instructions</p>
                      <p className="text-xs text-emerald-600">Contact the provider to arrange collection.</p>
                    </div>
                  )}
                  {req.status === 'rejected' && (
                    <div className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">
                      <p className="font-medium">The provider declined this request.</p>
                      {req.message && req.message.includes('[Provider declined]') && (
                        <p className="mt-1 opacity-90">{req.message.split('\n\n').pop()}</p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )) : (
            <div className="p-12 text-center">
              <h3 className="text-lg font-medium text-gray-900 mb-2">No requests yet</h3>
              <p className="text-gray-500 mb-6">You haven't requested any resources from providers.</p>
              <Link 
                href="/farmer/search"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700"
              >
                Find Resources
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
