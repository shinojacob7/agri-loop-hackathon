import { Check, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import Link from 'next/link'

export default async function ProviderRequestsPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: requests } = await supabase
    .from('requests')
    .select(`
      *,
      resources(*),
      farmer:farmer_id(full_name)
    `)
    .eq('provider_id', user?.id)
    .order('created_at', { ascending: false })

  async function acceptRequest(formData: FormData) {
    'use server'
    const requestId = formData.get('request_id') as string
    const resourceId = formData.get('resource_id') as string
    const supabaseServer = createClient()
    await supabaseServer.from('requests').update({ status: 'accepted' }).eq('id', requestId)
    await supabaseServer.from('resources').update({ status: 'matched' }).eq('id', resourceId)
    revalidatePath('/provider/requests')
    revalidatePath('/provider/dashboard')
    revalidatePath('/farmer/dashboard')
    revalidatePath('/farmer/requests')
    revalidatePath('/provider/resources')
  }

  async function rejectRequest(formData: FormData) {
    'use server'
    const requestId = formData.get('request_id') as string
    const declineReason = formData.get('decline_reason') as string
    // When rejected, resource stays 'available'
    const supabaseServer = createClient()
    
    const { data } = await supabaseServer.from('requests').select('message').eq('id', requestId).single()
    const newMsg = (data?.message || '') + (declineReason ? `\n\n[Provider declined]: ${declineReason}` : '\n\n[Provider declined without providing a reason]')
    
    await supabaseServer.from('requests').update({ status: 'rejected', message: newMsg }).eq('id', requestId)
    revalidatePath('/provider/requests')
    revalidatePath('/provider/dashboard')
    revalidatePath('/farmer/dashboard')
    revalidatePath('/farmer/requests')
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Incoming Requests</h1>
        <p className="text-gray-600 mt-1">Manage requests from farmers for your resources.</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <ul className="divide-y divide-gray-100">
          {requests && requests.length > 0 ? requests.map((req: any) => (
            <li key={req.id} className="p-6 hover:bg-gray-50 transition-colors">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                    <span className="text-emerald-700 font-bold">
                      {req.farmer?.full_name ? req.farmer.full_name.charAt(0) : 'F'}
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{req.farmer?.full_name || 'A Farmer'}</h3>
                      <span className={`inline-flex px-2 py-0.5 rounded text-xs font-medium border ${
                        req.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                        req.status === 'accepted' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                    <p className="text-gray-600 font-medium mb-1">
                      Requested: {req.resources?.title || 'Resource'}
                    </p>
                    <p className="text-gray-500 text-sm mb-2">
                      "{req.message}"
                    </p>
                    <div className="text-xs text-gray-400">
                      {new Date(req.created_at).toLocaleDateString()} at {new Date(req.created_at).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
                
                {req.status === 'pending' && (
                  <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto mt-4 sm:mt-0">
                    <form action={rejectRequest} className="flex flex-col gap-2 w-full sm:w-auto">
                      <input type="hidden" name="request_id" value={req.id} />
                      <input 
                        type="text" 
                        name="decline_reason" 
                        placeholder="Reason for declining..." 
                        required
                        className="text-sm px-3 py-2 border border-gray-300 bg-white text-gray-900 placeholder-gray-400 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 w-full"
                      />
                      <button 
                        type="submit"
                        className="w-full inline-flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        <X className="w-4 h-4 mr-2 text-red-400" />
                        Decline
                      </button>
                    </form>
                    <form action={acceptRequest} className="w-full sm:w-auto sm:self-end">
                      <input type="hidden" name="request_id" value={req.id} />
                      <input type="hidden" name="resource_id" value={req.resource_id} />
                      <button 
                        type="submit"
                        className="w-full h-[38px] inline-flex justify-center items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                      >
                        <Check className="w-4 h-4 mr-2" />
                        Accept
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </li>
          )) : (
            <li className="p-12 text-center text-gray-500">
              No requests found.
            </li>
          )}
        </ul>
      </div>
    </div>
  )
}
